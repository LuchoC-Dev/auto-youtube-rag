# Registro de decisiones

## Confirmadas

| Tema               | Decisión                                                            | Motivo                                                               |
| ------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Nombre             | `auto-youtube-rag`                                                  | Identidad del proyecto                                               |
| Ejecución          | Exclusivamente local                                                | Privacidad y ausencia de servicios externos                          |
| Cerebro generativo | Agente consultante                                                  | Evitar duplicar razonamiento dentro del RAG                          |
| Integración        | Skill general + CLI                                                 | Portabilidad entre proveedores                                       |
| Ejecutable         | `auto-youtube-rag`                                                  | Nombre explícito y neutral                                           |
| Parser CLI         | `node:util.parseArgs` estricto                                      | API estándar de Node, sin dependencia adicional                      |
| Indexación         | Un único comando `sync`                                             | Evitar duplicar `index` y `sync`                                     |
| Recuperación CLI   | Comando `retrieve`                                                  | Ensambla contexto, no sólo coincidencias                             |
| Salida             | Bundle Markdown + JSON                                              | Evitar truncamiento y permitir integración                           |
| Profundidades      | 12k / 32k / 64k                                                     | Presets ajustables por evaluación                                    |
| Citaciones         | `[S01]` resuelto en JSON                                            | Lectura compacta con procedencia completa                            |
| Idioma             | Contenido original; claves inglesas                                 | Neutralidad entre proveedores                                        |
| Códigos de proceso | `0`, `1`, `2` y `130`                                               | Convención portable; detalle mediante códigos JSON                   |
| Skills             | Una fuente canónica                                                 | Evitar variantes para Codex y Claude                                 |
| Agentes iniciales  | Codex y Claude                                                      | Compatibilidad mínima requerida                                      |
| Lenguaje           | TypeScript estricto                                                 | Ruta integrada y soportada para ONNX en Windows                      |
| Toolchain          | TypeScript 6.0.3, ESLint 10, Prettier 3 y `node:test`               | Mantener análisis estricto, reproducible y oficialmente compatible   |
| Runtime            | Node.js 24.19.0 LTS con ESM                                         | Fijar una base reproducible validada localmente                      |
| Empaquetado        | npm + `package-lock.json`                                           | Instalación reproducible sin otro runtime                            |
| Arquitectura       | Dominio + puertos y adaptadores                                     | Sustituir infraestructura sin alterar casos de uso                   |
| Persistencia       | SQLite                                                              | Simplicidad local y escala suficiente                                |
| Cliente SQLite     | `node:sqlite`                                                       | Sin binding nativo y suficiente en el benchmark local                |
| Texto              | SQLite FTS5                                                         | Búsqueda exacta y por relevancia                                     |
| Embeddings         | E5 Small multilingüe `q8`                                           | Mejor equilibrio del benchmark local                                 |
| Acoplamiento       | Modelo y DB sólo en infraestructura                                 | Mantener dominio y aplicación reemplazables                          |
| Vectores           | BLOB SQLite + índice exacto en memoria                              | Menor latencia en el benchmark local                                 |
| Recuperación       | Híbrida y jerárquica                                                | Combinar precisión con cobertura amplia                              |
| Fusión             | RRF ponderado tras `FusionStrategy`                                 | Combina rangos sin comparar escalas y conserva hits exclusivos       |
| Resultado          | Contexto amplio y citado                                            | Proveer hechos suficientes al agente                                 |
| Fuentes            | Múltiples raíces registradas                                        | Unificar `auto-design` y `catalog-design`                            |
| Corpus principal   | `context.md`                                                        | Documento autónomo y validado                                        |
| Reglas             | `rules.json`                                                        | Fuente estructurada de patrones                                      |
| Metadata           | Filtros y procedencia                                               | Evitar tratar metadata como conocimiento                             |
| Transcripción      | Respaldo opcional                                                   | Evitar duplicar VTT y texto equivalente                              |
| Imágenes           | Referencias, sin embeddings MVP                                     | El nombre del archivo no es semántico                                |
| Alcance MVP        | Sólo paquetes de video                                              | Reducir superficie inicial                                           |
| UI humana          | Posterior al MVP                                                    | Primero validar recuperación para agentes                            |
| Pruebas            | Durante todo el desarrollo                                          | Detectar regresiones funcionales                                     |
| Evals              | Al cerrar el MVP                                                    | Medir calidad sobre el flujo completo                                |
| Método de evals    | Métricas mecánicas + juicio de Codex y Claude sobre el mismo bundle | Sin ground truth etiquetado; el agente consumidor es el juez natural |

