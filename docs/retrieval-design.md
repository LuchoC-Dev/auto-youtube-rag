# Diseño de recuperación híbrida

## Estado

Especificación propuesta el 11 de agosto de 2026 para el punto 2.2. Este
documento es la fuente de verdad de contratos, adaptadores y política de fusión
de la recuperación. Continúa [indexing-design.md](indexing-design.md), que ya
reservó las firmas de `KnowledgeRepository`, `TextSearchIndex` y
`VectorSearchIndex`.

## Alcance

El punto 2.2 entrega candidatos recuperados, fusionados, diversificados y con
procedencia completa. No ensambla `context.md`, no aplica presupuestos por
profundidad y no expone superficie de CLI.

| Dentro de 2.2                    | Fuera de 2.2 (corresponde a 2.3)     |
| -------------------------------- | ------------------------------------ |
| Consulta normalizada y filtros   | Presets `focused`/`balanced`/`deep`  |
| Búsqueda FTS5 con `bm25()`       | Presupuesto de tokens                |
| Búsqueda vectorial exacta con E5 | Expansión a unidades padre           |
| Fusión RRF ponderada             | Redacción de `context.md`            |
| Deduplicación y diversidad       | Asignación de citas `[S01]`          |
| Procedencia hasta paquete        | Escritura del bundle y `result.json` |
| Métricas y advertencias          | Comando `retrieve`                   |

`retrieve` no se anuncia como disponible hasta cerrar 2.3.

## Decisión de fusión aprobada

El 11 de agosto de 2026 se aprobó **RRF ponderado detrás de una interfaz
sustituible**, resolviendo el único asunto abierto de
[product-spec.md](product-spec.md).

`bm25()` devuelve valores negativos sin cota estable y la similitud coseno vive
en `0..1`. No son comparables, y normalizarlos por lote haría que el orden
dependa de qué otros candidatos aparecieron. RRF ignora la magnitud y combina
únicamente posiciones:

```text
score(f) = Σ  w_i / (k + rank_i(f))
```

Baseline: `k = 60`, `wText = 1.0`, `wVector = 1.0`. Un fragmento que aparece en
una sola lista conserva su aporte; un fragmento señalado por ambas vías gana por
consenso. Esa preservación de los hits exclusivos es la razón de la decisión: el
criterio de éxito del producto es cobertura amplia, no una única coincidencia.

Se descartó la cascada —una vía filtra y la otra reordena— porque elimina los
hits que sólo una vía encuentra. A la escala real (2.967 fragmentos, ~1,1 MB de
vectores) ejecutar ambas vías completas no tiene costo relevante, de modo que la
cascada no aporta rendimiento y sólo reduce recall.

Limitación conocida y aceptada: RRF descarta la distancia entre puntajes. Dos
fragmentos con coseno 0,95 y 0,40 se tratan como primero y segundo. Por eso la
estrategia queda detrás de `FusionStrategy` y los pesos se calibran en la etapa
3.2 con consultas reales, sin modificar casos de uso ni adaptadores.

## Modelo de recuperación

### Consulta normalizada

`RetrievalQuery` es un value object del dominio. Normaliza el texto a NFC,
recorta espacios y rechaza consultas vacías o exclusivamente de puntuación. No
altera acentos ni mayúsculas: `remove_diacritics 2` ya resuelve los diacríticos
del lado FTS5, y E5 recibe el texto original.

```ts
interface RetrievalQuery {
  readonly text: string;
  readonly filter: RetrievalFilter;
  readonly limits: RetrievalLimits;
}

interface RetrievalFilter {
  readonly sources: readonly SourceName[];
  readonly videoIds: readonly VideoId[];
  readonly languages: readonly string[];
  readonly unitTypes: readonly KnowledgeUnitType[];
}

interface RetrievalLimits {
  readonly textCandidates: number; // por defecto 100
  readonly vectorCandidates: number; // por defecto 100
  readonly fusedResults: number; // por defecto 50
  readonly maxPerVideo: number; // por defecto 4
}
```

Un filtro vacío significa "sin restricción". Los límites son de candidatos, no
de tokens; el presupuesto es un asunto de 2.3.

La consulta admite como máximo 1000 caracteres. El límite evita que un documento
pegado por error llegue al modelo de embeddings o al parser de FTS5; las
consultas reales de un agente son mucho más cortas. También se colapsan los
espacios internos, de modo que dos escrituras de la misma consulta produzcan el
mismo resultado.

Los tags de idioma se comparan en minúsculas porque los paquetes indexados los
declaran de forma inconsistente. Las listas de filtro conservan la primera
aparición de cada criterio: repetir un valor nunca cambia el SQL resultante.

### Hits y candidatos

Cada vía devuelve `RankedHit`, con la posición ya resuelta por el adaptador.
El caso de uso nunca compara puntajes crudos entre vías.

