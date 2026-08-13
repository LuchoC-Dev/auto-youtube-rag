# Diseño de instalación: hogar de usuario y `models install`

## Estado

Propuesto el 13 de agosto de 2026. Punto 4.2, posterior al MVP. Requiere
aprobación explícita antes de implementar. Checklist fino en
`docs/install-tasks.md`.

## Contexto

La corrida de verificación en frío del 13 de agosto (subagente sin contexto
previo, dos colecciones reales, ver `docs/decisions.md` → "Skill dividida")
falló en su primer `sync` con **63 issues `MODEL_LOAD_FAILED`**, uno por
video. El agente lo resolvió copiando a mano el caché del repositorio.

La causa inmediata es que el modelo se busca en `<cwd>/.cache/models`. La
causa real es más profunda y quedó expuesta al investigar cómo se instala el
producto: **nunca se decidió cómo se instala.** `package.json` declara
`"private": true` junto con un `bin`, ninguna especificación describe la
distribución, y el único instalador que existe es un script de benchmark.

La auditoría del código encontró **cuatro lugares distintos** que calculan la
ruta del caché de modelos, cada uno con su propia regla:

| Dónde                                  | Regla                           |
| -------------------------------------- | ------------------------------- |
| `benchmarks/embeddings/run.ts`         | `<raíz-del-repo>/.cache/models` |
| `src/main.ts`                          | `<cwd>/.cache/models`           |
| `e5-embedding-generator.ts` (fallback) | `<cwd>/.cache/models`           |
| `evals/run-seed-queries.ts` (default)  | `<cwd>/.cache/models`           |

El que descarga y los que leen sólo coinciden si se ejecuta parado
exactamente en la raíz del repositorio. Fuera de ahí —el caso normal— miran a
lugares distintos, sin ningún aviso. Los tres defaults duplicados de `cwd`
son además una trampa latente: cambiar uno solo deja los otros apuntando al
lugar viejo.

`npm run models:download` es además `tsx benchmarks/embeddings/run.ts
--download-only --models=e5-small`: el arnés de benchmarks, que conoce cuatro
modelos, filtrado a uno. `tsx` es `devDependency` y `benchmarks/` es material
de desarrollo, así que ese comando **no existe** para nadie que no tenga el
repositorio clonado. La skill se lo indicaba igual, y el subagente reportó la
contradicción.

## Decisión de producto que habilita este trabajo

El usuario confirmó el 13 de agosto que la CLI se distribuye como **comando
global tipo npm**, y descartó explícitamente un hook `postinstall` porque hay
instalaciones con scripts deshabilitados —la suya incluida—. Ese criterio ya
tenía precedente en el proyecto: `docs/benchmarks/sqlite-client.md` eligió
`node:sqlite` sobre `better-sqlite3` en parte porque "funciona con
instalaciones que deshabilitan scripts". Un `postinstall` de 129 MB
contradiría una decisión ya tomada.

## Alcance

Entra:

- un hogar único de usuario para base de datos y modelo;
- un resolutor de rutas compartido por todo lo que lea o escriba esas rutas,
  eliminando los tres defaults duplicados;
- `init` como instalador completo del sistema;
- un subcomando `models` de la CLI, con `install` y `status`;
- reutilización de un modelo ya presente en disco mediante `--from` explícito;
- un recibo de instalación que distingue "falta" de "está roto";
- preflight de requisitos por comando, una vez y no por video;
- `doctor` alineado con el hogar nuevo;
- documentación y skill actualizadas.

No entra:

- cambiar el modelo por defecto ni su dimensión (invariante: requiere
  aprobación propia);
- publicar el paquete en npm (`private: true` no se toca en este punto);
- guard de concurrencia de `sync` (pendiente independiente);
- `rebuild --confirm`.

## Decisión 1: un hogar, no dos ubicaciones sueltas

Hoy hay dos rutas independientes con dos variables independientes. Se
unifican bajo un solo directorio:

```text
~/.auto-youtube-rag/          ← AUTO_YOUTUBE_RAG_HOME
  index.sqlite                ← la biblioteca
  models/                     ← el modelo de embeddings
```