## Diseño de indexación aprobado

- Identidad de paquete: `(source_name, video_id)`; el slug sólo localiza.
- Unidad amplia `KnowledgeUnit` separada de `SearchFragment` buscable.
- Metadata persistida mediante allowlist; no se guarda yt-dlp completo.
- `rules.json` conserva jerarquía de documento, patrón y elementos hijos.
- `sync` aplica cada paquete atómicamente y conserva la última versión válida.

## Volumen esperado

- Inicio: aproximadamente 40 videos.
- Crecimiento medio: aproximadamente 4 videos diarios.
- Picos: hasta 10 videos diarios.

## Modelo de embeddings aprobado

El benchmark inicial sobre 18 pasajes y 16 consultas dejó a
`multilingual-e5-small` como modelo del MVP: obtuvo `Hit@1 = 1.0` y
`MRR = 1.0`, igual que E5 Base, con 129 MB de caché y una latencia media de
11.5 ms frente a 29 ms de E5 Base. Puede sustituirse si las evaluaciones futuras
lo justifican; esa sustitución afectará al adaptador y al índice, no al dominio.

## Backend vectorial aprobado

El MVP persistirá vectores `float32[384]` como BLOB en SQLite y construirá un
índice contiguo en memoria para búsqueda exacta. En el benchmark fue cerca de
cinco veces más rápido que `sqlite-vec`; su costo adicional de RAM fue pequeño
para la escala inicial. El puerto `VectorSearchIndex` permite sustituirlo sin
modificar el dominio ni los casos de uso.

## Cliente SQLite aprobado

El MVP utilizará `node:sqlite` sobre Node.js 24.19.0 LTS. El benchmark contra
`better-sqlite3` validó transacciones, FTS5, BLOB, iteradores, reapertura,
backup e integridad con resultados equivalentes. `node:sqlite` evita el binding
nativo y funcionó con la configuración local que deshabilita scripts de npm.

`better-sqlite3` queda únicamente como dependencia de desarrollo para reproducir
el benchmark. El acceso a datos seguirá detrás de `KnowledgeRepository` y
`TextSearchIndex`, por lo que cambiar de cliente no afectará al dominio.

## Toolchain aprobado

El repositorio compila con `tsc`, ejecuta pruebas TypeScript con `node:test` y
`tsx`, aplica ESLint con las configuraciones estrictas y conscientes de tipos de
typescript-eslint, y usa Prettier como única autoridad de formato. `npm run
check` reúne las verificaciones rápidas obligatorias.

TypeScript queda fijado temporalmente en 6.0.3. TypeScript 7.0.2 ya estaba
disponible, pero typescript-eslint 8.67.0 declara soporte únicamente hasta
TypeScript menor que 6.1. La actualización se hará cuando exista compatibilidad
oficial, sin afectar la arquitectura ni los contratos del producto.

## Política de fusión aprobada

El 11 de agosto de 2026 se aprobó Reciprocal Rank Fusion ponderada como baseline
de la búsqueda híbrida, con `k = 60` y pesos iniciales `wText = wVector = 1.0`.

`bm25()` devuelve valores negativos sin cota estable y la similitud coseno vive
en `0..1`; no son comparables, y normalizarlos por lote haría que el orden
dependa de qué otros candidatos aparecieron. RRF combina únicamente posiciones,
es determinista y conserva los hits que sólo una de las dos vías encuentra, lo
que sostiene el criterio de cobertura amplia del producto.

Se descartó la cascada —una vía filtra y la otra reordena— porque pierde esos
hits exclusivos. A la escala real, ejecutar ambas vías completas no tiene costo
relevante, de modo que la cascada no aporta rendimiento.

