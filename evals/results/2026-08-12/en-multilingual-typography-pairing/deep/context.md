---
schema_version: "1.0"
query: "font pairing best practices"
depth: deep
estimated_tokens: 63893
sources_used: 22
---

# Context package

## Query and scope

Query: font pairing best practices
Depth: deep (max 64000 estimated tokens)

## Highest-relevance context

### Agent workflow

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

[S01]

### Agent workflow

- Define the desired hierarchy: list which element must be noticed first, second, third, etc., based on what the user needs to accomplish, not on which content subjectively feels most important.
- Apply contrast only to the one element (or small set) that must carry primacy, selecting from the ten ranked techniques (motion, task-related information, white space/focal points, faces, color, size, weight, imagery, extra elements, misalignment) based on how strong or subtle the desired effect should be.
- Apply uniformity to every other element, standardizing size, font, font weight, paragraph height, border color, and corner radius within each repeated group.
- Group similar elements together to reinforce visual cohesion and ease of scanning.
- Choose a composition pattern (top-to-bottom, left-to-right, Z, or F) based on the medium and the relative amount of text, and place the primary element at that pattern's natural entry point.
- Verify color contrast on any critical text or element using a contrast-checking tool, targeting a minimum ratio of 4.5:1.
- Apply moderation to faces and imagery, using them only when directly relevant to the promoted content.
- Confirm that only one element carries absolute primacy and that the rest of the design is deliberately uniform; if several elements compete for top attention, revisit and reinforce uniformity among the non-primary elements.
- Separate time-bound or unverified claims (e.g., specific conversion numbers or third-party tool recommendations) from the stable structural principles of the method.

[S02]

### Agent workflow

- Parse the user's request for mood, era, palette, and project type keywords.
- Match those keywords against the 15 patterns' principle and use-case fields.
- When multiple patterns are plausible (e.g. academia styles, or literal_object_design vs receiptcore_receifty vs trinket_design), disambiguate using the specific palette and motif rules before recommending one.
- Cite at least one concrete rule and one use case from the matched pattern when making a recommendation.
- For trinket_design, explicitly disclose the lack of confirmed visual evidence before presenting it with the same confidence as the other patterns.
- Never present a Kittl product mention (font panel, design bundles, discount code) as part of the design method itself.
- When verification is requested, point to the exact timestamp cited in context.md and transcript/source.txt rather than paraphrasing from memory.

[S03]

### Método completo de la fuente > Principio 2 — Establish visual hierarchy around the primary task

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

[S04]

### Agent workflow

- Identify the project's niche and gather 10-20 direct competitor references before starting design work.
- Analyze those references to determine what is visually saturated, predictable and expected in the niche.
- Decide and document whether to align intentionally with niche conventions or disrupt them strategically, based on the brief.
- When communicating with the client (proposal, portfolio, email), frame the work in terms of objective, constraint, strategic choice and outcome, and write with clear, structured, decisive language.
- Design the piece according to the brief and the chosen positioning decision.
- If the piece is intended for fast consumption (social media, ads), zoom it to approximately 10-15% scale and verify a single dominant entry point; if it fails, duplicate, simplify, increase contrast/spacing, and retest.
- If the deliverable is a sequence of related pieces, plan the full narrative progression (tension, expansion, emphasis shift, breather, resolution) before designing each individual piece.
- If recommending a third-party tool, disclose any sponsorship or discount-code relationship and keep it separate from the strategic method.
- Before final delivery, confirm the piece or sequence satisfies the brief, the niche-positioning decision, the thumbnail test (if applicable), and the narrative progression (if applicable).

[S05]

### Agent workflow

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

[S06]

### Agent workflow

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

[S07]

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

[S08]

### Agent workflow

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

[S09]

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

[S10]

### Flujo integrado para el agente

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

[S11]

### Agent workflow

- Confirm the target domain is appropriate for brutalism (creative/cultural) or document explicit justification for a high-trust domain.
- Define the intended message of authenticity, rebellion, or differentiation before choosing typography or color.
- Choose a bold typographic base: a clean geometric sans-serif (e.g., Helvetica, Proxima Nova) or an experimental/clunky mix, sized to dominate the composition.
- Build a real functional grid first, then introduce deliberate, justifiable breaks (overlap, misalignment, bleed).
- Select one color extreme: high-contrast black-and-white, or saturated clashing color; avoid intermediate palettes.
- Add grain, noise, or pixelation texture with a stated expressive purpose.
- Audit the result against the four core characteristics (grid, typography, color, and, for digital products, intentional UX friction).
- Separate any cultural/market explanation of the style's appeal from verified data, labeling it explicitly as interpretation.
- For digital products, review accessibility (keyboard navigation, screen-reader support, reduced-motion alternative) before shipping any intentional UX friction.

[S12]

### Reglas operativas

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

[S13]

### Método completo de la fuente > Segmento promocional — Fontbase (excluido del método)

Entre aproximadamente los minutos 04:37 y 06:46, el video presenta un patrocinio explícito de **Fontbase**, un gestor de fuentes gratuito y de pago para Mac, Windows y Linux. El presentador describe funciones como el "font playground" (para probar combinaciones tipográficas y espaciado), el "font pinning" (fijar una fuente mientras se comparan otras), integración directa con Google Fonts, "super search" (análisis de contraste, peso y proporciones de las fuentes, disponible en la versión de pago "Fontbase Awesome") y activación automática de fuentes faltantes en aplicaciones de Adobe. El presentador ofrece un código de descuento propio ("Sattorii") para probar las funciones premium gratis durante 3 meses.

`frame-25pct.png` y `frame-30pct.png` muestran capturas de pantalla reales de la interfaz de Fontbase, con listas de fuentes mostrando el texto de prueba "The quick brown fox jumps over the lazy dog" en distintas tipografías, confirmando visualmente que la demostración de interfaz ocurrió tal como se describe en el audio.

Este segmento se separa explícitamente del método porque:

- Es un patrocinio pagado con un código de descuento personal del creador, es decir, tiene un incentivo comercial declarado.
- Las capturas de pantalla de la interfaz de Fontbase demuestran que el producto existe y tiene esas funciones visibles en pantalla, pero **no demuestran** que la herramienta sea necesaria para aplicar los otros tres principios del video, que son independientes de cualquier software específico.
- No se debe presentar el uso de Fontbase como parte del "método de pensamiento elite" que es el tema central del video.

**Clasificación de evidencia**: promoción declarada + confirmación visual de la interfaz (no de resultados de negocio).

[S14]

### Agent workflow

- Identify the user task, risk, and necessary content before choosing a trend.
- Select one primary trend and document why it improves the task.
- Build the semantic static path, hierarchy, and CTA first.
- Add expressive treatment with accessible, performance-aware fallbacks.
- Test contrast, focus, keyboard, touch, zoom, reduced motion, and mobile loading.
- Verify consent, authorization, licensing, and evidence boundaries before release.

[S15]

### Agent workflow

- Determine which of the three blocks (historical classic, contemporary established, recent digital) the requested style belongs to.
- Locate the style entry using this file's patterns as a reference index (name, origin period, key traits).
- Extract the actionable visual traits (typography, palette, textures, motifs) from the matching entry before generating or describing a piece in that style.
- Cross-check against the cited frame evidence when a concrete visual reference is needed, without assuming the frame exhausts all variants of the style.
- Distinguish the historical/original phase from the modern revival phase when both are described for the style.
- Flag transcription-uncertain terms ('Anti-design', 'dithered illustration', 'Frasier-core') as corrected spellings rather than assuming the raw auto-caption spelling is authoritative.
- Do not present this material as a step-by-step production tutorial: it documents style identification and context, not exact typefaces, color values, or software workflow.

[S16]

## Related rules and patterns

### Patterns > Verify text-to-background contrast against a minimum ratio > Acceptance criteria

Every text/background color pairing in the reviewed deliverable has a documented, measured contrast ratio.

[S17]

### Patterns > Verify text-to-background contrast against a minimum ratio > Avoid

Approving a text/background color pairing based on visual impression alone, without measuring contrast.

[S18]

### Patterns > Uniformity gives structure through predictability and cohesion > Rules

Give every element of the same type in a group the exact same size, font, font size, font weight, paragraph height, border color, and corner radius.

[S19]

### Patterns > Depth, type, and purposeful motion > Rules

Set font fallbacks and performance budgets before shipping depth or variable type.

[S20]

### Patterns > Uniformity gives structure through predictability and cohesion > Acceptance criteria

Elements of the same repeated type share size, font, font weight, paragraph height, border color, and corner radius exactly.

[S21]

### Patterns > Match typeface tone to project intent

Match typeface tone to project intent

Principle: A typeface communicates a tone of voice before its content is read; the choice of typeface must match the communicative energy required by the project.

Problem: Prevents choosing a typeface based purely on aesthetic taste while ignoring whether its tone fits the project's audience and purpose (e.g. a playful font for a law firm).

Source basis: The source states typography is 'the Art and Science of arranging text to be both legible and appealing' (00:00) and explicitly compares font choice to choosing a tone of voice, citing a clown vs. a lawyer and a wedding photographer vs. an eye doctor (00:30).

Professional extension: None; this pattern is drawn directly from the source's stated method.

[S22]

### Patterns > Uniformity gives structure through predictability and cohesion

Uniformity gives structure through predictability and cohesion

Principle: Elements of the same type (such as repeated cards) must share identical visual values -- size, font, font weight, paragraph height, border color, corner radius -- so the group reads as a cohesive, unified section rather than competing for attention.

Problem: Prevents a design where repeated elements of the same type look subtly different from each other, which breaks visual cohesion and makes a design look messy rather than balanced.

Source basis: Stated directly as Rule 4 (09:48-11:20) using the product-benefits-cards example, specifying exactly which values must match across cards, and naming this practice 'cohesion.'

Professional extension: None; the specific list of values to standardize (image size, font, font size, font weight, paragraph height, border color, corner radius) is stated directly in the source.

[S23]

### Patterns > Surveillance design > Rules

Pair with messaging that is explicitly about data, technology, or surveillance for best effect, per the source.

[S24]

### Patterns > Text-led clarity > Rules

Make text hierarchy survive font fallback and zoom.

[S25]

### Patterns > Typography as the protagonist element

Typography as the protagonist element

Principle: With few other elements present, typeface choice carries most of a minimalist design's personality and communicative weight.

Problem: Prevents flat, personality-less results from careless or inconsistent font choices, and prevents unnecessary mixing of typefaces.

