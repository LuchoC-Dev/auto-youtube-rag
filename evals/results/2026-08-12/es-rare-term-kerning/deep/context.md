---
schema_version: "1.0"
query: "kerning"
depth: deep
estimated_tokens: 63918
sources_used: 22
---

# Context package

## Query and scope

Query: kerning
Depth: deep (max 64000 estimated tokens)

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

### Contexto autónomo para un agente — How I design websites with EDITORIAL style layouts (part 1)

# Contexto autónomo para un agente

## Propósito

Este documento convierte el video de YouTube con ID `DU6vjWnH2p0`, titulado
"How I design websites with EDITORIAL style layouts (part 1)" del canal BONT,
en un paquete de conocimiento autosuficiente. Un agente que lea únicamente
este archivo debe poder entender, explicar y aplicar el método de diseño
editorial mostrado en el video sin necesidad de ver, escuchar ni consultar la
fuente original. El video es un tutorial práctico en el que el diseñador
Adrian Somoza explica su proceso para transformar un sitio web existente
("The Rider", una web inmobiliaria) en una versión con composición de estilo
editorial, y muestra —acelerado— el proceso completo de rediseño en Figma.

## Evidencia y límites

- **Evidencia directa (transcripción):** el guion completo del video en
  inglés, capturado en `transcript/source.txt`, proveniente de la pista de
  subtítulos automáticos original (`en-orig`), la más confiable disponible
  porque el canal no publicó subtítulos manuales. No existe pista `Original`
  separada del audio; el idioma detectado por metadatos (`language: en`)
  coincide con el contenido hablado y con el título, por lo que el idioma de
  origen se considera confirmado con alta confianza.
- **Confirmación visual:** veinte fotogramas uniformes (0 % a 95 % de
  duración) más cinco fotogramas suplementarios en momentos clave,
  inspeccionados directamente con la herramienta `Read` sobre
  `contact-sheet.jpg` y `supplemental-contact-sheet.jpg`.
