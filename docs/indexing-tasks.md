# Tareas de indexación incremental

## Estado

Checklist aprobado el 11 de agosto de 2026. La fase `IMPLEMENT` está activa y
debe ejecutar estas tareas en orden de dependencia. Todas modifican cinco
archivos o menos.

## Convenciones de ejecución

- Ejecutar una tarea por vez y mantener su commit enfocado.
- Escribir primero la prueba o criterio ejecutable que falle.
- Ejecutar la verificación específica y después `npm run build` y
  `npm run check`.
- Marcar una tarea `[x]` y actualizar [build.md](build.md) sólo cuando todos sus
  criterios estén satisfechos.
- No descargar modelos, acceder a red ni leer la biblioteca personal desde la
  suite rápida.
- No añadir dependencias ni cambiar contratos aprobados sin actualizar primero
  la especificación y pedir aprobación.

## Bloque A — Fundamentos puros

### A1. Identidades del dominio

- [x] Crear value objects validados para `SourceName`, `VideoId`, `PackageRef`,
      `DocumentId`, `KnowledgeUnitId`, `SearchFragmentId` y `SyncId`.
  - Depende de: ninguna tarea.
  - Aceptación: rechazan vacío, whitespace y separadores ambiguos; igualdad y
    serialización son deterministas; `PackageRef` combina fuente y video sin
    depender del slug.
  - Verificar: `node --import tsx --test test/domain/indexing/identifiers.test.ts`
    y `npm run check`.
  - Archivos: `src/domain/indexing/identifiers.ts`,
    `src/domain/indexing/domain-error.ts`,
    `test/domain/indexing/identifiers.test.ts`.

### A2. Entidades de catálogo

- [x] Implementar `SourceRoot`, `VideoPackage` y `SourceDocument` con sus
      invariantes.
  - Depende de: A1.
  - Aceptación: las rutas internas son datos canónicos, el slug sólo localiza,
    los documentos admiten únicamente `context`, `rules` y `metadata`, y no se
    pueden crear tamaños o duraciones negativos.
  - Verificar: `node --import tsx --test test/domain/indexing/catalog-entities.test.ts`
    y `npm run check`.
  - Archivos: `src/domain/indexing/source-root.ts`,
    `src/domain/indexing/video-package.ts`,
    `src/domain/indexing/source-document.ts`,
    `test/domain/indexing/catalog-entities.test.ts`.

### A3. Unidades, fragmentos y embeddings

- [x] Implementar `KnowledgeUnit`, `SearchFragment` y `EmbeddingRecord`.
  - Depende de: A1 y A2.
  - Aceptación: jerarquía, profundidad, ordinal, searchable, tokens, dimensión,
    hash y finitud del vector se validan; ningún vector acepta `NaN` o infinito.
  - Verificar: `node --import tsx --test test/domain/indexing/knowledge-entities.test.ts`
    y `npm run check`.
  - Archivos: `src/domain/indexing/knowledge-unit.ts`,
    `src/domain/indexing/search-fragment.ts`,
    `src/domain/indexing/embedding-record.ts`,
    `test/domain/indexing/knowledge-entities.test.ts`.

### A4. Sincronización e identidad de contenido

- [x] Implementar `SyncRun`, `SyncIssue`, SHA-256 y claves estructurales
      deterministas.
  - Depende de: A1–A3.
  - Aceptación: sólo existen transiciones válidas de run; contadores no son
    negativos; hashes y claves son estables; encabezados repetidos reciben
    ocurrencias diferentes y reproducibles.
  - Verificar: `node --import tsx --test test/domain/indexing/sync-and-content-identity.test.ts`
    y `npm run check`.
  - Archivos: `src/domain/indexing/sync-run.ts`,
    `src/domain/indexing/content-identity.ts`,
    `test/domain/indexing/sync-and-content-identity.test.ts`.

### A5. Snapshots y cambios de aplicación

