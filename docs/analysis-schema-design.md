# Diseño de soporte para `analysis.json` (schema 2.0)

## Estado

**Aprobado el 13 de agosto de 2026, implementado y validado el mismo día.**
Las cuatro decisiones abiertas quedaron resueltas (ver "Decisiones
confirmadas" al final). Checklist fino en `docs/analysis-schema-tasks.md`
(bloques P–T, completos). Validación real contra la colección `auto-design`
en `docs/decisions.md`, sección "Soporte de `analysis.json` (schema 2.0):
implementado y validado".

## Contexto

El 2 de agosto de 2026 la skill productora de paquetes
(`youtube-video-context`, repositorio separado) reemplazó
`deliverables/rules.json` (schema 1.0) por `deliverables/analysis.json`
(schema 2.0) en un breaking change deliberado y documentado (commit
`aecdde9`): "deja de producir un manual de reglas de diseño para producir un
análisis general". La forma de contenido es incompatible, no un rename de
campo — ver `docs/decisions.md`, sección "Soporte de `analysis.json`
(schema 2.0): diseño aprobado".

El 13 de agosto se resolvió la mitad **amplificadora** del problema
(validación tolerante por video: un paquete con esquema no reconocido ya no
bloquea la sincronización del resto de la fuente). Este documento diseña la
mitad **de fondo**: que `auto-youtube-rag` pueda indexar y recuperar el
contenido real de `analysis.json`, en vez de descartarlo como issue
permanente. Sin este trabajo, los 17 videos reales de `auto-design` que ya
usan schema 2.0 —y todo video futuro, porque la skill no vuelve a
`rules.json`— quedan fuera de la biblioteca para siempre.

## Alcance

| Dentro de este diseño                                                                        | Fuera                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Parsear `analysis.json` (schema 2.0) como contenido indexable de primera clase               | Migrar los 17 videos existentes de `analysis.json` a `rules.json` o viceversa                                                             |
| Nuevo tipo de documento `"analysis"` en el dominio y la persistencia                         | Deprecar o dejar de soportar `rules.json`/schema 1.0 (sigue indexándose sin cambios)                                                      |
| Nuevos `KnowledgeUnitType` para `topics`/`recommendations`/`assessment`/sección de evidencia | Cambiar cómo se tratan los recursos ya excluidos (`transcript`, `frames`, `source_video`, etc.)                                           |
| Bucketing de `assembleContext` para el contenido nuevo                                       | Umbral de similitud vectorial, MCP, interfaz web (ya fuera del MVP)                                                                       |
| Migración SQLite para el nuevo `kind` de documento                                           | Recalibrar pesos de RRF o presupuestos por profundidad a causa de este contenido nuevo (se evalúa después, con datos reales, no a priori) |

## Decisión confirmada: sostener ambos esquemas indefinidamente

Los 34 videos existentes con `rules.json` no se regeneran solos —la skill
productora declaró explícitamente que v1 "no se migra automáticamente"—, así
que dejar de soportar schema 1.0 perdería contenido ya indexado y validado.
`auto-youtube-rag` trata `rules.json` y `analysis.json` como dos tipos de
documento estructurado independientes, seleccionados por cuál trae cada
paquete real (`resources.rules` / `resources.analysis`), no como versiones
de un mismo esquema donde una reemplaza a la otra.

## Decisión: `structuredContent` como enum obligatorio, no dos booleanos independientes

El borrador original de este documento proponía sumar `analysis: boolean`
junto a `rules: boolean`, ambos opcionales en la lectura cruda (clave
ausente → `false`). Funciona, pero dos flags independientes permiten
estados que no tienen sentido de negocio: `{ rules: true, analysis: true }`
no debería ocurrir nunca (un paquete real trae un tipo de conocimiento
estructurado, no los dos), y cada consumidor (`filesystem-package-source-reader.ts`,
y cualquier código futuro que dependa de "qué contenido estructurado tiene
este video") tendría que repetir dos `if` independientes en vez de manejar
un único valor exhaustivo.

**Corrección adoptada:** `ManifestResourceSnapshot` reemplaza `rules` y
`analysis` por un solo campo obligatorio y exhaustivo:

```ts
export const structuredContentKinds = ["rules", "analysis", "none"] as const;
export type StructuredContentKind = (typeof structuredContentKinds)[number];

export interface ManifestResourceSnapshot {
  readonly context: boolean;
  readonly structuredContent: StructuredContentKind;
  readonly metadata: boolean;
}
```

`manifest-reader.ts` sigue leyendo los booleanos crudos `resources.rules` y
`resources.analysis` del JSON —cada uno opcional, clave ausente equivale a
`false`, exactamente por la razón ya explicada: un manifest schema 1.0 no
declara `analysis` y uno schema 2.0 no declara `rules`— pero los colapsa a
un único `structuredContent` antes de construir el snapshot:

- `rules: true`, `analysis: false` → `"rules"`.
- `rules: false`, `analysis: true` → `"analysis"`.
- ambos `false` → `"none"` (paquete sin contenido estructurado; ya es un
  caso válido hoy cuando `resources.rules` es `false`, ver
  `manifest-mixed.json`).
- **ambos `true` → error de esquema** (`MANIFEST_SCHEMA_INVALID`, campo
  `resources`, "must not declare both rules and analysis"). No es un caso
  observado en la realidad; en vez de tolerarlo en silencio o indexar
  ambos documentos, se trata como cualquier otra entrada de manifest
  inválida — el video se descarta y se reporta como `ManifestVideoIssue`
  gracias a la validación tolerante por video ya implementada, en vez de
  abortar el manifest completo.

Todo el código que decide qué archivo leer (`filesystem-package-source-reader.ts`)
pasa de dos condicionales independientes a un único `switch` exhaustivo
sobre `structuredContent`, con el mismo patrón ya usado en
`buildKnowledgeUnits` para `document.kind`: si en el futuro aparece un
tercer tipo de contenido estructurado, TypeScript obliga a manejarlo en vez
de dejarlo caer silenciosamente por un `if` que nadie actualizó.

## Contrato de datos de `analysis.json` (schema 2.0)

Confirmado contra `references/authoring.md` del repositorio real de la skill
productora:

```json
{
  "schema_version": "2.0",
  "source": { "video_id", "title", "url", "creator", "duration_seconds", "language" },
  "analysis_lens": { "lens", "rationale", "chosen_by": "agent" | "user" },
  "summary": "string",
  "topics": [
    {
      "id", "title", "what_the_source_says",
      "evidence_class": "direct" | "visual" | "time_bound" | "unverified",
      "timestamps": ["string"], "visual_evidence": ["string"],
      "analyst_note": "string | omitted"
    }
  ],
  "recommendations": [
    { "id", "recommendation", "rationale", "confidence": "high" | "medium" | "low" }
  ],
  "assessment": { "strengths": ["string"], "weaknesses": ["string"], "verdict", "basis" },
  "evidence_boundary": { "transcript", "frames", "analyst_opinion", "unverified" }
}
```

Todo el contenido de `analysis.json` está en inglés siempre (salvo
`source.title`/`source.creator`, verbatim), a diferencia de `context.md` que
sigue el idioma del dossier — dato ya relevante para recuperación
multilingüe, no requiere tratamiento especial: FTS5/E5 ya son
idioma-agnósticos por diseño.

## Snapshots de aplicación nuevos (`package-snapshots.ts`)

```ts
export const analysisEvidenceClasses = [
  "direct",
  "visual",
  "time_bound",
  "unverified",
] as const;
export type AnalysisEvidenceClass = (typeof analysisEvidenceClasses)[number];

export const analysisConfidenceLevels = ["high", "medium", "low"] as const;
export type AnalysisConfidence = (typeof analysisConfidenceLevels)[number];

export interface AnalysisTopicSnapshot {
  readonly id: string;
  readonly title: string;
  readonly whatTheSourceSays: string;
  readonly evidenceClass: AnalysisEvidenceClass;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
  readonly analystNote: string | null;
}

export interface AnalysisRecommendationSnapshot {
  readonly id: string;
  readonly recommendation: string;
  readonly rationale: string;
  readonly confidence: AnalysisConfidence;
}

export interface AnalysisAssessmentSnapshot {
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly verdict: string;
  readonly basis: string;
}

export interface AnalysisEvidenceBoundarySnapshot {
  readonly transcript: string;
  readonly frames: string;
  readonly analystOpinion: string;
  readonly unverified: string;
}

export interface AnalysisLensSnapshot {
  readonly lens: string;
  readonly rationale: string;
  readonly chosenBy: "agent" | "user";
}

export interface AnalysisDocumentSnapshot {
  readonly kind: "analysis";
  readonly schemaVersion: string;
  readonly analysisLens: AnalysisLensSnapshot;
  readonly summary: string;
  readonly topics: readonly AnalysisTopicSnapshot[];
  readonly recommendations: readonly AnalysisRecommendationSnapshot[];
  readonly assessment: AnalysisAssessmentSnapshot;
  readonly evidenceBoundary: AnalysisEvidenceBoundarySnapshot;
}
```

`source.*` de `analysis.json` no se copia a un snapshot propio: duplica lo
que `metadata.json` ya aporta a `SelectedMetadataSnapshot`, y ese es el que
ya alimenta `VideoPackage`. Igual que `rules.json` hoy, `analysis.json` no es
la fuente de metadata del paquete.

`PackageDocumentSnapshotBase` se extiende con `TKind` `"analysis"`, se agrega
`AnalysisPackageDocumentSnapshot` y se suma al union `PackageDocumentSnapshot`
— mismo patrón que `RulesPackageDocumentSnapshot`.

## Parser nuevo: `analysis-json-parser.ts`

Espejo de `rules-json-parser.ts`: valida forma exacta, exige los seis campos
de cada `topic` (`id`, `title`, `what_the_source_says`, `evidence_class`,
`timestamps`, `visual_evidence`), los cuatro de cada `recommendation`, ids
con el mismo patrón estructural que `patternId` (`readStructuralSegment`),
detecta ids de topic/recommendation duplicados, valida los enums
`evidence_class`/`confidence`/`chosen_by` contra listas cerradas. No repite
la disciplina editorial completa del validador de la skill productora
(longitud, exhaustividad de cobertura): sólo reconoce forma parseable,
igual que `rules-json-parser.ts` no repite las reglas de autoría de
`rules.json`.

Códigos de error: `ANALYSIS_SCHEMA_INVALID`, `ANALYSIS_VIDEO_ID_MISMATCH`,
`ANALYSIS_DUPLICATE_TOPIC_ID`, `ANALYSIS_DUPLICATE_RECOMMENDATION_ID`.

## Lectura del paquete (`filesystem-package-source-reader.ts`)

El bloque que hoy es `if (manifestVideo.resources.rules) { ... }` se
reemplaza por un único `switch` exhaustivo sobre `structuredContent`:

```ts
switch (manifestVideo.resources.structuredContent) {
  case "rules": {
    const relativePath = "deliverables/rules.json";
    // leer, parsear con parseRulesJson, empujar a documents
    break;
  }
  case "analysis": {
    const relativePath = "deliverables/analysis.json";
    // leer, parsear con parseAnalysisJson, empujar a documents
    break;
  }
  case "none":
    break;
}
```

Un paquete real trae `rules.json` **o** `analysis.json`, nunca ambos; con el
enum, ese "nunca ambos" queda garantizado por construcción (el manifest ya
lo rechazó como error de esquema si declaraba los dos), no sólo asumido por
convención. El `switch` es exhaustivo: si en el futuro se agrega un tercer
`StructuredContentKind`, `tsc` obliga a manejarlo acá antes de compilar.

## Unidades de conocimiento (`build-knowledge-units.ts`)

Cuatro `KnowledgeUnitType` nuevos, simétricos al patrón ya usado para
`rules_document`/`rules_section`/`rule_pattern`/hijos:

```ts
"analysis_document",    // raíz, depth 0, no searchable — resumen + lens
"analysis_section",     // depth 1 — "Summary", "Evidence boundary", "Assessment", cabecera "Topics"/"Recommendations"
"analysis_topic",       // depth 2, hijo de la sección "Topics"
"analysis_recommendation", // depth 2, hijo de la sección "Recommendations"
```

`assessment` no necesita su propio `unitType`: a diferencia de `topics` y
`recommendations` (arrays con `id` propio, uno por elemento, igual que
`patterns[]`), `assessment` es un objeto único de cuatro campos —cabe entero
en una sola `analysis_section` searchable, igual que `coreThesis` de
`rules.json` hoy. `evidence_boundary` recibe el mismo tratamiento que
`evidence` en `rules.json`: una `analysis_section` searchable propia, para
que un agente pueda recuperar directamente "qué establece la transcripción
vs. qué es opinión del analista" sin traer todo el documento.

No hace falta migrar `search_fragments`/embeddings de forma especial: el
pipeline de fragmentación (`fragmentKnowledgeUnits`) ya opera sobre
`KnowledgeUnit.content`/`estimatedTokens` sin conocer el tipo de unidad.

## Bucketing en `assembleContext` (decisión de producto)

`classifyContextSection` (`context-blocks.ts`) usa dos sets fijos,
`highestRelevanceTypes` y `relatedRulesTypes`, con fallback a
`additional_context` para cualquier tipo no listado — así que technically
esto ya "funciona" sin tocar código (todo cae en la tercera sección). La
pregunta es si ese fallback es la ubicación correcta.

Propuesta:

- `analysis_document`, `analysis_section`, `analysis_topic` →
  `highestRelevanceTypes`. Cumplen el mismo rol que `context_section`/
  `rules_section`: son la cobertura narrativa sustantiva del video —
  `topics[]` es, en espíritu, lo que reemplaza a las secciones temáticas.
- `analysis_recommendation` → `relatedRulesTypes`. No es literalmente una
  "regla" ni un "patrón", pero comparte el rol funcional: contenido
  prescriptivo/accionable derivado del análisis, más cercano en tono a
  `rule_item`/`acceptance_criterion` que a la cobertura narrativa pura.

**Decisión confirmada: reutilizar las dos secciones fijas del bundle ya
aprobadas y publicadas** en `cli-contract.md` ("Highest-relevance context",
"Related rules and patterns"), sin renombrarlas ni agregar una tercera. La
alternativa —una cuarta sección "Assessment and recommendations"— habría sido
más precisa semánticamente, pero cambia el contrato de cable ya consumido por
la skill portable (`skill/SKILL.md`) y por agentes reales en producción. El
costo de una etiqueta "Related rules and patterns" levemente imprecisa para
una recomendación es bajo comparado con romper un contrato ya publicado, y es
reversible más adelante si la Capa B de una futura evaluación muestra que
confunde a los agentes.

## Migración SQLite: el hallazgo que más cambia el alcance

`source_documents.kind` tiene hoy `CHECK (kind IN ('context', 'rules',
'metadata'))`. Agregar `'analysis'` requiere una migración real, y
**`open-database.ts` hoy no soporta ninguna** — sólo sabe crear el esquema
completo en una base vacía o rechazar cualquier base que no esté ya
exactamente en `schema_version = '1'`. No existe todavía un mecanismo para
llevar una base existente y poblada de v1 a v2.

Dos caminos:

1. **Construir el primer migrador real** (`migrations/002-analysis-kind.ts` +
   lógica en `open-database.ts` que aplique 002 sobre una base en v1: SQLite
   no soporta `ALTER TABLE ... DROP CONSTRAINT`, así que el patrón estándar
   es crear `source_documents` nueva con el `CHECK` correcto, copiar filas,
   reemplazar la tabla, actualizar `schema_meta.schema_version` a `'2'`,
   todo en una transacción). Es la solución correcta a largo plazo —
   destraba cualquier evolución de esquema futura, no sólo esta— pero es
   trabajo de infraestructura nuevo, no sólo una migración más.
2. **Editar `001-initial.ts` in place** para que el `CHECK` ya incluya
   `'analysis'` desde el origen, sin agregar una migración 002. Mucho más
   simple, pero sólo es seguro si **no existe todavía ninguna base SQLite
   real y persistente** construida con el esquema actual — de lo contrario
   reescribir una migración ya aplicada rompe cualquier instalación
   existente en silencio (`assertCompatibleVersion` seguiría viendo
   `schema_version = '1'` pero el `CHECK` real ya no coincidiría con lo que
   el código espera poder escribir).

**Decisión confirmada: camino 2.** El usuario confirmó que no existe ninguna
base `.auto-youtube-rag/index.sqlite` real y persistente fuera de este
repositorio — sólo copias temporales ya borradas de validaciones anteriores
(2.1, 2.2, 2.3, M4). Existen dos colecciones fuente reales generadas por la
misma skill productora (`auto-design` y `design-catalog`, esta última con
algunos videos más), pero ninguna tiene todavía un índice SQLite persistente
construido a partir de ellas — son colecciones de paquetes en disco, no
bases de `auto-youtube-rag`. `design-catalog` queda anotada como candidata
adicional para el bloque T. Si esta lectura fuera incorrecta —si en algún
momento se creó y se conserva un índice real fuera de este repo—, avisar
antes de que se ejecute el bloque S: editar `001-initial.ts` sobre una base
real ya poblada la dejaría en un estado inconsistente (`CHECK` nuevo, pero
`schema_version` desactualizada frente a lo que el código de ese momento
esperaba).

## Documentos a actualizar al implementar (ver T3 en `analysis-schema-tasks.md`)

- `docs/product-spec.md`: agregar `analysis.json` a la tabla de contenido
  indexado.
- `docs/indexing-design.md`: documentos, unidades y algoritmo de
  sincronización.
- `docs/context-assembly-design.md`: bucketing extendido.
- `docs/decisions.md`: cerrar con el resultado real de la implementación
  (T1/T2), no sólo con la decisión de diseño ya registrada.
- `docs/agent-handoff.md`: cerrar el pendiente ya anotado.
- `evals/queries/seed-queries.json` y una pasada de evaluación futura
  (fuera de este bloque): las 8 consultas semilla actuales sólo ejercitan
  contenido de `rules.json`; en algún momento conviene sembrar consultas que
  ejerciten específicamente contenido de `analysis.json` — no es parte de
  este diseño, se anota para no perderlo.

## Plan de bloques (detallado en `docs/analysis-schema-tasks.md`)

- **Bloque P** — contratos: snapshots de aplicación, `ManifestResourceSnapshot`
  extendido, `readResource` opcional, `KnowledgeUnitType` nuevos, `sourceDocumentKinds`
  extendido.
- **Bloque Q** — `analysis-json-parser.ts` y sus pruebas.
- **Bloque R** — `build-knowledge-units.ts` extendido, lectura de paquete en
  `filesystem-package-source-reader.ts`, pruebas.
- **Bloque S** — migración SQLite (camino 1 o 2 según la decisión), bucketing
  en `context-blocks.ts`, pruebas.
- **Bloque T** — E2E real: copiar la colección `auto-design` (y, si el tiempo
  lo permite, `design-catalog`), sincronizar incluyendo los videos con
  `analysis.json`, correr `retrieve` sobre al menos una consulta semilla
  nueva orientada a ese contenido, inspección cualitativa, verificar digest
  SHA-256 antes/después, borrar la copia.

## Decisiones confirmadas (13 de agosto de 2026)

1. **Sostener ambos esquemas indefinidamente.** `rules.json`/schema 1.0 no
   se congela ni se deprecia.
2. **Bucketing:** reutilizar las dos secciones fijas existentes del bundle
   (`highest_relevance` para topics, `related_rules` para recommendations)
   sin renombrarlas. No se toca `cli-contract.md` ni `skill/SKILL.md` por
   este cambio.
3. **Migración SQLite:** camino 2 — editar `001-initial.ts` in place para
   incluir `'analysis'` en el `CHECK` de `source_documents.kind` desde el
   origen. Confirmado que no existe una base `.auto-youtube-rag/index.sqlite`
   real y persistente que preservar; `auto-design` y `design-catalog` son
   colecciones fuente en disco, no índices ya construidos.
4. **Bloque T incluido** en este trabajo, no pospuesto.