```ts
interface RankedHit {
  readonly fragmentId: SearchFragmentId;
  readonly rank: number; // 1-based, denso, sin huecos
  readonly rawScore: number; // diagnóstico y evaluación; nunca fusionado
}

interface RetrievalCandidate {
  readonly fragmentId: SearchFragmentId;
  readonly unitId: KnowledgeUnitId;
  readonly packageRef: PackageRef;
  readonly fusedScore: number;
  readonly textRank: number | null;
  readonly vectorRank: number | null;
  readonly provenance: CandidateProvenance;
}
```

`provenance` transporta ruta de encabezados, tipo de unidad, título y ruta
relativa del documento, creador, timestamps y evidencia visual. Es la materia
prima con la que 2.3 construye `[S01]`. Ninguna fila de SQLite ni tensor de
Transformers.js cruza estos límites.

### Resultado

```ts
interface RetrievalOutcome {
  readonly status: "ok" | "no_results";
  readonly candidates: readonly RetrievalCandidate[];
  readonly metrics: RetrievalMetrics;
  readonly warnings: readonly RetrievalWarning[];
}
```

Una consulta sin coincidencias es `no_results` con `candidates` vacío: es un
estado terminal válido, no un error, y corresponde al código de proceso `0`
según [cli-contract.md](cli-contract.md).

## Puertos

```ts
interface TextSearchIndex {
  search(request: TextSearchRequest): Promise<readonly RankedHit[]>;
}

interface VectorSearchIndex {
  load(model: EmbeddingModelDescriptor): Promise<void>;
  search(
    vector: Float32Array,
    request: VectorSearchRequest,
  ): Promise<readonly RankedHit[]>;
  apply(change: VectorIndexChange): Promise<void>;
}

interface KnowledgeRepository {
  getFragmentProvenance(
    ids: readonly SearchFragmentId[],
  ): Promise<readonly CandidateProvenance[]>;
  getUnits(ids: readonly KnowledgeUnitId[]): Promise<readonly KnowledgeUnit[]>;
  getAncestors(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]>;
}

interface FusionStrategy {
  fuse(input: FusionInput): readonly FusedHit[];
}
```

`VectorSearchIndex` extiende el `VectorIndexSink` actual con lectura. Es
deliberado: hoy `MemoryVectorIndexSink` recibe cambios pero no consulta, y
mantener dos objetos con copias distintas de los mismos vectores permitiría que
diverjan. `sync` sigue publicando exclusivamente después del commit SQLite.

`getUnits` y `getAncestors` se declaran e implementan en 2.2 porque el
repositorio es un solo adaptador, pero su consumo real ocurre en 2.3.

## Adaptador textual

`SqliteTextSearchIndex` consulta `fragment_fts` y ordena por `bm25()`.

### Sanitización de la consulta

La gramática de `MATCH` no es `LIKE`. Una consulta cruda como `diseño 3d: guía
(2024)` lanza un error de sintaxis, y palabras como `OR`, `NEAR` o `NOT` se
interpretan como operadores. El adaptador convierte el texto en una consulta
segura:

1. extraer como tokens las secuencias de letras y números, exactamente lo que
   el tokenizador `unicode61` considera token;
2. descartar todo lo demás —comillas, dos puntos, asteriscos, acentos
   circunflejos, paréntesis y guiones son separadores, de modo que la
   puntuación hostil nunca llega al parser;
3. deduplicar tokens sin distinguir mayúsculas, porque FTS5 pliega el caso al
   indexar;
4. envolver cada token en comillas dobles, lo que convierte `OR`, `NOT` y
   `NEAR` en términos literales;
5. limitar a 64 tokens para no agotar la profundidad de expresión de FTS5;
6. unir con `OR` explícito para maximizar cobertura;
7. si no queda ningún token, devolver `null` y no ejecutar SQL.

La suite verifica cada expresión generada contra un `MATCH` real de FTS5: la
gramática del motor es la única autoridad sobre si una consulta parsea.

El usuario nunca escribe sintaxis FTS5; ningún operador suyo se honra. Esto es
una decisión de seguridad y de previsibilidad, no una limitación temporal.

### Puntaje y orden

`bm25()` es más negativo cuanto mejor la coincidencia, de modo que el orden es
`ASC`. Las columnas se ponderan `title = 3.0`, `heading_path = 2.0`,
`content = 1.0`: un fragmento cuyo encabezado nombra el concepto suele ser mejor
contexto que uno que lo menciona de pasada. El desempate es `fragment_id ASC`
para que el orden sea totalmente determinista.

Los filtros se aplican con `JOIN` sobre `search_fragments`, `knowledge_units`,
`source_documents`, `video_packages` y `sources`, después del `MATCH`, para no
invalidar el uso del índice FTS.

## Adaptador vectorial

`InMemoryVectorSearchIndex` mantiene un `Float32Array` contiguo de
`fragmentos × 384` más un array paralelo de identidades y atributos de filtro.

### Carga

Se construye perezosamente desde SQLite, no al crear la aplicación: abrir la CLI
para `source list` no debe leer 1,1 MB de BLOBs ni tocar el modelo.

