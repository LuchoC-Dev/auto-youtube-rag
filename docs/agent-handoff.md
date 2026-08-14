# Relevo detallado para continuar `auto-youtube-rag`

## Propósito de este documento

Este documento permite que un agente nuevo retome el proyecto sin depender de
la conversación que lo originó. Describe el objetivo del producto, el estado
exacto del repositorio, las decisiones confirmadas, la arquitectura ya
implementada, las invariantes que no deben romperse, las validaciones realizadas
y el siguiente bloque recomendado.

Estado de referencia: **14 de agosto de 2026**, después de cerrar los puntos
4.2 —instalación: hogar de usuario, `init` instalador y preflight—, 4.3
—seguridad de `sync` y rendimiento de indexación—, 4.4 —aviso de vectores
obsoletos—, 4.5 —perfil de modelo de embeddings y política de prefijos— y
4.6 —el comando `rebuild --confirm`.

**Lo que más probablemente contradiga tu memoria de sesiones viejas**, en
orden de impacto:

1. La base y el modelo **ya no son relativos al directorio de trabajo**.
   Viven en `~/.auto-youtube-rag/`, se instalan con `auto-youtube-rag init`,
   y `AUTO_YOUTUBE_RAG_MODEL_CACHE` se renombró a
   `AUTO_YOUTUBE_RAG_MODELS_DIR`.
2. La rama es **`main`**, con remoto privado, no `feat/sqlite-vec-benchmark`.
3. **No podés lanzar dos `sync` a la vez** sobre una fuente: el producto los
   rechaza con `SYNC_ALREADY_RUNNING`. `sync --force` existe para destrabar
   un run fantasma.
4. **El marcador de cita abre el bloque, dentro del encabezado**
   (`### [S01] ...`), no lo cierra en una línea suelta.
5. `init` **ya no es instantáneo**: instala el modelo salvo `--skip-model`.
6. **`rebuild --confirm` ya está implementado.** Si una memoria vieja dice
   que el contrato lo aprueba pero no existe, está desactualizada: se cerró
   como punto 4.6. La CLI no tiene ningún comando pendiente de implementar.

Ver "Configuración de ejecución" más abajo antes de asumir cualquier ruta.

Antes se habían cerrado el punto
3.2 — evaluaciones del MVP — y el punto 4.1 — soporte de
`analysis.json` (schema 2.0), el primer trabajo posterior al MVP. El MVP
completo descrito en `product-spec.md` (2.1–2.4 y 3.1–3.2) está terminado.
El comando `retrieve` de la CLI y la skill portable (`skill/SKILL.md`) están
implementados, probados y anunciados como disponibles; las evaluaciones de
recuperación y ensamblado están corridas sobre la colección real con
resultado documentado. Además, `auto-youtube-rag` ahora indexa y recupera
`analysis.json` (schema 2.0) de punta a punta, validado contra los 17 videos
reales de `auto-design` que lo usan. La identidad del modelo de embeddings y
su política de prefijos ya son un dato explícito e inyectable
(`EmbeddingModelProfile`), en vez de constantes hardcodeadas específicas de
E5 — el frente número 1 del orden de prioridad que el usuario fijó el 14 de
agosto ya está cerrado. No hay ningún bloque abierto en `docs/build.md`. El
trabajo que sigue —si el usuario lo pide— es explícitamente posterior al MVP
(ver "Trabajo posterior razonable, fuera de este MVP" más abajo), no un
pendiente urgente.

## Datos rápidos

| Dato                      | Valor                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Proyecto                  | `auto-youtube-rag`                                                                                     |
| Repositorio               | `C:\Users\lucho\Desktop\Programacion\fast-weekend-core\auto-youtube-rag`                               |
| Rama actual               | `main`                                                                                                 |
| Remoto                    | `origin` → `github.com/LuchoC-Dev/auto-youtube-rag` (privado)                                          |
| Último commit documentado | ver `git log --oneline -1`; el trabajo de este documento cierra el punto 4.6                           |
| Estado Git al cerrar      | Worktree limpio; `main` pusheada y sincronizada con `origin/main` (0 commits de diferencia)            |
| Runtime                   | Node.js 24.19.0 LTS, ESM                                                                               |
| Lenguaje                  | TypeScript 6.0.3 estricto                                                                              |
| Persistencia              | SQLite mediante `node:sqlite`                                                                          |
| Modelo                    | `Xenova/multilingual-e5-small`, revisión `main`, cuantización `q8`                                     |
| Dimensión                 | 384                                                                                                    |
| Instalación               | `auto-youtube-rag init` → `~/.auto-youtube-rag/` (base + modelo, ~130 MB)                              |
| Operación                 | Exclusivamente local; sin APIs externas                                                                |
| Estado del MVP            | Completo — 2.1–2.4, 3.1–3.2 y 4.1–4.6 al 100% en `docs/build.md`                                       |
| Próximo punto             | Ninguno abierto; el orden de prioridad del 14 de agosto quedó agotado (ver "Orden de prioridad" abajo) |