La estrategia queda detrás del puerto `FusionStrategy`, por lo que los pesos
pueden calibrarse, o la estrategia sustituirse, sin modificar casos de uso ni
adaptadores. El detalle está en [retrieval-design.md](retrieval-design.md).

## Diseño de ensamblado de contexto aprobado

El 12 de agosto de 2026 se aprobaron las decisiones de diseño del punto 2.3,
detalladas en [context-assembly-design.md](context-assembly-design.md):

- Bucketing fijo por `unitType`: unidades de documento/sección van siempre a
  "Highest-relevance context" y reglas/patrones siempre a "Related rules and
  patterns", sin mezclar por puntaje puro.
- Los ancestros producidos por la expansión jerárquica caen siempre en
  "Additional relevant context", nunca en las dos secciones anteriores.
- Un bloque único que por sí solo excede el presupuesto se incluye igual —el
  bundle nunca queda vacío habiendo evidencia real— y el presupuesto se marca
  agotado de inmediato después.
- Deduplicación en dos niveles: por `unitId` (estructural) y por
  `contentHash` (contenido idéntico bajo unidades distintas), ambas
  implementadas desde el inicio de 2.3.
- `request_id` usa el mismo generador ad-hoc que `SyncId`
  (`Date.now().toString(36)` + aleatorio), sin añadir una dependencia de
  ULID. Es independiente de la deduplicación por `contentHash`: una nombra el
  directorio del bundle, la otra colapsa contenido repetido.
- Presupuestos por profundidad confirmados sin recalibrar: `focused` = 12k,
  `balanced` = 32k, `deep` = 64k tokens estimados.

## Diseño de evaluaciones aprobado

El 12 de agosto de 2026 se aprobó el diseño del punto 3.2, detallado en
[eval-design.md](eval-design.md):

- Sin ground truth de relevancia etiquetado a mano: es caro, subjetivo, y el
  criterio de éxito del producto no es una coincidencia puntual sino cobertura
  amplia y citada.
- Dos capas de medición independientes: mecánica (integridad de citas,
  cobertura, estado vs. `kind` esperado, calculable sin ningún agente) y
  juzgada (rúbrica corta que responde el agente consumidor real sobre el
  bundle ya ensamblado).
- Codex y Claude evalúan exactamente el mismo bundle por consulta y
  profundidad — nunca corridas de `retrieve` independientes por agente — para
  medir consistencia del producto entre proveedores, no comparar
  configuraciones de recuperación distintas.
- No se barre la grilla de pesos RRF ni de presupuestos por profundidad a
  ciegas: sólo se ajustan si la evidencia de 3.2 muestra un problema
  concreto, y el cambio se documenta aquí con esa evidencia.

## Decisión de calibración (O1, punto 3.2)

El 13 de agosto de 2026 se revisó, en conjunto, la Capa A mecánica (M3,
`evals/results/2026-08-12/layer-a-report.md`) y la Capa B juzgada (N4,
`evals/results/2026-08-12/report.md`) sobre los 24 bundles reales de
`auto-design`. **Decisión: mantener los defaults actuales sin cambios** — RRF
con `k = 60`, `wText = wVector = 1.0`, y presupuestos por profundidad
`focused` = 12k, `balanced` = 32k, `deep` = 64k tokens estimados. No se
encontró evidencia suficiente para justificar un cambio, según el mismo
criterio que ya fijaba `eval-design.md`.

Evidencia considerada y por qué no cruza la barra de "evidencia clara":

- **Agotamiento de presupuesto casi universal** (100% en `focused` y
  `balanced`, 88% en `deep`, ver M3). No es evidencia de presupuestos mal
  calibrados: el diseño de 2.2/2.3 recupera deliberadamente un universo
  amplio de candidatos (`fusedResults = 50`) para sostener cobertura, así que
  agotar el presupuesto es el comportamiento esperado, no un síntoma de
  subdimensionamiento. `coverage.budget_exhausted` existe precisamente para
  que el agente consumidor sepa que hay más evidencia disponible de la que
  entró, no para disparar un aumento automático de tokens.