`sync` publica cambios que transportan vectores e identidades, pero no el tipo
de unidad ni el idioma sobre los que filtra la recuperación. Por eso `apply` no
parchea el índice —dejaría entradas nuevas imposibles de filtrar— sino que
descarta el snapshot y deja que la siguiente consulta lo reconstruya. SQLite ya
es la fuente de verdad y el cambio se publica después del commit, así que la
reconstrucción es siempre correcta y cuesta milisegundos a esta escala.
Reiniciar el proceso reconstruye por el mismo camino.

### Validación del modelo

Antes de consultar se compara `model_key`, `model_version` y `dimensions` de los
embeddings persistidos contra el descriptor del generador activo. Una
discrepancia produce un error explícito con código simbólico, nunca una
comparación silenciosa entre espacios vectoriales distintos.

### Similitud

Los vectores ya están normalizados en la indexación, de modo que el producto
punto equivale al coseno y evita una raíz cuadrada por fragmento. La consulta se
embebe con el prefijo `query:` de E5 —el prefijo asimétrico es parte del
contrato del modelo y usar `passage:` degradaría la calidad—. El barrido es
exacto sobre todos los fragmentos que pasan el filtro; a esta escala cuesta
milisegundos y evita el error de aproximación de un índice ANN.

## Orquestación

`retrieveCandidates` es el caso de uso y sólo conoce puertos:

1. normalizar y validar la consulta;
2. lanzar ambas búsquedas en paralelo;
3. si una vía falla, registrar una advertencia y continuar con la otra —una
   recuperación degradada es preferible a ninguna—;
4. fusionar con `FusionStrategy`;
5. hidratar procedencia del conjunto fusionado completo en una sola consulta
   por lote;
6. deduplicar: conservar el mejor fragmento por `unitId`;
7. diversificar: aplicar `maxPerVideo` recorriendo en orden de puntaje;
8. truncar a `fusedResults`;
9. devolver `RetrievalOutcome` con métricas.

La deduplicación precede a la diversidad de forma deliberada: dos fragmentos de
la misma sección son redundancia, mientras que dos secciones distintas del mismo
video son contexto legítimo hasta el límite por video.

Nota de implementación: la hidratación se adelantó respecto del orden original
de este documento. `RankedHit` sólo lleva `fragmentId`; ni la deduplicación por
`unitId` ni la diversidad por video son posibles sin conocer la procedencia, así
que ambas etapas necesitan el lote hidratado. El conjunto a hidratar está
acotado por `textCandidates + vectorCandidates`, de modo que sigue siendo una
sola consulta por lote, no una por candidato. Un hit fusionado sin procedencia
—una eliminación que compite con la consulta— se descarta en vez de mostrarse
sin evidencia.

## Determinismo

La misma consulta sobre la misma base produce exactamente el mismo orden. Se
consigue con desempates explícitos en cada etapa: `bm25` desempata por
`fragment_id`, la similitud desempata por `fragment_id`, y la fusión desempata
por puntaje, luego menor rango textual, luego `fragment_id`. Ninguna etapa
depende del orden de resolución de promesas ni del orden de iteración de un
`Map` construido concurrentemente.

## Invariantes

- Ninguna operación de recuperación escribe en SQLite ni en las fuentes.
- Ninguna operación de recuperación accede a la red.
- Ningún candidato se devuelve sin procedencia completa.
- Nunca se comparan puntajes crudos de vías distintas.
- Nunca se consultan embeddings de un modelo distinto al activo.
- El índice vectorial nunca contiene fragmentos ausentes de SQLite.
- Un paquete eliminado desaparece de ambos rankings sin reconstruir la base.
- La consulta del usuario nunca se interpreta como sintaxis FTS5.

## Pruebas exigidas

- Sanitización: acentos, mayúsculas, comillas, guiones, paréntesis, `OR`, `*`,
  consulta vacía y consulta sólo de puntuación.
- FTS5: término exacto raro, término frecuente, sin resultados, filtros por
  fuente/video/idioma/tipo de unidad.
- Vectorial: paráfrasis sin léxico compartido, consulta multilingüe, dimensión
  incorrecta, modelo ausente, base sin embeddings.
- Fusión: hit exclusivamente textual, exclusivamente vectorial, consenso,
  empates, pesos asimétricos y determinismo entre corridas.
- Diversidad: un video dominante no monopoliza el resultado.
- Ciclo de vida: `sync` hace consultable un paquete nuevo sin reinicio; eliminar
  un paquete lo retira de ambas vías; reiniciar reconstruye el índice.
- Degradación: una vía caída produce advertencia y resultados de la otra.

Las pruebas rápidas usan un generador de embeddings falso y determinista. El
modelo real sólo interviene en el smoke ya existente.

## Criterio de cierre

2.2 se marca completo cuando las pruebas demuestran los ocho puntos del criterio
provisional de [agent-handoff.md](agent-handoff.md), la suite rápida sigue
offline y `npm run check` y `npm run build` pasan.
