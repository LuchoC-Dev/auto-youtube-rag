# Tareas de recuperación híbrida

## Estado

Checklist propuesto el 11 de agosto de 2026 para el punto 2.2. Requiere
aprobación antes de iniciar la implementación. Continúa la numeración de
[indexing-tasks.md](indexing-tasks.md), que cerró en E7.

## Convenciones de ejecución

Se mantienen sin cambios las de 2.1:

- ejecutar una tarea por vez y mantener su commit enfocado;
- escribir primero la prueba o criterio ejecutable que falle;
- ejecutar la verificación específica y después `npm run build` y `npm run check`;
- marcar `[x]` y actualizar [build.md](build.md) sólo con todos los criterios
  satisfechos;
- no descargar modelos ni acceder a la red desde la suite rápida;
- no añadir dependencias ni cambiar contratos aprobados sin actualizar antes la
  especificación;
- ninguna tarea modifica más de cinco archivos.

Regla propia de 2.2: **ninguna tarea introduce escrituras**. Todo el bloque es
read-only sobre SQLite y sobre las fuentes.

## Bloque F — Contratos de recuperación

### F1. Consulta, filtros y límites

- [x] Crear los value objects `RetrievalQuery`, `RetrievalFilter` y
      `RetrievalLimits` con validación estricta.
  - Depende de: A1 (identificadores existentes).
  - Aceptación: normaliza a NFC y recorta espacios; rechaza consulta vacía, sólo
    whitespace o sólo puntuación; conserva acentos y mayúsculas; los límites
    rechazan cero, negativos y no enteros; un filtro vacío significa sin
    restricción.
  - Verificar: `node --import tsx --test test/domain/retrieval/retrieval-query.test.ts`
    y `npm run check`.
  - Archivos: `src/domain/retrieval/retrieval-query.ts`,
    `src/domain/retrieval/retrieval-filter.ts`,
    `test/domain/retrieval/retrieval-query.test.ts`.

### F2. Puertos y tipos de resultado

- [x] Declarar `TextSearchIndex`, `VectorSearchIndex`, `KnowledgeRepository`,
      `RankedHit`, `RetrievalCandidate` y `RetrievalOutcome`.
  - Depende de: F1.
  - Aceptación: ninguna firma expone tipos de SQLite ni de Transformers.js;
    `VectorSearchIndex` incluye `apply` y sustituye a `VectorIndexSink` como
    puerto de `sync`; `RankedHit` lleva rango denso 1-based y `rawScore` marcado
    como diagnóstico.
  - Verificar: `npm run typecheck` y `npm run lint`.
  - Archivos: `src/application/ports/text-search-index.ts`,
    `src/application/ports/vector-search-index.ts`,
    `src/application/ports/knowledge-repository.ts`,
    `src/application/retrieval/retrieval-results.ts`,
    `src/application/ports/vector-index-sink.ts`.

### F3. Fusión RRF ponderada

- [x] Implementar `FusionStrategy` y su estrategia `RrfFusion` como función pura.
  - Depende de: F2.
  - Aceptación: `k = 60`, `wText` y `wVector` configurables; conserva hits
    exclusivos de cada vía; el consenso supera a un primer puesto único cuando
    corresponde según la fórmula; desempata por puntaje, rango textual y
    `fragmentId`; dos ejecuciones sobre la misma entrada producen el mismo orden;
    no usa `rawScore`.
  - Verificar: `node --import tsx --test test/application/retrieval/rrf-fusion.test.ts`
    y `npm run check`.
  - Archivos: `src/application/retrieval/fusion-strategy.ts`,
    `src/application/retrieval/rrf-fusion.ts`,
    `test/application/retrieval/rrf-fusion.test.ts`.

Checkpoint F: `npm run build && npm run check` sin cargar SQLite ni
Transformers.js.

## Bloque G — Adaptadores de búsqueda

### G1. Sanitizador de consultas FTS5

