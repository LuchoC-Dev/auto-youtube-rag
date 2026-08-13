# Tareas de instalación: hogar de usuario y `models install`

## Estado

Propuesto el 13 de agosto de 2026. Punto 4.2. Diseño en
`docs/install-design.md`. Ninguna tarea empieza sin aprobación explícita del
diseño.

## Convenciones de ejecución

- Máximo cinco archivos por tarea.
- Cada tarea termina con su test específico en verde antes de commitear.
- `npm run check` y `npm run build` antes de cada commit.
- Commits convencionales mediante la skill `git-commit`, en inglés.
- Ningún test nuevo puede depender del `homedir` real de quien corre la
  suite, ni tocar la red.
- Las fuentes registradas siguen siendo estrictamente de sólo lectura.

## Bloque U — Resolutor de rutas compartido

### U1. `resolve-paths.ts`

Crear `src/infrastructure/config/resolve-paths.ts` con `ResolvedPaths` y
`resolvePaths(env, homedir)`.

Precedencia de la base: `AUTO_YOUTUBE_RAG_HOME` → `<homedir>/.auto-youtube-rag`.
Precedencia del modelo: `AUTO_YOUTUBE_RAG_MODELS_DIR` → `<home>/models`.

Todas las rutas devueltas son absolutas (`resolve`). Una variable definida
pero vacía o sólo con espacios se trata como no definida.

Criterio de aceptación: `test/infrastructure/config/resolve-paths.test.ts`
cubre las dos variables definidas, cada una por separado, ninguna, y el caso
de variable vacía. Sin tocar `process.env` real ni `os.homedir` real.

### U2. Recibo de instalación y estado del modelo

En el mismo directorio, `model-install-state.ts` con:

- `readInstallReceipt(modelsPath)`: lee y valida `models/.install.json`;
- `writeInstallReceipt(modelsPath, receipt)`;
- `readModelState(modelsPath)` → `"installed" | "incomplete" | "absent"`,
  comparando el recibo contra el disco por **tamaño de archivo**, no por
  hash;
- `readSourceState(path)` → `"complete" | "absent"`, para validar el origen
  de `--from`, que no tiene recibo.

Completo exige los cuatro archivos bajo
`<path>/Xenova/multilingual-e5-small/`: `config.json`, `tokenizer.json`,
`tokenizer_config.json` y `onnx/model_quantized.onnx`.

Un directorio con archivos pero sin recibo es `incomplete`, no `installed`.

Criterio de aceptación: tests con directorio temporal que cubren los tres
estados, un archivo truncado (tamaño distinto al del recibo), un recibo sin
archivos, y archivos sin recibo. Ningún test lee 130 MB reales.

## Bloque V — Eliminar los defaults duplicados

La auditoría previa al diseño ya confirmó que los tests inyectan `config` con
rutas temporales y no consultan el entorno, así que este bloque es acotado:
no es un refactor de la suite, sino la eliminación de los tres cálculos
duplicados de la ruta de caché.

### V1. Confirmar el aislamiento de la suite

Verificar que ningún test ni arnés depende del `cwd` o del `homedir` real.
Punto de partida conocido: `test/helpers/create-test-collection.ts` y los
tres E2E ya inyectan rutas temporales; `test/main.test.ts` no lee entorno.

Criterio de aceptación: lista escrita en el cuerpo del commit. Si aparece una
excepción, se corrige acá antes de seguir. **Este bloque no modifica `src/`.**

### V2. `E5EmbeddingGenerator` exige `cacheDir`

Quitar el fallback `resolve(process.cwd(), ".cache", "models")` del
constructor y volver `cacheDir` obligatorio. Revisar cada construcción del
generador antes de exigirlo.

Criterio de aceptación: typecheck en verde; el composition root sigue
entregando la ruta; ningún camino queda construyendo el generador sin ella.
Un fallo de compilación acá es el resultado buscado, no un accidente.

### V3. `evals/run-seed-queries.ts` usa el resolutor

Reemplazar su default `join(process.cwd(), ".cache", "models")` por
`resolvePaths`, conservando el flag `--model-cache` como override explícito.

`benchmarks/embeddings/run.ts` **no se toca**: trabaja legítimamente contra el
repositorio.

Criterio de aceptación: el arnés resuelve la misma ruta que el producto
cuando no se le pasa el flag.

## Bloque W — Descarga del modelo

### W1. Puerto `ModelInstaller`

`src/application/ports/model-installer.ts`: `install(options)` devuelve
`{ status, source, bytes }`.

La aplicación no conoce Hugging Face ni rutas: recibe el puerto. Mantiene el
invariante de acoplamiento.

Criterio de aceptación: typecheck y un fake en `test/fakes/`.

### W2. Adaptador de descarga

`src/infrastructure/embeddings/e5-model-installer.ts`, usando
`@huggingface/transformers` con `allowRemoteModels = true` **sólo dentro de
este adaptador**. El generador de embeddings conserva `false`.

Criterio de aceptación: test con runtime falso que verifica que se pide el
repositorio, la revisión y el `dtype` correctos, y que el destino es el que
entrega el resolutor. Sin red.

### W3. Copia desde `--from`

Implementar el orden de la Decisión 5: destino ya instalado → `--from`
completo (copiar y escribir recibo) → `--from` incompleto (error de uso `2`,
`MODEL_SOURCE_INVALID`) → descargar.

Criterio de aceptación: test con directorios temporales que cubre las cuatro
ramas, verifica que la copia **no vacía el origen**, que un origen incompleto
falla en vez de caer a descargar, y que el recibo queda escrito tras copiar.

### W4. Caso de uso `installModel`

`src/application/models/install-model.ts`, orquestando puerto y estado de
caché.

Criterio de aceptación: test de aplicación con fakes, sin SQLite ni modelo
real.

