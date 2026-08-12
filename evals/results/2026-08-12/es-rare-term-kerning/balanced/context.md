---
schema_version: "1.0"
query: "kerning"
depth: balanced
estimated_tokens: 31983
sources_used: 22
---

# Context package

## Query and scope

Query: kerning
Depth: balanced (max 32000 estimated tokens)

## Highest-relevance context

### Agent workflow

- Write a one-line statement of what the business does and what the website must achieve, before any aesthetic decision.
- Select at most two compatible trends from the nine and record why the others were discarded.
- Set the intensity to the minimum the source recommends: a sprinkle of nostalgia, one color accent, a few technical lines, one soft sound.
- Build the sober base first: type scale (one family if the axis is barely-there UI), spacing scale, and a reduced palette with a single accent.
- Apply the trend as a layer on top of that base, never as its foundation.
- Review every added element and remove anything that only demonstrates familiarity with the trend.
- Verify accessibility: AA contrast over gradients and saturated blocks, click target size with custom cursors, and no information carried by color or sound alone.
- Measure weight and load time of any WebGL scene on a mid-range device and a slow connection before approving it.
- Honor prefers-reduced-motion and never play audio without a deliberate user action.
- Resolve licensing for fonts, textures, illustrations and 3D assets before publishing.
- Document which trends were adopted and why, so review evaluates fit rather than taste.
- Label every 2026 prediction carried into the work as a time-bound hypothesis.

[S01]

### Método completo de la fuente > Principio / paso / elemento 6 — Elegir imágenes que cuenten una historia (lifestyle images)

Un criterio concreto de selección de imágenes: combinar tomas del producto o
lugar en sí con tomas de personas usando ese producto o lugar.

> "When you combine images, you want to show the place or the product and
> you want to show some people in the place using the product [...] It
> connects the dots. It's what we call lifestyle images [...] because stories
> sell products." (09:29)

Traducción: "Cuando combinas imágenes, querés mostrar el lugar o el producto
y también mostrar personas en el lugar usando el producto [...] Conecta los
puntos. Es lo que llamamos imágenes de estilo de vida [...] porque las
historias venden productos." (09:29)

`frame-40pct.png`, `frame-45pct.png` y `supplemental-770s.png` muestran
composiciones finales donde una imagen arquitectónica del edificio se combina
con una imagen de personas dentro de un espacio interior, confirmando
visualmente la aplicación de este criterio.

**Regla operativa:** en proyectos que venden un lugar o producto físico,
combinar como mínimo una imagen del objeto/lugar en sí con una imagen de
personas interactuando con él, en vez de usar solo fotografías arquitectónicas
o de producto aisladas.

[S02]

### Antipatrones

- Equal visual weight for primary and secondary data on the same screen.
- Selection controls placed against the natural reading direction.
- Emoji/icon sets used decoratively without consistent valence mapping.
- Static, uncolored selection indicators with no specific feedback message.
- Multiple redundant entry points to the same underlying list or action.
- Equal-sized fields for values of unequal importance or change frequency.
- Identifying people/accounts by text/number alone with no visual
  identifier.
- Showing an input amount without its downstream effect on existing state.
- Omitting the acting account/context in a multi-account transaction.
- Defaulting to free-text entry for a small, well-known set of possible
  values.
- Presenting a promotional testimonial screenshot as independent proof of
  product quality.
- Presenting any of these mockups as evidence that a production system
  already implements the behavior shown.

[S03]

### Método completo de la fuente > Principio / paso / elemento 2: Dominar pocas tipografías

**El video afirma** (02:35–03:36) que la mayoría de los diseños del
presentador usan una o dos tipografías, tomadas de un repertorio personal
construido a lo largo de "los últimos 12 o 13 años" de carrera, en lugar de
buscar constantemente tipografías nuevas. Cita el caso de Futura como
ejemplo: no tiene sentido buscar "la nueva Futura" cuando ya existe una
tipografía perfeccionada durante décadas. Menciona también su preferencia por
fuentes de sistema como Arial, Helvetica y Times New Roman.

Como refuerzo, el presentador cita al diseñador **Massimo Vignelli**,
descrito como "uno de los últimos modernistas", conocido por su uso extensivo
de Helvetica: según el video, Vignelli utilizó solo diez tipografías en toda
su carrera, a pesar de haber diseñado piezas de alto perfil como el mapa del
metro de Nueva York y el logotipo de American Airlines (03:36–04:07). Esta
cifra es una **afirmación sin verificar** por esta fuente: se reporta tal
como aparece en el video, sin confirmación documental externa.

La razón que da el presentador para limitar el repertorio tipográfico es que
dominar una tipografía —conocer sus espacios en blanco internos, su
comportamiento (kerning) en tamaños grandes y pequeños, su relación con
fondos de mayor o menor contraste— toma tiempo, y ese aprendizaje se pierde
si se cambia de tipografía constantemente (04:07–04:39).

- Regla operativa: construir y reutilizar un repertorio tipográfico personal
  limitado en lugar de elegir tipografía nueva en cada proyecto.
- Antipatrón: perseguir tendencias tipográficas sin llegar a dominar el
  comportamiento de ninguna fuente en profundidad.

[S04]

### Agent workflow

- Explain the historical grounding (Bauhaus, Swiss design) to frame minimalism as a functional tradition, not a trend.
- Establish layout: define a grid, decide visual hierarchy, decide on symmetric or controlled-asymmetric composition.
- Reserve purposeful white space; avoid filling the canvas by default.
- Choose a limited, coherent typographic system appropriate to the amount of text and the desired tone (sans-serif vs. serif).
- Define a restrained color palette: one or two neutral base colors, optionally softened, plus at most one accent.
- Verify the piece communicates its core message at a glance, especially for digital/UX contexts.
- If teaching the style, use a reference-and-recreate method (save curated examples, recreate them, articulate why they work).
- Before finalizing, check the piece against the antipattern list.
- Clearly separate any recommended external resource (book, template, subscription) from the design principle being taught.

[S05]

### Demostraciones y ejemplos visibles