**Cambió el 14 de agosto de 2026.** Hasta entonces todo el proyecto vivía en
una rama llamada `feat/sqlite-vec-benchmark` —nombre heredado de un benchmark
descartado— sin ninguna rama `main` y sin remoto. Se creó `main` sobre la
punta de esa rama, así que contiene los 128 commits desde el primero sin
necesidad de merge, y se publicó en un repositorio privado. Si una memoria de
sesión vieja menciona `feat/sqlite-vec-benchmark` como rama de trabajo, está
desactualizada.

`sqlite-vec` sigue siendo una opción evaluada y **descartada** para el MVP: el
nombre viejo de la rama no significa que se esté trabajando en eso.

No reescribas historial ni fuerces pushes sin autorización explícita. La rama
local `feat/sqlite-vec-benchmark` se conserva apuntando al mismo commit que
`main` y puede borrarse; `docs/bootstrap-project` y `feat/embedding-benchmark`
están contenidas en la historia y tampoco tienen commits propios.

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
16. `docs/analysis-schema-design.md`: diseño de soporte de `analysis.json`
    (schema 2.0), punto 4.1, ya completado.
17. `docs/analysis-schema-tasks.md`: checklist fino completado P1–T3 para
    4.1.
18. `docs/install-design.md`: diseño de instalación —hogar de usuario, `init`
    como instalador y preflight— del punto 4.2, ya completado. Incluye la
    nota "qué haría falta para soportar otro modelo", que es el punto de
    partida del frente siguiente.
19. `docs/install-tasks.md`: checklist fino completado U–Z e Y para 4.2.
20. `docs/sync-safety-design.md`: guard de concurrencia, runs fantasma y
    tamaño de lote del punto 4.3, ya completado.
21. `docs/rebuild-design.md` y `docs/rebuild-tasks.md`: el comando
    `rebuild --confirm` del punto 4.6, ya completado. Incluye por qué el
    ordenamiento por longitud se cerró sin escribir código.
22. Este documento: estado operativo consolidado del MVP, de los puntos 4.1
    a 4.4, el orden de prioridad decidido y lo que enseñó la sesión del 13 y
    14 de agosto.

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

Embeddings (`src/infrastructure/embeddings/`, renombrado en el punto 4.5):

- `model-profile.ts` (nuevo en 4.5): `EmbeddingModelProfile`,
  `EmbeddingInputPrefixes`, el perfil activo congelado `activeModelProfile`,
  `modelVersion(profile)` y `modelDescriptorOf(profile)`. No importa nada:
  ni Transformers.js, ni `node:fs`, ni otro módulo del proyecto. Es la única
  fuente de la identidad del modelo (repositorio, revisión, `dtype`,
  dimensiones, `maxInputTokens`, `requiredFiles`) y de su política de
  prefijos. `"Xenova/multilingual-e5-small"` aparece una sola vez en todo
  `src/`, acá.
- `transformers-embedding-generator.ts` (antes `e5-embedding-generator.ts`):
  `TransformersEmbeddingGenerator` carga perezosamente y recibe
  `profile?: EmbeddingModelProfile` con default `activeModelProfile`; los
  prefijos se aplican según `profile.inputPrefixes` (`null` = sin prefijo,
  texto crudo), y `countTokens`/`embedDocuments` comparten la misma función
  de prefijado; límite declarado: `profile.maxInputTokens` (512 con el
  perfil activo); lotes configurables; vectores normalizados y validados;
  runtime forzado a local mediante `env.allowRemoteModels = false` y
  `env.cacheDir` antes de crear el pipeline. Tipos renombrados:
  `EmbeddingAdapterError`/`...ErrorCode`, `EmbeddingSession`,
  `EmbeddingRuntime`, `EmbeddingRuntimeLoadOptions` (antes con prefijo `E5`).
  Los **valores** de los códigos de error no cambiaron.
- `transformers-model-installer.ts` (antes `e5-model-installer.ts`):
  `TransformersModelInstaller` recibe el perfil igual que el generador;
  tipos renombrados `ModelDownloadRuntime`/`ModelDownloadOptions` (antes
  `E5DownloadRuntime`/`E5DownloadOptions`).

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

`vectorIndex.load()` devuelve la cantidad de vectores disponibles para el
modelo activo (cambiado el 14 de agosto de 2026; antes era `Promise<void>`).
Si la carga no falló, ese conteo es cero y la vía textual **sí** encontró
hits, se emite el warning `VECTORS_STALE`: la biblioteca tiene contenido pero
ningún vector para el modelo activo. Las tres condiciones juntas importan —
ver `docs/decisions.md`, sección "Degradación silenciosa de la vía
vectorial".

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

```text
auto-youtube-rag rebuild --confirm
```

`rebuild` se implementó en el punto 4.6 (14 de agosto de 2026). **Ya no queda
ningún comando del contrato sin implementar.** Borra el índice derivado y lo
regenera desde los paquetes en disco; preserva `sources`, la versión de
esquema y el historial de runs. `--confirm` es obligatorio (sin él, código
`2`) y no acepta `--force`.

## Configuración de ejecución

**Cambió en el punto 4.2 (14 de agosto de 2026).** Si una memoria de sesión
vieja dice que las rutas son relativas al `cwd`, está desactualizada.