En Windows resuelve a `C:\Users\<usuario>\.auto-youtube-rag\`, vía
`os.homedir()`.

El directorio se llama `models/`, no `cache/`, y la variable pasa a llamarse
`AUTO_YOUTUBE_RAG_MODELS_DIR`. **El modelo dejó de ser un caché**: un caché es
dato derivado que se regenera solo, y el invariante del proyecto prohíbe
descargar implícitamente (el adaptador fuerza `allowRemoteModels = false`).
Si se borra, nada lo repone: `sync` falla hasta que el usuario reinstale a
mano. Eso es una dependencia instalada. El nombre `.cache/` venía heredado del
vocabulario de Transformers.js, que sí trata su `cacheDir` como caché porque
descarga solo — capacidad que este producto deshabilita deliberadamente.

El renombre es barato ahora: sólo `src/main.ts` lee la variable, se documentó
el 13 de agosto y el paquete nunca se publicó (`private: true`). Dentro del
adaptador el parámetro sigue llamándose `cacheDir`, porque ahí se habla el
idioma de Transformers.js; lo que debe decir la verdad es la superficie
pública.

Orden de precedencia del modelo:

1. `AUTO_YOUTUBE_RAG_MODELS_DIR` si está definida;
2. `<AUTO_YOUTUBE_RAG_HOME>/models`;
3. `<os.homedir()>/.auto-youtube-rag/models`.

Y para la base:

1. `AUTO_YOUTUBE_RAG_HOME` si está definida;
2. `<os.homedir()>/.auto-youtube-rag/`.

`AUTO_YOUTUBE_RAG_MODELS_DIR` se conserva como override independiente porque
permite compartir 130 MB entre varios hogares sin duplicarlos. Hoy ninguna
otra parte del proyecto lee estas variables: sólo `src/main.ts`. Los tests y
el arnés de evaluaciones no usan variables de entorno (ver Decisión 3).

## Decisión 2: por qué el hogar de usuario reemplaza al `cwd`

La posición inicial de esta discusión fue que la base relativa al `cwd` era
defendible por permitir una biblioteca por proyecto. Se descarta, por tres
razones en orden de peso:

1. **El caso de uso principal está roto por defecto.** La skill existe para
   que un agente que trabaja en _otro_ proyecto consulte la biblioteca. Con
   la base relativa al `cwd`, ese agente encuentra una biblioteca vacía y
   debería reindexar la colección entera por cada carpeta desde la que
   trabaje.
2. **Falla en silencio.** Pararse en otra carpeta no produce error: `status`
   informa cero fuentes y aparenta pérdida de datos. `skill/references/setup.md`
   ya documenta el síntoma; eliminar el fallo es mejor que documentarlo.
3. **La evidencia de la corrida en frío.** La biblioteca construida por el
   subagente —63 paquetes, 4.799 embeddings, ~20 minutos de cómputo— quedó
   en un directorio temporal y es inservible. Con hogar de usuario habría
   sido reutilizable desde cualquier carpeta.

El contraargumento real —tests y evaluaciones necesitan bibliotecas
desechables— ya está cubierto por `AUTO_YOUTUBE_RAG_HOME`, que el arnés fija
explícitamente. El default no tiene que cargar con esa necesidad.

## Decisión 3: el resolutor de rutas es una función compartida

El desajuste actual existe porque dos programas calculan la misma ruta con
reglas distintas. La corrección estructural es que exista **una sola
función**, y que tanto el lector como el escritor la usen.

Archivo nuevo: `src/infrastructure/config/resolve-paths.ts`.

```ts
export interface ResolvedPaths {
  readonly home: string;
  readonly databasePath: string;
  readonly modelsPath: string;
}

