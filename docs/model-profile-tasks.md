# Tareas del perfil de modelo de embeddings

## Estado

Propuesto el 14 de agosto de 2026. Punto 4.5. Diseño en
`docs/model-profile-design.md`. Ninguna tarea empieza sin aprobación
explícita del diseño.

## Convenciones de ejecución

- Máximo cinco archivos por tarea.
- Cada tarea termina con su test específico en verde antes de commitear.
- `npm run check` y `npm run build` antes de cada commit.
- Commits convencionales mediante la skill `git-commit`, en inglés.
- Ningún test nuevo puede tocar la red ni cargar el modelo real: para eso
  está el runtime inyectable que el adaptador ya acepta.
- El modelo activo no cambia. Ninguna tarea puede alterar el `version`
  persistido para el perfil activo.
- Los códigos de error públicos no cambian de valor en ninguna tarea.

## Bloque AA — el perfil como dato

### AA1. `model-profile.ts`

Crear `src/infrastructure/embeddings/model-profile.ts` con
`EmbeddingInputPrefixes`, `EmbeddingModelProfile`, `activeModelProfile`
(congelado) y `modelVersion(profile)`, exactamente como los define la
Decisión 1 y la Decisión 3 del diseño.

El módulo no importa nada: ni Transformers.js, ni `node:fs`, ni otro módulo
del proyecto.

Agregar también `modelDescriptorOf(profile): EmbeddingModelDescriptor`, que
arma `{ key, version: modelVersion(profile), dimensions, maxInputTokens }`.
Es el único lugar donde un perfil se traduce al tipo del puerto.

Criterio de aceptación: `test/infrastructure/embeddings/model-profile.test.ts`
fija que `modelVersion(activeModelProfile)` es **literalmente**
`"Xenova/multilingual-e5-small@main:q8"`, que un perfil con
`inputPrefixes: null` agrega el sufijo `+noprefix`, y que
`modelDescriptorOf(activeModelProfile)` es igual —campo por campo— al
`modelDescriptor` que hoy exporta `e5-embedding-generator.ts`.

El primer aserto no es decorativo: es lo que impide reindexar 51 videos por
accidente. Si falla, algo del diseño se rompió.

## Bloque AB — el generador consume el perfil

### AB1. Prefijos según política

En `e5-embedding-generator.ts`, reemplazar `passageInputs` y `queryInput` por
funciones que reciban el perfil y devuelvan el texto sin tocar cuando
`inputPrefixes === null`.

`normalizeVector` deja de leer el `modelDescriptor` de módulo y recibe las
dimensiones esperadas. `embedPrefixed` compara contra
`profile.maxInputTokens` en vez de la constante.

El constructor acepta `profile?: EmbeddingModelProfile` con default
`activeModelProfile` (Decisión 6). `getSession()` toma repositorio, revisión
y dtype del perfil. `describe()` devuelve `modelDescriptorOf(this.profile)`.

Las constantes `modelDescriptor`, `modelRepository`, `modelRevision` y
`modelDtype` siguen exportadas en esta tarea, ahora derivadas del perfil, para
no romper al instalador todavía. Se eliminan en AC2.

Criterio de aceptación: los tests existentes de
`test/infrastructure/embeddings/e5-embedding-generator.test.ts` pasan sin
cambios de expectativa. Se agregan dos: un perfil sin prefijos envía el texto
crudo al runtime en `embedDocuments` **y** en `embedQuery`, y un perfil con
prefijos propios distintos de los de E5 los aplica tal cual. Ambos con
runtime falso que registra los textos recibidos.

### AB2. Un solo camino de prefijos para contar y para embeber

Verificar y, si hace falta, corregir que `countTokens` prefije con la misma
política que `embedDocuments` (Decisión 5).

Criterio de aceptación: un test con perfil sin prefijos comprueba que el
texto que llega a `countTokens` del runtime es idéntico al que llega a
`embed`. Con el perfil activo, ambos llevan `passage: `.

## Bloque AC — instalación y estado consumen el perfil

### AC1. `model-install-state.ts` recibe el perfil

Borrar la constante de módulo `modelDirectory` y la exportación
`requiredModelFiles` como valor fijo. `measureModelFiles`, `readSourceState`,
`describeModelState` y `readModelState` aceptan el perfil (o los datos que
necesitan de él: `repository` y `requiredFiles`) y derivan el directorio de
`profile.repository`.

Mantener el default `activeModelProfile` en cada firma para no obligar a
todos los llamadores a cambiar en la misma tarea.

Criterio de aceptación: los tests existentes de estado de instalación pasan;
se agrega uno con un perfil de repositorio y `requiredFiles` distintos que
demuestra que el estado se mide bajo ese otro directorio.