- [x] Definir snapshots internos de manifest, paquete y metadata, junto con el
      cambio atómico que recibe `IndexStore`.
  - Depende de: A1–A4.
  - Aceptación: todos los límites son readonly, discriminados y libres de tipos
    de filesystem, SQLite, Markdown parser o Transformers.js.
  - Verificar: `npm run typecheck` y `npm run lint`.
  - Archivos: `src/application/indexing/package-snapshots.ts`,
    `src/application/indexing/indexed-package-change.ts`.

### A6. Puertos de indexación

- [x] Declarar los puertos `PackageSourceReader`, `SourceRegistry`, `IndexStore`,
      `EmbeddingGenerator` y `VectorIndexSink`.
  - Depende de: A5.
  - Aceptación: ninguna firma expone tipos externos; `IndexStore.applyPackage`
    representa una escritura atómica; el generador declara modelo, límite,
    conteo y dimensión.
  - Verificar: `npm run typecheck` y `npm run lint`.
  - Archivos: `src/application/ports/package-source-reader.ts`,
    `src/application/ports/source-registry.ts`,
    `src/application/ports/index-store.ts`,
    `src/application/ports/embedding-generator.ts`,
    `src/application/ports/vector-index-sink.ts`.

Checkpoint A: `npm run build && npm run check` sin cargar filesystem, SQLite ni
Transformers.js.

## Bloque B — Lectura y transformación

### B1. Resolución de layout de fuentes

- [x] Resolver una ruta de colección o su carpeta `videos/` al mismo layout
      canónico.
  - Depende de: A2 y A6.
  - Aceptación: devuelve `collectionPath`, `manifestPath` y `videosPath`
    absolutos; rechaza layouts ambiguos, inexistentes o sin manifest; no escribe.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/source-layout-resolver.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/filesystem/source-layout-resolver.ts`,
    `test/infrastructure/filesystem/source-layout-resolver.test.ts`.

### B2. Lectura del manifest

- [x] Leer y validar `manifest.json` desde datos `unknown`.
  - Depende de: A5, A6 y B1.
  - Aceptación: conserva los videos y recursos admitidos, ignora `pages`,
    rechaza IDs o slugs duplicados y produce errores con ruta y campo.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/manifest-reader.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/filesystem/manifest-reader.ts`,
    `test/infrastructure/filesystem/manifest-reader.test.ts`,
    `test/fixtures/indexing/manifest-mixed.json`,
    `test/fixtures/indexing/manifest-invalid.json`.

### B3. Parser de `context.md`

- [x] Convertir frontmatter y encabezados Markdown en un árbol neutral.
  - Depende de: A4 y A5.
  - Aceptación: soporta claves observadas, encabezados repetidos, saltos de nivel,
    texto anterior al primer heading y UTF-8; preserva contenido y orden.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/context-markdown-parser.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/filesystem/context-markdown-parser.ts`,
    `test/infrastructure/filesystem/context-markdown-parser.test.ts`,
    `test/fixtures/indexing/context-complex.md`.

### B4. Parser de `rules.json`

- [x] Convertir tesis, secciones, patrones y elementos hijos en un snapshot
      estructurado.
  - Depende de: A4 y A5.
  - Aceptación: cubre todas las formas observadas, valida IDs por video,
    preserva `source_basis`, evidencia, limitaciones y orden, y rechaza formas
    incompletas sin coerción silenciosa.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/rules-json-parser.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/filesystem/rules-json-parser.ts`,
    `test/infrastructure/filesystem/rules-json-parser.test.ts`,
    `test/fixtures/indexing/rules-complete.json`.

### B5. Metadata y lector de paquetes

