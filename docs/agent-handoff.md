# Relevo detallado para continuar `auto-youtube-rag`

## Propósito de este documento

Este documento permite que un agente nuevo retome el proyecto sin depender de
la conversación que lo originó. Describe el objetivo del producto, el estado
exacto del repositorio, las decisiones confirmadas, la arquitectura ya
implementada, las invariantes que no deben romperse, las validaciones realizadas
y el siguiente bloque recomendado.

Estado de referencia: **13 de agosto de 2026**, después de cerrar el punto
3.2 — evaluaciones del MVP. El MVP completo descrito en `product-spec.md`
(2.1–2.4 y 3.1–3.2) está terminado. El comando `retrieve` de la CLI y la
skill portable (`skill/SKILL.md`) están implementados, probados y anunciados
como disponibles; las evaluaciones de recuperación y ensamblado están
corridas sobre la colección real con resultado documentado. No hay ningún
bloque abierto en `docs/build.md`. El trabajo que sigue —si el usuario lo
pide— es explícitamente posterior al MVP (ver "Trabajo posterior razonable,
fuera de este MVP" más abajo), no un pendiente urgente.

## Datos rápidos

| Dato                      | Valor                                                                           |
| ------------------------- | ------------------------------------------------------------------------------- |
| Proyecto                  | `auto-youtube-rag`                                                              |
| Repositorio               | `C:\Users\lucho\Desktop\Programacion\fast-weekend-core\auto-youtube-rag`        |
| Rama actual               | `feat/sqlite-vec-benchmark`                                                     |
| Último commit documentado | `4b8cbcf docs(evals): resolve O1, keep RRF weights and depth budgets unchanged` |
| Estado Git al cerrar      | Worktree limpio                                                                 |
| Runtime                   | Node.js 24.19.0 LTS, ESM                                                        |
| Lenguaje                  | TypeScript 6.0.3 estricto                                                       |
| Persistencia              | SQLite mediante `node:sqlite`                                                   |
| Modelo                    | `Xenova/multilingual-e5-small`, revisión `main`, cuantización `q8`              |
| Dimensión                 | 384                                                                             |
| Caché aproximada          | 129 MB en `.cache/models`                                                       |
| Operación                 | Exclusivamente local; sin APIs externas                                         |
| Estado del MVP            | Completo — 2.1–2.4 y 3.1–3.2 al 100% en `docs/build.md`                         |
| Próximo punto             | Ninguno abierto; ver "Trabajo posterior razonable" al final                     |

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
10. `docs/context-assembly-design.md`: contratos, capas, expansión,
    deduplicación, presupuesto, citas y contrato de bundle del punto 2.3, ya
    completado.
11. `docs/context-assembly-tasks.md`: checklist fino completado I1–L3 para
    2.3.
12. `skill/SKILL.md`: skill portable ya verificada, punto 2.4 completado.
13. `docs/eval-design.md`: diseño de dos capas de evaluación del punto 3.2,
    ya completado.
14. `docs/eval-tasks.md`: checklist fino completado M1–O2 para 3.2.
15. `evals/results/2026-08-12/report.md`: reporte final de 3.2 — resumen
    ejecutivo, métricas de Capa A, comparación Codex/Claude de Capa B,
    hallazgos accionables y la decisión de calibración (O1).
16. Este documento: estado operativo consolidado del MVP completo y notas
    para trabajo posterior.

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

`product-spec.md` no tiene asuntos abiertos que bloqueen la implementación: la
política de combinación y reranking de resultados, que era el único pendiente,
se resolvió el 11 de agosto de 2026 (RRF ponderado, ver `decisions.md`).

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

### Punto 2.3 — ensamblado de contexto

Los bloques I–L están completados:

- I: presupuesto por profundidad (`ContextBudget`) y tipos de aplicación
  (`ContextRequest`, `ContextUnitBlock`, `BudgetAllocation`, `CitationRecord`,
  `ContextBundle`/`ContextResultDocument`).
- J: expansión a unidades padre (`expandToAncestors`), deduplicación por
  `unitId` y por `contentHash` (`deduplicateBlocks`), presupuesto y
  truncamiento (`allocateBudget`) y asignación de citas (`assignCitations`).
- K: redacción de `context.md` (`renderContextMarkdown`) y `result.json`
  (`renderContextResult`), orquestación (`assembleContext`) y escritura del
  bundle a disco (`writeContextBundle`).
- L: comando `retrieve` de la CLI, E2E completo y cierre de documentación.

`retrieve` está anunciado y disponible. Detalle completo, decisiones y notas
de implementación en `docs/context-assembly-design.md` y
`docs/context-assembly-tasks.md`.

### Punto 2.4 — skill general

Completado: `skill/SKILL.md` en la raíz del repositorio, autocontenida (sin
depender de rutas relativas a `docs/` para poder instalarse fuera de este
repo), enseña a un agente a operar `init`, `status`, `doctor`,
`source add/list/remove`, `sync` y `retrieve` sin lógica específica de
proveedor. No requirió cambios en `src/`.

Verificada con dos corridas de un subagente sin contexto previo del proyecto
("en frío"), cada una con sólo el texto de la skill y una copia temporal de
dos videos reales de `auto-design`. Detalle completo en la sección
["Punto 2.4 completado"](#punto-24-completado--skill-general) más abajo.

### Punto 3.2 — evaluaciones del MVP

Completado el 13 de agosto de 2026, en dos capas independientes sin ground
truth etiquetado a mano (diseño en `docs/eval-design.md`):

- Capa A (mecánica, bloque M): 24 bundles reales generados sobre la
  colección `auto-design` con E5 real; integridad de citas perfecta;
  agregador de métricas.
- Capa B (juzgada, bloque N): rúbrica común respondida por Claude y por
  Codex sobre los mismos 24 bundles, sin verse las respuestas entre sí; 9/24
  pares divergen, ninguno por un defecto del producto.
- Bloque O: decisión explícita de mantener los defaults de RRF y de
  presupuestos por profundidad sin cambios, y reporte final de cierre.

Detalle completo, decisiones y hallazgos accionables en la sección
["Punto 3.2 completado"](#punto-32-completado--evaluaciones-del-mvp) más
abajo, en `docs/eval-design.md` / `docs/eval-tasks.md`, y en
`evals/results/2026-08-12/report.md`.

`docs/build.md` marca 2.1, 2.2, 2.3, 2.4, 3.1 y 3.2 al 100%. El MVP completo
está cerrado; no queda ningún bloque abierto.

## Arquitectura implementada

Inventario completo de `src/` a la fecha de este documento (69 archivos). Un
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

`src/domain/context/` (nuevo en 2.3):

- `context-budget.ts`: `ContextBudget`, resuelve los presets
  `focused`/`balanced`/`deep` (12k/32k/64k tokens) y valida el override
  `--max-tokens` como entero positivo sin renombrar el preset público.

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

`src/application/context/` (nuevo en 2.3):

- `context-request.ts`: `ContextRequest` (consulta + `ContextBudget`);
- `context-blocks.ts`: `ContextUnitBlock`, `BudgetAllocation`,
  `CitationRecord`, `ContextSection` y `classifyContextSection` (bucketing
  compartido por `allocateBudget` y los renderizadores);
- `context-bundle.ts`: `ContextBundle`, `ContextResultDocument`,
  `ContextResultUnit`, `ContextResultSource` — con nombres `snake_case`
  porque son el contrato de cable ya aprobado en `cli-contract.md`, no una
  convención interna de TypeScript;
- `expand-to-ancestors.ts` (`expandToAncestors`): combina candidatos y
  cadenas de ancestros ya resueltas en bloques citables sin duplicados;
- `deduplicate-blocks.ts` (`deduplicateBlocks`): colapsa bloques con
  `contentHash` idéntico bajo `unitId` distintos;
- `allocate-budget.ts` (`allocateBudget`): orden fijo por bucket
  (documento/sección → reglas/patrones → ancestros) y truncamiento entero,
  nunca a la mitad;
- `assign-citations.ts` (`assignCitations`): IDs `S01`, `S02`... en el orden
  final de inclusión;
- `render-context-markdown.ts` (`renderContextMarkdown`) y
  `render-context-result.ts` (`renderContextResult`): redactores puros de
  `context.md` y `result.json`;
- `assemble-context.ts` (`assembleContext`): orquestador de 2.3, compone todo
  lo anterior sobre `RetrievalOutcome`.

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
  escrituras;
- `write-context-bundle.ts` (nuevo en 2.3): `writeContextBundle`, escribe
  `context.md` y `result.json` bajo `<outputDir>/<request_id>/`; `request_id`
  usa el mismo generador ad-hoc que `SyncId` (sin dependencia ULID); falla
  explícito si el directorio del `request_id` ya existe en vez de mezclar
  archivos.

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

- `parse-command.ts`: argumentos estrictos con `parseArgs`; valida `--depth`
  y `--max-tokens` como error de uso (código `2`) antes de que lleguen a
  `ContextBudget`, para que un argumento mal escrito nunca produzca el
  código `1` de fallo operativo;
- `render-cli-output.ts`: JSON compacto versionado.
- `run-cli.ts`: ejecución de casos de uso y códigos de salida; el comando
  `retrieve` (nuevo en 2.3) construye `RetrievalQuery`/`RetrievalFilter`,
  llama `application.assembleContext`, escribe el bundle con
  `writeContextBundle` y emite el recibo compacto de `cli-contract.md`.
- `src/main.ts`: entry point ESM y configuración por entorno.

`retrieve` está disponible desde el cierre de 2.3 (ver
["CLI implementada"](#cli-implementada)).

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

`Application` expone `retrieveCandidates(query: RetrievalQuery):
Promise<RetrievalOutcome>`, además de `vectorIndex`, `textSearchIndex` y
`knowledgeRepository` como propiedades reemplazables.

Nuevo en 2.3: `Application` también expone `assembleContext(request:
ContextRequest): Promise<ContextBundle>`, reemplazable igual que
`retrieveCandidates` (ver el test `exposes assembleContext, reusing the same
retrieval wiring` en `test/main/create-application.test.ts`). Reutiliza
exactamente la misma `retrieveCandidates` interna, así que nunca puede quedar
desincronizado del motor de recuperación.

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

**Gotcha que sigue vigente:** la búsqueda vectorial no tiene piso de similitud
(ver la sección de decisiones de 2.2 más abajo). `status: "ok"` con candidatos
de relevancia real baja es un resultado válido y esperado, no un bug. 2.3 lo
heredó explícitamente: `assembleContext` nunca filtra por umbral de similitud,
sólo por lo que el presupuesto de tokens permite incluir. El E2E de 2.3 lo
confirma: el único camino confiable a `status: "no_results"` es un filtro que
deja vacío el universo de candidatos (por ejemplo, `--source` de una fuente
inexistente), no una consulta "sin sentido" sobre una biblioteca no vacía.

## Flujo exacto de `assembleContext` (2.3)

1. Llamar `retrieveCandidates(request.query)` → `RetrievalOutcome`.
2. Recolectar el conjunto único de `unitId` de `outcome.candidates`.
3. Llamar `knowledgeRepository.getUnits(unitIds)` y
   `knowledgeRepository.getAncestors(unitIds)` en paralelo — dos lotes, no una
   consulta por candidato. `getUnits` recupera el `parentId` de cada
   candidato (`RetrievalCandidate` no lo transporta); `getAncestors` resuelve
   el conjunto plano deduplicado de ancestros alcanzables.
4. `expandToAncestors`: camina `parentId` desde cada candidato hacia la raíz,
   construye un `ContextUnitBlock` por `unitId` único (un ancestro nunca pisa
   un candidato ya construido) y hereda `packageRef`/metadata de video del
   candidato que lo trajo, porque `KnowledgeUnit` no la transporta.
5. `deduplicateBlocks`: colapsa bloques con `contentHash` idéntico bajo
   `unitId` distintos, conservando el primero en orden de entrada.
6. `allocateBudget`: bucketing fijo (documento/sección → reglas/patrones →
   ancestros, cada uno por `fusedScore` descendente; ancestros además por
   `depth` descendente, padre inmediato antes que abuelo) y truncamiento
   entero — nunca a la mitad. El primer bloque se incluye igual si por sí
   solo excede el presupuesto, y el presupuesto se marca agotado de
   inmediato.
7. `assignCitations`: IDs `S01`, `S02`... en el orden final de inclusión.
8. `renderContextMarkdown` y `renderContextResult`: redactan `context.md`
   (Markdown con las seis secciones fijas) y el objeto `ContextResultDocument`
   (`snake_case`, contrato ya aprobado en `cli-contract.md`).
9. Devolver `ContextBundle { markdown, result }`. La escritura a disco
   (`writeContextBundle`) ocurre después, en la capa de infraestructura/CLI,
   nunca dentro de `assembleContext`.

Una consulta `no_results` de 2.2, o un presupuesto tan chico que no cabe ni el
primer bloque, produce igual un `ContextBundle` válido explicando la ausencia
de evidencia — nunca nada sin escribir.

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

## CLI implementada

Implementado y anunciado como disponible:

```text
auto-youtube-rag init
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>]
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag retrieve <query> [--depth focused|balanced|deep] \
  [--max-tokens <positive-integer>] [--source <name>] [--out <directory>]
```

`--source` es repetible. `--depth` y `--max-tokens` inválidos se rechazan en
`parse-command.ts` con código de uso `2`, antes de instanciar la aplicación.

Todavía no implementado, aunque el contrato público ya está aprobado:

```text
auto-youtube-rag rebuild --confirm
```

`rebuild` no depende de 2.3 y queda para cuando el producto lo requiera.

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

No se ejecutó una validación sobre la colección real `auto-design` con el
modelo E5 real al cerrar 2.2, por decisión explícita del usuario. **Sigue sin
ejecutarse al cerrar 2.3** — el mismo patrón documentado abajo aplica, y
tampoco es un pendiente urgente por sí solo. Si se necesita (por ejemplo,
antes de evaluaciones reales en 3.2, o si aparece un bug que sólo se
manifiesta con datos reales), el patrón es: copiar la colección a un
directorio temporal, sincronizar con el modelo real (ya cacheado en
`.cache/models`), correr consultas de `evals/queries/seed-queries.json` contra
`retrieveCandidates`/`assembleContext`, revisar cualitativamente, verificar el
digest SHA-256 del árbol fuente antes/después, y borrar la copia y la base
temporal al terminar.

### Puerta final de 2.3 (12 de agosto de 2026)

- 221 tests aprobados (151 heredados de 2.1–2.2 + 70 nuevos de ensamblado de
  contexto y CLI);
- cobertura: 95,25% líneas, 86,02% ramas, 98,43% funciones;
- `npm run build`: aprobado;
- `npm run check`: aprobado;
- `npm run test:coverage`: aprobado;
- `test/e2e/context-assembly.e2e.test.ts` aprobado sobre SQLite real (no
  fakes) y el comando `retrieve` real de la CLI, fixture de dos fuentes con
  encabezados anidados (documento → sección → subsección) para ejercer la
  expansión a ancestros, sin modelo E5 real (`FakeEmbeddingGenerator`);
- worktree limpio.

**Nota de implementación descubierta durante la prueba E2E:** la búsqueda
vectorial no tiene piso de similitud (heredado de 2.2), así que una consulta
"sin sentido" sobre una biblioteca no vacía igual devuelve `status: "ok"`. El
E2E prueba `no_results` filtrando por una fuente inexistente (`--source
ghost-source`), que sí vacía el universo de candidatos, en vez de depender de
una consulta sin coincidencias léxicas ni semánticas aparentes.

**Tampoco se ejecutó una validación de `retrieve` sobre la colección real
`auto-design`.** Mismo patrón y mismo criterio que el párrafo anterior: no es
un pendiente urgente, y el procedimiento a seguir es el mismo, agregando la
inspección cualitativa de `context.md`/`result.json` generados (¿el bundle es
legible?, ¿las citas resuelven?, ¿la expansión a padres aporta contexto real
o sólo ruido?) antes de calibrar presupuestos en una etapa posterior.

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

### Orden de ancestros invertido en `allocateBudget` (2.3)

El primer borrador de `context-assembly-design.md` especificaba "depth
ascendente (el padre inmediato antes que el abuelo)" para desempatar bloques
de ancestro con el mismo `fusedScore`. Es una contradicción: `depth` 0 es la
raíz del documento, así que el padre inmediato de una unidad profunda tiene
`depth` **mayor** que su abuelo, no menor. El test de `allocate-budget.test.ts`
lo capturó de inmediato al implementar J3. La regla correcta —ya aplicada en
código y documentación— es `depth` **descendente**. Si alguna referencia
vieja (memoria de sesión, comentario) dice "ascendente", está desactualizada.

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
- Nunca dejar que `sync` y `retrieveCandidates` usen instancias distintas del
  índice vectorial: deben compartir la misma para que un cambio publicado y una
  consulta nunca vean vectores diferentes.

Invariantes propias de ensamblado de contexto (2.3):

- Nunca cortar un `ContextUnitBlock` a la mitad: se incluye completo o se
  omite entero, para que ninguna cita `[S0N]` quede apuntando a texto
  truncado.
- Nunca reservar ni saltar un número de cita para un bloque omitido por
  presupuesto: `assignCitations` sólo recorre `allocation.included`.
- Nunca volver a tokenizar en el ensamblado: `tokenCount`/`estimatedTokens`
  ya están persistidos desde la indexación (2.1); ni `assembleContext` ni sus
  políticas puras abren el modelo de embeddings.
- Nunca fabricar una causa en `limitations`/"Coverage and limitations": sólo
  se describen señales reales (`warnings` de `RetrievalOutcome`,
  `budgetExhausted`, `omittedCount`, filtros aplicados).
- Nunca dejar que un ancestro pise un bloque que ya llegó como candidato:
  `origin: "candidate"` siempre gana sobre `"ancestor"` para el mismo
  `unitId`.
- Nunca escribir el bundle fuera de `<outputDir>/<request_id>/`; un
  `request_id` repetido falla explícito (`WriteContextBundleError`) en vez de
  mezclar archivos.
- Nunca validar `--depth`/`--max-tokens` como fallo operativo (código `1`):
  son errores de uso (código `2`), validados en `parse-command.ts`.

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
- 2.2 no exponía superficie de CLI; `retrieve` se implementó recién al cerrar
  2.3 (ver la sección siguiente).

Validación completa, incluida la decisión explícita de no correr la pasada
cualitativa sobre la colección real, en
["Última validación conocida"](#última-validación-conocida) → "Puerta final de
2.2".

## Punto 2.3 completado — ensamblado de contexto

Bloques I–L están completados (contratos, expansión/deduplicación/presupuesto/
citas, redacción, orquestación, CLI). Detalle completo en
`docs/context-assembly-design.md` y `docs/context-assembly-tasks.md`.

Decisiones cerradas durante 2.3 que no deben reabrirse sin motivo (registradas
también en `decisions.md`):

- Bucketing fijo por `unitType`: documento/sección siempre a "Highest-relevance
  context", reglas/patrones siempre a "Related rules and patterns", nunca por
  puntaje puro.
- Los ancestros de expansión caen siempre en "Additional relevant context",
  aunque el ancestro sea en sí una regla relevante.
- Un bloque único que por sí solo excede el presupuesto se incluye igual —el
  bundle nunca queda vacío habiendo evidencia real— y el presupuesto se marca
  agotado de inmediato después.
- Deduplicación en dos niveles desde el inicio: por `unitId` (estructural) y
  por `contentHash` (contenido idéntico bajo unidades distintas).
- `request_id` usa el mismo generador ad-hoc que `SyncId`, sin depender de
  ULID.
- `result.json` usa `snake_case` porque es el contrato de cable ya aprobado;
  `CitationRecord`/`ContextUnitBlock` internos siguen en `camelCase`.
  `renderContextResult` es el único punto de traducción entre ambos.
- Presupuestos por profundidad (`focused` 12k / `balanced` 32k / `deep` 64k)
  confirmados sin recalibrar en este punto; la calibración queda para 3.2.

Presupuestos de contexto por profundidad ya no aparece como pendiente de
decisión en `decisions.md`: quedó confirmado el 12 de agosto de 2026.

## Punto 2.4 completado — skill general

`skill/SKILL.md` invoca la CLI ya completa (`init`, `source add/list/remove`,
`sync`, `retrieve`, `status`, `doctor`) sin lógica específica de proveedor.
`rebuild` se documenta explícitamente como no disponible todavía.

Decisiones cerradas durante 2.4 que no deben reabrirse sin motivo:

- Ubicación: `skill/SKILL.md` en la raíz del repo, tal como ya aprobaba el
  árbol conceptual de `product-spec.md` (`skill/` a secas, sin anidar un
  directorio con el nombre del proyecto adentro).
- Autocontención: el contenido esencial del contrato de CLI (comandos, flags,
  exit codes, forma del recibo JSON, códigos simbólicos) está embebido
  directamente en `SKILL.md`, no referenciado por ruta relativa a `docs/`,
  porque la skill debe poder instalarse o enlazarse fuera de este
  repositorio.
- Invocación: la skill asume `auto-youtube-rag <comando>` como forma
  canónica (igual que `cli-contract.md`) y documenta `node
"<ruta-al-repo>/dist/main.js" <comando>` como respaldo, porque el binario
  no está enlazado globalmente (`npm link`) en este entorno de desarrollo.
- Verificación: **"en frío"**, con un subagente sin contexto previo del
  proyecto (no leyó `docs/` ni `src/`, sólo el texto de la skill) contra una
  copia temporal de dos videos reales de `auto-design` — nunca contra la
  colección original. Dos corridas:
  1. La primera corrida reveló un hueco crítico: la skill no mencionaba
     `init` como paso previo obligatorio. Sin él, `status`/`doctor`/
     `source add` fallan con `ERR_SQLITE_ERROR: unable to open database
file`, un código que la skill tampoco explicaba. Corregido agregando
     `init` como paso 1 del flujo recomendado.
  2. La segunda corrida, con la skill corregida, completó el flujo completo
     (`init` → `status` → `source add` → `sync` → `retrieve` → lectura de
     `context.md`/`result.json` → cita con procedencia) sin inspeccionar
     `src/` ni inventar sintaxis, y confirmó que las citas `[S0N]` resuelven
     correctamente contra `result.json`. Encontró dos ambigüedades menores,
     ya corregidas en el texto: (a) el mismo `ERR_SQLITE_ERROR` también
     puede deberse a un `cwd` inconsistente entre invocaciones, no sólo a
     `init` faltante — la base de datos por defecto es relativa a
     `<cwd>/.auto-youtube-rag/`; (b) `source add` espera la ruta a la
     carpeta `videos/` en sí, no a su carpeta padre, y el `collection_path`
     del recibo puede quedar un nivel arriba de esa ruta sin que eso sea un
     error.
  3. **Verificación específica en Codex (agente externo real, no simulado)
     no se ejecutó** — el usuario eligió explícitamente cerrar 2.4 con sólo
     verificación en Claude Code por ahora. Si aparece un problema de
     interpretación de la skill específico de Codex, o antes de considerar
     el punto "verificado en dos proveedores" en un sentido estricto, correr
     la misma skill desde Codex contra una colección de prueba y reportar
     resultado.
- No se modificó ningún archivo de `src/`, `docs/cli-contract.md` ni
  `docs/product-spec.md`: 2.4 fue estrictamente documentación de uso sobre
  una CLI ya cerrada.

## Punto 3.2 completado — evaluaciones del MVP

Bloques M–O están completados (Capa A mecánica, Capa B juzgada, calibración
y cierre). Diseño en `docs/eval-design.md`, checklist fino en
`docs/eval-tasks.md`, reporte final en `evals/results/2026-08-12/report.md`.

Fue, según lo previsto, la primera validación completa sobre la colección
real `auto-design` con el modelo E5 real (no fixtures ni copias parciales),
usando el procedimiento ya documentado en "Última validación conocida" →
notas de 2.2/2.3.

Decisiones y hallazgos cerrados durante 3.2 que no deben reabrirse sin
motivo (registrados también en `decisions.md` y en el reporte final):

- **Sin ground truth etiquetado a mano.** Mide en dos capas independientes:
  Capa A mecánica (verificable con código, sin agente) y Capa B juzgada
  (rúbrica corta respondida por el agente consumidor real sobre el bundle ya
  ensamblado). El criterio de éxito del producto es cobertura amplia y
  citada, no coincidencia puntual contra una lista de "fragmentos
  correctos".
- **Deriva de esquema real en `auto-design`, fuera de este repositorio.** La
  colección creció de 34 a 51 videos; 17 usan `resources.analysis` en vez de
  `resources.rules`, y hacen fallar el manifest completo con
  `MANIFEST_SCHEMA_INVALID` si se sincroniza sin filtrar. `sync` se comportó
  exactamente como diseñado (falla el run, preserva paquetes existentes). La
  ejecución real de M4 se hizo sobre una copia filtrada a los 34 videos con
  esquema válido. Aceptar `resources.analysis` como alias, o coordinar con
  el pipeline productor, queda fuera de 3.2 y requiere aprobación explícita
  antes de tocar `manifest-reader.ts`.
- **Precisión aparente limitada por ruido de catálogo compartido, no por
  errores de recuperación.** La mayoría de consultas semilla recupera del
  mismo subconjunto de videos sobre catálogos de estilos/tendencias; más
  profundidad tiende a sumar más catálogo tangencial, no más contenido
  específico. Es una característica del corpus real; RRF no tiene hoy una
  señal adicional (tipo de unidad, densidad temática) para distinguirlo.
- **Decisión de calibración (O1): se mantienen los defaults sin cambios** —
  RRF `k = 60`, `wText = wVector = 1.0`, presupuestos `focused` 12k /
  `balanced` 32k / `deep` 64k. Ninguna señal de M3 o N4 cruzó la barra de
  "evidencia clara" que fijaba `eval-design.md`: el agotamiento de
  presupuesto casi universal es el comportamiento esperado de recuperar un
  universo amplio de candidatos; la cobertura juzgada se aplana de
  `balanced` a `deep` sin que ningún preset rinda peor que uno menor; y
  `es-no-answer-unrelated-topic` —el único caso que nunca produce
  `status: "no_results"`— igual obtiene `precision_aparente = 0.00` sin
  divergencia entre jueces, así que el producto ya comunica la ausencia de
  contenido relevante sin necesitar un piso de similitud vectorial.
  Razonamiento completo, punto por punto, en `docs/decisions.md`, sección
  "Decisión de calibración (O1, punto 3.2)".
- **Las 9 discrepancias de 24 entre los jueces Codex y Claude (N4) no
  señalan ningún defecto del producto.** Se explican por severidad de
  criterio en `precision_aparente` (2 casos) o por ambigüedad real en
  `evals/rubric-template.md` sobre "cobertura suficiente" y "cruce
  multilingüe demostrado" (7 casos) — ningún juez leyó mal un bundle ni
  inventó contenido. Afinar la rúbrica queda anotado para una futura pasada
  de evaluación, no como pendiente de 3.2.
- No se modificó ningún archivo de `src/`: 3.2 fue estrictamente medición
  sobre un producto ya cerrado, y la única decisión con potencial de tocar
  código (O1) concluyó en mantener los defaults.

## MVP completo — cierre y trabajo posterior

Con 3.2 cerrado, `docs/build.md` marca 2.1, 2.2, 2.3, 2.4, 3.1 y 3.2 al
100%. El MVP descrito en `docs/product-spec.md` está completo: indexación
incremental, recuperación híbrida, ensamblado de contexto citado, comando
`retrieve`, skill portable para agentes, pruebas funcionales y evaluación en
dos capas sobre la colección real.

Trabajo posterior razonable, explícitamente **fuera de este MVP** — ninguno
es un pendiente urgente, y ninguno se implementa sin pedido y aprobación
explícita del usuario:

- Piso mínimo de similitud vectorial (dejado abierto "salvo evidencia
  clara" desde 2.2; 3.2 no encontró esa evidencia).
- Señal adicional de densidad/relevancia temática para que RRF distinga
  contenido específico de catálogo tangencial (hallazgo de 3.2, no un bug).
- Alias o corrección de esquema para `resources.analysis` en el manifest
  real, o coordinación con el pipeline productor (hallazgo de 3.2, no un
  bug de este repositorio).
- Afinar `evals/rubric-template.md` en los dos puntos de ambigüedad que
  encontró N4, antes de una futura pasada de evaluación.
- Verificación de `skill/SKILL.md` específicamente desde Codex real (2.4 se
  cerró sólo con verificación en Claude, por decisión explícita del
  usuario).
- Comando `rebuild --confirm` (contrato ya aprobado en `cli-contract.md`,
  nunca implementado porque no lo pidió el producto).
- MCP, interfaz web y soporte de paquetes de páginas web (fuera de alcance
  desde `product-spec.md` original).

Si el usuario pide continuar el proyecto, preguntar primero cuál de estos
frentes (u otro nuevo) es prioridad, en vez de asumir uno.

## Primer turno recomendado para el próximo agente

1. Confirmar `git status --short` vacío y revisar los últimos commits.
2. Ejecutar `npm.cmd run check` y `npm.cmd run build`.
3. Leer los dieciséis documentos indicados al inicio, incluidos
   `skill/SKILL.md` y `evals/results/2026-08-12/report.md`.
4. El MVP está completo: no hay bloque abierto en `docs/build.md`.
   Preguntar al usuario qué frente de "Trabajo posterior razonable, fuera de
   este MVP" (más arriba) es prioridad, o si hay un pedido nuevo — no asumir
   ninguno por defecto.
5. Si el usuario aprueba avanzar en un frente nuevo o en trabajo posterior,
   proponer diseño y checklist fino primero, siguiendo el mismo patrón que
   `retrieval-design.md`/`context-assembly-design.md`/`eval-design.md`, y
   esperar aprobación explícita antes de implementar.
6. Implementar en cortes de máximo cinco archivos por tarea, conservando
   arquitectura y commits convencionales.

Prompt sugerido para retomar:

> Retoma `auto-youtube-rag` desde `docs/agent-handoff.md`. Verifica primero el
> estado del repositorio y las pruebas. El MVP está completo: 2.1–2.4 y
> 3.1–3.2 al 100%, incluidos el comando `retrieve`, la skill portable
> `skill/SKILL.md` y el reporte final de evaluaciones. No hay ningún bloque
> abierto. Preguntame qué frente de trabajo posterior priorizar antes de
> implementar nada.

## Historial reciente relevante

```text
4b8cbcf docs(evals): resolve O1, keep RRF weights and depth budgets unchanged
e6103ed docs(evals): run N4, compare Codex and Claude Layer B judgments
972dfad docs(evals): record N3, Codex's independent Layer B judgment
8789ad0 docs(evals): run N2, Claude's cold-start Layer B judgment
8f719c8 docs(evals): write the Layer B judgment rubric template
38495f5 docs(evals): run M4, the real auto-design validation pass
37d2718 feat(evals): aggregate layer A mechanical metrics into a report table
2b28277 feat(evals): orchestrate seed queries across depth presets
d1cb11e feat(evals): verify citation integrity between bundle markdown and result
a5ba23c docs(evals): propose and approve the 3.2 evaluation plan
27823c5 docs(progress): close point 2.4 and hand off to 3.2
31e767a feat(skill): add the portable general skill
350709e docs(progress): close point 2.3 and hand off to 2.4 or 3.2
fdb9255 test(e2e): verify context assembly end to end
af19db2 test(main): verify assembleContext is exposed on the application
99a7399 feat(cli): add the retrieve command
b5846fd feat(context): write the context bundle to disk
92a5b98 feat(context): orchestrate context assembly end to end
ccf4475 feat(context): render the result.json bundle
934c960 feat(context): render the context.md bundle
c8b9c4f feat(context): assign sequential citations to included blocks
f7f3037 feat(context): allocate the token budget across ordered blocks
b0da4fb feat(context): deduplicate blocks by content hash
98a1300 feat(context): expand candidates to their parent units
0fdf539 feat(context): declare context assembly types
faa84c2 feat(context): resolve token budgets per depth preset
cbc6e65 docs(context): propose and approve 2.3 context assembly plan
a7e4098 docs(handoff): detail cold-start state and defer real-collection validation
9a1e68f docs(retrieval): close point 2.2 and seed evaluation queries
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
7. qué entregó cada punto — 2.1 indexación, 2.2 recuperación, 2.3 ensamblado y
   `retrieve`, 2.4 la skill portable, 3.2 la evaluación en dos capas — y por
   qué el MVP completo ya está cerrado, no en curso;
8. por qué RRF ponderado es el baseline de fusión, y por qué 3.2 decidió
   mantener `k`/`wText`/`wVector` sin cambios en vez de calibrarlos;
9. por qué la búsqueda vectorial no tiene piso de similitud, qué implica eso
   tanto para `status: "no_results"` en 2.2 y en el bundle de 2.3, y por qué
   3.2 concluyó que ese hueco no bloquea al agente consumidor (Capa B lo
   compensa) ni justifica agregar un umbral todavía;
10. por qué los identificadores de fragmento y documento son derivados en vez
    de persistidos, y qué adaptadores dependen de esa reconstrucción;
11. por qué `assembleContext` necesita `getUnits` además de `getAncestors`
    (`KnowledgeUnit` no transporta metadata de video/documento, y hay que
    conocer el `parentId` de cada candidato antes de poder caminarlo);
12. por qué 3.2 mide en dos capas independientes sin ground truth etiquetado
    (Capa A mecánica, Capa B juzgada por Codex y Claude sobre el mismo
    bundle), y por qué ninguna de las 9 discrepancias entre jueces señala un
    defecto del producto — son ambigüedad de la rúbrica, no de lectura;
13. qué frentes quedan como trabajo posterior razonable, explícitamente
    fuera de este MVP, y por qué ninguno es un pendiente urgente;
14. por qué un bloque de ancestro siempre cae en "Additional relevant
    context" aunque sea en sí una regla relevante, y por qué un presupuesto
    nunca corta un bloque a la mitad.
