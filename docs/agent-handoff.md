# Relevo detallado para continuar `auto-youtube-rag`

## Propósito de este documento

Este documento permite que un agente nuevo retome el proyecto sin depender de
la conversación que lo originó. Describe el objetivo del producto, el estado
exacto del repositorio, las decisiones confirmadas, la arquitectura ya
implementada, las invariantes que no deben romperse, las validaciones realizadas
y el siguiente bloque recomendado.

Estado de referencia: **12 de agosto de 2026**, después de completar el punto
2.2 — recuperación híbrida.

## Datos rápidos

| Dato                      | Valor                                                                    |
| ------------------------- | ------------------------------------------------------------------------ |
| Proyecto                  | `auto-youtube-rag`                                                       |
| Repositorio               | `C:\Users\lucho\Desktop\Programacion\fast-weekend-core\auto-youtube-rag` |
| Rama actual               | `feat/sqlite-vec-benchmark`                                              |
| Último commit documentado | `8fa0fa7 test(e2e): verify hybrid retrieval end to end`                  |
| Estado Git al cerrar      | Worktree limpio                                                          |
| Runtime                   | Node.js 24.19.0 LTS, ESM                                                 |
| Lenguaje                  | TypeScript 6.0.3 estricto                                                |
| Persistencia              | SQLite mediante `node:sqlite`                                            |
| Modelo                    | `Xenova/multilingual-e5-small`, revisión `main`, cuantización `q8`       |
| Dimensión                 | 384                                                                      |
| Caché aproximada          | 129 MB en `.cache/models`                                                |
| Operación                 | Exclusivamente local; sin APIs externas                                  |
| Próximo punto             | 2.3 — ensamblado de contexto                                             |

La rama conserva el nombre de un benchmark anterior. No asumas que el proyecto
está trabajando actualmente en `sqlite-vec`: esa opción fue evaluada y
descartada para el MVP. No renombres la rama ni reescribas historial sin
autorización explícita.

## Orden de lectura recomendado

Antes de modificar código, leer en este orden:

1. `docs/product-spec.md`: objetivo, alcance, límites y producto completo.
2. `docs/decisions.md`: decisiones confirmadas y alternativas descartadas.
3. `docs/cli-contract.md`: contrato público aprobado, incluso comandos futuros.
4. `docs/build.md`: tracker de etapas y porcentaje real.
5. `docs/indexing-design.md`: modelo lógico y arquitectura del punto 2.1.
6. `docs/indexing-plan.md`: estrategia por bloques A–E.
7. `docs/indexing-tasks.md`: checklist fino ya completado para 2.1.
8. `docs/retrieval-design.md`: contratos, adaptadores y política de fusión del
   punto 2.2, ya completado.
9. `docs/retrieval-tasks.md`: checklist fino completado F1–H5 para 2.2.
10. Este documento: estado operativo, gotchas y arranque de 2.3.

`docs/development.md` sigue siendo la referencia del toolchain. Su frase que
describe `src/main.ts` como un scaffold quedó históricamente desactualizada: la
CLI administrativa ya está implementada y probada.

## Objetivo del producto

El sistema construye una biblioteca local consultable a partir de los paquetes
autónomos generados por la skill de contexto de videos. No intenta responder con
un LLM interno. El agente que consulta —Codex, Claude u otro— es el único cerebro
generativo.

El producto debe recuperar contexto amplio, ordenado, citado y con procedencia.
No está diseñado sólo para encontrar una coincidencia puntual. Por ejemplo, una
consulta sobre un estilo de diseño debe entregar suficiente contexto relacionado
para que el agente pueda razonar correctamente sobre hechos, reglas, patrones,
limitaciones y evidencia.

El MVP es para agentes, no para búsqueda humana. La integración aprobada es una
CLI consumida por una única skill portable. MCP, API, interfaz web y soporte de
paquetes de páginas web quedan para fases posteriores.

## Alcance de las fuentes

Cada raíz registrada sigue la estructura producida por la skill de videos:

```text
collection/
  manifest.json
  videos/
    <slug>/
      deliverables/context.md
      deliverables/rules.json
      source/metadata.json
      ...otros archivos no indexados por el MVP
```

Se indexan:

- `manifest.json` como inventario autoritativo;
- `context.md` como conocimiento narrativo principal;
- `rules.json` como conocimiento estructurado de patrones;
- una allowlist estable de `metadata.json` para filtros y procedencia.

No se indexan como conocimiento:

- transcripciones redundantes;
- subtítulos equivalentes en varios formatos;
- imágenes o frames por nombre de archivo;
- páginas web del manifest;
- metadata volátil completa de yt-dlp;
- videos fuente.

Las rutas de evidencia visual y timestamps existentes sí se preservan dentro de
las unidades para futuras citas o inspección.

## Decisiones confirmadas que no deben reabrirse sin motivo

- Ejecución local exclusiva.
- TypeScript sobre Node 24.19.0; no Go ni Rust para este MVP.
- SQLite, no PostgreSQL.
- `node:sqlite` como cliente; `better-sqlite3` sólo permanece por benchmarks
  históricos.
- FTS5 para recuperación textual.
- E5 Small multilingüe `q8` para documentos y consultas.
- Vectores persistidos como BLOB `Float32Array` little-endian y búsqueda exacta
  en memoria durante el MVP.
- `sqlite-vec` no se integra inicialmente: el benchmark no justificó asumir su
  inestabilidad y complejidad operativa en este punto.
- Dominio y aplicación no conocen SQLite, Transformers.js ni formatos de
  archivo.
- Una sola skill general para Codex, Claude y futuros agentes.
- CLI con `node:util.parseArgs` estricto, sin framework adicional.
- Códigos de proceso públicos: `0`, `1`, `2`, `130`.
- Claves técnicas y códigos simbólicos en inglés; contenido en su idioma
  original.
- Los paquetes fuente son inmutables.
- Las evaluaciones de recuperación se preparan antes de cerrar el MVP.

El único asunto de producto todavía abierto en `product-spec.md` es la política
de combinación y reranking de resultados.

## Estado completado

### Definición y stack

- Repositorio, especificaciones y tracker creados.
- Contrato CLI y esquemas de salida aprobados.
- Benchmarks de modelos realizados; E5 Small seleccionado.
- Benchmark de `sqlite-vec` frente a búsqueda exacta realizado; exacta elegida.
- Benchmark de clientes SQLite realizado; `node:sqlite` elegido.
- Toolchain fijado y reproducible.

### Punto 2.1 — indexación incremental

Los bloques A–E están completados:

- A: identidades, entidades, contenido, runs, issues, puertos y cambios
  atómicos.
- B: layout, manifest, Markdown, reglas, metadata, lector de paquetes, unidades
  y fragmentación.
- C: adaptador local E5 y smoke offline.
- D: esquema SQLite, registro de fuentes, estado, runs, issues, reemplazo
  transaccional, FTS5 y embeddings.
- E: casos de uso de fuentes, orquestador `sync`, composition root, CLI,
  `status`, `doctor` y E2E.

### Punto 2.2 — recuperación híbrida

Los bloques F–H están completados:

- F: value objects de consulta/filtro/límites, puertos de recuperación
  (`TextSearchIndex`, `VectorSearchIndex`, `KnowledgeRepository`) y fusión RRF
  ponderada.
- G: sanitizador de consultas FTS5, adaptador textual sobre `fragment_fts`,
  índice vectorial exacto en memoria y repositorio de conocimiento SQLite.
- H: selección (dedupe + diversidad), caso de uso `retrieveCandidates`,
  cableado en el composition root y E2E completo.