- **La cobertura juzgada (N4) generalmente mejora de `focused` a `balanced`
  y se aplana de `balanced` a `deep`** en 5 de 8 consultas con contenido real
  (`en-concept-visual-hierarchy`, `es-concept-brutalism`,
  `es-paraphrase-saturated-colors`, `es-rules-comparison-brutalism-minimalism`,
  `multilingual-grid-systems`), y no cambia en absoluto con la profundidad en
  `es-rare-term-kerning` porque la escasez es del corpus, no del presupuesto.
  Este patrón es consistente con presets pensados como perfiles de uso
  distintos (`focused` rápido y acotado, `deep` exhaustivo), no con un preset
  roto: no hay ninguna consulta donde `deep` rinda peor que `focused`, ni
  ninguna donde `balanced` deje fuera contenido que un preset mayor
  recuperaría con una ponderación distinta de RRF.
- **`es-no-answer-unrelated-topic` nunca produce `status: "no_results"`**
  (divergencia mecánica en las tres profundidades, heredada de la ausencia de
  piso de similitud ya documentada en `retrieval-design.md`). Pero la Capa B
  la neutraliza: ambos jueces, sin divergencia, calificaron
  `precision_aparente = 0.00` y `cobertura_suficiente = 1` en las tres
  profundidades. El agente consumidor identifica correctamente, leyendo el
  bundle, que no hay contenido relevante — la ausencia de un piso de
  similitud no le impedía llegar a la conclusión correcta. Esto es
  exactamente el caso que `eval-design.md` dejaba fuera de alcance "salvo
  evidencia clara", y aquí la evidencia apunta en contra de agregar un
  umbral: el producto ya comunica la ausencia de contenido relevante sin él.
- **Ningún dato de 3.2 aísla la contribución de la vía textual frente a la
  vectorial.** Las métricas de Capa A no separan candidatos por procedencia y
  ninguna de las 9 discrepancias de N4 se atribuye a una vía dominando a la
  otra (ver hipótesis en `report.md`): las nueve caen en severidad de
  `precision_aparente` o ambigüedad de la rúbrica sobre "cobertura
  suficiente"/"cruce multilingüe". No hay señal para mover `wText`/`wVector`
  en ninguna dirección.

Ninguna de las 9 discrepancias Codex/Claude de N4 señala un defecto del
producto — ver la lectura agregada en `report.md`. Son ambigüedades del
instrumento de evaluación (`evals/rubric-template.md`), que quedan anotadas
como mejora para una futura pasada de evaluación, no como motivo de cambio
de código en 3.2.

## Validación tolerante por video en el manifest

El 13 de agosto de 2026 se resolvió la primera mitad del hallazgo de deriva
de esquema encontrado en M4 (ver `evals/results/2026-08-12/report.md`,
"Hallazgos accionables" — 17 de 51 videos reales de `auto-design` con
`resources.analysis` en vez de `resources.rules`): un solo video con esquema
inválido ya no aborta la lectura de todo el manifest.

- `parseManifest` (`src/infrastructure/filesystem/manifest-reader.ts`) ahora
  distingue dos niveles de fallo: los **estructurales de raíz** (root no es
  un objeto, `videos` no es un array, JSON inválido, archivo no legible)
  siguen siendo fatales — no hay lista de videos que salvar. Los
  **por-entrada** (un video con campo de esquema inválido, o un id/slug
  duplicado) ya no tiran `ManifestReadError`: se descartan del array
  `videos` y se acumulan como `ManifestVideoIssue` en el nuevo campo
  `ManifestSnapshot.issues`, con identificación best-effort del video
  (`videoId: VideoId | null`, `null` sólo cuando el propio `video_id` es lo
  que falló).
- `syncSource` (`src/application/indexing/sync-source.ts`) traduce cada
  `ManifestVideoIssue` a un `SyncIssue` (`MANIFEST_ENTRY_SCHEMA_INVALID` o
  `MANIFEST_ENTRY_DUPLICATE`) y lo cuenta en `packagesSeen`/`packagesFailed`,
  igual que un fallo de indexación por paquete. Cuando la entrada rota
  todavía resuelve a un `VideoId` conocido, marca visto (`markPackageSeen`)
  cualquier paquete previamente indexado de ese video **antes** del paso de
  borrado por "no visto en este run" — un video que retrocede a un esquema
  inválido nunca debe parecer eliminado de la colección. Un run con al menos
  una entrada así termina en `partial`, igual que cualquier otro fallo
  parcial ya soportado.