- [x] Convertir texto libre en una expresión `MATCH` segura.
  - Depende de: F1.
  - Aceptación: tokeniza por espacios y puntuación; escapa comillas dobles
    duplicándolas; envuelve cada token en comillas; une con `OR`; neutraliza
    `OR`, `NOT`, `NEAR`, `*`, `^`, `:`, `-` y paréntesis como texto literal;
    devuelve vacío para entradas sin tokens; nunca produce un error de sintaxis
    de FTS5.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/fts-query-sanitizer.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/sqlite/fts-query-sanitizer.ts`,
    `test/infrastructure/sqlite/fts-query-sanitizer.test.ts`.

### G2. Búsqueda textual SQLite

- [x] Implementar `TextSearchIndex` sobre `fragment_fts` con `bm25()` y filtros.
  - Depende de: F2, G1 y D1.
  - Aceptación: pondera `title = 3.0`, `heading_path = 2.0`, `content = 1.0`;
    ordena ascendente por `bm25` y desempata por `fragment_id`; aplica filtros de
    fuente, video, idioma y tipo de unidad mediante `JOIN` posterior al `MATCH`;
    devuelve rangos densos; una consulta sin tokens devuelve lista vacía sin
    ejecutar SQL; no escribe.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/sqlite-text-search-index.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/sqlite/sqlite-text-search-index.ts`,
    `test/contracts/text-search-index.contract.ts`,
    `test/infrastructure/sqlite/sqlite-text-search-index.test.ts`.

### G3. Índice vectorial exacto en memoria

- [x] Implementar `VectorSearchIndex` con carga perezosa desde SQLite y
      aplicación incremental de cambios.
  - Depende de: F2, D4 y C1.
  - Aceptación: construye un `Float32Array` contiguo con identidades paralelas;
    carga perezosamente y no al construirse; `apply` invalida el snapshot y la
    siguiente consulta lo reconstruye desde SQLite; valida clave, versión y
    dimensión del modelo con error simbólico explícito; calcula producto punto
    sobre vectores normalizados; filtra antes de puntuar; desempata por
    `fragmentId`; reemplaza al `MemoryVectorIndexSink` sin romper `sync`.
  - Nota de implementación: `VectorIndexChange` transporta vectores e
    identidades, pero no el tipo de unidad ni el idioma sobre los que filtra la
    recuperación. Parchear el índice en memoria dejaría entradas nuevas
    imposibles de filtrar, así que se invalida el snapshot. SQLite ya es la
    fuente de verdad y el cambio se publica después del commit, de modo que la
    reconstrucción es siempre correcta y cuesta milisegundos a esta escala.
  - Verificar: `node --import tsx --test test/infrastructure/vector/in-memory-vector-search-index.test.ts`,
    `node --import tsx --test test/application/indexing/sync-source.test.ts` y
    `npm run check`.
  - Archivos: `src/infrastructure/vector/in-memory-vector-search-index.ts`,
    `src/infrastructure/vector/sqlite-vector-loader.ts`,
    `test/contracts/vector-search-index.contract.ts`,
    `test/infrastructure/vector/in-memory-vector-search-index.test.ts`.

### G4. Repositorio de conocimiento

