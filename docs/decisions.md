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

## Pendientes de decisión

- Calibración de los pesos RRF y de los presupuestos por profundidad, sujeta
  a la evidencia que produzca la etapa 3.2 (ver
  [eval-design.md](eval-design.md)). Si 3.2 no encuentra evidencia
  suficiente, la decisión final es mantener los defaults actuales, y ese
  resultado también se registra aquí.