1. **Radical Everything** (00:04–00:20, `frame-05pct.png`): estudio de
branding y diseño de producto. Tipografía enorme sobre foto de objetos 3D
coloridos; texto cortado por el marco.
2. **Twenty Nine** (00:20–00:35, `frame-10pct.png`, `frame-15pct.png`):
estudio con sede en Nueva York y Berlín. Combina un titular tipográfico
masivo con un bloque de texto editorial denso a la derecha ("...launched
this temporary web-...", "...it does...", "...people make... wants
venture... call it a... agency, branding..."), y una tarjeta amarilla tipo
"workspace/exchange" superpuesta — mezcla de escala tipográfica extrema con
texto de cuerpo convencional en la misma pantalla.
3. **QI Catalog / Qode Interactive** (00:35–00:50, `frame-20pct.png`,
`frame-25pct.png`): catálogo de temas/plantillas. Pregunta retórica "Who
Says WordPress Can't Be Art?" en tipografía gigante superpuesta a una
ilustración floral, seguida de una pantalla de índice con nombres de
productos en columna (Monolab, Haar, Amedeo, Tetsuo, Penumbra, Galatia,
Koto, Blaze, Kenozoik, Dieter, Smilte, Manon, Ion).
4. **TIGHT Top 2018** (00:50–01:06, `frame-30pct.png`, `frame-35pct.png`):
ranking o resumen anual de un estudio o publicación digital. Fondo
amarillo saturado con formas geométricas metálicas flotantes y luego un
círculo amarillo sólido a pantalla completa sobre fondo azul-gris
metalizado.
5. **De Vlieg** (01:06–01:22, `frame-40pct.png`, `supplemental-70s.png`):
`supplemental-70s.png` confirma de forma legible el nombre "DE VLIEG" y una
composición de portada de revista/producto ("GRAND OPENING") sobre fondo
lila, con un menú superior derecho ("contact / about") en texto plano
diminuto.

[S06]

## Related rules and patterns

### Patterns > Adjust tracking inversely to size; use kerning for specific pairs > Avoid

Manually kerning long-form body text instead of relying on the typeface's built-in kerning tables.

[S07]

### Patterns > Emotional typography (kerning and stroke weight) > Avoid

Using tight kerning or italics in contexts that call for a relaxed or premium feeling, or vice versa.

[S08]

### Patterns > Emotional typography (kerning and stroke weight) > Rules

Use tight kerning combined with italics when the design needs to communicate urgency or forward motion.

[S09]

### Patterns > Emotional typography (kerning and stroke weight)

Emotional typography (kerning and stroke weight)

Principle: Letter spacing (kerning) and stroke weight are emotional levers: tight kerning and italics suggest urgency, generous kerning suggests relaxation and premium feel, heavy strokes suggest authority, and thin strokes suggest elegance.

Problem: Typography chosen only for visual style, without matching the emotional register the brief requires, can undercut the intended tone of a design even when the layout itself is sound.

Source basis: The source directly demonstrates all four typographic states (tight kerning, generous kerning, heavy type, thin type) on the same poster and states explicitly the emotional association of each.

Professional extension: The acceptance criterion about preserving legibility and negative space is a professional safeguard added by this dossier, not stated verbatim in the source.

[S10]

### Patterns > Emotional typography (kerning and stroke weight) > Rules

Use generous kerning (optionally paired with a serif typeface) when the design needs to feel relaxed or premium.

[S11]

### Patterns > Adjust tracking inversely to size; use kerning for specific pairs

Adjust tracking inversely to size; use kerning for specific pairs

Principle: Tracking (uniform letter-spacing) should be inversely proportional to text size; kerning adjusts spacing between specific letter pairs (not uniformly) to prevent visual collisions between certain shapes.

Problem: Prevents applying uniform letter-spacing rules to problems that require pair-specific kerning, and prevents leaving large headline text with default spacing that increases eye strain.

Source basis: The source explains tracking/letter-spacing as inversely proportional to size (09:16-09:46), explains kerning as pair-specific spacing given the 'w' and 'a' example (09:46), and cites designer Jessica Hische's kerning adjustment to the Southern Living logo (10:17).

Professional extension: This dossier flags the Southern Living/Jessica Hische attribution as an unverified direct claim in evidence.limitations, since no frame in the video visually confirms this specific case.

[S12]

### Patterns > Adjust tracking inversely to size; use kerning for specific pairs > Rules

Use manual kerning adjustments only for specific letter pairs in high-impact contexts such as logotypes, not as a substitute for tracking.

[S13]

### Patterns > Adjust tracking inversely to size; use kerning for specific pairs > Acceptance criteria

Manual kerning adjustments, if present, are limited to logotypes or short high-impact text, not applied across body copy.

[S14]

### Patterns > Establishing a clear leverage point

Establishing a clear leverage point

Principle: A design needs an unambiguous element that the eye lands on first, reinforced by contrast, scale, isolation, or color, before any other flow or rhythm decision is made.

Problem: Prevents designs where multiple elements compete for first attention with no clear winner, leaving the viewer without a starting point.

Source basis: The source directly analyzes two examples (a Nike campaign and an editorial poster) to demonstrate how contrast, scale and isolation create a leverage point, quoting 'That's leverage. That is control.' (21:35).

Professional extension: The 'two-second viewer test' acceptance criterion is a professional extension added to make the concept independently testable outside the video's own narration.

[S15]

### Patterns > Performance-first creativity

Performance-first creativity

Principle: Treat speed, efficient code, image optimization and hosting as design inputs, not post-launch repair.

Problem: A visually attractive site that is slow or frustrating.

Source basis: The source connects optimized images, efficient code and hosting to experience and search visibility.

Professional extension: Budgets and device testing make the advice operational.

[S16]

### Patterns > Establishing a clear leverage point > Avoid

Centering an element and assuming that alone establishes it as the leverage point without reinforcing scale or isolation.

[S17]

### Patterns > Communicate value and manage client process to be well paid > Rules

Establish and follow a clear, repeatable client process from intake to delivery.

[S18]

### Patterns > Refine visually in short, directed iterations, not one master prompt > Avoid

Trying to specify every visual refinement (animation, imagery, color tweaks) in a single prompt before ever previewing the result.

[S19]

### Patterns > Diagnose the client's real problem before executing their request > Avoid

Treating every client request as needing the same type of solution regardless of the underlying problem ('if the only tool you have is a hammer, every problem looks like a nail').

[S20]

### Patterns > Master a few typefaces

Master a few typefaces

Principle: Build and reuse a small personal repertoire of typefaces across projects instead of choosing new ones for every project.

Problem: Prevents shallow familiarity with any single typeface's whitespace, kerning, and contrast behavior across sizes and backgrounds.

Source basis: The source states this directly (02:48-04:39), including the presenter's personal typeface preferences and the Massimo Vignelli example (unverified claim of ten typefaces across his career).

Professional extension: None added; the Vignelli figure is flagged in evidence.limitations as an unverified claim rather than extended.

[S21]

### Patterns > Rework a session's output without the specific reference in view > Avoid

Continuing to build directly on top of a composition recognized as too close to one reference.

[S22]

### Patterns > Find a real visual reference before creating the design system

Find a real visual reference before creating the design system

Principle: Before asking the tool to define a visual language, search moodboard/inspiration tools for a real image that represents the desired style, and use it strictly as inspiration, never as material to copy.

Problem: Prevents the design system from being generated from an abstract text description with no concrete visual anchor, which is a major source of generic-looking output.

Source basis: At 03:56 the creator searches Pinterest for 'fun website design', explicitly states 'we're not copying anyone's work, we're just using it for inspiration', and selects an image based on liked typography.

Professional extension: None; this is a direct source observation.

[S23]

### Patterns > There is no hierarchy without contrast > Avoid

Leaving all elements of a group with identical size, color, and spacing when one of them needs to stand out.

[S24]

### Patterns > Partner with a developer of comparable skill level > Avoid

Delegating development to someone with a clearly lower skill level and expecting the same quality outcome.

[S25]

### Patterns > The ten ranked techniques for creating contrast > Avoid

Making every element in a design large, which removes the relative size contrast needed for hierarchy.

[S26]

### Patterns > Restrict the design toolkit to five elements > Avoid

Using boundaryless or immersive image treatments that remove clear containers.

[S27]

### Patterns > Strategic design thinking > Avoid

Treating a client request as its own success criterion.

[S28]

### Patterns > Hierarchy is a perception order, not an importance judgment > Avoid

Assigning top visual weight to content because it 'feels' most important rather than because the user needs it first.

[S29]

### Patterns > Composition follows known audience scanning patterns > Avoid

Placing supporting content above the primary element when the audience's natural scanning direction is top-to-bottom.

[S30]

### Patterns > The human touch (wabi-sabi) and anti-UX > Avoid

Faking handmade texture with obviously generated assets, which defeats the purpose of the trend.

[S31]

### Patterns > Structured emphasis through space and grids

Structured emphasis through space and grids

Principle: Use full-screen headers, bento modules, negative space, and CSS grids to clarify priority and relationships.

Problem: Crowded or uniformly weighted pages make scanning and comparison difficult.

Source basis: The video presents full-screen headers, Bento UI, negative space, and grid design.

Professional extension: Responsive and semantic ordering criteria are added for production use.

[S32]

### Patterns > Surveillance design > Rules

Pair with messaging that is explicitly about data, technology, or surveillance for best effect, per the source.

[S33]

### Patterns > Niche saturation audit and intentional positioning > Avoid

Designing from generic inspiration (e.g., Pinterest boards) without analyzing the specific niche's current visual saturation.

[S34]

### Patterns > Reapply the design system onto the existing project instead of regenerating from scratch > Avoid

Writing a vague refinement prompt like 'make it look more professional' without concrete layout instructions.

[S35]

### Patterns > Historical classic design styles (block 1) > Rules

Grunge (early 1990s, Seattle scene, associated with David Carson / Ray Gun magazine): near-illegible wild layouts, rough textures, torn edges.

[S36]

### Patterns > Separate sponsored content from the reusable color method

Separate sponsored content from the reusable color method

Principle: The video contains an explicitly declared sponsored segment about the 'Superhuman Mail' email tool (approximately 05:20-06:59), including an affiliate link offer; this segment is unrelated to the color-theory method and must be excluded from any reusable design rules extracted from the video.

Problem: Prevents mixing promotional content with the operational design method when this dossier or its rules are reused by another agent.

Source basis: The creator explicitly states the segment is sponsored and offers an affiliate link and free-month promotion.

Professional extension: The explicit exclusion rule for reuse is added by this dossier; the video itself does not instruct future reusers to separate the segment.

[S37]

### Patterns > Trend 7: Scrollytelling

Trend 7: Scrollytelling

Principle: Content and imagery are revealed progressively as the user scrolls, tying narrative pacing to the scroll gesture, often within a visually fixed section.

Problem: Extends marketing storytelling principles into an interactive, scroll-driven format for editorial or narrative content.

Source basis: The source states at 11:11-11:46: 'you're trying to tell a story as the user scrolls... it can be a really great and effective way to keep people engaged, if you do it right.'

Professional extension: The requirement for reduced-motion alternatives is a professional extension not discussed in the source.

[S38]

### Patterns > Cross-context application and durability > Rules

Apply the same core principles (grid, white space, typography, restrained color) regardless of medium (print, web, packaging, social).

[S39]

### Patterns > Synthesize rather than reproduce references

Synthesize rather than reproduce references

Principle: Transfer high-level cues while creating new composition, content, and assets.

Problem: Prevents copyright, trademark, and authorship problems.

Source basis: The video supplies examples and search terms, not reuse permissions.

Professional extension: Licensing and originality controls are added for safe production.

[S40]

### Patterns > Pair product/place images with human-use ('lifestyle') images > Avoid

Using only isolated architectural or product photography with no human context when the goal benefits from a usage narrative.

[S41]

### Patterns > Reapply the design system onto the existing project instead of regenerating from scratch > Avoid

Regenerating the whole project from a new prompt instead of layering the design system onto the existing one.

[S42]

### Patterns > Accessibility-first design > Rules

Test keyboard order, contrast, image alternatives and clear copy.

[S43]

### Patterns > Brand fit as the gate for every trend

Brand fit as the gate for every trend

Principle: No trend is adopted without an explicit justification that it fits the brand of the business and the goal of the website; the operative question is what skill is needed to decide well, not which trend to join.

Problem: Prevents trend-chasing that produces individually attractive pages which fail the client's actual objective.

Source basis: The video states the fit rule at the first trend and declares it applies to every trend discussed, then closes by reframing the question as one of skill rather than trend selection, and warns that a design that does not fit the big picture makes the site worse.

Professional extension: The two-trend ceiling, the written brand statement, the explicit labelling of time-bound claims and the separation of promotion from method are added by this dossier.

[S44]

### Patterns > Catalog of twelve grid systems and their use cases > Avoid

Using an isometric or triangular grid without adding the color/lighting cues needed to sell the sense of depth.

[S45]

### Patterns > Swiss Punk Typography > Rules

Layer and overlap elements with a cut-and-paste, DIY scrapbook energy.

[S46]

### Patterns > Maximalism with an asterisk > Avoid

Treating loudness as a substitute for hierarchy.

[S47]

### Patterns > Define site purpose before selecting any trend

Define site purpose before selecting any trend

Principle: No design trend should be adopted until the concrete action the site wants a user to take (purchase, subscribe, download a lead magnet, etc.) is explicitly defined.

Problem: Prevents cosmetic trend-chasing that does not serve business goals and can actively work against them.

Source basis: The source states this explicitly at 00:33-01:34: 'what is the purpose of my website? ... It should be to get a user to do something.'

Professional extension: Formalizing this as a mandatory gate before evaluating each of the nine trends, rather than a one-time preamble, is an operational structure added by this dossier.

[S48]

### Patterns > Trinket design > Avoid

Using a single large object instead of a curated collection/grid; the defining trait is the catalog-like arrangement of many small items.

[S49]

### Patterns > Cross-format and cross-size transferability

Cross-format and cross-size transferability

Principle: A design system is only complete once it has been verified to hold up when shrunk, placed on different backgrounds, and moved across formats (print, web, mobile, motion), not just in its original ideal presentation.

Problem: Prevents shipping a layout that only works in one perfect context and breaks down or loses legibility/identity in any other size or medium.

Source basis: The source directly states the principle and testing steps, quoting 'If your design only works in one perfect setting, an ideal setting, then it's not a solution. It is a problem.' (26:31) and walks through the exhibition-identity example across formats.

Professional extension: None beyond restating the source's own testing checklist as acceptance criteria.

[S50]

## Additional relevant context

### Patterns

4 validated rule patterns.

[S51]

### Rules document

Graphic design that reads as amateur versus professional is mostly governed by four subconscious, largely invisible perceptual rules -- visual weight distribution, emotional typography, balance calibrated to the project brief, and layered information hierarchy -- that a designer must apply deliberately rather than leaving to chance, and that must always be weighed against the specific brief instead of applied as fixed formulas.

Visual weight distribution

Principle: Tone, density, isolation and vertical position determine how heavy an element feels, and therefore where the viewer's eye enters and travels across a composition; this must be controlled intentionally.

Problem: Uncontrolled tonal contrast and element placement silently dictate the viewer's entry point and reading order, producing compositions that feel unbalanced or unintentional.

Source basis: The source explicitly states and visually demonstrates that darker/denser elements feel heavier, that isolation increases weight, and that upper areas of a frame feel heavier due to a subconscious association with instability and gravity.

Professional extension: None added beyond the source for this pattern; the rules stated here are a direct restatement of the source's explanation.

Emotional typography (kerning and stroke weight)

Principle: Letter spacing (kerning) and stroke weight are emotional levers: tight kerning and italics suggest urgency, generous kerning suggests relaxation and premium feel, heavy strokes suggest authority, and thin strokes suggest elegance.

Problem: Typography chosen only for visual style, without matching the emotional register the brief requires, can undercut the intended tone of a design even when the layout itself is sound.

Source basis: The source directly demonstrates all four typographic states (tight kerning, generous kerning, heavy type, thin type) on the same poster and states explicitly the emotional association of each.

Professional extension: The acceptance criterion about preserving legibility and negative space is a professional safeguard added by this dossier, not stated verbatim in the source.

Balance calibrated to the project brief

Principle: Balance is the distribution of visual weight to create stability, through symmetrical balance (elements mirror each other) or asymmetrical balance (different elements arranged to feel visually equal); neither perfect symmetry nor uncontrolled asymmetry is inherently correct, and the right choice depends entirely on the brief.

Problem: Treating perfect symmetry as the design goal produces static, lifeless compositions, while pushing asymmetry without control produces chaotic, unsettling ones; both failures come from applying a fixed idea of balance regardless of context.

Source basis: The source explicitly states the definition of balance, shows both failure extremes (too static, too chaotic), demonstrates controlled imbalance, and explicitly says the entire section 'might be considered false' depending on the brief, citing law firms and financial institutions as cases needing static symmetry.

Professional extension: None added beyond the source for the core rule; the source itself already frames balance as brief-dependent rather than absolute.

Layered information hierarchy (delayed hierarchy)

Principle: Layering arranges elements in overlapping levels of visual, structural and textual information so a design communicates instantly at a glance but reveals additional depth and meaning only through sustained attention.

Problem: Informational or conceptual designs that present all content at the same visual level compete for attention simultaneously, leaving the viewer without a clear entry point or reading order.

Source basis: The source explicitly narrates the three-layer breakdown (color/impact, word 'Plastic' as anchor, body text defining 'plastic') on the 'How Plastic Are we?' poster, including the 3-second and 15-second timing claims shown on screen.

Professional extension: None added beyond the source; the layer breakdown and timing claims are restated as given.

- Diagnose the current visual weight of the composition: identify dark, dense or isolated elements and where they direct the viewer's eye, paying special attention to the top of the frame.
- Decide the intended entry point for the viewer's eye and adjust tone, density or isolation of key elements to achieve it, rather than relying on size or position alone.
- Apply deliberate isolation to elements that should gain perceived weight without enlarging them.
- Select a typographic treatment (kerning tightness, stroke weight, italics, serif vs. sans) that matches the emotion required by the brief: urgency, relaxation/premium, authority, or elegance.
- Evaluate the project brief before deciding the balance strategy: favor symmetrical, static composition for institutional trust; favor controlled asymmetry for energy and personality.
- Avoid both extremes of balance: neither so symmetrical that the design feels lifeless, nor so asymmetric that it feels chaotic or unstable.
- For informational or conceptual pieces, design deliberate reading layers: an immediate visual-impact layer, a structural/conceptual anchor layer, and a detailed body-text layer.
- Review the resulting design against all four principles as a checklist, treating them as tools rather than rigid formulas.
- Document which principle was applied and why, especially when deliberately breaking one of them (for example, choosing static symmetry for a financial client).

[S52]

### Patterns

14 validated rule patterns.

[S53]

### Rules document

Typography is a language of tone as much as a system of technical rules: choosing a typeface communicates energy and intent before any word is read, and mastering the technical variables that shape text (units, weight, baseline, cap line, x-height, line height, tracking, kerning, contrast) allows a designer to assemble a coherent typographic system built on a hierarchy of headings, paragraphs, buttons and labels, over an output-appropriate grid.

Match typeface tone to project intent

Principle: A typeface communicates a tone of voice before its content is read; the choice of typeface must match the communicative energy required by the project.

Problem: Prevents choosing a typeface based purely on aesthetic taste while ignoring whether its tone fits the project's audience and purpose (e.g. a playful font for a law firm).

Source basis: The source states typography is 'the Art and Science of arranging text to be both legible and appealing' (00:00) and explicitly compares font choice to choosing a tone of voice, citing a clown vs. a lawyer and a wedding photographer vs. an eye doctor (00:30).

Professional extension: None; this pattern is drawn directly from the source's stated method.

Serif typefaces for tradition and stability

Principle: Serif typefaces, descended from Nicolas Jenson's 1470 Roman typeface, are associated with tradition, stability and enduring value.

Problem: Prevents using a serif typeface where a contemporary or playful feel is required, and prevents using a non-serif typeface where institutional trust must be signaled.

Source basis: The source explains Gutenberg's original calligraphic type, Nicolas Jenson's 1470 Roman typeface (01:00), Times New Roman's origin (01:32), and states 'tradition, stability and enduring value is exactly what people associate serif fonts with' (02:03), citing banks, jewelers and lawyers as typical users.

Professional extension: None; this pattern reflects the source's explanation directly.

Sans-serif typefaces for versatility and legibility

Principle: Sans-serif typefaces are versatile and legible because they lack a distinct decorative personality, and modern variable sans-serif families offer far more weight variability than serif families.

Problem: Prevents underusing sans-serif families' variability (defaulting to only one or two weights) and prevents choosing serif where broad brand versatility across many use cases is required.

Source basis: The source explains sans-serif origin and modern association (02:03-02:33), states sans-serifs are versatile because they 'lack a distinct personality' (03:05), describes variable sans-serif families offering thousands of weight/width combinations versus two options for serif (03:05), and states they are preferred for packaging, road signs, license plates, key caps and billboards, citing roughly 90% of consumer products (03:36).

Professional extension: None for the core claim; this dossier flags the '90% of consumer products' figure as an unverified statistic in evidence.limitations rather than treating it as validated data.

Restrict display typefaces to short, high-impact text

Principle: Display typefaces are designed to be unique and eye-catching for logos, headings or titles, but do not perform well as paragraph, button, or label text.

Problem: Prevents sacrificing paragraph, button or label legibility by applying a display typeface outside its intended short-text use case.

Source basis: The source explicitly defines display typefaces as designed for logos, headings or titles that need to stand out, and states 'they don't make good paragraphs, buttons or labels' (03:36).

Professional extension: None; this is a direct restriction stated by the source.

Distinguish script elegance from handwritten informality

Principle: Script typefaces imitate refined, classic calligraphy for an elegant and timeless feel, while handwritten typefaces are digitized from a real designer's handwriting and read as more playful and less elegant.

Problem: Prevents confusing script and handwritten typefaces, which produce opposite emotional effects despite both appearing 'handwriting-like'.

Source basis: The source states script typefaces are 'designed to be beautiful, classy and timeless' (04:07) and explicitly distinguishes them from handwritten typefaces, which come from a designer's own handwriting and read as 'more playful and less elegant' (04:07).

Professional extension: This dossier flags, in evidence.limitations, that no uniformly sampled frame directly demonstrates this specific distinction, since the closest available frame serves a different narrative purpose in the source.

Reserve monospace for code and tabular alignment

Principle: Proportional typefaces vary character width by shape; monospace typefaces give every character identical width, which is why they are used for code.

Problem: Prevents using monospace typefaces for general reading text (where proportional spacing improves legibility) and prevents using proportional typefaces where strict vertical character alignment is functionally required.

Source basis: The source defines proportional vs. monospace typefaces and states monospace fonts are used for coding because it is easier to navigate code 'arranged more like rows in a spreadsheet' (04:37).

Professional extension: None; this is a direct restriction stated by the source.

Use relative units (em/rem) for digital typography

Principle: Points and pixels are print- and screen-oriented sizing conventions, but em and rem are size-relative units that let users scale typography by changing a root value, keeping designs responsive to zoom and accessibility preferences.

Problem: Prevents hard-coding fixed pixel sizes for text in digital products, which breaks user-controlled zoom and accessibility scaling.

Source basis: The source explains the point as 1/12 inch (05:08), explains that typographic pixels are a sizing convention rather than literal screen pixels (05:40), defines em relative to font size (05:40-06:11), defines rem as 'root em' tied to the CSS `:root` element (06:11), and states roughly 90% of websites use this em/rem model (06:42).

Professional extension: This dossier flags the '90% of websites' figure as an unverified statistic in evidence.limitations rather than presenting it as validated data.

Use weight to build attention hierarchy without harming legibility

Principle: Bolder weights command more visual attention and suit titles and buttons; thinner weights are more legible at small sizes and suit paragraphs and labels; extreme weights in either direction harm legibility.

Problem: Prevents using an extremely thin headline (hard to read) or an extremely bold paragraph (visually straining) purely for stylistic effect.

Source basis: The source states bolder fonts command more attention and suit titles/buttons while thinner fonts suit paragraphs/labels (07:12), and that extremely thin headlines and bold paragraphs both harm legibility (07:12).

Professional extension: None; this is a direct rule stated by the source.

Respect baseline, cap line and x-height as structural anchors

Principle: Baseline, cap line and x-height are the invisible structural lines that define a character's proportions; a large gap between baseline and cap line reads as luxurious or fancy.

Problem: Prevents ignoring a typeface's structural proportions when matching it to a desired feel (e.g. choosing a typeface with a small baseline-to-cap-line gap when a luxurious feel is required).

Source basis: The source defines baseline, cap line and x-height (07:42-08:14) and states fonts with large baseline-to-cap-line differences 'often feel very fancy or luxurious' and are often used for fashion magazines or high-end clothing articles (08:14).

Professional extension: None; this is a direct explanation from the source.

Scale line height inversely to font size

Principle: Line height (leading) should be inversely proportional to font size: large headlines need tighter line height near 100% of the font size, while small paragraph text needs looser line height up to about 150%.

Problem: Prevents relying on a design tool's default line height (around 125%), which is a compromise value that does not fit any specific size perfectly.

Source basis: The source states default line height is about 125% of font size and is a compromise (08:45), and gives the rule of thumb that line height is inversely proportional to font size, with large headlines potentially at 1x and small paragraphs up to 1.5x (08:45-09:16), noting these are not hard rules and vary by typeface (09:16).

Professional extension: None; this is a direct rule of thumb stated by the source, explicitly flagged by the source itself as approximate.

Adjust tracking inversely to size; use kerning for specific pairs

Principle: Tracking (uniform letter-spacing) should be inversely proportional to text size; kerning adjusts spacing between specific letter pairs (not uniformly) to prevent visual collisions between certain shapes.

Problem: Prevents applying uniform letter-spacing rules to problems that require pair-specific kerning, and prevents leaving large headline text with default spacing that increases eye strain.

Source basis: The source explains tracking/letter-spacing as inversely proportional to size (09:16-09:46), explains kerning as pair-specific spacing given the 'w' and 'a' example (09:46), and cites designer Jessica Hische's kerning adjustment to the Southern Living logo (10:17).

Professional extension: This dossier flags the Southern Living/Jessica Hische attribution as an unverified direct claim in evidence.limitations, since no frame in the video visually confirms this specific case.

Verify text-to-background contrast against a minimum ratio

Principle: Legible typography requires sufficient color contrast between text and background, measured with a documented contrast ratio, with the source citing a 7:1 minimum guideline traced to 1999 W3C accessibility guidelines.

Problem: Prevents shipping designs where text is visually present but functionally illegible due to insufficient contrast against its background.

Source basis: The source explains accessible contrast as the color difference between typography and background, traces the concern to Flash-era illegible websites and 1999 W3C accessibility guidelines, and cites a recommended minimum contrast ratio of 7:1 and the tool webaim.org (10:17-10:49).

Professional extension: None beyond restating the source's own recommended verification step; this dossier does not add a different ratio.

Build a four-category typographic hierarchy

Principle: A coherent typographic system divides text into headings, paragraphs, buttons, and labels, defined top-down from the largest heading, with buttons as an explicit weight exception.

Problem: Prevents ad hoc, inconsistent text styling across a project by establishing a documented, top-down hierarchy that scales predictably.

Source basis: The source explains the four-category hierarchy (headings, paragraphs, buttons, labels), the top-down heading design process, the six H1-H6 levels with two-or-three being often sufficient, and the button weight/letter-spacing exception (11:19-12:21).

Professional extension: None; this pattern reflects the source's stated system directly.

Choose grid column count by output medium

Principle: The spacing system between typographic elements should follow a grid whose column count matches the output medium: 12 columns for web, 2 for general print, 6 for newspapers, 3 for magazines, and the golden ratio for posters.

Problem: Prevents inconsistent or arbitrary text-wrapping widths across a project by tying column structure to a medium-appropriate convention.

Source basis: The source recommends 12 columns for web design due to divisibility (12:52), describes a typical 2-column print layout, cites 6-column newspaper grids, 3-column magazine grids, and golden-ratio poster layouts (12:52), and stresses consistency of whatever spacing system is chosen (12:52).

Professional extension: None; this pattern reflects the source's stated grid conventions directly.

- Define the required communicative tone of the project before evaluating specific typefaces.
- Select a primary typeface family matching that tone, preferring a variable family if multiple hierarchy levels are needed from one family.
- Reserve monospace typefaces exclusively for code or tabular data.
- Define the sizing system in relative units (em/rem) with a configurable root value, for digital projects.
- Design the largest heading style first, then derive smaller heading levels proportionally; use only as many H1-H6 levels as needed.
- Design paragraph, button, and label styles following the same size-weight-spacing logic, giving buttons extra weight and letter-spacing.
- Set line height inversely proportional to font size across the scale.
- Set tracking (letter-spacing) inversely proportional to font size across the scale.
- Verify every text/background color pairing against a contrast calculator, targeting at least a 7:1 ratio unless the project specifies otherwise.
- Choose and document a grid column system matched to the output medium (12 for web, 2 for print, 6 for newspaper-style, 3 for magazine-style, golden ratio for posters) and apply it consistently.
- Reserve manual kerning adjustments for logotypes or short high-impact text, not general body copy.
- Document the resulting typographic system (typeface, scale, weights, line heights, tracking, grid) as a reusable project artifact.
- Flag any adoption statistic or specific named attribution drawn from this source as unverified in any derived documentation.

[S54]

### Patterns

7 validated rule patterns.

[S55]

### Rules document

Composition and layout are fundamentally about controlling a viewer's attention over time, not just arranging elements in space. A designer builds this control in layers: six escalating levels of visual movement and flow (literal direction, hierarchy, multiple flows, implied motion, flow disruption, and temporal flow), a grid system that provides the structural scaffolding for hierarchy and white space, and a four-part 'lift system' (leverage points, internal rhythm/eye choreography, calculated friction, and cross-format transferability) that keeps the design coherent across every size and medium it will be used in.

Six levels of movement and visual flow

Principle: Visual movement should be built as an escalating system: literal direction, hierarchy-driven flow, multiple simultaneous flows, implied motion, deliberate flow disruption, and temporal flow (pacing impact, lingering, and release over time).

Problem: Prevents designs that rely only on the most obvious cue (an arrow) and never develop subtler, more sophisticated ways of guiding attention, which makes work feel simplistic or predictable.

Source basis: The source explicitly describes and demonstrates all six levels in sequence over a single evolving poster example, narrating why each works (e.g. 'the human eye instinctively follows directional cues', 01:07; 'Punch, slow, pull, release', 08:15).

Professional extension: The explicit self-check questions and the acceptance criteria formalizing 'describe the eye's order of attention' are added by this dossier to make the concept testable, since the source states the principle narratively without a formal checklist.

Five reasons to use a grid system

Principle: Grids are not a stylistic constraint but a structural tool that actively creates hierarchy, controlled rule-breaking impact, format versatility, deliberate white space, and easier eye-guidance through content.

Problem: Prevents treating grids as an optional or purely historical convention, which leads to inconsistent hierarchy, uncontrolled white space, and text blocks that are too long or too short to read comfortably.

Source basis: The source states all five reasons directly with concrete examples (the 'mixd' web page for hierarchy, 09:51; the four-column grid broken with intent, 10:28; the definition of micro white space, 12:08; baseline grid sizing example, 13:18).

Professional extension: None beyond restating the source's own five reasons as actionable rules; no additional safeguard was necessary for this pattern.

Catalog of twelve grid systems and their use cases

Principle: Different content types call for different grid systems; matching the grid family to the medium (editorial, e-commerce, book, hierarchy-driven, proportion-based, gallery, packaging, branding) produces more coherent and purposeful layouts.

Problem: Prevents applying a single generic grid to every project regardless of content type, which produces layouts that fight against the medium instead of supporting it.

Source basis: The source explicitly names, defines and gives a use case plus an application tip for all twelve grid types in sequence (12:40-20:29), preserved here as a complete numbered inventory per the source integrity rule against omitting list items.

Professional extension: The instruction to 'explicitly consider all twelve types before finalizing a layout' is a professional extension added to turn the source's descriptive catalog into a checkable step.

Establishing a clear leverage point

Principle: A design needs an unambiguous element that the eye lands on first, reinforced by contrast, scale, isolation, or color, before any other flow or rhythm decision is made.

Problem: Prevents designs where multiple elements compete for first attention with no clear winner, leaving the viewer without a starting point.

Source basis: The source directly analyzes two examples (a Nike campaign and an editorial poster) to demonstrate how contrast, scale and isolation create a leverage point, quoting 'That's leverage. That is control.' (21:35).

Professional extension: The 'two-second viewer test' acceptance criterion is a professional extension added to make the concept independently testable outside the video's own narration.

Internal rhythm and eye choreography

Principle: After the leverage point is set, the rest of the layout must guide the eye through a deliberate, choreographed sequence using consistent spacing, predictable alignment, and controlled contrast.

Problem: Prevents layouts where the leverage point is strong but everything after it feels like a series of unrelated jumps rather than a guided path.

Source basis: The source directly explains and demonstrates eye choreography on a web-style layout example, quoting 'This path isn't accidental. It's actually choreographed.' (23:13) and 'Predictable spacing builds trust.' (23:45).

Professional extension: The explicit self-check questions listed under the workflow section ('are related elements visually grouped?') are restated by this dossier as acceptance criteria to make the pattern verifiable.

Calculated friction balanced with flow

Principle: Friction (tight spacing, jarring elements, uncomfortable typography) is a legitimate design tool when used intentionally in specific zones, as long as it is balanced by clearly defined zones of smooth flow elsewhere.

Problem: Prevents both extremes: designs with no friction that feel flat and forgettable, and designs with uncontrolled friction that lose the message in visual noise.

Source basis: The source directly defines friction, gives a worked example (tight leading, blurred faces, a cut-off word), and states the good-vs-bad friction distinction and the 'seasoning' metaphor ('just enough add some flavor... too much will ruin the whole thing', 25:58).

Professional extension: None beyond restating the source's own self-check questions as acceptance criteria; the pattern is presented largely as directly stated.

Cross-format and cross-size transferability

Principle: A design system is only complete once it has been verified to hold up when shrunk, placed on different backgrounds, and moved across formats (print, web, mobile, motion), not just in its original ideal presentation.

Problem: Prevents shipping a layout that only works in one perfect context and breaks down or loses legibility/identity in any other size or medium.

Source basis: The source directly states the principle and testing steps, quoting 'If your design only works in one perfect setting, an ideal setting, then it's not a solution. It is a problem.' (26:31) and walks through the exhibition-identity example across formats.

Professional extension: None beyond restating the source's own testing checklist as acceptance criteria.

- Read the metadata header and evidence/limitations sections before using any claim from this dossier.
- Identify the target medium and content type (editorial, e-commerce, branding, packaging, digital interface) before selecting a grid type from the catalog pattern.
- Define a single primary leverage point and reinforce it with contrast, scale, isolation or color before working on secondary layout decisions.
- Apply the chosen grid consistently, allowing at most one deliberate, clearly intentional break for contrast.
- Plan micro and macro white space explicitly as part of the grid subdivision, not as leftover space.
- Build internal rhythm by grouping related elements and keeping spacing/alignment consistent, matching pacing speed to content density.
- Add friction only in zones intended to demand attention, and confirm at least one zone of smooth flow exists elsewhere.
- Before finalizing, test the design at thumbnail size, on light and dark backgrounds, and in at least two different formats.
- Flag any business-outcome, popularity, or percentage claim inherited from this source as unverified unless independent evidence is supplied.
- Never cite a static frame or mockup as proof of a working software integration or a production deployment.

[S56]

### Patterns

10 validated rule patterns.

[S57]

### Rules document

Use 2026 web-design trends as human-led strategic choices: design with a point of view, purposeful motion and interaction, inclusive access, and performance from the outset; use AI as an assistant rather than a replacement for judgment.

Human-made direction

Principle: Give the site an intentional, original point of view instead of accepting generic generated output.

Problem: Soulless, indistinguishable visual work.

Source basis: The source presents human-made design and AI as a tool, not a crutch.

Professional extension: Require provenance and review for generated assets.

Strategic design thinking

Principle: Start with the business problem, audience and position before selecting UI features.

Problem: Executing requested features without diagnosing their purpose.

Source basis: The source explicitly describes these three inputs and the diagnostic question.

Professional extension: Document assumptions and obtain approval before material scope changes.

Organic layouts and anti-grid

Principle: Use fluid, asymmetric composition deliberately to create a reading journey while retaining enough structure to understand content.

Problem: Predictable, boxy layouts that feel like a spreadsheet.

Source basis: The source contrasts fluid magazine-like composition with rigid grids.

Professional extension: Responsive and keyboard testing is added as a safeguard.

Motion narrative

Principle: Use movement to reveal, connect or explain content rather than as decoration.

Problem: Flashy animation that does not advance the user's story.

Source basis: The source calls for intentional movement and scroll/page transitions that guide a story.

Professional extension: Reduced-motion preference and performance budgets are safeguards.

Glassmorphism 2.0

Principle: Use translucent layers, soft shadows and blur to create subtle tactile depth and hierarchy.

Problem: Cold or sterile futuristic styling and unclear layer relationships.

Source basis: The source describes translucent frosted layers, soft shadows and diffused blurs.

Professional extension: Contrast testing is added for accessibility.

Archival index

Principle: Turn organization, labels and typography into an authoritative editorial system for information-heavy content.

Problem: Dense catalogs that lack clarity or hierarchy.

Source basis: The source cites archives, museums and manuals as references for clear, authoritative presentation.

Professional extension: Semantic headings and searchable metadata are added safeguards.

Micro-interactions with purpose

Principle: Small responses should clarify state, guide action or confirm completion.

Problem: Decorative effects that add cognitive load without usability value.

Source basis: The source names hover color changes and cart feedback, emphasizing usability.

Professional extension: Keyboard and assistive-technology equivalence is added.

Accessibility-first design

Principle: Design access from the beginning through contrast, alt text, keyboard access and clear language.

Problem: Treating accessibility as a late compliance check.

Source basis: The source explicitly lists contrast, alt text, keyboard navigation and simple language.

Professional extension: Use applicable standards and test with real users where possible.

AI as creative partner

Principle: Use AI to explore ideas and automate bounded tedious work while a designer retains judgment and control.

Problem: Replacing strategic thinking with automated output.

Source basis: The source proposes idea generation, layout testing, bug work and image optimization with designer control.

Professional extension: Privacy, licensing and human-review controls are added.

Performance-first creativity

Principle: Treat speed, efficient code, image optimization and hosting as design inputs, not post-launch repair.

Problem: A visually attractive site that is slow or frustrating.

Source basis: The source connects optimized images, efficient code and hosting to experience and search visibility.

Professional extension: Budgets and device testing make the advice operational.

- Diagnose business goals, audience and positioning.
- Write a human-led visual rationale and information hierarchy.
- Select trends only when they serve that rationale.
- Prototype layouts, motion and interactions with accessibility and performance constraints.
- Use AI for bounded exploration under human review.
- Test behavior, access and speed before release.

[S58]

### Patterns > Communicate value and manage client process to be well paid

Communicate value and manage client process to be well paid

Principle: Being a well-paid web designer requires communicating value, guiding clients through a clear process, and interpreting what clients actually mean by ambiguous requests, not just visual design skill.

Problem: Prevents skilled designers from being underpaid because they neglect the communication and process skills that determine compensation.

Source basis: The source states at 01:35-02:05 that the best designers are sometimes the worst paid because pay also depends on communicating value, running a clean client process, and decoding ambiguous requests.

Professional extension: None; this pattern is derived directly from the source's stated method. Note: this segment also contains a paid-resource promotion (02:05-02:31) excluded from the operational rules.

[S59]

### Patterns

15 validated rule patterns.

[S60]

### Rules document

Professional web design quality depends less on visual trend mastery than on three trained skills: executing layout, color, typography, and images solidly before adding flashy elements; treating composition rules as a starting point rather than an absolute law, in favor of trained personal judgment validated with real user testing; and treating design as a consulting service that requires communicating value, explaining decisions, managing client expectations, and knowing when to decline a project.

Master the basics before adding flashy elements

Principle: Layout, color, typography, and images must be solid before any decorative or flashy element (like animation) is added to a design.

Problem: Prevents shipping sites where flashy effects mask unresolved fundamentals, producing a result the source calls 'tacky'.

Source basis: The source states at 00:14-00:52 that layout, color, typography, and images matter most, and explicitly recommends building 'boring' sites first to learn when flair adds value versus detracts.

Professional extension: None; this pattern is derived directly from the source's stated method.

Prioritize copy over visual composition

Principle: The written copy of a site is the biggest factor in client outcomes, more than the visual design itself.

Problem: Prevents visual design competing with and drowning out the message that actually persuades visitors.

Source basis: The source states at 00:52-01:16 that copy is the biggest factor in client success and quotes 'design matters, but words close deals,' concluding the designer's job includes making people pay attention to the words.

Professional extension: None; this pattern is derived directly from the source's stated method.

Simplify the design before adding elements back

Principle: A design should start reduced to its essentials, adding elements back only when a specific project need justifies them.

Problem: Prevents overcrowded designs with excessive colors and design elements that dilute focus.

Source basis: The source states at 01:16-01:35 that many designers 'do too much,' citing excessive color palettes and design elements, and recommends dialing back first and adding only what the project needs.

Professional extension: None; this pattern is derived directly from the source's stated method.

Communicate value and manage client process to be well paid

Principle: Being a well-paid web designer requires communicating value, guiding clients through a clear process, and interpreting what clients actually mean by ambiguous requests, not just visual design skill.

Problem: Prevents skilled designers from being underpaid because they neglect the communication and process skills that determine compensation.

Source basis: The source states at 01:35-02:05 that the best designers are sometimes the worst paid because pay also depends on communicating value, running a clean client process, and decoding ambiguous requests.

Professional extension: None; this pattern is derived directly from the source's stated method. Note: this segment also contains a paid-resource promotion (02:05-02:31) excluded from the operational rules.

Treat composition rules as a starting point, not a law

Principle: Classic composition rules (golden ratio, rule of thirds, 60-30-10 color rule) are useful starting points, but trained personal judgment should override them when the result looks better without them.

Problem: Prevents mechanical rule-following from producing a worse result than a deliberate, judgment-based deviation.

Source basis: The source states at 02:31-02:56 that rules like golden ratio, rule of thirds, and 60-30-10 are great starting points but should not override trusting one's own eye, and that knowing when to break them separates competent from great designers.

Professional extension: None; this pattern is derived directly from the source's stated method.

Design by screen context, not mobile-first alone

Principle: Each screen size presents a distinct set of usage problems that should be designed for individually, rather than defaulting to a single mobile-first design adapted across sizes.

Problem: Prevents a mobile-first-only approach from missing context-specific problems on other screen sizes.

Source basis: The source states at 02:56-03:35 that mobile-first orthodoxy oversimplifies design, that the claimed ~90% mobile traffic figure has not held true for the creator's clients, and recommends designing for context first, since every screen size has different problems.

Professional extension: None; this pattern is derived directly from the source's stated method.

Optimize the top hero section of every page

Principle: The top section of a homepage must grab attention, clearly state what the site is about, motivate action, and show the next step, since most visitors engage primarily with this section.

Problem: Prevents wasted design effort below the fold when the top section fails to engage or clarify the site's purpose.

Source basis: The source states at 03:35-04:05 that 85% of visitors only care about the top section of the homepage, and that this section must grab attention, be crystal clear about the site's purpose, motivate action, and show the next step.

Professional extension: The 85% figure is treated in this dossier as an unverified, time-bound claim since no source or study is cited in the video.

Establish clear visual hierarchy

Principle: Not every element on a page can be equally important; design requires deciding what is visually loudest and forcing the rest to recede, using cues like size, proximity, and alignment.

Problem: Prevents a flat visual hierarchy where headline, subhead, and button compete equally for attention, leaving users without clear guidance.

Source basis: The source states at 04:05-04:33 that if everything on a homepage is important, nothing is, and that design is mostly about deciding what gets to be loud versus what is forced to recede, using size, proximity, and alignment.

Professional extension: None; this pattern is derived directly from the source's stated method.

Explicitly declare project trade-offs

Principle: No website can maximize features, SEO, UX, conversion rate optimization, performance, accessibility, and design simultaneously; priorities must be explicitly chosen for each project.

Problem: Prevents overpromising simultaneous optimization across all quality dimensions of a project.

Source basis: The source states at 04:33-05:00 that every website has trade-offs and there is no perfect site optimizing every dimension at once, and that the designer's job is to determine priorities and make the call.

Professional extension: None; this pattern is derived directly from the source's stated method.

Borrow ideas from other work without copying them

Principle: Original design effort is often wasted; it is more effective to borrow what works from other projects, adapted to the current project's context, rather than copying directly.

Problem: Prevents both wasted effort chasing originality and low-quality direct copying that ignores the current project's context.

Source basis: The source states at 05:00-05:20 that designers should stop trying to be purely original, borrow ideas from other people's projects, but adapt them with their own spin to fit their project's context rather than copying directly.

Professional extension: None; this pattern is derived directly from the source's stated method.

Diagnose the client's real problem before executing their request

Principle: Not every paying client's literal request reflects their true need; diagnosing the underlying problem and recommending the right next step is what distinguishes a consultant from a pixel-pusher.

Problem: Prevents blindly executing client requests that do not address, or actively obscure, the client's actual problem.

Source basis: The source states at 05:20-05:48 that not every paying client needs help with their website, and that diagnosing a client's true problem and next right step turns a designer into a consultant rather than a pixel-pusher, who gets paid more.

Professional extension: None; this pattern is derived directly from the source's stated method.

Explain the reasoning behind design decisions

Principle: Client approval friction is often caused by designers failing to explain the reasoning behind their design decisions, not by the decisions themselves.

Problem: Prevents recurring client pushback and revision requests caused by unexplained design choices.

Source basis: The source states at 05:48-06:12 that failure to get client approval is often caused by poor explanation rather than poor design, and that stating 'I did this because of this' goes a long way.

Professional extension: None; this pattern is derived directly from the source's stated method.

Validate designs with real user testing

Principle: Designers are too close to their own work to see its flaws clearly; testing with people outside the project is the only reliable way to find design gaps.

Problem: Prevents shipping designs with obvious usability gaps that the designer cannot perceive due to familiarity with the work.

Source basis: The source states at 06:12-06:39 that user testing is the only way to find the holes in a design, since designers are too close to their own work, and recommends asking a friend or family member to complete a task and fixing what they struggle with.

Professional extension: None; this pattern is derived directly from the source's stated method.

Decline projects that trigger a negative gut instinct

Principle: When professional instinct signals not to take a project, that signal should be trusted regardless of the potential payment or perceived need for the work.

Problem: Prevents accepting projects with clear warning signs purely due to financial pressure, which the source states is rarely worth it.

Source basis: The source states at 06:39-06:55 that if your gut says not to take a project, you should not take it regardless of payment or need, describing this as true nine times out of ten based on painful personal experience.

Professional extension: None; this pattern is derived directly from the source's stated method.

Seek support from other people rather than working in isolation

Principle: Professional success is driven more by having people around to help through struggles than by handling everything independently.

Problem: Prevents burnout and preventable failures caused by attempting to solve every design or business problem alone.

Source basis: The source states at 06:55-07:16 that you do not get a medal for doing it all alone, and that having people around to help during struggles is the biggest factor in success.

Professional extension: None; this pattern is derived directly from the source's stated method. Note: this segment is followed by a paid-resource promotion (07:16-07:31) excluded from the operational rules.

- Validate that layout, color, typography, and images are solid before proposing any decorative or flashy element.
- Review and prioritize the site's copy before finalizing its visual composition.
- Reduce colors and design elements to the essentials, adding back only what a specific need justifies.
- Communicate the value of the design work and follow a clear, documented client process.
- Apply composition rules (golden ratio, rule of thirds, 60-30-10) as a starting point, overriding them with documented justification when the visual result improves.
- Design each target screen size according to its own usage context rather than a single mobile-first template.
- Optimize the top hero section of every page to grab attention, state purpose, motivate action, and show the next step.
- Establish explicit visual hierarchy using size, proximity, and alignment so one element is clearly dominant.
- Document the project's priority trade-offs across features, SEO, UX, performance, accessibility, and design.
- Adapt ideas borrowed from other projects to the current project's specific context instead of copying them.
- Diagnose the client's underlying problem before executing a literal request.
- State the explicit reasoning behind every significant design decision presented to a client.
- Test the design with at least one person outside the project team completing a concrete task, and fix observed struggle points.
- Decline any project that triggers a strong negative professional instinct, regardless of payment offered.
- Seek external support (mentors, peers, community) when facing a significant design or business obstacle.
- Separate any promotional or paid-resource content from the operational method before presenting recommendations.

[S61]

### Patterns > Refine visually in short, directed iterations, not one master prompt

Refine visually in short, directed iterations, not one master prompt

Principle: After the design system is applied, keep improving the result through small, specific adjustments (animation parameters, real photography instead of illustrations, externally generated images) evaluated one at a time, rather than trying to specify every refinement in a single exhaustive prompt.

Problem: Prevents overloading a single prompt with too many simultaneous visual requests, which tends to produce inconsistent or unpredictable results.

Source basis: At 08:23 the creator tunes parallax speed live ('we can use like two and we can see the movement faster'), and at 08:58 separately adds ChatGPT-generated people images and swaps the pizza illustration for a real photo.

Professional extension: None; this is a direct source observation.

[S62]

### Rules document

A website generated by AI from a single prompt tends to look generic because the AI has no visual language of its own to apply; the gap between a generic result and a professional one is closed not by writing a better prompt but by inserting a deliberate intermediate step: building an explicit design system (palette, typography, radii, elevations, iconography, brand tone) from a real visual reference, then reapplying that design system onto the already-generated project and iterating the refinement prompt on that consistent basis. Once created, the same design system can be reused to consistently generate other brand assets (a menu, social media posts) without repeating the visual-definition work, and the final design-tool output can be exported as a prompt into a coding environment (Claude Code) to produce a real functional site.

A single initial prompt does not produce a distinctive design

Principle: Generating a project from one prompt in a design tool, without templates and without a design system, yields a functional but visually generic result, because the model has no explicit visual language to draw on.

Problem: Prevents mistaking a functional-but-generic first draft for the intended final quality, and avoids the trap of endlessly rewriting the prompt to fix a problem that is not textual but visual.

Source basis: The creator states at 02:12 that the first result 'looks a bit generic' to a professional designer's eye, after deliberately skipping templates and a design system for this first pass.

Professional extension: None; this is a direct source observation.

Delegate long prompt drafting once the goal is clear

Principle: Instead of manually writing an extensive prompt, describe the goal briefly to a chat model and have it produce a detailed Markdown specification file, then use that file as the input for the design tool.

Problem: Reduces the cost of writing a highly detailed specification without sacrificing specificity, and produces a reusable artifact (the Markdown file) that documents the project intent.

Source basis: At 01:05 the creator states he told Claude in a few words what he wanted to build and asked it to create a detailed prompt in an MD file, which he then downloaded and used.

Professional extension: None; this is a direct source observation.

Find a real visual reference before creating the design system

Principle: Before asking the tool to define a visual language, search moodboard/inspiration tools for a real image that represents the desired style, and use it strictly as inspiration, never as material to copy.

Problem: Prevents the design system from being generated from an abstract text description with no concrete visual anchor, which is a major source of generic-looking output.

Source basis: At 03:56 the creator searches Pinterest for 'fun website design', explicitly states 'we're not copying anyone's work, we're just using it for inspiration', and selects an image based on liked typography.

Professional extension: None; this is a direct source observation.

Generate an explicit, reusable design system from the reference

Principle: Use a dedicated design-system generation feature that can build a system from a GitHub repository, a local codebase, a Figma file, or visual assets, and review the resulting system in full (navigation, typography, numeric scale, color palette, shapes, wordmark/logo, brand colors, animations, elevations, radii) before reusing it.

Problem: Prevents design decisions from being made ad hoc and inconsistently across iterations and across different brand assets.

Source basis: Between 04:59 and 07:11 the creator creates and reviews the design system, describing its navigation, typography, numeric information, colors, blobs and shapes, wordmark, brand colors, animations, elevations and radii.

Professional extension: None; this is a direct source observation.

Reapply the design system onto the existing project instead of regenerating from scratch

Principle: Return to the already-generated project and apply the newly created design system as additional context, then write a refinement prompt focused on composition and layout decisions (e.g. full-viewport hero, scroll-parallax animation), rather than discarding the project and starting over.

Problem: Prevents wasted work from full regeneration and ensures the refinement is grounded in the same project the design system was meant to improve.

Source basis: At 07:11 the creator selects the design system via the '+' icon and writes: 'Update the website design layout using design system. Hero screen should be full viewport... Add some parallax on scroll animations with pizzas and ingredients.'

Professional extension: None; this is a direct source observation.

Refine visually in short, directed iterations, not one master prompt

Principle: After the design system is applied, keep improving the result through small, specific adjustments (animation parameters, real photography instead of illustrations, externally generated images) evaluated one at a time, rather than trying to specify every refinement in a single exhaustive prompt.

Problem: Prevents overloading a single prompt with too many simultaneous visual requests, which tends to produce inconsistent or unpredictable results.

Source basis: At 08:23 the creator tunes parallax speed live ('we can use like two and we can see the movement faster'), and at 08:58 separately adds ChatGPT-generated people images and swaps the pizza illustration for a real photo.

Professional extension: None; this is a direct source observation.

Reuse the same design system across other brand assets

Principle: Once a design system exists, invoke it again through the tool's document/asset templates (menu, social posts) using guided configuration flows, so every additional brand asset inherits the same palette, typography and visual tone without redefining them.

Problem: Prevents visual inconsistency across a project's different deliverables and avoids repeating the design-definition work for every new asset.

Source basis: Between 11:13 and 12:51 the creator generates a menu and Instagram posts using the same design system, stating at 12:51: 'the most important thing is that we have our design system consistent everywhere: in our posts, in our website, and now our menu.'

Professional extension: None; this is a direct source observation.

Export the finished design to a code environment and switch to a cheaper model for that stage

Principle: Once the visual design is approved, export the project as a prompt into a coding environment (local agent, web session, remote repository, or zip download), and deliberately choose a lower-cost model for that stage, since the visual decisions are already resolved and only need to be translated into functional code.

Problem: Prevents wasting the most capable (and most expensive) model on a translation task that does not require additional creative visual reasoning, and marks the actual transition from a design-tool preview to a real, functional site.

Source basis: At 10:38 the creator sends the design to Claude Code, creates a new local folder, pastes the prompt obtained from Claude Design, and explicitly selects 'Sonnet 5... because I don't want to spend any more tokens on this, and it should be fine because we have the designs in the Claude Design.'

Professional extension: None; this is a direct source observation.

Plan the workflow around tool usage limits

Principle: The design tool has usage quotas that can interrupt an in-progress refinement session; anticipate this by grouping visual refinement work before exporting to code, rather than assuming unlimited iteration is available mid-session.

Problem: Prevents losing context or momentum mid-iteration when a usage limit is hit unexpectedly, and encourages batching refinement work deliberately.

Source basis: The creator explicitly states at 07:46 'I hit my limit, and this sucks', and mentions running close to limits again around 06:39.

Professional extension: The recommendation to batch refinement work in anticipation of usage limits is added by this dossier; the video only reports experiencing the limit, not a mitigation strategy.

Separate creator self-promotion from the reusable technical method

Principle: The video includes a direct self-promotion (one-to-one mentoring sessions and a newsletter subscription plug) inserted mid-tutorial; this content must be identified and excluded from the transferable technical method.

Problem: Prevents a promotional aside from being mistaken for a required step of the workflow.

Source basis: At 07:46 the creator says: 'if you want to learn more about Claude Design or AI design workflows, be sure to check out the links in the description below to my one-to-one sessions and subscribe to my newsletter.'

Professional extension: None; this is a direct source observation, classified here as promotional rather than operational.

- Collect the project goal in a brief natural-language description.
- Have a chat model expand that description into a detailed Markdown specification file.
- Run that specification inside the design tool without templates or a design system, using a high-capability model, to obtain a first functional baseline.
- Evaluate the baseline for genericness using design judgment before proceeding.
- Search inspiration tools for a concrete real visual reference matching the desired style, using it only as inspiration.
- Generate an explicit design system from that reference (or from a repository/codebase/Figma file) and review it in full: typography, palette, numeric scale, shapes, logo, animation, elevation, radius.
- Return to the original project and reapply the design system as additional context, writing a refinement prompt focused on concrete composition and layout changes.
- Iterate in short, directed steps (animation tuning, real imagery integration) evaluating each change before the next.
- Reuse the same stored design system to generate other brand assets (menu, social posts) via guided configuration flows.
- Export the approved design to a coding environment, switching to a lower-cost model for that translation stage.
- Verify the exported project runs as a functional site in a real browser before considering the workflow complete.
- Plan refinement sessions in batches to account for tool usage limits.
- Exclude any creator self-promotion encountered in the source material from the reusable operational workflow.

[S63]

### Patterns > Diagnose the client's real problem before executing their request

Diagnose the client's real problem before executing their request

Principle: Not every paying client's literal request reflects their true need; diagnosing the underlying problem and recommending the right next step is what distinguishes a consultant from a pixel-pusher.

Problem: Prevents blindly executing client requests that do not address, or actively obscure, the client's actual problem.

Source basis: The source states at 05:20-05:48 that not every paying client needs help with their website, and that diagnosing a client's true problem and next right step turns a designer into a consultant rather than a pixel-pusher, who gets paid more.

Professional extension: None; this pattern is derived directly from the source's stated method.

[S64]

### Patterns

9 validated rule patterns.

[S65]

### Rules document

Sophisticated, minimal web design is achieved by deliberately reducing design variables (visible elements, typefaces, type hierarchies, colors, graphic elements, illustration styles, and image treatments) to the minimum necessary, then applying those decisions with discipline and consistency across an entire site. Perceived sophistication comes from restraint and coherence, not from the quantity of visual resources used.

Reduce visible elements

Principle: Hide secondary elements (buttons, dropdowns, popups, modals, icons, entire pages) behind interactions or dedicated subpages, and use generous whitespace instead of compressing everything into one module.

Problem: Prevents cluttered, crowded modules and pages that force users to parse too many simultaneous choices.

Source basis: The source states this rule directly (00:53-02:35) and demonstrates it with the presenter's own testimonials page example.

Professional extension: None added; this pattern is taken directly from the source without extension.

Master a few typefaces

Principle: Build and reuse a small personal repertoire of typefaces across projects instead of choosing new ones for every project.

Problem: Prevents shallow familiarity with any single typeface's whitespace, kerning, and contrast behavior across sizes and backgrounds.

Source basis: The source states this directly (02:48-04:39), including the presenter's personal typeface preferences and the Massimo Vignelli example (unverified claim of ten typefaces across his career).

Professional extension: None added; the Vignelli figure is flagged in evidence.limitations as an unverified claim rather than extended.

Reduce typefaces per project

Principle: Use a maximum of one or two typefaces per individual project, typically one display typeface for titles and one neutral typeface for body copy.

Problem: Prevents visual chaos caused by mixing too many typefaces within a single identity.

Source basis: The source states this directly (04:39-06:14) and demonstrates it with three portfolio examples (PP Hatton + Helvetica Neue; Univers + Akzidenz-Grotesk; Clarendon + Futura).

Professional extension: None added; this pattern is taken directly from the source without extension.

Reduce type hierarchies

Principle: Limit the type system to a maximum of three to five hierarchies, and ensure every size jump between adjacent hierarchies is perceptually clear, either by doubling the size or by switching between uppercase and lowercase.

Problem: Prevents hierarchies that are visually indistinguishable from one another, which undermines the type system's ability to guide the reader.

Source basis: The source states this directly (06:33-10:29) and demonstrates both a working three/five-hierarchy system and a flawed four-hierarchy example with imperceptible size jumps (22px/18px/16px/13px).

Professional extension: None added; this pattern is taken directly from the source without extension.

Reduce colors

Principle: Use one or two colors for typography plus one accent color, and one or two background colors plus the same accent, alternating CTA color depending on the contrast with the immediate background.

Problem: Prevents color palettes that dilute brand consistency and reduce contrast legibility for calls to action.

Source basis: The source states this directly (10:29-13:04) and demonstrates it with a two-color typography example, a three-color site (white, green, gray), and the accent-alternation rule for CTAs.

Professional extension: None added; this pattern is taken directly from the source without extension.

Reduce graphic elements

Principle: Choose one or two types of graphic element (images, illustrations, icons, vectors, 3D, video) per project and keep them consistent throughout.

Problem: Prevents a dispersed, inconsistent visual identity caused by mixing many unrelated types of graphic elements.

Source basis: The source states this directly (13:04-14:07) and demonstrates it with a handdrawn-vector sports site containing hand-drawn highlights, a hand-lettered secondary title treatment, and tactical play drawings.

Professional extension: None added; this pattern is taken directly from the source without extension.

Reduce illustration styles

Principle: When illustrations are used, fix a single consistent style for the whole project by deciding texture, perspective, shadow presence, level of detail, and technique in advance.

Problem: Prevents illustrations with inconsistent detail, technique, or shadow treatment within the same identity.

Source basis: The source states this directly (14:23-15:36) and demonstrates it with a flat, hand-drawn illustration set, while acknowledging a typography/illustration style mismatch as an area for improvement.

Professional extension: None added; this pattern is taken directly from the source without extension.

Reduce image treatments

Principle: Fix a single photographic treatment (color vs. black and white, saturation, temperature) for the whole project; use a unifying treatment such as black and white when source images come from heterogeneous origins.

Problem: Prevents visually inconsistent photography caused by mixing images with different lighting, saturation, or color temperature.

Source basis: The source states this directly (15:36-17:14) and demonstrates it with a fully black-and-white site (heterogeneous image sources) contrasted against a fully color site (single photographer, same day, same lighting).

Professional extension: None added; this pattern is taken directly from the source without extension.

Three-step process to apply the eight rules

Principle: Explore all design variables on one representative piece (the homepage hero), then audit the full site once it grows, then simplify any inconsistency into an explicit rule.

Problem: Prevents inconsistency and one-off exceptions that accumulate as intermediate designers focus on individual modules instead of the whole system.

Source basis: The source states this directly (17:50-19:21) as the three-step process for applying the eight rules, including the presenter's own homepage slider example.

Professional extension: None added; this pattern is taken directly from the source without extension.

- Identify the target site's homepage hero or most representative piece and enumerate its current typefaces, hierarchies, colors, graphic element types, illustration style, and image treatment.
- Compare the enumerated variables against the eight reduction rules (visible elements, typefaces, typefaces per project, type hierarchies, colors, graphic elements, illustration styles, image treatments) and flag any that exceed the stated limits.
- For flagged type hierarchies, verify whether adjacent size jumps are at least double or reinforced by a case change; flag any that are neither.
- For flagged color palettes, verify the count of text colors, background colors, and accent colors against the one-or-two-plus-accent limit.
- For flagged graphic elements, verify the count of distinct graphic element types against the one-or-two-type limit.
- If illustrations are present, verify they share technique, detail level, perspective, and shadow treatment.
- If photographs are present, verify they share color treatment and saturation, and check whether source heterogeneity requires a unifying treatment.
- Audit the full site (not module by module) for inconsistencies introduced by pages added after the initial homepage exploration.
- For every inconsistency found, propose an explicit, site-wide rule rather than a one-off fix.
- Exclude any promotional content (courses, mentorship programs, subscriptions) encountered in source material from the design rule set.

[S66]

### Rules document

The nine web design trends predicted for 2026 revolve around a single tension: the dominant aesthetic is flattening through imitation of the AI sector, and everything else is a reaction to that flattening. The governing rule the author repeats for every trend is that a trend is only worth adopting when it fits the brand of the business and the goal of the website; the useful question is not which trend to jump on, but what skill is needed to decide whether it serves the client.

Barely there UI

Principle: Hyper-minimal interfaces borrowed from the leading AI companies: thin sans serifs, stripped-down layouts, dialed-back palettes, generous white space, and data graphs everywhere.

Problem: Prevents visual noise from competing with the message on product and startup sites where credibility depends on looking restrained and technical.

Source basis: The video states this trend is driven by venture capital flowing into AI, names OpenAI and Perplexity as the hyper-minimal references, predicts it will grow through 2026, and gives the three application tips (fewer colors, one font family, more white space).

Professional extension: The contrast and discoverability requirements are added by this dossier, because thin type on dialed-back palettes is the most common accessibility failure of this aesthetic and the video does not address it.

Maximalism with an asterisk

Principle: The deliberate opposite reaction to minimalism — oversized bold headers, bright colors, and in extreme cases too many moving parts — but moderated, because AI-driven minimalism toned the whole field down.

Problem: Prevents brands with expressive personalities from disappearing into the uniform minimal look, while avoiding the unusable chaos of unrestrained maximalism.

Source basis: The video defines the trend, explains the asterisk as the author's own failed prediction that maximalism would explode, attributes the slowdown to AI hyper-minimalism, and gives the three application tips.

Professional extension: The hierarchy and animation-count bounds are added here; the video only says most people will dial it back without defining a threshold.

The human touch (wabi-sabi) and anti-UX

Principle: Deliberate imperfection signalling that a real person made the page: hand-drawn arrows, messy underlines, unpolished or phone-shot photos, paper and ink textures, sketched illustrations. Its extreme form is anti-UX, intentionally non-intuitive interaction.

Problem: Prevents a site from reading as AI-generated in a field where generated output is becoming the default and indistinguishable.

Source basis: The video explains the wabi-sabi philosophy, lists the concrete manifestations, names the anti-UX extreme, notes most sites only sprinkle it in, and gives the application tip.

Professional extension: The constraint that imperfection must never touch required tasks, and the licensing requirement, are added by this dossier.

Grade school color palettes

Principle: A return to basic, grounded colors with worked hues, tints and shades — replacing the loud neon of late 2024 — with a saturated orange appearing almost everywhere.

Problem: Prevents palette fatigue: the video observes that audiences tire of very loud colors quickly, and neon palettes declined within a year.

Source basis: The video narrates the neon decline through 2025, defines the grade school palette, insists the colors are not raw primaries, and singles out orange as nearly warranting its own category.

Professional extension: The contrast requirement, the color-alone prohibition and the explicit time-bound labelling are added here.

Spaceship instruction manual

Principle: Blueprint-style layouts: lines pointing at arbitrary elements, tiny labels that carry no real meaning but look important, lo-fi exploded-view drawings replacing photographs, and abundant monospace type.

Problem: Prevents a technical product from looking generic by borrowing the visual language of engineering documentation.

Source basis: The video describes the blueprint layout, the meaningless tiny labels, the lo-fi exploded drawings and the monospace type, states it works for technical projects, and gives the sparse application tips.

Professional extension: The assistive-technology and information-placement constraints are added by this dossier; the video does not address how decorative labels behave for screen reader users.

Democratized fancy animations

Principle: WebGL-class 3D and interactive graphics, previously restricted to high-end agencies with dedicated JavaScript developers, now reachable through tools such as Spline and Unicorn Studio — with the explicit caveat that being able to do it is not a reason to do it.

Problem: Prevents both extremes: missing an now-accessible expressive capability, and drowning a site in animation that serves no communicative purpose.

Source basis: The video explains the democratization, names Spline and Unicorn Studio, defines WebGL as what lets sites show video-game-like 3D or interactive graphics, praises narrative use over distraction, and states explicitly that being able to do it does not mean you should. The author also discloses that he uses these tools on his own sites.

Professional extension: The reduced-motion, fallback and performance-budget requirements are added by this dossier; the video raises no technical constraint.

Internet nostalgia

Principle: Early-2000s web elements returning in restrained form: custom cursors, blocky Windows-like interfaces, ASCII text art, and experiences that feel like an old computer. The author marks this trend as still emerging rather than mainstream.

Problem: Prevents a site from feeling interchangeable, by adding a memorable moment aimed at decision makers who grew up with the early web.

Source basis: The video presents the trend as emerging, explains its generational cause, lists custom cursors, Windows-like UI, ASCII imagery and old-computer experiences, recounts the earlier backlash against cursors, and gives the seasoning tip.

Professional extension: The hit-area, focus-state, text-alternative and keyboard requirements are added by this dossier.

The tab that's playing music

Principle: Interfaces adding sound to interactions — occasionally full songs, more often micro-sounds that click and beep in response to interaction — because phones trained users to expect sonic feedback.

Problem: Prevents the absence of feedback that makes users doubt whether their interaction registered, which is the behavior phones conditioned.

Source basis: The video names the trend after the browser-tabs joke, describes full songs and micro-sounds, argues phones trained the expectation of sonic feedback, predicts growth, and recommends keeping it tiny and letting people choose.

Professional extension: The autoplay prohibition, persistent mute control, visual-equivalence requirement and preference persistence are added here; the video only suggests giving users the choice.

Tech bro gradient

Principle: Soft mixes of purple, blue and teal, sometimes with a neon glow, functioning as the unofficial uniform of SaaS companies, AI startups and developer tools trying to look cutting edge.

Problem: Prevents a technical product from reading as dated, at the cost of reading as interchangeable with every other product using the same device.

Source basis: The video describes the color mix, its habitat in SaaS and developer tools, its motivation (looking innovative and future-forward), predicts growth in 2026 because it is easy and looks good, and advises varying color combinations and shapes. The author discloses that he likes and uses gradients himself.

Professional extension: The AA contrast validation across the gradient and the light/dark rendering check are added by this dossier.

Brand fit as the gate for every trend

Principle: No trend is adopted without an explicit justification that it fits the brand of the business and the goal of the website; the operative question is what skill is needed to decide well, not which trend to join.

Problem: Prevents trend-chasing that produces individually attractive pages which fail the client's actual objective.

Source basis: The video states the fit rule at the first trend and declares it applies to every trend discussed, then closes by reframing the question as one of skill rather than trend selection, and warns that a design that does not fit the big picture makes the site worse.

Professional extension: The two-trend ceiling, the written brand statement, the explicit labelling of time-bound claims and the separation of promotion from method are added by this dossier.

- Write a one-line statement of what the business does and what the website must achieve, before any aesthetic decision.
- Select at most two compatible trends from the nine and record why the others were discarded.
- Set the intensity to the minimum the source recommends: a sprinkle of nostalgia, one color accent, a few technical lines, one soft sound.
- Build the sober base first: type scale (one family if the axis is barely-there UI), spacing scale, and a reduced palette with a single accent.
- Apply the trend as a layer on top of that base, never as its foundation.
- Review every added element and remove anything that only demonstrates familiarity with the trend.
- Verify accessibility: AA contrast over gradients and saturated blocks, click target size with custom cursors, and no information carried by color or sound alone.
- Measure weight and load time of any WebGL scene on a mid-range device and a slow connection before approving it.
- Honor prefers-reduced-motion and never play audio without a deliberate user action.
- Resolve licensing for fonts, textures, illustrations and 3D assets before publishing.
- Document which trends were adopted and why, so review evaluates fit rather than taste.
- Label every 2026 prediction carried into the work as a time-bound hypothesis.

[S67]

### Patterns > Rework a session's output without the specific reference in view

Rework a session's output without the specific reference in view

Principle: If a working session produced a composition too close to one specific reference, resume the project without that reference visible, reusing the same base elements to force an original solution.

Problem: Prevents shipping a design that is recognizably a copy of a single reference.

Source basis: The source states the creator avoided copying something seen because they did not want people to think the design was copied, and reworked the layout with the same elements instead (13:42-14:13).

Professional extension: None; this pattern is taken directly from the source with no added extension.

[S68]

### Patterns

12 validated rule patterns.

[S69]

### Rules document

High-quality editorial-style web design is achieved not by adding visual effects (shadows, gradients, textures, borders, patterns) but by deliberately restricting the design toolkit to five elements: typography, color, grid, images, and white space. Structure and constraints enable rather than limit creativity, and composition, balance, hierarchy and the use of white space are what separate a premium layout from an amateur one.

Restrict the design toolkit to five elements

Principle: An editorial-style layout is built using only typography, color, grid, images and white space, with no decorative effects layered on top.

Problem: Prevents designers from masking weak composition with shadows, gradients, 3D textures, borders and patterns.

Source basis: The source explicitly states editorial layouts are built on typography, one or two colors, a simple grid, images in clear boxes, and white space (02:06), and frames the constraint as freedom via the 'bones' analogy (02:38).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Gather all assets into a single workspace before designing

Principle: Every asset (images, logo, text) needed for the redesign is imported into a single Figma file before any layout decisions are made.

Problem: Prevents designing with an incomplete inventory of content, which leads to mid-process surprises and rework.

Source basis: The source states the first step is grabbing all assets and putting them in Figma (04:44), likening it to gathering ingredients for a recipe (05:16).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Digest content and define the site's goal before laying out

Principle: Understand and prioritize the actual text content, and explicitly declare the site's primary goal, before deciding how content will be displayed.

Problem: Prevents treating all text uniformly (fixed-width paragraphs dropped in place) and prevents designing without a clear success criterion for the page.

Source basis: The source describes 'digesting' content as sifting and understanding it rather than just placing it (05:48), and defines the site's goal as directing users to the price list (06:19), with the '2027' phrase later shown enlarged as a headline element.

Professional extension: None; this pattern is taken directly from the source with no added extension.

Research references deliberately, including cross-medium sources

Principle: Build a habit of reviewing design references regularly, and for any given project, gather references from more than one medium to avoid replicating a single source.

Problem: Prevents an over-reliance on one reference, which produces recognizably derivative designs.

Source basis: The source recommends reviewing references 30 minutes a day (07:23), explicitly includes a Herman Miller print poster among web references (07:54-08:26), and states references are combined so as not to mimic or replicate a single one (07:54).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Pair product/place images with human-use ('lifestyle') images

Principle: When imagery needs to tell a story about a place or product, combine at least one shot of the place/product itself with a shot of people using it.

Problem: Prevents purely architectural or product photography from failing to communicate an experiential story that helps sell the offering.

Source basis: The source explains combining place/product images with people-using-them images as 'lifestyle images' because 'stories sell products' (09:29).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Iterate by duplicating versions and pruning overloaded compositions

Principle: Before making large layout changes, duplicate the current version to preserve a history, and when a composition becomes visually overloaded, deliberately reduce elements rather than accommodate all of them.

Problem: Prevents losing earlier working versions during iteration, and prevents visual clutter from an excess of competing elements.

Source basis: The source states there are '1,000 layouts' possible with the same elements and recommends duplicating to keep a saved copy while iterating (10:32-11:34), and narrates discarding an image-heavy version down to two images (10:32-11:02).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Use a constrained color palette and deliberate layered depth

Principle: Define a small, fixed palette (a light neutral, one accent color, and one or two dark neutrals at different opacities) and use foreground/background image layering with interposed text to create depth.

Problem: Prevents an uncontrolled, inconsistent color palette and flat, depthless compositions.

Source basis: The source describes creating depth by placing one image in the background and one in the foreground of the text (11:34), and defines the final palette as off-white, brown, dark black and lower-opacity black (12:07-12:39).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Rework a session's output without the specific reference in view

Principle: If a working session produced a composition too close to one specific reference, resume the project without that reference visible, reusing the same base elements to force an original solution.

Problem: Prevents shipping a design that is recognizably a copy of a single reference.

Source basis: The source states the creator avoided copying something seen because they did not want people to think the design was copied, and reworked the layout with the same elements instead (13:42-14:13).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Apply a fixed spacing scale on a defined column grid

Principle: Use a closed spacing scale (e.g., 10/20/40/80/160 px) for every gap, margin and padding, laid out on a 12-column grid with fixed side margins.

Problem: Prevents arbitrary, inconsistent spacing values that make a layout feel unresolved.

Source basis: The source states the spacing system uses 20, 40, 80, 160 pixels (and sometimes 10) (14:44-15:16), and confirms a 12-column grid with 40-pixel margins on both sides (15:16-15:46).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Verify pixel-perfect, cross-axis alignment between elements

Principle: Check every new element's alignment against already-placed elements on both the vertical and horizontal axes, not only against the base grid, and correct any one-pixel-off placement.

Problem: Prevents layouts that look 'almost aligned' rather than precisely resolved, which is described as a mark of amateur versus senior-level execution.

Source basis: The source states that being one pixel off is not pixel-perfect and that senior designers achieve pixel-perfect layouts (15:46-16:19), and explains 'branching' as aligning elements both vertically and horizontally against each other (17:22-17:54).

Professional extension: None; this pattern is taken directly from the source with no added extension.

Use blend modes to keep overlaid text legible on imagery

Principle: When large text is placed over a photographic image, evaluate a blend mode (such as 'difference') instead of a flat overlay to create contrast while preserving image texture.

Problem: Prevents choosing only a flat color overlay by default, which can flatten photographic texture unnecessarily.

Source basis: The source describes trying a 'difference' blending mode to create contrast between images and overlapping text (16:19-16:50).

Professional extension: Verifying legibility across the full text area, rather than a single sample point, is added rigor beyond what the source explicitly demonstrates.

Choose composite block placement using one of three explicit criteria

Principle: Position a compound block (e.g., paragraph plus CTA) as a single unit, deciding its placement via fixed internal proportion, alignment with another visual element, or distance from a fixed structural element such as the navigation.

Problem: Prevents ad hoc, unexplainable placement of grouped elements that cannot be justified or reproduced.

Source basis: The source explicitly lists three placement strategies -- fixed proportion, matching another image, and relative to the navigation -- and shows the final choice of 40px margin and 80px above/below the nav (18:57-20:02).

Professional extension: None; this pattern is taken directly from the source with no added extension.

- Gather all assets (images, logo, text) for the project into a single working file before any layout decisions.
- Read and digest all textual content; identify phrases or data points to elevate into standalone typographic elements.
- Explicitly declare the site's primary goal before designing the layout.
- Gather varied references, including at least one from outside the target medium, avoiding reliance on a single source.
- Restrict the design toolkit to typography (1-2 families), color (1-2 accents plus neutrals), a simple grid, images in clear containers, and white space.
- When imagery must tell a usage story, pair product/place images with people-using-it images.
- Iterate by duplicating versions before large changes; prune elements from overloaded compositions instead of keeping everything.
- Introduce layered depth (foreground/background images with interposed text) where it clarifies hierarchy, within the defined palette.
- If a session's output is too close to one reference, rework it without that reference visible.
- Define and apply a fixed spacing scale and a defined column grid with fixed margins.
- Check cross-axis (vertical and horizontal) alignment of every new element against already-placed elements, not only the grid.
- For text over imagery, evaluate blend modes (e.g., difference) instead of a default flat overlay, and verify legibility.
- Position compound blocks as single units using one of the three documented placement strategies.
- Before finalizing, verify pixel-perfect alignment for every block.
- Separate any promotional content (courses, mentorships, sales links) from the technical method description.
- Apply the professional-extension safeguards (accessibility, responsiveness, performance, licensing, reduced motion, client authorization, commercial transparency) as additions, not as claims made by the source.

[S70]

### Patterns > There is no hierarchy without contrast

There is no hierarchy without contrast

Principle: Contrast is the set of differences in an element that make it stand out, and it is the mechanism by which a viewer perceives which elements have primacy.

Problem: Prevents designs where all elements share identical values (size, color, spacing), which makes it impossible for the viewer to tell which element should be noticed first.

Source basis: Stated directly as Rule 3 (01:33-02:05) with the identical-dots example, where changing one dot's size, color and spacing gives it primacy.

Professional extension: None.

[S71]

### Patterns

6 validated rule patterns.

[S72]

### Rules document

Visual hierarchy is the order in which a viewer notices the elements of a design, and it is deliberately built by combining three forces: contrast (which separates and gives primacy to a few elements), uniformity (which gives predictable structure to the rest of the design so not everything competes for attention), and composition (which arranges elements according to scanning patterns the audience already knows, such as top-to-bottom, left-to-right, Z-pattern, or F-pattern). Hierarchy does not determine which element is absolutely more important; it determines the order in which the viewer should notice things.

Hierarchy is a perception order, not an importance judgment

Principle: Visual hierarchy ranks elements by the order a viewer notices them (primacy), not by their intrinsic importance; every element in a good design can be essential while still being read in sequence.

Problem: Prevents designers from assuming the 'most important' content in the abstract should automatically get the most visual weight, when what actually matters is what the user needs to see first to complete their task.

Source basis: The video states this directly at 00:00-01:33, using the landing-page-with-video example (headline first, video second) to illustrate that hierarchy governs order, not absolute importance.

Professional extension: None; this pattern is taken directly from the source without added inference.

Primacy must stay scarce to remain effective

Principle: The number of elements and their primacy are correlated: only a few elements can carry high primacy, and most of a design must remain relatively uniform so those few elements can stand out.

Problem: Prevents a design where too many elements compete for top-level attention, which erases hierarchy entirely because nothing stands out when everything does.

Source basis: Stated directly as Rule 2 (01:01-01:33): 'the number of elements and the primacy of elements are correlated.'

Professional extension: None.

There is no hierarchy without contrast

Principle: Contrast is the set of differences in an element that make it stand out, and it is the mechanism by which a viewer perceives which elements have primacy.

Problem: Prevents designs where all elements share identical values (size, color, spacing), which makes it impossible for the viewer to tell which element should be noticed first.

Source basis: Stated directly as Rule 3 (01:33-02:05) with the identical-dots example, where changing one dot's size, color and spacing gives it primacy.

Professional extension: None.

The ten ranked techniques for creating contrast

Principle: Contrast can be created through ten techniques, ranked from most to least powerful: motion, task-related information, focal points via white space, human faces, color, size, weight, imagery, extra elements, and misalignment.

Problem: Prevents relying on a single, overused contrast technique (commonly size or color) while ignoring more effective or more subtle alternatives suited to the situation.

Source basis: The full ranked list of ten techniques (motion, task-related information, focal points/white space, faces, color, size, weight, imagery, extra elements, misalignment) is stated directly and completely between 02:05 and 09:48, including the WebAIM citation and the 4.5:1 recommended contrast ratio.

Professional extension: The acceptance criteria requiring a verifiable numeric contrast ratio check as a standing practice (not just a one-time mention) is added as a professional extension of the source's guidance.

Uniformity gives structure through predictability and cohesion

Principle: Elements of the same type (such as repeated cards) must share identical visual values -- size, font, font weight, paragraph height, border color, corner radius -- so the group reads as a cohesive, unified section rather than competing for attention.

Problem: Prevents a design where repeated elements of the same type look subtly different from each other, which breaks visual cohesion and makes a design look messy rather than balanced.

Source basis: Stated directly as Rule 4 (09:48-11:20) using the product-benefits-cards example, specifying exactly which values must match across cards, and naming this practice 'cohesion.'

Professional extension: None; the specific list of values to standardize (image size, font, font size, font weight, paragraph height, border color, corner radius) is stated directly in the source.

Composition follows known audience scanning patterns

Principle: Arrange elements according to a pattern the audience already knows how to scan: top-to-bottom, left-to-right, Z-pattern (combining both, common in minimalist or print media), or F-pattern (common on text-heavy web pages).

Problem: Prevents arranging a design's elements arbitrarily, which forces the viewer to work harder to find the intended reading order instead of following a familiar scanning habit.

Source basis: The four composition patterns (top-to-bottom, left-to-right, Z-pattern, F-pattern) and their recommended use cases are stated directly between 12:22 and 14:56, with the Z-pattern example visually confirmed in frames.

Professional extension: None; the medium-vs-pattern matching guidance is stated directly in the source's closing remarks.

- Define the desired hierarchy: list which element must be noticed first, second, third, etc., based on what the user needs to accomplish, not on which content subjectively feels most important.
- Apply contrast only to the one element (or small set) that must carry primacy, selecting from the ten ranked techniques (motion, task-related information, white space/focal points, faces, color, size, weight, imagery, extra elements, misalignment) based on how strong or subtle the desired effect should be.
- Apply uniformity to every other element, standardizing size, font, font weight, paragraph height, border color, and corner radius within each repeated group.
- Group similar elements together to reinforce visual cohesion and ease of scanning.
- Choose a composition pattern (top-to-bottom, left-to-right, Z, or F) based on the medium and the relative amount of text, and place the primary element at that pattern's natural entry point.
- Verify color contrast on any critical text or element using a contrast-checking tool, targeting a minimum ratio of 4.5:1.
- Apply moderation to faces and imagery, using them only when directly relevant to the promoted content.
- Confirm that only one element carries absolute primacy and that the rest of the design is deliberately uniform; if several elements compete for top attention, revisit and reinforce uniformity among the non-primary elements.
- Separate time-bound or unverified claims (e.g., specific conversion numbers or third-party tool recommendations) from the stable structural principles of the method.

[S73]

### Patterns > Partner with a developer of comparable skill level

Partner with a developer of comparable skill level

Principle: A designer should partner with a trusted developer whose skill level matches their own, rather than delegating to a lower-skilled developer or handing the file directly to a client without a trusted developer relationship.

Problem: Prevents quality degradation that occurs when a high-skill design is implemented by a lower-skill developer.

Source basis: The video states this directly around 17:26-17:57, including the quote: "A 10 out of 10 designer with a five out of 10 developer and the quality drops" (17:26).

Professional extension: None; this pattern is taken directly from the source without added recommendations.

[S74]

### Patterns

8 validated rule patterns.

[S75]

### Rules document

An editorial layout (dominant typography, asymmetric composition, generous white space, strong visual hierarchy) is not superficial decoration or 'form over function': it is a hierarchy tool that, executed well, guides the user's eye and communicates the message clearly. The practical method is to design the desktop version first (the richest and most complex), deliberately simplify it toward mobile following a small explicit set of responsive behavior rules, and deliver a clean Figma handoff file with typography system, color system, UI kit and behavior notes, without needing to over-specify every breakpoint.

Editorial layout as hierarchy tool, not decoration

Principle: An editorial-style layout uses typography, spacing, rhythm and composition to guide the user's eye toward the desired action; it is not decoration for its own sake.

Problem: Prevents the common criticism that editorial layouts are 'form over function' by making hierarchy and guided visual flow an explicit, testable requirement instead of an assumption.

Source basis: The video states this directly around 01:04-03:17 and quotes: "If your layout doesn't guide the user's eye, then it's not really working" (02:08).

Professional extension: None; this pattern is taken directly from the source without added recommendations.

Design desktop first, then simplify to mobile

Principle: Design the richest, most complex, most immersive version of the site for desktop first, then deliberately simplify it down to mobile.

Problem: Prevents mobile-first designs from producing weak or disproportionate desktop layouts, since simplifying down is easier than complexifying up.

Source basis: The video states this directly around 03:17-03:47, including the quote: "It's easier to plan interactions and animations from a rich layout than from mobile" (03:47).

Professional extension: None; this pattern is taken directly from the source without added recommendations.

Three-stage process with a limited set of reference breakpoints

Principle: The full process is desktop design, then mobile translation, then developer handoff; breakpoints are limited to at most three reference sizes rather than exhaustively covering every screen size.

Problem: Prevents excessive design time spent on breakpoints disproportionate to the project's scope, especially for small brochure-style sites.

Source basis: The video states this directly around 03:47-07:41, including the specific reference sizes and the $1 million Adidas project example (unverified) at 05:30.

Professional extension: None; this pattern is taken directly from the source without added recommendations.

Six explicit rules for translating desktop to mobile

Principle: Desktop-to-mobile translation follows six explicit, repeatable behavior rules rather than ad hoc redesign decisions.

Problem: Prevents inconsistent or undocumented mobile adaptations that are hard for a developer to implement predictably.

Source basis: The video enumerates these six rules directly around 14:38-15:48 and reinforces the column rationale at 15:48-16:53.

Professional extension: None; this pattern is taken directly from the source without added recommendations.

Mobile carousel component design details

Principle: A tap-triggered image carousel component should maximize tappable area, reuse alignment edges consistently, surface the primary CTA inside the carousel, and vary slide layouts to avoid visual monotony.

Problem: Prevents a mobile carousel from being visually repetitive or having poorly accessible tap targets.

Source basis: The video states this directly around 12:19-14:04.

Professional extension: None; this pattern is taken directly from the source without added recommendations.

Minimum viable developer handoff package

Principle: The handoff file to a developer should be a clean, structured Figma file containing the typography system, color system, a rebuilt grid with explicit margins and gutters, a basic UI kit, and simple behavior notes, without exhaustively specifying every breakpoint.

Problem: Prevents both under-specified handoffs (missing system-level documentation) and over-specified ones (excessive breakpoint-by-breakpoint detail that slows down delivery).

Source basis: The video states this directly around 17:57-20:46, including specific example values for margins, gutters and column counts.

Professional extension: None; this pattern is taken directly from the source without added recommendations.

Partner with a developer of comparable skill level

Principle: A designer should partner with a trusted developer whose skill level matches their own, rather than delegating to a lower-skilled developer or handing the file directly to a client without a trusted developer relationship.

Problem: Prevents quality degradation that occurs when a high-skill design is implemented by a lower-skill developer.

Source basis: The video states this directly around 17:26-17:57, including the quote: "A 10 out of 10 designer with a five out of 10 developer and the quality drops" (17:26).

Professional extension: None; this pattern is taken directly from the source without added recommendations.

Specialize in one discipline before adding a second

Principle: Becoming proficient in one discipline (e.g., design) before adding a second (e.g., development) is faster overall than splitting time across two disciplines from the start, because expertise in the first accelerates learning the second.

Problem: Prevents the common failure mode of splitting focus across multiple disciplines early and taking longer to reach proficiency in either.

Source basis: The video states this directly around 21:22-22:27, citing a '10,000 hours = 5 years full-time' heuristic.

Professional extension: This dossier flags the specific timeframes (5 years, 10 years, 3 years) and the learning-acceleration claim as an unverified opinion of the presenter rather than an empirically demonstrated result.

- Design the full desktop version of the site first, maximizing hierarchy, interaction richness and animation.
- Identify the primary desired user action and verify the desktop composition visually guides toward it.
- Select at most two or three reference screen sizes (desktop, optional laptop, mobile) instead of an exhaustive breakpoint list.
- Translate the desktop design to mobile applying the six explicit responsive rules: collapse navigation into an icon, allow summarizing or pushing down written content, invert horizontal/vertical orientation, push buttons and swipeable elements downward for tap access, shrink only titles while keeping body text at minimum 16px, and use a 6-column grid to preserve asymmetric proportions.
- Review text sizes and spacing iteratively rather than assuming desktop values transfer directly to mobile.
- Design interactive components (e.g., carousels) with explicit tap-target sizing, consistent edge reuse, and layout variation to avoid monotony.
- Prepare the developer handoff file with a documented typography system, color system with per-color usage notes, a rebuilt grid with explicit margins and gutters, a basic UI kit, and simple behavior notes.
- Select or partner with a developer whose skill level is comparable to the designer's own.
- After development, jointly review and adjust real breakpoints with the developer instead of over-specifying them at design time.
- Label any conversion, revenue or scaling claims associated with the method as unverified claims from the source, not as guaranteed outcomes.

[S76]

### Método completo de la fuente

Método completo de la fuente

[S77]

### Patterns > The ten ranked techniques for creating contrast

The ten ranked techniques for creating contrast

Principle: Contrast can be created through ten techniques, ranked from most to least powerful: motion, task-related information, focal points via white space, human faces, color, size, weight, imagery, extra elements, and misalignment.

Problem: Prevents relying on a single, overused contrast technique (commonly size or color) while ignoring more effective or more subtle alternatives suited to the situation.

Source basis: The full ranked list of ten techniques (motion, task-related information, focal points/white space, faces, color, size, weight, imagery, extra elements, misalignment) is stated directly and completely between 02:05 and 09:48, including the WebAIM citation and the 4.5:1 recommended contrast ratio.

Professional extension: The acceptance criteria requiring a verifiable numeric contrast ratio check as a standing practice (not just a one-time mention) is added as a professional extension of the source's guidance.

[S78]

### Patterns > Restrict the design toolkit to five elements

Restrict the design toolkit to five elements

Principle: An editorial-style layout is built using only typography, color, grid, images and white space, with no decorative effects layered on top.

Problem: Prevents designers from masking weak composition with shadows, gradients, 3D textures, borders and patterns.

Source basis: The source explicitly states editorial layouts are built on typography, one or two colors, a simple grid, images in clear boxes, and white space (02:06), and frames the constraint as freedom via the 'bones' analogy (02:38).

Professional extension: None; this pattern is taken directly from the source with no added extension.

[S79]

### Patterns > Strategic design thinking

Strategic design thinking

Principle: Start with the business problem, audience and position before selecting UI features.

Problem: Executing requested features without diagnosing their purpose.

Source basis: The source explicitly describes these three inputs and the diagnostic question.

Professional extension: Document assumptions and obtain approval before material scope changes.

[S80]

### Patterns > Hierarchy is a perception order, not an importance judgment

Hierarchy is a perception order, not an importance judgment

Principle: Visual hierarchy ranks elements by the order a viewer notices them (primacy), not by their intrinsic importance; every element in a good design can be essential while still being read in sequence.

Problem: Prevents designers from assuming the 'most important' content in the abstract should automatically get the most visual weight, when what actually matters is what the user needs to see first to complete their task.

Source basis: The video states this directly at 00:00-01:33, using the landing-page-with-video example (headline first, video second) to illustrate that hierarchy governs order, not absolute importance.

Professional extension: None; this pattern is taken directly from the source without added inference.

[S81]

### Patterns > Composition follows known audience scanning patterns

Composition follows known audience scanning patterns

Principle: Arrange elements according to a pattern the audience already knows how to scan: top-to-bottom, left-to-right, Z-pattern (combining both, common in minimalist or print media), or F-pattern (common on text-heavy web pages).

Problem: Prevents arranging a design's elements arbitrarily, which forces the viewer to work harder to find the intended reading order instead of following a familiar scanning habit.

Source basis: The four composition patterns (top-to-bottom, left-to-right, Z-pattern, F-pattern) and their recommended use cases are stated directly between 12:22 and 14:56, with the Z-pattern example visually confirmed in frames.

Professional extension: None; the medium-vs-pattern matching guidance is stated directly in the source's closing remarks.

[S82]

### Patterns > The human touch (wabi-sabi) and anti-UX

The human touch (wabi-sabi) and anti-UX

Principle: Deliberate imperfection signalling that a real person made the page: hand-drawn arrows, messy underlines, unpolished or phone-shot photos, paper and ink textures, sketched illustrations. Its extreme form is anti-UX, intentionally non-intuitive interaction.

Problem: Prevents a site from reading as AI-generated in a field where generated output is becoming the default and indistinguishable.

Source basis: The video explains the wabi-sabi philosophy, lists the concrete manifestations, names the anti-UX extreme, notes most sites only sprinkle it in, and gives the application tip.

Professional extension: The constraint that imperfection must never touch required tasks, and the licensing requirement, are added by this dossier.

[S83]

### Patterns

5 validated rule patterns.

[S84]

### Patterns > Surveillance design

Surveillance design

Principle: Pulls visual language from CCTV footage, UI overlays, thermal imaging, timestamps, and biometric graphics.

Problem: Names an intense, on-edge style for conceptual posters and tech/data-themed branding.

Source basis: The source names the style, describes its visual traits, and mentions the channel's own tutorial on creating it in Kittl.

Professional extension: None beyond search-query phrasing guidance; the referenced external tutorial is not independently verified here.

[S85]

### Patterns

20 validated rule patterns.

[S86]

### Patterns > Niche saturation audit and intentional positioning

Niche saturation audit and intentional positioning

Principle: Before designing a new piece, analyze 10-20 direct competitors in the client's niche to identify what visual conventions are saturated, then consciously decide whether to align with or deliberately disrupt those conventions.

Problem: Prevents producing a design that looks clean and professional in isolation but is effectively invisible because it duplicates the dominant, fast-saturating visual language of its niche.

Source basis: The source explicitly describes running a 'saturation audit' of 10-20 competitors before designing anything, and choosing to align intentionally or disrupt strategically (00:37-02:18), visually confirmed by frame-15pct.png.

Professional extension: None; this pattern stays within what the source states and shows. The claim that this decision 'can double your value' is flagged as an unverified claim, not restated here as fact.

[S87]

### Patterns

3 validated rule patterns.

[S88]

### Patterns > Accessibility-first design

Accessibility-first design

Principle: Design access from the beginning through contrast, alt text, keyboard access and clear language.

Problem: Treating accessibility as a late compliance check.

Source basis: The source explicitly lists contrast, alt text, keyboard navigation and simple language.

Professional extension: Use applicable standards and test with real users where possible.

[S89]

## Coverage and limitations

- Blocks considered: 110
- Blocks included: 89
- The token budget was exhausted; 21 additional block(s) with real evidence were left out.

## Source registry

- auto-design / waHuVF3XuMA — Steal These Web Design Trends 2026 (Self-Made Web Designer)
- auto-design / DU6vjWnH2p0 — How I design websites with EDITORIAL style layouts (part 1) (BONT)
- auto-design / YlN28RNChl0 — This Video Will Take You From Junior to Senior UX/UI Designer (uxpeak)
- auto-design / Vs2oSkw4VHM — 8 advanced rules of minimal Web Design (BONT)
- auto-design / _DHiyzRN4gY — Why Minimalism Dominates Modern Graphic Design (Kittl)
- auto-design / tbf6XDqCWFE — BRUTALISM: Best Website Examples for Your Web Design Inspiration |  TemplateMonster (TemplateMonster)
- auto-design / AXpxZMRM1EY — The ULTIMATE Guide To Typography For Beginners (DesignSpo)
- auto-design / AzjbRybUX3M — Why Your Designs Still Look Amateur! (Hidden Rules Pros Use) (Satori Graphics)
- auto-design / PKfZ1gnVJ44 — The FULL 2026 Guide To Layout & Composition For Designers! (Satori Graphics)
- auto-design / rFyOIWMwRdg — 2026 Web Design Trends You Need to Know (Sam Crawford | Web Design Expert)
- auto-design / WxZHUe8mvhU — 11 Years of Brutally Honest Web Design Advice in 7 Minutes (Self-Made Web Designer)
- auto-design / T96O8dTzi2Q — NO MORE AI SLOP | Claude Design Full Tutorial (Sergei Chyrkov)
- auto-design / kK1TOpI948o — The Beginner's Guide To Visual Hierarchy (DesignSpo)
- auto-design / 25UwZDuHfiQ — How I design websites with EDITORIAL style layouts (part 2) (BONT)
- auto-design / 8ahnUt_A5eA — Popular Web Design Trends (Codex Community)
- auto-design / xpLUouSZHi8 — 20 More Design Styles You've Been Searching For (Kittl)
- auto-design / u-JtFKXL_jY — 4 Graphic Design Tips For ELITE Design Thinkers! (Satori Graphics)
- auto-design / OjaciP_fBwU — 30 Graphic Design Styles in 15 Minutes (Maria Tokar)
- auto-design / nlGr4GRIzAg — The REAL 2026 Color Theory Knowledge Designers Need To Know! (Satori Graphics)
- auto-design / DRmnkaWQp4o — 9 Web Design Trends 2025 to Spruce Up Your Site (Showit)
- auto-design / bZ1vbmV5gk8 — 40 Design Style Names You've Been Looking For (Find References Faster) (Kittl)
- auto-design / uZWnxa4mkKA — 15 More Design Styles You've Never Heard Of (Kittl)
