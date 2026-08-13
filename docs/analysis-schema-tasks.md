# Tareas de soporte para `analysis.json` (schema 2.0)

## Estado

Checklist propuesto y aprobado el 13 de agosto de 2026, continuando
[analysis-schema-design.md](analysis-schema-design.md). Sigue la numeración
de bloques ya usada por el proyecto (A–L en indexación/recuperación/contexto,
M–O en evaluaciones); este trabajo usa **P–T**.

## Convenciones de ejecución

Las mismas de bloques anteriores:

- ejecutar una tarea por vez y mantener su commit enfocado;
- escribir primero la prueba o criterio ejecutable que falle;
- ejecutar la verificación específica y después `npm run build` y
  `npm run check`;
- marcar `[x]` y actualizar `build.md` sólo con todos los criterios
  satisfechos;
- no descargar modelos ni acceder a la red desde la suite rápida;
- ninguna tarea modifica más de cinco archivos, salvo que el propio diseño
  ya haya aprobado una excepción puntual (el bloque S toca la migración y el
  bucketing juntos porque son inseparables: uno sin el otro deja contenido
  indexado pero mal ubicado, o bucketing sin datos que ubicar).

## Bloque P — Contratos de dominio y aplicación

### P1. Snapshots de `analysis.json`

- [x] Declarar `AnalysisTopicSnapshot`, `AnalysisRecommendationSnapshot`,
      `AnalysisAssessmentSnapshot`, `AnalysisEvidenceBoundarySnapshot`,
      `AnalysisLensSnapshot`, `AnalysisDocumentSnapshot`,
      `AnalysisPackageDocumentSnapshot`, y sumar `"analysis"` al union
      `PackageDocumentSnapshot`.
  - Depende de: ninguno (extiende tipos existentes).
  - Aceptación: mismo patrón que `RulesDocumentSnapshot`/
    `RulesPackageDocumentSnapshot`; `evidenceClass` y `confidence` son
    literales cerrados (`analysisEvidenceClasses`, `analysisConfidenceLevels`),
    no `string` suelto.
  - Verificar: `npm run typecheck`.
  - Archivos: `src/application/indexing/package-snapshots.ts`.

### P2. `structuredContent` como enum obligatorio en `ManifestResourceSnapshot`

- [x] Declarar `structuredContentKinds = ["rules", "analysis", "none"]` y
      `StructuredContentKind`. Reemplazar los campos `rules`/`analysis` de
      `ManifestResourceSnapshot` por un único campo nuevo,
      `structuredContent`, tipado `StructuredContentKind` y siempre
      presente. En `manifest-reader.ts`, seguir leyendo
      `resources.rules`/`resources.analysis` como booleanos opcionales del
      JSON crudo (clave ausente → `false`, presente pero no booleana →
      error como hoy), y colapsarlos a `structuredContent` antes de
      construir el snapshot: `rules` true y `analysis` false da `"rules"`;
      `rules` false y `analysis` true da `"analysis"`; ambos false da
      `"none"`; **ambos true da `MANIFEST_SCHEMA_INVALID`** en el campo
      `resources` ("must not declare both rules and analysis").
  - Depende de: ninguno.
  - Aceptación: los tres casos válidos producen el `structuredContent`
    correcto; el caso `rules=true,analysis=true` se descarta como
    `ManifestVideoIssue` (no aborta el manifest completo, gracias a la
    tolerancia por video ya implementada) en vez de indexarse o crashear;
    un manifest schema 1.0 sin `resources.analysis` y uno schema 2.0 sin
    `resources.rules` parsean ambos sin error.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/manifest-reader.test.ts`.
  - Archivos: `src/application/indexing/package-snapshots.ts`,
    `src/infrastructure/filesystem/manifest-reader.ts`,
    `test/infrastructure/filesystem/manifest-reader.test.ts` (actualizar las
    aserciones existentes sobre la forma vieja de `resources`).

### P3. Tipos de unidad y de documento nuevos

- [x] Sumar `"analysis_document"`, `"analysis_section"`, `"analysis_topic"`,
      `"analysis_recommendation"` a `knowledgeUnitTypes`
      (`documentUnitTypes` incluye `"analysis_document"`). Sumar
      `"analysis"` a `sourceDocumentKinds`.
  - Depende de: P1.
  - Aceptación: `KnowledgeUnit.create` acepta los cuatro tipos nuevos con las
    mismas reglas de `depth`/`parentId` ya vigentes para tipos de documento
    vs. no-documento.
  - Verificar: `node --import tsx --test test/domain/indexing/knowledge-unit.test.ts`.
  - Archivos: `src/domain/indexing/knowledge-unit.ts`,
    `src/domain/indexing/source-document.ts`.

Checkpoint P: los contratos nuevos existen, tipan y no rompen ningún test
existente. Todavía no hay ningún parser ni caso de uso que los use.

## Bloque Q — Parser de `analysis.json`

### Q1. `analysis-json-parser.ts`

- [x] Crear `parseAnalysisJson`, espejo de `parseRulesJson`: valida forma
      exacta de schema 2.0, exige los seis campos de cada `topic`, los
      cuatro de cada `recommendation`, valida `evidence_class`/`confidence`/
      `chosen_by` contra las listas cerradas, detecta ids de topic o
      recommendation duplicados, exige `schema_version` presente (sin
      forzar el valor exacto `"2.0"` — sólo formato de texto no vacío, igual
      que `RulesDocumentSnapshot.schemaVersion` hoy).
  - Depende de: P1.
  - Aceptación: fixture completo de `analysis.json` real (basado en el
    template de `authoring.md` de la skill productora) parsea sin pérdida de
    campos; cada forma de error tiene su propio test (campo faltante, enum
    inválido, id duplicado, video_id no coincide).
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/analysis-json-parser.test.ts`.
  - Archivos: `src/infrastructure/filesystem/analysis-json-parser.ts`,
    `test/infrastructure/filesystem/analysis-json-parser.test.ts`,
    `test/fixtures/indexing/analysis-complete.json` (nuevo fixture).