- [x] Implementar `KnowledgeRepository` con procedencia por lote, unidades y
      ancestros.
  - Depende de: F2 y D4.
  - Aceptación: `getFragmentProvenance` resuelve un lote en una sola consulta y
    devuelve ruta de encabezados, tipo de unidad, documento, paquete, creador,
    timestamps y evidencia visual; `getAncestors` sube hasta la raíz sin ciclos
    ni duplicados; los IDs desconocidos se omiten sin inventar filas; no escribe.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/sqlite-knowledge-repository.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/sqlite/sqlite-knowledge-repository.ts`,
    `test/contracts/knowledge-repository.contract.ts`,
    `test/infrastructure/sqlite/sqlite-knowledge-repository.test.ts`.

Checkpoint G: los tres adaptadores pasan sus contratos sobre una base temporal,
con `PRAGMA integrity_check` intacto y sin mutaciones.

## Bloque H — Orquestación y verificación

### H1. Selección: deduplicación y diversidad

- [x] Implementar la política pura que reduce hits fusionados a candidatos
      finales.
  - Depende de: F3.
  - Aceptación: conserva el mejor fragmento por unidad; aplica `maxPerVideo`
    recorriendo en orden de puntaje; trunca a `fusedResults`; no reordena por
    diversidad; un video dominante no monopoliza el resultado; es determinista.
  - Nota de implementación: opera sobre `RetrievalCandidate` ya hidratado
    (`unitId` y `packageRef` resueltos), no sobre `FusedHit`; ver la nota de
    orquestación en `retrieval-design.md`.
  - Verificar: `node --import tsx --test test/application/retrieval/select-candidates.test.ts`
    y `npm run check`.
  - Archivos: `src/application/retrieval/select-candidates.ts`,
    `test/application/retrieval/select-candidates.test.ts`.

### H2. Caso de uso `retrieveCandidates`

- [x] Orquestar consulta, ambas vías, fusión, selección e hidratación de
      procedencia.
  - Depende de: F1–F3, G1–G4 y H1.
  - Aceptación: ejecuta las vías en paralelo; una vía fallida produce advertencia
    y no aborta; sin coincidencias devuelve `no_results` con métricas; embebe la
    consulta con prefijo `query:`; hidrata procedencia en un solo lote; ningún
    candidato carece de procedencia; sólo conoce puertos.
  - Verificar: `node --import tsx --test test/application/retrieval/retrieve-candidates.test.ts`
    y `npm run check`.
  - Archivos: `src/application/retrieval/retrieve-candidates.ts`,
    `test/fakes/fake-text-search-index.ts`,
    `test/fakes/fake-vector-search-index.ts`,
    `test/fakes/fake-knowledge-repository.ts`,
    `test/application/retrieval/retrieve-candidates.test.ts`.

### H3. Composition root

- [x] Conectar los adaptadores de recuperación sin lógica de negocio nueva.
  - Depende de: G1–G4 y H2.
  - Aceptación: crear la aplicación no carga vectores, no abre el modelo y no
    consulta; cada adaptador de recuperación es reemplazable por override;
    `sync` y `retrieveCandidates` comparten la misma instancia de índice
    vectorial; los comandos administrativos existentes no cambian de coste.
  - Verificar: `node --import tsx --test test/main/create-application.test.ts` y
    `npm run check`.
  - Archivos: `src/main/create-application.ts`,
    `test/main/create-application.test.ts`.

### H4. Integración extremo a extremo

- [ ] Verificar el ciclo completo sobre la colección temporal reproducible.
  - Depende de: H1–H3.
  - Aceptación: un paquete recién sincronizado es consultable sin reiniciar;
    eliminarlo lo retira de ambas vías; reabrir el proceso reconstruye el índice
    vectorial y devuelve el mismo orden; un término exacto raro llega por la vía
    textual; una paráfrasis sin léxico compartido llega por la vía vectorial;
    los filtros no contaminan resultados; el árbol fuente conserva su digest
    SHA-256; no hay accesos de red.
  - Verificar: `node --import tsx --test test/e2e/retrieval.e2e.test.ts`,
    `npm run test:coverage`, `npm run build` y `npm run check`.
  - Archivos: `test/helpers/create-test-collection.ts`,
    `test/e2e/retrieval.e2e.test.ts`.

### H5. Consultas semilla y progreso

- [ ] Registrar el conjunto inicial de consultas reales y actualizar la
      documentación.
  - Depende de: H4.
  - Aceptación: incluye consultas en español e inglés, término raro, paráfrasis,
    consulta multilingüe y consulta sin respuesta esperada; el archivo declara
    qué se espera recuperar sin fijar todavía umbrales; `build.md` marca 2.2 al
    100% y `agent-handoff.md` refleja el estado real para el siguiente agente.
  - Verificar: `npm run check` y revisión manual del worktree.
  - Archivos: `evals/queries/seed-queries.json`, `docs/build.md`,
    `docs/decisions.md`, `docs/agent-handoff.md`.

Checkpoint H: se cumplen los ocho puntos del criterio provisional de cierre de
[agent-handoff.md](agent-handoff.md).

## Cierre del punto 2.2

Cuando F1–H5 estén completas:

1. ejecutar `npm run build`, `npm run check`, `npm run test:coverage` y
   `npm run test:embedding:smoke`;
2. ejecutar una recuperación manual sobre una copia temporal de la colección real
   `auto-design` y revisar cualitativamente los candidatos;
3. verificar que el digest del árbol fuente no cambió;
4. actualizar `build.md` sólo si las cuatro capacidades de 2.2 están verificadas;
5. revisar que el worktree no contenga bases, modelos ni artefactos locales;
6. no avanzar a 2.3 sin aprobar antes su propio diseño y checklist.

## Decisiones solicitadas para aprobar las tareas

1. Ejecutar las doce tareas en orden F1–H5, respetando dependencias.
2. Sustituir `VectorIndexSink` por `VectorSearchIndex` en `sync`, en lugar de
   mantener dos índices vectoriales con copias divergentes.
3. Mantener 2.2 sin superficie de CLI: `retrieve` aparece recién en 2.3.
4. Aceptar RRF ponderado como baseline y posponer la calibración de pesos a 3.2.
5. Exigir `npm run build` y `npm run check` en cada commit, además del test
   específico.