Todo vive en un hogar de usuario, resuelto por
`src/infrastructure/config/resolve-paths.ts`, la **única** función que
calcula estas rutas:

```text
~/.auto-youtube-rag/          ← C:\Users\<usuario>\.auto-youtube-rag\
  index.sqlite                ← la biblioteca
  models/                     ← el modelo instalado (~130 MB)
```

Variables admitidas:

```text
AUTO_YOUTUBE_RAG_HOME        ← mueve el hogar entero
AUTO_YOUTUBE_RAG_MODELS_DIR  ← mueve sólo el modelo
```

`AUTO_YOUTUBE_RAG_MODEL_CACHE` **ya no existe**: se renombró a
`AUTO_YOUTUBE_RAG_MODELS_DIR` porque el modelo es estado instalado, no un
caché que se regenere solo.

El modelo se instala con el producto, no con npm:

```text
auto-youtube-rag init                    # crea hogar, base y modelo
auto-youtube-rag init --from <ruta>      # copia un modelo ya presente
auto-youtube-rag init --skip-model       # sólo la base (CI, sin red)
auto-youtube-rag models install [--force] [--from <ruta>]
auto-youtube-rag models status
```

`models/.install.json` es el recibo de instalación: guarda el tamaño esperado
de cada archivo y permite distinguir `absent`, `incomplete` (descarga
truncada) e `installed` sin hashear 130 MB.

`npm run models:download` **sigue existiendo pero es sólo para benchmarks**
(`benchmarks/embeddings/run.ts`, escribe en `<repo>/.cache/models`). No lo
ofrezcas como remedio de producto: depende de `tsx` y de `benchmarks/`, que
no existen fuera del repositorio clonado. El `.cache/` del repo es territorio
exclusivo de benchmarks; el producto no lo lee nunca.

El producto no debe descargar durante `sync`, `doctor` ni tests normales.
Sólo `init` y `models install` usan la red, y sólo cuando el usuario los
invoca por nombre.

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

**No borres `.gitattributes`.** Fija `* text=auto eol=lf` y existe desde el
14 de agosto de 2026 (commit `7ee0a9b`). Sin él, `core.autocrlf=true` en
Windows materializa CRLF en cada `checkout` y en cada clon nuevo, y
`format:check` —parte de `npm run check`— falla sobre archivos que nadie
editó. Es una trampa desconcertante porque `git diff` no muestra **nada**:
git normaliza los finales de línea al comparar, así que sólo difiere la
representación en disco. Si algún día `format:check` falla sobre archivos
ajenos a tu cambio, verificá que `.gitattributes` siga existiendo antes de
tocar cualquier otra cosa; el remedio inmediato es `npx prettier --write .`,
que no produce ningún commit.

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

### Un solo video con esquema roto bloqueaba la sincronización de toda la fuente