Source basis: The source names specific sans-serif and serif typefaces it favors (Helvetica, Futura, and others transcribed as 'Aanir', 'New Hoscrotesque', 'Hot Take', 'Inter Variable', 'Instrument Serif', 'Perfectly '90s') and explains typography's dominant role directly (03:07-04:42).

Professional extension: None added beyond noting that some proper nouns are ASR transcriptions with uncertain spelling.

[S26]

### Patterns > Anchor the day with a slow, deliberate start > Acceptance criteria

The routine allows for user-chosen practices rather than forcing one specific ritual.

[S27]

### Patterns > Anchor the day with a slow, deliberate start

Anchor the day with a slow, deliberate start

Principle: Starting the day slowly and deliberately, rather than rushing into tasks, establishes the equivalent of roots that let the day's intentional pursuits thrive with less effort later, using the tree-growth metaphor.

Problem: Rushing directly into tasks without a deliberate start makes it harder to maintain awareness of purpose throughout the day, undermining the other minimalism practices.

Source basis: Stated directly at 05:51-06:55, including the tree metaphor and named example practices.

Professional extension: None; this pattern is taken directly from the source without extension.

[S28]

### Patterns > Cross-context application and durability > Rules

Apply the same core principles (grid, white space, typography, restrained color) regardless of medium (print, web, packaging, social).

[S29]

### Patterns > High-saturation, low-palette-count color blocking > Rules

Document the specific color pairing observed per example rather than generalizing 'brutalist = bright colors' without evidence.

[S30]

### Patterns > Southwestern > Rules

Pair with fonts that carry a vintage or western-folk feel.

[S31]

### Patterns > Reduce typefaces per project

Reduce typefaces per project

Principle: Use a maximum of one or two typefaces per individual project, typically one display typeface for titles and one neutral typeface for body copy.

Problem: Prevents visual chaos caused by mixing too many typefaces within a single identity.

Source basis: The source states this directly (04:39-06:14) and demonstrates it with three portfolio examples (PP Hatton + Helvetica Neue; Univers + Akzidenz-Grotesk; Clarendon + Futura).

Professional extension: None added; this pattern is taken directly from the source without extension.

[S32]

### Patterns > Pair product/place images with human-use ('lifestyle') images > Rules

Use this pairing specifically to support narrative and perceived value, not as a decorative default.

[S33]

### Patterns > Literal Object Design > Rules

Match fonts to the object being imitated, often monospace for receipt-like items.

[S34]

### Patterns > Master a few typefaces

Master a few typefaces

Principle: Build and reuse a small personal repertoire of typefaces across projects instead of choosing new ones for every project.

Problem: Prevents shallow familiarity with any single typeface's whitespace, kerning, and contrast behavior across sizes and backgrounds.

Source basis: The source states this directly (02:48-04:39), including the presenter's personal typeface preferences and the Massimo Vignelli example (unverified claim of ten typefaces across his career).

Professional extension: None added; the Vignelli figure is flagged in evidence.limitations as an unverified claim rather than extended.

[S35]

### Patterns > Typography as the protagonist element > Rules

Favor clean sans-serif fonts with carefully considered sizes and weights for most minimalist work.

[S36]

### Patterns > Explicitly declare project trade-offs > Acceptance criteria

No deliverable claims simultaneous best-in-class performance across all quality dimensions without qualification.

[S37]

### Patterns > Explicitly declare project trade-offs > Avoid

Promising that a project will simultaneously achieve the best possible outcome across features, SEO, UX, conversion, performance, accessibility, and design.

[S38]

### Patterns > Turn intent into a searchable style brief

Turn intent into a searchable style brief

Principle: Pair a style name with medium and visual modifiers, then compare multiple references before committing.

Problem: Prevents vague searches and copying the first result.

Source basis: The source repeatedly frames names as keywords for faster reference search.

Professional extension: Comparing multiple references and documenting the brief protects originality.

[S39]

### Patterns > Catalog of twelve grid systems and their use cases > Rules

Modular grid: give each product/image/graphic its own module for e-commerce-style consistency; vary module size to highlight best-sellers or featured items.

[S40]

### Patterns > Present relational quality time as the top-ranked benefit

Present relational quality time as the top-ranked benefit

Principle: Among all declared benefits, the creator explicitly ranks quality time with loved ones as the best byproduct of minimalism, above creative workflow gains, cleanliness or savings.

Problem: Minimalism advice can overemphasize productivity or aesthetics and omit the relational payoff the source considers most important, misrepresenting the source's own priority order.

Source basis: Stated directly at 11:36-12:39, including the explicit ranking language ('the best byproduct').

Professional extension: None; this pattern is taken directly from the source without extension.

[S41]

### Patterns > Use blend modes to keep overlaid text legible on imagery

Use blend modes to keep overlaid text legible on imagery

Principle: When large text is placed over a photographic image, evaluate a blend mode (such as 'difference') instead of a flat overlay to create contrast while preserving image texture.

Problem: Prevents choosing only a flat color overlay by default, which can flatten photographic texture unnecessarily.

Source basis: The source describes trying a 'difference' blending mode to create contrast between images and overlapping text (16:19-16:50).

Professional extension: Verifying legibility across the full text area, rather than a single sample point, is added rigor beyond what the source explicitly demonstrates.

[S42]

### Patterns > Trend 4: Text-heavy sites as pattern interrupt > Acceptance criteria

Text-heavy sections are readable (adequate line length, contrast, and font size) despite their density.

[S43]

### Patterns > Prioritize copy over visual composition

Prioritize copy over visual composition

Principle: The written copy of a site is the biggest factor in client outcomes, more than the visual design itself.

Problem: Prevents visual design competing with and drowning out the message that actually persuades visitors.

Source basis: The source states at 00:52-01:16 that copy is the biggest factor in client success and quotes 'design matters, but words close deals,' concluding the designer's job includes making people pay attention to the words.

Professional extension: None; this pattern is derived directly from the source's stated method.

[S44]

### Patterns > Emotional typography (kerning and stroke weight) > Rules

Use tight kerning combined with italics when the design needs to communicate urgency or forward motion.

[S45]

### Patterns > Calculated friction balanced with flow > Rules

Limit the number of competing fonts, colors, and focal points; tighten spacing only where it serves a purpose.

[S46]

### Patterns > Emotional typography (kerning and stroke weight) > Rules

Use generous kerning (optionally paired with a serif typeface) when the design needs to feel relaxed or premium.

[S47]

### Patterns > Barely there UI

Barely there UI

Principle: Hyper-minimal interfaces borrowed from the leading AI companies: thin sans serifs, stripped-down layouts, dialed-back palettes, generous white space, and data graphs everywhere.

Problem: Prevents visual noise from competing with the message on product and startup sites where credibility depends on looking restrained and technical.

Source basis: The video states this trend is driven by venture capital flowing into AI, names OpenAI and Perplexity as the hyper-minimal references, predicts it will grow through 2026, and gives the three application tips (fewer colors, one font family, more white space).

Professional extension: The contrast and discoverability requirements are added by this dossier, because thin type on dialed-back palettes is the most common accessibility failure of this aesthetic and the video does not address it.

[S48]

### Patterns > Receiptcore / Receifty > Avoid

Treating the two variants (realistic plain receipt vs. decorated pastel receipt) as interchangeable without picking one deliberately for tone.

[S49]

### Patterns > Web brutalism definition and characteristic checklist > Rules

Check a candidate design against the full characteristic list: asymmetry, broken hierarchy, broken grids/typography, big bold fonts, geometric shapes, overlapping elements, solid white borders, hard shadows, solid backgrounds, bright colors.

[S50]

## Additional relevant context

### Patterns > Verify text-to-background contrast against a minimum ratio

Verify text-to-background contrast against a minimum ratio

Principle: Legible typography requires sufficient color contrast between text and background, measured with a documented contrast ratio, with the source citing a 7:1 minimum guideline traced to 1999 W3C accessibility guidelines.

Problem: Prevents shipping designs where text is visually present but functionally illegible due to insufficient contrast against its background.

Source basis: The source explains accessible contrast as the color difference between typography and background, traces the concern to Flash-era illegible websites and 1999 W3C accessibility guidelines, and cites a recommended minimum contrast ratio of 7:1 and the tool webaim.org (10:17-10:49).

Professional extension: None beyond restating the source's own recommended verification step; this dossier does not add a different ratio.

[S51]

### Patterns

14 validated rule patterns.

[S52]

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

[S53]

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

[S54]

### Patterns > Depth, type, and purposeful motion

Depth, type, and purposeful motion

Principle: Use layers, large/variable typography, and kinetic feedback only when they clarify grouping, message, or state change.

Problem: Flat layouts may hide relationships, while inert controls can leave actions ambiguous.

Source basis: The source discusses depth-based interfaces, variable/maximalist typography, and kinetic interaction from 04:14 to 06:50.

Professional extension: Semantic order, fallbacks, and performance budgets are implementation safeguards.

[S55]

### Patterns

5 validated rule patterns.

[S56]

### Rules document

Select web-design trends as task-serving interaction and communication choices: make intent and next actions clear, then add expressive visuals without sacrificing accessibility, performance, or honest evidence.

Action-first guidance

Principle: Use intent-aware suggestions to reduce decision effort while preserving user agency.

Problem: Information-only interfaces leave users to infer the next useful step.

Source basis: The source describes dashboards, checkout, and tools that suggest or perform task steps around 00:35.

Professional extension: Consent, authorization, explanations, and undo are required safeguards not established by the video.

Expressive progressive storytelling

Principle: Combine art direction, summaries, and paced disclosure so a page can be memorable without obscuring its message.

Problem: Generic layouts are forgettable, while long undifferentiated content creates drop-off.

Source basis: The source presents art-directed interfaces, TL;DR experience, and scroll-directed storytelling between 01:06 and 03:11.

Professional extension: Static fallbacks, accessibility, and licensing controls are added safeguards.

Warm humanized surface

Principle: Use soft forms, approachable language, and intentional handmade detail to reduce intimidation while keeping controls precise.

Problem: Cold or template-like products can feel impersonal and difficult to approach.

Source basis: The source names warm aesthetics/cute-alism and intentional imperfection as trends around 03:24 and 04:48.

Professional extension: Contrast, zoom, and error-state requirements are added for inclusive operation.

Depth, type, and purposeful motion

Principle: Use layers, large/variable typography, and kinetic feedback only when they clarify grouping, message, or state change.

Problem: Flat layouts may hide relationships, while inert controls can leave actions ambiguous.

Source basis: The source discusses depth-based interfaces, variable/maximalist typography, and kinetic interaction from 04:14 to 06:50.

Professional extension: Semantic order, fallbacks, and performance budgets are implementation safeguards.

Future-past aesthetics with restraint

Principle: Reinterpret retro visual cues through a consistent modern system rather than reproducing obsolete usability patterns.

Problem: Nostalgia can become incoherent, inaccessible, or outdated when it lacks a design system.

Source basis: The source characterizes future-past aesthetics as modern reinterpretation of 80s, 90s, and early-web cues around 06:50.

Professional extension: Trademark, copyright, and responsive-use requirements are added safeguards.

- Identify the user task, risk, and necessary content before choosing a trend.
- Select one primary trend and document why it improves the task.
- Build the semantic static path, hierarchy, and CTA first.
- Add expressive treatment with accessible, performance-aware fallbacks.
- Test contrast, focus, keyboard, touch, zoom, reduced motion, and mobile loading.
- Verify consent, authorization, licensing, and evidence boundaries before release.

[S57]

### Patterns

6 validated rule patterns.

[S58]

### Rules document

Fifteen niche graphic design styles each have a specific, searchable name and a small set of recognizable visual traits (palette, typography, motif); knowing the correct keyword is the main lever for finding accurate visual references on search engines and Pinterest instead of relying on generic descriptive terms.

Neo-Frutiger Aero

Principle: A revival of the bubbly, techy, optimistic early-2000s aesthetic, combining the clarity of Frutiger-style typefaces with a dreamy, nostalgic digital feel described as retro-futurism mixed with MySpace-era energy.

Problem: Prevents mislabeling early-2000s glossy tech aesthetics as generic 'retro' or 'Y2K' without the specific visual vocabulary needed to find matching references.

Source basis: The presenter names the style, explains its early-2000s revival concept, and lists its core features and use cases verbally (00:31-02:07).

Professional extension: None added; the pattern reflects the source description directly.

Dark / Gothic Academia

Principle: A moody, intellectual design style inspired by classic literature, European universities, and vintage aesthetics, evoking mystery, melancholy, and romanticism.

Problem: Prevents confusing this with generic 'gothic' horror styling by anchoring it to academic, literary, and vintage-object motifs rather than horror imagery.

Source basis: The presenter defines the style, its mood, and lists its core features and use cases verbally (02:07-03:41), confirmed by the matching on-screen slide.

Professional extension: None added; the pattern reflects the source description directly.

Light Academia

Principle: The brighter, more optimistic counterpart of dark academia, keeping the love for knowledge, arts, and vintage style but replacing gloom with soft pastel warmth.

Problem: Prevents treating 'academia' aesthetics as a single dark-only style, missing the pastel, sunlit variant that fits different brand tones.

Source basis: The presenter defines the style as the brighter version of dark academia and lists its core features and use cases verbally (03:41-05:15), confirmed by the matching supplemental frame.

Professional extension: None added; the pattern reflects the source description directly.

Wabi-sabi

Principle: A Japanese aesthetic that finds beauty in imperfection and the aging of natural materials, favoring soft, earthy, peaceful compositions over loud or flashy design.

Problem: Prevents conflating wabi-sabi with generic minimalism, missing its emphasis on irregularity, imperfection, and organic texture.

Source basis: The presenter defines wabi-sabi, its mood, and its core features and use cases verbally (05:45-06:46), confirmed by the matching on-screen slide.

Professional extension: None added; the pattern reflects the source description directly.

Southwestern

Principle: A warm, rustic style pulled directly from American Southwest imagery: deserts, cacti, cowboys, and sun-baked color palettes.

Problem: Prevents defaulting to generic 'western' or 'rustic' tags when the source specifies a distinct terracotta/turquoise/tribal-pattern palette.

Source basis: The presenter defines the style and lists its core features and use cases verbally (06:46-07:49), confirmed by the matching on-screen slide.

Professional extension: None added; the pattern reflects the source description directly.

Nautical

Principle: A crisp, timeless style inspired by the sea, sailing culture, and coastal living, built heavily around rope, anchor, and navigational motifs.

Problem: Prevents vague 'ocean' or 'beach' searches from missing the specific rope/anchor/navy-blue visual vocabulary that defines this style.

Source basis: The presenter defines the style, recommends the 'nautical tattoo' search combination, and lists core features and use cases verbally (08:20-09:22), confirmed by the matching frame.

Professional extension: None added; the pattern reflects the source description directly.

Rebus

Principle: A visual word puzzle style where letters or words are combined with pictures or icons to convey meaning, creating a playful, attention-catching, decodable message.

Problem: Prevents treating any icon-plus-text layout as 'rebus' without the deliberate word-puzzle/decoding intent the source specifies.

Source basis: The presenter defines rebus, its core features, and its use cases verbally (09:22-10:24), confirmed by the matching on-screen slide.

Professional extension: None added; the pattern reflects the source description directly.

Literal Object Design

Principle: A style that mimics a real-life printed object (a boarding pass, receipt, file, or label) and places it on a different surface or product, trading on nostalgia and unexpected familiarity.

Problem: Prevents treating this as a single fixed look; the source frames it as a broad category requiring the designer to pick a concrete real-world object to imitate.

Source basis: The presenter defines the style, clarifies it is a broad category, and lists its core features and use cases verbally (10:24-11:56).

Professional extension: The dossier notes the visual overlap with receiptcore_receifty and trinket_design as a limitation, since the source itself does not fully disambiguate the categories.

Trinket Design

Principle: A playful, cluttered style resembling the contents of a childhood toy box - pins, charms, plastic figurines - arranged like a sticker sheet brought to life.

Problem: Prevents confusing generic 'cute clutter' styling with the specific bright, candy-colored, cutout-object composition the source describes.

Source basis: The presenter defines the style and lists its core features and use cases verbally only (11:56-12:59); no matching visual slide was found in the 20 uniform frames or in the supplemental frames tested.

Professional extension: The dossier explicitly flags the absence of visual confirmation as a limitation rather than asserting it as demonstrated.

Glassmorphism

Principle: A modern, digital-first style that makes layouts look like frosted or cut glass, using blur, glow, and transparency for a high-tech, futuristic feel.

Problem: Prevents treating any blurred UI panel as glassmorphism without the specific frosted-glass, glowing-edge, layered-transparency signature the source describes.

Source basis: The presenter defines glassmorphism and lists its core features and use cases verbally (12:59-14:01), confirmed by both supplemental frames.

Professional extension: None added; the pattern reflects the source description directly.

Modular Typography

Principle: Letterforms constructed from a repeating set of basic shapes (circles, squares, dots, lines), giving type a building-block, puzzle-like, custom-geometric feel.

Problem: Prevents confusing any geometric sans serif type with modular typography, which specifically requires letters built from a single repeatable base unit.

Source basis: The presenter defines the style and lists its core features and use cases verbally (14:01-15:02), confirmed by the matching on-screen slide.

Professional extension: None added; the pattern reflects the source description directly.

Receiptcore / Receifty

Principle: A style that literally mimics the look of a physical receipt, in either a decorated pastel-paper variant or a realistic plain white grocery-receipt variant, originating from a third-party Spotify-linked service called Receifty.

Problem: Prevents conflating this with generic 'vintage paper' styling by anchoring it to the specific monospace/barcode/vertical-layout signature of an actual receipt.

Source basis: The presenter defines the style, its two variants, its Spotify-linked origin, and lists its core features and use cases verbally (15:02-17:06), confirmed by the matching frame.

Professional extension: None added; the pattern reflects the source description directly.

Narrative Neo-Brutalism

Principle: A louder, raw, text-heavy design style that mixes hard-edged utilitarian brutalist visuals with storytelling energy, prioritizing message over polished imagery.

Problem: Prevents plain 'narrative design' searches from returning irrelevant results, since the source specifies the term must be paired with 'neo brutalism' to work.

Source basis: The presenter defines the style, the search-term caveat, and lists its core features and use cases verbally (17:06-18:08), confirmed by the matching supplemental frame.

Professional extension: None added; the pattern reflects the source description directly.

Modern Nostalgia

Principle: A style that blends retro design cues from the 70s-90s (packaging, ads, cassette tapes, polaroids) with a modern layout and digital polish on top.

Problem: Prevents defaulting to a single decade's retro look when the source specifically calls for blending multiple retro eras with a clean modern finish.

Source basis: The presenter defines the style and lists its core features and use cases verbally (18:08-19:42), confirmed by the matching on-screen slide.

Professional extension: None added; the pattern reflects the source description directly.

Swiss Punk Typography

Principle: A rebellious evolution of clean, gridded Swiss typographic design where elements are rotated, layered, duplicated, and deliberately noisy, while keeping sans serif fonts and an underlying grid.

Problem: Prevents treating any messy or glitchy typographic layout as this style without the specific 'broken Swiss grid' collage logic the source describes.

Source basis: The presenter defines the style and lists its core traits and use cases verbally (19:42-20:44), confirmed by the matching supplemental frame.

Professional extension: None added; the pattern reflects the source description directly.

- Parse the user's request for mood, era, palette, and project type keywords.
- Match those keywords against the 15 patterns' principle and use-case fields.
- When multiple patterns are plausible (e.g. academia styles, or literal_object_design vs receiptcore_receifty vs trinket_design), disambiguate using the specific palette and motif rules before recommending one.
- Cite at least one concrete rule and one use case from the matched pattern when making a recommendation.
- For trinket_design, explicitly disclose the lack of confirmed visual evidence before presenting it with the same confidence as the other patterns.
- Never present a Kittl product mention (font panel, design bundles, discount code) as part of the design method itself.
- When verification is requested, point to the exact timestamp cited in context.md and transcript/source.txt rather than paraphrasing from memory.

[S59]

### Patterns > Surveillance design

Surveillance design

Principle: Pulls visual language from CCTV footage, UI overlays, thermal imaging, timestamps, and biometric graphics.

Problem: Names an intense, on-edge style for conceptual posters and tech/data-themed branding.

Source basis: The source names the style, describes its visual traits, and mentions the channel's own tutorial on creating it in Kittl.

Professional extension: None beyond search-query phrasing guidance; the referenced external tutorial is not independently verified here.

[S60]

### Patterns

20 validated rule patterns.

[S61]

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

[S62]

### Patterns > Text-led clarity

Text-led clarity

Principle: When text is the primary visual element, make hierarchy, copy, and interaction states exceptionally explicit.

Problem: Minimal or text-only pages can become ambiguous when labels and reading order are weak.

Source basis: The source names text-only websites and shows text-led portfolio examples.

Professional extension: Semantic structure and zoom testing are added accessibility requirements.

[S63]

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

[S64]

### Rules document

Minimalist graphic design endures in modern design because it communicates clearly with the fewest possible elements: intentional grid-based layout, protagonist typography, a restrained color palette, and generous, purposeful white space. This economy is not effortless; achieving an appealing result with very few elements is described as demanding real skill and practice, and it endures because it is grounded in stable principles (clarity, balance, function) rather than passing trends.

Grid-based layout and visual hierarchy

Principle: A minimalist composition uses a grid system for alignment and stability, with a clear visual hierarchy guiding the viewer's eye, even when the layout is asymmetric.

Problem: Prevents compositions that feel arbitrary, unbalanced, or like elements were added as an afterthought.

Source basis: The source explicitly describes grid systems, alignment, and intentional placement as key identifiers of minimalist layout (01:02-02:04), and recommends a grid-systems book as further reading (02:04-02:36).

Professional extension: None added; this pattern stays within what the source states and shows.

Purposeful white space

Principle: White space is an active design tool that gives a composition room to breathe and directs focus, not empty leftover area.

Problem: Prevents saturated compositions where nothing stands out because everything competes for attention.

Source basis: The source states white space is used generously and explains its function directly (02:36-03:07), including that this style is more difficult to execute well than layered, decorative styles.

Professional extension: None added; this pattern stays within what the source states.

Typography as the protagonist element

Principle: With few other elements present, typeface choice carries most of a minimalist design's personality and communicative weight.

Problem: Prevents flat, personality-less results from careless or inconsistent font choices, and prevents unnecessary mixing of typefaces.

Source basis: The source names specific sans-serif and serif typefaces it favors (Helvetica, Futura, and others transcribed as 'Aanir', 'New Hoscrotesque', 'Hot Take', 'Inter Variable', 'Instrument Serif', 'Perfectly '90s') and explains typography's dominant role directly (03:07-04:42).

Professional extension: None added beyond noting that some proper nouns are ASR transcriptions with uncertain spelling.

Restrained, softened color palette

Principle: Minimalist designs limit themselves to one or two neutral base colors, optionally softened, plus at most one accent color.

Problem: Prevents visually cold, harsh results on screen and prevents color choices that dilute brand recognition.

Source basis: The source explains neutral-plus-accent palettes and the preference for softened black/white tones directly (05:13-06:13).

Professional extension: None added; this pattern stays within what the source states.

Cross-context application and durability

Principle: Minimalist design is applied across branding, web, packaging, social media, and UX because it communicates at a glance and endures by relying on stable principles rather than trends.

Problem: Prevents treating minimalism as a temporary aesthetic trend instead of a durable, function-first approach, and prevents overloading digital experiences with unnecessary elements.

Source basis: The source lists application contexts (logos, web, packaging, social media, tech, luxury brands, lifestyle) and explains durability through stable principles directly (07:16-08:19).

Professional extension: None added; this pattern stays within what the source states.

- Explain the historical grounding (Bauhaus, Swiss design) to frame minimalism as a functional tradition, not a trend.
- Establish layout: define a grid, decide visual hierarchy, decide on symmetric or controlled-asymmetric composition.
- Reserve purposeful white space; avoid filling the canvas by default.
- Choose a limited, coherent typographic system appropriate to the amount of text and the desired tone (sans-serif vs. serif).
- Define a restrained color palette: one or two neutral base colors, optionally softened, plus at most one accent.
- Verify the piece communicates its core message at a glance, especially for digital/UX contexts.
- If teaching the style, use a reference-and-recreate method (save curated examples, recreate them, articulate why they work).
- Before finalizing, check the piece against the antipattern list.
- Clearly separate any recommended external resource (book, template, subscription) from the design principle being taught.

[S65]

### Método completo de la fuente

Método completo de la fuente

[S66]

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

[S67]

### Patterns

8 validated rule patterns.

[S68]

### Rules document

Minimalism is a sustained daily habit of intentionally owning, using and committing to only what is essential, not a one-time decluttering event and not a synonym for organization; practiced consistently through small daily actions with a conscious sense of purpose, it minimizes distractions and frees mental space for creative focus and, above all, for quality time with the people who matter.

Define minimalism precisely before acting

Principle: Minimalism means owning and using only what is essential and valuable, intentionally reducing excess possessions, distractions and commitments, across physical space, time, energy and mental space.

Problem: Without a strict definition, minimalism collapses into vague decluttering advice or gets conflated with organization, losing its intentional, mental-space dimension.

Source basis: The creator states this definition verbatim at 00:10, including the closing summary phrase 'less is more'.

Professional extension: None; this pattern is taken directly from the source without extension.

Separate organization from minimalism

Principle: Organization is creating structure/systems for belongings; minimalism is a lifestyle of intentional living with less. They often complement each other but are not the same, and neither requires the other.

Problem: Users and advice-givers frequently treat 'get organized' and 'become minimalist' as interchangeable, which produces advice that optimizes storage systems instead of reducing what is owned or committed to.

Source basis: Stated directly at 01:14-02:15, including the creator's own account of being organized before becoming minimalist.

Professional extension: None; this pattern is taken directly from the source without extension.

Run an initial audit of possessions and spaces

Principle: The first operational step is systematically reviewing physical and digital spaces (closet, drawers, car, phone apps, laptop, the junk drawer) and asking, for each item, whether it is truly needed.

Problem: Without a concrete, itemized starting audit, 'be more minimalist' remains an abstract intention with no actionable entry point.

Source basis: Narrated at 02:15-02:45 and directly confirmed by the handwritten list visible in frame-25pct.png and supplemental-255s.png.

Professional extension: None; this pattern is taken directly from the source without extension.

Sustain the habit with daily microactions

Principle: Once the initial audit is done, minimalism is maintained through small, low-cost, frequent daily actions rather than large one-time purges; each microaction reduces tomorrow's accumulated burden.

Problem: A single decluttering event does not create a lasting habit; without daily reinforcement, clutter and commitments re-accumulate.

Source basis: The creator lists these fourteen concrete microactions verbatim at 02:45-04:18 and explains the compounding mechanism at 03:47-04:18.

Professional extension: None; this pattern is taken directly from the source without extension.

Check purpose to prevent the habit from becoming compulsive

Principle: A minimalism habit can become controlling or compulsive if practiced without a conscious sense of why; the creator explicitly fell into cleaning/organizing/removing constantly with no real goal, and warns this is more dangerous than not living intentionally at all.

Problem: Habitual decluttering behavior can turn into an anxious, purposeless cycle that damages wellbeing instead of supporting it, if the underlying intention is lost.

Source basis: Stated directly at 04:49-05:51, including the creator's personal account of falling into this trap and the quoted warning about 'a never-ending cycle of nothing'.

Professional extension: None; this pattern is taken directly from the source without extension.

Anchor the day with a slow, deliberate start

Principle: Starting the day slowly and deliberately, rather than rushing into tasks, establishes the equivalent of roots that let the day's intentional pursuits thrive with less effort later, using the tree-growth metaphor.

Problem: Rushing directly into tasks without a deliberate start makes it harder to maintain awareness of purpose throughout the day, undermining the other minimalism practices.

Source basis: Stated directly at 05:51-06:55, including the tree metaphor and named example practices.

Professional extension: None; this pattern is taken directly from the source without extension.

Frame distraction minimization as the core benefit

Principle: The central declared benefit of minimalism is not aesthetics or savings but minimizing distractions across life, creativity and relationships; since distractions cannot be fully eliminated, the goal is to minimize them.

Problem: Without this framing, minimalism advice risks focusing on appearance or quantity of possessions rather than on the underlying goal of freeing attention and mental space.

Source basis: Stated directly at 07:25-08:28, following the explicit chapter transition visible in frame-45pct.png.

Professional extension: None; this pattern is taken directly from the source without extension.

Present relational quality time as the top-ranked benefit

Principle: Among all declared benefits, the creator explicitly ranks quality time with loved ones as the best byproduct of minimalism, above creative workflow gains, cleanliness or savings.

Problem: Minimalism advice can overemphasize productivity or aesthetics and omit the relational payoff the source considers most important, misrepresenting the source's own priority order.

Source basis: Stated directly at 11:36-12:39, including the explicit ranking language ('the best byproduct').

Professional extension: None; this pattern is taken directly from the source without extension.

- Present the strict definition of minimalism (possessions + distractions + commitments + intentional living) before any advice.
- Clarify the distinction between organization and minimalism if the user conflates them.
- Guide the user through an initial written audit of physical and digital spaces.
- Convert the audit into a concrete list of low-cost, high-frequency daily microactions.
- Attach a purpose-check safeguard to any recurring organizing/decluttering recommendation.
- Recommend a deliberate slow morning start as a daily anchor practice, allowing the user to choose the specific ritual.
- Frame the overall goal as minimizing distractions, not merely reducing object count.
- When discussing benefits, rank relational quality time as the top benefit, with creative/productivity gains presented as secondary personal testimony.
- Exclude any sponsorship, affiliate link or product promotion from the method explanation.

[S69]

### Rules document

A graphic designer who only thinks visually is under-differentiated in an increasingly saturated and fast-attention market; to raise perceived value and effectiveness in 2026, a designer must simultaneously operate on four non-purely-aesthetic planes: auditing and strategically positioning against niche visual saturation, using psychological biases (authority, clarity) to communicate professional value to clients, optimizing every fast-consumption piece for a 'two-second attention economy' via a thumbnail-scale test, and architecting visual narrative across sequences of related pieces (carousels, campaigns) instead of treating each piece as an isolated unit.

Niche saturation audit and intentional positioning

Principle: Before designing a new piece, analyze 10-20 direct competitors in the client's niche to identify what visual conventions are saturated, then consciously decide whether to align with or deliberately disrupt those conventions.

Problem: Prevents producing a design that looks clean and professional in isolation but is effectively invisible because it duplicates the dominant, fast-saturating visual language of its niche.

Source basis: The source explicitly describes running a 'saturation audit' of 10-20 competitors before designing anything, and choosing to align intentionally or disrupt strategically (00:37-02:18), visually confirmed by frame-15pct.png.

Professional extension: None; this pattern stays within what the source states and shows. The claim that this decision 'can double your value' is flagged as an unverified claim, not restated here as fact.

Authority-bias and clarity-bias client communication

Principle: Describe design work in terms of strategic objective, constraint and outcome (authority bias) and communicate with clients in a structured, decisive, clear way (clarity bias) to raise perceived professional seniority and reduce client uncertainty.

Problem: Prevents a designer's portfolio, proposals and emails from reading as casual or vague, which signals junior status and creates client uncertainty regardless of actual design quality.

Source basis: The source explicitly contrasts a casual portfolio description with a strategic one (authority bias) and explains that structured, confident communication reduces client uncertainty (clarity bias) (02:51-04:02), visually confirmed by frame-15pct.png and frame-20pct.png.

Professional extension: None; the pattern reflects the source's stated framework. No primary evidence (studies, client conversion data) validating the psychological effect is cited by the source, and none is added here.

Thumbnail-scale cognition speed test

Principle: Test every fast-consumption design (social media posts, ads) by zooming it out to approximately 10-15% scale to verify it has a single dominant visual entry point and minimal competing elements, since viewers judge such pieces in roughly two seconds.

Problem: Prevents shipping a design that looks polished at full size but fails to communicate a clear focal message when scrolled past quickly at thumbnail scale, losing the viewer's attention.

Source basis: The source explicitly describes the '2-second attention economy' and walks through a zoom-to-10%-scale, duplicate-and-simplify exercise (06:46-08:56), visually confirmed by frame-40pct.png through frame-55pct.png.

Professional extension: None added beyond the source's own exercise; the specific '2-second' figures are flagged in evidence.limitations as unverified rather than restated as measured fact.

Visual narrative architecture across sequences of pieces

Principle: When designing a sequence of related pieces (a carousel, a campaign), plan a deliberate narrative progression across the sequence -- tension, expansion, emphasis shift, visual breather, resolution -- instead of repeating the same layout structure in every piece.

Problem: Prevents treating a designer as a mere 'asset producer' who ships visually consistent but narratively flat sequences, where every piece looks the same and no rhythm or pacing is built across the set.

Source basis: The source explicitly walks through a five-slide carousel example describing tension, expansion, emphasis shift, breather and payoff (09:26-11:36), visually confirmed by frame-60pct.png through frame-95pct.png.

Professional extension: None; the five-stage structure (tension/expansion/emphasis/breather/payoff) is presented here exactly as the source frames it, not asserted as a broader industry standard.

- Identify the project's niche and gather 10-20 direct competitor references before starting design work.
- Analyze those references to determine what is visually saturated, predictable and expected in the niche.
- Decide and document whether to align intentionally with niche conventions or disrupt them strategically, based on the brief.
- When communicating with the client (proposal, portfolio, email), frame the work in terms of objective, constraint, strategic choice and outcome, and write with clear, structured, decisive language.
- Design the piece according to the brief and the chosen positioning decision.
- If the piece is intended for fast consumption (social media, ads), zoom it to approximately 10-15% scale and verify a single dominant entry point; if it fails, duplicate, simplify, increase contrast/spacing, and retest.
- If the deliverable is a sequence of related pieces, plan the full narrative progression (tension, expansion, emphasis shift, breather, resolution) before designing each individual piece.
- If recommending a third-party tool, disclose any sponsorship or discount-code relationship and keep it separate from the strategic method.
- Before final delivery, confirm the piece or sequence satisfies the brief, the niche-positioning decision, the thumbnail test (if applicable), and the narrative progression (if applicable).

[S70]

### Patterns > Cross-context application and durability

Cross-context application and durability

Principle: Minimalist design is applied across branding, web, packaging, social media, and UX because it communicates at a glance and endures by relying on stable principles rather than trends.

Problem: Prevents treating minimalism as a temporary aesthetic trend instead of a durable, function-first approach, and prevents overloading digital experiences with unnecessary elements.

Source basis: The source lists application contexts (logos, web, packaging, social media, tech, luxury brands, lifestyle) and explains durability through stable principles directly (07:16-08:19).

Professional extension: None added; this pattern stays within what the source states.

[S71]

### Patterns > High-saturation, low-palette-count color blocking

High-saturation, low-palette-count color blocking

Principle: Sites favor two or three flat, highly saturated colors instead of muted palettes or gradients, often producing deliberately uncomfortable contrast.

Problem: Distinguishes intentional brutalist saturation/contrast choices from accidental accessibility failures, so an agent does not 'fix' a deliberate stylistic choice without client consent, nor recommend it uncritically for accessibility-sensitive contexts.

Source basis: The saturated, low-palette color treatment is directly visible in the inspected frames of at least five of the twelve sites.

Professional extension: The accessibility trade-off guidance is added by this dossier and is not stated in the source.

[S72]

### Patterns > Southwestern

Southwestern

Principle: A warm, rustic style pulled directly from American Southwest imagery: deserts, cacti, cowboys, and sun-baked color palettes.

Problem: Prevents defaulting to generic 'western' or 'rustic' tags when the source specifies a distinct terracotta/turquoise/tribal-pattern palette.

Source basis: The presenter defines the style and lists its core features and use cases verbally (06:46-07:49), confirmed by the matching on-screen slide.

Professional extension: None added; the pattern reflects the source description directly.

[S73]

### Patterns

15 validated rule patterns.

[S74]

### Rules document

The video curates twelve real websites from 2020 as visual references for the 'web brutalism' trend, presenting them through a music-set montage with no spoken narration; its own description frames brutalism as one of the most controversial web design trends of 2020, characterized by raw oversized typography, high-contrast raw color blocking, collage-like grid-breaking composition, and unpolished exposed interface controls.

Raw, oversized, frequently cropped typography as the dominant graphic element

Principle: Typography is treated as the primary graphic element of the page, scaled large enough to be cropped by the viewport edge, rather than as discreet functional text.

Problem: Prevents a designer from underusing typography as mere labeling when brutalist impact is the design goal, and clarifies that cropping/overflow is an intentional device in this style, not a rendering bug.

Source basis: The video visually displays this typographic treatment across at least four of the twelve showcased sites, timestamped via official YouTube chapters.

Professional extension: The naming of this as a 'principle' and the guidance on when/how to apply it responsibly is added by this dossier; the video does not narrate any design rule.

High-saturation, low-palette-count color blocking

Principle: Sites favor two or three flat, highly saturated colors instead of muted palettes or gradients, often producing deliberately uncomfortable contrast.

Problem: Distinguishes intentional brutalist saturation/contrast choices from accidental accessibility failures, so an agent does not 'fix' a deliberate stylistic choice without client consent, nor recommend it uncritically for accessibility-sensitive contexts.

Source basis: The saturated, low-palette color treatment is directly visible in the inspected frames of at least five of the twelve sites.

Professional extension: The accessibility trade-off guidance is added by this dossier and is not stated in the source.

Collage-style composition with deliberate grid disruption

Principle: Several sites overlap photography, 3D objects, and text at irregular angles/sizes, ignoring conventional alignment grids, including embedding basic player controls directly inside the visual composition.

Problem: Prevents mistaking intentional asymmetry and grid-breaking for a layout bug when cataloguing or replicating this style, while still requiring real usability validation before shipping such a layout.

Source basis: The irregular, overlapping composition is directly visible in the inspected frames of at least four of the twelve sites.

Professional extension: The requirement for usability testing before production use is added by this dossier.

Plain-text, unstyled-looking navigation and interface controls

Principle: Navigation and player controls are frequently rendered as plain text lists or minimal, low-affordance elements resembling unstyled HTML, rather than as visually distinct buttons or icons.

Problem: Prevents an agent from assuming these interfaces used advanced custom UI components; also flags an accessibility risk (low visual affordance) that must be handled deliberately, not by accident.

Source basis: The plain-text, low-affordance controls are directly visible in the inspected frames of at least three of the twelve sites.

Professional extension: The semantic HTML and keyboard-focus mitigation guidance is added by this dossier.

Chapter-segmented curation format with explicit source attribution

Principle: The video itself is structured as twelve music-scored capsules, each bounded by an official YouTube chapter and reinforced by a description credit line listing studio name, URL, and timestamp, replacing verbal explanation with synchronized visual curation.

Problem: Prevents an agent from fabricating narration that does not exist, and establishes a reusable content pattern (chapter-delimited, credited visual showcase) independent of the specific brutalist examples shown.

Source basis: The chapter structure and description credit list are official metadata published by the creator.

Professional extension: None; this pattern is stated directly by the source's own metadata.

- Confirm the video has no spoken narration before drafting any summary; rely on chapters, description credits, and visual frame inspection instead.
- List the twelve showcased sites in chronological order with studio name, timestamp, and description-sourced URL, flagging URLs as dated to March 2020.
- For each design pattern cited, reference at least one existing frame file and classify the claim as direct source, visual confirmation, time-bound claim, unverified claim, or professional extension.
- Before reusing supplemental-161s.png in a professional or general-audience context, flag the visible text 'JIZZ' for content-appropriateness review.
- When recommending brutalist techniques for a real project, pair each technique with the corresponding accessibility, licensing, or usability safeguard listed in evidence_boundary and the dossier's safeguards section.
- Never present a captured frame as evidence of a site's current online status, functionality, or commercial success.

[S75]

### Patterns

9 validated rule patterns.

[S76]

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

[S77]

### Patterns > Pair product/place images with human-use ('lifestyle') images

Pair product/place images with human-use ('lifestyle') images

Principle: When imagery needs to tell a story about a place or product, combine at least one shot of the place/product itself with a shot of people using it.

Problem: Prevents purely architectural or product photography from failing to communicate an experiential story that helps sell the offering.

Source basis: The source explains combining place/product images with people-using-them images as 'lifestyle images' because 'stories sell products' (09:29).

Professional extension: None; this pattern is taken directly from the source with no added extension.

[S78]

### Patterns

12 validated rule patterns.

[S79]

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

[S80]

### Patterns > Literal Object Design

Literal Object Design

Principle: A style that mimics a real-life printed object (a boarding pass, receipt, file, or label) and places it on a different surface or product, trading on nostalgia and unexpected familiarity.

Problem: Prevents treating this as a single fixed look; the source frames it as a broad category requiring the designer to pick a concrete real-world object to imitate.

Source basis: The presenter defines the style, clarifies it is a broad category, and lists its core features and use cases verbally (10:24-11:56).

Professional extension: The dossier notes the visual overlap with receiptcore_receifty and trinket_design as a limitation, since the source itself does not fully disambiguate the categories.

[S81]

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

[S82]

### Patterns > Explicitly declare project trade-offs

Explicitly declare project trade-offs

Principle: No website can maximize features, SEO, UX, conversion rate optimization, performance, accessibility, and design simultaneously; priorities must be explicitly chosen for each project.

Problem: Prevents overpromising simultaneous optimization across all quality dimensions of a project.

Source basis: The source states at 04:33-05:00 that every website has trade-offs and there is no perfect site optimizing every dimension at once, and that the designer's job is to determine priorities and make the call.

Professional extension: None; this pattern is derived directly from the source's stated method.

[S83]

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

[S84]

### Patterns

4 validated rule patterns.

[S85]

### Rules document

A practical style name turns a vague visual intention into a searchable reference direction; use the name as a hypothesis, verify observable traits, and synthesize an original accessible system.

Turn intent into a searchable style brief

Principle: Pair a style name with medium and visual modifiers, then compare multiple references before committing.

Problem: Prevents vague searches and copying the first result.

Source basis: The source repeatedly frames names as keywords for faster reference search.

Professional extension: Comparing multiple references and documenting the brief protects originality.

Match visible form to the design family

Principle: Select a family by its structural cues rather than a broad trend label.

Problem: Prevents confusing adjacent styles such as Art Nouveau and Art Deco.

Source basis: The video defines styles through recurring visual traits and examples.

Professional extension: The cross-family consistency test is an implementation safeguard.

Keep hierarchy functional

Principle: Use layout systems such as bento, Bauhaus, utilitarian design, or grids to make content comprehensible before styling it.

Problem: Prevents trend treatment from hiding information and actions.

Source basis: The source describes bento, Bauhaus, and utilitarian design as ordered and functional.

Professional extension: Accessibility and responsive testing are required safeguards.

Synthesize rather than reproduce references

Principle: Transfer high-level cues while creating new composition, content, and assets.

Problem: Prevents copyright, trademark, and authorship problems.

Source basis: The video supplies examples and search terms, not reuse permissions.

Professional extension: Licensing and originality controls are added for safe production.

- Describe the communication goal and constraints.
- Choose candidate style names and create reproducible search queries.
- Inspect several references and list color, type, image, texture, and layout cues.
- Write an original direction with hierarchy and accessibility requirements.
- Prototype and validate at real output size.
- Verify licenses, attribution, responsive behavior, and final style coherence.

[S86]

### Patterns > Catalog of twelve grid systems and their use cases

Catalog of twelve grid systems and their use cases

Principle: Different content types call for different grid systems; matching the grid family to the medium (editorial, e-commerce, book, hierarchy-driven, proportion-based, gallery, packaging, branding) produces more coherent and purposeful layouts.

Problem: Prevents applying a single generic grid to every project regardless of content type, which produces layouts that fight against the medium instead of supporting it.

Source basis: The source explicitly names, defines and gives a use case plus an application tip for all twelve grid types in sequence (12:40-20:29), preserved here as a complete numbered inventory per the source integrity rule against omitting list items.

Professional extension: The instruction to 'explicitly consider all twelve types before finalizing a layout' is a professional extension added to turn the source's descriptive catalog into a checkable step.

[S87]

### Patterns

7 validated rule patterns.

[S88]

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

[S89]

### Patterns > Trend 4: Text-heavy sites as pattern interrupt

Trend 4: Text-heavy sites as pattern interrupt

Principle: Large blocks of text, used deliberately, interrupt the common alternating image/text pattern most sites follow, increasing user engagement through contrast.

Problem: Counters the long-standing rule of avoiding 'walls of text', which the source argues has become itself a predictable pattern users learn to ignore.

Source basis: The source states at 06:56-07:27: 'if you see a pattern as a user, you're more likely to begin ignoring it versus if that pattern gets interrupted.'

Professional extension: The requirement for a lower-cognitive-load alternative path is a professional extension added by this dossier.

[S90]

### Patterns

10 validated rule patterns.

[S91]

### Rules document

A website should never adopt a visual design trend because it is popular; every trend must be filtered through the site's defined purpose (a concrete user action such as purchase, newsletter signup, or lead-magnet download). Given that filter, the source identifies nine 2025 web design trends, each functioning as a reaction to a prior design norm: intentional imperfection reacts against AI-perfect aesthetics, micro interactions replace large animations, bright/bold design reacts against mobile-first visual limitation, text-heavy layouts function as a pattern interrupt against the 'no walls of text' rule, cursor alternatives revive a subtler version of early-2000s personalization, sound elements return with brand intentionality, scrollytelling ties narrative to scroll gestures, non-vertical navigation treats a site as a spatial world, and anti-usability introduces deliberate friction as a reaction against over-applied simplicity (Steve Krug's 'Don't Make Me Think').

Define site purpose before selecting any trend

Principle: No design trend should be adopted until the concrete action the site wants a user to take (purchase, subscribe, download a lead magnet, etc.) is explicitly defined.

Problem: Prevents cosmetic trend-chasing that does not serve business goals and can actively work against them.

Source basis: The source states this explicitly at 00:33-01:34: 'what is the purpose of my website? ... It should be to get a user to do something.'

Professional extension: Formalizing this as a mandatory gate before evaluating each of the nine trends, rather than a one-time preamble, is an operational structure added by this dossier.

Trend 1: Intentional imperfection

Principle: Deliberately visible human imperfection (asymmetric collage, hand-drawn illustration, off-grid layout) can differentiate a site from AI-generated polish.

Problem: Addresses the growing visual sameness of AI-perfect imagery and generic AI-assisted design.

Source basis: The source states, at 02:05-03:12: 'this is almost like a reaction to the flawless skin that we see in AI models... a human made this thing... that little bit of humanness can add an edge to your website.'

Professional extension: None beyond noting the risk of confusing intentional imperfection with actual usability defects, which this dossier adds as a boundary condition.

Trend 2: Micro interactions over large animation

Principle: Small, subtle interface responses to user actions (hover highlights, slight shifts on scroll) replace large, attention-monopolizing animation.

Problem: Large animations can overwhelm or interrupt users; subtle micro interactions maintain engagement without hijacking the experience.

Source basis: The source states at 03:47-04:18: 'micro interactions are little subtle hints that happen whenever a user does a certain action... it's not big, it's not bold.'

Professional extension: None; the pattern is described directly by the source.

Trend 3: Bright and bold color and type

Principle: Saturated colors (e.g., lime green) and oversized typography (100-200px, spanning full sections) create high visual impact, especially on desktop.

Problem: Reacts against years of mobile-first visual restraint that limited how large and bold desktop layouts could be.

Source basis: The source states at 04:49-05:21: 'this almost feels like a response to the mobile first campaign... you'll see super bright colors... fonts that are a hundred pixels, 200 pixels big.'

Professional extension: The explicit requirement to verify contrast and legibility before shipping oversized, saturated typography is a professional extension added by this dossier.

Trend 4: Text-heavy sites as pattern interrupt

Principle: Large blocks of text, used deliberately, interrupt the common alternating image/text pattern most sites follow, increasing user engagement through contrast.

Problem: Counters the long-standing rule of avoiding 'walls of text', which the source argues has become itself a predictable pattern users learn to ignore.

Source basis: The source states at 06:56-07:27: 'if you see a pattern as a user, you're more likely to begin ignoring it versus if that pattern gets interrupted.'

Professional extension: The requirement for a lower-cognitive-load alternative path is a professional extension added by this dossier.

Trend 5: Custom cursor alternatives

Principle: Subtle, intentional custom cursor effects (trailing shapes, geometric markers) replace the default system cursor on desktop to reinforce brand feel.

Problem: Modernizes an old personalization idea (custom MySpace-era cursors) with restraint and intentional execution.

Source basis: The source states at 07:58-08:30: 'it's much more subtle and much more intentional and well done... it's another one of those ways to keep users engaged... that pattern interrupt.'

Professional extension: The explicit accessibility fallback requirement (functional cursor on touch devices, no obstruction of click targets) is a professional extension.

Trend 6: Intentional sound elements

Principle: Background music or interaction-triggered sound effects can reinforce brand feel when used with clear intent, but are not broadly recommended.

Problem: Reintroduces audio to web experiences after a long period of largely silent web design, requiring careful judgment about fit.

Source basis: The source states at 08:49-10:09: 'people are starting to again put sound on their website... you've got to think intentionally about what your brand is.'

Professional extension: The explicit consent and autoplay prohibition is a professional extension, since the source does not discuss autoplay/consent mechanics.

Trend 7: Scrollytelling

Principle: Content and imagery are revealed progressively as the user scrolls, tying narrative pacing to the scroll gesture, often within a visually fixed section.

Problem: Extends marketing storytelling principles into an interactive, scroll-driven format for editorial or narrative content.

Source basis: The source states at 11:11-11:46: 'you're trying to tell a story as the user scrolls... it can be a really great and effective way to keep people engaged, if you do it right.'

Professional extension: The requirement for reduced-motion alternatives is a professional extension not discussed in the source.

Trend 8: Navigation beyond up and down

Principle: Some sites replace strictly top-to-bottom scrolling with a spatial, multi-directional navigation model, treating the site like an explorable world.

Problem: Breaks the assumption that website navigation must be a single vertical axis, enabling more exploratory, non-linear experiences.

Source basis: The source states at 12:19-12:53: 'you're going in through a door and then turning right... there aren't a lot of website builders that have the functionality of being able to do something like this... it's going to probably have to be a custom coded option.'

Professional extension: The requirement to preserve a discoverable path back to an overview state is a professional extension.

Trend 9: Anti-usability (deliberate friction)

Principle: Some high-design, experimental brands deliberately introduce friction (elements that move away from the cursor, obstruct clicks) as a reaction to decades of maximal simplicity in UX.

Problem: Counters the over-application of 'Don't Make Me Think'-style radical simplicity, which the source argues can implicitly treat users as incapable.

Source basis: The source states at 13:56-15:32: 'people don't really want to think when they're engaging with a website... we've definitely taken that a bit too far... does this trend fit in with my brand?'

Professional extension: The explicit prohibition on applying this trend to transactional or essential-service flows is a professional extension added by this dossier.

- Require an explicit statement of the site's purpose and target user action before evaluating any trend.
- Screen each of the nine trends individually against that purpose; do not treat the list as a mandatory checklist.
- For each adopted trend, cite the specific visual evidence file that supports its use.
- Flag any recommendation involving trend 6 (sound) with a mandatory consent/autoplay safeguard.
- Flag any recommendation involving trend 9 (anti-usability) with a mandatory exclusion of transactional/essential flows.
- Mark any reference to a specific example website as time-bound to the video's 2024-12-16 upload date.
- Keep Showit's promotional offer separate from the trend analysis in any derived output.
- Verify accessibility, motion, and consent safeguards for any trend involving animation or sound before final delivery.

[S92]

### Rules document

Brutalism in graphic and web design is a deliberately raw, imperfect aesthetic descended from 1950s architectural brutalism (exposed concrete, rejection of ornamentation) that resurges as a reaction against overly polished, homogeneous corporate design. It is controlled, intentional imperfection built from four levers -- bold oversized typography, deliberately broken grids, extreme color palettes (stark black-and-white or clashing color), and gritty texture -- applied in service of honesty and visual impact rather than beauty or harmony.

Architectural origin and honesty-over-perfection definition

Principle: Graphic brutalism inherits its raw, unornamented, utilitarian character from 1950s architectural brutalism, prioritizing honesty over perfection.

Problem: Prevents describing brutalism as random ugliness disconnected from its architectural and philosophical roots.

Source basis: The source states this explicitly at 00:30: architectural origin, raw exposed concrete, rejection of ornamentation, and the translation of these principles into graphic design.

Professional extension: None; this pattern is fully grounded in direct source statements and visual confirmation.

The four core characteristics checklist

Principle: Brutalist graphic design is defined by bare-bones grid-based layouts, bold clunky-feeling typography, limited or intentionally clashing colors, and (for websites) deliberately awkward user experiences.

Problem: Prevents an incomplete or inconsistent definition of what counts as brutalist design.

Source basis: The source enumerates these four characteristics explicitly at 00:30 as a compact list.

Professional extension: The recommendation to treat UX friction as a separate higher-risk item, since the source states it but never demonstrates a concrete interaction example.

Cultural rebellion as trend driver (interpretation, not data)

Principle: The creator frames brutalism's 2025 popularity as a rebellion against polished, cookie-cutter corporate aesthetics, resonating especially with Gen Z audiences who value authenticity, paralleling anti-design and Y2K aesthetics.

Problem: Prevents presenting an unverified cultural interpretation as demonstrated market fact.

Source basis: The source states this explicitly at 01:01-01:32, without citing surveys, studies, or external sources.

Professional extension: The explicit unverified-claim labeling requirement, added because the source presents the claim with confident language despite lacking supporting data.

Bold typography as the visual backbone

Principle: Typography is the central visual element of brutalist design: bold, oversized fonts dominate the composition rather than serving purely as a communication medium, balanced with a minimum level of legibility.

Problem: Prevents treating typography as purely informational text, losing the visual-impact function central to the style.

Source basis: The source states this explicitly at 02:02-02:33, naming Helvetica and Proxima Nova as examples and stating the legibility/impact balance goal.

Professional extension: None; fully grounded in direct source statement and visual confirmation.

Structured disarray: grid with intentional breaks

Principle: Brutalist layouts rely on an underlying grid system applied with deliberate imperfection: overlapping elements, inconsistent alignment, and bleeding images, where every break is a controlled, intentional composition decision, never random.

Problem: Prevents confusing intentional, composition-serving disorder with genuine, unjustified carelessness.

Source basis: The source states this explicitly at 03:03-03:35, including the explicit 'chaos is controlled, not random' rule.

Professional extension: None; fully grounded in direct source statement.

Extreme color palette: stark simplicity or bold clashes

Principle: Brutalist color palettes fall into one of two deliberate extremes -- stark black-and-white simplicity emphasizing contrast, form and typography, or bold, intentionally clashing color combinations -- never a moderate, harmonious middle ground.

Problem: Prevents using a 'safe' intermediate corporate palette while still claiming the brutalist label.

Source basis: The source states this explicitly at 03:35-04:06, including examples of clashing colors (neon pink/green, red/yellow) and the stated goal of 'grabbing attention', not 'beauty or harmony'.

Professional extension: None; fully grounded in direct source statement and visual confirmation.

Gritty texture applied with expressive purpose

Principle: Grainy overlays, noise, and deliberate pixelation simulate the physical imperfection of exposed concrete, grounding the design in a sense of imperfection and humanity; texture should provoke, challenge, and engage rather than decorate.

Problem: Prevents applying grain or noise as a generic decorative filter disconnected from expressive intent.

Source basis: The source states this explicitly at 04:06-04:37, linking texture to the physical rawness of concrete and to provoking/challenging the viewer.

Professional extension: None; fully grounded in direct source statement and visual confirmation.

Context-fit gate and philosophy-over-checklist mindset

Principle: Brutalism should be applied only where deliberate roughness is acceptable or desirable (fashion, music, creative/underground fields) and avoided in domains needing high trust and clarity (finance, healthcare); designers should internalize the philosophy (reject polish, embrace imperfection) rather than mechanically following a four-item checklist.

Problem: Prevents applying brutalism in high-trust, high-clarity domains where roughness harms readability and credibility, and prevents mechanical, philosophy-free application of the style.

Source basis: The source states both points explicitly: the philosophy-over-checklist instruction at 04:37, and the domain-fit warning (finance/healthcare vs. fashion/music/underground events) at 04:37-05:08.

Professional extension: The specific extension to government and legal domains beyond the source's named finance/healthcare examples, added as a professional accessibility and trust safeguard.

- Confirm the target domain is appropriate for brutalism (creative/cultural) or document explicit justification for a high-trust domain.
- Define the intended message of authenticity, rebellion, or differentiation before choosing typography or color.
- Choose a bold typographic base: a clean geometric sans-serif (e.g., Helvetica, Proxima Nova) or an experimental/clunky mix, sized to dominate the composition.
- Build a real functional grid first, then introduce deliberate, justifiable breaks (overlap, misalignment, bleed).
- Select one color extreme: high-contrast black-and-white, or saturated clashing color; avoid intermediate palettes.
- Add grain, noise, or pixelation texture with a stated expressive purpose.
- Audit the result against the four core characteristics (grid, typography, color, and, for digital products, intentional UX friction).
- Separate any cultural/market explanation of the style's appeal from verified data, labeling it explicitly as interpretation.
- For digital products, review accessibility (keyboard navigation, screen-reader support, reduced-motion alternative) before shipping any intentional UX friction.

[S93]

### Patterns > Emotional typography (kerning and stroke weight)

Emotional typography (kerning and stroke weight)

Principle: Letter spacing (kerning) and stroke weight are emotional levers: tight kerning and italics suggest urgency, generous kerning suggests relaxation and premium feel, heavy strokes suggest authority, and thin strokes suggest elegance.

Problem: Typography chosen only for visual style, without matching the emotional register the brief requires, can undercut the intended tone of a design even when the layout itself is sound.

Source basis: The source directly demonstrates all four typographic states (tight kerning, generous kerning, heavy type, thin type) on the same poster and states explicitly the emotional association of each.

Professional extension: The acceptance criterion about preserving legibility and negative space is a professional safeguard added by this dossier, not stated verbatim in the source.

[S94]

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

[S95]

### Patterns > Calculated friction balanced with flow

Calculated friction balanced with flow

Principle: Friction (tight spacing, jarring elements, uncomfortable typography) is a legitimate design tool when used intentionally in specific zones, as long as it is balanced by clearly defined zones of smooth flow elsewhere.

Problem: Prevents both extremes: designs with no friction that feel flat and forgettable, and designs with uncontrolled friction that lose the message in visual noise.

Source basis: The source directly defines friction, gives a worked example (tight leading, blurred faces, a cut-off word), and states the good-vs-bad friction distinction and the 'seasoning' metaphor ('just enough add some flavor... too much will ruin the whole thing', 25:58).

Professional extension: None beyond restating the source's own self-check questions as acceptance criteria; the pattern is presented largely as directly stated.

[S96]

### Contexto autónomo para un agente — 4 Graphic Design Tips For ELITE Design Thinkers!

# Contexto autónomo para un agente

## Propósito

Este documento convierte el video "4 Graphic Design Tips For ELITE Design Thinkers!" (ID de YouTube `u-JtFKXL_jY`), publicado por el canal **Satori Graphics**, en un paquete de conocimiento autosuficiente. El objetivo es que otro agente pueda razonar, aplicar y evaluar el método completo que expone el video sin necesidad de reproducirlo, escucharlo ni consultar la fuente original. El video dura 738 segundos (12 minutos y 18 segundos) y fue subido el 27 de febrero de 2026, según el campo `upload_date` de `metadata.json`. Su idioma principal es inglés (`en`), sin idiomas secundarios detectados en el audio.

El video se presenta como una lista de habilidades o "tips" que, según el presentador, los diseñadores gráficos lamentarán no haber dominado en 2026. En la práctica no son cuatro consejos técnicos de herramientas, sino cuatro marcos de pensamiento estratégico: posicionamiento visual frente a la saturación de un nicho, uso de sesgos psicológicos para comunicar valor profesional, optimización para la "economía de los dos segundos" en redes sociales, y construcción de narrativa visual a través de secuencias de piezas (carruseles, campañas). El video incluye además un segmento patrocinado (Fontbase) que se documenta por separado como promoción, no como parte del método.

## Evidencia y límites

Este paquete se construyó a partir de dos fuentes verificables:

1. **Transcripción**: pista de subtítulos manual en inglés (`en-GB`, `English (United Kingdom)`), descargada directamente de YouTube sin traducción automática, normalizada en `transcript/source.vtt` y limpiada en `transcript/source.txt` mediante el script `vtt-to-clean-transcript.py`. El resultado tiene 1832 palabras en 22 segmentos, con timestamps que cubren desde 00:00:00 hasta 00:11:36, coherente con la duración total de 738 segundos declarada en los metadatos (el video continúa unos segundos más allá del último segmento transcrito, en un cierre breve sin contenido sustantivo nuevo).
2. **Evidencia visual**: 20 frames extraídos uniformemente entre el 0% y el 95% de la duración del video (`visual/frames/frame-00pct.png` a `frame-95pct.png`), combinados en un contact sheet (`visual/frames/contact-sheet.jpg`) que fue efectivamente abierto e inspeccionado con la herramienta `Read`. No fue necesario generar frames suplementarios: el muestreo uniforme capturó representativamente las cuatro secciones del método (tarjetas de título, diagramas de sesgos, demostraciones de interfaz del patrocinador, ejemplos de miniatura/zoom y el carrusel de cinco slides).

### Límites explícitos de la evidencia

- El video no muestra un caso de cliente real verificable de principio a fin; los ejemplos (login de app, anuncio de videojuego, carrusel de fitness) son mockups ilustrativos de Satori Graphics, no proyectos documentados de un cliente externo.
- Las cifras de "2 segundos" para captar la atención en redes sociales y la afirmación de que una "auditoría de saturación" puede "duplicar tu valor al menos" son afirmaciones del presentador sin evidencia primaria adicional (estudios citados, capturas de resultados de clientes, etc.). Se marcan como **afirmaciones no verificadas** en el cuerpo de este documento.
- El segmento de Fontbase (aproximadamente del minuto 04:37 al 06:46) es un patrocinio pagado explícito, con código de descuento propio del canal ("Sattorii"). Se documenta como procedencia y sesgo declarado, y se excluye del método operativo.
- No se identificaron idiomas secundarios materiales en el audio.
- La pista de subtítulos usada es manual (no generada automáticamente), lo cual reduce el riesgo de errores de transcripción automática, pero conserva pequeñas imprecisiones típicas de subtitulado en vivo (por ejemplo, nombres propios o palabras compuestas que aparecen fusionadas, como "reachto" o variaciones fonéticas de "Satori" transcritas como "Sattorii").

## Tesis central

Un diseñador gráfico que en 2026 solo piensa en términos puramente visuales (composición, color, tipografía) se está quedando corto frente a un mercado saturado y una atención del público cada vez más fragmentada. Para diferenciarse y aumentar su valor percibido, el diseñador debe operar simultáneamentente en cuatro planos que van más allá de lo estético: (1) el posicionamiento estratégico de su trabajo dentro de un nicho visualmente saturado, (2) el uso consciente de sesgos psicológicos (autoridad, claridad) para comunicar su valor a clientes, (3) la optimización de sus piezas para una "economía de atención de dos segundos" típica del consumo en redes sociales, y (4) la construcción de una narrativa visual coherente a través de secuencias de piezas relacionadas (carruseles, campañas, series de posts), en lugar de tratarlas como unidades aisladas. La conclusión implícita del video es que un diseñador que domina estos cuatro planos deja de ser un "productor de activos visuales" para convertirse en un pensador estratégico, lo cual —según el presentador— se traduce en tarifas más altas y mayor percepción de autoridad profesional.

## Mapa temporal de procedencia

| Marca de tiempo | Contenido | Tipo de evidencia |
|---|---|---|
| 00:00–00:37 | Introducción: promesa de mostrar habilidades que los diseñadores lamentarán no dominar en 2026 | Fuente directa |
| 00:37–01:43 | Principio 1 — Saturación visual de nichos: ejemplo del "look" típico de una startup tecnológica (gradientes suaves, UI redondeada, tipografías amigables, morados/azules apagados) | Fuente directa + confirmación visual parcial (frame-05pct, frame-10pct) |
| 01:43–02:51 | La "auditoría de saturación": revisar 10–20 competidores del nicho y decidir alinearse o disruptir intencionalmente | Fuente directa + `frame-15pct.png` (diagrama "Elite Designers Method") |
| 02:51–04:37 | Principio 2 — Sesgos psicológicos: sesgo de autoridad (cómo describir el portafolio) y sesgo de claridad (cómo redactar propuestas y correos) | Fuente directa + `frame-15pct.png`, `frame-20pct.png` (diagramas "Authority Bias" y "Clarity Bias") |
| 04:37–06:46 | Segmento patrocinado: Fontbase (gestor de fuentes) | Promoción declarada, separada del método |
| 06:46–08:56 | Principio 3 — Velocidad de cognición / economía de 2 segundos: prueba de zoom al 10-15% para verificar jerarquía visual en miniatura | Fuente directa + confirmación visual (`frame-40pct.png` a `frame-55pct.png`) |
| 08:56–09:26 | Refuerzo del principio 3: puntos de entrada claros, elementos mínimos en competencia, colocación de gancho inmediato | Fuente directa |
| 09:26–11:36 | Principio 4 — Arquitectura narrativa: ejemplo del carrusel de 5 slides de Instagram (tensión, expansión, cambio de énfasis, respiro visual, resolución) | Fuente directa + confirmación visual (`frame-60pct.png` a `frame-90pct.png`) |
| ~11:36–12:18 | Cierre: llamado a la acción para ver otro video, despedida | Fuente directa (fuera del rango del último segmento transcrito) |

Este mapa temporal indica procedencia, no reemplaza la explicación: cada principio se desarrolla en detalle en la sección siguiente para que el agente lo entienda sin necesidad de consultar las marcas de tiempo.

# Método completo de la fuente

## Principio / paso / elemento 1 — Auditoría de saturación visual (posicionamiento de nicho)

El video sostiene que, en 2026, las tendencias visuales de un nicho (por ejemplo, el diseño para startups tecnológicas) se saturan a una velocidad mucho mayor que antes: el presentador afirma que las tendencias "ya no duran 2 o 3 años, sino 6 meses como máximo, a menudo menos". La fuente describe el "look" genérico actual de una startup tecnológica como una combinación de gradientes suaves, elementos de interfaz redondeados, geometrías amigables, tipografías serif, tonos morados o azules apagados, layouts minimalistas y espacio en blanco generoso.

> "En 2026, los nichos se han vuelto saturados visualmente a una velocidad insana." (00:00:37)

El problema que plantea el video es que producir un diseño que reproduce exactamente ese lenguaje visual dominante puede parecer "limpio" y "profesional", pero se vuelve invisible precisamente porque no se diferencia dentro de un paisaje que evoluciona muy rápido. El presentador aclara, sin embargo, que esto no es una regla absoluta: "eso podría encajar con tu brief y tu proyecto, pero también podría no encajar" (01:12). La decisión de alinearse con las expectativas del nicho o de romperlas intencionalmente depende del proyecto específico.

La técnica concreta que propone el video es lo que llama una **auditoría de saturación**: antes de diseñar cualquier pieza, el diseñador debe reunir entre 10 y 20 competidores directos del nicho (no dos o tres, sino una colección amplia), colocarlos lado a lado y preguntarse qué se repite, qué es predecible y qué es visualmente esperado. A partir de ese análisis, el diseñador toma una decisión consciente: alinear el sistema de diseño con la expectativa del nicho de forma intencional, o romper con ella de forma estratégica.

> "Tiran de 10 a 20 competidores en ese nicho. No dos, no tres, sino una colección. Y luego los colocan lado a lado y se preguntan: ¿qué se repite, qué es predecible, qué es visualmente esperado?" (01:43)

El video afirma —como una cifra no verificada, sin evidencia primaria adicional— que esa decisión "puede al menos duplicar tu valor". Esta afirmación se marca como una **afirmación no verificada de la fuente**: no se presenta ningún caso de cliente, estudio o dato que la sustente; es una declaración retórica del presentador.

`frame-15pct.png` muestra visualmente el diagrama titulado "Elite Designers Method", que enumera exactamente los pasos descritos: "Antes de diseñar cualquier cosa, ejecutan lo que yo llamo una auditoría de saturación", con viñetas "Tiran de 10 a 20 competidores", "No dos, no tres, sino una colección", "Los colocan lado a lado y preguntan: ¿qué se repite? ¿qué es predecible? ¿qué es visualmente esperado?" y dos cajas de decisión: "¿Alineamos nuestro sistema de diseño con la expectativa intencionalmente?" y "¿Disruimos estratégicamente?". Esto confirma visualmente que el diagrama en pantalla reproduce fielmente lo dicho en el audio, sin agregar información adicional verificable.

**Clasificación de evidencia**: fuente directa (audio) + confirmación visual (`frame-15pct.png`). La cifra de "duplicar tu valor" es una afirmación no verificada.

## Principio / paso / elemento 2 — Sesgos psicológicos aplicados a la comunicación profesional

El segundo eje del video plantea que un diseñador que "solo piensa visualmente" se limita a sí mismo, mientras que un diseñador que entiende de psicología aumenta su autoridad percibida frente a clientes o potenciales clientes, sin necesidad de tener un título en psicología, sino cierta conciencia de estos mecanismos.

El video desarrolla dos sesgos concretos:

**Sesgo de autoridad (authority bias)**: la forma en que un diseñador describe su propio trabajo en el portafolio cambia la percepción de seniority. El video contrasta dos formulaciones:

> "Si tu portafolio describe proyectos de forma casual, como 'aquí hay un logo que hice en 2019', pareces un poco junior." (02:51)

> "Pero si lo describes como 'este sistema de identidad fue construido para aumentar el recall de marca, principalmente a través de contraste tipográfico controlado y jerarquía visual simplificada', de repente suenas mucho más estratégico." (02:51)

`frame-15pct.png` y `frame-20pct.png` muestran visualmente ambos textos enfrentados bajo el rótulo "Authority Bias", con las dos versiones del texto del portafolio ("Portfolio Described as:") una junto a la otra, confirmando que el contraste discursivo mostrado en pantalla coincide con lo narrado en el audio.

**Sesgo de claridad (clarity bias)**: el video sostiene que los humanos confían en la claridad. Si un correo o una propuesta están estructurados, son decisivos y confiados, el cliente puede relajarse; si son vagos y reactivos, el cliente siente incertidumbre.

> "Los humanos confían en la claridad. Si tu email está estructurado, es decisivo y confiado, los clientes pueden simplemente relajarse con eso. Si es vago y reactivo, los clientes sienten incertidumbre." (03:26)

`frame-20pct.png` muestra el diagrama "Clarity Bias" con el texto "Los humanos confían en la claridad" y "Si es vago y reactivo, los clientes se sienten inciertos", junto al diagrama de "Authority Bias" reutilizado en la misma composición visual, lo que confirma la conexión conceptual entre ambos sesgos tal como se presenta en el video.

El video extiende esta idea de comunicación a la estructura del portafolio en sí: en lugar de mostrar solo visuales finales, sugiere mostrar el problema, la restricción, la elección estratégica y el resultado. La conclusión de esta sección es que, en 2026, un diseñador gráfico necesita ser percibido como un pensador, no solo como un ejecutor visual, y que ignorar este cambio deja al diseñador "atascado cobrando tarifas más bajas de las que probablemente merece" (04:37).

**Clasificación de evidencia**: fuente directa (audio) + confirmación visual (`frame-15pct.png`, `frame-20pct.png`). No hay evidencia primaria (estudios citados) sobre la eficacia real de estos sesgos en la conversión de clientes; se trata de un marco conceptual del presentador, presentado como principio de comunicación profesional, no como resultado medido.

## Segmento promocional — Fontbase (excluido del método)

Entre aproximadamente los minutos 04:37 y 06:46, el video presenta un patrocinio explícito de **Fontbase**, un gestor de fuentes gratuito y de pago para Mac, Windows y Linux. El presentador describe funciones como el "font playground" (para probar combinaciones tipográficas y espaciado), el "font pinning" (fijar una fuente mientras se comparan otras), integración directa con Google Fonts, "super search" (análisis de contraste, peso y proporciones de las fuentes, disponible en la versión de pago "Fontbase Awesome") y activación automática de fuentes faltantes en aplicaciones de Adobe. El presentador ofrece un código de descuento propio ("Sattorii") para probar las funciones premium gratis durante 3 meses.

`frame-25pct.png` y `frame-30pct.png` muestran capturas de pantalla reales de la interfaz de Fontbase, con listas de fuentes mostrando el texto de prueba "The quick brown fox jumps over the lazy dog" en distintas tipografías, confirmando visualmente que la demostración de interfaz ocurrió tal como se describe en el audio.

Este segmento se separa explícitamente del método porque:

- Es un patrocinio pagado con un código de descuento personal del creador, es decir, tiene un incentivo comercial declarado.
- Las capturas de pantalla de la interfaz de Fontbase demuestran que el producto existe y tiene esas funciones visibles en pantalla, pero **no demuestran** que la herramienta sea necesaria para aplicar los otros tres principios del video, que son independientes de cualquier software específico.
- No se debe presentar el uso de Fontbase como parte del "método de pensamiento elite" que es el tema central del video.

**Clasificación de evidencia**: promoción declarada + confirmación visual de la interfaz (no de resultados de negocio).

## Principio / paso / elemento 3 — Velocidad de cognición y la economía de los 2 segundos

El tercer principio parte de una pregunta directa: cuando se diseña algo para redes sociales, ¿se prueba realmente el diseño a tamaño miniatura (thumbnail)? El video plantea que actualmente se vive en una "economía de dos segundos": dos segundos para interrumpir el comportamiento de scroll, dos segundos para establecer jerarquía, dos segundos para comunicar claridad focal.

> "Estamos diseñando en una economía de dos segundos ahora mismo. 2 segundos para interrumpir el comportamiento de scroll. 2 segundos para establecer jerarquía. 2 segundos para comunicar claridad focal." (06:46)

Según el video, si un layout "requiere paciencia", probablemente perderá la atención del espectador en algún punto del proceso. Se necesitan puntos focales de alto contraste, puntos de entrada claros, elementos mínimos en competencia y una colocación inmediata del "gancho" (hook) visual.

El video propone un ejercicio práctico concreto: imaginar un post de Instagram diseñado con encabezado, subencabezado, textura de fondo, logo, forma decorativa y quizás una marca de comillas. El diseño puede verse "pulido" y "completo" a tamaño normal, pero la prueba real consiste en reducirlo al 10% de su escala —aproximadamente como se vería en un feed durante un scroll a alta velocidad— y preguntarse qué se percibe primero. Si la respuesta es "todo a la vez", hay un problema: el cerebro necesita un punto de entrada claro, es decir, un elemento dominante, no tres o cuatro.

> "Duplica tu diseño. Y en el duplicado, elimina todo lo que no sea absolutamente esencial para el mensaje central." (07:52)

El ejercicio continúa: sobre la copia duplicada, se conserva solo el encabezado y quizás un elemento visual de apoyo; se incrementa el contraste entre esos dos elementos (haciendo el encabezado más oscuro, más claro, más grande o más aislado), se aumenta el espaciado a su alrededor y se elimina el "ruido decorativo". El criterio de éxito es si el mensaje "golpea instantáneamente" y puede leerse en 1 segundo, siempre que siga respetando el brief y los objetivos del proyecto. Si la respuesta es afirmativa en todos los puntos, se ha mejorado la velocidad de cognición del diseño, y recién entonces se pueden reintroducir elementos esenciales (como un logo o una textura) de forma gradual.

`frame-40pct.png` muestra el texto "La velocidad de cognición se está volviendo tan rápida y tan importante para muchos aspectos del consumo de diseño gráfico" junto a la imagen de un teléfono mostrando una app; `frame-45pct.png`, `frame-50pct.png` y `frame-55pct.png` muestran el ejemplo práctico real usado por el presentador: un anuncio de videojuego ("Reborn Rally — Level up your game night") mostrado primero a tamaño completo y luego reducido a una miniatura marcada como "10%", junto a una comparación lado a lado etiquetada "Original" y "Duplicate" (duplicado), que corresponde exactamente al ejercicio descrito en el audio: duplicar el diseño y simplificar la versión reducida.

**Clasificación de evidencia**: fuente directa + confirmación visual fuerte (`frame-40pct.png` a `frame-55pct.png` documentan el ejercicio de zoom y duplicado tal como se narra). El principio de "velocidad de cognición" en sí es un marco conceptual del presentador; no se cita ningún estudio de atención o de comportamiento de scroll que lo sustente cuantitativamente, por lo que la cifra de "2 segundos" se marca como una **afirmación no verificada**.

## Principio / paso / elemento 4 — Arquitectura narrativa visual en secuencias de piezas

El cuarto principio distingue entre un diseñador que solo produce piezas aisladas fuertes y simples (a quien el video llama "productor de activos") y uno que diseña una secuencia completa con atención al ritmo narrativo, a quien equipara con la forma de pensar de un director creativo.

> "Si solo puedes diseñar diseños fuertes y simples, eres un productor de activos. Pero si puedes diseñar una secuencia con atención, estás pensando como un director creativo." (09:26)

El ejemplo práctico que desarrolla el video es un carrusel de Instagram de 5 slides para el anuncio de una marca. El video señala que la mayoría de los diseñadores tratan las 5 slides de forma casi idéntica: misma estructura de layout, misma grilla, misma colocación de encabezado, cambiando solo texto e imágenes. Esto resulta "consistente" pero no "dinámico". El video propone en cambio una progresión narrativa deliberada:

1. **Slide 1**: no debe simplemente "verse bien"; debe crear tensión y despertar curiosidad, por ejemplo introduciendo una afirmación audaz o una frase provocadora aislada con alto contraste y espacio de respiro.
2. **Slide 2**: no repite la misma energía, sino que expande la idea, introduciendo contexto más profundo; la tipografía cambia ligeramente y el layout se abre, mientras el lenguaje visual se mantiene consistente.
3. **Slide 3**: cambia el énfasis; la jerarquía se modifica, quizás una estadística clave se vuelve más dominante, y el punto focal se mueve intencionalmente.
4. **Slide 4**: agrega un "respiro visual"; se vuelve más limpia y aporta una pausa frente a demasiada información.
5. **Slide 5**: entrega el "pago" (payoff): la declaración de marca, el llamado a la acción, limpio y confiado, con ruido visual mínimo y sensación de resolución.

> "Eso es arquitectura narrativa en diseño gráfico. Estás controlando el ritmo, el pacing, la tensión y la liberación." (11:02)

El video aclara que esto aplica más allá de redes sociales: si cada póster de una campaña se ve exactamente igual, simplemente se está repitiendo el layout en lugar de construir una narrativa. La construcción de narrativa visual implica preguntarse dónde comienza la mirada en la secuencia, dónde escala, dónde se detiene y dónde se resuelve.

`frame-60pct.png` a `frame-90pct.png` muestran visualmente un carrusel real de ejemplo: una serie de slides de un teléfono mostrando una publicación de Instagram con el texto "You're Not Fit..." y gráficos ilustrativos de un personaje, con indicadores de progreso del carrusel (puntos) que cambian de posición entre frames, confirmando que el presentador efectivamente demuestra una secuencia de varias slides con variación de énfasis visual y textual, consistente con la descripción narrada. `frame-95pct.png` muestra el texto de cierre conceptual: "Si cada póster en una campaña se ve exactamente igual, solo estás repitiendo un layout. La construcción de narrativa visual significa preguntar: ¿dónde comienza la mirada en esta secuencia? ¿Dónde escala? ¿Dónde se detiene? ¿Dónde se resuelve?"

**Clasificación de evidencia**: fuente directa + confirmación visual fuerte (`frame-60pct.png` a `frame-95pct.png` documentan la progresión del carrusel). La estructura de 5 pasos (tensión, expansión, cambio de énfasis, respiro, resolución) es un marco propuesto por el presentador; no hay evidencia de que corresponda a un estándar de la industria más amplio, por lo que se presenta como principio de la fuente, no como convención universal verificada.

# Demostraciones y ejemplos visibles

El video incluye varias demostraciones visuales concretas que van más allá del audio narrado:

- **Diagrama "Elite Designers Method"** (`frame-15pct.png`): esquema con los pasos de la auditoría de saturación y el árbol de decisión "alinear vs. disruptir".
- **Diagramas "Authority Bias" y "Clarity Bias"** (`frame-15pct.png`, `frame-20pct.png`): contraste textual entre descripciones "junior" y "estratégicas" de un mismo proyecto de portafolio, y principios sobre confianza y claridad en la comunicación con clientes.
- **Interfaz real de Fontbase** (`frame-25pct.png`, `frame-30pct.png`): capturas de pantalla de la aplicación mostrando listas de fuentes con texto de prueba, function de comparación de tipografías y organización visual del gestor de fuentes. Esta es una demostración de interfaz de un producto de terceros con fines promocionales, no una prueba de un flujo de trabajo de cliente real.
- **Ejemplo de miniatura/zoom con anuncio de videojuego** (`frame-40pct.png` a `frame-55pct.png`): un mockup de anuncio para "Reborn Rally" mostrado a tamaño completo y luego reducido al 10%, con una comparación explícita "Original" vs. "Duplicate" que ilustra el ejercicio de simplificación descrito en el audio.
- **Carrusel de ejemplo de Instagram de 5 slides** (`frame-60pct.png` a `frame-90pct.png`): mockup de una publicación de fitness/gaming con el texto "You're Not Fit..." mostrado en distintas etapas de progreso del carrusel, ilustrando la variación de énfasis visual entre slides.
- **Texto de cierre conceptual sobre narrativa visual** (`frame-95pct.png`): resumen textual en pantalla de las preguntas clave para construir narrativa visual.

Es importante distinguir que estos ejemplos son mockups ilustrativos creados por el canal para explicar el concepto, no capturas de un proyecto de cliente documentado de principio a fin con resultados medibles. El video no muestra métricas reales (tasas de clics, conversiones, ingresos) asociadas a ninguno de los cuatro principios.

# Flujo integrado para el agente

Un agente que reciba un encargo de diseño gráfico y quiera aplicar el método completo de este video debería seguir esta secuencia operativa:

1. **Antes de diseñar**: identificar el nicho o categoría del proyecto (por ejemplo, tecnología, fitness, moda) y reunir entre 10 y 20 referencias de competidores directos dentro de ese nicho.
2. **Análisis de saturación**: colocar esas referencias lado a lado (mentalmente o en un tablero) y identificar qué elementos visuales se repiten, qué es predecible y qué es esperado por el público de ese nicho.
3. **Decisión de posicionamiento**: decidir explícitamente, en función del brief y los objetivos del proyecto, si el diseño se alineará intencionalmente con las convenciones del nicho (para generar familiaridad y confianza) o si las romperá estratégicamente (para diferenciarse), documentando esa decisión y su justificación.
4. **Comunicación con el cliente**: al redactar propuestas, correos o descripciones de portafolio, aplicar los principios de sesgo de autoridad (describir el trabajo en términos de objetivo estratégico y resultado, no solo como "una pieza más") y sesgo de claridad (estructurar la comunicación de forma decisiva y ordenada, evitando vaguedad).
5. **Diseño de la pieza**: producir el diseño respetando el brief y los objetivos del proyecto, sin sacrificar la funcionalidad por seguir ciegamente el principio de saturación o el de miniatura.
6. **Prueba de miniatura**: si la pieza está destinada a redes sociales o a cualquier contexto de consumo rápido, reducirla a aproximadamente 10-15% de su tamaño y verificar que exista un único punto de entrada visual dominante, con elementos mínimos en competencia. Si no lo hay, duplicar el diseño, eliminar elementos no esenciales, aumentar el contraste y el espaciado del elemento principal, y volver a probar.
7. **Diseño de secuencias**: cuando el encargo implica múltiples piezas relacionadas (carrusel, campaña, serie de posts), planificar la progresión narrativa completa antes de diseñar cada pieza individualmente: definir qué pieza genera tensión/curiosidad inicial, cuál expande el contexto, cuál cambia el énfasis, cuál aporta un respiro visual y cuál entrega el cierre o llamado a la acción.
8. **Revisión final**: confirmar que cada pieza y cada secuencia cumplen simultáneamente con (a) el brief del cliente, (b) una posición consciente frente a la saturación del nicho, (c) una prueba de miniatura satisfactoria cuando aplique, y (d) una progresión narrativa coherente cuando se trate de una secuencia de piezas.
9. **Separación de patrocinios**: si se recomienda una herramienta de terceros (como un gestor de fuentes), presentarla como una opción práctica y declarar cualquier relación comercial o código de descuento, sin mezclarla con los principios estratégicos del método.

# Reglas operativas

- Realizar siempre un análisis de 10 a 20 referencias del nicho antes de comenzar el diseño de una pieza nueva, cuando el proyecto lo permita en tiempo y presupuesto.
- Documentar explícitamente la decisión de alinearse con las convenciones visuales del nicho o de romperlas, y justificarla en función del brief.
- Describir el trabajo propio (portafolios, propuestas, informes a cliente) en términos de objetivo estratégico, restricción y resultado, evitando descripciones puramente casuales o cronológicas.
- Redactar comunicaciones con clientes (correos, propuestas) de forma estructurada, decisiva y clara, evitando ambigüedad que genere incertidumbre.
- Probar toda pieza destinada a consumo rápido (redes sociales, anuncios, miniaturas) a una escala reducida (aproximadamente 10-15%) antes de darla por finalizada.
- Priorizar un único punto de entrada visual dominante por pieza cuando el contexto de consumo es rápido, evitando más de un elemento compitiendo por la atención inicial.
- Planificar la progresión narrativa completa de cualquier secuencia de piezas relacionadas (carrusel, campaña) antes de diseñar cada pieza de forma aislada.
- Mantener el mismo lenguaje visual (tipografía, paleta, estilo) a lo largo de una secuencia, incluso cuando varía el énfasis o la jerarquía entre piezas.
- Declarar cualquier patrocinio, código de descuento o relación comercial con una herramienta recomendada, separándola del método de pensamiento estratégico.
- No presentar cifras de impacto en el valor profesional (por ejemplo, "duplicar tu valor") como hechos medidos si no existe evidencia primaria que las respalde; comunicarlas como opinión o marco conceptual del presentador.

# Antipatrones

- Diseñar una pieza aislada usando solo referencias de Pinterest o inspiración genérica, sin analizar el estado de saturación visual del nicho específico del cliente.
- Copiar las convenciones visuales dominantes de un nicho sin una decisión consciente, resultando en un diseño "invisible" por indistinguible del resto.
- Describir el propio trabajo de forma casual o cronológica en un portafolio o propuesta, sin contexto estratégico, restricción ni resultado.
- Redactar propuestas o correos vagos, reactivos o poco estructurados, generando incertidumbre en el cliente.
- Entregar una pieza para redes sociales sin probarla nunca a tamaño miniatura, asumiendo que si se ve bien a tamaño completo funcionará igual en un feed de scroll rápido.
- Sobrecargar una pieza de consumo rápido con múltiples elementos compitiendo por la atención (varios logos, texturas, formas decorativas y titulares al mismo nivel de énfasis).
- Diseñar cada pieza de una secuencia (carrusel, campaña) con la misma estructura, grilla y jerarquía, cambiando solo texto e imágenes, sin planificar una progresión de tensión y resolución.
- Presentar una demostración de interfaz de una herramienta patrocinada como si fuera parte del método estratégico central, mezclando promoción con contenido educativo.
- Tratar afirmaciones no verificadas del presentador (como "duplicar tu valor" o cifras exactas de "2 segundos" de atención) como hechos comprobados al aplicarlas en informes a clientes.

# Criterios de aceptación

- El proyecto documenta explícitamente un análisis de al menos algunas referencias del nicho del cliente antes de la fase de diseño, o justifica por qué se omitió ese paso.
- La decisión de alinear o romper con las convenciones visuales del nicho está documentada y justificada frente al brief.
- Las descripciones del trabajo en portafolio o propuestas incluyen problema, restricción, decisión estratégica y resultado, no solo una descripción visual o cronológica.
- Las comunicaciones con el cliente (propuestas, correos) siguen una estructura clara, con conclusiones y próximos pasos explícitos.
- Toda pieza destinada a redes sociales o consumo rápido fue probada a escala reducida (aproximadamente 10-15%) y tiene un punto de entrada visual dominante identificable en esa prueba.
- En piezas de consumo rápido, no hay más de un elemento visual compitiendo por la atención inicial del espectador.
- Las secuencias de piezas relacionadas (carruseles, campañas) muestran una progresión de énfasis y ritmo entre piezas, no una repetición idéntica de estructura.
- El lenguaje visual (tipografía, paleta, estilo) se mantiene consistente a lo largo de toda la secuencia, incluso cuando cambia el énfasis.
- Cualquier herramienta de terceros recomendada está claramente separada del método estratégico y declara su naturaleza comercial si corresponde.
- No se presentan cifras de impacto (como "duplicar valor" o "2 segundos de atención") como datos medidos verificados sin indicarlas como opinión o marco conceptual.

# Rúbrica de evaluación

Escala de 0 a 3 para cada dimensión:

- **0 — Ausente**: la dimensión no se abordó en absoluto.
- **1 — Insuficiente**: se menciona pero no se aplica de forma consistente ni documentada.
- **2 — Aceptable**: se aplica de forma parcial, con documentación básica pero sin profundidad estratégica.
- **3 — Elite** (término del propio video): se aplica de forma completa, documentada y justificada frente al brief, incluyendo evidencia de prueba (por ejemplo, captura de la prueba de miniatura) o registro explícito del análisis de saturación.

Dimensiones a evaluar:

1. Posicionamiento frente a la saturación de nicho (análisis de competidores y decisión documentada).
2. Comunicación estratégica con el cliente (sesgo de autoridad y de claridad aplicados en propuestas/portafolio).
3. Optimización para velocidad de cognición (prueba de miniatura, punto de entrada dominante).
4. Arquitectura narrativa en secuencias de piezas (progresión de tensión, expansión, énfasis, respiro y resolución).

**Resultado mínimo aceptable**: puntaje 2 o superior en al menos tres de las cuatro dimensiones, con la dimensión de "prueba de miniatura" (dimensión 3) documentada explícitamente cuando la pieza esté destinada a redes sociales.

**Fallas bloqueantes**: entregar una pieza para redes sociales sin ninguna prueba de miniatura documentada; presentar cifras de impacto no verificadas del presentador como datos medidos propios del proyecto; mezclar contenido patrocinado con el método estratégico sin declararlo.

# Resumen compacto

El video "4 Graphic Design Tips For ELITE Design Thinkers!" de Satori Graphics (ID `u-JtFKXL_jY`, 738 segundos, en inglés) plantea que un diseñador gráfico competitivo en 2026 debe operar en cuatro planos más allá de lo puramente estético: (1) analizar la saturación visual de su nicho mediante una auditoría de 10-20 competidores antes de diseñar, decidiendo conscientemente alinearse o diferenciarse; (2) comunicar su trabajo a clientes usando los sesgos de autoridad (describir resultados estratégicos, no solo piezas) y de claridad (comunicación estructurada y decisiva); (3) probar toda pieza de consumo rápido a escala miniatura (10-15%) para garantizar un único punto de entrada visual dominante, dado el contexto de "economía de 2 segundos" en redes sociales; y (4) planificar secuencias de piezas relacionadas (carruseles, campañas) como una progresión narrativa con tensión inicial, expansión, cambio de énfasis, respiro visual y resolución final, en lugar de repetir la misma estructura en cada pieza. El video incluye un segmento patrocinado de Fontbase que se documenta como promoción separada del método. Las afirmaciones cuantitativas del presentador (duplicar el valor, la cifra de "2 segundos") se marcan como no verificadas por falta de evidencia primaria adicional. La evidencia visual (20 frames uniformes, inspeccionados en un contact sheet) confirma que los diagramas y ejemplos mostrados en pantalla corresponden fielmente a lo narrado en el audio, sin agregar afirmaciones de resultados de negocio no mencionadas verbalmente.

[S97]

### Patterns > Receiptcore / Receifty

Receiptcore / Receifty

Principle: A style that literally mimics the look of a physical receipt, in either a decorated pastel-paper variant or a realistic plain white grocery-receipt variant, originating from a third-party Spotify-linked service called Receifty.

Problem: Prevents conflating this with generic 'vintage paper' styling by anchoring it to the specific monospace/barcode/vertical-layout signature of an actual receipt.

Source basis: The presenter defines the style, its two variants, its Spotify-linked origin, and lists its core features and use cases verbally (15:02-17:06), confirmed by the matching frame.

Professional extension: None added; the pattern reflects the source description directly.

[S98]

### Patterns > Web brutalism definition and characteristic checklist

Web brutalism definition and characteristic checklist

Principle: A design can be called web-brutalist when it exhibits some or most of a defined set of recurring visual characteristics, on a spectrum from subtle to in-your-face, not as an all-or-nothing binary.

Problem: Prevents vague or inconsistent labeling of a design as 'brutalist' without checking it against a concrete, observable feature set.

Source basis: The source states the characteristic list directly at 00:34 and notes intensity varies ('sometimes they're right in your face, sometimes more gentle and subtle') at 01:08.

Professional extension: None; this pattern stays within source content.

[S99]

## Coverage and limitations

- Blocks considered: 101
- Blocks included: 99
- The token budget was exhausted; 2 additional block(s) with real evidence were left out.

## Source registry

- auto-design / AXpxZMRM1EY — The ULTIMATE Guide To Typography For Beginners (DesignSpo)
- auto-design / kK1TOpI948o — The Beginner's Guide To Visual Hierarchy (DesignSpo)
- auto-design / uZWnxa4mkKA — 15 More Design Styles You've Never Heard Of (Kittl)
- auto-design / YlN28RNChl0 — This Video Will Take You From Junior to Senior UX/UI Designer (uxpeak)
- auto-design / u-JtFKXL_jY — 4 Graphic Design Tips For ELITE Design Thinkers! (Satori Graphics)
- auto-design / PKfZ1gnVJ44 — The FULL 2026 Guide To Layout & Composition For Designers! (Satori Graphics)
- auto-design / DU6vjWnH2p0 — How I design websites with EDITORIAL style layouts (part 1) (BONT)
- auto-design / _DHiyzRN4gY — Why Minimalism Dominates Modern Graphic Design (Kittl)
- auto-design / WxZHUe8mvhU — 11 Years of Brutally Honest Web Design Advice in 7 Minutes (Self-Made Web Designer)
- auto-design / waHuVF3XuMA — Steal These Web Design Trends 2026 (Self-Made Web Designer)
- auto-design / 0BTp6w5yhhw — Brutalism Graphic Design: Why It’s Ugly, Bold, and Trending in 2025! (Spoon Graphics)
- auto-design / 8Z_MEP-_kxA — Web Design Trends 2026 (DesignSense)
- auto-design / OjaciP_fBwU — 30 Graphic Design Styles in 15 Minutes (Maria Tokar)
- auto-design / xpLUouSZHi8 — 20 More Design Styles You've Been Searching For (Kittl)
- auto-design / 8ahnUt_A5eA — Popular Web Design Trends (Codex Community)
- auto-design / bdC2BtJNt9s — The Art of Minimalism (Seth Curl)
- auto-design / tbf6XDqCWFE — BRUTALISM: Best Website Examples for Your Web Design Inspiration |  TemplateMonster (TemplateMonster)
- auto-design / Vs2oSkw4VHM — 8 advanced rules of minimal Web Design (BONT)
- auto-design / bZ1vbmV5gk8 — 40 Design Style Names You've Been Looking For (Find References Faster) (Kittl)
- auto-design / DRmnkaWQp4o — 9 Web Design Trends 2025 to Spruce Up Your Site (Showit)
- auto-design / AzjbRybUX3M — Why Your Designs Still Look Amateur! (Hidden Rules Pros Use) (Satori Graphics)
- auto-design / 8XWX5EIxBz8 — BRUTALIST WEB DESIGNS - The UGLIEST Design Trend of 2020 | TemplateMonster (TemplateMonster)
