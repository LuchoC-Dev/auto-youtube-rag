# Rubric template — Layer B (relevance judgment)

## Status

Written and approved on 12 August 2026 for N1 of
[`docs/eval-design.md`](../docs/eval-design.md). It anchors on the
`expected.notes` of each seed query
([`evals/queries/seed-queries.json`](queries/seed-queries.json)) so as not to
invent a new criterion, exactly as
[`docs/eval-design.md`](../docs/eval-design.md#layer-b--relevance-judged-by-codex-and-by-claude)
specifies.

## Why this document exists

Codex and Claude have to answer **exactly the same prompt**, word for word,
over **exactly the same bundle**. The goal is not to compare two retrieval
configurations — the product is provider-neutral by design — but to measure the
product's consistency across consuming agents. If the prompt varies between
judges, any difference in the answers stops being signal about the product and
becomes instruction noise. See `docs/eval-design.md`, "Why the same bundle for
both judges".

The judge reads `context.md` (the artefact meant for agent consumption); the
`request_id` (the compact receipt from `retrieve`) optionally, for metadata
context; `result.json` only if a specific citation needs verifying, never as the
main reading. The judge does **not** see the full video collection nor the other
judge's answers.

## The prompt (reusable verbatim for N2 and N3)

Each real bundle already lives at
`evals/results/<date>/<query-id>/<depth>/{context.md,result.json}`. For each of
the 24, fill in the variables `<QUERY_ID>`, `<QUERY_TEXT>`, `<DEPTH>`,
`<EXPECTED_NOTES>` and `<CONTEXT_MD_PATH>` (the first three and
`expected.notes` come from `evals/queries/seed-queries.json`; the path, from the
M2 convention) and send the whole block to the judge exactly as it is.

The prompt below is reproduced in Spanish, the language in which it was actually
sent to both judges. It is the literal instrument of the evaluation, not
documentation: translating it would mean the 48 judgments under
`evals/results/2026-08-12/judgments/` no longer correspond to the prompt that
produced them.

```text
Sos un juez de calidad para un sistema de recuperación de contexto (RAG)
que no responde preguntas por sí mismo: entrega evidencia citada para que
un agente consumidor razone sobre ella. Vas a leer un "bundle" de contexto
(context.md) generado para una consulta real, y vas a responder una
rúbrica corta y objetiva. No tenés acceso a la colección completa de
videos, sólo a este bundle — respondé desde esa perspectiva limitada, tal
como lo haría el agente consumidor real que sólo recibe este documento.

Datos de la consulta:
- ID de consulta: <QUERY_ID>
- Consulta (query): "<QUERY_TEXT>"
- Profundidad (depth): <DEPTH>
- Qué se esperaba encontrar (expected.notes, escrito antes de ver los
  resultados, como guía de lo que un revisor debería buscar — no es una
  respuesta correcta fija ni un checklist exhaustivo): "<EXPECTED_NOTES>"

Instrucciones:
1. Leé el archivo completo <CONTEXT_MD_PATH> (el artefacto pensado para
   consumo del agente). Es el único material que necesitás para responder.
2. Si querés verificar una cita puntual, podés abrir el result.json de la
   misma carpeta, pero no es tu lectura principal.
3. No respondas la consulta vos mismo. No inventes contenido que no esté
   en el bundle. Evaluá si el bundle *le permitiría a un agente* responder
   la consulta con evidencia citada, no si vos ya sabés la respuesta por
   otro medio.
4. Respondé exactamente estos cuatro campos, en este formato exacto (sin
   texto adicional fuera de estos cuatro campos):

**precision_aparente**: <número entre 0.0 y 1.0, un decimal> — fracción de
las unidades incluidas en context.md que considerás relevantes para la
consulta, a tu propio criterio de lectura.

**cobertura_suficiente**: <entero 1-5> — 1 = claramente insuficiente para
responder sin releer los videos originales, 5 = suficiente y bien
organizado.

**brecha_percibida**: <texto libre, 1-3 frases, o "ninguna"> — sin ver la
colección completa, ¿notás que falta algo obvio que esperarías encontrar
para esta consulta?

**coincidencia_expected_notes**: <"si" | "no" | "parcial" | "no_aplica"> —
¿el bundle cumple lo que describe expected.notes? Usá "no_aplica" sólo si
expected.notes no describe nada verificable contra este bundle en
particular, y explicá por qué en una frase.
```

In English, the four fields the judge has to answer are: `precision_aparente`,
the fraction of the units included in `context.md` that the judge considers
relevant to the query (a number between 0.0 and 1.0, one decimal);
`cobertura_suficiente`, an integer from 1 to 5 where 1 means clearly
insufficient to answer without rereading the original videos and 5 means
sufficient and well organised; `brecha_percibida`, free text of 1–3 sentences
(or `ninguna`) on whether something obvious appears to be missing; and
`coincidencia_expected_notes`, one of `si`, `no`, `parcial` or `no_aplica`,
stating whether the bundle satisfies what `expected.notes` describes. The field
names and the accepted values stay in Spanish because they are keys: the 48
judgments already recorded use them literally.

## Output format per bundle

One completed rubric per file, saved as
`evals/results/<date>/judgments/<judge>/<query-id>--<depth>.md`
(`<judge>` is `claude` or `codex`), with this heading and the four answers
below it:

```markdown
# <query-id> — <depth> — juez: <claude|codex>

**precision_aparente**: 0.7
**cobertura_suficiente**: 4
**brecha_percibida**: ...
**coincidencia_expected_notes**: parcial — ...
```

24 files per judge, 48 in total across `judgments/claude/` and
`judgments/codex/`.

## Worked example over a real bundle

Query `es-concept-brutalism`, depth `balanced`
(`evals/results/2026-08-12/es-concept-brutalism/balanced/context.md`,
20 sources, 63 units, ~29.7k estimated tokens).

- `expected.notes`: "Debe recuperar contexto conceptual amplio sobre
  brutalismo (definición, rasgos visuales, uso de tipografía y contraste),
  no una única coincidencia puntual. Se espera aporte de ambas vías."

Example answer (read in full for this document, and kept in the Spanish it was
given in):

```markdown
# es-concept-brutalism — balanced — juez: claude

**precision_aparente**: 0.4
**cobertura_suficiente**: 4
**brecha_percibida**: Sobre brutalismo específicamente el bundle es sólido
(origen arquitectónico, checklist de características, tipografía, retícula,
color, textura, filosofía, doce ejemplos visuales documentados con
procedencia). La brecha no es de brutalismo en sí sino de ruido: más de la
mitad de las 20 fuentes citadas tratan temas adyacentes pero distintos
(jerarquía visual, minimalismo, diseño editorial, sistemas de diseño con
IA, un carrusel de producto) que un agente tendría que descartar
activamente antes de responder, no evidencia que faltó.
**coincidencia_expected_notes**: parcial — el bundle sí trae definición,
rasgos visuales y tipografía/contraste de brutalismo con profundidad real,
y sí aporta de ambas vías (secciones "Método completo de la fuente" de
lectura textual directa y "Contexto autónomo para un agente" con síntesis
más semántica), pero la nota pedía contexto amplio _sobre brutalismo_ y
una fracción grande del presupuesto de balanced (~29.7k tokens) se fue en
contenido de otros estilos y principios de diseño no relacionados.
```

This reading illustrates why **apparent precision** and **sufficient coverage**
can diverge over the same bundle: the brutalist core is more than enough
(`cobertura_suficiente: 4`), but a visible fraction of what is included is
thematic noise (`precision_aparente: 0.4`) — exactly the kind of signal N4 has
to be able to detect by comparing both judges.

## Procedure (N2 and N3)

1. The judge receives the prompt above, already filled in, once for each of the
   24 bundles — never all 24 bundles at once in the same turn, so that each
   judgment is independent of the previous one.
2. N2 (Claude) and N3 (Codex) run separately. Codex does not see Claude's
   answers before answering, nor the other way round.
3. Each rubric is saved to the corresponding file under
   `evals/results/<date>/judgments/<judge>/`.
4. N4 compares the 24 pairs: a discrepancy if `precision_aparente` differs by
   more than ±0.2, `cobertura_suficiente` by more than ±1, or
   `coincidencia_expected_notes` diverges.
