# Plantilla de rúbrica — Capa B (juicio de relevancia)

## Estado

Redactada y aprobada el 12 de agosto de 2026 para N1 de
[`docs/eval-design.md`](../docs/eval-design.md). Ancla en `expected.notes` de
cada consulta semilla ([`evals/queries/seed-queries.json`](queries/seed-queries.json))
para no inventar un criterio nuevo, tal como especifica
[`docs/eval-design.md`](../docs/eval-design.md#capa-b--relevancia-juzgada-por-codex-y-por-claude).

## Por qué existe este documento

Codex y Claude tienen que responder **exactamente el mismo prompt**, palabra
por palabra, sobre **exactamente el mismo bundle**. El objetivo no es
comparar dos configuraciones de recuperación — el producto es neutral
respecto del proveedor por diseño — sino medir consistencia del producto
entre agentes consumidores. Si el prompt varía entre jueces, cualquier
diferencia en las respuestas deja de ser señal sobre el producto y pasa a
ser ruido de instrucciones. Ver `docs/eval-design.md`, "Por qué el mismo
bundle para los dos jueces".

El juez lee `context.md` (el artefacto pensado para consumo del agente); el
`request_id` (recibo compacto de `retrieve`) opcionalmente para contexto de
metadatos; `result.json` sólo si necesita verificar una cita puntual, nunca
como lectura principal. El juez **no** ve la colección completa de videos ni
las respuestas del otro juez.

## El prompt (reutilizable literalmente para N2 y N3)

Cada bundle real ya vive en
`evals/results/<fecha>/<query-id>/<depth>/{context.md,result.json}`. Para
cada uno de los 24, completar las variables `<QUERY_ID>`, `<QUERY_TEXT>`,
`<DEPTH>`, `<EXPECTED_NOTES>` y `<CONTEXT_MD_PATH>` (los tres primeros y
`expected.notes` salen de `evals/queries/seed-queries.json`; el path, de la
convención de M2) y enviar el bloque completo tal cual al juez:

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

## Formato de salida por bundle

Una rúbrica completada por archivo, guardada como
`evals/results/<fecha>/judgments/<juez>/<query-id>--<depth>.md`
(`<juez>` es `claude` o `codex`), con este encabezado y las cuatro
respuestas debajo:

```markdown
# <query-id> — <depth> — juez: <claude|codex>

**precision_aparente**: 0.7
**cobertura_suficiente**: 4
**brecha_percibida**: ...
**coincidencia_expected_notes**: parcial — ...
```

24 archivos por juez, 48 en total entre `judgments/claude/` y
`judgments/codex/`.

## Ejemplo resuelto sobre un bundle real

Consulta `es-concept-brutalism`, profundidad `balanced`
(`evals/results/2026-08-12/es-concept-brutalism/balanced/context.md`,
20 fuentes, 63 unidades, ~29.7k tokens estimados).

- `expected.notes`: "Debe recuperar contexto conceptual amplio sobre
  brutalismo (definición, rasgos visuales, uso de tipografía y contraste),
  no una única coincidencia puntual. Se espera aporte de ambas vías."

Respuesta de ejemplo (leída íntegramente para este documento):

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

Esta lectura ilustra por qué **precisión aparente** y **cobertura
suficiente** pueden divergir en el mismo bundle: el núcleo brutalista
alcanza y sobra (`cobertura_suficiente: 4`), pero una fracción visible de
lo incluido es ruido temático (`precision_aparente: 0.4`) — exactamente el
tipo de señal que N4 tiene que poder detectar comparando ambos jueces.

## Procedimiento (N2 y N3)

1. El juez recibe el prompt de arriba, ya completado, una vez por cada uno
   de los 24 bundles — nunca los 24 bundles de una sola vez en un mismo
   turno, para que cada juicio sea independiente del anterior.
2. N2 (Claude) y N3 (Codex) corren por separado. Codex no ve las
   respuestas de Claude antes de responder, ni viceversa.
3. Cada rúbrica se guarda en el archivo correspondiente bajo
   `evals/results/<fecha>/judgments/<juez>/`.
4. N4 compara las 24 parejas: discrepancia si `precision_aparente` difiere
   en más de ±0.2, `cobertura_suficiente` en más de ±1, o
   `coincidencia_expected_notes` diverge.