Checkpoint Q: `analysis.json` parsea a `AnalysisDocumentSnapshot` de forma
aislada, sin estar todavía cableado a la lectura de paquetes.

## Bloque R — Lectura de paquete y unidades de conocimiento

### R1. Lectura del recurso estructurado por `switch`

- [x] Reemplazar el `if (manifestVideo.resources.rules)` de
      `filesystem-package-source-reader.ts` por un `switch` exhaustivo sobre
      `manifestVideo.resources.structuredContent`: caso `"rules"` lee
      `deliverables/rules.json` (comportamiento ya existente, sin cambios de
      resultado), caso `"analysis"` lee `deliverables/analysis.json` y
      parsea con `parseAnalysisJson`, caso `"none"` no agrega documento.
  - Depende de: Q1, P2.
  - Aceptación: un paquete real con `structuredContent: "analysis"` produce
    un `PackageSnapshot` con tres documentos (`context`, `analysis`,
    `metadata`); un paquete con `structuredContent: "rules"` sigue
    produciendo exactamente lo mismo que antes de este bloque (regresión
    cero sobre los 34 videos existentes); el `switch` no compila si falta
    manejar algún miembro de `StructuredContentKind`.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/package-source-reader.test.ts`.
  - Archivos: `src/infrastructure/filesystem/filesystem-package-source-reader.ts`,
    `test/infrastructure/filesystem/package-source-reader.test.ts`.

### R2. Unidades de conocimiento de `analysis.json`

- [ ] Extender `build-knowledge-units.ts` con `buildAnalysisUnits`, simétrico
      a `buildRulesUnits`: raíz `analysis_document` (resumen + lens, no
      searchable) → secciones `analysis_section` fijas ("Summary and lens",
      "Evidence boundary", "Assessment", cabecera "Topics", cabecera
      "Recommendations") → hijos `analysis_topic`/`analysis_recommendation`
      bajo sus cabeceras respectivas.
  - Depende de: P3, R1.
  - Aceptación: cada `topic`/`recommendation` produce una unidad `searchable:
true` con `timestamps`/`visualEvidence` propagados donde el schema los
    trae (topics); `assessment` y `evidence_boundary` son una sola sección
    searchable cada una; el `switch` de `buildKnowledgeUnits` gana un caso
    `"analysis"`.
  - Verificar: `node --import tsx --test test/application/indexing/build-knowledge-units.test.ts`.
  - Archivos: `src/application/indexing/build-knowledge-units.ts`,
    `test/application/indexing/build-knowledge-units.test.ts`.

Checkpoint R: `syncSource` puede indexar un paquete real con `analysis.json`
de punta a punta salvo por la restricción del `CHECK` de SQLite (bloque S).

## Bloque S — Migración SQLite y bucketing

### S1. `CHECK` de `source_documents.kind` incluye `'analysis'`

- [ ] Editar `001-initial.ts` in place (decisión confirmada: no existe base
      real que preservar) para que el `CHECK` sea
      `CHECK (kind IN ('context', 'rules', 'analysis', 'metadata'))`.
  - Depende de: ninguno (independiente del resto del bloque S).
  - Aceptación: una base nueva acepta `INSERT INTO source_documents (...,
kind, ...) VALUES (..., 'analysis', ...)`; los tests de migración
    (`open-database.test.ts`, `migrations`) siguen en verde sin cambios.
  - Verificar: `node --import tsx --test test/infrastructure/sqlite/open-database.test.ts`.
  - Archivos: `src/infrastructure/sqlite/migrations/001-initial.ts`.

### S2. Bucketing de `assembleContext`

- [ ] Sumar `"analysis_document"`, `"analysis_section"`, `"analysis_topic"`
      a `highestRelevanceTypes` y `"analysis_recommendation"` a
      `relatedRulesTypes` en `context-blocks.ts`.
  - Depende de: P3.
  - Aceptación: un `ContextUnitBlock` con `unitType: "analysis_topic"` y
    `origin: "candidate"` clasifica como `"highest_relevance"`; uno con
    `"analysis_recommendation"` clasifica como `"related_rules"`; el resto
    de `classifyContextSection` (ancestros siempre a `additional_context`)
    no cambia.
  - Verificar: `node --import tsx --test test/application/context/context-blocks.test.ts`
    (o el archivo que cubra `classifyContextSection`).
  - Archivos: `src/application/context/context-blocks.ts`,
    su archivo de test correspondiente.

### S3. E2E de indexación y recuperación con SQLite real

- [ ] Cubrir con un E2E real (SQLite en disco temporal, sin fakes) un
      paquete con `analysis.json`: `sync` lo indexa, `retrieve` lo recupera
      y el bundle resultante cita correctamente una unidad `analysis_topic`
      y una `analysis_recommendation` en las secciones esperadas.
  - Depende de: S1, S2, R1, R2.
  - Aceptación: extiende el fixture existente de
    `test/e2e/context-assembly.e2e.test.ts` (o agrega un caso nuevo) con un
    segundo video de esquema `analysis`; la integridad de citas se sostiene
    igual que con `rules.json`.
  - Verificar: `node --import tsx --test test/e2e/context-assembly.e2e.test.ts`.
  - Archivos: `test/e2e/context-assembly.e2e.test.ts` y sus fixtures.

Checkpoint S: `analysis.json` es un ciudadano de primera clase de punta a
punta contra fixtures y SQLite real. Falta sólo la validación contra
contenido real de `auto-design`/`design-catalog`.

## Bloque T — Validación real

### T1. Sincronización real de videos con `analysis.json`

- [ ] Copiar una porción de `auto-design` (los 17 videos con
      `resources.analysis`) —y, si el tiempo lo permite, algunos de
      `design-catalog`— a un directorio temporal, sincronizar con el modelo
      E5 real, verificar `doctor` en `ok` y digest SHA-256 del árbol fuente
      idéntico antes/después.
  - Depende de: bloque S completo.
  - Aceptación: los 17 videos (o el subconjunto disponible) quedan
    indexados sin `issues` de esquema; `status` reporta los paquetes
    correctos.
  - Verificar: revisión manual + `doctor`.
  - Archivos: ninguno persistido (copia temporal, se borra al terminar).

### T2. Consulta semilla nueva orientada a `analysis.json`

- [ ] Sembrar al menos una consulta nueva en
      `evals/queries/seed-queries.json` cuyo `expected.notes` dependa
      específicamente de contenido de `topics`/`recommendations`/
      `assessment` (no alcanzable desde `rules.json`), correr `retrieve` en
      `balanced` sobre la copia temporal de T1, e inspeccionar
      cualitativamente que el bundle cite `analysis_topic`/
      `analysis_recommendation` reales con procedencia correcta.
  - Depende de: T1.
  - Aceptación: al menos un `[S0N]` del bundle resuelve a una unidad
    `analysis_topic` o `analysis_recommendation`; `context.md` es legible y
    coherente.
  - Verificar: revisión manual.
  - Archivos: `evals/queries/seed-queries.json`.

### T3. Cierre y documentación

- [ ] Actualizar `docs/product-spec.md`, `docs/indexing-design.md`,
      `docs/context-assembly-design.md`, `docs/decisions.md` (mover de
      "Pendientes de decisión" a decisión cerrada) y `docs/agent-handoff.md`
      con el resultado real de T1/T2. Actualizar `docs/build.md` con el
      nuevo punto de progreso (ver nota de numeración abajo).
  - Depende de: T1, T2.
  - Aceptación: ningún documento sigue describiendo `analysis.json` como
    "no soportado" o como pendiente sin resolver.
  - Verificar: `npm run check` y revisión manual del worktree.
  - Archivos: los cinco `docs/*.md` listados arriba.

Checkpoint T: soporte de schema 2.0 cerrado y validado contra contenido real
de al menos una colección.

## Nota de numeración en `build.md`

Este trabajo es posterior al cierre del MVP (2.1–2.4, 3.1–3.2, todos al
100%). Se registra como un punto nuevo fuera de las fases 1–3 ya cerradas
—por ejemplo `4.1 — Soporte de analysis.json (schema 2.0)`— en vez de
reabrir el número de un punto ya cerrado. T3 deja la numeración final
exacta a cargo de quien cierre el bloque, coordinada con `build.md` en ese
momento.
