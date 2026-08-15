# Diseño del punto 4.5 — perfil de modelo de embeddings

## Problema

Los prefijos `passage: ` y `query: ` se aplican **siempre**, en dos funciones
de módulo de `src/infrastructure/embeddings/e5-embedding-generator.ts`:

```ts
function passageInputs(texts: readonly string[]): readonly string[] {
  return Object.freeze(texts.map((text) => `passage: ${text}`));
}

function queryInput(text: string): string {
  return `query: ${text}`;
}
```

Son específicos de la familia E5. Con MiniLM, BGE o Jina no son neutros: el
modelo embebe literalmente las palabras "passage" y "query" como contenido,
degradando la calidad **sin producir ningún error**. Nada falla, nada avisa;
sólo los resultados empeoran. El arnés de benchmarks ya lo contempla con un
flag `e5Prefixes: boolean` en su `ModelDefinition`
(`benchmarks/embeddings/run.ts:21`); el producto no.

`docs/install-design.md` → "Nota: qué haría falta para soportar otro modelo"
lo dejó registrado como el trabajo real de "modelo configurable", por encima
de la dimensión —que ya es genérica de punta a punta— y de la reindexación al
cambiar de modelo —que ya funciona vía `unchanged()` en `sync-source.ts`.

El usuario lo fijó como frente número 1 el 14 de agosto de 2026.

## Alcance

**Dentro:** convertir la identidad del modelo y su política de prefijos en un
dato explícito y único —un perfil— que el adaptador de embeddings y el
instalador consumen en vez de hardcodear.

**Fuera:** cambiar el modelo activo, agregar un segundo modelo al catálogo,
exponer selección de modelo por CLI o por variable de entorno, y hacer
convivir dos modelos en la misma base. El objetivo es que el producto **sea
capaz** de otro modelo sin degradarlo en silencio, no cambiarlo. Cambiar
modelo o dimensión sigue requiriendo aprobación explícita según los
invariantes del proyecto, y hoy dispararía una reindexación completa.

Este punto **no debe reindexar nada**. Al terminar, una biblioteca ya
sincronizada debe seguir respondiendo `no_changes` en el `sync` siguiente.
Es el criterio de aceptación más importante del punto y la restricción que
determina la Decisión 3.

## Estado actual: dónde vive hoy la identidad del modelo

Está dispersa en tres archivos, con `"Xenova/multilingual-e5-small"` escrito
literalmente en tres lugares distintos:

| Archivo                                | Qué define                                                                        |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| `embeddings/e5-embedding-generator.ts` | `modelDescriptor`, `modelRepository`, `modelRevision`, `modelDtype`, los prefijos |
| `embeddings/e5-model-installer.ts`     | `modelDirectory` (duplicado), importa las cuatro constantes de arriba             |
| `config/model-install-state.ts`        | `modelDirectory` (duplicado otra vez) y `requiredModelFiles`                      |

`requiredModelFiles` —`config.json`, `tokenizer.json`, `tokenizer_config.json`,
`onnx/model_quantized.onnx`— también es específica del modelo: Jina, por
ejemplo, necesita `model_file_name` distinto, como ya sabe el arnés de
benchmarks (`modelFileName?: string`).

## Decisión 1 — un `EmbeddingModelProfile` congelado, fuente única

Nace `src/infrastructure/embeddings/model-profile.ts`:

```ts
export interface EmbeddingInputPrefixes {
  readonly passage: string;
  readonly query: string;
}

export interface EmbeddingModelProfile {
  readonly key: string;
  readonly repository: string;
  readonly revision: string;
  readonly dtype: "q8";
  readonly dimensions: number;
  readonly maxInputTokens: number;
  /** `null` significa "este modelo no lleva prefijos", no "todavía no lo
   * decidí": es la diferencia entre E5 y MiniLM/BGE/Jina. */
  readonly inputPrefixes: EmbeddingInputPrefixes | null;
  /** Rutas relativas a `<modelsPath>/<repository>/` que el runtime necesita
   * para cargar el modelo localmente. */
  readonly requiredFiles: readonly string[];
}
```

El perfil activo, también en ese módulo:

```ts
export const activeModelProfile: EmbeddingModelProfile = Object.freeze({
  key: "e5-small",
  repository: "Xenova/multilingual-e5-small",
  revision: "main",
  dtype: "q8",
  dimensions: 384,
  maxInputTokens: 512,
  inputPrefixes: Object.freeze({ passage: "passage: ", query: "query: " }),
  requiredFiles: Object.freeze([
    "config.json",
    "tokenizer.json",
    "tokenizer_config.json",
    "onnx/model_quantized.onnx",
  ]),
});
```