export function resolvePaths(
  env: NodeJS.ProcessEnv,
  homedir: () => string,
): ResolvedPaths;
```

`env` y `homedir` se inyectan para que los tests no dependan del entorno real
ni del usuario que corre la suite. `src/main.ts` la llama con
`process.env` y `os.homedir`.

Vive en infraestructura, no en dominio ni aplicación: es conocimiento de
sistema de archivos y de variables de entorno, y el invariante del proyecto
prohíbe que dominio y aplicación conozcan rutas de Node.

El campo `config.modelCachePath` que hoy reciben `runCli` y
`createApplication` **conserva su nombre** en este punto: es interno, lo usan
los tres E2E y varios tests, y renombrarlo mezclaría un refactor amplio con
un cambio de comportamiento. Lo que sí cambia de nombre es la superficie
pública — la variable de entorno y el directorio.

Los tres defaults duplicados de `cwd` **se eliminan**, no se dejan como
respaldo:

- `e5-embedding-generator.ts` pasa a exigir `cacheDir`. Hoy tiene un fallback
  a `<cwd>/.cache/models` que sólo puede enmascarar un cableado incompleto:
  el composition root siempre lo entrega.
- `evals/run-seed-queries.ts` pasa a resolver su default con `resolvePaths`,
  conservando su flag `--model-cache` como override explícito.
- `benchmarks/embeddings/run.ts` **no se toca**: es una herramienta de
  investigación que legítimamente trabaja contra el repositorio, y ya no se
  ofrece como remedio de producto.

**El riesgo del cambio es mucho menor de lo que aparenta**, y conviene dejarlo
escrito para que nadie sobredimensione el bloque V: los tests no leen
variables de entorno ni el `cwd`. Construyen sus rutas en directorios
temporales y las inyectan como `config` a `runCli` y `createApplication`
(ver `test/helpers/create-test-collection.ts` y los tres E2E). La superficie
real que cambia de comportamiento es `src/main.ts`, que es el único punto del
producto que consulta el entorno.

## Decisión 4: `init` instala el sistema completo

El sistema necesita cuatro cosas para funcionar. Sólo dos son
responsabilidad de este producto:

| Qué                    | Quién lo provee                   |
| ---------------------- | --------------------------------- |
| Node ≥ 24.19.0         | Prerrequisito del entorno         |
| La CLI en el `PATH`    | npm (`i -g` / `link`)             |
| **El modelo (130 MB)** | **Este producto**                 |
| **El hogar y la base** | **Este producto**                 |
| Fuentes registradas    | Datos del usuario, no instalación |

`init` pasa a cubrir las dos propias en un solo comando: crea el hogar, migra
la base y deja el modelo instalado.

```text
auto-youtube-rag init [--skip-model] [--from <ruta>]
auto-youtube-rag models install [--force] [--from <ruta>]
auto-youtube-rag models status
```

`--skip-model` existe para CI y entornos sin red. `models install` sobrevive
para reparar o reinstalar el modelo sin tocar la base.

**Cambia la naturaleza de `init`**, que hoy es instantáneo y offline y pasa a
tardar lo que tarde bajar 130 MB. Es aceptable porque es un comando de
primera vez, pero exige documentar la duración con la misma prominencia que
la de `sync` — la corrida en frío demostró que una operación larga no
anunciada bloquea al agente consumidor.

El instalador pasa a ser parte del producto:

Cinco consecuencias buscadas:

- usa la única dependencia de producción (`@huggingface/transformers`), no
  `tsx` ni `benchmarks/`;
- resuelve la ruta de destino con `resolvePaths`, **la misma** que usa el
  lector — el desajuste desaparece por construcción, no por documentación;
- existe para cualquiera que tenga la CLI, con repositorio o sin él;
- respeta el invariante de no descargar implícitamente: la descarga sólo
  ocurre cuando el usuario la pide por nombre;
- deja lugar natural a un futuro cambio de modelo (ver "Nota: qué haría falta
  para soportar otro modelo"). Cambiar el modelo por defecto sigue requiriendo
  aprobación explícita; este punto sólo habilita la mecánica de instalación.

`npm run models:download` **se conserva** apuntando a los benchmarks, que es
su lugar legítimo. Deja de mencionarse como remedio de producto.

## Decisión 5: reutilizar un modelo existente sólo con `--from` explícito

`models install` e `init` aceptan `--from <ruta>` para copiar un modelo que ya
está en disco en vez de descargarlo. Orden de resolución:

1. si el destino ya contiene el modelo instalado → `already_installed`, no
   hace nada (salvo `--force`);
2. si se pasó `--from <ruta>` y esa ruta contiene el modelo completo →
   **copiar** al destino, escribir el recibo y reportar `adopted`;
3. si se pasó `--from` y la ruta no contiene el modelo completo → error de
   uso, código `2`. No cae a descargar en silencio: el usuario pidió algo
   concreto y hay que decirle que no estaba;
4. en caso contrario → descargar y reportar `installed`.

**Se descartó la detección automática del repositorio.** Era más cómoda la
primera vez, pero le daría al producto conocimiento de la estructura del
repositorio, y el principio acordado es el opuesto: el repo es código fuente
y el producto no debe poder correr desde él sin haberse instalado. Con
`--from`, el producto no sabe que existe un repositorio; simplemente copia
desde donde le digan.

Se copia y no se mueve: vaciar el origen rompería los benchmarks y el smoke
de E5, que leen el caché del repositorio por su cuenta.

"Modelo completo" en el origen significa que existen los cuatro archivos que
el runtime necesita: `config.json`, `tokenizer.json`, `tokenizer_config.json`
y `onnx/model_quantized.onnx`, bajo
`<origen>/Xenova/multilingual-e5-small/`. Un directorio a medio bajar no
califica. El origen no necesita recibo — típicamente no lo va a tener, porque
no fue instalado por este producto.

## Decisión 6: el cambio de comportamiento se avisa, no se silencia

Una base existente en `<cwd>/.auto-youtube-rag/` deja de leerse. Silenciar
eso reproduce el fallo que este trabajo viene a eliminar.

`init` y `status` detectan el caso: si el hogar resuelto no contiene base
pero **sí** existe `<cwd>/.auto-youtube-rag/index.sqlite`, agregan un warning
`LEGACY_LIBRARY_FOUND` con ambas rutas y la indicación de mover el archivo o
fijar `AUTO_YOUTUBE_RAG_HOME`. No se migra automáticamente: mover datos del
usuario sin pedirlo excede el mandato de estos comandos.

El warning se emite sólo cuando el hogar resuelto está vacío. Si ya hay una
biblioteca en el hogar, una base vieja en el `cwd` es ruido y no se menciona.

## Decisión 7: preflight de requisitos, una vez por comando

Las dos corridas en frío dejaron medidos los dos fallos de arranque, y ambos
son defectos propios, no del entorno:

| Falta     | Comportamiento actual                                                                               |
| --------- | --------------------------------------------------------------------------------------------------- |
| La base   | `ERR_SQLITE_ERROR: unable to open database file`, error crudo                                       |
| El modelo | **63 issues `MODEL_LOAD_FAILED`**, uno por video, apuntando a un comando inexistente fuera del repo |

El segundo es el más caro: el sistema descubrió que faltaba el modelo una vez
por cada video, procesando paquete por paquete hasta terminar en `partial`.
Podía saberlo antes de empezar.

Cada comando declara qué requisitos necesita, y la CLI los verifica **una
sola vez, antes de ejecutar nada**:

| Comando                           | Requisitos         |
| --------------------------------- | ------------------ |
| `init`                            | ninguno (los crea) |
| `status`, `doctor`                | base               |
| `source add/list/remove`          | base               |
| `sync`, `retrieve`                | base + modelo      |
| `models install`, `models status` | ninguno            |

Un requisito ausente produce **un** error accionable con el comando que lo
resuelve (`auto-youtube-rag init`), código de salida `1`, y códigos
simbólicos `LIBRARY_NOT_FOUND` o `MODEL_NOT_INSTALLED`. Nunca 63 issues
idénticas ni un error crudo de SQLite.

`doctor` es la excepción deliberada: corre igual sin modelo, porque su
trabajo es justamente diagnosticar qué falta.

### Recibo de instalación

Distinguir "falta" de "está roto" necesita algo más que existencia de
archivos. Una descarga cortada deja los cuatro archivos presentes con tamaño
incorrecto, y el fallo aparece recién al cargar el modelo, como un error de
ONNX incomprensible.

`models/.install.json`, escrito por la instalación:

```json
{
  "schema_version": "1.0",
  "model": {
    "key": "e5-small",
    "version": "Xenova/multilingual-e5-small@main:q8",
    "dimensions": 384
  },
  "files": [{ "path": "onnx/model_quantized.onnx", "bytes": 118654321 }],
  "installed_at": "2026-08-13T18:00:00.000Z",
  "source": "download"
}
```

Permite tres estados verificables sin hashear 130 MB:

- **`absent`**: no hay recibo ni archivos.
- **`incomplete`**: el recibo no coincide con el disco (archivo faltante o de
  tamaño distinto), o hay archivos sin recibo. Se repara con
  `models install --force`.
- **`installed`**: recibo y disco coinciden.

Se comparan tamaños, no hashes: detecta descargas truncadas —el fallo real—
sin leer 130 MB en cada `doctor`.

Un directorio con archivos pero sin recibo cuenta como `incomplete`, no como
`installed`: es el caso de alguien que copió el modelo a mano, y conviene que
`models install --force` lo normalice escribiendo el recibo.

### Base corrupta

`doctor` ya detecta corrupción con `integrity_check`. Lo que falta es que
`sync` y `retrieve` traduzcan un error de integridad de SQLite a un mensaje
que mande a `doctor`, en vez de propagar el error crudo del driver.

## Contrato de salida

`models install`:

```json
{
  "schema_version": "1.0",
  "status": "installed",
  "model": { "key": "e5-small", "version": "1", "dimensions": 384 },
  "cache_path": "C:\\Users\\lucho\\.auto-youtube-rag\\models",
  "bytes": 135266304,
  "source": "download"
}
```

`status` admite `installed`, `already_installed` y `adopted`. `source` admite
`download` y `copy`.

`models status` devuelve la misma forma sin `bytes` ni descarga, con
`status: "installed"`, `"incomplete"` o `"absent"`, y código de salida `0` en
los tres casos: informar ausencia no es un fallo operativo. Cuando el estado
es `incomplete`, suma `issues` con los archivos que no coinciden con el
recibo.

`init` suma `home` y `model` al recibo, junto al `database_path` que ya emite.

Códigos simbólicos nuevos:

| Código                  | Tipo             | Cuándo                                         |
| ----------------------- | ---------------- | ---------------------------------------------- |
| `MODEL_DOWNLOAD_FAILED` | error, retryable | La red falló durante la descarga               |
| `MODEL_NOT_INSTALLED`   | error            | Preflight: `sync`/`retrieve` sin modelo        |
| `LIBRARY_NOT_FOUND`     | error            | Preflight: falta la base                       |
| `MODEL_SOURCE_INVALID`  | uso (`2`)        | `--from` apunta a una ruta sin modelo completo |
| `LEGACY_LIBRARY_FOUND`  | warning          | Hay base vieja relativa al `cwd`               |

## Impacto en `doctor`

El check de modelo ya existe y lee `modelCachePath`. Pasa a recibir la ruta
del resolutor, y su mensaje de error deja de decir "Run npm run
models:download first" para decir `auto-youtube-rag models install`. Es el
mensaje que leyó el subagente y lo mandó a un comando inexistente en su
contexto.

## Riesgo principal y cómo se acota

La hipótesis inicial era que el hogar de usuario podía romper la suite. La
auditoría la descartó: los tests inyectan `config` con rutas temporales y no
consultan el entorno, así que el bloque V queda como verificación acotada y
no como refactor. Se conserva igual, y antes de `main.ts`, porque confirmar
una hipótesis benigna es barato y descubrirla falsa a mitad de camino no.

El riesgo que sí queda es la **eliminación de los defaults duplicados**: si
algún camino construye `E5EmbeddingGenerator` sin `cacheDir`, hoy funciona
por accidente y pasaría a fallar en compilación. Eso es deseable —convierte
un fallo silencioso en uno visible— pero hay que revisar cada construcción
antes de exigir el parámetro.

Riesgo secundario: `models install` descarga de red. Debe quedar fuera de
`npm run check` mediante el patrón `smoke` ya existente, igual que el smoke
de E5.

## Nota: qué haría falta para soportar otro modelo

Fuera del alcance de 4.2, registrado acá porque la auditoría del código lo
dejó claro y conviene no volver a investigarlo desde cero.

**Lo que ya está resuelto:**

- La dimensión es genérica de punta a punta. `embeddings` guarda
  `dimensions`, `model_key` y `model_version` por fila; el loader filtra por
  el modelo activo; el índice en memoria arma su matriz desde
  `model.dimensions` sin ningún `384` hardcodeado, y valida que lo guardado
  coincida con lo declarado.
- **La reindexación automática al cambiar de modelo ya funciona.**
  `unchanged()` en `sync-source.ts` incluye `key`, `version` y `dimensions`
  del modelo activo en su criterio, así que cambiar cualquiera de los tres
  invalida todos los paquetes y el `sync` siguiente reindexa. `version` es
  `"Xenova/multilingual-e5-small@main:q8"`, de modo que cambiar revisión o
  cuantización también dispara.

**Lo que falta:**

- La identidad del modelo son constantes de módulo en
  `e5-embedding-generator.ts` (`modelRepository`, `modelRevision`,
  `modelDtype`, `modelDescriptor`). Cambiar de modelo es cambiar código.
- **Los prefijos E5 (`passage: ` / `query: `) están hardcodeados** y se
  aplican siempre. Son específicos de la familia E5: con MiniLM, Jina o BGE
  degradan la calidad **sin ningún error**. El arnés de benchmarks ya
  contempla esto con un flag `e5Prefixes` en su `ModelDefinition`; el
  producto no. Mover los prefijos al descriptor del modelo es el trabajo real
  de "modelo configurable", no la dimensión.
- **Dos modelos no conviven en la práctica**, aunque el esquema lo permita
  (`PRIMARY KEY (fragment_id, model_key)`). `applyPackage` hace `DELETE FROM