- **Reclamos con vigencia temporal:** menciones a un curso gratuito ("Golden
  Canon Grid") y a un programa de mentoría ("Bunk Lab") con enlaces "abajo en
  la descripción"; cifras de "más de 10.000 diseñadores/estudiantes"; fecha de
  finalización de un edificio ficticio-referencial ("by 2027"). Todo esto
  puede haber cambiado desde la grabación.
- **Reclamos no verificados:** el tiempo declarado de producción del diseño
  ("alrededor de 1 hora y 30 minutos", acelerado 4x en el video) es una
  afirmación del creador sin evidencia independiente que la confirme; se
  registra como tal.
- **Limitaciones de la evidencia:**
  - No hay subtítulos manuales; se usó la pista automática original en
    inglés, que contiene errores de transcripción habituales del
    reconocimiento de voz automático (por ejemplo, nombres propios mal
    transcritos como "Masimo Vignelli" en lugar de "Massimo Vignelli", o
    "Golden Canon Grid" transcrito a veces como "Golden Cannon Grid"). Estos
    errores se han normalizado en este documento cuando la evidencia visual o
    el contexto los aclaran, y se señalan explícitamente donde persiste
    ambigüedad.
  - El video muestra un proceso de diseño en Figma a alta velocidad
    (grabación acelerada 4x); no todos los clics o menús son legibles en los
    fotogramas extraídos, por lo que algunos pasos de interfaz se describen a
    partir de lo narrado y de lo visualmente confirmable, sin inventar
    opciones de menú no vistas.
  - El sitio de referencia rediseñado ("The Rider") es un proyecto
    inmobiliario real usado como caso de estudio; no se puede verificar si el
    rediseño mostrado llegó a producción o fue solo un ejercicio de
    portafolio/tutorial.
  - No hay diagramas ni gráficos de datos en el video: la evidencia visual
    consiste en capturas de pantalla de Figma y de sitios web, y en tomas del
    presentador hablando a cámara.

## Tesis central

El diseño editorial de alta calidad en la web no se logra agregando efectos
visuales (sombras, degradados, texturas, bordes, patrones), sino restringiendo
deliberadamente los recursos disponibles a solo cinco elementos: tipografía,
color, grilla, imágenes y espacio en blanco. La estructura y las restricciones
—lejos de limitar la creatividad— la habilitan, de la misma forma en que el
esqueleto permite el movimiento del cuerpo. La composición, el balance, la
jerarquía y el uso del espacio en blanco son lo que separa un diseño premium
de uno amateur, no la cantidad de "trucos visuales" aplicados.

## Mapa temporal de procedencia

Esta línea de tiempo es solo trazabilidad; el método completo se explica en
la sección siguiente, no aquí.

- **00:00–00:31** — Introducción: promesa del video (pasar de un diseño a
  otro aplicando composición editorial) y presentación del creador, Adrian
  Somoza, exlíder de diseño en Media Monks, ahora mentor de diseñadores
  freelance.
- **00:31–01:05** — Primera mención promocional: curso gratuito "Golden
  Canon Grid" con más de 10.000 descargas declaradas. Origen histórico del
  estilo editorial: revistas y libros impresos.
- **01:05–02:06** — Por qué el diseño impreso perfeccionó la composición
  (no se podía "enviar y arreglar después"); aparición de la "contaminación
  visual" en la era digital y en la era de la IA generativa.
- **02:06–03:42** — Enumeración de los cinco elementos del diseño editorial
  (tipografía, color, grilla, imágenes, espacio en blanco) y la metáfora del
  esqueleto/estructura como fuente de libertad creativa.
- **03:42–04:44** — Segunda mención promocional del curso "Golden Canon
  Grid" versión 3.0. Presentación del ejercicio práctico: transformar el
  sitio "The Rider" en un diseño editorial.
- **04:44–06:19** — Paso 1 del proceso: recolectar todos los activos
  (imágenes, logo, textos) e importarlos a Figma.
- **06:19–07:23** — Paso 2: "digerir" el contenido (entender y priorizar el
  texto antes de maquetarlo) y definir el objetivo del sitio (en este caso,
  dirigir a los usuarios a la lista de precios).
- **07:23–08:58** — Paso 3: investigación de referencias visuales (estilo
  suizo/minimalista, mezcla de referencias de distintos medios incluyendo un
  póster no relacionado con la web) y recomendación de revisar referencias 30
  minutos al día.
- **08:58–10:32** — Paso 4: composición inicial del hero, elección de
  imágenes que combinan producto/lugar con personas usándolo ("lifestyle
  images"), creación del CTA.
- **10:32–12:07** — Iteración de layouts: descarte de una primera versión
  por exceso de imágenes, reducción a dos imágenes (una arquitectónica, una
  de estilo de vida), técnica de duplicar el archivo para conservar
  versiones al iterar.
- **12:07–13:42** — Refinamiento de profundidad visual (imagen en primer y
  segundo plano con superposición de texto), ajuste de paleta de color
  (blanco roto, marrón, negro y negro con opacidad reducida), primera
  animación simple en Figma (Smart Animate con disparador por retraso).
- **13:42–14:44** — Pausa y retoma del proyecto en otro momento para evitar
  copiar directamente una referencia vista; nueva iteración de layout con los
  mismos elementos.
- **14:44–16:19** — Paso clave: sistema de espaciado (múltiplos de 10: 10,
  20, 40, 80, 160 píxeles) aplicado de forma consistente; explicación de la
  grilla de 12 columnas con márgenes de 40 píxeles; introducción del concepto
  "pixel perfect".
- **16:19–17:54** — Uso de un modo de fusión ("difference blend mode") para
  crear contraste entre imagen y texto superpuesto; ajuste de tamaño del menú;
  técnica de "branching" (alinear elementos tanto vertical como
  horizontalmente entre sí).
- **17:54–20:02** — Balanceo fino del espacio en blanco alrededor del CTA y
  el párrafo, con tres criterios de posicionamiento: proporciones fijas,
  coincidencia con otra imagen, o relación con la barra de navegación.
  Resultado final del hero con animación básica.
- **20:02–21:04** — Cierre promocional: llamada a descargar el curso
  gratuito "Golden Canon Grid" y a reservar una llamada de estrategia
  uno a uno para el programa de mentoría "Bunk Lab".
- **21:04–21:19** — Despedida ("let's bridge the gap one pixel at a time").

# Método completo de la fuente

## Principio / paso / elemento 1 — Restringir los recursos a cinco elementos

El punto de partida conceptual del video es que un diseño de estilo editorial
se construye deliberadamente con solo cinco elementos, sin excepciones:

1. Tipografía (una o máximo dos familias).
2. Colores (uno o máximo dos, además de los neutros de base).
3. Una grilla simple.
4. Imágenes, dentro de contenedores/cajas claras (no composiciones "sin
   límites" ni inmersivas).
5. Espacio en blanco, usado de forma consciente para guiar la mirada del
   usuario.

> "Editorial layouts are built on three things. Typography, one or two max
> grid, so we'll use a simple one. Colors one or two max. Images. and inside
> clear boxes, not those boundaryless immersive messes, right? And wide space
> and learning how to balance it and use it to guide the user's eye." (02:06)

Traducción: "Los layouts editoriales se construyen con estas cosas:
tipografía, una grilla simple (uno o máximo dos estilos), colores (uno o
máximo dos), imágenes dentro de cajas claras —no esos amasijos inmersivos
sin límites— y espacio amplio, aprendiendo a balancearlo y a usarlo para
guiar la mirada del usuario." (02:06)

El fuente explica que esta restricción no es una limitación creativa sino
una fuente de libertad, mediante la analogía del esqueleto:

> "Think about the bones in your body. If you remove the bones, technically
> you have less limits, right? [...] But without bones, you can't jump, you
> can't run, you can't even stand." (02:38)

Traducción: "Piensa en los huesos de tu cuerpo. Si le quitas los huesos,
técnicamente tienes menos límites [...] Pero sin huesos no puedes saltar, no
puedes correr, ni siquiera puedes pararte." (02:38)

**Regla operativa:** antes de agregar cualquier efecto visual (sombra,
degradado, textura, borde 3D, patrón), verificar si el problema de
composición se puede resolver ajustando tipografía, color, grilla, imágenes o
espacio en blanco. Los efectos decorativos se presentan en el video como un
síntoma de habilidades de layout todavía inmaduras, no como una herramienta
válida del estilo editorial.

## Principio / paso / elemento 2 — Recolectar todos los activos en Figma (paso 1 del proceso)

El primer paso operativo del proceso mostrado es reunir, dentro de un único
archivo de Figma, todos los elementos que se van a usar: imágenes (obtenidas
inspeccionando el sitio original para extraer logo, imagen de héroe, fotos de
producto), y todos los bloques de texto relevantes del sitio de referencia.

> "Basically, the first step I do is I grab all of the assets and put them in
> Figma." (04:44)

Traducción: "Básicamente, el primer paso que hago es tomar todos los activos
y ponerlos en Figma." (04:44)

`frame-20pct.png` y `supplemental-320s.png` muestran el archivo de Figma con
el sitio original "The Rider" (una torre residencial de lujo en Miami) junto
a un panel de propiedades de Figma abierto, confirmando visualmente que el
sitio de referencia se importó como imagen/objeto dentro del lienzo de
diseño.

**Regla operativa:** no empezar a maquetar sin haber centralizado antes todos
los "ingredientes" (textos, imágenes, logo) en el mismo espacio de trabajo.
El video usa explícitamente la metáfora de una receta de cocina: "This is
like grabbing all the ingredients so that you can make the recipe" (05:16).

## Principio / paso / elemento 3 — Digerir el contenido antes de maquetar (paso 2)

"Digerir" el contenido significa separar y comprender qué dice cada bloque de
texto antes de decidir cómo se va a mostrar, en lugar de limitarse a colocar
párrafos con un ancho fijo.

> "It's not about just putting content and putting a width to the paragraph
> and just throwing it there, but rather sifting and understanding the
> content so that I can design for the content and visualize the content."
> (05:48)

Traducción: "No se trata solo de poner el contenido y darle un ancho al
párrafo y tirarlo ahí, sino de filtrar y entender el contenido para poder
diseñar en función del contenido y visualizarlo." (05:48)

Un ejemplo concreto mostrado más adelante en el proceso: el creador identifica
la frase "expected building completion in 2027" dentro del texto original y
decide extraerla, agrandarla y convertirla en un elemento tipográfico
protagonista ("by 2027"), en vez de dejarla enterrada en un párrafo. Esta
técnica de extraer una frase o dato del contenido para volverlo un elemento
visual grande se repite en `frame-45pct.png`, `frame-50pct.png` y
`frame-55pct.png`, donde el texto "Miami Residences" y "By 2027" aparecen en
tipografía de gran tamaño ocupando buena parte del ancho de la pantalla.

**Regla operativa:** identificar, dentro del contenido bruto, qué frase o
dato es lo más relevante para el objetivo del sitio, y diseñar un elemento
tipográfico destacado a partir de eso, en lugar de tratar todo el texto de
forma homogénea.

## Principio / paso / elemento 4 — Definir el objetivo del sitio antes de diseñar (paso 3)

Antes de tomar decisiones de layout, el proceso exige identificar cuál es el
propósito principal del sitio.

> "The next thing... is to define the goal of the website. So in this case,
> what I realized is that the website is pointing people to the price list."
> (06:19)

Traducción: "Lo siguiente [...] es definir el objetivo del sitio web. En
este caso, me di cuenta de que el sitio apunta a que la gente llegue a la
lista de precios." (06:19)

**Regla operativa:** antes de diseñar el layout, declarar explícitamente cuál
es la acción principal que el sitio busca que el usuario realice (en este
caso, ver precios), y usar esa meta como criterio para decidir qué contenido
se jerarquiza visualmente (por ejemplo, el CTA y el llamado a la lista de
precios).

## Principio / paso / elemento 5 — Investigar referencias de forma deliberada y variada (paso 4)

El creador dedica un bloque completo del video a explicar cómo busca
referencias antes de diseñar, incluso teniendo ya un archivo con "miles de
referencias" acumuladas.

> "One thing I recommend is to look at references 30 minutes a day. That way
> you build a visual catalog in your head of designs that exist out there."
> (07:23)

Traducción: "Una cosa que recomiendo es mirar referencias 30 minutos al día.
De esa forma construyes un catálogo visual en tu cabeza de los diseños que
existen." (07:23)

Un matiz importante y explícito del método: no limitarse a referencias de la
misma disciplina. El video muestra, entre las referencias elegidas, un póster
(no un sitio web) de Herman Miller.

> "By the way, notice how I'm grabbing one that is a Herman Miller. This is
> like a poster. So it's not web design [...] I like to reference different
> mediums so that I can get ideas that are not specifically related to web
> design." (07:54–08:26)

Traducción: "Por cierto, noten que estoy tomando una que es de Herman
Miller. Es como un póster, no es diseño web [...] Me gusta referenciar
distintos medios para conseguir ideas que no estén específicamente
relacionadas con el diseño web." (07:54–08:26)

También se explicita que el estilo elegido en este ejercicio es "más suizo o
minimalista" y que se combinan referencias distintas a propósito para no
copiar una sola.

> "Now I like to combine different type of designs so that I don't just
> mimic or replicate one." (07:54)

Traducción: "Me gusta combinar distintos tipos de diseños para no limitarme
a imitar o replicar uno solo." (07:54)

`frame-30pct.png` y `frame-35pct.png` muestran el tablero de referencias
dentro de Figma, con múltiples capturas de sitios y materiales gráficos
alineados en miniatura junto al archivo de trabajo.

**Regla operativa:** construir un hábito diario de revisión de referencias
(no solo cuando se necesita un proyecto), y al recolectar referencias para un
proyecto puntual, incluir deliberadamente al menos una fuera del propio
medio (por ejemplo, un póster impreso para un proyecto web) para evitar la
imitación directa de un solo sitio existente.

## Principio / paso / elemento 6 — Elegir imágenes que cuenten una historia (lifestyle images)

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

## Principio / paso / elemento 7 — Iterar duplicando versiones y probando múltiples layouts

El creador insiste en que, con los mismos elementos, existen literalmente
"miles" de layouts posibles, y en la importancia de conservar versiones
anteriores mientras se itera.

> "There's 1,000 layouts that you can create with the same elements. Okay,
> when you're starting out, it's difficult to know that there's so many
> possibilities, but as you progress [...] just duplicate it. So, you save
> the copy of what you have done and keep iterating." (10:32–11:34)

Traducción: "Hay 1000 layouts que podés crear con los mismos elementos.
Cuando estás empezando es difícil saber que existen tantas posibilidades,
pero a medida que avanzás [...] simplemente duplicalo. Así guardás una copia
de lo que hiciste y seguís iterando." (10:32–11:34)

Un ejemplo narrado de descarte: una primera composición se abandonó por tener
demasiadas imágenes ("that's too many images... I'm just going to use two"),
reduciendo el diseño a exactamente dos imágenes (una arquitectónica y una de
estilo de vida).

**Regla operativa:** al iterar un layout, duplicar el archivo o el marco
antes de introducir cambios grandes, para conservar un historial de
versiones navegable; si una composición se satura visualmente (por ejemplo,
demasiadas imágenes), reducir deliberadamente los elementos en lugar de
intentar acomodarlos todos.

## Principio / paso / elemento 8 — Crear profundidad y paleta de color acotada

El creador introduce profundidad visual colocando una imagen en primer plano
y otra en segundo plano, con texto superpuesto entre ambas capas, y define
una paleta de color reducida y deliberada.

> "Now I'm placing one in the background, one in the foreground of the text,
> and I'm creating this depth [...] I liked brown [...] there's an off-white
> in the background. There's a brown as the main color. And there's also
> like a a dark black and there's also this kind of lower opacity black."
> (11:34–12:39)

Traducción: "Estoy colocando una imagen en el fondo y otra en primer plano
respecto al texto, y así creo esta profundidad [...] Me gustó el marrón [...]
hay un blanco roto de fondo, un marrón como color principal, un negro oscuro
y también un negro con opacidad más baja." (11:34–12:39)

`frame-55pct.png` y `frame-60pct.png` confirman visualmente esta paleta: un
fondo color hueso/beige, tipografía en tonos marrones/terracota, y bloques
oscuros usados como contraste puntual.

**Regla operativa:** definir la paleta final con no más de cuatro valores de
color efectivos (un neutro claro de fondo, un color principal de acento, y
uno o dos neutros oscuros con distinta opacidad), y usar la superposición de
capas de imagen con texto intermedio como recurso deliberado de profundidad,
no como accidente de maquetación.

## Principio / paso / elemento 9 — Retomar el proyecto sin copiar directamente una referencia vista

Un matiz ético/profesional del método: tras ver una referencia específica que
le gustó, el creador evita replicarla directamente al retomar el proyecto en
otra sesión, para no producir una copia reconocible.

> "I don't want to just copy something [...] that I've seen because I know
> how to do better and [...] I don't want people to think oh like you're
> copying. So what I did is like basically started playing around with the
> layout with the same elements that I had." (13:42–14:13)

Traducción: "No quiero simplemente copiar algo [...] que vi, porque sé cómo
hacerlo mejor y [...] no quiero que la gente piense que estoy copiando.
Entonces lo que hice fue básicamente empezar a jugar con el layout usando los
mismos elementos que ya tenía." (13:42–14:13)

**Regla operativa:** si una sesión de trabajo produjo una composición
demasiado cercana a una referencia puntual, no continuar directamente sobre
ella; volver a trabajar el layout con los mismos elementos base pero sin la
referencia específica a la vista, para forzar una solución propia.

## Principio / paso / elemento 10 — Sistema de espaciado consistente en múltiplos fijos

Este es el paso más técnico y verificable del método: el uso de un sistema de
espaciado con valores fijos y predecibles.

> "What I do is I create a spacing system. Okay. So, usually it's 20 pixels,
> 40 pixels, 80 and 160. And sometimes you can use 10 pixels [...] whenever
> I'm placing an element, I'm making sure that I'm using one of those sizes."
> (14:44–15:16)

Traducción: "Lo que hago es crear un sistema de espaciado. Normalmente es
20, 40, 80 y 160 píxeles. A veces uso 10 píxeles [...] cada vez que coloco un
elemento, me aseguro de usar uno de esos valores." (14:44–15:16)

`frame-70pct.png` muestra, superpuestos sobre el diseño, pequeños indicadores
numéricos en rojo junto a las imágenes, consistentes con mediciones de
espaciado activadas en Figma (plugin o modo de medición) mientras se explica
el sistema.

**Regla operativa:** definir de antemano una escala de espaciado cerrada
(por ejemplo 10 / 20 / 40 / 80 / 160 px) y usar exclusivamente esos valores
para separaciones entre elementos, márgenes y paddings, evitando valores
arbitrarios como 37px o 53px.

## Principio / paso / elemento 11 — Grilla de columnas con márgenes fijos

El creador confirma explícitamente la estructura de grilla usada en todo el
ejercicio.

> "I'm using a 12 column grid like you've seen [...] this is a regular 12
> column grid with 40 pixel margins on both sides." (15:16–15:46)

Traducción: "Estoy usando una grilla de 12 columnas, como ya vieron [...]
es una grilla regular de 12 columnas con márgenes de 40 píxeles a ambos
lados." (15:16–15:46)

**Regla operativa:** para layouts editoriales de este tipo, partir de una
grilla de 12 columnas con márgenes laterales fijos de 40 píxeles (en
resoluciones de escritorio), y alinear cada bloque de contenido a los límites
de columna de esa grilla en lugar de posicionarlo libremente.

## Principio / paso / elemento 12 — Precisión "pixel perfect" y alineación cruzada ("branching")

El video insiste en un estándar de precisión al píxel, y describe una técnica
propia a la que llama "branching": alinear elementos no solo verticalmente
sino también horizontalmente entre sí, de modo que distintos bloques
coincidan en más de un eje.

> "If it's one pixel off, it's not pixel perfect. Senior designers go pixel
> perfect on the layout." (15:46–16:19)

Traducción: "Si está corrido un solo píxel, no es 'pixel perfect'. Los
diseñadores senior llevan el layout a precisión de píxel." (15:46–16:19)

> "I not only align elements vertically but I also align them horizontally.
> Okay? So that I make sure that there's elements aligned in this way and in
> this way so everything starts to match together." (17:22–17:54)

Traducción: "No solo alineo elementos verticalmente, también los alineo
horizontalmente, para asegurarme de que hay elementos alineados en un
sentido y en el otro, de modo que todo empiece a encajar." (17:22–17:54)

Ejemplo concreto narrado: el menú de navegación se redujo de 50 a algo
alineado a 80 píxeles de separación del logo, y una imagen que no coincidía
con esa marca de 80 píxeles se desplazó hacia abajo para coincidir con la
barra de navegación.

**Regla operativa:** verificar la alineación de cada elemento nuevo tanto en
el eje vertical como en el horizontal contra los elementos ya colocados, no
solo contra la grilla; si un elemento no coincide con una medida de
referencia ya establecida (por ejemplo, la distancia del menú al logo),
ajustar su posición para que coincida, en lugar de dejarlo "casi alineado".

## Principio / paso / elemento 13 — Uso de un modo de fusión para crear contraste imagen/texto

Se describe explícitamente el uso de un modo de fusión de tipo "diferencia"
para lograr que el texto superpuesto sobre una imagen mantenga contraste
legible.

> "Then I tried doing this difference, right, with a blending mode because I
> wanted to create some kind of a contrast between the images and the text
> for the overlap." (16:19–16:50)

Traducción: "Después probé aplicar esta 'diferencia' con un modo de fusión,
porque quería crear una especie de contraste entre las imágenes y el texto
para la superposición." (16:19–16:50)

`supplemental-1010s.png` corresponde a este tramo del proceso y muestra el
texto grande "Miami Residences" superpuesto sobre una imagen, con un efecto
de mezcla visible entre el color del texto y el de la imagen subyacente.

**Regla operativa:** cuando un texto grande debe superponerse a una imagen
fotográfica, evaluar el uso de un modo de fusión (por ejemplo, "diferencia")
en lugar de solo un color plano u overlay oscuro, para preservar textura de
la imagen manteniendo legibilidad.

## Principio / paso / elemento 14 — Tres criterios para balancear espacio en blanco alrededor de un bloque

Para decidir dónde ubicar un bloque de texto y CTA respecto al resto del
layout, el video ofrece explícitamente tres criterios alternativos de
posicionamiento, con el ejemplo final aplicado.

> "So you could either go like that [...] Another way to find a placement is
> to say, okay, I'm going to make it match with the second image [...] And
> the other way to place this element is relative to the navigation." (18:57–19:29)

Traducción: "Podés hacerlo así [con proporciones fijas] [...] Otra forma de
encontrar la ubicación es decir 'voy a hacer que coincida con la segunda
imagen' [...] Y la otra forma de ubicar este elemento es relativa a la
navegación." (18:57–19:29)

La solución final aplicada combina espaciado fijo con relación a la
navegación:

> "I'm moving it as a whole thing as an organism and I'm putting it at 40
> pixels from the margin and then at 80 pixels from the nav [...] there's 80
> pixels above the nav and 80 pixels below the nav. Okay. And there's 40
> pixel margin in the whole hero." (19:29–20:02)

Traducción: "Lo muevo como un solo bloque, como un organismo, y lo coloco a
40 píxeles del margen y a 80 píxeles de la barra de navegación [...] hay 80
píxeles arriba de la navegación y 80 píxeles debajo. Y hay un margen de 40
píxeles en todo el hero." (19:29–20:02)

**Regla operativa:** para posicionar un bloque compuesto (por ejemplo,
párrafo + CTA), evaluar tres estrategias antes de decidir: (1) proporciones
fijas de espaciado interno, (2) alineación con otro elemento visual de
referencia (como una imagen), y (3) distancia relativa a un elemento
estructural fijo (como la barra de navegación); mover el bloque como una
unidad ("organismo"), no sus partes por separado.

# Demostraciones y ejemplos visibles

- `frame-05pct.png` — El presentador sostiene físicamente una revista
  impresa abierta con un anuncio de IKEA, usada como ejemplo tangible del
  origen del estilo editorial en medios impresos (mencionado en 00:31).
- `frame-20pct.png` — Pantalla promocional de "Golden Canon Grid Course"
  con estadísticas de "lo que dicen los estudiantes" y capturas de reseñas;
  contenido claramente promocional, no parte del método transferible.
- `frame-25pct.png` y `supplemental-320s.png` — El archivo de Figma con el
  sitio original "The Rider" (torre residencial en Miami) importado como
  imagen de referencia, junto con paneles de propiedades de Figma abiertos.
- `frame-30pct.png` y `frame-35pct.png` — Tablero de referencias visuales
  con múltiples capturas de sitios y materiales gráficos organizados en
  miniatura, correspondiente al paso de investigación de referencias
  (07:23–08:58).
- `frame-40pct.png`, `frame-45pct.png` — Composiciones intermedias del
  rediseño mostrando el texto "Miami Residences" combinado con imágenes de
  producto/lifestyle y el logotipo de marca "B—Line".
- `frame-50pct.png`, `frame-55pct.png` — Iteraciones del hero final con
  tipografía "Miami Residences / By 2027" en gran tamaño, confirmando
  visualmente la técnica de "digerir contenido" (elemento 3).
- `frame-70pct.png` — Superposición de indicadores numéricos en rojo sobre
  el diseño, consistente con una herramienta de medición de espaciado activa
  mientras se explica el sistema de 10/20/40/80/160 píxeles (elemento 10).
- `supplemental-770s.png` — Versión casi final del sitio con navegación
  "About / Gallery / Amenities / Price list" visible, confirmando que el
  objetivo declarado del sitio (dirigir a la lista de precios, elemento 4)
  se refleja en la estructura de navegación del rediseño.
- `supplemental-965s.png` y `supplemental-1010s.png` — Estados sucesivos del
  hero mostrando el ajuste de alineación y el modo de fusión "diferencia"
  entre texto e imagen (elementos 12 y 13).
- `supplemental-20s.png` — Vista final del hero con el texto "MiamiResidences"
  a pantalla completa, correspondiente al resultado mostrado como cierre del
  proceso de diseño.

Estas imágenes confirman visualmente que el proceso narrado ocurrió dentro de
Figma sobre un caso real de sitio inmobiliario, y que el resultado final
adopta la paleta, tipografía y estructura de espaciado descritas en la
transcripción. Ninguna de estas capturas demuestra que el rediseño se haya
publicado o implementado en producción: son evidencia de un ejercicio de
diseño en Figma, no de un despliegue web real.

# Flujo integrado para el agente

Un agente que deba aplicar este método a un proyecto de diseño web debería
seguir esta secuencia, replicando los pasos mostrados en el video:

1. Reunir todos los activos del sitio o marca a rediseñar (imágenes, logo,
   textos) en un único archivo de trabajo (Figma o equivalente).
2. Leer y "digerir" todo el contenido textual: identificar qué frases o
   datos merecen convertirse en elementos tipográficos destacados.
3. Declarar explícitamente el objetivo principal del sitio (la acción que se
   quiere que el usuario realice) antes de diseñar cualquier layout.
4. Reunir referencias visuales variadas, incluyendo al menos una fuera del
   propio medio (por ejemplo, un póster impreso si el proyecto es web), y
   evitar apoyarse en una sola referencia.
5. Restringir el kit de diseño a cinco elementos: una o dos tipografías, uno
   o dos colores de acento (más neutros), una grilla simple, imágenes dentro
   de contenedores definidos, y espacio en blanco.
6. Seleccionar imágenes que combinen el producto/lugar en sí con personas
   usándolo, cuando el objetivo sea contar una historia de uso.
7. Iterar el layout duplicando versiones antes de cambios grandes; si una
   composición se satura, reducir elementos en lugar de acomodarlos todos.
8. Introducir profundidad visual con capas de imagen en primer y segundo
   plano cuando corresponda, manteniendo la paleta de color acotada definida
   en el paso 5.
9. Si una sesión produjo un resultado demasiado cercano a una referencia
   puntual, retomar el trabajo sin esa referencia a la vista.
10. Definir y aplicar consistentemente un sistema de espaciado en múltiplos
    fijos (por ejemplo 10/20/40/80/160 px) y una grilla de columnas con
    márgenes fijos (por ejemplo 12 columnas, 40 px de margen).
11. Verificar alineación cruzada (vertical y horizontal) de cada elemento
    nuevo contra los elementos ya posicionados, no solo contra la grilla.
12. Cuando haya texto superpuesto a imágenes, evaluar modos de fusión (por
    ejemplo "diferencia") en vez de overlays planos, para mantener contraste
    sin perder textura.
13. Posicionar bloques compuestos como unidades, eligiendo entre proporción
    fija, alineación con otro elemento o distancia a un elemento estructural
    de referencia.
14. Antes de entregar el diseño, revisar precisión al píxel en cada bloque
    (¿coincide exactamente con la grilla y con los demás elementos, o está
    "casi" alineado?).
15. Separar cualquier contenido promocional (cursos, mentorías, enlaces de
    descarga) del método transferible; no incluirlo como paso del proceso de
    diseño.

# Reglas operativas

- No agregar sombras, degradados, texturas 3D, bordes decorativos ni
  patrones como solución por defecto a un problema de composición; primero
  intentar resolverlo con tipografía, color, grilla, imágenes o espacio en
  blanco.
- Limitar la paleta a un máximo de dos colores de acento más neutros (fondo
  claro, negro/oscuro con distintas opacidades).
- Limitar la tipografía a una o dos familias.
- Usar una escala de espaciado cerrada y no valores arbitrarios.
- Alinear cada elemento tanto vertical como horizontalmente contra los
  elementos vecinos, no solo contra la grilla base.
- Declarar el objetivo del sitio antes de diseñar el layout y usarlo para
  priorizar visualmente el contenido relacionado con ese objetivo.
- No presentar contenido promocional (cursos, mentorías) como parte de los
  pasos técnicos del método.
- No afirmar que el rediseño mostrado está en producción: es un ejercicio de
  portafolio/tutorial sobre un caso real, no una entrega confirmada al
  cliente.
- Tratar el tiempo de producción declarado ("1 h 30 min") como una
  afirmación no verificada del creador, útil como referencia orientativa,
  no como benchmark validado.

# Antipatrones

- Añadir efectos visuales decorativos para "salvar" una composición débil en
  lugar de corregir tipografía, color, grilla, imágenes o espacio en blanco.
- Usar imágenes "sin límites" o composiciones inmersivas sin contenedores
  claros, contradiciendo explícitamente el criterio de "cajas claras" del
  video (02:06).
- Maquetar párrafos asignándoles solo un ancho fijo sin antes comprender ni
  priorizar el contenido ("digerirlo").
- Diseñar sin haber declarado antes el objetivo del sitio.
- Apoyarse en una sola referencia visual y replicarla de forma reconocible.
- Usar valores de espaciado y márgenes arbitrarios en lugar de una escala
  fija.
- Alinear elementos solo en un eje (por ejemplo, solo verticalmente) y dar
  por cerrado el layout.
- Mezclar contenido promocional (cursos, mentorías) dentro de la explicación
  del método de diseño, presentándolo como un paso técnico necesario.
- Afirmar que una demostración de Figma implica un sitio en producción o una
  integración funcional real.

# Criterios de aceptación

- El layout resultante puede describirse completamente usando solo cinco
  categorías de decisión: tipografía, color, grilla, imágenes, espacio en
  blanco (sin mencionar sombras, degradados ni texturas como parte de la
  solución).
- Existe un objetivo de sitio declarado explícitamente antes del diseño, y
  el contenido jerárquicamente más destacado se relaciona con ese objetivo.
- Los espaciados y márgenes usados en el layout final son múltiplos de una
  escala fija predefinida (por ejemplo, todos múltiplos de 10 px).
- Los elementos del layout están alineados simultáneamente en, al menos, un
  eje vertical y un eje horizontal compartido con otros elementos.
- Si el contenido incluye imágenes de producto/lugar, al menos una de ellas
  muestra personas usando ese producto/lugar (cuando el objetivo del
  proyecto se beneficie de narrativa de uso).
- El contenido promocional (cursos, mentorías, enlaces de venta) está
  claramente separado o ausente de la explicación del método.
- Ninguna afirmación sobre resultados de negocio, tiempos de producción o
  cifras de audiencia se presenta como un hecho verificado sin indicar que
  proviene únicamente del testimonio del creador.

# Rúbrica de evaluación

Escala 0–3 por dimensión (0 = ausente, 1 = insuficiente, 2 = aceptable,
3 = ejemplar):

1. **Restricción de elementos** — ¿el layout se explica completamente con
   tipografía, color, grilla, imágenes y espacio en blanco, sin depender de
   efectos decorativos?
2. **Claridad de objetivo** — ¿hay un objetivo del sitio declarado y
   reflejado en la jerarquía visual?
3. **Sistema de espaciado y grilla** — ¿los valores de espaciado y márgenes
   siguen una escala fija y una grilla de columnas consistente?
4. **Alineación cruzada** — ¿los elementos coinciden en más de un eje entre
   sí, no solo respecto a la grilla?
5. **Narrativa de imágenes** — cuando aplica, ¿se combinan imágenes de
   producto/lugar con imágenes de uso humano?
6. **Separación de evidencia** — ¿el contenido promocional y las
   afirmaciones no verificadas están claramente diferenciados del método
   técnico?

Puntaje mínimo aceptable: 2/3 en cada una de las dimensiones 1 a 4. Un
puntaje de 0 o 1 en la dimensión 6 (separación de evidencia) bloquea la
aceptación del resultado, independientemente del resto de puntajes.

# Resumen compacto

El video "How I design websites with EDITORIAL style layouts (part 1)" (BONT,
Adrian Somoza, DU6vjWnH2p0, 21:19) enseña un método de diseño web inspirado
en el diseño editorial impreso: restringir el trabajo a cinco elementos
(tipografía, color, grilla, imágenes, espacio en blanco), reunir y "digerir"
el contenido antes de maquetar, declarar el objetivo del sitio, investigar
referencias variadas, iterar duplicando versiones, aplicar un sistema de
espaciado en múltiplos fijos sobre una grilla de 12 columnas, alinear cada
elemento vertical y horizontalmente contra los demás ("branching"), y usar
modos de fusión para mantener contraste entre texto e imágenes. El caso
práctico es el rediseño del sitio inmobiliario "The Rider" en un ejercicio
de portafolio en Figma, sin evidencia de que haya llegado a producción. El
video incluye contenido promocional (curso "Golden Canon Grid" y mentoría
"Bunk Lab") que debe tratarse como provenance/sesgo declarado y no como parte
del método técnico transferible.

## Extensiones profesionales (no atribuidas al video)

Las siguientes recomendaciones no provienen del video; se agregan como buena
práctica profesional y deben marcarse siempre como extensión, no como parte
del método original:

- **Accesibilidad:** verificar contraste de color suficiente (WCAG AA como
  mínimo) entre texto y fondo, especialmente al usar modos de fusión tipo
  "diferencia" sobre imágenes fotográficas, que pueden reducir el contraste
  en zonas específicas de la imagen.
- **Responsividad:** validar que la grilla de 12 columnas con márgenes fijos
  de 40 px se adapte a anchos de pantalla móviles, redefiniendo el número de
  columnas y los márgenes en breakpoints menores.
- **Rendimiento:** optimizar el peso de las imágenes "lifestyle" de alta
  resolución usadas en el hero, mediante formatos modernos (WebP/AVIF) y
  carga diferida, dado que el video no aborda rendimiento de carga.
- **Uso de referencias y licencias:** confirmar que las imágenes y
  materiales usados como referencia o activos finales cuenten con licencia
  de uso adecuada antes de publicar un sitio real, ya que el video no
  aclara el origen legal de las fotografías utilizadas en el caso "The
  Rider".
- **Movimiento reducido:** si la animación de entrada mostrada (Smart
  Animate con retraso) se implementa en producción, respetar la preferencia
  de sistema `prefers-reduced-motion` para usuarios sensibles al movimiento,
  algo que el video no menciona.
- **Autorización del cliente:** al usar un proyecto real de un tercero (como
  "The Rider") como caso de estudio o portafolio, confirmar autorización
  explícita del propietario de la marca antes de publicar el rediseño
  públicamente.
- **Transparencia comercial:** cuando se promocionen productos propios
  (cursos, mentorías) dentro de contenido educativo, declarar explícitamente
  que se trata de una oferta comercial, evitando presentar cifras de
  "estudiantes" o "descargas" sin fuente verificable.

[S78]

### Contexto para agente — This Video Will Take You From Junior to Senior UX/UI Designer

# Autonomous context for an agent

## Purpose

This package lets another agent reconstruct, without watching the source
video, a complete set of UI/UX redesign case studies presented by the channel
**uxpeak**. The video walks through three unrelated product scenarios — a
sleep-tracking mobile app, a banking money-transfer flow, and an onboarding
job-role question — and for each one contrasts a "junior designer" solution
against progressively more senior solutions. The purpose of the source video
is educational/persuasive: it teaches UI decision-making heuristics through
before/after comparisons, while also promoting the creator's paid products
(a "UI/UX Playbook" and a "UX/UI Design Mastery" course).

## Evidence and limits

- **Transcript source**: no manual subtitles existed for this video. The
  package uses YouTube's automatic captions track marked `en-orig` (the
  original-language automatic track), converted to a clean transcript with
  `vtt-to-clean-transcript.py`. Result: 2,692 words across 32 segments,
  covering the full runtime from 00:00 to 16:11, consistent with a duration
  of 1,002 seconds (~16:42) and a speaking pace of roughly 160 words per
  minute — plausible for a narrated voiceover.
- **Visual source**: 20 frames sampled uniformly at 0%, 5%, 10%, …, 95% of
  the runtime, plus 6 supplemental frames added at specific timestamps
  located through the transcript (15s, 533s, 908s, 930s, 980s, 993s). All 26
  images were opened and inspected directly with the `Read` tool; none of
  the claims below rely on file names or counts alone.
- **No visible on-camera presenter**: every uniform and supplemental frame
  shows either a mobile-app mockup, a UI-kit detail callout, a promotional
  screenshot, or an abstract motion-graphic transition. The video appears to
  be a voiceover-driven motion-graphics piece, not a talking-head recording.
  This package therefore cannot describe a presenter's appearance or
  delivery style, only the on-screen UI artifacts and the narration.
- **Frame 00pct is a black frame** (intro fade-in) and **frame 05pct** shows
  an abstract circular "53%" loading/progress graphic that is part of the
  video's own opening motion graphic, not a product UI. Both are recorded as
  evidence of the intro sequence, not of any app being designed.
- **The discount-code claim is audio-only.** The narration states "use code
  awesome50 to get 50% off" near 16:32, but the frame sampled near that
  timestamp (993s) shows only an abstract closing animation with no legible
  on-screen text confirming the code. This claim is recorded as **fuente
  directa (audio), sin confirmación visual**.
- **Reviews shown on screen are unverified third-party testimonials.** The
  frame at 55% (~551s / 09:11) shows a screenshot of a reviews page for the
  "UX/UI Playbook" product with five-star ratings and written comments. This
  package treats those reviews as promotional material shown by the creator,
  not as independently verified claims.
- **The "basic layout with two buttons" junior transfer-screen design**
  (described in narration around 09:55–10:26) was not captured by any of
  the 20 uniform or 6 supplemental frames. It is recorded as a **fuente
  directa sin confirmación visual**.
- This package does not evaluate whether the designs shown would actually
  perform better with real users; it documents what the video claims and
  what its mockups show, distinguishing claims from confirmed visuals
  throughout.

## Tesis central

Moving from a junior to a senior UX/UI designer mindset is less about
learning new visual styles and more about applying a repeatable set of
decision heuristics to any interface: personalize and simplify copy,
establish visual hierarchy around the user's primary task, reduce
interaction cost by removing redundant steps, replace manual data entry with
recognition-based selection wherever possible, give immediate and specific
feedback after every input, and design for the user's context (mobile
ergonomics, multiple accounts, multiple currencies). The video demonstrates
this thesis through three unrelated redesign case studies rather than
through abstract principles alone.

## Mapa temporal de procedencia

This map is provenance only; every principle below is explained in full in
its own section regardless of timestamp.

| Time | Content |
|---|---|
| 00:00–00:32 | Hook: designers who "seem to dominate" get admiration and likes; promise of "cheat codes" senior designers know. Visual: portfolio page with a 3D product render and admiring comments (supplemental-15s.png). |
| 00:32–01:04 | Framing of the lesson and the first scenario: a sleep-tracking app for a persona named Emily. |
| 01:04–02:07 | Junior design of the sleep question screen: plain radio-button list (frame-10pct.png, frame-15pct.png). |
| 02:07–02:40 | Critique: functional but unlikely to "delight" or engage the user. |
| 02:40–03:11 | Senior revision #1: personalized greeting ("Hi Emily") and conversational title change (frame-20pct.png, frame-25pct.png). |
| 03:11–03:42 | Visual hierarchy: hours emphasized over quality label. |
| 03:42–04:13 | F-pattern placement of controls on the left; emoji added per option (frame-20pct.png shows the emoji list). |
| 04:13–04:45 | Emojis reinforce emotional meaning of more vs. less sleep. |
| 04:45–05:15 | Distinct selected state (larger emoji, color change) plus system feedback (frame-40pct.png, frame-50pct.png labelled "C"). |
| 05:15–05:46 | Senior revision #2: curved slider replacing the list (visual concept described in narration; consistent with frame-45pct.png's slider control). |
| 05:46–06:17 | Swipe interaction, enlarged selected state. |
| 06:17–06:47 | Senior revision #3: selected emoji centered and enlarged with motivational copy ("Aim for 8+ hours...") (frame-40pct.png). |
| 06:47–07:18 | Real-time dynamic feedback as the user changes selection. |
| 07:18–07:50 | Senior revision #4: slider added below the centered emoji, comparing to the previous night ("1 hour above last week's average") (frame-45pct.png). |
| 07:50–08:22 | Closing comparison of the four sleep-app options (frame-90pct.png shows three variants side by side). |
| 08:22–08:53 | Call to action: comment which option (A/B/C/D) viewers prefer. |
| 08:53–09:25 | Promotion: "UI UX Playbook", 100+ tips, five-star reviews from 10,000+ people (frame-55pct.png, reviews screenshot). |
| 09:25–09:55 | Transition to the second scenario: a banking app transfer flow; mention of a "full tutorial" in a paid course. |
| 09:55–10:26 | Junior transfer-screen design described as "two buttons and redundant text" (no frame captured; narration only). |
| 10:26–10:58 | Senior revision: recent-recipients list plus search bar replacing the extra button (frame-65pct.png). |
| 10:58–11:29 | Principle named explicitly: "interaction cost", tied again to the Playbook product. |
| 11:29–12:00 | Junior currency design: two separate fields for currency and amount (frame-70pct.png). |
| 12:00–12:32 | Senior revision: amount field enlarged and primary; currency selector tucked into the corner of the amount field (frame-75pct.png). |
| 12:32–13:03 | Senior addition: recipient profile photo/icon for recognition over recall (frame-80pct.png, frame-60pct.png show recipient avatars). |
| 13:03–13:35 | Addition of a "new balance" line after the transfer amount (frame-80pct.png). |
| 13:35–14:05 | Scenario extension: users with multiple accounts (business, personal, joint). |
| 14:05–14:36 | Senior solution: show sender and recipient accounts together during the transaction (frame-85pct.png, frame-90pct.png). |
| 14:36–15:08 | Reflection on the senior designer's broader role: empathy, context, real problems. |
| 15:08–15:40 | Third scenario: onboarding screen asking for job title. Junior design: free-text input field (supplemental-930s.png). |
| 15:40–16:11 | Senior revision: tappable list of common job titles with icons plus an "Other" option (frame-95pct.png). |
| 16:11–16:42 | Closing call to action, and a promotional discount code ("awesome50") mentioned only in narration, not shown legibly on screen. |

# Método completo de la fuente

## Principio 1 — Personalize and simplify microcopy

**La fuente afirma**: replacing a generic instruction ("How long would you
say you slept yesterday?") with a personalized, conversational greeting
("Hi Emily, how long did you sleep last night?") makes users "feel
recognized" and increases engagement, and conversational phrasing reduces
friction because it is easier to process than formal phrasing.

**La demostración muestra**: `frame-10pct.png` and `frame-15pct.png` show the
plain, impersonal version ("How long would you say you slept yesterday?"
with a five-option radio list). `frame-20pct.png` and `frame-25pct.png` show
the revised version with "Hi Emily, how long did you sleep last night?" as
the title, plus a per-screen step indicator ("Sleep tracking, 1 of 4").

**Regla accionable**: when a form or question addresses a known user by
name, use that name in the primary heading rather than a generic prompt.
Prefer natural, spoken-register phrasing over formal survey language for
the same question.

**Antipatrón**: keeping impersonal, formal question wording when the
product already has the user's identity available, or personalizing a
title without also simplifying its phrasing (personalization alone is not
sufient per the source).

**Criterio de aceptación**: the heading of a personalized screen contains
the user's name or an equivalent direct address, and its wording matches
how a person would ask the question conversationally, not a survey label.

## Principio 2 — Establish visual hierarchy around the primary task

**La fuente afirma**: in the junior version, the qualitative state labels
("Great", "Good", "Neutral", "Poor", "Bad") were visually more prominent
than the actual sleep-hour ranges, even though the numeric hours are the
data the product actually needs first. The senior revision shifts the
emphasis so the hours are the dominant text and the qualitative label
becomes secondary, "so that users focus on inputting the correct number of
hours first before reflecting on the quality."

**La demostración muestra**: `frame-10pct.png` shows "Great / 8-9 hours"
with the state word in bold and the hour range in smaller, secondary type.
`frame-20pct.png` shows the revised list where hour counts ("7 hours",
"6 hours") are the bold, primary text and the qualitative word ("Good",
"Neutral") appears as a secondary caption beneath it.

**Regla accionable**: identify the single data point the interface most
needs from the user, and make that value the visually dominant element
(largest, boldest, or first-read) on the screen; treat derived or
qualitative labels as secondary supporting text.

**Antipatrón**: giving equal or greater visual weight to a derived/label
value than to the primary data value the screen exists to capture.

**Criterio de aceptación**: on the redesigned screen, the primary data value
(hours) has greater font weight/size than the qualitative label, and this
can be confirmed by direct visual comparison of the two versions.

## Principio 3 — Follow natural reading order for controls (F-pattern)

**La fuente afirma**: placing the interactive controls (radio buttons) on
the left side aligns with the F-pattern and the natural reading order users
are accustomed to, letting them "quickly and intuitively make their
selection without unnecessary eye movement or cognitive load."

**La demostración muestra**: `frame-20pct.png` shows radio selectors
positioned at the left edge of each row, with the emoji and label text to
their right.

**Regla accionable**: place the primary interactive control (selector,
checkbox, radio) at the start of the reading direction (left edge in
left-to-right languages), with supporting content flowing after it.

**Antipatrón**: placing selection controls at the trailing edge of a row
when the interface is otherwise scanned start-to-end, forcing extra eye
travel per row.

**Criterio de aceptación**: interactive selectors are visually aligned to
the leading edge of their row in the confirmed frame.

## Principio 4 — Use emoji/iconography to reinforce meaning emotionally

**La fuente afirma**: adding emojis next to each sleep option makes the
experience "more fun and relatable," lets users "instantly understand what
each option represents," and reinforces the idea that more sleep leads to
better outcomes (a happy emoji tied to longer sleep, an upset emoji to
shorter sleep).

**La demostración muestra**: `frame-20pct.png` and `frame-25pct.png` show a
heart-eyes emoji next to "≥8 hours / Great" and a red angry-face emoji next
to "≤4 hours / Bad", with intermediate emotional states in between.

**Extensión profesional**: icon/emoji-based feedback should still pass
color-and-shape accessibility checks (not relying on color alone to convey
meaning) and should degrade gracefully for users with assistive
technologies that may not render emoji consistently.

**Regla accionable**: when a scale has emotional or qualitative meaning
(quality, mood, severity), pair each option with a distinct icon or emoji
whose valence matches the underlying meaning, not just decorative variety.

**Antipatrón**: using emoji or icons that are decorative only and do not
map consistently to the underlying value scale (e.g., random assignment).

**Criterio de aceptación**: each option on the scale has a unique icon/emoji
whose emotional valence increases or decreases monotonically with the
underlying value, confirmed by inspecting the option set.

## Principio 5 — Make the selected state visually distinct with feedback

**La fuente afirma**: the senior version made the selected state "much more
distinct by changing the text color and making the Emoji larger for the
selected option," and this "system feedback" lets users know their input
was registered, providing "a satisfying responsive interaction."

**La demostración muestra**: `frame-40pct.png` shows a large, centered
smiley emoji with the caption "Your sleep was good! Aim for 8+ hours of
sleep for the best rest." beneath it, and a strip of smaller emoji options
below with the current one highlighted. `frame-50pct.png` (labelled "C" in
the source, suggesting it is presented as one of several lettered options)
shows the same layout in a full phone mockup.

**Regla accionable**: after any selection, immediately show a
visually-enlarged and recolored confirmation of that specific choice, plus
a short contextual message that responds to the value selected (not a
generic "saved" message).

**Antipatrón**: relying only on a static checkmark or radio-fill to
indicate selection, with no size/color change and no contextual response
text.

**Criterio de aceptación**: the confirmed frame shows the selected option
rendered larger and in a different color/treatment than unselected options,
accompanied by response text tailored to that specific value.

## Principio 6 — Escalate interaction fidelity to match the fun/engagement goal

**La fuente afirma**: the source presents an explicit ladder of interaction
models for the same sleep-input task — (1) tap a radio button in a list,
(2) swipe through a curved slider of options, (3) view a centered emoji that
updates with a message, (4) drag a slider beneath a centered emoji that
also compares to the prior week's average. Swiping "feels natural on mobile
devices," and the slider version lets Emily "see that she slept 2 hours
more than the night before," which "adds a layer of personalization."

**La demostración muestra**: `frame-45pct.png` shows the most advanced
version: a centered face emoji, the text "Your sleep was OK! 1 hour above
last week's average!", and a horizontal slider control beneath it with hour
labels from "≤4h" to "≥8h". `frame-90pct.png` shows three of the variants
side by side for direct visual comparison, each retaining a numeric keypad
below.

**Regla accionable**: when a data-entry task is repeated frequently (daily
logging, habit tracking), evaluate whether a more direct manipulation
interaction (slider, swipe, drag) can replace a static list, and pair it
with comparative feedback (e.g., versus a prior period) to increase
perceived personalization.

**Antipatrón**: adding interaction fidelity (sliders, animations) without
also adding meaningful, personalized feedback tied to the new interaction —
motion for its own sake does not fulfill this principle in the source's own
terms.

**Criterio de aceptación**: the highest-fidelity variant confirmed in frames
combines a direct-manipulation control with dynamic, comparison-based
feedback text.

**Extensión profesional**: any slider or swipe-based control must also
support keyboard and screen-reader equivalents (e.g., an accessible
numeric input or explicit ARIA slider roles with arrow-key support) and
must respect the user's reduced-motion preference for any accompanying
animation.

## Principio 7 — Reduce interaction cost by removing redundant steps

**La fuente afirma**: instead of cluttering the transfer screen with
"unnecessary text or multiple options," the senior design adds a "recent
recipients" section together with a search bar, which "eliminated the need
for a separate choose from history button and streamlined it to just one
clear call to action." The source names this "interaction cost" explicitly
as a UI design principle: "every unnecessary action you remove from the
process improves the user experience."

**La demostración muestra**: `frame-65pct.png` shows a "Transfer" screen
with a "Recent recipients" search bar and a scrollable list of named
contacts (including a business entry, "Amazon UK"), and a single "+ New
recipient" button at the bottom. The junior version described as "two
buttons and redundant text" was not captured in any sampled frame and is
recorded here as **fuente directa sin confirmación visual**.

**Regla accionable**: audit any multi-step flow for actions that exist only
to route the user to functionality that could instead be surfaced directly
(e.g., a history list embedded on the main screen rather than behind a
separate button); consolidate to the minimum number of controls that still
cover the common cases.

**Antipatrón**: offering multiple parallel buttons/entry points to reach the
same category of data (e.g., separate "recent" and "search" and "choose
from history" controls) when they can be merged into one component.

**Criterio de aceptación**: the recent-recipients pattern is confirmed
visually; the "two redundant buttons" claim about the junior baseline is
narration-only and should be labeled as such if reused.

## Principio 8 — Group and prioritize related fields (progressive disclosure)

**La fuente afirma**: for currency-aware transfers, the junior design uses
"two separate Fields, one for selecting the currency and another for
entering the transfer amount," which "works" but is "not optimized." The
senior design makes the amount field "the focus of the screen, making it
larger and more prominent," while tucking the currency selector "into the
corner of the amount input field," reasoning that the user will most likely
transfer in the same currency most of the time.

**La demostración muestra**: `frame-70pct.png` confirms the junior layout —
a labelled "Currency" dropdown field stacked above a separate "Transfer
amount" field, both similarly sized, with a numeric keypad beneath.
`frame-75pct.png` confirms the senior layout — a single large amount field
("£250.32") with a small "GBP" flag-and-chevron control embedded in its
trailing corner.

**Regla accionable**: when two fields have unequal importance or unequal
expected frequency of change, merge the less-frequently-changed field into
a compact control embedded within the primary field, rather than giving it
equal visual weight.

**Antipatrón**: presenting a rarely-changed configuration field (e.g.,
currency, unit, category) with the same size and prominence as the
main input value.

**Criterio de aceptación**: the primary value field is visually larger than
the secondary configuration control, and the secondary control is embedded
within or directly adjacent to the primary field rather than occupying its
own full-width row.

## Principio 9 — Prefer recognition over recall for identifying people/entities

**La fuente afirma**: adding "a profile photo or even just an icon next to
the recipient's name and account number does more than just personalize
the transaction" — it "taps into the principle of recognition over recall,"
letting users "quickly recognize familiar faces or icons" instead of
remembering account numbers, which reduces "the risk of accidental
transfers."

**La demostración muestra**: `frame-60pct.png` shows stacked recipient cards
each with a circular profile photo, name-like account number, and a
"Slide to pay" affordance. `frame-80pct.png` shows a "Transfer money to"
screen with a circular photo of "Jenny Spenser" above her account number,
directly beside the transfer-amount field.

**Regla accionable**: whenever an interface requires the user to confirm
they are interacting with the correct person or entity, show a recognizable
visual identifier (photo, avatar, logo) adjacent to the identifying text,
not text alone.

**Antipatrón**: identifying people or accounts by number or name text only,
requiring the user to recall or carefully re-read details to confirm
correctness.

**Criterio de aceptación**: the recipient-confirmation screen shows a
photo/avatar directly paired with the textual identifier, confirmed
visually.

## Principio 10 — Give instant, specific feedback about the consequence of an action

**La fuente afirma**: adding a "new balance" section directly after the
transfer amount gives users "instant feedback on how the transaction will
affect their account balance," improving "transparency" and helping users
"feel more in control of their finances, minimizing any surprises." The
source adds, as an unverified claim, that "many banking apps miss this
feature."

**La demostración muestra**: `frame-80pct.png` and `frame-85pct.png` both
show a line reading "Your new balance £778.4x" beneath the transfer-amount
field, updating alongside the entered amount.

**Afirmación no verificada**: the claim that "many banking apps miss this
feature" is asserted without evidence in the source and is not
independently confirmed by this package.

**Regla accionable**: whenever a user action will change a stateful value
the user cares about (balance, quota, count), show the resulting new value
before or immediately upon confirming the action, not only after
submission.

**Antipatrón**: showing only the input amount without surfacing the
downstream effect on the user's existing state, forcing a mental
calculation or a post-submission surprise.

**Criterio de aceptación**: the confirmed frame shows a computed
"after-action" value adjacent to the input value, not merely the raw input.

## Principio 11 — Disambiguate context when multiple accounts/sources exist

**La fuente afirma**: when a user "has multiple accounts, perhaps a
business account, a personal account, or even a joint account," the design
should "clearly show which account the payment is coming from" by
"displaying both the sender account and the recipient's account
prominently during the transaction," so the user can "easily switch between
accounts before finalizing."

**La demostración muestra**: `frame-85pct.png` shows a "From: Personal
account" row and a "To: Jenny Spenser" row stacked above the transfer
amount field. `frame-90pct.png` shows this as the most advanced of three
side-by-side transfer-screen variants.

**Regla accionable**: in any flow where the acting entity (account, profile,
workspace) is ambiguous or user-selectable, surface both the source and
destination context explicitly on the confirmation screen, with the source
also switchable in place.

**Antipatrón**: assuming a single implicit source account/context and
omitting it from the confirmation screen, forcing the user to trust an
unstated default.

**Criterio de aceptación**: the confirmed frame shows explicit "From" and
"To" labels with their respective identifiers, both visible simultaneously.

## Principio 12 — Offer selection instead of manual free-text input

**La fuente afirma**: asking a user to manually type their job title "gets
the job done" but "requires more effort from the user and introduces the
possibility of typos, inconsistent responses, or frustration with thinking
of the right title." The senior alternative offers "a selection of the most
common job titles" so "users can simply tap their role," with icons added
"to bring in some personality," plus an explicit fallback ("Other") "for
those whose job title wasn't listed... allowing them to either input their
own title or select it as a general option."

**La demostración muestra**: `supplemental-930s.png` (timestamp located via
the transcript at ~15:27, since the job-title narration begins there)
confirms the junior baseline: an onboarding step titled "What is your job
role?" with a single empty free-text field. `frame-95pct.png` confirms the
senior version: a vertical list of tappable options ("UX/UI designer,"
"Product manager," "Data scientist," "Customer support," "Engineer,"
"Founder"), each with a distinct icon, plus a "UX/UI designer" option shown
as selected (checkmark) and an "Other" option at the end of the list.

**Regla accionable**: for any field with a finite, common set of expected
answers, present those answers as tappable/selectable options with an
explicit "Other" escape hatch, instead of an open free-text field as the
default input mode.

**Antipatrón**: defaulting to free-text entry for data that has a small,
well-known set of common values, without at least offering a selectable
shortlist.

**Criterio de aceptación**: the confirmed frame shows a selectable list
covering common values plus an explicit fallback option, replacing a bare
text field.

# Demostraciones y ejemplos visibles

The video contains three fully worked redesign case studies, each following
the same junior → senior progression structure:

1. **Sleep-tracking app** ("how long did you sleep last night?"): junior
   plain radio list → personalized/emoji list → centered-emoji dynamic
   feedback → centered-emoji-plus-slider with week-over-week comparison.
   Confirmed across `frame-10pct.png`, `frame-15pct.png`, `frame-20pct.png`,
   `frame-25pct.png`, `frame-40pct.png`, `frame-45pct.png`, `frame-50pct.png`,
   `frame-90pct.png`.
2. **Banking transfer flow**: junior "two buttons" recipient screen
   (narration only) → recent-recipients-plus-search senior screen; junior
   two-field currency/amount → senior merged amount-with-embedded-currency;
   addition of recipient photo, new-balance line, and from/to account
   context. Confirmed across `frame-60pct.png`, `frame-65pct.png`,
   `frame-70pct.png`, `frame-75pct.png`, `frame-80pct.png`, `frame-85pct.png`,
   `frame-90pct.png`.
3. **Onboarding job-role question**: junior free-text field → senior
   tappable list with icons and an "Other" fallback. Confirmed across
   `supplemental-930s.png` and `frame-95pct.png`.

A UI-kit style callout showing checkbox and slider control states appears
in `frame-30pct.png`, presented as a component-level detail rather than a
full screen; it is recorded as supporting visual evidence for the general
use of checkboxes/sliders in the sleep-app case study, not as a separate
principle.

The video opens with a montage of an admired design portfolio (a 3D
skateboard render with enthusiastic comments), confirmed in
`supplemental-15s.png`, used rhetorically to frame the "top 1%" hook — this
is a framing device, not a design pattern to reuse.

# Flujo integrado para el agente

An agent applying this method to a new screen or flow should:

1. Identify the single most important data point or action the screen
   exists to capture, and make it the visually dominant element
   (Principio 2).
2. Personalize any addressable copy with the user's actual name or context,
   and rewrite it in conversational register (Principio 1).
3. Order interactive controls to match natural reading direction
   (Principio 3).
4. For qualitative/emotional scales, pair each option with a meaningful icon
   or emoji whose valence matches its position on the scale (Principio 4),
   while keeping icon meaning accessible without relying on color alone.
5. Ensure the selected state is visually distinct (size/color) and paired
   with a specific, contextual feedback message (Principio 5).
6. For frequently-repeated inputs, evaluate escalating the interaction model
   toward direct manipulation (slider/swipe) if it can carry comparative,
   personalized feedback (Principio 6), while keeping accessible equivalents.
7. Audit the flow for redundant entry points into the same functionality and
   consolidate them (Principio 7).
8. Group fields by relative importance and frequency of change, embedding
   secondary configuration into the primary field rather than giving both
   equal weight (Principio 8).
9. Use recognizable identifiers (photos/avatars/logos) whenever the user
   must confirm they are addressing the correct person or entity
   (Principio 9).
10. Surface the computed consequence of an action (new balance, resulting
    state) immediately, not only after submission (Principio 10).
11. When multiple sources/contexts exist, show both source and destination
    explicitly and let the source remain switchable (Principio 11).
12. Replace free-text entry with a selectable shortlist plus an explicit
    "Other" fallback whenever the underlying values are a small, known set
    (Principio 12).
13. Before presenting any of the above as evidence of a "senior" decision to
    a third party, separate what the source explicitly states from what is
    only visually confirmed, and never present a mockup as evidence of a
    production-ready or already-shipped feature.

# Reglas operativas

- Treat every "senior" mockup shown in the source as a design concept, not
  as a validated, user-tested, or production-deployed solution; the source
  itself frames these as illustrative comparisons, not case-study results
  with measured outcomes.
- Do not present the reviews screenshot (`frame-55pct.png`) or the "10,000+
  downloads" and "five-star reviews" claims as independently verified; they
  are the creator's own promotional material for a paid product.
- Do not claim the junior "two buttons" transfer screen or the "many banking
  apps miss this feature" claim as visually confirmed; both are narration
  only in this package's evidence.
- Do not present the discount-code claim as shown on screen; it is
  audio-only per the frame sampled near that timestamp.
- Keep promotional content (the "UI UX Playbook", the "UX/UI Design Mastery
  course", and the discount code) separate from the transferable method;
  none of the twelve principles above depend on purchasing either product.
- When adapting any icon/emoji-based feedback pattern, add an accessible
  text equivalent and do not rely on color alone to convey scale position.
- When adapting any slider/swipe interaction, add keyboard and
  screen-reader-operable equivalents and respect reduced-motion settings.
- When adapting the "recognition over recall" pattern with real user
  photos, obtain appropriate consent/authorization for displaying those
  images and apply the product's actual privacy and data-retention
  policies; the source does not address this and it is added here as a
  professional extension.
- When adapting financial-flow patterns (balance display, multi-account
  transfers), ensure amounts and balances shown reflect real-time,
  authoritative account state and are not decorative placeholder values in
  a shipped product.

# Antipatrones

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

# Criterios de aceptación

- Each of the twelve principles has at least one frame explicitly cited and
  inspected in this package that supports its "senior" version.
- Any claim without a corresponding inspected frame is labeled as
  narration-only ("fuente directa sin confirmación visual") rather than
  presented as visually confirmed.
- Promotional material (product names, testimonials, discount codes) is
  never merged into the operative method sections.
- Accessibility, consent, and production-readiness professional extensions
  are attributed to this dossier, not to the source video.

# Rúbrica de evaluación

Score any redesign proposal produced using this method on a 0–3 scale per
dimension:

- **Hierarchy**: 0 = no clear primary value; 3 = primary value unambiguous
  and dominant, secondary values clearly subordinate.
- **Personalization/copy**: 0 = generic/formal copy; 3 = personalized,
  conversational copy tailored to the specific user and moment.
- **Interaction cost**: 0 = redundant/duplicated entry points; 3 = single
  clear path with no unnecessary steps.
- **Feedback**: 0 = no confirmation of action or consequence; 3 = immediate,
  specific feedback showing both the selection and its downstream effect.
- **Recognition support**: 0 = text-only identification of people/entities;
  3 = photo/avatar-based recognition paired with text.
- **Accessibility of new interactions**: 0 = new interaction (slider, swipe,
  icon scale) has no non-visual/non-gestural equivalent; 3 = fully operable
  via keyboard/assistive tech with reduced-motion support.

Minimum acceptable result to call a redesign "senior-level" under this
rubric: no dimension scoring 0, and at least four of the six dimensions
scoring 2 or higher. A blocking failure is any dimension at 0 combined with
a claim, in accompanying documentation, that the design is
production-validated or user-tested when it is not.

# Resumen compacto

A voiceover-driven UI/UX motion-graphics video (uxpeak, ~16:42, English)
teaches twelve senior-designer heuristics through three side-by-side
junior-vs-senior redesign case studies: a sleep-tracking check-in, a banking
transfer flow, and a job-title onboarding question. The throughline is:
personalize copy, establish clear visual hierarchy around the one value
that matters most, reduce redundant interaction steps, replace manual entry
with recognition-based selection, give immediate and specific feedback tied
to the exact action taken, and make multi-account/multi-currency context
explicit rather than assumed. The video also promotes two paid products (a
"UI/UX Playbook" and a "UX/UI Design Mastery" course) and a discount code;
these promotional elements are documented separately from the twelve
reusable principles and must not be conflated with the transferable method.

[S79]

### Patterns > The ten ranked techniques for creating contrast

The ten ranked techniques for creating contrast

Principle: Contrast can be created through ten techniques, ranked from most to least powerful: motion, task-related information, focal points via white space, human faces, color, size, weight, imagery, extra elements, and misalignment.

Problem: Prevents relying on a single, overused contrast technique (commonly size or color) while ignoring more effective or more subtle alternatives suited to the situation.

Source basis: The full ranked list of ten techniques (motion, task-related information, focal points/white space, faces, color, size, weight, imagery, extra elements, misalignment) is stated directly and completely between 02:05 and 09:48, including the WebAIM citation and the 4.5:1 recommended contrast ratio.

Professional extension: The acceptance criteria requiring a verifiable numeric contrast ratio check as a standing practice (not just a one-time mention) is added as a professional extension of the source's guidance.

[S80]

### Patterns > Restrict the design toolkit to five elements

Restrict the design toolkit to five elements

Principle: An editorial-style layout is built using only typography, color, grid, images and white space, with no decorative effects layered on top.

Problem: Prevents designers from masking weak composition with shadows, gradients, 3D textures, borders and patterns.

Source basis: The source explicitly states editorial layouts are built on typography, one or two colors, a simple grid, images in clear boxes, and white space (02:06), and frames the constraint as freedom via the 'bones' analogy (02:38).

Professional extension: None; this pattern is taken directly from the source with no added extension.

[S81]

### Patterns > Strategic design thinking

Strategic design thinking

Principle: Start with the business problem, audience and position before selecting UI features.

Problem: Executing requested features without diagnosing their purpose.

Source basis: The source explicitly describes these three inputs and the diagnostic question.

Professional extension: Document assumptions and obtain approval before material scope changes.

[S82]

### Patterns > Hierarchy is a perception order, not an importance judgment

Hierarchy is a perception order, not an importance judgment

Principle: Visual hierarchy ranks elements by the order a viewer notices them (primacy), not by their intrinsic importance; every element in a good design can be essential while still being read in sequence.

Problem: Prevents designers from assuming the 'most important' content in the abstract should automatically get the most visual weight, when what actually matters is what the user needs to see first to complete their task.

Source basis: The video states this directly at 00:00-01:33, using the landing-page-with-video example (headline first, video second) to illustrate that hierarchy governs order, not absolute importance.

Professional extension: None; this pattern is taken directly from the source without added inference.

[S83]

### Patterns > Composition follows known audience scanning patterns

Composition follows known audience scanning patterns

Principle: Arrange elements according to a pattern the audience already knows how to scan: top-to-bottom, left-to-right, Z-pattern (combining both, common in minimalist or print media), or F-pattern (common on text-heavy web pages).

Problem: Prevents arranging a design's elements arbitrarily, which forces the viewer to work harder to find the intended reading order instead of following a familiar scanning habit.

Source basis: The four composition patterns (top-to-bottom, left-to-right, Z-pattern, F-pattern) and their recommended use cases are stated directly between 12:22 and 14:56, with the Z-pattern example visually confirmed in frames.

Professional extension: None; the medium-vs-pattern matching guidance is stated directly in the source's closing remarks.

[S84]

### Patterns > The human touch (wabi-sabi) and anti-UX

The human touch (wabi-sabi) and anti-UX

Principle: Deliberate imperfection signalling that a real person made the page: hand-drawn arrows, messy underlines, unpolished or phone-shot photos, paper and ink textures, sketched illustrations. Its extreme form is anti-UX, intentionally non-intuitive interaction.

Problem: Prevents a site from reading as AI-generated in a field where generated output is becoming the default and indistinguishable.

Source basis: The video explains the wabi-sabi philosophy, lists the concrete manifestations, names the anti-UX extreme, notes most sites only sprinkle it in, and gives the application tip.

Professional extension: The constraint that imperfection must never touch required tasks, and the licensing requirement, are added by this dossier.

[S85]

### Patterns

5 validated rule patterns.

[S86]

### Rules document

Choose web-design trends as task-serving communication and feedback devices; retain clear hierarchy, user control, accessibility, performance, and honest evidence.

Expressive but navigable composition

Principle: Use anti-design, illustration, expressive type, or brutalism to create a distinct identity while preserving recognizable paths.

Problem: Decorative novelty can hide navigation and primary actions.

Source basis: The video presents anti-design, experimental navigation, custom illustration, expressive type, and brutalism as visual directions.

Professional extension: Accessible labels, focus behavior, and licensing checks are added safeguards.

Purposeful motion and feedback

Principle: Use scroll scenes, macro animation, smart video, cursor effects, and microinteractions only to explain state or strengthen orientation.

Problem: Motion can distract, block reading, or make essential information inaccessible.

Source basis: The source discusses scrolling design, macro animation, smart videos, cursor animation, and microinteractions.

Professional extension: Reduced motion, touch support, and reversibility are implementation requirements not established by the video.

Structured emphasis through space and grids

Principle: Use full-screen headers, bento modules, negative space, and CSS grids to clarify priority and relationships.

Problem: Crowded or uniformly weighted pages make scanning and comparison difficult.

Source basis: The video presents full-screen headers, Bento UI, negative space, and grid design.

Professional extension: Responsive and semantic ordering criteria are added for production use.

Layered visual system with controlled color

Principle: Use 3D, image-graphic blending, color systems, and dark/light modes to reinforce meaning rather than merely decorate.

Problem: Effects, color inversion, and image overlays can reduce legibility and performance.

Source basis: The source covers color trends, 3D websites, image-and-graphic blending, and dark/light mode.

Professional extension: Contrast testing, fallbacks, and performance budgets are added safeguards.

Text-led clarity

Principle: When text is the primary visual element, make hierarchy, copy, and interaction states exceptionally explicit.

Problem: Minimal or text-only pages can become ambiguous when labels and reading order are weak.

Source basis: The source names text-only websites and shows text-led portfolio examples.

Professional extension: Semantic structure and zoom testing are added accessibility requirements.

- Define the user task, content priority, and risk.
- Build a semantic static layout and responsive hierarchy.
- Select one primary trend with a written task-based rationale.
- Add visual expression and motion with fallbacks.
- Test contrast, keyboard, touch, zoom, reduced motion, loading, and real destinations.
- Verify authorization, consent, licensing, and evidence claims before release.

[S87]

### Patterns > Surveillance design

Surveillance design

Principle: Pulls visual language from CCTV footage, UI overlays, thermal imaging, timestamps, and biometric graphics.

Problem: Names an intense, on-edge style for conceptual posters and tech/data-themed branding.

Source basis: The source names the style, describes its visual traits, and mentions the channel's own tutorial on creating it in Kittl.

Professional extension: None beyond search-query phrasing guidance; the referenced external tutorial is not independently verified here.

[S88]

### Patterns

20 validated rule patterns.

[S89]

### Rules document

Twenty named, historically or culturally rooted design styles are each searchable by name; knowing the correct term (verified against on-screen labels rather than automatic transcription) turns a vague visual intent into a concrete, repeatable reference-search query, typically combined with a medium modifier such as poster, branding, or illustration.

Rubber Hose Design

Principle: 1920s-30s animation-inspired illustration with bendy noodle-like limbs, simple faces, and exaggerated motion.

Problem: Gives a name to a playful, vintage, mascot-style illustration look otherwise hard to search for.

Source basis: The source names the style, its animation-era origin, the Cuphead reference, and recommended use cases.

Professional extension: None beyond search-query phrasing guidance.

Romantasy (Romantic)

Principle: Ornate romantic visuals blended with fantasy storytelling: flowing typography, medieval motifs, florals, moons, swords, dramatic lighting.

Problem: Names a fantasy-literature-adjacent aesthetic related to but distinct from light/dark academia.

Source basis: The source describes the visual traits and recommended use cases directly.

Professional extension: None beyond search-query phrasing guidance.

Chinoiserie

Principle: Decorative style referencing historical Chinese art motifs (florals, birds, pagodas, porcelain-like patterns), typically but not exclusively in blue-and-white or jewel tones.

Problem: Names a pattern-inspiration style for wallpaper, textile, packaging, stationery, and luxury branding, and corrects a mis-transcribed name.

Source basis: The source names the style, its motif sources, typical palette, and use cases; the on-screen slide independently confirms the spelling.

Professional extension: Recommendation to research the cultural origin of the motif before applying it superficially.

Risograph

Principle: Mimics risograph printing: layered ink colors, grain, misalignment, and bold flat shapes.

Problem: Names a distinctive analog-print texture style usable in nearly any project type.

Source basis: The source names the style, describes its print-process traits, mentions the channel own risograph tutorial, and visually documents a real print-shop visit in Berlin (the only genuine process demonstration in the video).

Professional extension: None beyond search-query phrasing guidance.

Diesel Punk

Principle: Early 20th century industrial aesthetics mixed with Art Deco, machinery, and gears; darker and more industrial than Steampunk.

Problem: Names a heavy, mechanical, dramatic retro-industrial style for game art, posters, and narrative illustration.

Source basis: The source names the style, explicitly notes it was new to the presenter, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Lowbrow Art

Principle: Rooted in underground comics, skate culture, and alternative art scenes; exaggerated characters, bold colors, surreal storytelling. Also called pop surrealism.

Problem: Names an anti-design-adjacent, street-influenced illustration and branding aesthetic.

Source basis: The source names the style, its cultural roots, its equivalent term, and use cases; explicitly notes it was new to the presenter.

Professional extension: None beyond search-query phrasing guidance.

Rocket Punk / Atomic Design

Principle: Imagines the future the way 1950s people did: sleek rockets, ray guns, atomic symbols, bold typography, technological optimism.

Problem: Names a retro-futuristic sci-fi look for posters, merch, and branding.

Source basis: The source names the style, its equivalent term, its era-specific visual traits, and mentions the channel's own tutorial on it.

Professional extension: None beyond search-query phrasing guidance.

Mobius-style illustration

Principle: Illustration referencing the Mobius strip, a one-edge, one-side mathematical surface, used to suggest infinite connection.

Problem: Names an abstract, tech-adjacent motif useful for posters, conference branding, and potential logo design.

Source basis: The source names the style, explains the Mobius strip concept, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Afrofuturism

Principle: Blends African art and culture with futuristic sci-fi and cosmic themes: bold patterns, symbolic imagery, celestial elements, powerful portraiture.

Problem: Names a viewer-requested, visually rich, narrative-heavy style for posters, book/album covers, fashion, and editorial design.

Source basis: The source names the style, notes it was viewer-requested, describes its visual traits, and gives use cases.

Professional extension: Recommendation to research cultural context before superficial application.

Cottagecore

Principle: Romanticizes slow living, nature, and pastoral life using soft colors, florals, hand-drawn elements, and cozy textures.

Problem: Names a widely recognized but often unnamed lifestyle-branding aesthetic.

Source basis: The source names the style, describes its visual traits, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Biomorphic design

Principle: Uses organic, flowy shapes inspired by nature, anatomy, and cells rather than strict geometry.

Problem: Names an abstract-organic style for modern branding, posters, and experimental layouts.

Source basis: The source names the style, describes its visual traits, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Anti-design

Principle: Intentionally breaks traditional design rules: clashing colors, awkward layouts, strange type choices, visual tension.

Problem: Names a rebellious, attention-grabbing style for experimental posters and fashion/editorial branding.

Source basis: The source names the style, describes its rule-breaking traits, and gives use cases.

Professional extension: None beyond flagging the unverified trend claim.

Surveillance design

Principle: Pulls visual language from CCTV footage, UI overlays, thermal imaging, timestamps, and biometric graphics.

Problem: Names an intense, on-edge style for conceptual posters and tech/data-themed branding.

Source basis: The source names the style, describes its visual traits, and mentions the channel's own tutorial on creating it in Kittl.

Professional extension: None beyond search-query phrasing guidance; the referenced external tutorial is not independently verified here.

Monoline illustration

Principle: Drawn with a single, consistent line weight, creating clean and elegant visuals.

Problem: Names a timeless, scalable illustration style for logos, icons, and branding.

Source basis: The source names the style, describes its visual traits, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Pictograms

Principle: Simplified icons resembling real-world objects, aimed at communicating an idea instantly.

Problem: Names a clarity-first symbol system used in wayfinding, packaging, and infographics.

Source basis: The source names the style, describes its purpose, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Isometric design

Principle: Creates a 3D-like effect using fixed angles without true perspective distortion.

Problem: Names a pseudo-3D style heavily used in tech illustration and explainer graphics.

Source basis: The source names the style, describes its geometric traits, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Blueprint design

Principle: Mimics architectural drawings and schematics: line work, labels, measurements, technical layout.

Problem: Names a technical-diagram aesthetic, one of the presenter's favorites, for posters and product breakdowns.

Source basis: The source names the style, describes it as a favorite, and mentions the channel's own tutorial on turning any niche into a blueprint design.

Professional extension: None beyond search-query phrasing guidance; the referenced external tutorial is not independently verified here.

Trinket design

Principle: Showcases collections of small objects (charms, toys, pins, nostalgic items) arranged like a catalog or sticker sheet.

Problem: Names a playful, collectible-catalog composition style for stickers and merch.

Source basis: The source names the style, describes its composition traits, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

Regencycore

Principle: Inspired by early 19th century (English Regency) aesthetics: ornate frames, classic typography, soft florals, refined layouts.

Problem: Names a romantic, polished, historical-luxury style for book covers and wedding stationery, and corrects the spoken term to its on-screen compound spelling.

Source basis: The source names the style, describes its historical period and visual traits, and gives use cases; the on-screen label independently confirms the compound spelling.

Professional extension: None beyond search-query phrasing guidance.

Kidcore

Principle: Draws from 90s toy culture: bright colors, cartoon mascots, playful typography, chaotic layouts, intentionally loud.

Problem: Names the twentieth and final listed style, useful for nostalgic, high-energy branding and merch.

Source basis: The source names the style, describes its 90s toy-culture roots and visual traits, and gives use cases.

Professional extension: None beyond search-query phrasing guidance.

- Match a user's vague visual description against the twenty named styles in this document, checking at least three observable traits before confirming a match.
- Combine the confirmed style name with a medium modifier (poster, branding, illustration, packaging, editorial) to form a reference-search query, as the source itself demonstrates.
- Use the on-screen-confirmed spelling of each style name rather than the raw automatic-transcript spelling when they differ.
- Present any cited visual example strictly as a style reference, never as a licensed or ready-to-use asset.
- Flag trend-popularity claims and Kittl feature/catalog mentions as unverified or time-bound, respectively.
- For culturally rooted styles (Chinoiserie, Afrofuturism, Regencycore), recommend the user research cultural context before superficial application.

[S90]

### Contexto autónomo para un agente — 8 advanced rules of minimal Web Design

# Contexto autónomo para un agente

## Propósito

Este documento convierte el video "8 advanced rules of minimal Web Design"
(canal BONT, subido el 24 de julio de 2024) en un paquete de conocimiento
autosuficiente. El objetivo es que otro agente pueda aplicar el método de
diseño web minimalista descrito por el creador sin necesidad de ver, escuchar
ni consultar el video original. El documento reconstruye las ocho reglas
anunciadas, el proceso de tres pasos que las acompaña, los ejemplos visuales
mostrados en pantalla y los límites de la evidencia disponible.

El video es un tutorial hablado a cámara, en inglés, de aproximadamente 21
minutos y 38 segundos (1298 segundos), en el que un diseñador web explica cómo
aplicar el principio "menos pero mejor" (less but better) a la identidad
visual de sitios web. No es música ni un montaje sin narración: hay locución
continua durante prácticamente todo el metraje, con segmentos de pantalla
compartida mostrando sitios reales del portafolio del creador.

## Evidencia y límites

La fuente primaria es la pista de subtítulos automáticos en inglés (`en`,
generada por reconocimiento de voz de YouTube), normalizada en
`transcript/source.txt`. No existían subtítulos manuales en el momento de la
descarga (`subtitles` vacío en los metadatos), por lo que se usó la pista
automática original (`asr`) sin traducir, siguiendo el orden de confianza del
pipeline. El `language` declarado en los metadatos de YouTube es `en`, lo cual
coincide con el audio transcrito y con el título original, sin sospecha de
localización automática.

Se inspeccionaron visualmente 20 fotogramas uniformes (0% a 95% de la
duración) mediante la hoja de contacto `visual/frames/contact-sheet.jpg`, más
2 fotogramas suplementarios (`supplemental-100s.png`,
`supplemental-870s.png`) agregados porque el muestreo uniforme no cubría con
claridad la demostración de la Regla 1 (página de testimonios) ni la de la
Regla 6 (elementos gráficos dibujados a mano en el sitio de un jugador de
fútbol americano).

Límites explícitos de esta evidencia:

- El video muestra capturas de pantalla estáticas o con scroll de sitios web
  ya publicados; no se observa código fuente, panel de administración, ni
  proceso de implementación técnica. Por lo tanto, ninguna afirmación de este
  documento debe interpretarse como prueba de una arquitectura de producción,
  un stack tecnológico o un flujo de trabajo operativo verificado.
- Los nombres de los sitios y clientes mostrados (por ejemplo, la firma de
  gestión de inversiones, el reciclador de metales, el estudio con el jugador
  John Elway) se identifican solo por lo que aparece literalmente en pantalla;
  no hay confirmación externa de que sigan en línea ni de que reflejen el
  estado actual de esos sitios.
- Las cifras de audiencia (número de tipografías usadas por Massimo Vignelli,
  "10 tipografías en toda su carrera") son afirmaciones directas del
  presentador, no verificadas por esta fuente externa; se marcan como
  afirmación sin verificar.
- El creador ofrece un curso gratuito y un programa de mentoría de pago
  (BONT Club). Estas menciones son promociones y se excluyen del método
  operativo, documentándose aparte.
- No se detectaron fragmentos en un idioma distinto del inglés.

## Tesis central

El diseño web minimalista y sofisticado no se logra agregando elementos, sino
reduciendo deliberadamente las variables de diseño (elementos visibles,
tipografías, jerarquías, colores, elementos gráficos, estilos de ilustración
y tratamientos de imagen) hasta el mínimo necesario, y luego aplicando esas
decisiones con disciplina y consistencia en todo el sitio. La sofisticación
percibida proviene de la restricción y la coherencia, no de la cantidad de
recursos visuales utilizados. El presentador resume esto como el principio
"less but better" (menos, pero mejor): cuantas menos variables tenga que
decidir un diseñador en cada nueva página o módulo, más rápido logrará
resultados de alta calidad.

## Mapa temporal de procedencia

| Marca de tiempo | Contenido |
|---|---|
| 00:00 | Introducción: promesa de 8 reglas + proceso de 3 pasos para resultados "instantáneos" |
| 00:53–02:48 | Regla 1: Reducir elementos visibles |
| 02:48–04:53 | Regla 2: Dominar pocas tipografías |
| 04:53–06:33 | Regla 3: Reducir tipografías por proyecto |
| 06:33–10:33 | Regla 4: Reducir jerarquías tipográficas |
| 10:33–13:04 | Regla 5: Reducir colores |
| 13:04–14:23 | Regla 6: Reducir elementos gráficos |
| 14:23–15:36 | Regla 7: Reducir estilos de ilustración |
| 15:36–17:50 | Regla 8: Reducir tratamientos de imagen |
| 17:50–18:44 | Paso 1 del proceso: explorar variables en el homepage |
| 18:44–18:59 | Paso 2 del proceso: alejarse y auditar las reglas |
| 18:59–21:24 | Paso 3 del proceso: simplificar variables y fijar reglas claras; cierre, promociones y llamado a la acción |

Este mapa es únicamente procedencia: cada regla se explica en detalle en la
sección siguiente y no requiere consultar las marcas de tiempo para
entenderse.

# Método completo de la fuente

## Principio / paso / elemento 1: Reducir elementos visibles

**El video afirma** (00:53–01:33) que no importa cuántos clics deba dar un
usuario, siempre que cada clic sea una decisión "mental y ambiguamente
sencilla" (cita atribuida a "Steve C.": *"no importa cuántas veces tenga que
hacer clic, siempre que cada clic sea una elección sencilla y sin
ambigüedad"*, 00:53). A partir de esta idea, el presentador recomienda
no temer a **ocultar elementos**: muchos botones, menús desplegables,
ventanas emergentes ("popups"), modales, iconos informativos e incluso
páginas enteras pueden extraerse de la vista principal si el contenido lo
justifica.

Ejemplo demostrado: en su propio sitio, el presentador tenía una sección de
testimonios en el homepage que empezó a sentirse "abarrotada" (*"empezó a
volverse abarrotado"*, 01:02). En vez de seguir agregando testimonios y
empujando el resto del contenido hacia abajo, creó una **página de
testimonios independiente**: el homepage muestra solo un par de testimonios,
y quien quiere ver más navega a esa página dedicada. `supplemental-100s.png`
confirma visualmente el sitio de BONT con esta estructura de navegación y
contenido resumido en la página principal.

La segunda técnica dentro de esta regla es el uso generoso de **espacio en
blanco**: en vez de comprimir todo el contenido en un solo módulo, se permite
que el usuario haga scroll, separando los módulos con amplios márgenes. El
presentador cuantifica su propia práctica: aproximadamente 150–160 píxeles de
separación entre módulos, no "10 píxeles" (02:05–02:35).

- Regla operativa: antes de agregar un elemento nuevo a una vista, preguntar
  si puede ocultarse detrás de una interacción, moverse a una página propia,
  o eliminarse.
- Antipatrón: apilar cada vez más contenido en el mismo módulo o página en
  lugar de reorganizar la información jerárquicamente.

## Principio / paso / elemento 2: Dominar pocas tipografías

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

## Principio / paso / elemento 3: Reducir tipografías por proyecto

**El video afirma** (04:39–06:14) un límite operativo concreto: usar un
máximo de una o dos tipografías por proyecto. El presentador ilustra la regla
con tres ejemplos de su portafolio:

1. Su propio sitio web, que combina PP Hatton (títulos) y Helvetica Neue
   (cuerpo de texto y llamadas a la acción).
2. Un sitio que usa Univers para títulos y subtítulos, y Akzidenz-Grotesk
   para el cuerpo del texto.
3. Un sitio que usa Clarendon para títulos principales y textos destacados, y
   Futura para el cuerpo.

El patrón que señala el presentador es sistemático: una tipografía de
"display" (más expresiva) para títulos, y una tipografía más neutra para
cuerpo de texto y elementos pequeños, generalmente elegida de un conjunto
reducido de clásicos (Akzidenz-Grotesk, Futura, Helvetica).

- Regla operativa: asignar como máximo dos roles tipográficos por proyecto
  (display/título y texto de cuerpo), evitando añadir una tercera familia
  salvo necesidad justificada.
- Antipatrón: mezclar tres o más tipografías en un mismo proyecto, lo que el
  presentador describe textualmente como generador de "mucho caos" (06:14).

## Principio / paso / elemento 4: Reducir jerarquías tipográficas

**El video afirma** (06:33–10:29) que sus proyectos usan, casi siempre, un
máximo de tres jerarquías tipográficas (títulos, cuerpo de texto y llamadas a
la acción), con excepciones ocasionales de hasta cuatro o cinco. Ejemplos
concretos:

- En su propio sitio: una jerarquía para títulos, una para el cuerpo y una
  para las CTAs. El presentador reconoce que técnicamente podría contarse una
  jerarquía adicional (mismo tamaño y peso, pero mayúsculas frente a
  minúsculas), llegando a cuatro como máximo.
- En otro sitio: cinco jerarquías -H1, H2 en minúscula, H2 en mayúscula y
  cuerpo de texto-, más un tamaño extra llamado "H0" para texto grande y
  ornamental, que el propio presentador describe como "más ornamental que
  funcional" (07:16–07:50).

El video incluye una crítica explícita a un ejemplo defectuoso
(08:21–09:57): un diseño con cuatro tamaños de título distintos (22px, 18px,
16px y 13px de cuerpo) donde algunos saltos entre tamaños no son
perceptualmente claros. La regla que extrae el presentador es: **si la
diferencia entre dos tamaños no es al menos el doble, el salto no se percibe
como un salto jerárquico real**, salvo que se refuerce cambiando de
minúsculas a mayúsculas, lo cual sí crea un contraste perceptible sin
necesidad de aumentar el tamaño. La consecuencia práctica es que dos
jerarquías "casi iguales" en tamaño deberían fusionarse en una sola, o
diferenciarse por mayúsculas/minúsculas en lugar de por tamaño.

- Regla operativa: limitar el sistema tipográfico a un máximo de tres a cinco
  jerarquías; verificar que cada salto de tamaño sea perceptualmente claro
  (idealmente el doble del tamaño anterior) o esté reforzado por un cambio de
  caso.
- Antipatrón: crear jerarquías cuya diferencia de tamaño es menor al doble y
  no tiene ningún otro refuerzo visual (caso, color, peso), porque el ojo no
  las distingue como niveles distintos.

## Principio / paso / elemento 5: Reducir colores

**El video afirma** (10:29–13:04) un límite de uno o dos colores para
tipografía, más un color de acento. Ejemplos mostrados:

- Un sitio con dos colores de tipografía: el color principal de marca y un
  color más oscuro para el cuerpo de texto.
- Otro sitio con tres colores: blanco, verde (visible en el pie de página) y
  gris (para dar separación a otra jerarquía). El presentador aclara que en
  este caso el uso de un blanco puro para el fondo y un "casi blanco" (off-
  white) para el cuerpo del texto es, en sus palabras, "posiblemente
  innecesario" y podría simplificarse aún más.
- Para fondos, la misma lógica: uno o dos colores de fondo más un color de
  acento. En el ejemplo del sitio de reciclaje de metales (visible en
  `frame-50pct.png`, con fondo verde saturado), el verde se usa para fondos,
  un gris con textura y el negro completan la paleta de fondo.

El presentador añade una regla de contraste situacional: cuando el fondo de
una sección es una imagen, la llamada a la acción usa el color de acento
(verde en su ejemplo); cuando el fondo de la sección ya es de ese color de
acento, la CTA cambia a negro para mantener el contraste (12:03–12:33).

- Regla operativa: limitar la paleta a uno o dos colores tipográficos más un
  acento; para fondos, uno o dos colores de fondo más el mismo acento;
  alternar el color de las CTAs según el color del fondo inmediato para
  preservar el contraste.
- Antipatrón: introducir variaciones de color "casi iguales" (como blanco
  puro y off-white) sin una razón funcional clara, lo que añade complejidad
  sin beneficio perceptible.

## Principio / paso / elemento 6: Reducir elementos gráficos

**El video afirma** (13:04–14:07) que el mismo principio de reducción aplica
a los elementos gráficos: imágenes, ilustraciones, iconos, vectores, 3D y
video. La recomendación es limitar el proyecto a uno o dos tipos de elemento
gráfico. La combinación habitual del presentador es imágenes más iconos o
vectores, a veces sumando video (que considera cercano a las imágenes por
tratarse de "imágenes en movimiento").

Ejemplo demostrado: un sitio para un cliente vinculado al fútbol americano
(**confirmado visualmente** en `supplemental-870s.png`, donde se lee "John
Elway" y "Bobby Henebry" en una página de equipo directivo con fotografías en
blanco y negro) usa **vectores dibujados a mano** (handdrawn) como recurso
gráfico: un resaltado dibujado a mano bajo cada título, el título repetido
con una segunda versión en letra manuscrita, y dibujos tácticos de jugadas de
fútbol americano distribuidos por la página. El presentador resume el
inventario de recursos gráficos de ese sitio en exactamente tres: elementos
dibujados a mano, imágenes y texto (14:07).

- Regla operativa: elegir uno o dos tipos de elemento gráfico por proyecto
  (por ejemplo, imagen + icono, o imagen + ilustración) y mantenerlos
  consistentes en todo el sitio.
- Antipatrón: combinar imágenes, ilustraciones, iconos, 3D y video sin un
  criterio de selección, generando una identidad gráfica dispersa.

## Principio / paso / elemento 7: Reducir estilos de ilustración

**El video afirma** (14:23–15:36) que, cuando se usan ilustraciones, deben
compartir un estilo único y consistente en todo el proyecto. El ejemplo
mostrado (visible en `frame-70pct.png`, una cuadrícula de ilustraciones
coloridas de estilo plano) usa ilustraciones dibujadas a mano con un grosor
de trazo casi uniforme. El presentador señala una inconsistencia que él mismo
reconoce como mejorable: la tipografía del sitio no combina del todo con el
estilo manuscrito de las ilustraciones.

El presentador enumera las variables que definen un "estilo de ilustración" y
que deben decidirse una sola vez por proyecto: textura sí/no, perspectiva
frente a estilo plano, sombra sí/no, nivel de detalle (simple frente a
detallado), y técnica (dibujado a mano frente a vectorial). Fijar estas
variables y aplicarlas de forma uniforme es lo que, según el video, genera
consistencia y una sensación de sofisticación.

- Regla operativa: antes de ilustrar, decidir explícitamente textura,
  perspectiva, presencia de sombra, nivel de detalle y técnica, y aplicar esa
  decisión a todas las ilustraciones del proyecto.
- Antipatrón: mezclar ilustraciones con distinto nivel de detalle, técnica o
  presencia de sombra dentro del mismo sitio.

## Principio / paso / elemento 8: Reducir tratamientos de imagen

**El video afirma** (15:36–17:14) que el mismo criterio de reducción aplica
al tratamiento fotográfico: tipo de iluminación, color frente a blanco y
negro, sepia, saturación y temperatura de color deben decidirse como regla
única para todo el proyecto.

Dos ejemplos contrastados y **confirmados visualmente**:

1. Un sitio (visible parcialmente en `frame-75pct.png`, con el texto
   "History" superpuesto sobre una fotografía en blanco y negro) donde todas
   las imágenes se tratan en blanco y negro, sin excepciones, incluida la
   sección de historia del cliente.
2. Un sitio para un cliente industrial (fábrica de reciclaje de metales,
   visible en `frame-35pct.png` con el texto "WORLD CLASS MANUFACTURING AND
   RECYCLING") donde sí se usó color a todo color, porque las fotografías y
   videos provenían de un único fotógrafo, con la misma cámara, el mismo día
   y el mismo tipo de luz, garantizando consistencia natural entre las
   imágenes.

El presentador explica la decisión de blanco y negro en el primer caso: los
activos de imagen procedían de fuentes dispares ("de todo internet"), sin
consistencia entre sí, por lo que convertir todo a blanco y negro fue la
manera de unificar visualmente un material heterogéneo (16:43–17:14).

- Regla operativa: fijar un tratamiento fotográfico único (color o blanco y
  negro, saturación, temperatura) para todo el proyecto; si las imágenes
  provienen de fuentes o condiciones de captura distintas, usar un
  tratamiento unificador (por ejemplo, blanco y negro) para disimular la
  inconsistencia de origen.
- Antipatrón: mezclar fotografías con distinta temperatura de color,
  saturación o tratamiento sin una regla que las unifique.

# Demostraciones y ejemplos visibles

El video no es una presentación de diapositivas: alterna al presentador
hablando a cámara (fondo con estantería, lámpara e iluminación cálida, visto
en `frame-00pct.png`, `frame-05pct.png`, `frame-10pct.png`, entre otros) con
capturas de pantalla de sitios reales de su portafolio, algunas estáticas y
otras con scroll o interacción del cursor.

Inventario de evidencia visual confirmada por inspección directa de los
fotogramas:

- `frame-15pct.png` (≈03:14) y `frame-50pct.png` (≈10:49): la misma página
  "Investment management" con fondo claro y tipografía serif en color vino,
  usada como ejemplo recurrente de tipografía y de sistema de color.
- `frame-25pct.png` (≈05:24): el sitio de BONT mostrando la sección "TO
  FINANCIAL PEACE & CREATIVE FREEDOM" y comparativas tipográficas (Pangram
  Pangram, Off Type), coherente con la explicación de la Regla 3.
- `frame-35pct.png` (≈07:34): sitio de un cliente de reciclaje de metal, con
  fondo oscuro, foto industrial y texto "WORLD CLASS MANUFACTURING AND
  RECYCLING" en tipografía de gran tamaño, usado como ejemplo de jerarquía.
- `frame-40pct.png` (≈08:39): panel con varias vistas simultáneas
  (portafolio "My Creative Styles" y un editor de código con panel verde de
  "METAL RECYCLING"), consistente con comparaciones entre proyectos.
- `frame-45pct.png` (≈09:44): primer plano del panel verde "METAL RECYCLING"
  mostrando un número de identificación regulatorio ("IDR0002 05476"), parte
  del mismo sitio industrial.
- `frame-70pct.png` (≈15:08): cuadrícula de ilustraciones planas y coloridas
  (iconografía de objetos cotidianos), coherente con la Regla 7.
- `frame-75pct.png` (≈16:13): imagen en blanco y negro con la palabra
  "History" superpuesta, coherente con la Regla 8.
- `supplemental-100s.png` (00:01:40): sitio de BONT mostrando su propuesta de
  valor ("TO FINANCIAL PEACE & CREATIVE FREEDOM") y una cita de cliente,
  evidencia de la estructura de contenido resumido descrita en la Regla 1.
- `supplemental-870s.png` (00:14:30): página de equipo con las fotografías en
  blanco y negro de "John Elway" y "Bobby Henebry", confirmando el sitio
  vinculado al fútbol americano mencionado como ejemplo de la Regla 6.

No se observan paneles de analítica, código de backend, ni pruebas de
métricas de negocio en ningún fotograma: toda la evidencia visual corresponde
a la capa de presentación (frontend) de los sitios mostrados. Ningún
fotograma demuestra que un sitio esté "en producción" en el sentido de
tráfico real, conversión o infraestructura; solo demuestra el acabado visual
tal como se ve en el navegador del presentador.

# Flujo integrado para el agente

Un agente que reciba el encargo de aplicar (o auditar) el método de este
video sobre un sitio existente o un sitio nuevo debería seguir esta
secuencia, que corresponde al proceso de tres pasos explicado por el
presentador entre 17:50 y 19:21:

1. **Explorar las variables en el homepage** (17:50–18:44). Tomar la pieza
   más visible del sitio —normalmente el hero del homepage— y decidir ahí,
   de una sola vez, todas las variables de las ocho reglas: tipografías,
   jerarquías, colores, elementos gráficos, estilo de ilustración y
   tratamiento de imagen. Si el diseño incluye un carrusel o slider, probar
   variantes en ese único módulo antes de expandir el sistema al resto del
   sitio.
2. **Alejarse y auditar** (18:44–18:59). Una vez que el sitio crece a varias
   páginas, revisar el conjunto completo con perspectiva de sistema, no
   módulo por módulo, para detectar inconsistencias que se hayan colado al
   añadir páginas nuevas.
3. **Simplificar variables y fijar reglas claras** (18:59–19:21). Donde se
   detecten inconsistencias, no agregar una excepción puntual: volver a las
   ocho reglas y definir una regla explícita aplicable a todo elemento del
   sitio (de página a página, de CTA a CTA), de modo que ningún tamaño,
   color, fondo o tratamiento de imagen quede librado al azar.

Un agente automatizado que ejecute una auditoría de diseño puede traducir
esto en una lista de comprobación operativa:

- Contar tipografías activas en el sitio; marcar como hallazgo cualquier
  conteo mayor a dos.
- Contar jerarquías tipográficas efectivas (tamaño + peso + caso); marcar
  como hallazgo cualquier jerarquía cuyo salto de tamaño respecto a la
  jerarquía adyacente sea menor al doble y no esté reforzada por un cambio de
  caso.
- Contar colores de texto y de fondo declarados en las hojas de estilo;
  marcar como hallazgo cualquier conteo mayor a dos colores de texto o dos
  colores de fondo (sin contar el acento).
- Clasificar los elementos gráficos presentes (imagen, ilustración, icono,
  vector, 3D, video) y marcar como hallazgo un inventario mayor a dos tipos.
- Si hay ilustraciones, verificar que compartan técnica, nivel de detalle,
  presencia de sombra y perspectiva.
- Si hay fotografías, verificar que compartan tratamiento de color
  (saturación, temperatura, blanco y negro sí/no).
- Verificar que el espaciado entre módulos sea generoso y consistente en vez
  de comprimido.
- Verificar que el contraste de las CTAs se ajuste al color del fondo
  inmediato (alternando acento y color oscuro/neutro según corresponda).

Este flujo es aplicable tanto a la creación de un sitio nuevo como a la
auditoría de uno existente, y no requiere herramientas específicas más allá
de inspección visual y del código de estilos del sitio.

# Reglas operativas

1. Antes de añadir un elemento nuevo a una vista, evaluar si puede ocultarse,
   moverse a una subpágina o eliminarse (Regla 1).
2. Mantener un repertorio tipográfico personal reducido y reutilizarlo entre
   proyectos en lugar de elegir tipografía nueva cada vez (Regla 2).
3. Limitar cada proyecto a un máximo de dos tipografías, normalmente una de
   display y una de texto (Regla 3).
4. Limitar el sistema tipográfico a un máximo de tres a cinco jerarquías, y
   verificar que cada salto de tamaño sea perceptible (idealmente el doble)
   o esté reforzado por un cambio de caso (Regla 4).
5. Limitar la paleta a uno o dos colores de texto y uno o dos colores de
   fondo, más un único color de acento, y alternar el color de la CTA según
   el contraste con el fondo inmediato (Regla 5).
6. Elegir uno o dos tipos de elemento gráfico (imagen, ilustración, icono,
   vector, video, 3D) por proyecto y mantenerlos consistentes (Regla 6).
7. Si se usan ilustraciones, fijar de antemano técnica, nivel de detalle,
   presencia de sombra y perspectiva, y aplicarlos uniformemente (Regla 7).
8. Si se usan fotografías, fijar un tratamiento único de color, saturación y
   temperatura; usar un tratamiento unificador (por ejemplo, blanco y negro)
   cuando las imágenes provienen de fuentes heterogéneas (Regla 8).
9. Explorar todas las variables de diseño en una sola pieza representativa
   (el hero del homepage) antes de expandir el sistema al resto del sitio.
10. Auditar periódicamente el sitio completo, no módulo por módulo, para
    detectar inconsistencias introducidas al agregar páginas nuevas.
11. Ante una inconsistencia detectada, resolverla creando una regla
    explícita aplicable a todo el sitio, no una excepción puntual.

# Antipatrones

- Apilar contenido indefinidamente en un mismo módulo en lugar de
  reorganizar la información en subpáginas o reducir el espaciado.
- Cambiar de tipografía en cada proyecto nuevo sin llegar a dominar el
  comportamiento de ninguna fuente.
- Usar tres o más tipografías en un mismo proyecto.
- Crear jerarquías tipográficas cuya diferencia de tamaño es menor al doble y
  no tiene ningún refuerzo visual adicional (caso, peso, color).
- Introducir variaciones de color casi idénticas (por ejemplo, blanco puro y
  off-white) sin una razón funcional.
- Combinar imágenes, ilustraciones, iconos, 3D y video sin un criterio de
  selección.
- Mezclar ilustraciones con distinta técnica, nivel de detalle o presencia
  de sombra dentro de un mismo sitio.
- Mezclar fotografías con distinta temperatura, saturación o tratamiento sin
  una regla que las unifique.
- Resolver una inconsistencia visual con una excepción puntual en lugar de
  una regla de sistema.
- Presentar una captura de pantalla del frontend como prueba de que un sitio
  está en producción, tiene tráfico real o una arquitectura backend
  determinada (extensión profesional: este documento no lo afirma, pero un
  agente que reutilice esta evidencia debe evitar esa inferencia).

# Criterios de aceptación

Un sitio o rediseño puede considerarse alineado con el método de este video
si, de forma verificable:

1. Usa un máximo de dos tipografías activas en toda la interfaz.
2. Declara un máximo de tres a cinco jerarquías tipográficas efectivas, y
   cada salto entre jerarquías adyacentes es perceptible (por tamaño al
   doble o por cambio de caso).
3. Usa un máximo de dos colores de texto y dos colores de fondo, más un
   único color de acento consistente en todo el sitio.
4. Usa un máximo de dos tipos de elemento gráfico (por ejemplo, imagen +
   icono) de forma consistente en todas las páginas.
5. Si hay ilustraciones, todas comparten técnica, nivel de detalle,
   perspectiva y presencia/ausencia de sombra.
6. Si hay fotografías, todas comparten tratamiento de color y saturación.
7. El espaciado entre módulos es perceptiblemente generoso (referencia dada
   por el presentador: alrededor de 150–160 píxeles, no valores mínimos como
   10 píxeles).
8. Las CTAs cambian de color de forma consistente según el contraste con el
   fondo inmediato.
9. Una auditoría de todas las páginas del sitio no revela variables (tamaño,
   color, tratamiento de imagen) aplicadas de forma aleatoria o sin regla
   documentada.

# Rúbrica de evaluación

Escala 0–3 por dimensión (0 = no cumple, 1 = cumple parcialmente, 2 = cumple
mayormente, 3 = cumple completamente):

| Dimensión | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Reducción de elementos visibles | Interfaz saturada, sin jerarquía de exposición de contenido | Algunos elementos ocultos, pero persisten módulos sobrecargados | Mayoría de elementos secundarios ocultos o en subpáginas | Sistema deliberado de exposición progresiva con espaciado generoso |
| Disciplina tipográfica | Más de 3 tipografías sin criterio | 3 tipografías con algo de criterio | 2 tipografías con roles claros | 1–2 tipografías dominadas y reutilizadas de forma consistente |
| Jerarquías tipográficas | Más de 5 jerarquías o saltos imperceptibles | 4–5 jerarquías con algunos saltos débiles | 3–4 jerarquías con saltos mayormente claros | 3 jerarquías (o menos) con saltos siempre perceptibles |
| Paleta de color | Más de 2 colores de texto/fondo sin acento definido | Paleta amplia con acento inconsistente | Paleta ajustada con acento mayormente consistente | 1–2 colores + 1 acento aplicado de forma sistemática y contrastante |
| Elementos gráficos | Mezcla de 4+ tipos sin criterio | 3 tipos con poca cohesión | 2 tipos aplicados de forma mayormente consistente | 1–2 tipos aplicados con consistencia total |
| Consistencia de ilustración/imagen | Estilos mezclados sin unificación | Unificación parcial | Unificación mayoritaria con excepciones menores | Estilo o tratamiento único aplicado en todo el sitio |
| Proceso de auditoría | Sin evidencia de auditoría sistemática | Auditoría ad hoc | Auditoría periódica parcial | Proceso de 3 pasos aplicado de forma explícita y documentada |

Resultado mínimo aceptable: promedio igual o mayor a 2 en las siete
dimensiones, sin ninguna dimensión en 0.

Fallas bloqueantes: presentar una captura de interfaz como prueba de
funcionamiento en producción; mezclar contenido promocional dentro de las
reglas de diseño; fabricar métricas de negocio no presentes en el video.

# Resumen compacto

El video "8 advanced rules of minimal Web Design" (BONT, 21:38 min) enseña
que el diseño web minimalista y sofisticado se logra reduciendo, no
agregando: (1) ocultar elementos secundarios y dar espacio generoso; (2)
dominar pocas tipografías a lo largo del tiempo; (3) usar máximo dos
tipografías por proyecto; (4) limitar las jerarquías tipográficas a tres o
cinco, con saltos siempre perceptibles; (5) usar uno o dos colores de texto y
fondo más un acento, alternando el color de las CTAs según el contraste; (6)
elegir uno o dos tipos de elemento gráfico; (7) fijar un único estilo de
ilustración; y (8) fijar un único tratamiento fotográfico, usando blanco y
negro como recurso unificador cuando las fuentes de imagen son heterogéneas.
El proceso recomendado para aplicar estas ocho reglas es: explorar todas las
variables en una pieza representativa del homepage, auditar el sitio completo
una vez crece, y simplificar cualquier inconsistencia detectada convirtiéndola
en una regla explícita. Toda la evidencia visual corresponde a capturas de
frontend de sitios del portafolio del presentador; ninguna captura demuestra
comportamiento de producción, tráfico real o arquitectura backend. El video
incluye promociones (curso gratuito, programa de mentoría BONT Club,
newsletter) que se documentan como contenido promocional y quedan fuera del
método operativo.

---

## Extensiones profesionales (no atribuidas al video)

Estas recomendaciones no forman parte del contenido original; se agregan como
salvaguardas profesionales relacionadas con el tema del video.

- **Accesibilidad**: al reducir colores y jerarquías, verificar que el
  contraste entre texto y fondo cumpla como mínimo WCAG 2.1 AA (4.5:1 para
  texto normal, 3:1 para texto grande), especialmente en paletas reducidas de
  un único color de acento.
- **Legibilidad y jerarquía por caso**: cuando se usa mayúsculas/minúsculas
  como único diferenciador jerárquico (según describe la Regla 4), verificar
  que los lectores de pantalla no pierdan la distinción semántica; usar
  marcado HTML semántico (`h1`–`h6`) independientemente del estilo visual
  aplicado.
- **Rendimiento**: cuando el "elemento gráfico" elegido incluye video (según
  la Regla 6), aplicar compresión, carga diferida (`lazy loading`) y
  proporcionar una alternativa estática para conexiones lentas o modo de
  ahorro de datos.
- **Movimiento reducido**: si se usan carruseles/sliders (mencionados en el
  Paso 1 del proceso), respetar la preferencia del sistema operativo
  `prefers-reduced-motion` y ofrecer controles de pausa.
- **Consistencia responsiva**: las reglas de espaciado, jerarquía y color
  descritas deben validarse también en viewports móviles, donde el
  espaciado de "150–160 píxeles" puede no ser apropiado sin adaptarlo
  proporcionalmente.
- **Licencia y atribución tipográfica**: al reutilizar un repertorio
  tipográfico fijo entre proyectos (Regla 2), confirmar que la licencia de
  cada tipografía permite su uso en todos los proyectos y clientes donde se
  aplique.
- **Autorización sobre activos de cliente**: al mostrar ejemplos con nombres
  y fotografías reales de clientes (como el caso "John Elway" identificado en
  este documento), un agente que reutilice estos ejemplos como plantilla debe
  confirmar que existe autorización para usar esos nombres e imágenes,
  independientemente de si aparecían así en el material original.
- **Separación de contenido promocional**: cualquier flujo de trabajo
  automatizado que use este documento como base debe excluir explícitamente
  las secciones promocionales (curso gratuito, programa de mentoría,
  newsletter) del conjunto de reglas de diseño operativas, para no mezclar
  incentivos comerciales del creador con criterios de diseño.

[S91]

### Patterns > Niche saturation audit and intentional positioning

Niche saturation audit and intentional positioning

Principle: Before designing a new piece, analyze 10-20 direct competitors in the client's niche to identify what visual conventions are saturated, then consciously decide whether to align with or deliberately disrupt those conventions.

Problem: Prevents producing a design that looks clean and professional in isolation but is effectively invisible because it duplicates the dominant, fast-saturating visual language of its niche.

Source basis: The source explicitly describes running a 'saturation audit' of 10-20 competitors before designing anything, and choosing to align intentionally or disrupt strategically (00:37-02:18), visually confirmed by frame-15pct.png.

Professional extension: None; this pattern stays within what the source states and shows. The claim that this decision 'can double your value' is flagged as an unverified claim, not restated here as fact.

[S92]

### Patterns > Reapply the design system onto the existing project instead of regenerating from scratch

Reapply the design system onto the existing project instead of regenerating from scratch

Principle: Return to the already-generated project and apply the newly created design system as additional context, then write a refinement prompt focused on composition and layout decisions (e.g. full-viewport hero, scroll-parallax animation), rather than discarding the project and starting over.

Problem: Prevents wasted work from full regeneration and ensures the refinement is grounded in the same project the design system was meant to improve.

Source basis: At 07:11 the creator selects the design system via the '+' icon and writes: 'Update the website design layout using design system. Hero screen should be full viewport... Add some parallax on scroll animations with pizzas and ingredients.'

Professional extension: None; this is a direct source observation.

[S93]

### Patterns > Historical classic design styles (block 1)

Historical classic design styles (block 1)

Principle: Eleven styles from design history each mark a complete cultural or artistic movement tied to a specific decade, with a distinct set of visual traits and, in most cases, a documented modern revival.

Problem: Prevents flattening decades of design history into a single generic 'vintage' or 'retro' label, and prevents attributing traits of one historical movement to another.

Source basis: The creator states the origin decade, key visual traits and revival status for each of the 11 styles in this block, in the order listed above.

Professional extension: None added beyond correcting mis-transcribed style names to their standard industry spelling for usability.

[S94]

### Patterns

3 validated rule patterns.

[S95]

### Rules document

There are roughly 30 recognizable graphic design styles, grouped into three blocks: historical classics that defined complete cultural or artistic movements, contemporary styles that have cycled through revivals for decades, and newer digital-first aesthetics born from internet and social media culture. Each style has an identifiable historical origin, a set of recognizable visual traits, and a current application context where it reappears with modern variations.

Historical classic design styles (block 1)

Principle: Eleven styles from design history each mark a complete cultural or artistic movement tied to a specific decade, with a distinct set of visual traits and, in most cases, a documented modern revival.

Problem: Prevents flattening decades of design history into a single generic 'vintage' or 'retro' label, and prevents attributing traits of one historical movement to another.

Source basis: The creator states the origin decade, key visual traits and revival status for each of the 11 styles in this block, in the order listed above.

Professional extension: None added beyond correcting mis-transcribed style names to their standard industry spelling for usability.

Contemporary established design styles (block 2)

Principle: Thirteen styles have been in active circulation for years or decades, most originating as either a reaction against mainstream/corporate aesthetics or as a modern revival of an older cultural reference, each with distinct current-day branding applications.

Problem: Prevents conflating reactionary/anti-corporate styles (anti-design, brutalism) with decorative-revival styles (boho, celestial, western vintage) that share a 'contemporary' label but have opposite intents.

Source basis: The creator states origin period, key visual traits and current application context for each of the 13 styles in this block.

Professional extension: Grouping distinguishing 'reactionary' vs. 'decorative-revival' subtypes within block 2 is an organizational aid added by this dossier; the source itself does not use this sub-grouping.

Recent digital-first aesthetics (block 3)

Principle: Six aesthetics are digital-first and emerged from internet and social media culture, generally as either a reaction to over-digitized design (handmade feel) or as native social-media visual trends (scrapbook, dreamcore).

Problem: Prevents mixing these newer, largely undated micro-aesthetics with the historically-dated styles in blocks 1 and 2, and flags that the source itself considers this list incomplete.

Source basis: The creator names and briefly describes the visual traits of each of the 6 aesthetics, presenting them as the newest, mostly digital-first styles.

Professional extension: Labeling the block as 'largely undated, native social-media aesthetics' as an organizing description is added by this dossier.

- Determine which of the three blocks (historical classic, contemporary established, recent digital) the requested style belongs to.
- Locate the style entry using this file's patterns as a reference index (name, origin period, key traits).
- Extract the actionable visual traits (typography, palette, textures, motifs) from the matching entry before generating or describing a piece in that style.
- Cross-check against the cited frame evidence when a concrete visual reference is needed, without assuming the frame exhausts all variants of the style.
- Distinguish the historical/original phase from the modern revival phase when both are described for the style.
- Flag transcription-uncertain terms ('Anti-design', 'dithered illustration', 'Frasier-core') as corrected spellings rather than assuming the raw auto-caption spelling is authoritative.
- Do not present this material as a step-by-step production tutorial: it documents style identification and context, not exact typefaces, color values, or software workflow.

[S96]

## Coverage and limitations

- Blocks considered: 110
- Blocks included: 96
- The token budget was exhausted; 14 additional block(s) with real evidence were left out.

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