Los prefijos incluyen su espacio final. Hoy están interpolados como
`` `passage: ${text}` ``, así que el espacio es parte del literal; guardarlo
dentro del valor evita que un perfil futuro que no quiera espacio tenga que
pelear con una concatenación fija.

`model-profile.ts` **no importa nada**: ni Transformers.js, ni `node:fs`, ni
otro módulo del proyecto. Es un dato.

## Decisión 2 — el directorio del modelo se deriva, no se declara

`modelDirectory` es exactamente `profile.repository`, y hoy está copiado en
dos archivos que pueden divergir del generador sin que nada lo note. Se
elimina de ambos: `e5-model-installer.ts` y `model-install-state.ts` reciben
el perfil y usan `profile.repository`.

`model-install-state.ts` deja de exportar la constante
`requiredModelFiles` como valor de módulo y pasa a recibir el perfil en sus
funciones (`measureModelFiles`, `readSourceState`, `describeModelState`,
`readModelState`). Es el archivo que más firmas cambia, y el que más
consumidores tiene (`doctor`, `models status`, el instalador), así que va en
su propio bloque.

## Decisión 3 — la política de prefijos participa de `version`, sin reindexar hoy

Esta es la decisión con más consecuencias y la única con riesgo real.

`unchanged()` en `sync-source.ts` incluye `key`, `version` y `dimensions` del
modelo activo en su criterio: cambiar cualquiera de los tres invalida todos
los paquetes y el `sync` siguiente reindexa. Hoy `version` es el literal
`"Xenova/multilingual-e5-small@main:q8"`.

El problema: si alguien apagara los prefijos sin cambiar de modelo, `key`,
`version` y `dimensions` quedarían idénticos, `unchanged()` diría "sin
cambios", y la biblioteca serviría vectores viejos con prefijo contra
consultas nuevas sin prefijo. Silencioso, y peor que el bug original.

Por eso `version` se **deriva** del perfil, y la política de prefijos
participa de la derivación:

```ts
export function modelVersion(profile: EmbeddingModelProfile): string {
  const base = `${profile.repository}@${profile.revision}:${profile.dtype}`;
  return profile.inputPrefixes === null ? `${base}+noprefix` : base;
}
```

Con el perfil activo esto produce, carácter por carácter,
`"Xenova/multilingual-e5-small@main:q8"` — el mismo string que hoy. **Ninguna
base existente se invalida y nada se reindexa.** Cualquier perfil con
política distinta produce un `version` distinto y dispara la reindexación
automática que ya existe.

Un test debe fijar esa igualdad literal como regresión: si alguien cambia el
formato de `modelVersion` sin querer, invalida en silencio todas las
bibliotecas instaladas.

La alternativa —agregar un campo `prefixPolicy` al `EmbeddingModelDescriptor`
del puerto y que `unchanged()` lo compare— se descarta: obliga a cambiar el
puerto de aplicación, la tabla `embeddings` no tiene columna donde
persistirlo, y `version` ya es exactamente el lugar donde el proyecto decidió
codificar "todo lo que hace incomparables dos vectores" (revisión y
cuantización ya viven ahí).

## Decisión 4 — el adaptador se renombra: deja de ser "E5"

`E5EmbeddingGenerator` que ya no sabe nada de E5 es un nombre que reintroduce
la confusión que este punto borra. Se renombra:

| Antes                                        | Después                                                          |
| -------------------------------------------- | ---------------------------------------------------------------- |
| `e5-embedding-generator.ts`                  | `transformers-embedding-generator.ts`                            |
| `E5EmbeddingGenerator`                       | `TransformersEmbeddingGenerator`                                 |
| `E5EmbeddingError` / `...ErrorCode`          | `EmbeddingAdapterError` / `...ErrorCode`                         |
| `E5EmbeddingSession` / `...Runtime`          | `EmbeddingSession` / `EmbeddingRuntime`                          |
| `E5RuntimeLoadOptions`                       | `EmbeddingRuntimeLoadOptions`                                    |
| `e5-model-installer.ts` / `E5ModelInstaller` | `transformers-model-installer.ts` / `TransformersModelInstaller` |
| `E5DownloadRuntime` / `E5DownloadOptions`    | `ModelDownloadRuntime` / `ModelDownloadOptions`                  |

Es mecánico pero toca siete archivos entre `src/` y `test/`, así que va en un
bloque propio, **después** de que el comportamiento ya esté correcto y
probado. Renombrar primero mezclaría ruido con sustancia en el mismo diff.