source_documents`, y la cascada `source_documents → knowledge_units →
search_fragments → embeddings` borra los vectores de todos los modelos del
  paquete. Cada `sync` deja exactamente un modelo. Comparar dos modelos sobre
  el mismo corpus requeriría un camino de código que hoy no existe.
- **Hueco de degradación silenciosa.** Entre cambiar el modelo y correr
  `sync`, el loader filtra por el modelo activo y no encuentra vectores, así
  que el índice queda vacío. Falla seguro —nunca mezcla vectores de dos
  modelos— pero `retrieve` devuelve `status: "ok"` con sólo la vía textual y
  sin ningún aviso. Debería emitir un warning (`EMBEDDING_MODEL_MISSING` ya
  existe, o uno propio tipo `VECTORS_STALE`) indicando que hay que
  reindexar.

Un LLM generativo queda descartado por definición del producto: el sistema
necesita un vector de tamaño fijo por texto, y la decisión fundacional es que
no hay LLM interno.

## Documentos a actualizar al implementar

- `docs/cli-contract.md`: comando `models` y sus recibos.
- `docs/product-spec.md`: sección de instalación, hoy inexistente.
- `docs/development.md`: `models:download` es de benchmarks, no de producto.
- `docs/decisions.md`: cerrar los dos pendientes que abrió el test — el
  default del caché queda resuelto acá; el guard de concurrencia sigue
  abierto y así debe quedar registrado.
- `skill/SKILL.md` y `skill/references/setup.md`: el hogar de usuario elimina
  buena parte del texto de rutas que se agregó el 13 de agosto.
- `docs/build.md`: punto 4.2.
- `docs/agent-handoff.md`: estado operativo.

## Plan de bloques

| Bloque | Contenido                                                    |
| ------ | ------------------------------------------------------------ |
| U      | Resolutor de rutas, recibo y estado del modelo               |
| V      | Eliminación de los tres defaults duplicados                  |
| W      | Descarga de modelo: puerto, adaptador y copia desde `--from` |
| X      | `models` e `init` en la CLI, `main.ts` y `doctor` alineados  |
| Z      | Preflight de requisitos y traducción de fallos de estado     |
| Y      | Validación real en frío y cierre de documentación            |

Orden de ejecución: U → V → W → X → Z → Y. Detalle en
`docs/install-tasks.md`.

## Decisiones confirmadas (13 de agosto de 2026)

- Distribución como comando global; sin `postinstall`, porque hay
  instalaciones con scripts deshabilitados.
- Hogar único de usuario `~/.auto-youtube-rag/`, con `AUTO_YOUTUBE_RAG_HOME`
  para moverlo entero y `AUTO_YOUTUBE_RAG_MODELS_DIR` para el modelo.
- El directorio se llama `models/`, no `cache/`: el modelo es estado
  instalado, no dato derivado que se regenere solo.
- El resolutor es una sola función compartida por lector y escritor; los tres
  defaults duplicados de `cwd` se eliminan.
- `init` instala el sistema completo (hogar, base y modelo), con
  `--skip-model` para CI.
- El instalador es un subcomando del producto; `npm run models:download`
  queda como herramienta de benchmarks, válida sólo desde el repositorio.
- Un modelo ya presente en disco se reutiliza sólo con `--from` explícito. Se
  descartó la detección automática del repositorio: el producto no debe
  conocer la estructura del repo, ni poder correr desde él sin instalarse.
- Se copia, no se mueve: vaciar el origen rompería benchmarks y smoke.
- La base vieja relativa al `cwd` se avisa (`LEGACY_LIBRARY_FOUND`), no se
  migra sola.
- Preflight de requisitos una vez por comando, no una vez por video.
- Recibo `models/.install.json` para distinguir ausente, incompleto e
  instalado, comparando tamaños y no hashes.
- El modelo por defecto y su dimensión no cambian en este punto.
