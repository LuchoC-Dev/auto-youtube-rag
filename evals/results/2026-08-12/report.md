# Reporte de evaluación 3.2 — auto-youtube-rag

## Estado

Reporte en construcción. El bloque M (Capa A mecánica) y el bloque N (Capa B
juzgada) de [`docs/eval-tasks.md`](../../../docs/eval-tasks.md) están
completos; este documento todavía no tiene resumen ejecutivo, la tabla de
Capa A embebida ni la decisión final de calibración (O1) — eso se agrega en
O2, el último paso de 3.2. Esta sección se agrega ahora, al cerrar N4.

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