- [x] Aplicar la allowlist de metadata y componer `PackageSourceReader` con los
      tres parsers.
  - Depende de: B1–B4.
  - Aceptación: selecciona identidad, creador, URL, duración, publicación,
    idiomas, tags, categorías y perfil visual; descarta campos volátiles; todas
    las rutas de evidencia quedan relativas al paquete.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/package-source-reader.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/filesystem/metadata-selector.ts`,
    `src/infrastructure/filesystem/filesystem-package-source-reader.ts`,
    `test/infrastructure/filesystem/package-source-reader.test.ts`,
    `test/fixtures/indexing/metadata-volatile.json`.

### B6. Constructor jerárquico de unidades

- [x] Transformar snapshots de contexto y reglas en `KnowledgeUnit`.
  - Depende de: A1–A6 y B3–B5.
  - Aceptación: genera documentos raíz, secciones, patrones e hijos con claves
    estables, padres válidos, headings, evidencia y contenido estructurado; una
    reconstrucción idéntica produce el mismo resultado.
  - Verificar: `node --import tsx --test test/application/indexing/build-knowledge-units.test.ts`
    y `npm run check`.
  - Archivos: `src/application/indexing/build-knowledge-units.ts`,
    `test/application/indexing/build-knowledge-units.test.ts`.

### B7. Fragmentación limitada por tokens

- [x] Transformar unidades searchable en `SearchFragment` mediante límites
      semánticos y conteo provisto por el puerto.
  - Depende de: A3, A6 y B6.
  - Aceptación: prioriza párrafos y listas, divide recursivamente bloques largos,
    conserva orden y contexto mínimo, no crea fragmentos vacíos y nunca supera
    `maxInputTokens`.
  - Verificar: `node --import tsx --test test/application/indexing/fragment-knowledge-units.test.ts`
    y `npm run check`.
  - Archivos: `src/application/indexing/fragment-knowledge-units.ts`,
    `test/application/indexing/fragment-knowledge-units.test.ts`.

Checkpoint B: una colección fixture produce snapshots, unidades y fragmentos
deterministas; un hash de todos los archivos fuente permanece idéntico.

## Bloque C — Embeddings

### C1. Adaptador E5 Small

- [x] Implementar `EmbeddingGenerator` para el modelo local aprobado.
  - Depende de: A3, A6 y B7.
  - Aceptación: declara clave, versión, dimensión 384 y límite real; usa prefijos
    E5 correctos para documentos y consulta; procesa lotes; normaliza y valida
    cada vector; permite inyectar el runtime para pruebas sin modelo.
  - Verificar: `node --import tsx --test test/infrastructure/embeddings/e5-embedding-generator.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/embeddings/e5-embedding-generator.ts`,
    `test/infrastructure/embeddings/e5-embedding-generator.test.ts`.

### C2. Smoke test local del modelo

- [x] Añadir un smoke test explícito que nunca se ejecute dentro de
      `npm run check`.
  - Depende de: C1.
  - Aceptación: usa sólo el modelo descargado, valida 384 valores finitos y
    similitud semántica básica; si falta el modelo, falla con instrucción clara y
    no intenta red.
  - Verificar: `npm run test:embedding:smoke` y después `npm run check`.
  - Archivos: `test/smoke/e5-embedding-generator.smoke.test.ts`, `package.json`,
    `docs/development.md`.

Checkpoint C: suite rápida offline aprobada y smoke local aprobado por separado.

## Bloque D — Persistencia

### D1. Apertura y migración SQLite inicial

- [x] Crear la base con schema versionado, foreign keys, WAL, tablas, índices y
      triggers FTS5 aprobados.
  - Depende de: A1–A6.
  - Aceptación: abrir dos veces es idempotente; esquema incompatible falla sin
    mutar; `foreign_key_check`, integridad y FTS5 quedan operativos.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/database-migration.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/sqlite/open-database.ts`,
    `src/infrastructure/sqlite/migrations/001-initial.ts`,
    `test/infrastructure/sqlite/database-migration.test.ts`.

### D2. Registro SQLite de fuentes