- No cambia el esquema de SQLite ni el contrato público de la CLI. El
  cambio es enteramente de `manifest-reader.ts` y `sync-source.ts`, cubierto
  por pruebas nuevas en ambos archivos de test.

Esto resuelve el efecto amplificador (un video roto bloqueaba los 51), no el
hallazgo de fondo: los 17 videos con `resources.analysis` estuvieron
aislados como `issue` (en vez de tumbar todo el run) hasta que se implementó
el soporte completo de `analysis.json` — ver "Soporte de `analysis.json`
(schema 2.0): implementado y validado" abajo.

## Soporte de `analysis.json` (schema 2.0): implementado y validado

La skill productora `youtube-video-context` reemplazó `rules.json`/schema
1.0 por `analysis.json`/schema 2.0 el 2 de agosto de 2026 (commit `aecdde9`
del repositorio de esa skill, breaking change explícito: "deja de producir
un manual de reglas de diseño para producir un análisis general").
`auto-youtube-rag` nunca soportó schema 2.0; la forma de `analysis.json`
(`topics`/`recommendations`/`assessment`/`evidence_boundary`) no es análoga
a la de `rules.json` (`patterns`/`principle`/`problem`/`rules`/`avoid`/
`acceptanceCriteria`), así que no es viable un alias de campo en el
manifest ni reusar `rules-json-parser.ts`.

El 13 de agosto de 2026 se aprobó el diseño completo en
[analysis-schema-design.md](analysis-schema-design.md) (checklist fino en
`docs/analysis-schema-tasks.md`, bloques P–T), con estas decisiones:

- **Ambos esquemas se sostienen indefinidamente.** `rules.json`/schema 1.0
  no se congela ni se deprecia — los 34 videos existentes de `auto-design`
  no se regeneran solos.
- **Bucketing:** `topics`/`analysis_document`/`analysis_section` caen en
  "Highest-relevance context"; `recommendations` cae en "Related rules and
  patterns". Se reutilizan las dos secciones fijas ya publicadas en
  `cli-contract.md` sin renombrarlas ni agregar una tercera, para no romper
  el contrato de cable ya consumido por `skill/SKILL.md` y por agentes
  reales.
- **Migración SQLite:** se edita `001-initial.ts` in place para que el
  `CHECK` de `source_documents.kind` incluya `'analysis'` desde el origen,
  en vez de construir un migrador incremental. Confirmado con el usuario
  que no existe ninguna base `.auto-youtube-rag/index.sqlite` real y
  persistente que preservar — `auto-design` y `design-catalog` (esta
  última, otra colección real generada por la misma skill, con algunos
  videos más) son colecciones fuente en disco, no índices ya construidos.
- **Validación E2E real (bloque T)** contra los videos reales con
  `analysis.json` de `auto-design` fue incluida en este trabajo, no
  pospuesta.

**Implementado y cerrado el 13 de agosto de 2026** — bloques P–T de
`docs/analysis-schema-tasks.md` completos. Validación real (bloque T)
ejecutada contra una copia temporal de la colección real `auto-design`
(51 videos, incluidos los 17 con `analysis.json`) con el modelo E5 real:

- los 51 paquetes se indexaron sin ningún `issue` (`packagesIndexed: 51`,
  `packagesFailed: 0`) — los 17 videos con `analysis.json` que antes
  quedaban aislados como issue ahora se indexan como ciudadanos de primera
  clase;
- `doctor` reportó los cinco checks en `ok`;
- el digest SHA-256 del árbol fuente copiado fue idéntico antes y después de
  `sync`, confirmando que la fuente nunca se escribe;
- una consulta semilla nueva (`es-analysis-neumorphism-accessibility` en
  `evals/queries/seed-queries.json`), orientada específicamente a contenido
  no alcanzable desde `rules.json`, produjo un bundle real vía `retrieve
--depth balanced` donde la cita `[S45]` resolvió a una unidad
  `analysis_topic` real (`psyw2_j_5jk`, "Neumorphism as a middle ground, and
  its accessibility defense") en la sección "Highest-relevance context", con
  procedencia correcta y `context.md` legible;
- la copia temporal se descartó al terminar; la colección real
  `auto-design` no se modificó.

`design-catalog` (la segunda colección real mencionada arriba) no se validó
explícitamente porque su manifest no declara ningún video con
`resources.analysis` — no ejercita este trabajo. No es un pendiente: el
soporte de schema 2.0 no depende de esa colección en particular.

## Skill dividida en `SKILL.md` + `skill/references/`

Fecha: 13 de agosto de 2026. Origen: una corrida de verificación en frío
sobre el estilo de diseño Swiss, con un subagente sin contexto previo del
proyecto, contra las dos colecciones reales (`auto-design`, 51 videos, y
`catalog-design`, 12 videos) registradas por ruta directa, sin copia.

La corrida cerró bien —63 paquetes indexados, 9 bundles con integridad de
citas perfecta, fuentes byte-idénticas antes y después— pero destapó cinco
huecos de `skill/SKILL.md`, todos de documentación y ninguno de código:

1. las rutas de base y caché del modelo se resuelven relativas al `cwd`, algo
   que la skill no mencionaba; trabajando fuera del repositorio, el primer
   `sync` falló con 63 issues `MODEL_LOAD_FAILED`, uno por video;
2. ese código simbólico no estaba documentado — la skill documentaba
   `EMBEDDING_MODEL_MISSING`, que **no es sinónimo**: el primero lo emite el
   generador de embeddings durante `sync`, el segundo es un warning de
   degradación de la vía vectorial en `retrieve`;
3. la afirmación "funciona sin red" convivía con la instrucción de correr
   `npm run models:download`, que sí requiere red, sin resolver la aparente
   contradicción;
4. no había ninguna estimación de duración de `sync` ni estrategia de espera,
   lo que llevó al agente a lanzar cuatro syncs, dos de ellos concurrentes;
5. la skill describía los paquetes sólo con `rules.json` y mandaba rechazar
   estructuras que no la tuvieran — tras el punto 4.1 eso habría hecho que un
   agente en frío descartara una colección schema 2.0 perfectamente válida.

Corregidos los cinco, `SKILL.md` había crecido a 283 líneas (~14,5 KB), que
se cargan enteras cada vez que la skill se dispara.

**Decisión: separar por frecuencia de uso, no por tema.** `SKILL.md` conserva
lo que hace falta en cada corrida (cuándo usar, flujo, `sync`, `retrieve`,
lectura del bundle, citas, reglas de oro) y baja a 198 líneas (~9,4 KB), un
35% menos de carga por invocación. Lo que sólo hace falta de vez en cuando se
muda a dos archivos:

- `skill/references/setup.md`: invocación alternativa de la CLI, rutas y
  variables de entorno, procedimiento del caché del modelo, `init`, y las dos
  causas del error de apertura de base.
- `skill/references/troubleshooting.md`: códigos de salida, interpretación de
  `status`, códigos simbólicos, fallo parcial de `sync` y `doctor`.

**Esto no contradice la autocontención que fijó el punto 2.4.** Aquella
decisión prohibió que la skill dependiera de archivos _fuera_ de sí misma
—en particular, referenciar `docs/` por ruta relativa— para poder instalarse
o enlazarse fuera de este repositorio. El directorio `skill/` viaja completo,
así que el bundle sigue siendo autónomo. Tener más de un archivo adentro
nunca estuvo prohibido. Si una lectura futura interpreta la separación como
una regresión de 2.4, está equivocada.

Invariante que la separación introduce: **en `SKILL.md` se quedan los
disparadores, se van los procedimientos.** Cada condición que exige leer una
referencia está nombrada en `SKILL.md` por su síntoma (`ERR_SQLITE_ERROR`,
`status` distinto de `ok`, comando ausente del PATH), más una tabla de
referencias al inicio. La verificación de 2.4 ya había demostrado que un
agente en frío se saltea un paso que no está a la vista; mover contenido sin
dejar el reflejo reproduciría ese fallo.

Dos cosas se mantuvieron deliberadamente en `SKILL.md` aunque por tema
parecerían candidatas a mudarse, porque por frecuencia no lo son: la guía de
espera de `sync` y la coexistencia `rules.json`/`analysis.json`. Ambas se
necesitan en el momento de ejecutar, no después de fallar.

La separación **todavía no se validó en frío**; queda pendiente repetir el
mismo tipo de corrida con la skill ya dividida.

## Instalación: hogar de usuario, `init` instalador y preflight (punto 4.2)

Implementado el 13 y 14 de agosto de 2026. Diseño completo en
`docs/install-design.md`, checklist en `docs/install-tasks.md`. Cierra el
pendiente "Default del caché del modelo" que había abierto la corrida en frío.

La investigación arrancó por un síntoma —63 issues `MODEL_LOAD_FAILED`— y
llegó a una causa mucho más profunda: **nunca se había decidido cómo se
instala el producto**. `package.json` declaraba `private: true` junto a un
`bin`, ninguna especificación cubría la distribución, y el único instalador
era `npm run models:download`, que es el arnés de benchmarks
(`tsx benchmarks/embeddings/run.ts`) y no existe para nadie sin el
repositorio clonado. La auditoría encontró **cuatro lugares** calculando la
ruta del modelo, tres de ellos duplicando un default relativo al `cwd`.

Decisiones cerradas, todas confirmadas por el usuario:

- **Distribución como comando global tipo npm, sin `postinstall`.** Hay
  instalaciones con scripts deshabilitados; el proyecto ya había elegido
  `node:sqlite` sobre `better-sqlite3` en parte por eso mismo
  (`docs/benchmarks/sqlite-client.md`), y un hook de 130 MB contradiría esa
  decisión.
- **Hogar único de usuario** `~/.auto-youtube-rag/`, con `index.sqlite` y
  `models/` adentro. Reemplaza los defaults relativos al `cwd`, que rompían
  el caso de uso principal —un agente consultando desde otro proyecto— y
  fallaban en silencio: `status` informaba cero fuentes y aparentaba pérdida
  de datos.
- **El directorio se llama `models/`, no `cache/`,** y la variable pasó de
  `AUTO_YOUTUBE_RAG_MODEL_CACHE` a `AUTO_YOUTUBE_RAG_MODELS_DIR`. Un caché es
  dato derivado que se regenera solo; este modelo no se repone jamás por sí
  mismo, porque el invariante prohíbe descargar implícitamente y el adaptador
  fuerza `allowRemoteModels = false`. Es estado instalado. El nombre viejo
  venía del vocabulario de Transformers.js, que sí descarga solo.
- **Un solo resolutor compartido** (`resolve-paths.ts`), usado por lector y
  escritor. Los tres defaults duplicados se eliminaron:
  `E5EmbeddingGenerator` ahora exige `cacheDir` y `evals/run-seed-queries.ts`
  resuelve por el mismo camino. `benchmarks/embeddings/run.ts` se conserva
  intacto: es herramienta de investigación y trabaja legítimamente contra el
  repositorio.
- **`init` instala el sistema completo** (hogar, base y modelo), con
  `--skip-model` para CI. Deja de ser instantáneo, y eso se documenta con la
  misma prominencia que la duración de `sync`.
- **Un modelo ya presente en disco se reutiliza sólo con `--from` explícito.**
  Se descartó la detección automática del repositorio: le daría al producto
  conocimiento de la estructura del repo, y el principio acordado es el
  opuesto —el repo es código fuente, y el producto no debe poder correr desde
  él sin haberse instalado. Se copia, nunca se mueve: vaciar el origen
  rompería los benchmarks y el smoke de E5.
- **Preflight de requisitos una vez por comando.** Cada comando declara qué
  necesita y la CLI lo verifica antes de construir nada. El caso que lo
  motivó: `sync` descubría el modelo ausente una vez por video, procesando 63
  paquetes para llegar a una conclusión disponible en el primer milisegundo.
  `test/interfaces/cli/` fija esa regresión.
- **Recibo `models/.install.json`** con el tamaño esperado de cada archivo,
  para distinguir `absent`, `incomplete` e `installed`. Detecta la descarga
  truncada —que deja los cuatro archivos presentes con el tamaño equivocado—
  sin leer 130 MB en cada `doctor`. Se comparan tamaños, nunca hashes.
- **La base vieja relativa al `cwd` se avisa (`LEGACY_LIBRARY_FOUND`), no se
  migra sola.** Mover datos del usuario sin pedirlo excede el mandato de
  `init`.

Bug encontrado y corregido durante la verificación: `doctor` seguía
detectando el modelo con `readdir(...).length > 0` —"¿hay algo en la
carpeta?"— aunque su mensaje ya apuntaba a `models install`. Con un modelo
truncado, `models status` decía `incomplete` y `sync` se negaba a correr,
pero `doctor`, que es el comando de diagnóstico, daba `ok`. `runDoctor` ahora
recibe el estado ya resuelto en vez de inspeccionar el filesystem, lo que
además saca un `readdir` de la capa de aplicación.

El modelo por defecto y su dimensión **no cambiaron**. Lo que haría falta
para soportar otro modelo quedó registrado en `docs/install-design.md`,
sección "Nota: qué haría falta para soportar otro modelo": la dimensión y la
reindexación automática ya funcionan; los prefijos E5 hardcodeados y la
imposibilidad de que dos modelos convivan, no.

## Pendientes de decisión

- **El marcador de cita de `context.md` es de cierre y se lee mal.**
  Descubierto el 14 de agosto durante la validación en frío de 4.2. En
  `context.md` el marcador `[S0N]` aparece solo, en su propia línea, **después**
  del bloque que etiqueta, con el encabezado del bloque siguiente
  inmediatamente debajo. El agente en frío lo interpretó como marcador de
  apertura y atribuyó a cada ID el contenido que venía después, produciendo
  un resumen con procedencia equivocada: afirmó que `S21` documentaba el
  estilo Suizo (es `S22`) y que `S18` trataba brutalismo (es contenido sobre
  minimalismo).

  **El producto no tiene un bug**: `result.json` coincide exactamente con la
  interpretación de cierre, las 54 unidades resuelven y hay cero citas
  huérfanas. Es un problema de legibilidad del formato.

  **El error se reprodujo dos veces, con el mismo agente y dos lecturas
  distintas del mismo bundle.** La primera vez leyó `context.md` en dos
  tandas por tamaño (2.322 líneas), lo que hacía sospechar de un problema de
  paginación; la segunda lo leyó entero de una sola vez y volvió a
  desplazarse igual. No es un artefacto de leer por tramos: es el formato.

  El desplazamiento es de un bloque hacia atrás y **no es uniforme** —algunas
  citas salieron correctas (`S03`, `S09`), probablemente localizadas por
  contenido y no por posición del marcador—, lo que produce un resumen
  parcialmente bien atribuido y por lo tanto más difícil de detectar que uno
  sistemáticamente corrido.

  Es el peor tipo de fallo posible: **pasa toda verificación mecánica y aun
  así produce atribuciones falsas en la respuesta final**. La Capa A de 3.2
  lo daría por bueno, y la Capa B no lo detectó porque sus jueces evaluaban
  bundles, no producían citas a partir de ellos.

  Opciones, ninguna decidida: mover el marcador al encabezado
  (`### [S18] Método completo...`), duplicarlo al abrir y cerrar, o dejar el
  formato y advertirlo en la skill. Las dos primeras cambian el contrato ya
  aprobado en `cli-contract.md` y necesitan aprobación explícita; la tercera
  es barata pero deja la trampa en pie.

- **Guard de concurrencia en `sync`.** No existe ningún bloqueo que impida
  dos `sync` simultáneos sobre la misma base. La corrida en frío los produjo
  y observó conteos inconsistentes mientras corrían (`status` llegó a
  reportar 13 videos habiendo 53); el `sync` completo posterior reconstruyó
  el estado correcto y `doctor` nunca reportó daño, así que **no hay pérdida
  permanente confirmada**. La hipótesis de que dos runs solapados se borran
  paquetes entre sí —vía la lógica de eliminar los no vistos por el run
  propio— es plausible por los timestamps observados pero **no está
  confirmada**: haría falta reproducirla de forma aislada y deliberada antes
  de tratarla como bug. Por ahora la skill lo advierte.