Detalle completo, decisiones y notas de implementación en la sección
["Punto 2.2 completado"](#punto-22-completado--recuperación-híbrida) más abajo,
y en `docs/retrieval-design.md` / `docs/retrieval-tasks.md`.

`docs/build.md` marca 2.1 y 2.2, y las pruebas funcionales actuales, al 100%.

## Arquitectura implementada

Inventario completo de `src/` a la fecha de este documento (52 archivos). Un
agente frío puede confiar en esta lista en vez de explorar el árbol de nuevo;
si diverge de la realidad, el árbol manda y esta lista está desactualizada.

### Dominio — `src/domain`

No importa infraestructura.

`src/domain/indexing/`:

- identificadores (`identifiers.ts`): `SourceName`, `VideoId`, `PackageRef`,
  `DocumentId`, `KnowledgeUnitId`, `SearchFragmentId`, `SyncId`;
- entidades: `source-root.ts`, `video-package.ts`, `source-document.ts`,
  `knowledge-unit.ts`, `search-fragment.ts`, `embedding-record.ts`,
  `sync-run.ts` (incluye `SyncIssue`);
- `content-identity.ts`: SHA-256 y claves estructurales deterministas
  (`createMarkdownSectionKey`, `createRulePatternKey`, `createRuleChildKey`,
  `createFragmentKey`);
- `domain-error.ts`: `DomainValidationError` con códigos simbólicos
  compartidos por todo el dominio (`INVALID_IDENTIFIER`,
  `INVALID_PACKAGE_REF`, `INVALID_RETRIEVAL_QUERY`).

Identidad importante: un paquete es `(source_name, video_id)`. El slug sólo
localiza el directorio y puede cambiar.

`src/domain/retrieval/` (nuevo en 2.2):

- `retrieval-query.ts`: `RetrievalQuery`, `RetrievalLimits`, normalización NFC
  y tope de 1000 caracteres;
- `retrieval-filter.ts`: `RetrievalFilter`, deduplicación de criterios y
  comparación de idioma en minúsculas.

### Aplicación — `src/application`

Puertos actuales (`src/application/ports/`):

- `package-source-reader.ts` → `PackageSourceReader`;
- `source-registry.ts` → `SourceRegistry`;
- `index-store.ts` → `IndexStore`;
- `embedding-generator.ts` → `EmbeddingGenerator`;
- `vector-index-sink.ts` → `VectorIndexSink` (sólo escritura; sigue existiendo
  como base de `VectorSearchIndex`, no lo reemplaza `sync` directamente);
- `text-search-index.ts` → `TextSearchIndex` (nuevo en 2.2);
- `vector-search-index.ts` → `VectorSearchIndex` (nuevo en 2.2; extiende
  `VectorIndexSink` con `load` y `search`);
- `knowledge-repository.ts` → `KnowledgeRepository` (nuevo en 2.2).

Casos de uso y políticas puras:

- `src/application/sources/`: `add-source.ts`, `list-sources.ts`,
  `remove-source.ts`;
- `src/application/indexing/`: `build-knowledge-units.ts`,
  `fragment-knowledge-units.ts`, `sync-source.ts` (orquestador `syncSource`),
  `package-snapshots.ts`, `indexed-package-change.ts`;
- `src/application/diagnostics/`: `get-status.ts`, `run-doctor.ts`;
- `src/application/retrieval/` (nuevo en 2.2): `retrieval-results.ts` (tipos
  compartidos `RankedHit`, `FusedHit`, `CandidateProvenance`,
  `RetrievalCandidate`, `RetrievalOutcome`), `fusion-strategy.ts` (puerto
  `FusionStrategy`), `rrf-fusion.ts` (`createRrfFusion`),
  `select-candidates.ts` (`selectCandidates`, dedupe + diversidad),
  `retrieve-candidates.ts` (`retrieveCandidates`, el orquestador de 2.2).

El orquestador sólo conoce puertos. Tests de aplicación usan fakes
(`test/fakes/`) y no cargan SQLite ni el modelo real.

### Infraestructura — `src/infrastructure`

Filesystem (`src/infrastructure/filesystem/`):

- `source-layout-resolver.ts`: resolución canónica de colección o carpeta
  `videos/`;
- `manifest-reader.ts`: parsing del manifest;
- `context-markdown-parser.ts`, `rules-json-parser.ts`: parsing de
  `context.md` y `rules.json`;
- `metadata-selector.ts`: selección de metadata estable;
- `filesystem-package-source-reader.ts`: lectura completa de paquetes sin
  escrituras.

Embeddings (`src/infrastructure/embeddings/e5-embedding-generator.ts`):

- `E5EmbeddingGenerator` carga perezosamente;
- prefijos E5: `passage:` y `query:` (el prefijo `query:` lo aplica el
  adaptador dentro de `embedQuery`; el caso de uso de recuperación pasa el
  texto crudo);
- límite declarado: 512 tokens;
- lotes configurables;
- vectores normalizados y validados;
- runtime forzado a local mediante `env.allowRemoteModels = false` y
  `env.cacheDir` antes de crear el pipeline.

SQLite (`src/infrastructure/sqlite/`):

- `open-database.ts`: apertura con WAL y foreign keys;
- `migrations/001-initial.ts`: migración inicial versionada;
- `sqlite-source-registry.ts`: registro de fuentes;
- `sqlite-index-store.ts`: estado de paquetes y runs, aplicación
  transaccional completa;
- `sqlite-diagnostics.ts`: diagnósticos read-only para `status`/`doctor`;
- `fts-query-sanitizer.ts` (nuevo en 2.2): traduce texto libre a una expresión
  `MATCH` segura, tokenizando por letras/números y citando cada token;
- `sqlite-text-search-index.ts` (nuevo en 2.2): `SQLiteTextSearchIndex`,
  consulta `fragment_fts` con `bm25()` ponderado por columna;
- `sqlite-knowledge-repository.ts` (nuevo en 2.2): `SQLiteKnowledgeRepository`,
  procedencia por lote, unidades y ancestros.

Vector (`src/infrastructure/vector/`, nuevo en 2.2):

- `sqlite-vector-loader.ts`: `SQLiteVectorSource`, decodifica BLOBs float32
  little-endian desde `embeddings`;
- `in-memory-vector-search-index.ts`: `InMemoryVectorSearchIndex`, matriz
  contigua, carga perezosa, producto punto sobre vectores normalizados.

### Interfaz — `src/interfaces/cli`

- `parse-command.ts`: argumentos estrictos con `parseArgs`.
- `render-cli-output.ts`: JSON compacto versionado.
- `run-cli.ts`: ejecución de casos de uso y códigos de salida.
- `src/main.ts`: entry point ESM y configuración por entorno.

Sin cambios en 2.2: la CLI no expone `retrieve` todavía (ver
["CLI implementada y CLI futura"](#cli-implementada-y-cli-futura)).

### Composition root — `src/main/create-application.ts`

Conecta adaptadores concretos y permite reemplazarlos mediante overrides
(`ApplicationOverrides`). Crear la aplicación no descarga modelos, no
sincroniza y no carga vectores. El modelo se carga sólo al contar tokens o
generar embeddings; el índice vectorial se carga sólo en la primera consulta o
`sync`.

Cambio importante de 2.2: **`MemoryVectorIndexSink` fue eliminado.** El campo
`vectorIndex` de `Application` ahora es un `VectorSearchIndex`
(`InMemoryVectorSearchIndex` sobre `SQLiteVectorSource` por defecto). La misma
instancia recibe los cambios que publica `sync` y sirve las consultas de
`retrieveCandidates`, así que un cambio confirmado y una consulta nunca pueden
ver vectores distintos. Si encontrás referencias a `MemoryVectorIndexSink` en
código o memoria de sesiones viejas, están obsoletas.

`Application` expone ahora `retrieveCandidates(query: RetrievalQuery):
Promise<RetrievalOutcome>`, además de `vectorIndex`, `textSearchIndex` y
`knowledgeRepository` como propiedades reemplazables.

## Flujo exacto de `retrieveCandidates` (2.2)

1. Normalizar y validar la consulta ya llegó resuelta como `RetrievalQuery`
   (el dominio ya garantiza texto no vacío, NFC, ≤1000 caracteres).
2. Lanzar `textIndex.search` y (`embeddingGenerator.describe` +
   `embeddingGenerator.embedQuery` + `vectorIndex.load` +
   `vectorIndex.search`) en paralelo.
3. Si una vía falla, capturar el error, agregar un `RetrievalWarning` con
   código `TEXT_SEARCH_UNAVAILABLE` o `VECTOR_SEARCH_UNAVAILABLE` y continuar
   con hits vacíos de esa vía. Nunca aborta la consulta completa.
4. Fusionar ambas listas de `RankedHit` con `FusionStrategy` (RRF ponderado
   por defecto) → `FusedHit[]`.
5. Hidratar procedencia del conjunto fusionado completo con
   `knowledgeRepository.getFragmentProvenance` en un solo lote (acotado por
   `textCandidates + vectorCandidates`). Un `FusedHit` sin procedencia
   (fragmento borrado justo antes de esta consulta) se descarta.
6. `selectCandidates`: deduplicar por `unitId` (conserva el de mejor score),
   diversificar con `maxPerVideo`, truncar a `fusedResults`.
7. Devolver `RetrievalOutcome` con `status` (`"ok"` o `"no_results"`),
   `candidates`, `metrics` y `warnings`.

**Gotcha crítico para 2.3:** la búsqueda vectorial no tiene piso de similitud
(ver la sección de decisiones de 2.2 más abajo). `status: "ok"` con candidatos
de relevancia real baja es un resultado válido y esperado, no un bug. 2.3 no
debe asumir que todo candidato devuelto es necesariamente relevante.

## Flujo exacto de `sync`

1. Crea y persiste un `SyncRun` en estado `running`.
2. Lee y valida el manifest completo.
3. Si el manifest falla, registra issue, cierra `failed` y no elimina paquetes.
4. Obtiene descriptor de modelo y referencias persistidas.
5. Por cada video, lee el paquete y calcula hash sobre documentos/versiones.
6. Si no cambió, ejecuta `markPackageSeen` con el run actual; no recalcula
   unidades ni embeddings.
7. Si cambió, construye unidades, fragmenta bajo el tokenizador real, genera
   embeddings y prepara el cambio completo.
8. `applyPackage` reemplaza paquete y derivados en una única transacción.
9. Sólo después del commit publica el cambio al sink vectorial.
10. Un fallo aislado registra issue; si existía una versión válida, la marca
    vista para conservarla.
11. Después de un manifest válido elimina paquetes no vistos.
12. Publica removals vectoriales y cierra el run como `ok` o `partial`.
13. Si no hubo indexaciones ni borrados devuelve `no_changes`.

## Esquema SQLite actual

Versión: `1`.

Tablas principales:

- `schema_meta`;
- `sources`;
- `sync_runs`;
- `video_packages`;
- `source_documents`;
- `knowledge_units`;
- `search_fragments`;
- `embeddings`;
- `sync_issues`.

Tabla virtual: `fragment_fts`, external-content sobre `search_fragments`.

Triggers: insert, update y delete mantienen FTS5 alineado. Las eliminaciones de
paquetes usan cascadas y `last_seen_sync_id`. Los embeddings incluyen modelo,
versión, dimensión, hash y BLOB.

**2.2 no agregó ninguna migración ni tabla.** Los adaptadores de recuperación
leen el esquema tal cual quedó en 2.1. Los identificadores de dominio de
fragmento y documento (`SearchFragmentId`, `DocumentId`) no tienen columna
propia: se reconstruyen en cada adaptador a partir de columnas existentes
(`knowledge_units.stable_key`, `search_fragments.ordinal`, `sources.name`,
`video_packages.video_id`, `source_documents.kind`). Antes de proponer
persistirlos explícitamente, leer la nota completa en
`docs/retrieval-design.md` — a la escala actual (~3.000 fragmentos) no hace
falta, y agregar una columna es un cambio de esquema que requiere aprobación
explícita según los invariantes del proyecto.

## CLI implementada y CLI futura

Implementado actualmente:

```text
auto-youtube-rag init
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>]
auto-youtube-rag status
auto-youtube-rag doctor
```

Todavía no implementado, aunque el contrato público ya está aprobado:

```text
auto-youtube-rag retrieve <query> [options]
auto-youtube-rag rebuild --confirm
```

No anuncies `retrieve` como disponible hasta completar 2.3. 2.2 entregó todo el
motor de recuperación (`retrieveCandidates`) pero deliberadamente sin
superficie de CLI: ver la decisión en la sección de 2.2 más abajo.

## Configuración de ejecución

Por defecto:

- base: `<cwd>/.auto-youtube-rag/index.sqlite`;
- modelo: `<cwd>/.cache/models`.

Variables admitidas:

```text
AUTO_YOUTUBE_RAG_HOME
AUTO_YOUTUBE_RAG_MODEL_CACHE
```

El modelo esperado existe bajo:

```text
.cache/models/Xenova/multilingual-e5-small/
  config.json
  tokenizer.json
  tokenizer_config.json
  onnx/model_quantized.onnx
```

Si falta, ejecutar `npm run models:download`. El producto no debe descargar
durante `sync`, `doctor` ni tests normales.

## Comandos de desarrollo y calidad

```powershell
cd C:\Users\lucho\Desktop\Programacion\fast-weekend-core\auto-youtube-rag
node --version
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run format:check
npm.cmd run check
npm.cmd run build
npm.cmd run test:coverage
npm.cmd run test:embedding:smoke
```

En PowerShell puede ser necesario usar `npm.cmd` porque la política de ejecución
puede bloquear `npm.ps1`.

`npm run check` omite la inferencia real mediante el patrón `smoke`. El smoke de
E5 se ejecuta explícitamente y nunca debe depender de red.

## Última validación conocida

### Puerta final de 2.1 (11 de agosto de 2026)

- 91 tests aprobados;
- cobertura: 93,90% líneas, 81,73% ramas, 98,17% funciones;
- `npm run build`: aprobado;
- `npm run check`: aprobado;
- `npm run test:embedding:smoke`: aprobado con E5 local;
- worktree limpio.

Validación sobre una copia temporal de los recursos indexables de la colección
real `auto-design`:

- 34 videos observados;
- 34 paquetes persistidos;
- 102 documentos;
- 2.965 unidades de conocimiento;
- 2.967 fragmentos y embeddings con el tokenizador real;
- segundo `sync`: 34 unchanged, 0 indexed, estado `no_changes`;
- `doctor`: integridad, foreign keys, FTS5, fuente y modelo en `ok`;
- digest SHA-256 del árbol fuente idéntico antes y después.

La copia y su base temporal fueron eliminadas tras validar.

### Puerta final de 2.2 (12 de agosto de 2026)

- 151 tests aprobados (91 heredados de 2.1 + 60 nuevos de recuperación);
- cobertura: 94,66% líneas, 84,25% ramas, 98,23% funciones;
- `npm run build`: aprobado;
- `npm run check`: aprobado;
- `npm run test:coverage`: aprobado;
- `test/e2e/retrieval.e2e.test.ts` aprobado sobre SQLite real (no fakes),
  fixture de dos fuentes, sin modelo E5 real (embedding determinista por
  palabra clave, ver el propio archivo);
- worktree limpio.

**No se ejecutó una validación sobre la colección real `auto-design` con el
modelo E5 real.** Fue una decisión explícita del usuario el 12 de agosto de
2026: avanzar a 2.3 sin correr esa confirmación. No es un olvido ni un
pendiente urgente — no la ejecutes de oficio al retomar el proyecto. Si en
algún momento se necesita (por ejemplo, antes de evaluaciones reales en 3.2, o
si aparece un bug que sólo se manifiesta con datos reales), el patrón a seguir
es el mismo que documentó la puerta de 2.1: copiar la colección a un directorio
temporal, sincronizar con el modelo real (ya cacheado en `.cache/models`),
correr consultas de `evals/queries/seed-queries.json` contra
`retrieveCandidates`, revisar cualitativamente, verificar el digest SHA-256 del
árbol fuente antes/después, y borrar la copia y la base temporal al terminar.

## Bugs importantes ya corregidos

### Paquetes sin cambios eliminados accidentalmente

Un paquete unchanged debe actualizar `last_seen_sync_id`. Para eso existen
`listPackageRefs` y `markPackageSeen`. No elimines esta operación ni vuelvas a
derivar “visto” sólo desde reemplazos.

### Preflight de Transformers.js intentaba red

En Transformers.js 4.2, `pipeline()` realiza inspecciones antes de propagar
`local_files_only`. El adaptador configura el entorno global local antes de
crear el pipeline. Mantener esta secuencia o el smoke puede intentar Hugging
Face y producir tokenizer nulo.

### Slugs Unicode inconsistentes

Manifest y dominio deben aceptar la misma forma canónica Unicode. El paquete
real `7-estilos-de-diseño-gráfico-que-no-conocías` es la regresión. No volver a
un patrón ASCII.

## Invariantes y límites obligatorios

- Nunca escribir, mover ni eliminar archivos de las fuentes registradas.
- Nunca interpretar un manifest ilegible como eliminación masiva.
- Nunca publicar cambios vectoriales antes del commit SQLite.
- Nunca perder la última versión válida por un fallo parcial.
- Nunca acoplar dominio o aplicación a SQLite, Transformers.js o Node paths.
- Nunca persistir `.env`, cookies, headers, URLs temporales ni metadata cruda.
- Nunca descargar el modelo implícitamente durante tests o uso normal.
- Nunca cambiar esquema, modelo/dimensión o dependencia nativa sin aprobación.
- Mantener commits convencionales pequeños mediante la skill `git-commit`.
- Antes de cada commit ejecutar al menos el test específico, `npm run check` y
  `npm run build` según el riesgo.
- Preservar stdout JSON y stderr para progreso.

Invariantes propias de recuperación (2.2):

- Nunca comparar `rawScore` entre la vía textual y la vectorial: BM25 no tiene
  cota y coseno vive en `0..1`. Sólo se comparan posiciones (rangos).
- Nunca asumir que la búsqueda vectorial tiene un piso de similitud: siempre
  devuelve algo si la biblioteca (tras filtros) no está vacía.
- Nunca exponer `retrieve` en la CLI ni anunciarlo como disponible hasta cerrar
  2.3.
- Nunca dejar que `sync` y `retrieveCandidates` usen instancias distintas del
  índice vectorial: deben compartir la misma para que un cambio publicado y una
  consulta nunca vean vectores diferentes.

## Punto 2.2 completado — recuperación híbrida

Bloques F–H están completados (contratos, adaptadores, orquestación). Detalle
completo en `docs/retrieval-design.md` y `docs/retrieval-tasks.md`.

Decisiones cerradas durante 2.2 que no deben reabrirse sin motivo:

- Fusión: RRF ponderado (`k = 60`, `wText = wVector = 1.0`) detrás de
  `FusionStrategy`, sustituible para la calibración de 3.2. Se descartó la
  cascada porque descarta hits exclusivos de una vía sin ganar rendimiento a
  esta escala.
- `VectorIndexSink` fue reemplazado por `VectorSearchIndex` en `sync` y en la
  aplicación: una sola instancia (`InMemoryVectorSearchIndex`) recibe los
  cambios publicados y sirve las consultas, así que nunca pueden divergir.
- Los identificadores de fragmento y documento **no se persisten**; son
  funciones puras de columnas que sí existen (`fragment:sha256(unitId):ordinal`
  y `document:<source>:<video>:<kind>`). Los adaptadores los reconstruyen. Ver
  la nota en `retrieval-design.md` antes de considerar un cambio de esquema.
- El índice vectorial invalida su snapshot completo en `apply` en vez de
  parchear: `VectorIndexChange` no transporta tipo de unidad ni idioma, y un
  parche dejaría entradas nuevas imposibles de filtrar.
- La hidratación de procedencia ocurre **antes** de deduplicar y diversificar,
  no después como sugería el primer borrador del diseño: `RankedHit` sólo lleva
  `fragmentId`, y ni la deduplicación por `unitId` ni la diversidad por video
  son posibles sin conocer la procedencia.
- **La búsqueda vectorial no tiene piso de similitud.** Es un ranking
  exhaustivo: toda consulta sobre una biblioteca no vacía (tras filtros)
  devuelve candidatos, aunque la similitud real sea baja. `status: "no_results"`
  sólo ocurre si el filtro deja la biblioteca vacía o si ambas vías fallan. Un
  umbral mínimo queda pendiente de calibración en 3.2.
- 2.2 no expone superficie de CLI. `retrieve` sigue sin anunciarse hasta cerrar
  2.3.

Validación completa, incluida la decisión explícita de no correr la pasada
cualitativa sobre la colección real, en
["Última validación conocida"](#última-validación-conocida) → "Puerta final de
2.2".

## Próximo trabajo: punto 2.3 — ensamblado de contexto

No existe todavía un checklist fino aprobado para 2.3. Antes de implementar,
crear y revisar diseño y tareas siguiendo el mismo patrón que
`retrieval-design.md`/`retrieval-tasks.md`. Por `product-spec.md` y
`cli-contract.md`, 2.3 debe:

- expandir candidatos a sus unidades padre usando
  `KnowledgeRepository.getAncestors`, ya implementado en 2.2;
- deduplicar contenido repetido tras la expansión;
- aplicar presupuestos por profundidad (`focused` 12k / `balanced` 32k /
  `deep` 64k tokens estimados, ajustables por evaluación);
- preservar citas `[S01]` resueltas contra `CandidateProvenance` y
  limitaciones cuando la evidencia sea insuficiente;
- ensamblar `context.md` y `result.json` según el contrato ya aprobado en
  `cli-contract.md`;
- recién ahí implementar el comando `retrieve` de la CLI.

`RetrievalOutcome.candidates` de 2.2 es la materia prima: cada candidato ya
trae procedencia completa (encabezados, tipo de unidad, documento, paquete,
creador, timestamps, evidencia visual) y texto citable.

## Primer turno recomendado para el próximo agente

1. Confirmar `git status --short` vacío y revisar los últimos commits.
2. Ejecutar `npm.cmd run check` y `npm.cmd run build`.
3. Leer los diez documentos indicados al inicio.
4. Inspeccionar `retrieve-candidates.ts`, `select-candidates.ts`,
   `sqlite-knowledge-repository.ts` y `create-application.ts`.
5. No empezar código directamente: proponer el diseño y checklist fino de 2.3.
6. Resolver con el usuario los presupuestos de profundidad si las evaluaciones
   de 3.2 sugieren ajustarlos antes de fijar el ensamblado.
7. Implementar en cortes de máximo cinco archivos por tarea, conservando
   arquitectura y commits convencionales.

Prompt sugerido para retomar:

> Retoma `auto-youtube-rag` desde `docs/agent-handoff.md`. Verifica primero el
> estado del repositorio y las pruebas. El punto 2.2 está terminado; planifica
> 2.3 — ensamblado de contexto — con expansión a unidades padre, deduplicación,
> presupuestos por profundidad, citas y el comando `retrieve` de la CLI. No
> implementes hasta presentar y aprobar el checklist detallado.

## Historial reciente relevante

```text
8fa0fa7 test(e2e): verify hybrid retrieval end to end
9f77192 feat(main): compose retrieval adapters into the application
639fa56 feat(retrieval): orchestrate candidate selection and retrieval
bb88f27 feat(retrieval): read provenance and unit hierarchy
709a3c5 feat(retrieval): search vectors with an exact in-memory index
aa517bc feat(retrieval): search fragments through FTS5
59f5090 feat(retrieval): sanitize queries for the FTS5 grammar
faed06f feat(retrieval): fuse ranked hits with weighted RRF
2495cc9 feat(retrieval): declare hybrid retrieval ports
3d85c3a feat(retrieval): validate retrieval queries and filters
ba132e9 docs(retrieval): propose hybrid retrieval design
ed89878 docs(progress): complete synchronization phase
35ef5d1 fix(domain): accept canonical unicode slugs
b902d0c fix(embeddings): enforce offline model loading
705a444 test(e2e): verify incremental indexing workflow
7a498fb feat(diagnostics): add status and doctor commands
d82092c feat(cli): add administrative executable
193a067 feat(cli): parse administrative commands
e467252 feat(main): compose indexing application
b0e5c0b feat(indexing): orchestrate incremental source sync
6f0fb10 fix(indexing): preserve unchanged packages during sync
be34690 feat(sources): add source management use cases
2fb1510 docs(progress): complete persistence block
8c629c1 feat(sqlite): apply package updates atomically
f5ed973 feat(sqlite): persist sync runs and package state
7f33d19 feat(sqlite): persist source registry
2cdc17a feat(sqlite): add initial database migration
2213542 test(embeddings): add offline E5 smoke test
96fa2dc feat(embeddings): add local E5 generator
160c415 feat(application): fragment knowledge units by tokens
f862982 feat(application): build hierarchical knowledge units
```

## Definición de éxito del relevo

Un agente está correctamente situado cuando puede explicar, antes de escribir
código:

1. por qué el agente consultante es el único LLM;
2. por qué existen `KnowledgeUnit` y `SearchFragment` separados;
3. cómo `sync` preserva paquetes válidos ante fallos;
4. por qué los paquetes fuente son estrictamente read-only;
5. cómo se mantienen alineados SQLite, FTS5 y embeddings;
6. por qué la búsqueda vectorial inicial será exacta y reemplazable;
7. qué parte corresponde a 2.3 y qué ya entregó 2.2;
8. por qué RRF ponderado es el baseline de fusión y qué queda pendiente de
   calibrar en 3.2;
9. por qué la búsqueda vectorial no tiene piso de similitud y qué implica eso
   para `status: "no_results"`;
10. por qué los identificadores de fragmento y documento son derivados en vez
    de persistidos, y qué adaptadores dependen de esa reconstrucción.