Descubierto en M4 (3.2) contra la colección real `auto-design`: `sync`
antes procesaba `manifest.videos` con un `.map()` síncrono que tiraba
`ManifestReadError` en la primera entrada inválida, abortando la lectura del
manifest completo. Un solo video con un campo de esquema roto (por ejemplo,
`resources.analysis` en vez de `resources.rules`, ver "Deriva de esquema
real" más arriba) bloqueaba la sincronización de los otros 50 videos de la
fuente, incluidos los válidos. Corregido el 13 de agosto: `parseManifest`
ahora descarta la entrada inválida y la reporta como `ManifestVideoIssue`
en vez de abortar; sólo los fallos de raíz del manifest (root no objeto,
`videos` no array, JSON inválido, archivo no legible) siguen siendo
fatales. Detalle en `docs/decisions.md`, sección "Validación tolerante por
video en el manifest". No revertir a un `.map()`/`throw` síncrono sin
recrear este mismo aislamiento.

## Invariantes y límites obligatorios

- Nunca escribir, mover ni eliminar archivos de las fuentes registradas.
- Nunca interpretar un manifest ilegible como eliminación masiva.
- Nunca publicar cambios vectoriales antes del commit SQLite.
- Nunca perder la última versión válida por un fallo parcial.
- Nunca permitir dos runs `running` sobre la misma fuente: cada run borra los
  paquetes que no reclamó él, así que dos solapados dejan la fuente vacía.
  Confirmado con reproducción determinista el 14 de agosto; el guard vive en
  `recordRun` y no debe debilitarse.
- Nunca dejar que una vía de recuperación desaparezca en silencio. Si la
  búsqueda semántica no participa —porque no hay vectores para el modelo
  activo— tiene que emitirse `VECTORS_STALE`. El índice vectorial además debe
  recargar cuando cambia `version` o `dimensions`, no sólo `key`: reutilizar
  el snapshot devuelve un conteo mayor que cero y anula ese warning.
- Nunca acoplar dominio o aplicación a SQLite, Transformers.js o Node paths.
- Nunca persistir `.env`, cookies, headers, URLs temporales ni metadata cruda.
- Nunca descargar el modelo implícitamente durante tests o uso normal.
- Nunca cambiar esquema, modelo/dimensión o dependencia nativa sin aprobación.
- **Commitear siempre con la skill `/git-commit`, nunca con `git commit` a
  mano.** No es una preferencia de estilo: la skill analiza el diff real para
  elegir tipo y alcance. Detalle en `docs/development.md` → "Cómo commitear".
- Nunca pushear, reescribir historial ni forzar sin pedido explícito: `main`
  está publicada en un repositorio privado y el push la hace visible fuera
  de esta máquina.
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
     `init` faltante — la base de datos por defecto era relativa a
     `<cwd>/.auto-youtube-rag/` **cuando se escribió esto**; el punto 4.2 la
     movió al hogar de usuario y reemplazó ese error crudo por
     `LIBRARY_NOT_FOUND`, así que este hallazgo ya no aplica; (b) `source
add` espera la ruta a la
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
- **Deriva de esquema real en `auto-design`, con causa raíz identificada
  fuera de este repositorio.** La colección creció de 34 a 51 videos; 17
  usan `resources.analysis` en vez de `resources.rules`. Investigación
  posterior a 3.2 (13 de agosto) contra el repositorio real de la skill
  productora (`youtube-video-context`) encontró la causa exacta: el 2 de
  agosto esa skill reemplazó `rules.json`/schema 1.0 por
  `analysis.json`/schema 2.0 en un breaking change deliberado y documentado
  (commit `aecdde9`, "deja de producir un manual de reglas de diseño para
  producir un análisis general"). No es un rename de campo — la forma de
  `analysis.json` (`topics`/`recommendations`/`assessment`/
  `evidence_boundary`) es incompatible con la de `rules.json`
  (`patterns`/`principle`/`rules`/`avoid`/`acceptanceCriteria`). Los 34
  videos "válidos" son los generados **antes** del pivot; los 17 "rotos" son
  los generados **con la skill actual** — es `auto-youtube-rag` el que
  quedó atrás, no al revés, y todo video nuevo de acá en adelante va a usar
  schema 2.0. Detalle completo en `docs/decisions.md`, sección "Pendientes
  de decisión" → "Soporte de `analysis.json` (schema 2.0)".

  **Ya resuelto (13 de agosto): la mitad "amplificadora" del problema.**
  Antes, una sola entrada de video con esquema roto abortaba la lectura de
  _todo_ el manifest (`parseManifest` tiraba en el primer video inválido),
  así que ningún video de la fuente podía sincronizar — ni siquiera los 34
  válidos. `parseManifest` (`manifest-reader.ts`) ahora es tolerante por
  video: sólo los fallos de raíz (root no objeto, `videos` no array, JSON
  inválido, archivo no legible) siguen siendo fatales; una entrada de video
  con esquema inválido o un id/slug duplicado se descarta y se reporta como
  `ManifestVideoIssue` en `ManifestSnapshot.issues`, sin tumbar el resto.
  `syncSource` traduce cada una en un `SyncIssue`
  (`MANIFEST_ENTRY_SCHEMA_INVALID`/`MANIFEST_ENTRY_DUPLICATE`) y protege de
  borrado cualquier paquete previamente indexado de ese video. Ver
  `docs/decisions.md`, sección "Validación tolerante por video en el
  manifest", y `docs/indexing-design.md`.

  **Todavía pendiente: la mitad "de fondo".** Los 17 videos con
  `resources.analysis` siguen sin indexarse — ahora aislados como `issue`
  en vez de bloquear la fuente entera, pero su contenido real
  (`analysis.json`) sigue sin tener parser ni modelo de dominio en
  `auto-youtube-rag`. Requiere diseño propio (parser nuevo, snapshot nuevo,
  decisión de bucketing en `assembleContext`, decisión sobre sostener ambos
  esquemas o congelar schema 1.0) y aprobación explícita antes de
  implementar — no se resuelve con un alias de campo.

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

## Punto 4.1 completado — soporte de `analysis.json` (schema 2.0)

Primer trabajo posterior al MVP, cerrado el 13 de agosto de 2026. Bloques
P–T de `docs/analysis-schema-tasks.md` completos (contratos, parser,
lectura de paquete, unidades de conocimiento, migración SQLite, bucketing,
E2E con fixtures y validación real). Diseño completo en
`docs/analysis-schema-design.md`, decisión de cierre en `docs/decisions.md`
sección "Soporte de `analysis.json` (schema 2.0): implementado y
validado".

Qué cambió en `src/`:

- `structuredContentKinds`/`StructuredContentKind` reemplaza los dos
  booleanos `rules`/`analysis` de `ManifestResourceSnapshot` por un enum
  obligatorio de tres valores; `manifest-reader.ts` colapsa los booleanos
  crudos (cada uno opcional) y rechaza declarar ambos a la vez como
  `MANIFEST_SCHEMA_INVALID`.
- `analysis-json-parser.ts` (`parseAnalysisJson`) es un espejo de
  `rules-json-parser.ts` para el schema 2.0
  (`topics`/`recommendations`/`assessment`/`evidence_boundary`).
- `filesystem-package-source-reader.ts` lee `deliverables/analysis.json`
  mediante un `switch` exhaustivo sobre `structuredContent` (antes era un
  `if` sólo para `rules`).
- Cuatro `KnowledgeUnitType` nuevos: `analysis_document`, `analysis_section`,
  `analysis_topic`, `analysis_recommendation`. `buildAnalysisUnits`
  (`build-knowledge-units.ts`) construye la jerarquía: raíz →
  cinco secciones fijas (`Summary and lens`, `Evidence boundary`,
  `Assessment`, cabecera `Topics`, cabecera `Recommendations`) →
  `analysis_topic`/`analysis_recommendation` searchable bajo su cabecera.
- `source_documents.kind` en SQLite acepta `'analysis'` (edición in-place de
  `001-initial.ts`, no una migración incremental — no había ninguna base
  real que preservar).
- `classifyContextSection` (`context-blocks.ts`) suma
  `analysis_document`/`analysis_section`/`analysis_topic` a
  `highest_relevance` y `analysis_recommendation` a `related_rules`, sin
  agregar una tercera sección al bundle ni tocar `cli-contract.md`.
- `rules.json`/schema 1.0 sigue funcionando exactamente igual que antes;
  ambos esquemas se sostienen indefinidamente, seleccionados por
  `structuredContent`, no como versiones donde una reemplaza a la otra.

Validación real (bloque T, no fixtures): copia temporal de la colección
real `auto-design` (51 videos, 17 con `analysis.json`) sincronizada con el
modelo E5 real. Los 51 paquetes se indexaron sin ningún `issue`; `doctor`
en `ok`; digest SHA-256 del árbol fuente idéntico antes/después. La consulta
semilla nueva `es-analysis-neumorphism-accessibility`
(`evals/queries/seed-queries.json`) produjo, vía `retrieve --depth
balanced`, una cita real (`[S45]`) resuelta a una unidad `analysis_topic`
del video real `psyw2_j_5jk`, en la sección "Highest-relevance context", con
procedencia correcta y `context.md` legible. La copia temporal se borró al
terminar. `design-catalog` (mencionada en diseños previos como segunda
colección real candidata; en disco vive como `catalog-design` bajo
`ai-transcripcion/`) no se usó para esta validación: su manifest no declara
ningún video con `resources.analysis`.

## Punto 4.5 completado — perfil de modelo de embeddings

Cerrado el 14 de agosto de 2026. Diseño en `docs/model-profile-design.md`,
checklist fino en `docs/model-profile-tasks.md` (bloques AA–AD). Origen: los
prefijos `passage:`/`query:` de E5 se aplicaban siempre, sin excepción, y
degradaban en silencio cualquier otro modelo — hueco anotado al investigar
4.2, fijado como frente número 1 el 14 de agosto.

Qué cambió en `src/` (ver también la sección de inventario más arriba):

- Nace `model-profile.ts`: `EmbeddingModelProfile`, `activeModelProfile`
  congelado, `modelVersion(profile)` y `modelDescriptorOf(profile)`. No
  importa nada de fuera. `"Xenova/multilingual-e5-small"` pasó de tres
  copias en `src/` a una sola.
- El generador y el instalador reciben el perfil por inyección, con
  `activeModelProfile` como default; ningún llamador de producto
  (`create-application.ts`, `run-cli.ts`) pasa perfil explícito.
  `countTokens` y `embedDocuments` comparten la misma función de prefijado.
- `model-install-state.ts` recibe el perfil (o `repository`/`requiredFiles`)
  en vez de leer constantes de módulo propias.
- Rename: `E5EmbeddingGenerator` → `TransformersEmbeddingGenerator`,
  `E5ModelInstaller` → `TransformersModelInstaller`, con sus archivos y
  tipos. Los valores de los códigos de error públicos no cambiaron.

**La decisión de mayor riesgo:** la política de prefijos participa de
`modelVersion`, así que apagar los prefijos algún día invalida y reindexa
automáticamente por diseño, pero con el perfil activo el literal de
`version` no se movió un carácter
(`"Xenova/multilingual-e5-small@main:q8"`), fijado con un test de regresión.
Validado contra el binario real (no sólo tests): sobre una copia temporal de
3 videos reales de `auto-design` ya sincronizados con el código anterior a
4.5, `sync` con el código nuevo devolvió `status: "no_changes"`,
`packagesIndexed: 0`; `retrieve` no mostró `VECTORS_STALE` ni ningún otro
warning; `doctor` reportó los seis checks en `ok`; el digest SHA-256 del
árbol fuente fue idéntico antes y después. La copia y la base temporal se
borraron al terminar.

Hallazgo colateral, anotado en `docs/decisions.md`, no un pendiente:
`parseManifest` rechaza un `manifest.json` con BOM UTF-8
(`MANIFEST_JSON_INVALID`) — apareció por cómo PowerShell escribió el
manifest de prueba, no afecta a los manifests reales de la skill productora.

`skill/SKILL.md` no se tocó: nada observable cambió para un agente
consumidor. Estado final: **325 tests, 0 fallos**, `npm run check` y
`npm run build` en verde, smoke real del modelo en verde.

## MVP completo — cierre y trabajo posterior

Con 3.2 cerrado, `docs/build.md` marca 2.1, 2.2, 2.3, 2.4, 3.1 y 3.2 al
100%. El MVP descrito en `docs/product-spec.md` está completo: indexación
incremental, recuperación híbrida, ensamblado de contexto citado, comando
`retrieve`, skill portable para agentes, pruebas funcionales y evaluación en
dos capas sobre la colección real.

Después del MVP se cerraron seis puntos más: 4.1 (`analysis.json`), 4.2
(instalación), 4.3 (seguridad de `sync` y rendimiento), 4.4 (aviso de vectores
obsoletos), 4.5 (perfil de modelo de embeddings y política de prefijos) y 4.6
(el comando `rebuild --confirm`). Los cinco primeros se originaron en corridas
de verificación en frío o en investigación de sus hallazgos; 4.6 vino del
orden de prioridad que el usuario fijó el 14 de agosto.

### Orden de prioridad fijado por el usuario el 14 de agosto de 2026

Este orden ya está decidido. **No vuelvas a preguntarlo**; si el usuario
cambia de idea lo dirá.

~~1. **Prefijos E5 hardcodeados.**~~ **Cerrado el 14 de agosto de 2026 como
punto 4.5.** `passage:` y `query:` ya no se aplican incondicionalmente:
`EmbeddingModelProfile.inputPrefixes` los hace un dato explícito
(`null` = sin prefijo), inyectable en el generador y en el instalador con el
perfil activo como default. La política de prefijos participa de
`modelVersion`, así que un cambio futuro de política dispara reindexación
automática; con el perfil activo hoy no cambió nada y no se reindexó
(validado contra el binario real). Detalle en `docs/decisions.md`, sección
"Perfil de modelo y política de prefijos", y en `docs/model-profile-design.md`.

~~1. **Ordenar fragmentos por longitud antes de lotear.**~~ **Cerrado el 14 de
agosto de 2026 sin escribir código.** Es inerte con el `batchSize = 1` que
adoptó 4.3: el padding que ataca sólo existe dentro de un lote de dos o más, y
`defaultBatchSize` es 1 sin que ningún llamador de producto lo sobrescriba.
Además `embedDocuments` se llama por paquete, así que el universo ordenable
serían los fragmentos de un video, no el corpus del benchmark. Y la propia
medición de 4.3 ya lo decía: 1,93x contra 2,27x del lote 1 — no era una mejora
sobre el lote 1, era la alternativa que el lote 1 le ganó. Detalle en
`docs/decisions.md`, sección "Ordenar fragmentos por longitud: medido y
descartado".

~~2. **Comando `rebuild --confirm`.**~~ **Cerrado el 14 de agosto de 2026 como
punto 4.6.** Ver `docs/rebuild-design.md`.

**El orden de prioridad del 14 de agosto quedó agotado.** Lo único que sigue
en pie de esa lista es lo que el usuario dejó explícitamente para el final
(abajo). Después de eso: **MCP, interfaz web y soporte de paquetes de páginas
web**, fuera de alcance desde el `product-spec.md` original.

Explícitamente **para el final**, por decisión del usuario:

- **Verificar `skill/SKILL.md` desde Codex real.** Es la única casilla sin
  marcar de `docs/build.md` (punto 2.4). Gana valor porque la skill cambió
  mucho el 13 y 14 de agosto —se dividió en tres archivos, cambió el modelo
  de instalación, sumó `models`, `--force` y códigos nuevos— y todo eso se
  validó en frío **sólo con agentes Claude**. Requiere que lo corra el
  usuario: un agente Claude no puede invocar Codex.
- **Higiene del repositorio**: borrar las tres ramas locales muertas
  (ninguna tiene commits propios) y los 2,1 GB de `.cache/`, de los cuales
  130 MB son el modelo y el resto benchmarks cerrados.

Frentes anteriores que siguen sin evidencia que los justifique, y que no
están en el orden de arriba:

- Piso mínimo de similitud vectorial (abierto "salvo evidencia clara" desde
  2.2; 3.2 no encontró esa evidencia).
- Señal de densidad temática para que RRF distinga contenido específico de
  catálogo tangencial (hallazgo de 3.2, no un bug).
- Afinar `evals/rubric-template.md` en los dos puntos de ambigüedad de N4.

## Punto 4.6 completado — comando `rebuild --confirm`

Cerrado el 14 de agosto de 2026. Diseño en `docs/rebuild-design.md`, checklist
fino en `docs/rebuild-tasks.md` (bloques AE–AH).

Qué resuelve: `sync` es incremental y `unchanged()` sólo compara el hash del
paquete y la identidad del modelo. Un tamaño de lote distinto —la reindexación
que 4.3 dejó "recomendable pero no obligatoria" sin ninguna forma de
ejercerla—, un `parser_version` nuevo o un cambio de fragmentación dejan la
biblioteca inconsistente mientras `doctor` sigue diciendo `ok`.

Qué cambió en `src/`:

- `IndexStore.purgeDerivedIndex()`: borra `video_packages` y, por las cascadas
  y triggers que ya existían, todo lo derivado. El `SELECT` de runs activos y
  el `DELETE` comparten un `BEGIN IMMEDIATE`, igual que `recordRun`. **Sin
  migración de esquema.**
- `rebuild-index.ts` (`rebuildIndex`): purga, publica la remoción vectorial y
  re-sincroniza cada fuente con la función `sync` inyectada — el mismo
  cableado que usa `application.sync`, así que nunca puede indexar distinto.
  Recorre las fuentes **secuencialmente**, no con `Promise.all`.
- `Application.rebuildIndex()`, `kind: "rebuild"` en `parse-command.ts`,
  entrada `library_and_model` en `command-requirements.ts` y la rama en
  `run-cli.ts`.

Decisiones que no conviene reabrir sin motivo: regenera en vez de sólo purgar;
preserva `sources` y el historial de runs; el guard va dentro de la purga; no
acepta `--force`; sólo la purga es transaccional. Razonamiento completo en
`docs/decisions.md`, sección "`rebuild` regenera en vez de sólo purgar (punto
4.6)".

**El defecto que encontró AH2, y que vale recordar.** El diseño afirmaba que
el índice vectorial en memoria se invalidaría solo, porque ya lo hace en
`apply`. Es falso: la purga borra por SQL y SQL no publica nada, así que un
rebuild que termina sin ningún paquete dejaba el índice sirviendo vectores
fantasma — 2 medidos sobre una biblioteca con cero embeddings. Es el mismo
defecto de 4.4 llegando por un camino nuevo. `rebuildIndex` ahora publica un
`remove_packages` después del commit de la purga. **Si tocás la purga, mantené
esa publicación.**

**Validado contra el binario real**, no sólo con tests: copia temporal de 3
videos reales de `auto-design` (dos con `rules.json`, uno con
`analysis.json`), modelo E5 real. `rebuild --confirm` dejó los digests
SHA-256 de unidades, fragmentos **y vectores** idénticos bit a bit a los de
antes —con lote 1 el embedding es determinista también sobre datos reales—,
preservó el historial de runs, y `doctor` quedó en `ok` con `retrieve` sin
ningún warning. Con un run `running` inyectado, el guard rechazó el comando
sin borrar nada. Corrompiendo un fragmento derivado a mano: `sync` respondió
`no_changes` y lo dejó intacto, `rebuild` lo reparó. Digest del árbol fuente
idéntico antes y después; la copia y la base temporales se borraron al
terminar. Detalle en `docs/build.md`.

Estado final: **342 tests, 0 fallos**, `npm run check` y `npm run build` en
verde.

## Primer turno recomendado para el próximo agente

1. Confirmar `git status --short` vacío y revisar los últimos commits.
   La rama es `main` y tiene remoto privado: **no pushees sin pedido
   explícito**.
2. Ejecutar `npm.cmd run check` y `npm.cmd run build`. La referencia al
   cerrar el punto 4.6, el 14 de agosto: **342 tests, 0 fallos**.
3. Leer los documentos del orden de lectura, incluidos los diseños
   posteriores al MVP: `install-design.md`, `install-tasks.md`,
   `sync-safety-design.md`, `model-profile-design.md` y `rebuild-design.md`.
4. **No hay un frente decidido esperando.** El orden de prioridad que el
   usuario fijó el 14 de agosto se agotó: sus dos puntos se cerraron ese
   mismo día (4.6 el segundo; el primero, sin código, por inerte). Lo que
   queda es lo que el usuario dejó explícitamente para el final —verificar la
   skill desde Codex real, que requiere que la corra él, e higiene del
   repositorio— y después el trabajo fuera de alcance del `product-spec.md`
   original. **Preguntá antes de elegir**: acá sí corresponde.
5. Proponer diseño y checklist fino **antes** de implementar, siguiendo el
   patrón de `retrieval-design.md` / `install-design.md` /
   `sync-safety-design.md` / `rebuild-design.md`, y esperar aprobación
   explícita.
6. Implementar en cortes de máximo cinco archivos por tarea. **Commitear con
   la skill `/git-commit`**, nunca a mano — ver `docs/development.md` →
   "Cómo commitear".

### Lo que enseñó la sesión del 13 y 14 de agosto

Cinco defectos reales se corrigieron en dos días. **Cuatro de los cinco
aparecieron verificando otra cosa**, no buscándolos. Vale la pena repetir el
método:

- **Verificá contra el binario real, no sólo con tests.** `doctor` daba un
  parte de salud falso ante un modelo truncado y toda la suite pasaba; sólo
  se vio corriendo el comando con un archivo dañado a propósito.
- **Desconfiá del "todo bien".** Tres de los cinco defectos tenían la misma
  forma: el sistema respondía correctamente mientras algo estaba roto. El
  marcador de citas pasaba toda verificación mecánica y producía procedencia
  falsa; `retrieve` devolvía `ok` con la búsqueda semántica muerta; `doctor`
  decía `ok` con el modelo corrupto.
- **Un arreglo puede estar tapado por otro.** `VECTORS_STALE` no podía
  dispararse nunca porque el índice reutilizaba un snapshot obsoleto. Dos
  defectos se cubrían mutuamente.
- **Medí antes de optimizar.** El paralelismo parecía obvio y rindió 1,00x;
  el tamaño de lote no parecía nada y rindió 2,23x. La primera medición del
  embedding fue engañosa por usar textos cortos en vez de contenido real.
- **Los subagentes que reportan lo que no arreglaron valen oro.** El hueco
  del snapshot obsoleto lo encontró un subagente que decidió que estaba
  fuera de su alcance y lo dijo, en vez de tocarlo en silencio.

Prompt sugerido para retomar:

> Retoma `auto-youtube-rag` desde `docs/agent-handoff.md`. Verifica primero
> el estado del repositorio y las pruebas. El MVP está completo, y también
> los puntos 4.1 a 4.6: soporte de `analysis.json`, instalación con hogar de
> usuario, seguridad de `sync` con guard de concurrencia, aviso de vectores
> obsoletos, perfil de modelo de embeddings (prefijos ya no hardcodeados) y
> el comando `rebuild --confirm`. No hay pendientes de decisión ni ningún
> comando del contrato sin implementar, y el orden de prioridad del 14 de
> agosto quedó agotado. Pregúntame qué priorizar antes de empezar, y propone
> diseño y checklist antes de implementar nada.

## Historial reciente relevante

Los commits más recientes.

```text
7ee0a9b build(repo): check every file out with LF so format:check survives a checkout
9107f02 docs(model-profile): close point 4.5 documentation
eb12309 fix(embeddings): name the loaded model from the profile, not a literal
53545b8 refactor(embeddings): rename E5ModelInstaller to TransformersModelInstaller
faa04fb refactor(embeddings): rename E5EmbeddingGenerator to TransformersEmbeddingGenerator
a0ce77f refactor(embeddings): installer consumes the profile, duplicates die
dc2e580 refactor(install): model-install-state accepts the embedding profile
e3b7d5d feat(embeddings): apply prefix policy from the injected model profile
8738de5 docs(embeddings): design the model profile and its task checklist
4291bbf feat(embeddings): add model profile as single source of truth
be4ebff docs(handoff): hand over with the priority order and what the session taught
73b59aa fix(sync): close the cross-process race by locking before the check
fb2b02c docs(retrieval): close point 4.4 and teach the skill VECTORS_STALE
d7b5df0 fix(vector-search): reload the snapshot when the model version changes
09e5175 test(e2e): reproduce VECTORS_STALE with real SQLite and document the code
1f64f4b feat(retrieval): warn VECTORS_STALE when the active model has no vectors
fb56413 refactor(vector-search): return the loaded vector count from load()
ca4829d docs(development): require /git-commit for every commit
e5061fa docs(handoff): record the move to main and the private remote
700f938 docs(sync): close point 4.3 and teach the skill sync --force
def5de1 feat(cli): add sync --force and doctor STALE_SYNC_RUN
fb98d58 perf(embeddings): default embedding batch size to 1
5bc1538 fix(sync): reject a second concurrent running sync per source
c2e8a7a docs(sync): confirm the cross-deletion bug and design the guard
3969d2b fix(context): open each block with its citation id in the heading
d304054 docs(install): close point 4.2 and record the cold-run findings
4bb6de3 test(install): smoke the real --from adoption against the repo cache
116801a docs(skill): describe the user home, init installer and models commands
033d746 fix(doctor): detect an incomplete model instead of trusting the directory
0235184 docs(cli-contract): document models install/status, init flags and 4.2 codes
8c633b6 feat(cli): translate raw SQLite integrity failures for sync and retrieve
70ad16c test(cli): pin the sync-never-discovers-63-missing-models regression
ef06e93 feat(cli): preflight requirements once, before building the Application
9598b67 feat(cli): add the command requirements table
c9b4ee4 fix(doctor): point the missing-model check at models install
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
13. qué frentes quedan como trabajo posterior, en qué orden los priorizó el
    usuario el 14 de agosto, y cuáles quedaron explícitamente para el final;
14. por qué un bloque de ancestro siempre cae en "Additional relevant
    context" aunque sea en sí una regla relevante, y por qué un presupuesto
    nunca corta un bloque a la mitad;
15. por qué la biblioteca y el modelo viven en el hogar del usuario y no en
    el directorio de trabajo, y por qué el modelo es estado instalado y no
    un caché;
16. por qué dos `sync` concurrentes sobre una fuente la dejaban vacía, por
    qué el guard va en `recordRun` bajo `BEGIN IMMEDIATE` en vez de un
    índice único, y por qué no se abandona ningún run automáticamente;
17. por qué `VECTORS_STALE` necesita tres condiciones y no una, y por qué el
    índice vectorial debe recargar al cambiar `version`, no sólo `key`;
18. por qué paralelizar la indexación no sirve —ONNX ya satura los núcleos—
    y por qué bajar el lote a 1 rindió 2,23x;
19. qué detecta `rebuild` que `sync` no puede detectar, por qué regenera en
    vez de sólo purgar, por qué preserva el historial de runs, y por qué su
    guard de concurrencia vive dentro de la transacción de la purga;
20. por qué ordenar fragmentos por longitud dejó de tener sentido en cuanto
    el lote bajó a 1, y por qué eso se cerró sin escribir código.