## Bloque X — Superficie de CLI

### X1. `parse-command.ts` acepta `models`

Sumar `{ kind: "models_install"; force: boolean }` y
`{ kind: "models_status" }`. Un subcomando desconocido es error de uso,
código `2`, igual que el resto.

Criterio de aceptación: tests de parseo para `models install`,
`models install --force`, `models status`, `models` a secas y
`models frobnicate`.

### X2. `run-cli.ts` ejecuta `models`

Cablear ambos, con los recibos del diseño. `models status` devuelve `0` tanto
si está presente como si falta.

Criterio de aceptación: tests de CLI con aplicación falsa, verificando forma
del recibo y códigos de salida.

### X3. `main.ts` usa el resolutor

Reemplazar el cálculo de rutas por `resolvePaths(process.env, os.homedir)`.

Criterio de aceptación: `npm run check` en verde. Este es el punto de no
retorno del cambio de comportamiento; V2 tiene que estar cerrado antes.

### X4. `init` instala el sistema completo

`init` crea el hogar, migra la base **y** deja el modelo instalado, aceptando
`--skip-model` y `--from <ruta>`. Suma `home` y `model` al recibo.

`init` y `status` emiten `LEGACY_LIBRARY_FOUND` cuando el hogar resuelto no
tiene base y sí existe `<cwd>/.auto-youtube-rag/index.sqlite`.

Criterio de aceptación: tests de las tres combinaciones — hogar vacío con
base vieja presente, hogar vacío sin base vieja, hogar con biblioteca y base
vieja presente (no debe avisar).

### X5. `doctor` apunta al comando correcto

El check de modelo recibe la ruta del resolutor y su mensaje de error nombra
`auto-youtube-rag models install`, no `npm run models:download`.

Criterio de aceptación: test que verifica el texto del mensaje ante caché
ausente.

## Bloque Z — Preflight y fallos de estado

Este bloque ataca los dos fallos de arranque medidos en las corridas en frío.
Va después de X porque necesita el resolutor y el estado del modelo ya
cableados.

### Z1. Tabla de requisitos por comando

`src/interfaces/cli/command-requirements.ts`: para cada `ParsedCliCommand`,
qué requiere (`none`, `library`, `library_and_model`).

`doctor` declara `none` deliberadamente: su trabajo es diagnosticar qué falta.

Criterio de aceptación: test que recorre todos los `kind` de
`ParsedCliCommand` y verifica que ninguno quedó sin declarar. Debe fallar en
compilación si mañana se agrega un comando y se olvida su requisito.

### Z2. Preflight en `run-cli.ts`

Verificar los requisitos **una sola vez, antes de construir la aplicación**.
Ausencia produce un error accionable con código `1` y símbolo
`LIBRARY_NOT_FOUND` o `MODEL_NOT_INSTALLED`, nombrando el comando que lo
resuelve.

Criterio de aceptación: tests de `sync` y `retrieve` sin base, sin modelo, y
sin ninguno de los dos. Verificar que el mensaje nombra `auto-youtube-rag
init` y que **no** se construye la aplicación ni se abre SQLite.

### Z3. `sync` deja de descubrir el modelo ausente 63 veces

Con Z2 en su lugar, `sync` ya no puede llegar a procesar paquetes sin modelo.
Verificar que ese camino quedó efectivamente muerto.

Criterio de aceptación: test que corre `sync` sobre una colección de varios
videos sin modelo instalado y comprueba que produce **una** salida de
preflight, no una issue por video. Es la regresión directa del hallazgo del
13 de agosto.

### Z4. Error de integridad traducido

`sync` y `retrieve` traducen un fallo de integridad de SQLite a un mensaje
que manda a `auto-youtube-rag doctor`, en vez de propagar el error crudo del
driver.

Criterio de aceptación: test con una base corrupta que verifica el mensaje y
que `doctor` sigue corriendo y reportando el detalle.

## Bloque Y — Validación y cierre

### Y1. Smoke real de instalación

`test/smoke/model-install.smoke.test.ts`, excluido de `npm run check` por el
patrón `smoke`, que ejecuta la adopción real desde el caché del repositorio a
un hogar temporal.

Criterio de aceptación: pasa sin red, adopta y no deja el repositorio sin
caché.

### Y2. Validación en frío

Repetir el patrón de la corrida del 13 de agosto: subagente sin contexto
previo, sólo con la skill, partiendo de una máquina sin hogar de usuario.
Debe llegar de cero a un `retrieve` citado sin copiar nada a mano.

Criterio de aceptación: cero pasos manuales no documentados. Cualquier
fricción se corrige en la skill antes de cerrar. Verificar además con digest
SHA-256 que las colecciones reales quedan intactas.

Esta tarea valida también la separación de la skill del 13 de agosto, que
quedó registrada como no verificada en frío.

### Y3. Cierre y documentación

Actualizar los siete documentos listados en el diseño. Cerrar en
`docs/decisions.md` el pendiente del default del caché, y **dejar
explícitamente abierto** el del guard de concurrencia de `sync`, con su
hipótesis todavía sin confirmar.

Criterio de aceptación: `docs/build.md` marca 4.2 al 100%; el handoff
describe el hogar de usuario como estado operativo; ninguna referencia
sobreviviente manda a `npm run models:download` como remedio de producto.

## Orden y dependencias

U → V → W → X → Z → Y, estrictamente.

V debe cerrarse antes de X3: cablear el resolutor en `main.ts` con defaults
duplicados todavía vivos convierte cualquier fallo en una ambigüedad entre
"rompí algo" y "quedó un cálculo viejo apuntando al lugar anterior".

W es independiente de X y puede adelantarse si conviene, pero no se cablea
hasta que X1 y X2 existan.