### AC2. El instalador consume el perfil y mueren los duplicados

En `e5-model-installer.ts`, borrar la constante local `modelDirectory` y las
importaciones de `modelRepository`/`modelRevision`/`modelDtype`/
`modelDescriptor`; usar el perfil, con default `activeModelProfile`.

En `e5-embedding-generator.ts`, eliminar ya las cuatro constantes exportadas
en AB1: a esta altura no queda ningún consumidor. Actualizar `run-cli.ts` y
`create-application.ts` sólo si el borrado los rompe (no debería: construyen
con `{ cacheDir }`).

Después de esta tarea, `"Xenova/multilingual-e5-small"` debe aparecer
**exactamente una vez** en todo `src/`. Verificarlo con una búsqueda antes de
commitear.

Criterio de aceptación: los tests del instalador pasan; se agrega uno que
adopta desde `--from` con un perfil de repositorio distinto y comprueba que
copia desde y hacia ese directorio, no hacia el de E5.

## Bloque AD — rename, validación y cierre

### AD1. Rename del adaptador de embeddings

Aplicar la tabla de renombres de la Decisión 4 sobre el generador:
`e5-embedding-generator.ts` → `transformers-embedding-generator.ts`, con
`TransformersEmbeddingGenerator`, `EmbeddingAdapterError`,
`EmbeddingAdapterErrorCode`, `EmbeddingSession`, `EmbeddingRuntime`,
`EmbeddingRuntimeLoadOptions`.

Actualizar importadores: `create-application.ts` (incluido el
`instanceof` de `close()`), `run-cli.ts`, el test del adaptador y el smoke.
Renombrar también los dos archivos de test.

Los **valores** de los códigos de error no cambian.

Criterio de aceptación: `npm run check` y `npm run build` en verde; el smoke
`npm run test:embedding:smoke` sigue pasando contra el modelo real ya
instalado.

### AD2. Rename del instalador

`e5-model-installer.ts` → `transformers-model-installer.ts`, con
`TransformersModelInstaller`, `ModelDownloadRuntime`, `ModelDownloadOptions`.
Actualizar `run-cli.ts` y los tests del instalador.

Criterio de aceptación: `npm run check` y `npm run build` en verde.

### AD3. Validación real: nada se reindexa

Sobre una **copia temporal** de la colección real `auto-design` (nunca la
original), con el modelo E5 real:

1. `sync` completo con el código de `main` **antes** de este punto, o
   reutilizar una base ya sincronizada;
2. `sync` de nuevo con el código de 4.5 → debe devolver `no_changes`,
   0 indexados;
3. `retrieve` de una consulta semilla → bundle legible, citas que resuelven,
   sin `VECTORS_STALE`;
4. `doctor` en `ok`;
5. digest SHA-256 del árbol fuente idéntico antes y después;
6. borrar la copia y la base temporal.

El paso 2 es el punto entero: si reindexa, `modelVersion` cambió y hay que
volver a AA1.

Criterio de aceptación: los seis pasos documentados con su salida real en el
cierre de documentación.

### AD4. Cierre de documentación

Actualizar, en este orden: `docs/decisions.md` (sección nueva "Perfil de
modelo y política de prefijos"), `docs/install-design.md` (tachar el punto de
los prefijos en la nota de "qué haría falta para soportar otro modelo",
como ya se hizo con el hueco de degradación silenciosa), `docs/build.md`
(punto 4.5) y `docs/agent-handoff.md` (estado, inventario de `src/`,
orden de prioridad: el punto 1 pasa a cerrado y el 2 pasa a ser el
siguiente).

`skill/SKILL.md` no se toca: este punto no cambia nada observable para un
agente consumidor. Si al llegar acá resultara que sí cambia algo, es una
señal de que el alcance se desbordó.

Criterio de aceptación: `npm run format:check` en verde y worktree limpio.

## Resumen de archivos por bloque

| Bloque | `src/`                                                                                                      | `test/`                                                     |
| ------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| AA     | `embeddings/model-profile.ts`                                                                               | `model-profile.test.ts`                                     |
| AB     | `embeddings/e5-embedding-generator.ts`                                                                      | `e5-embedding-generator.test.ts`                            |
| AC     | `config/model-install-state.ts`, `embeddings/e5-model-installer.ts`, `embeddings/e5-embedding-generator.ts` | `model-install-state.test.ts`, `e5-model-installer.test.ts` |
| AD     | los dos adaptadores renombrados, `main/create-application.ts`, `interfaces/cli/run-cli.ts`                  | los tests renombrados + smoke                               |