Los códigos de error **no cambian**: `MODEL_LOAD_FAILED`, `INPUT_TOO_LONG`,
`MODEL_SOURCE_INVALID` y el resto son contrato público documentado en
`cli-contract.md` y en `skill/SKILL.md`. Cambia el nombre de la clase que los
lleva, nunca el valor del código.

`npm run test:embedding:smoke` sigue llamándose igual: es el nombre del
script, no del adaptador.

## Decisión 5 — el conteo de tokens sigue midiendo el texto ya prefijado

El puerto ya lo exige explícitamente:

> Counts each text exactly as `embedDocuments` will submit it to the model,
> including document prefixes and special tokens owned by the adapter.

Con un perfil sin prefijos, `countTokens` mide el texto crudo, y el techo de
`maxInputTokens` deja de gastarse en el prefijo. Eso es correcto y deseado:
el límite existe para el texto que realmente entra al modelo. La consecuencia
—la frontera de fragmentación se corre— es exactamente el motivo por el que
un cambio de política de prefijos debe invalidar los vectores, que es lo que
garantiza la Decisión 3.

La regla que no se puede romper: **`countTokens` y `embedDocuments` deben
aplicar la misma política de prefijos**. Un test debe verificar que un perfil
sin prefijos produce el mismo texto en ambos caminos.

## Decisión 6 — el perfil se inyecta, con el activo como default

Todos los constructores aceptan `profile?: EmbeddingModelProfile` y caen en
`activeModelProfile`. Ni `create-application.ts` ni `run-cli.ts` pasan
perfil: siguen construyendo con `{ cacheDir }` como hoy.

El parámetro existe para los tests —poder ejercer un perfil sin prefijos sin
tocar el modelo real es justamente lo que hoy es imposible— no para exponer
una perilla de configuración. No se agrega variable de entorno ni flag de
CLI: elegir modelo requiere aprobación y reindexación, y no es este punto.

## Qué no cambia

- El modelo activo, su dimensión, su revisión y su cuantización.
- El `version` persistido en `embeddings` (Decisión 3).
- Los códigos de error públicos y la forma de los recibos JSON.
- `models/.install.json`: sigue guardando `key`/`version`/`dimensions`.
- El puerto `EmbeddingGenerator` y `EmbeddingModelDescriptor`.
- El esquema SQLite: cero migraciones.
- `cli-contract.md`: ningún comando ni flag nuevo.
- El arnés de benchmarks: `benchmarks/` queda intacto. Su `ModelDefinition`
  es la inspiración de este diseño, no un módulo a compartir; vive fuera del
  build de producto y depende de `tsx`.

## Riesgos

1. **Invalidar la biblioteca por accidente.** Si `modelVersion` no devuelve
   exactamente el literal actual, el `sync` siguiente reindexa 51 videos con
   el modelo real. Mitigación: test de regresión sobre el literal, y verificar
   `no_changes` en la validación real del bloque AD.
2. **Rename incompleto.** Un import viejo rompe el build, así que el riesgo
   es visible, no silencioso: `npm run check` lo captura.
3. **Desincronizar `countTokens` de `embedDocuments`.** Mitigación: test
   explícito con perfil sin prefijos (Decisión 5).

## Documentos a actualizar al implementar

- `docs/decisions.md`: sección nueva "Perfil de modelo y política de
  prefijos", cerrando la mitad pendiente de la nota de `install-design.md`.
- `docs/install-design.md`: la nota "qué haría falta para soportar otro
  modelo" pierde su segundo punto; tachar como se hizo con el hueco de
  degradación silenciosa, no borrarlo.
- `docs/build.md`: punto 4.5.
- `docs/agent-handoff.md`: estado operativo, inventario de `src/` y el orden
  de prioridad (el punto 1 pasa a cerrado; el 2 pasa a ser el siguiente).
- `skill/SKILL.md`: **sólo si cambia algo observable**. No cambia nada
  observable, así que la expectativa es no tocarla.

## Plan de bloques

| Bloque | Contenido                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------- |
| AA     | `model-profile.ts`: tipos, perfil activo, `modelVersion` y sus tests                                |
| AB     | El generador consume el perfil y aplica prefijos según política                                     |
| AC     | Estado de instalación e instalador consumen el perfil; se borran los duplicados de `modelDirectory` |
| AD     | Rename del adaptador, validación real y cierre de documentación                                     |

Orden de ejecución: AA → AB → AC → AD, estrictamente secuencial. AB y AC
dependen de AA; AD es un rename mecánico que sólo tiene sentido con el
comportamiento ya cerrado.
