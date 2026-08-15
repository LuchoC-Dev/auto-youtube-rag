# Reporte de evaluación 3.2 — auto-youtube-rag

## Estado

**Cerrado el 13 de agosto de 2026.** Los bloques M (Capa A mecánica), N
(Capa B juzgada) y O (calibración y cierre) de
[`docs/eval-design.md`](../../../docs/eval-design.md) están completos. Este
documento es el reporte final del punto 3.2, el último bloque abierto del
MVP según `docs/build.md`.

**Nota sobre los bundles:** los 24 bundles generados (`context.md` y
`result.json` por consulta y profundidad) no se versionan en este
repositorio porque contienen texto verbatim derivado de videos de YouTube de
terceros. Se pueden regenerar corriendo `evals/run-seed-queries.ts` sobre
`evals/queries/seed-queries.json` contra una colección propia. Los juicios de
Capa B (`judgments/claude/`, `judgments/codex/`) sí se conservan: son
evidencia propia del proyecto, no contenido de terceros.

## Resumen ejecutivo

3.2 evaluó `retrieve` sobre una copia temporal filtrada de la colección real
`auto-design` (34 videos con `resources.rules` válido) con el modelo E5 real,
en dos capas independientes y sin ground truth etiquetado a mano
([`docs/eval-design.md`](../../../docs/eval-design.md)):

- **Capa A (mecánica, M1–M4):** 24 bundles generados (8 consultas semilla ×
  3 profundidades). Integridad de citas perfecta en los 24. `status`
  coincidió con lo esperado en 21/24; las 3 divergencias son la misma
  consulta `no_answer` en sus tres profundidades, un comportamiento ya
  conocido y explicado abajo, no un bug nuevo. Ningún `warning` emitido.
  Presupuesto agotado en 23/24 combinaciones.
- **Capa B (juzgada, N1–N4):** Codex y Claude evaluaron los mismos 24
  bundles con la misma rúbrica, sin verse las respuestas entre sí. 9/24
  pares divergen numéricamente, pero ninguna divergencia es atribuible a un
  defecto del producto — las nueve se explican por severidad de criterio o
  ambigüedad de la rúbrica (`evals/rubric-template.md`), detalladas más
  abajo.
- **Decisión de calibración (O1):** se revisó M3 y N4 en conjunto y **se
  mantienen los defaults sin cambios** — RRF `k = 60`, `wText = wVector =
  1.0`, presupuestos `focused` 12k / `balanced` 32k / `deep` 64k. No hubo
  evidencia suficiente para justificar un cambio. Razonamiento completo en
  [`docs/decisions.md`](../../../docs/decisions.md), sección "Decisión de
  calibración (O1, punto 3.2)".

**Conclusión del MVP:** el producto recupera y ensambla contexto citado de
forma correcta y consistente entre proveedores de agente. La señal de
calidad más fuerte que aportó 3.2 no es un bug de código sino una
característica real del corpus (ver "Hallazgos accionables" abajo), y queda
documentada para quien opere la colección, no para `src/`.

## Capa A — métricas mecánicas (M3)

Tabla completa por consulta y profundidad en
[`layer-a-report.md`](layer-a-report.md). Resumen:

| Métrica | Resultado |
| --- | --- |
| Bundles generados | 24 (8 consultas × 3 profundidades) |
| Integridad de citas | 24/24 sin descalces `[S0N]` ↔ `result.json` |
| `status` coincide con `kind` esperado | 21/24 (las 3 divergencias son `es-no-answer-unrelated-topic` en sus tres profundidades) |
| `warnings` emitidos | 0/24 |
| Presupuesto agotado | `focused` 8/8 (100%), `balanced` 8/8 (100%), `deep` 7/8 (88%) |
| Digest SHA-256 de la colección | idéntico antes de `sync`, después de `sync` y después de las 24 consultas |