- [x] Implementar `SourceRegistry` sobre `node:sqlite` y su suite de contrato.
  - Depende de: D1 y B1.
  - Aceptación: add/list/get/remove son deterministas; nombre y rutas son únicos;
    remove sólo elimina derivados; ningún tipo SQLite cruza el puerto.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/sqlite-source-registry.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/sqlite/sqlite-source-registry.ts`,
    `test/contracts/source-registry.contract.ts`,
    `test/infrastructure/sqlite/sqlite-source-registry.test.ts`.

### D3. Estado de paquetes y runs

- [x] Implementar lectura de estado, inicio/cierre de `SyncRun` y registro de
      `SyncIssue` en `IndexStore`.
  - Depende de: D1 y A6.
  - Aceptación: reapertura conserva estado y contadores; issues se asocian al
    run correcto; un run fallido puede cerrarse sin inventar paquetes vistos.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/sqlite-index-store-runs.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/sqlite/sqlite-index-store.ts`,
    `test/contracts/index-store.contract.ts`,
    `test/infrastructure/sqlite/sqlite-index-store-runs.test.ts`.

### D4. Aplicación atómica de paquetes

- [x] Completar `IndexStore.applyPackage`, FTS5, embeddings BLOB y eliminación
      segura de ausentes.
  - Depende de: D3, B6, B7 y C1.
  - Aceptación: commit reemplaza todo el agregado; rollback conserva la versión
    anterior; FTS coincide con fragmentos; BLOB reabre como float32[384]; borrar
    ausentes exige un manifest válido y respeta fuente/run.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/sqlite-index-store-package.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/sqlite/sqlite-index-store.ts`,
    `src/infrastructure/sqlite/migrations/001-initial.ts`,
    `test/contracts/index-store.contract.ts`,
    `test/infrastructure/sqlite/sqlite-index-store-package.test.ts`.

Checkpoint D: contratos SQLite pasan en archivo temporal, después de reapertura,
rollback y `PRAGMA integrity_check`.

## Bloque E — Sincronización y CLI

### E1. Casos de uso de fuentes

- [ ] Implementar add/list/remove de fuentes contra `SourceRegistry` y el
      resolver de layout.
  - Depende de: A6, B1 y D2.
  - Aceptación: normaliza ambas formas de ruta, detecta duplicados, no toca el
    filesystem fuente y remove nunca elimina archivos.
  - Verificar: `node --import tsx --test test/application/sources/source-use-cases.test.ts`
    y `npm run check`.
  - Archivos: `src/application/sources/add-source.ts`,
    `src/application/sources/list-sources.ts`,
    `src/application/sources/remove-source.ts`,
    `test/application/sources/source-use-cases.test.ts`.

### E2. Caso de uso `sync`

- [ ] Orquestar manifest, hashes, parsing, unidades, fragmentos, embeddings,
      persistencia, issues, eliminaciones y publicación vectorial.
  - Depende de: B2–B7, C1, D3 y D4.
  - Aceptación: cubre inicial, `no_changes`, cambio, parcial, manifest inválido y
    eliminación; publica vectores sólo después del commit; continúa con otros
    paquetes tras un fallo aislado.
  - Verificar: `node --import tsx --test test/application/indexing/sync-source.test.ts`
    y `npm run check`.
  - Archivos: `src/application/indexing/sync-source.ts`,
    `test/fakes/in-memory-index-store.ts`,
    `test/fakes/fake-embedding-generator.ts`,
    `test/application/indexing/sync-source.test.ts`.

### E3. Composition root de indexación

- [ ] Conectar filesystem, E5 y SQLite en una fábrica de aplicación sin lógica
      de negocio nueva.
  - Depende de: E1 y E2.
  - Aceptación: configuración y rutas entran como valores; el wiring puede
    reemplazar cada adaptador; crear la aplicación no descarga ni sincroniza.
  - Verificar: `node --import tsx --test test/main/create-application.test.ts` y
    `npm run check`.
  - Archivos: `src/main/create-application.ts`,
    `test/main/create-application.test.ts`.

### E4. Parser y presentación de CLI

- [ ] Parsear los comandos administrativos con `node:util.parseArgs` y renderizar
      recibos/errores JSON.
  - Depende de: contrato CLI aprobado y E1–E3.
  - Aceptación: argumentos inválidos producen código 2; claves técnicas están en
    inglés; stdout contiene sólo JSON y stderr sólo progreso/diagnóstico; no hay
    interacción en comandos usados por agentes.
  - Verificar: `node --import tsx --test test/interfaces/cli/cli-contract.test.ts`
    y `npm run check`.
  - Archivos: `src/interfaces/cli/parse-command.ts`,
    `src/interfaces/cli/render-cli-output.ts`,
    `test/interfaces/cli/cli-contract.test.ts`.

### E5. Ejecutable `init`, `source` y `sync`

- [ ] Conectar el runner CLI, entry point ESM y metadatos del paquete.
  - Depende de: E3 y E4.
  - Aceptación: `init`, `source add/list/remove` y `sync` ejecutan casos de uso;
    códigos 0/1/2/130 coinciden con el contrato; importar módulos no ejecuta la
    CLI; el bin se llama `auto-youtube-rag`.
  - Verificar: `node --import tsx --test test/interfaces/cli/admin-commands.test.ts`,
    `npm run build` y `npm run check`.
  - Archivos: `src/interfaces/cli/run-cli.ts`, `src/main.ts`,
    `test/interfaces/cli/admin-commands.test.ts`, `package.json`,
    `package-lock.json`.

### E6. `status` y `doctor`

- [ ] Implementar diagnósticos de biblioteca y exponerlos mediante la CLI.
  - Depende de: D1–D4 y E5.
  - Aceptación: `status` informa contadores/modelo/schema; `doctor` comprueba
    paths, permisos de lectura, SQLite, FTS5, integridad y modelo sin mutar datos;
    fallos usan códigos simbólicos y `retryable` correcto.
  - Verificar: `node --import tsx --test test/interfaces/cli/status-and-doctor.test.ts`
    y `npm run check`.
  - Archivos: `src/application/diagnostics/get-status.ts`,
    `src/application/diagnostics/run-doctor.ts`,
    `src/interfaces/cli/run-cli.ts`,
    `test/interfaces/cli/status-and-doctor.test.ts`.

### E7. Integración extremo a extremo e inmutabilidad

- [ ] Verificar el punto 2.1 completo sobre una colección temporal reproducible.
  - Depende de: E1–E6.
  - Aceptación: alta, primera sync, repetición, modificación, paquete inválido y
    eliminación producen estados correctos; SQLite reabre consistente; hash y
    árbol de todos los archivos fuente son idénticos antes y después.
  - Verificar: `node --import tsx --test test/e2e/indexing-sync.e2e.test.ts`,
    `npm run test:coverage`, `npm run build` y `npm run check`.
  - Archivos: `test/helpers/create-test-collection.ts`,
    `test/e2e/indexing-sync.e2e.test.ts`.

Checkpoint E: todos los criterios de finalización de
[indexing-plan.md](indexing-plan.md) están cubiertos por pruebas automatizadas.

## Cierre del punto 2.1

Cuando A1–E7 estén completas:

1. ejecutar `npm run build`, `npm run check`, `npm run test:coverage` y
   `npm run test:embedding:smoke`;
2. ejecutar `doctor` y una sincronización sobre una copia temporal de una
   colección real;
3. actualizar [build.md](build.md) a 100% para 2.1 sólo si las cuatro capacidades
   resumidas están verificadas;
4. revisar que el worktree no contenga bases, modelos, resultados, `.env` ni
   artefactos locales;
5. preparar las evaluaciones funcionales antes de avanzar a recuperación 2.2.

## Decisiones solicitadas para aprobar las tareas

1. Ejecutar las 26 tareas en el orden A1–E7, respetando dependencias.
2. Aceptar que una tarea pueda modificar un archivo tocado por una tarea previa,
   pero nunca más de cinco archivos por tarea.
3. Mantener `build.md` como tracker de etapas y este archivo como checklist fino.
4. Exigir `npm run build` y `npm run check` en cada commit, además del test
   específico.
5. No iniciar el bloque siguiente hasta aprobar el checkpoint del anterior.
