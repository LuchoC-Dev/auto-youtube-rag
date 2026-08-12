# Diseño de ensamblado de contexto

## Estado

Especificación **aprobada** el 12 de agosto de 2026 para el punto 2.3, con las
seis decisiones de la sección final ya confirmadas por el usuario. Continúa
[retrieval-design.md](retrieval-design.md), que ya reservó `getUnits` y
`getAncestors` en `KnowledgeRepository` para este punto. El registro
consolidado de las decisiones vive también en
[decisions.md](decisions.md#diseño-de-ensamblado-de-contexto-aprobado).

## Alcance

2.3 toma `RetrievalOutcome` de `retrieveCandidates` (2.2) y produce el bundle
`context.md` + `result.json` que consume el agente, más el comando `retrieve`
de la CLI que lo expone.

| Dentro de 2.3                             | Fuera de 2.3 (queda para 3.x)           |
| ----------------------------------------- | --------------------------------------- |
| Expansión de candidatos a unidades padre  | Calibración de pesos RRF                |
| Deduplicación de contenido repetido       | Umbral mínimo de similitud vectorial    |
| Presupuesto de tokens por profundidad     | Evaluaciones de recall/precisión reales |
| Asignación de citas `[S0N]`               | Interfaz humana                         |
| Redacción de `context.md` y `result.json` | `rebuild` (no depende de este punto)    |
| Comando `retrieve` de la CLI              | Reranking adicional o LLM interno       |

`retrieve` pasa a estar disponible recién al cerrar 2.3.

## Dónde vive cada pieza (decisión de capas)

Siguiendo la arquitectura ya establecida (dominio puro, aplicación con
puertos, infraestructura con detalles concretos):

- **Dominio** (`src/domain/context/`): sólo el value object de presupuesto
  (`ContextDepth`, resolución de tokens). Es la única regla de negocio con
  invariantes propias (nombres de preset estables, override positivo). No
  conoce Markdown, JSON ni el sistema de archivos.
- **Aplicación** (`src/application/context/`): el caso de uso que orquesta
  `KnowledgeRepository.getAncestors`, y las políticas puras de expansión,
  deduplicación, presupuesto, citas y **renderizado a texto** (Markdown y el
  objeto `result.json`). El renderizado es una función pura de tipos de
  aplicación a `string`/objeto plano — no toca disco, así que vive aquí igual
  que `render-cli-output.ts` vive en la interfaz pero sin abrir archivos.
- **Infraestructura** (`src/infrastructure/filesystem/`): sólo la escritura
  del bundle a disco (`<out>/<request_id>/context.md` y `result.json`) y la
  generación de `request_id`.
- **Interfaz** (`src/interfaces/cli/`): parseo de `retrieve` y el recibo
  compacto en `stdout`, igual que los comandos existentes.

Esto mantiene la misma regla que ya rige el proyecto: el dominio y la
aplicación no conocen rutas de Node ni formatos de archivo concretos, y sólo
la infraestructura escribe.

## Modelo de presupuesto

```ts
export type ContextDepth = "focused" | "balanced" | "deep";

export const contextDepthPresets: Readonly<Record<ContextDepth, number>> = {
  focused: 12_000,
  balanced: 32_000,
  deep: 64_000,
};

export class ContextBudget {
  readonly depth: ContextDepth;
  readonly maxTokens: number;

  static default(): ContextBudget;
  static create(input: {
    depth?: unknown;
    maxTokensOverride?: unknown;
  }): ContextBudget;
}
```

Implementado en `src/domain/context/context-budget.ts` siguiendo el mismo
patrón que `RetrievalLimits`: constructor privado, `create()` valida y aplica
valores por defecto, `default()` es un atajo sin overrides. `depth` por
defecto es `balanced`, según `cli-contract.md`. `--max-tokens`
reemplaza el número pero nunca los nombres públicos de los presets: el
override es sólo un entero positivo, sin tope superior propio — un valor
absurdamente alto simplemente nunca se alcanza porque no hay más evidencia que
ofrecer.

## Solicitud de ensamblado

```ts
export interface ContextRequest {
  readonly query: RetrievalQuery; // reutiliza el value object de 2.2
  readonly budget: ContextBudget; // ya resuelve depth + maxTokens (I1)
}
```

No se crea un nuevo value object de consulta: `RetrievalQuery` y
`RetrievalFilter` de 2.2 ya cubren texto, filtros y límites de candidatos. El
único concepto nuevo de 2.3 es el presupuesto, y se reutiliza `ContextBudget`
en vez de repetir `depth`/`maxTokensOverride` sueltos.

## Expansión a unidades padre

1. Partir de `RetrievalOutcome.candidates` (ya deduplicados por unidad y
   diversificados por video en 2.2; como máximo `fusedResults`, 50 por
   defecto).
2. Recolectar el conjunto único de `unitId` de los candidatos.
3. Llamar **dos** lotes, no uno: `knowledgeRepository.getUnits(unitIds)` y
   `knowledgeRepository.getAncestors(unitIds)`. `getAncestors` sólo devuelve
   el conjunto plano y deduplicado de unidades ancestro —no dice qué ancestro
   corresponde a qué candidato—, y `KnowledgeUnit` no transporta metadata de
   video/documento (eso vive únicamente en `CandidateProvenance`). `getUnits`
   recupera el `parentId` de cada candidato, indispensable para reconstruir su
   cadena exacta y para que cada bloque de ancestro herede la metadata del
   candidato que lo originó, ya que un ancestro nunca cruza de documento.
   Sigue siendo O(1) en cantidad de consultas: dos lotes, no una consulta por
   candidato.
4. Construir un bloque citable (`ContextUnitBlock`) por cada candidato (usando
   `provenance.content`, que ya es el texto completo de la unidad en el caso
   común — sólo se fragmenta cuando una unidad excede el límite de tokens del
   modelo, ver `fragment-knowledge-units.ts`) y, caminando `parentId` desde la
   unidad de cada candidato hacia la raíz a través del mapa de ancestros, un
   bloque por cada unidad ancestro no vista todavía (usando
   `KnowledgeUnit.content`, siempre el texto íntegro de la unidad, nunca un
   fragmento, y heredando `packageRef`, `documentKind`, `documentRelativePath`,
   `videoTitle`, `creator`, `canonicalUrl` y `language` del candidato que lo
   trajo). Si dos candidatos comparten un ancestro, el segundo camino se
   detiene apenas encuentra un `unitId` ya construido.

```ts
export interface ContextUnitBlock {
  readonly unitId: KnowledgeUnitId;
  readonly packageRef: PackageRef;
  readonly unitType: KnowledgeUnitType;
  readonly headingPath: readonly string[];
  readonly title: string | null;
  readonly content: string;
  readonly contentHash: string; // para la deduplicación de J2
  readonly tokenCount: number;
  readonly origin: "candidate" | "ancestor";
  readonly fusedScore: number; // propio, o el del candidato que expandió el ancestro
  readonly depth: number; // profundidad jerárquica, 0 = documento
  readonly documentKind: SourceDocumentKind;
  readonly documentRelativePath: string;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly canonicalUrl: string | null;
  readonly language: string | null;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
}
```

Implementado en `src/application/context/context-blocks.ts`, junto con
`BudgetAllocation` y `CitationRecord`. `fusedScore` nunca es `null`: un bloque
de ancestro hereda el puntaje del candidato que lo trajo, porque J3 necesita
un valor comparable para ordenar dentro de "Additional relevant context" sin
introducir un segundo criterio de orden.

El objeto `result.json` se tipó en `src/application/context/context-bundle.ts`
(`ContextResultDocument`). `cli-contract.md` deja los ítems de `units[]` y
`sources[]` sin schema explícito más allá del ejemplo de cita; 2.3 lo completa
así: cada `ContextResultUnit` extiende `CitationRecord` con `section`
(`highest_relevance | related_rules | additional_context`), `content` y
`tokenCount`; cada `ContextResultSource` resume un `packageRef` distinto
(`sourceName`, `videoId`, `videoTitle`, `creator`, `canonicalUrl`).
`coverage` reporta conteos reales (`unitsByType`, `unitsBySource`,
`omittedForBudget`, `budgetExhausted`), nunca texto inventado.

`tokenCount` de un candidato viene de `provenance.tokenCount`; el de un
ancestro viene de `KnowledgeUnit.estimatedTokens`. Ninguno de los dos se
recalcula: ambos ya están persistidos desde la indexación (2.1), así que el
ensamblado nunca vuelve a tokenizar ni depende del modelo de embeddings.

## Deduplicación

Dos niveles, ambos exigidos por `product-spec.md` ("deduplicar contenido
repetido"):

1. **Por `unitId`**: una unidad que ya apareció como candidato nunca se repite
   como ancestro de otro candidato (por ejemplo, dos `rule_item` hermanos que
   comparten el mismo `rule_pattern` padre). Se construye un único bloque por
   `unitId`, con prioridad de metadatos (`origin: "candidate"` gana sobre
   `"ancestor"` si la misma unidad llega por ambos caminos).
2. **Por `contentHash`**: en el caso raro de contenido idéntico bajo dos
   `unitId` distintos (por ejemplo, una regla repetida verbatim en dos
   paquetes), se conserva sólo el primero en orden de inclusión y el resto se
   omite. No se fusionan referencias: la unidad omitida simplemente no genera
   bloque ni cita.

## Presupuesto y truncamiento

El orden de entrada al presupuesto es fijo y determinista:

1. Bloques de candidato cuyo `unitType` sea `context_section`,
   `context_document`, `rules_section` o `rules_document`, ordenados por
   `fusedScore` descendente → alimentan "Highest-relevance context".
2. Bloques de candidato cuyo `unitType` sea `rule_pattern`, `rule_item`,
   `avoid_item` o `acceptance_criterion`, ordenados por `fusedScore`
   descendente → alimentan "Related rules and patterns".
3. Bloques de ancestro, ordenados por el `fusedScore` del candidato que los
   originó (descendente) y, dentro de un mismo candidato, por `depth`
   descendente —`depth` 0 es la raíz del documento, así que un `depth` mayor
   es más cercano a la hoja— para que el padre inmediato preceda siempre al
   abuelo → alimentan "Additional relevant context".

Cada categoría de `unitType` cae en una sola sección: una unidad no aparece
dos veces aunque coincida por ambas vías de búsqueda, porque ya llega
deduplicada por `unitId` desde el paso anterior.

`allocateBudget` recorre esa secuencia acumulando `tokenCount` y **nunca corta
un bloque a la mitad**: incluye el bloque completo o lo omite entero, para que
ninguna cita quede truncada. Regla de caso límite: si el primer bloque por sí
solo ya excede el presupuesto, se incluye igual —el bundle nunca queda vacío
habiendo evidencia relevante real— y el presupuesto se marca agotado
inmediatamente después, sin agregar nada más.

```ts
export interface BudgetAllocation {
  readonly included: readonly ContextUnitBlock[];
  readonly omittedCount: number;
  readonly estimatedTokens: number;
  readonly budgetExhausted: boolean;
}
```

## Citas

Los IDs `[S01]`, `[S02]`... se asignan **después** del presupuesto, en el
orden final de inclusión: un bloque omitido nunca reserva ni salta un número.
Cada bloque incluido produce exactamente un registro de cita, siguiendo el
esquema ya aprobado en `cli-contract.md`:

```ts
export interface CitationRecord {
  readonly citationId: string; // "S01", "S02", ...
  readonly sourceName: string;
  readonly videoId: string;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly file: string; // documentRelativePath
  readonly headingPath: readonly string[];
  readonly unitType: KnowledgeUnitType;
  readonly timestamp: string | null; // primer timestamp si existe
  readonly visualEvidence: readonly string[];
}
```

Dos bloques del mismo video reciben citas distintas si su `headingPath`
difiere, tal como muestra el ejemplo de `cli-contract.md`.

## Redacción de `context.md`

Función pura `renderContextMarkdown(request, allocation, citations, metrics)`
que produce exactamente el documento aprobado en `cli-contract.md`:
front-matter (`schema_version`, `query`, `depth`, `estimated_tokens`,
`sources_used`) y las seis secciones fijas. Cada bloque se renderiza con su
`headingPath` como subtítulo y su contenido íntegro seguido del marcador
`[S0N]`; "corta" en el contrato describe el marcador de cita, no un recorte
del contenido — el agente necesita el texto completo del bloque, no un
resumen. "Coverage and limitations" enumera, sin inventar nada, sólo señales
reales disponibles: advertencias de `RetrievalOutcome.warnings`,
`budgetExhausted`, `omittedCount` y fuentes filtradas explícitamente por el
usuario. "Source registry" lista cada `packageRef` distinto presente en los
bloques incluidos, con su `sourceName`, `videoId`, título y creador.

## Redacción de `result.json`

Función pura `renderContextResult(request, allocation, citations, metrics,
warnings)` que produce el objeto versionado ya aprobado, con `units` (un
elemento por bloque incluido, con su cita), `sources` (el mismo registro que
la sección Markdown), `coverage` (conteos por `unitType` y por fuente) y
`limitations` (texto derivado únicamente de warnings/truncamiento reales, en
inglés). `status` es `"ok"` si hay al menos un bloque incluido, o
`"no_results"` si `RetrievalOutcome.status` ya era `"no_results"` o si el
presupuesto no permitió incluir ningún bloque (presupuesto absurdamente bajo,
por ejemplo `--max-tokens 1`).

## Escritura del bundle

`writeContextBundle(bundle, outputDir)` en infraestructura crea
`<outputDir>/<request_id>/context.md` y `result.json`. `request_id` sigue el
mismo patrón ya usado para `SyncId` en `sync-source.ts`
(`Date.now().toString(36)` + aleatorio), inyectable para pruebas
deterministas. El formato `01J...` del ejemplo en `cli-contract.md` es
ilustrativo, no una exigencia de ULID real: no se añade una dependencia nueva
para generarlo, igual que `SyncId` no la necesitó.

Sin `--out`, se usa `os.tmpdir()` con el mismo `request_id` como subcarpeta —
consistente con "sin él, se utiliza un directorio temporal identificado por
`request_id`" en `cli-contract.md`. `--out` con una ruta existente y no vacía
que no sea ya un directorio de un `request_id` anterior debe fallar de forma
explícita en vez de mezclar bundles.

## Comando `retrieve`

```text
auto-youtube-rag retrieve <query> \
  [--depth focused|balanced|deep] \
  [--max-tokens <positive-integer>] \
  [--source <name>] \
  [--out <directory>]
```

`--source` es repetible (igual patrón que otros filtros de lista). El
comando:

1. parsea argumentos y construye `RetrievalQuery`/`RetrievalFilter`/
   `RetrievalLimits` con los valores por defecto de 2.2;
2. llama `application.retrieveCandidates`;
3. si `status` es `no_results`, ensambla igual un bundle mínimo con
   `coverage`/`limitations` explicando la ausencia de evidencia, en vez de no
   escribir nada — el agente siempre recibe un bundle que puede leer;
4. si hay candidatos, expande, deduplica, presupuesta, cita y renderiza;
5. escribe el bundle y emite el recibo compacto de `cli-contract.md` en
   `stdout`;
6. código de salida `0` para `ok`/`no_results`, `1` si `retrieveCandidates`
   sólo pudo completar una vía degradada y eso se refleja como `status:
"partial"` en el recibo, `2` para uso inválido.

`stderr` recibe únicamente progreso ("Retrieving context...", "Assembling
bundle..."), igual que `sync`.

## Invariantes

- Ningún bloque se trunca a la mitad: se incluye completo o se omite.
- Ninguna cita `[S0N]` queda sin su registro correspondiente en
  `result.json`, y viceversa.
- El ensamblado nunca vuelve a tokenizar ni abre el modelo de embeddings:
  usa exclusivamente `tokenCount`/`estimatedTokens` ya persistidos.
- El ensamblado nunca escribe en SQLite ni en las fuentes.
- Un paquete fuente nunca se abre directamente: todo el contenido citado sale
  de `KnowledgeRepository`.
- `context.md` no responde la consulta ni agrega inferencias: sólo organiza
  evidencia con procedencia.
- `limitations` y "Coverage and limitations" nunca fabrican una causa: sólo
  describen señales reales (`warnings`, `budgetExhausted`, `omittedCount`,
  filtros aplicados).
- `retrieve` no se anuncia como disponible hasta que este punto cierre.

## Pruebas exigidas

- Presupuesto: `ContextDepth` resuelve los tres presets; `--max-tokens`
  reemplaza el preset sin cambiar su nombre; un entero no positivo o no
  entero se rechaza.
- Expansión: un candidato hijo trae a su padre y abuelo hasta la raíz; dos
  candidatos hermanos no duplican el padre común; una unidad ya candidata
  nunca se repite como ancestro.
- Deduplicación: dos unidades con `contentHash` idéntico producen un solo
  bloque y una sola cita.
- Presupuesto y truncamiento: un presupuesto pequeño omite bloques enteros,
  nunca los recorta; el primer bloque se incluye igual si por sí solo excede
  el presupuesto; `omittedCount` y `budgetExhausted` son correctos.
- Citas: los IDs son secuenciales sin huecos en el orden final de inclusión;
  dos bloques del mismo video con `headingPath` distinto reciben citas
  distintas; todo `[S0N]` del Markdown resuelve en `result.json`.
- Redacción: `context.md` conserva las seis secciones fijas y el
  front-matter; `result.json` valida contra el esquema de `cli-contract.md`.
- CLI: `retrieve` sin resultados escribe un bundle válido con
  `status: "no_results"`; `--source` repetido filtra correctamente; `--out`
  respeta la ruta pedida; sin `--out` usa un directorio temporal; los códigos
  de salida coinciden con el contrato.
- E2E: ciclo completo sobre la colección temporal reproducible, con
  embeddings deterministas como en `test/e2e/retrieval.e2e.test.ts`, y digest
  del árbol fuente sin cambios antes/después.

## Decisiones aprobadas el 12 de agosto de 2026

1. Bucketing fijo por `unitType`: unidades de documento/sección van siempre a
   "Highest-relevance context" y reglas/patrones siempre a "Related rules and
   patterns", nunca por puntaje puro.
2. Ancestros de expansión caen siempre en "Additional relevant context",
   nunca en las dos secciones anteriores, aunque el ancestro sea en sí un
   `rule_pattern` relevante.
3. Regla de bloque único que excede el presupuesto: se incluye igual y el
   presupuesto se marca agotado de inmediato, en vez de omitirlo.
4. Deduplicación en dos niveles desde el inicio de 2.3: por `unitId`
   (estructural, bloque J1) y por `contentHash` (contenido idéntico bajo
   unidades distintas, bloque J2). No se pospone.
5. `request_id` usa el mismo generador ad-hoc que `SyncId` (sin dependencia
   nueva). Es independiente de la decisión 4: una nombra el directorio del
   bundle, la otra colapsa contenido repetido dentro del bundle.
6. Presupuestos por profundidad: se mantienen los valores ya fijados en
   `cli-contract.md` (`focused` 12k / `balanced` 32k / `deep` 64k) sin
   recalibrar en este punto.
