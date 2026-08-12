# Diseño de evaluaciones del MVP

## Estado

Especificación propuesta y aprobada el 12 de agosto de 2026 para el punto 3.2,
el único bloque abierto de `build.md`. Continúa
[retrieval-design.md](retrieval-design.md) (que dejó pendiente de calibración
los pesos de RRF y un eventual piso de similitud) y
[context-assembly-design.md](context-assembly-design.md) (que dejó pendiente
de calibración los presupuestos por profundidad). No introduce cambios de
esquema, dominio, casos de uso ni contrato público de la CLI: 3.2 evalúa el
producto ya cerrado en 2.1–2.4, no lo modifica salvo que la evidencia lo
justifique.

## Alcance

| Dentro de 3.2                                                                    | Fuera de 3.2                                                               |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Ejecutar `retrieve` sobre la colección real con E5 real                          | Nueva superficie de CLI                                                    |
| Métricas mecánicas de cobertura e integridad de citas                            | Ground truth de relevancia etiquetado a mano                               |
| Juicio de calidad por Codex y por Claude sobre el mismo bundle                   | Tests automatizados en CI                                                  |
| Ajuste de pesos RRF y presupuestos por profundidad, sólo si la evidencia lo pide | Umbral mínimo de similitud vectorial (queda abierto salvo evidencia clara) |
| Reporte final con hallazgos accionables                                          | Nuevas fuentes o paquetes de páginas web                                   |

## Restricción de partida: no hay corpus etiquetado

Construir a mano una lista de "fragmentos correctos" por consulta sería caro y
subjetivo, y el propio criterio de éxito del producto
([product-spec.md](product-spec.md)) no es "una coincidencia puntual" sino
cobertura amplia y citada. Por eso 3.2 no persigue un recall/precisión clásico
contra ground truth. En su lugar mide en dos capas independientes:

- **Capa A — mecánica:** verificable con código, sin ningún agente de por
  medio, 100% reproducible.
- **Capa B — juzgada:** el agente consumidor real (Codex o Claude) lee el
  bundle y responde una rúbrica corta. Es el juez natural porque el producto
  es "para agentes, no para búsqueda humana"
  ([product-spec.md](product-spec.md)).

Ninguna capa reemplaza a la otra. La Capa A detecta regresiones estructurales
sin intervención humana; la Capa B es la única fuente de señal sobre
relevancia semántica real.

## Capa A — Métricas mecánicas

Calculadas directamente de `RetrievalOutcome`/`ContextResultDocument`
(`src/application/retrieval/retrieval-results.ts`,
`src/application/context/context-bundle.ts`) para cada consulta de
[`evals/queries/seed-queries.json`](../evals/queries/seed-queries.json), en
los tres presets de profundidad.

Por consulta y profundidad:

- `status` obtenido vs. lo esperable según el campo `kind` de la consulta
  (p. ej. `kind: "no_answer"` debería producir `status: "no_results"` o, dado
  que la vía vectorial no tiene piso de similitud
  ([retrieval-design.md](retrieval-design.md#ausencia-de-umbral-en-la-búsqueda-vectorial)),
  candidatos cuya relevancia real la Capa B marque como baja).
- `metrics.candidates_considered`, `metrics.units_selected`,
  `metrics.sources_used`, `metrics.estimated_tokens`.
- `coverage.units_by_type`, `coverage.units_by_source`,
  `coverage.omitted_for_budget`, `coverage.budget_exhausted`.
- `warnings` presentes (`TEXT_SEARCH_UNAVAILABLE`, `VECTOR_SEARCH_UNAVAILABLE`,
  etc.).
- **Integridad de citas**, la única verificación que puede fallar como un test
  automatizado: todo marcador `[S0N]` que aparece en `context.md` debe
  resolver a una unidad de `result.json.units` con el mismo `citation_id`, y
  toda unidad de `result.json.units` debe tener al menos una aparición de su
  `citation_id` en `context.md`. Un descalce es un bug de ensamblado, no un
  hallazgo de calidad — si aparece, se corrige en `src/`, no se documenta como
  resultado de eval.

Agregado entre las ocho consultas y las tres profundidades: tabla de
cobertura (fuentes/videos alcanzados), tasa de `budget_exhausted` por
profundidad, y cualquier discrepancia de integridad de citas.

## Capa B — Relevancia juzgada por Codex y por Claude

### Por qué el mismo bundle para los dos jueces

El objetivo de comparar Codex y Claude no es evaluar dos configuraciones de
recuperación distintas — el producto es neutral respecto del proveedor por
diseño ([decisions.md](decisions.md)) — sino medir **consistencia del
producto entre agentes consumidores**. Por eso ambos jueces reciben
exactamente el mismo `context.md`/`result.json`, generado una sola vez por
consulta y profundidad, nunca corridas de `retrieve` independientes por
agente.

### Rúbrica

Ancla en el campo `expected.notes` que ya trae cada consulta semilla, para no
inventar un criterio nuevo y desconectado del que motivó cada consulta al
sembrarla. Por cada bundle, el juez responde:

1. **Precisión aparente** (0.0–1.0): fracción de las unidades incluidas en
   `context.md` que el juez considera relevantes para la consulta, a su
   propio criterio de lectura.
2. **Cobertura suficiente** (1–5): ¿el bundle alcanza para responder la
   consulta sin releer los videos originales? 1 = claramente insuficiente,
   5 = suficiente y bien organizado.
3. **Brecha percibida** (texto libre, opcional): ¿el juez notaría, sin ver la
   colección completa, que falta algo obvio que esperaría encontrar? Esto es
   un proxy cualitativo de recall — nunca un número, porque ningún juez sin
   acceso a la colección completa puede medir recall real.
4. **Coincidencia con `expected.notes`**: sí/no/parcial, si la nota de la
   consulta describe una expectativa verificable (p. ej. "debe aportar ambas
   vías", "debe cruzar a contenido en el otro idioma").

El juez lee sólo `context.md` (el artefacto pensado para consumo del agente)
más el recibo compacto de `retrieve`; `result.json` queda disponible para que
el juez verifique una cita puntual si lo necesita, no como lectura principal.

### Procedimiento

1. Generar los bundles una sola vez (ver Capa A) sobre la colección real.
2. Presentar cada bundle a Claude (esta misma sesión u otra, sin contexto
   previo del bundle) y registrar sus cuatro respuestas.
3. Presentar los mismos bundles a Codex, mismo protocolo, mismo formato de
   respuesta.
4. Comparar: para cada consulta, ¿los dos jueces coinciden en precisión
   aparente (dentro de ±0.2) y en cobertura suficiente (dentro de ±1)? Una
   discrepancia grande es un hallazgo en sí mismo — puede indicar que un
   agente interpreta `context.md` de forma distinta, no necesariamente que el
   bundle esté mal.

No hay umbral de aprobación numérico fijado de antemano: 3.2 es la primera
pasada real y su resultado informa si conviene fijar uno después, no al
revés.

## Ejecución sobre la colección real

Primera validación completa sobre `auto-design` con el modelo E5 real, algo
que 2.1, 2.2 y 2.3 dejaron diferido explícitamente (ver
[agent-handoff.md](agent-handoff.md), "Última validación conocida"). Mismo
patrón ya documentado:

1. Copiar `auto-design/videos` a un directorio temporal fuera del repo.
2. Calcular y guardar el digest SHA-256 del árbol antes de tocarlo.
3. `init` + `source add` + `sync` sobre la copia, con el modelo ya cacheado en
   `.cache/models`.
4. Ejecutar `retrieve` para las ocho consultas de `seed-queries.json`, en
   `--depth focused|balanced|deep` (24 bundles en total), volcando cada uno
   bajo `evals/results/<fecha>/<query-id>/<depth>/`.
5. Verificar digest SHA-256 del árbol fuente sin cambios.
6. Borrar la copia temporal y su base SQLite al terminar; `evals/results/`
   conserva únicamente los bundles generados y el reporte, nunca la colección
   ni el índice.

## Calibración condicional de RRF y presupuestos

`FusionStrategy` ya es sustituible vía `ApplicationOverrides` en
`src/main/create-application.ts` sin tocar dominio, casos de uso ni CLI. Esto
permite instanciar `createRrfFusion({ k, weightText, weightVector })` con
valores distintos desde un script de evaluación, sin cambiar el
`fusionStrategy` que usa la CLI real.

Regla de decisión: **no se barre la grilla de pesos a ciegas.** Se corre
primero con los defaults (`k = 60`, `wText = wVector = 1.0`) y sólo se
prueban variantes si la Capa A o la Capa B muestran un problema concreto —por
ejemplo, una vía dominando sistemáticamente y la otra sin aportar candidatos
relevantes a criterio de los jueces. Mismo criterio para los presets de
profundidad (`focused` 12k / `balanced` 32k / `deep` 64k): sólo se ajustan si
`coverage.budget_exhausted`/`coverage.omitted_for_budget` muestran que no
discriminan casos reales.

Cualquier cambio de pesos o presupuestos que resulte de 3.2 se documenta en
`docs/decisions.md` con la evidencia concreta que lo motivó, siguiendo el
mismo formato que la decisión de RRF de 2.2. Si 3.2 no encuentra evidencia
suficiente para cambiar nada, ese "sin cambios, evidencia insuficiente" es en
sí mismo un resultado válido y se registra igual.

## Formato del reporte

Un único `evals/results/<fecha>/report.md` con:

1. Resumen ejecutivo (¿el producto cumple su criterio de éxito hoy?).
2. Tabla de Capa A por consulta × profundidad.
3. Tabla de Capa B con las cuatro respuestas de cada juez, por consulta ×
   profundidad, y la comparación Codex vs. Claude.
4. Hallazgos accionables, cada uno con: síntoma, consulta que lo expuso,
   hipótesis de causa, y si amerita o no una acción en 3.2 mismo o queda para
   una etapa posterior.
5. Decisión final sobre pesos RRF y presupuestos (cambiar con evidencia, o
   mantener sin cambios).

Los 24 bundles crudos (`context.md` + `result.json`) quedan junto al reporte
para poder releerlos sin regenerar nada.

## Invariantes

- 3.2 nunca escribe, mueve ni elimina archivos de la colección real; sólo
  opera sobre la copia temporal.
- 3.2 nunca compromete al repositorio la colección copiada, la base SQLite
  temporal, ni el modelo descargado — sólo bundles y reporte bajo
  `evals/results/`.
- Ningún cambio de pesos RRF o presupuestos se aplica sin evidencia
  documentada en `decisions.md`.
- El juicio de Capa B nunca sustituye la verificación mecánica de Capa A: un
  descalce de citas es un bug, se corrige, no se reporta como hallazgo de
  calidad.
- Los dos jueces de Capa B ven exactamente el mismo bundle; nunca se generan
  bundles distintos "para Codex" y "para Claude".

## Pruebas exigidas

- El verificador de integridad de citas (Capa A) se prueba con casos
  automatizados: un bundle sin descalces pasa, uno con una cita huérfana o una
  unidad sin cita falla — usando fixtures pequeños, no la colección real.
- El script de orquestación de consultas semilla se prueba con `npm run
check` y `npm run build` como cualquier cambio de `src/`/`evals/`, aunque su
  ejecución real contra la colección sea manual.
- La ejecución real sobre `auto-design` y el juicio de Codex/Claude son
  manuales por naturaleza: no hay forma de automatizar el juicio de un agente
  sobre texto libre dentro de esta etapa.

## Criterio de cierre

3.2 se marca completo cuando:

1. Los 24 bundles están generados y guardados junto con sus métricas de
   Capa A.
2. Los cuatro campos de Capa B están registrados para Claude y para Codex
   sobre los mismos 24 bundles.
3. El reporte agregado existe con hallazgos y la decisión final sobre pesos
   RRF y presupuestos, sea cambiarlos o mantenerlos.
4. Cualquier cambio de pesos/presupuestos está reflejado en `decisions.md`.
5. `docs/build.md` marca 3.2 al 100% y `docs/agent-handoff.md` documenta el
   estado final del MVP para el siguiente agente.
6. `npm run check` y `npm run build` pasan y el worktree no conserva
   colecciones, bases ni modelos temporales.