La divergencia de `status` es el comportamiento ya documentado en
`retrieval-design.md`: la búsqueda vectorial no tiene piso de similitud, así
que una consulta sin contenido relacionado igual produce `status: "ok"` con
candidatos de relevancia baja en vez de `status: "no_results"`. La Capa B
confirma que esto no engaña al agente consumidor (ver "Decisión de
calibración" arriba y `docs/decisions.md`).

## Comparación Codex vs. Claude (N4)

24 pares de rúbricas comparados
(`evals/results/2026-08-12/judgments/{claude,codex}/<query-id>--<depth>.md`).
Una fila **diverge** si `precision_aparente` difiere en más de ±0.2,
`cobertura_suficiente` en más de ±1, o `coincidencia_expected_notes` no
coincide (comparando sólo la etiqueta `si`/`no`/`parcial`/`no_aplica`, no el
texto de la justificación). **9 de 24 divergen.**

| Query | Depth | Claude prec/cov | Codex prec/cov | ΔPrec | ΔCov | Match (Claude/Codex) | Diverge |
| --- | --- | --- | --- | --- | --- | --- | --- |
| en-concept-visual-hierarchy | balanced | 0.65/5 | 0.40/5 | 0.25 | 0 | si/si | **sí** |
| en-concept-visual-hierarchy | deep | 0.60/5 | 0.30/5 | 0.30 | 0 | si/si | **sí** |
| en-concept-visual-hierarchy | focused | 0.70/4 | 0.50/4 | 0.20 | 0 | si/si | no |
| en-multilingual-typography-pairing | balanced | 0.20/2 | 0.40/5 | 0.20 | 3 | no/parcial | **sí** |
| en-multilingual-typography-pairing | deep | 0.20/2 | 0.30/5 | 0.10 | 3 | no/parcial | **sí** |
| en-multilingual-typography-pairing | focused | 0.20/2 | 0.50/4 | 0.30 | 2 | no/parcial | **sí** |
| es-concept-brutalism | balanced | 0.40/4 | 0.40/4 | 0.00 | 0 | parcial/parcial | no |
| es-concept-brutalism | deep | 0.30/5 | 0.30/5 | 0.00 | 0 | si/parcial | **sí** |
| es-concept-brutalism | focused | 0.35/4 | 0.40/4 | 0.05 | 0 | parcial/parcial | no |
| es-no-answer-unrelated-topic | balanced | 0.00/1 | 0.00/1 | 0.00 | 0 | si/si | no |
| es-no-answer-unrelated-topic | deep | 0.00/1 | 0.00/1 | 0.00 | 0 | si/si | no |
| es-no-answer-unrelated-topic | focused | 0.00/1 | 0.00/1 | 0.00 | 0 | si/si | no |
| es-paraphrase-saturated-colors | balanced | 0.50/4 | 0.40/5 | 0.10 | 1 | si/si | no |
| es-paraphrase-saturated-colors | deep | 0.45/5 | 0.30/5 | 0.15 | 0 | si/si | no |
| es-paraphrase-saturated-colors | focused | 0.50/4 | 0.50/4 | 0.00 | 0 | si/si | no |
| es-rare-term-kerning | balanced | 0.15/2 | 0.20/3 | 0.05 | 1 | parcial/parcial | no |
| es-rare-term-kerning | deep | 0.12/2 | 0.20/3 | 0.08 | 1 | parcial/parcial | no |
| es-rare-term-kerning | focused | 0.20/2 | 0.30/3 | 0.10 | 1 | parcial/parcial | no |
| es-rules-comparison-brutalism-minimalism | balanced | 0.55/5 | 0.40/5 | 0.15 | 0 | si/si | no |
| es-rules-comparison-brutalism-minimalism | deep | 0.50/5 | 0.30/5 | 0.20 | 0 | si/si | no |
| es-rules-comparison-brutalism-minimalism | focused | 0.55/4 | 0.50/4 | 0.05 | 0 | si/si | no |
| multilingual-grid-systems | balanced | 0.50/4 | 0.40/5 | 0.10 | 1 | si/parcial | **sí** |
| multilingual-grid-systems | deep | 0.45/5 | 0.30/5 | 0.15 | 0 | si/parcial | **sí** |
| multilingual-grid-systems | focused | 0.55/4 | 0.50/4 | 0.05 | 0 | si/parcial | **sí** |

### Discrepancias con hipótesis

**1–2. `en-concept-visual-hierarchy` — `balanced` (Δprec 0.25) y `deep`
(Δprec 0.30).** Ambos jueces coinciden en cobertura (5) y en que
`expected.notes` se cumple (`si`); sólo divergen en cuánto de lo incluido
cuentan como relevante. Claude cuenta como parcialmente relevante cualquier
fragmento que toque tipografía/jerarquía aunque sea de forma tangencial
dentro de un catálogo de tendencias más amplio; Codex descuenta con más
firmeza ese mismo contenido. **Hipótesis: divergencia de criterio de
severidad en `precision_aparente`, no un defecto del bundle** — ambos jueces
describen el mismo contenido (núcleo fuerte + ruido de catálogos de
tendencias), sólo pesan distinto cuánto castigar el ruido. Se amplifica en
`deep` porque hay más volumen total sobre el que discrepar.

**3–5. `en-multilingual-typography-pairing` — las tres profundidades**
(Δcov 2–3, `match` no/parcial). Claude califica cobertura baja (2) porque
sólo un fragmento del bundle trata específicamente "font pairing" y ningún
fragmento está en español, así que marca `no` contra `expected.notes`.
Codex califica cobertura alta (4–5) porque considera que la guía tipográfica
general disponible alcanza para construir una respuesta razonable, y marca
`parcial` en vez de `no` porque no puede confirmar la ausencia total del
cruce multilingüe con certeza. **Hipótesis: ambigüedad real en la rúbrica**
sobre qué significa "cobertura suficiente" — cobertura del subtema exacto
que pide la consulta (lectura de Claude) vs. cobertura general del área
temática que permitiría a un agente construir *alguna* respuesta razonable
(lectura de Codex). Ambos jueces coinciden, en el texto de `brecha_percibida`,
en que no hay contenido en español sobre emparejamiento tipográfico en
ningún bundle — esto es una señal robusta de vacío real de la colección
(ver hallazgo de N2), independiente de cómo cada juez lo puntuó.

**6. `es-concept-brutalism` — `deep`** (`match` si/parcial, sin diferencia
numérica: 0.30/5 ambos). Claude considera que, con el volumen exhaustivo de
`deep`, el bundle "cumple de sobra" `expected.notes` a pesar del ruido.
Codex se mantiene en `parcial` porque una proporción alta del bundle sigue
siendo contenido no-brutalista. **Hipótesis: desacuerdo de umbral** sobre
cuánto ruido tolera un "sí" antes de degradar a "parcial" — ambos jueces
describen el mismo balance señal/ruido, sólo lo redondean distinto.

**7–9. `multilingual-grid-systems` — las tres profundidades** (`match`
si/parcial, sin gran diferencia numérica). Claude infiere que el cruce
multilingüe pedido por `expected.notes` queda demostrado por el simple
hecho de que aparecen fuentes en inglés respondiendo una consulta en
español (cruce por construcción). Codex exige evidencia explícita, visible
en el propio bundle, de que la recuperación cruzó idiomas — algo que
`context.md` nunca declara de sí mismo, porque el producto no anota por
diseño por qué vía llegó cada fragmento. **Hipótesis: esta es la
discrepancia más clara de ambigüedad de la rúbrica, no del bundle** — tal
como está redactada, ningún bundle podría satisfacer nunca la lectura más
estricta de Codex, porque `context.md` no expone su propio mecanismo de
recuperación. Si se repite una pasada de evaluación futura, conviene
aclarar en `evals/rubric-template.md` si "cruce multilingüe" se acepta por
la sola presencia de fuentes en otro idioma o requiere evidencia explícita
en el bundle.

### Lectura agregada

Las 9 discrepancias caen en dos categorías, ninguna atribuible a un defecto
del producto:

- **Severidad de `precision_aparente`** (2 casos): ambos jueces describen el
  mismo contenido, sólo pesan distinto el ruido temático.
- **Ambigüedad de rúbrica sobre "cobertura suficiente" y "cruce
  multilingüe demostrado"** (7 casos): la redacción de N1 permite dos
  lecturas razonables y distintas — ninguna es un error de lectura del
  bundle, ambos jueces citan la misma evidencia y llegan a interpretaciones
  distintas de qué cuenta como "cumplido".

Ninguna discrepancia señala que un juez haya leído mal el bundle o
alucinado contenido — es consistencia de *interpretación de rúbrica*, no de
*lectura del producto*, lo que confirma que el instrumento (N1) tiene
puntos a afinar antes de una futura pasada, más que el producto evaluado.

## Hallazgos accionables

Ninguno requiere cambios en `src/` para cerrar el MVP. Quedan documentados
para quien opere la colección o continúe el producto después de 3.2:

1. **Deriva de esquema en el manifest real de `auto-design`, fuera de este
   repositorio.** La colección creció de 34 a 51 videos desde el último
   `sync` validado (2.1); 17 de los 51 usan `resources.analysis` en vez de
   `resources.rules`, lo que hace fallar el manifest completo con
   `MANIFEST_SCHEMA_INVALID` si se sincroniza sin filtrar. `sync` se
   comportó exactamente como está diseñado (falla el run, no borra
   paquetes existentes), así que no es un bug — pero bloquea sincronizar la
   colección completa hoy. M4 se ejecutó sobre una copia filtrada a los 34
   videos válidos. Aceptar `resources.analysis` como alias, o coordinar con
   el pipeline productor de paquetes para que deje de emitir la clave
   vieja, requiere aprobación explícita antes de tocar
   `src/infrastructure/filesystem/manifest-reader.ts` — no se decide en
   3.2.
2. **La precisión aparente está limitada por ruido de catálogo compartido,
   no por errores de recuperación.** Casi todas las consultas semilla
   recuperan del mismo subconjunto de ~20 videos de `auto-design` sobre
   catálogos de estilos/tendencias (2025/2026), así que a medida que el
   presupuesto crece (`focused` → `deep`) entra más catálogo tangencial en
   vez de más contenido específico — Claude reportó que la precisión
   aparente en general **bajó** con la profundidad por esta razón (N2). Es
   una característica del corpus real, no del ranking: RRF ya no tiene
   evidencia para distinguir "catálogo que menciona el tema de pasada" de
   "contenido específico sobre el tema" sin una señal adicional que hoy no
   existe (por ejemplo, un tipo de unidad o densidad temática). Anotado
   como entrada candidata para una fase posterior fuera de este MVP, no
   como pendiente de 3.2.
3. **`en-multilingual-typography-pairing` expone un vacío real de la
   colección, no un defecto de recuperación.** Ningún video en español
   sobre "pareo tipográfico" existe en el corpus, ni siquiera visible en
   `deep` (99 de 101 bloques candidatos incluidos). Ambos jueces lo
   confirman de forma independiente. Es información sobre la colección
   `auto-design`, no sobre el producto.
4. **`evals/rubric-template.md` tiene dos puntos de ambigüedad real**,
   responsables de 7 de las 9 discrepancias de N4: qué cuenta como
   "cobertura suficiente" (cobertura del subtema exacto vs. cobertura del
   área temática general) y si "cruce multilingüe demostrado" se acepta
   por la sola presencia de fuentes en otro idioma o requiere evidencia
   explícita dentro del propio `context.md` (que el producto nunca declara
   por diseño). Afinar la redacción antes de una futura pasada de
   evaluación; no bloquea el cierre de 3.2 porque ninguna de las dos
   lecturas indica que el producto falle.

## Decisión de calibración (O1)

Revisando Capa A (M3) y Capa B (N4) en conjunto, **no se encontró evidencia
suficiente para cambiar los pesos de RRF ni los presupuestos por
profundidad.** Se mantienen `k = 60`, `wText = wVector = 1.0`, `focused`
12k / `balanced` 32k / `deep` 64k tokens estimados, tal como estaban
aprobados desde 2.2/2.3.

Razones resumidas (detalle completo con la evidencia punto por punto en
[`docs/decisions.md`](../../../docs/decisions.md), sección "Decisión de
calibración (O1, punto 3.2)"):

- El agotamiento de presupuesto casi universal (tabla de Capa A arriba) es
  el resultado esperado de recuperar deliberadamente un universo amplio de
  candidatos, no evidencia de presupuestos subdimensionados.
- La cobertura juzgada se aplana de `balanced` a `deep` en la mayoría de
  consultas con contenido real, y ningún preset menor rinde peor que uno
  mayor — consistente con perfiles de uso distintos, no con un preset roto.
- `es-no-answer-unrelated-topic` nunca produce `status: "no_results"`, pero
  ambos jueces la califican `precision_aparente = 0.00` sin divergencia en
  las tres profundidades: el agente consumidor llega a la conclusión
  correcta igual, así que agregar un piso de similitud vectorial —
  explícitamente fuera de alcance de 3.2 salvo evidencia clara— no está
  justificado por esta corrida.
- Ningún dato de 3.2 aísla la contribución de la vía textual frente a la
  vectorial, así que tampoco hay señal para mover `wText`/`wVector` en
  ninguna dirección.

## Cierre de 3.2

Con M, N y O completos, el punto 3.2 —y con él, el MVP completo descrito en
`docs/product-spec.md` (2.1–2.4 y 3.1–3.2)— queda cerrado. Ver
`docs/build.md` y `docs/agent-handoff.md` para el estado consolidado.
