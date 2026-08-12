---
schema_version: "1.0"
query: "recetas de cocina vegana para principiantes"
depth: balanced
estimated_tokens: 31944
sources_used: 25
---

# Context package

## Query and scope

Query: recetas de cocina vegana para principiantes
Depth: balanced (max 32000 estimated tokens)

## Highest-relevance context

### Contexto autónomo para un agente > Mapa temporal de procedencia

| Tiempo | Contenido |
|---|---|
| 00:00–00:30 | Introducción: qué se va a aprender (jerarquía visual, cinco reglas) y definición de jerarquía visual como orden de percepción, con el concepto de "primacía". |
| 00:30–01:01 | Regla 1: la jerarquía está diseñada para guiar al espectador. Por qué se rankean elementos por primacía. |
| 01:01–01:33 | Regla 2: la cantidad de elementos y su primacía están correlacionadas. Introducción de contraste, uniformidad y composición como los tres pilares. |
| 01:33–02:05 | Explicación del contraste con el ejemplo de una cuadrícula de puntos idénticos (evidencia visual: `supplemental-108s.png`). Regla 3: no hay jerarquía sin contraste. |
| 02:05–02:35 | Introducción a la lista de diez formas de crear contraste. Técnica 1: movimiento. |
| 02:35–03:05 | Uso recomendado del movimiento: como impulso inicial, no como distracción sostenida. Técnica 2: información relacionada con la tarea del usuario. |
| 03:05–03:35 | Ejemplo de la receta de cocina y el botón "jump to recipe" (evidencia: `frame-35pct.png`, receta de galletas). |
| 03:35–04:07 | Técnica 3: puntos focales mediante espacio en blanco. Definición de "white space" (evidencia: `frame-20pct.png`). |
| 04:07–04:38 | Técnica 4: rostros humanos. Por qué los rostros captan atención más rápido que casi cualquier otro elemento (evidencia: `supplemental-260s.png`, portada de revista). |
| 04:38–05:09 | Advertencia sobre el uso irrelevante de rostros de stock; ejemplo de venta de clases de guitarra vs. venta de productos horneados. |
| 05:09–05:40 | Técnica 5: color. Introducción a mover valores de color en la rueda cromática para generar distancia. |

[S01]

### Método completo de la fuente > Principio / paso 4 — Convertir la auditoría en hábito diario mediante microacciones

El video enumera, de forma casi literal, una lista de microacciones diarias
que sostienen el hábito de minimalismo una vez hecha la auditoría inicial
(02:45–04:18). Se preserva la lista completa porque el creador la presenta
como una enumeración exhaustiva de ejemplos aplicables:

1. Cerrar aplicaciones abiertas en el teléfono.
2. Cerrar pestañas del navegador que no se están usando.
3. Borrar archivos que ya no se necesitan, con frecuencia.
4. Limpiar las superficies de la cocina inmediatamente después de usarlas.
5. Sacar uno o dos objetos del auto cada vez que se sale de él.
6. Anotar una compra en el momento para mantener el control del presupuesto
   (10 segundos).
7. Poner eventos importantes en el calendario cada semana.
8. Crear un recordatorio en el teléfono en el instante en que se piensa algo.
9. Usar "leer todo" en el correo o, mejor aún, darse de baja de correos que
   no se necesitan.
10. Quitar una canción de una lista de reproducción si ya no gusta.
11. Agregar una canción a una lista de reproducción si sí gusta.
12. Vender una prenda que no se ha usado en dos años.
13. Cancelar notificaciones de texto de tiendas que ya no se frecuentan.
14. Tirar cualquier basura o trasto en el momento en que se ve, en cualquier
    parte de la casa.

El creador aclara el mecanismo por el cual estas microacciones funcionan:
"Lo que parece mucho trabajo para empezar todos estos hábitos... en realidad
está agregando menos para mañana, e incluso menos para el día siguiente, e
incluso menos para el día después de eso." (03:47–04:18) Es decir, el costo
de instaurar el hábito es alto al principio y decreciente después, porque
cada microacción evita la acumulación de una tarea mayor futura.

[S02]

### Método completo de la fuente > Principio 4: diez formas de crear contraste, ordenadas de mayor a menor poder

El video reconoce que existen "un millón" de formas distintas de crear contraste, pero elige explicar las diez que considera más importantes, ordenadas de la que genera más contraste a la que genera menos. Es una lista explícitamente numerada y completa dentro del video; a continuación se reconstruye cada elemento sin omitir ninguno.

1. **Movimiento.** El ojo humano —y por extensión la mente humana— está programado para detectar movimiento, un mecanismo evolutivo de detección de amenazas. Estudios de escaneo cerebral citados en el video muestran que un elemento en movimiento es el primero en notarse. Sin embargo, el propio video advierte que "menos es más": si un elemento consume demasiada atención o se percibe como irrelevante o exagerado, frustra al usuario. La recomendación operativa es usar el movimiento para atraer la mirada inicialmente, y luego reducirlo al mínimo o detenerlo una vez que el usuario ya está mirando.

2. **Información relacionada con la tarea del usuario.** Después del movimiento, lo segundo que el ojo busca es lo conocido, es decir, lo que el usuario ya está buscando activamente. El video da el ejemplo de las recetas de cocina online: los usuarios ignoran automáticamente la imagen del blog, el título y la historia personal del autor, y van directo al botón "jump to recipe" (evidencia visual: `frame-35pct.png` muestra efectivamente una receta de galletas con chips de chocolate con texto extenso, ejemplificando ese tipo de página). La implicación para el diseñador es alinear lo que es prominente en el diseño con lo que el visitante realmente busca: en un póster de evento, los detalles del evento deben ser claros; en una página de ventas, el botón de compra y el precio deben ser obvios.

[S03]

### Método completo de la fuente > Principio / paso / elemento 2 — Recolectar todos los activos en Figma (paso 1 del proceso)

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

[S04]

### Flujo integrado para el agente

1. **Definir la jerarquía deseada.** Antes de tocar cualquier valor visual, listar mentalmente (o en un documento) qué elemento debe notarse primero, cuál segundo, cuál tercero, etc., en función de lo que el usuario realmente necesita para completar su tarea, no en función de qué contenido "parece" más importante en abstracto.
2. **Aplicar contraste solo al elemento o los pocos elementos que deben tener primacía**, eligiendo entre las diez técnicas descritas (movimiento, información relacionada con la tarea, puntos focales por espacio en blanco, rostros, color, tamaño, peso, imágenes, elementos extra, desalineación), priorizando las de mayor impacto (movimiento, información relevante para la tarea) cuando el objetivo sea captar atención inmediata, y las de impacto más sutil (peso, elementos extra) cuando se busque guiar sin saturar.
3. **Aplicar uniformidad a todos los elementos que no deban competir por primacía**, igualando explícitamente tamaño, fuente, peso, color de borde, radio de esquina y otros valores repetibles dentro de cada grupo de elementos del mismo tipo (por ejemplo, todas las tarjetas de un mismo bloque).
4. **Agrupar elementos similares** para reforzar la cohesión visual y facilitar el escaneo.
5. **Elegir un patrón de composición según el medio y la audiencia**: arriba-abajo para cartas o audiencias con ese hábito de lectura; izquierda-derecha simple; patrón en Z para diseños minimalistas, pósteres o pantallas con poco texto; patrón en F para páginas web con abundante texto.
6. **Verificar el contraste de color con una herramienta de accesibilidad** (el video cita específicamente la calculadora de WebAIM) y apuntar a un ratio de al menos 4.5:1 quirúrgicamente cuando el objetivo sea legibilidad de texto o distinción de un elemento sobre el fondo.
7. **Aplicar moderación en el uso de rostros e imágenes**: usarlos solo cuando estén directamente relacionados con lo que el diseño promociona, evitando fotografías de stock genéricas que puedan robar atención sin aportar al mensaje.

[S05]

### Método completo de la fuente > Principio / paso / elemento 3: Catálogo de tipos de sistemas de grilla

- **Regla de tercios.** Divide el diseño en nueve partes iguales mediante dos líneas horizontales y dos verticales, útil para ubicar elementos clave de forma natural; se puede romper deliberadamente colocando el sujeto principal ligeramente fuera de la grilla para generar tensión o sorpresa.
- **Grilla compuesta (compound grid).** Combina, por ejemplo, una grilla de columnas para listados de producto con una grilla modular para los detalles del producto, manteniendo espacio de respiro entre elementos.
- **Grilla isométrica.** Aporta un efecto 3D a ilustraciones o infografías (edificios, estructuras de datos); se recomienda usar sombras y colores más claros arriba y más oscuros debajo para reforzar la sensación de volumen.
- **Grilla circular.** Útil para logotipos con formas orgánicas y redondeadas, ayuda tanto al posicionamiento como a generar formas interesantes en los espacios entre elementos.
- **Grilla triangular.** Sirve para crear patrones geométricos o posicionar elementos (logo, detalles de producto) en puntos de interés específicos, por ejemplo en el empaque de un producto; puede combinarse con gradientes o acabados metálicos a lo largo de los ángulos.

[S06]

### Flujo integrado para el agente

1. **Diseñar primero la versión de escritorio** completa del sitio,
maximizando riqueza de interacción, animaciones y jerarquía tipográfica
(Principio 2).
2. **Definir el objetivo de conversión** de la página antes de defender
cualquier decisión estética: identificar qué acción debe realizar el
usuario y verificar que la composición la señale (Principio 1).
3. **Elegir como máximo dos o tres tamaños de referencia** (Full HD para
escritorio, opcionalmente un tamaño de laptop, y un tamaño de teléfono
pequeño como referencia mobile), evitando diseñar para diez breakpoints
distintos salvo proyectos de presupuesto alto y alta escala (Principio 4).
4. **Traducir el diseño de escritorio a mobile aplicando las seis reglas**:
ocultar navegación, permitir resumir/empujar contenido, invertir
orientación horizontal/vertical, empujar botones hacia abajo para
accesibilidad táctil, reducir solo los títulos manteniendo el cuerpo en
16px, y usar una grilla de 6 columnas para preservar proporciones
asimétricas (Principio 8).
5. **Revisar tamaños de texto y espaciados** de forma iterativa: no asumir
que los valores de escritorio son correctos para mobile; en particular,
validar que el cuerpo de texto use 16px como mínimo (Principio 5).
6. **Diseñar componentes interactivos** (como carruseles) pensando
explícitamente en el área táctil, reutilizando bordes de alineación de
forma consistente y ofreciendo variantes visuales para evitar monotonía
(Principio 7).
7. **Preparar el archivo de handoff** con sistema tipográfico, sistema de
color documentado por uso, grilla rehecha en rectángulos con márgenes y
gutters explícitos, kit de botones/UI y notas de comportamiento simples;
evitar sobre-especificar cada breakpoint (Principio 9).
8. **Seleccionar un desarrollador de nivel comparable** al del diseñador, o
delegar solo cuando exista una relación de confianza mutua (Principio
10).
9. **Ajustar en conjunto con el desarrollador** los puntos de quiebre reales
una vez codificado el sitio, en vez de intentar anticipar cada breakpoint
en el diseño (Principio 3).

[S07]

### Flujo integrado para el agente

11. **Evaluar la tendencia 9 (anti-usabilidad)** de forma muy restringida:
solo para marcas explícitamente experimentales o de alto diseño, nunca
para sitios transaccionales, de e-commerce críticos, gubernamentales o de
servicios esenciales, dado que introduce fricción deliberada.
12. **Separar siempre la recomendación de diseño de la promoción de Showit**:
el hecho de que el video sea contenido patrocinado por Showit para
promover su constructor no invalida el análisis de tendencias, pero no
debe presentarse como si Showit fuera la única vía técnica para
implementarlas.
13. **Citar la evidencia visual por su nombre de archivo exacto** cuando se
reutilice este dossier en otro documento, para mantener la trazabilidad.

[S08]

### Flujo integrado para el agente

8. **Ajustar el tracking (letter-spacing) de forma inversamente proporcional al tamaño**: reducir el espaciado en textos grandes; aumentarlo levemente en textos pequeños para preservar la distinción entre caracteres.
9. **Verificar el contraste de color de cada combinación de texto y fondo** usando una calculadora de contraste dedicada (el video menciona webaim.org), confirmando una relación mínima de 7 a 1 antes de aprobar el diseño.
10. **Definir un sistema de rejilla coherente** con el medio de salida: 12 columnas para web, 2 columnas para impresos generales, 6 columnas para formatos tipo periódico, 3 columnas para formatos tipo revista, o razón áurea para pósters, y mantener esa elección de forma consistente en todo el proyecto.
11. **Separar cualquier ajuste de kerning manual** (espaciado entre pares de letras específicos, típicamente en logotipos) del resto del flujo de trabajo tipográfico general, reservándolo para piezas de marca de alto impacto donde se justifique la inversión de tiempo.
12. **Documentar el sistema resultante** (familia tipográfica, escala de tamaños, pesos, interlineados, tracking, rejilla) como un artefacto reutilizable del proyecto, de forma que futuras piezas de comunicación puedan ensamblarse "como piezas de Lego" sin rehacer estas decisiones desde cero.

[S09]

### Flujo integrado para el agente

1. Formular el problema del producto y la acción principal antes de hablar de tendencias.
2. Elegir una hipótesis: profundidad/transparencia, materialidad, 3D, gradiente, futurismo o personalización.
3. Escribir qué señal funcional debe aportar esa hipótesis y qué no debe sacrificar.
4. Crear dos rutas visuales: una base sobria y una ruta con el efecto; comparar comprensión, contraste, foco y rendimiento.
5. Prototipar estados estáticos y, si corresponde, movimiento reducido. No inferir interacción de una captura.
6. Validar con personas reales, teclado, lector de pantalla, pantallas pequeñas y conexiones limitadas.
7. Revisar licencias, marcas, datos personales, consentimiento y promesas temporales antes de publicar.
8. Documentar tokens, variantes y criterios de reversión para que la personalización no fracture el sistema.

[S10]

### Flujo integrado para el agente

Secuencia ejecutable para que un agente aplique este método a un proyecto
real de diseño o branding:

1. **Diagnosticar la capa funcional primero.** Antes de discutir estética,
   verificar que cualquier color usado para señalizar estado, acción o
   navegación cumpla su función de forma inequívoca (principio 2).
2. **Mapear la capa emocional deseada.** Definir en 2-3 palabras la
   sensación que debe transmitir la paleta (energética, calmada, lúdica,
   seria) y usarla como guía, no como regla rígida (principio 3).
3. **Verificar la capa cultural para cada mercado objetivo.** Si el
   proyecto tiene audiencia internacional o multicultural, listar
   explícitamente las asociaciones de color relevantes por región antes de
   fijar la paleta (principio 4).
4. **Auditar la capa competitiva.** Identificar los colores dominantes en la
   categoría o industria del proyecto y decidir conscientemente si la
   estrategia es integrarse o diferenciarse (principio 5).
5. **Formular la capa estratégica como pregunta explícita.** Para el color
   principal elegido, responder por escrito: ¿qué debe lograr este color:
   atención, confianza, diferenciación? (principio 6).
6. **Asignar los cuatro roles del sistema práctico.** Elegir un color
   primario (identidad), uno o más secundarios (apoyo y variación), un
   acento (llamada a la acción y jerarquía) y neutros (estructura y
   legibilidad) (principio 7).
7. **Excluir contenido patrocinado del análisis de color.** Si se reutiliza
   este video como referencia, extraer el segmento de Superhuman Mail del
   cuerpo de reglas de color; tratarlo solo como nota de procedencia
   (principio 8).
8. **Aplicar los criterios de aceptación** (ver sección siguiente) antes de
   dar por cerrada cualquier decisión de paleta.
9. **Documentar qué fue evidencia directa y qué fue extensión
   profesional** al presentar el resultado a un humano, siguiendo el
   límite de evidencia declarado en este documento.

[S11]

### Contexto autónomo para un agente

Este documento describe, sin necesidad de ver el video original, el contenido completo del video de YouTube con ID `kK1TOpI948o`, titulado "The Beginner's Guide To Visual Hierarchy" ("La guía para principiantes sobre jerarquía visual"), publicado por el canal DesignSpo. El video dura 928 segundos (15 minutos y 28 segundos) y fue subido el 22 de abril de 2026. Todo el audio está en inglés; no se detectaron fragmentos materiales en otros idiomas. El documento fue construido a partir de la pista de subtítulos automáticos original (`en-orig`), un video descargado en baja resolución, veinte fotogramas muestreados uniformemente entre el 0% y el 95% de la duración, y siete fotogramas suplementarios extraídos en instantes puntuales identificados como material relevante durante la inspección visual.

[S12]

### Resumen compacto

El video presenta cinco recursos, no cinco recetas obligatorias. Ilustración manual aporta humanidad; 3D comunica objeto y profundidad; IA abre exploración pero no sustituye implementación; Bento ordena información para escaneo; gradientes y glows construyen atmósfera. La evidencia visual inspeccionada confirma los ejemplos y sus transiciones, mientras que las garantías de facilidad, rendimiento o impacto permanecen fuera del alcance de la fuente. Un agente debe elegir el recurso que resuelva una necesidad concreta, implementarlo con accesibilidad y fallbacks, y mantener una frontera clara entre lo que el video muestra y lo que requiere validación profesional.

[S13]

### Antipatrones

- Diseñar una pieza aislada usando solo referencias de Pinterest o inspiración genérica, sin analizar el estado de saturación visual del nicho específico del cliente.
- Copiar las convenciones visuales dominantes de un nicho sin una decisión consciente, resultando en un diseño "invisible" por indistinguible del resto.
- Describir el propio trabajo de forma casual o cronológica en un portafolio o propuesta, sin contexto estratégico, restricción ni resultado.
- Redactar propuestas o correos vagos, reactivos o poco estructurados, generando incertidumbre en el cliente.
- Entregar una pieza para redes sociales sin probarla nunca a tamaño miniatura, asumiendo que si se ve bien a tamaño completo funcionará igual en un feed de scroll rápido.
- Sobrecargar una pieza de consumo rápido con múltiples elementos compitiendo por la atención (varios logos, texturas, formas decorativas y titulares al mismo nivel de énfasis).
- Diseñar cada pieza de una secuencia (carrusel, campaña) con la misma estructura, grilla y jerarquía, cambiando solo texto e imágenes, sin planificar una progresión de tensión y resolución.
- Presentar una demostración de interfaz de una herramienta patrocinada como si fuera parte del método estratégico central, mezclando promoción con contenido educativo.
- Tratar afirmaciones no verificadas del presentador (como "duplicar tu valor" o cifras exactas de "2 segundos" de atención) como hechos comprobados al aplicarlas en informes a clientes.

[S14]

### Flujo integrado para el agente

Secuencia ejecutable que otro agente puede seguir para aplicar o explicar el
método completo, en orden:

1. Adoptar la definición estricta de minimalismo (paso 1) antes de dar
   cualquier consejo, para evitar confundirlo con simple organización.
2. Explicar la diferencia entre organización y minimalismo (paso 2) cuando el
   usuario mezcle ambos conceptos.
3. Guiar una auditoría inicial de posesiones y espacios físicos y digitales,
   pidiendo al usuario que liste por escrito qué necesita realmente (paso 3).
4. Traducir la auditoría en una lista concreta de microacciones diarias
   (paso 4), priorizando acciones de bajo costo y alta frecuencia (cerrar
   apps, borrar archivos, ordenar mientras se usa un espacio) sobre grandes
   purgas puntuales.
5. Incluir siempre una verificación de propósito (paso 5): antes de recomendar
   más tareas de orden, preguntar por qué se están haciendo y hacia qué
   objetivo intencional apuntan, para evitar que el minimalismo se vuelva
   compulsivo.
6. Sugerir una práctica de inicio de día lento y deliberado (paso 6) como
   ancla diaria, adaptable (diario, meditación, silencio, oración) según las
   preferencias del usuario.
7. Conectar explícitamente cada acción con el objetivo de reducir
   distracciones (paso 7), no solo reducir objetos.
8. Si el usuario busca beneficios creativos o de productividad, presentar el
   testimonio del creador (paso 8) como experiencia personal declarada, no
   como garantía de resultado.
9. Cerrar cualquier plan de minimalismo señalando el beneficio relacional
   (paso 9): más tiempo de calidad con las personas, como motivación de alto
   nivel, no solo eficiencia personal.
10. Separar siempre, en cualquier resumen generado, las promociones del
    creador (equipo de cámara, servicios de música, marcas) de las
    recomendaciones del método.

[S15]

### Contexto autónomo para un agente > Propósito

Este documento convierte el video de YouTube "The Art of Minimalism" (ID
`bdC2BtJNt9s`), publicado por el creador de cine y contenido personal Seth Curl,
en un paquete de conocimiento autosuficiente. El objetivo es que otro agente
pueda entender, explicar y aplicar el método de minimalismo personal que
presenta el video sin necesidad de verlo, escucharlo ni consultar la fuente
original. El video es un monólogo directo a cámara —no un tutorial técnico ni
una demostración de software— en el que el creador expone su filosofía y
rutina personal de minimalismo, ilustrada con metraje casero (su cocina, su
oficina, su auto, una libreta de "cosas por hacer") y tarjetas de título
editadas ("CHAPTER 2: THE WHY", "less").

[S16]

### Reglas operativas

- No confundir minimalismo con organización doméstica; son conceptos
  relacionados pero distintos según la fuente.
- No presentar las microacciones diarias como opcionales aisladas: el video
  las presenta como un conjunto que sostiene el hábito, no como una lista de
  la que basta elegir una.
- No recomendar purgas masivas puntuales como sustituto de la práctica diaria
  continua; la fuente enfatiza explícitamente la constancia sobre el
  esfuerzo puntual.
- Incluir siempre la verificación de propósito (paso 5) al recomendar tareas
  de organización repetidas, para prevenir que el hábito se vuelva
  compulsivo o controlador, tal como advierte el propio creador.
- No presentar los enlaces de afiliados, descuentos o promociones de la
  descripción del video como parte del método de minimalismo.
- No citar ningún fotograma como prueba de un resultado medible (por ejemplo,
  "más rápido como editor"); los fotogramas confirman solo lo que aparece en
  pantalla, no métricas de desempeño.
- Mantener las citas traducidas siempre con su marca de tiempo original para
  que sean verificables contra `transcript/source.txt`.

**Extensión profesional (salvaguardas añadidas por este dossier, no
declaradas por el video):**

[S17]

### Reglas operativas

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

[S18]

### Contexto autónomo para un agente > Propósito

Este documento convierte el video de YouTube "The ULTIMATE Guide To Typography For Beginners" (ID de YouTube: AXpxZMRM1EY), publicado por el canal DesignSpo, en un paquete de conocimiento autocontenido para que otro agente pueda trabajar sobre tipografía sin necesidad de ver, escuchar o consultar el video original. El video dura 810 segundos (13 minutos y 30 segundos) y está dirigido a principiantes en diseño: recorre qué es la tipografía, las familias de tipos de letra existentes, las variables que controlan la apariencia de un bloque de texto y cómo combinarlas en un sistema tipográfico coherente para un producto digital o impreso.

La fuente es en inglés hablado (`source_language: en`) y no se detectaron idiomas secundarios materiales: el narrador habla en inglés durante todo el metraje y las interfaces mostradas en pantalla (Figma, un editor de código, un sitio web llamado "June") también están en inglés. Este documento en español traduce el contenido íntegro del video, incluidas las citas textuales, que conservan su marca de tiempo para que puedan verificarse contra `transcript/source.txt`.

El objetivo de este dossier es que un agente de diseño, desarrollo de producto o generación de interfaces pueda: (1) explicar con precisión las categorías de tipos de letra y cuándo usar cada una; (2) aplicar correctamente las variables tipográficas (tamaño, peso, línea base, interlineado, tracking, kerning, contraste); (3) construir una jerarquía tipográfica y un sistema de rejilla coherente; y (4) hacerlo citando el origen exacto de cada afirmación, distinguiendo lo que el video demuestra de lo que este dossier añade como extensión profesional.

[S19]

### Rúbrica de evaluación > Extensiones profesionales (salvaguardas no atribuidas al video)

Estas recomendaciones no provienen del video; se agregan como buena práctica
profesional al proponer o implementar brutalismo web.

- **Accesibilidad**: verificar contraste de color suficiente incluso en
  paletas "ácidas" o de alto contraste, asegurar navegación completa por
  teclado, proporcionar texto alternativo en imágenes decorativas
  superpuestas, y probar con lectores de pantalla, ya que las jerarquías
  visuales "rotas" pueden producir un orden de lectura confuso para
  tecnología asistiva.
- **Comportamiento responsivo**: los elementos superpuestos y las
  cuadrículas asimétricas requieren pruebas explícitas en pantallas
  pequeñas; lo que en escritorio se ve como "caos intencional" puede volverse
  ilegible o solaparse de forma no controlada en móvil.
- **Movimiento reducido**: si se añaden animaciones o cursores personalizados
  grandes (mencionados en la fuente como rasgo típico), respetar la
  preferencia `prefers-reduced-motion` del sistema operativo del usuario.
- **Rendimiento**: tipografías grandes personalizadas, imágenes de alta
  resolución superpuestas y efectos visuales pesados deben optimizarse para
  no penalizar el tiempo de carga, especialmente en conexiones móviles.
- **Claridad de contenido**: en cualquier variante comercial, mantener
  legibles y accesibles las acciones críticas (compra, contacto, navegación
  principal) aunque el resto del layout sea deliberadamente caótico.
- **Licencias y atribución**: si se reutiliza cualquier plantilla comercial
  (como las mostradas del catálogo de TemplateMonster) verificar los
  términos de licencia antes de reutilizar código, tipografías o activos
  visuales.
- **Autenticidad de ejemplos**: al presentar capturas de sitios de terceros
  como inspiración, evitar dar a entender que se tiene autorización para
  copiarlos; el brutalismo como estilo es libre de imitar, pero los activos
  concretos (imágenes, logotipos, código) de cada ejemplo no lo son.
- **Vigencia temporal**: advertir siempre que los ejemplos mostrados
  corresponden a una fecha de publicación de enero de 2020 y que los sitios
  reales pueden haber cambiado o dejado de existir.

[S20]

### Flujo integrado para el agente

1. Cuando un usuario describe una necesidad visual vaga ("quiero algo como
   esto pero no sé cómo se llama"), consultar primero esta lista de veinte
   nombres (más los de entregas anteriores de la serie, si están disponibles
   como contexto) para ver si alguno coincide con la intención descrita.
2. Verificar la coincidencia contra al menos tres rasgos observables del
   estilo elegido (paleta, tipografía, composición, motivo temático), no
   solo el nombre.
3. Formular una consulta de búsqueda combinando el nombre del estilo con un
   modificador de medio o intención: "poster", "branding", "illustration",
   "packaging", según recomienda el propio video.
4. Al presentar referencias al usuario, aclarar explícitamente que son
   ejemplos de estilo, no activos con licencia verificada ni plantillas
   listas para usar; el video no establece la procedencia legal de ninguna
   pieza mostrada.
5. Distinguir para el usuario entre estilos con raíz histórica documentada
   (Chinoiserie, Regencycore, Diesel Punk, Rocket Punk) y estilos que son más
   bien etiquetas de tendencia contemporánea o de subcultura (Cottagecore,
   Kidcore, Trinket design, Anti-design), ya que el rigor de la referencia
   histórica varía.
6. Si el usuario pide un estilo con temática cultural sensible (por ejemplo,
   Afrofuturism, o Chinoiserie, que reinterpreta motivos históricos chinos
   desde una perspectiva occidental), recomendar investigar la procedencia
   cultural del motivo y evitar apropiación superficial o estereotipada
   (ver "Reglas operativas").
7. No presentar ningún ejemplo visual citado en este documento como
   "disponible para usar" o "libre de derechos": son evidencia de estilo, no
   activos verificados.

[S21]

### Flujo integrado para el agente

1. **Establecer primero la marca y el objetivo.** Antes de evaluar cualquier
   tendencia, escribir en una línea qué hace el negocio y qué debe lograr el
   sitio. Este paso es la regla explícita de la fuente y condiciona todo lo demás.
2. **Elegir un eje, no nueve.** Las tendencias 1 y 2 son opuestas; las 3 y 6
   tiran en direcciones distintas. Seleccionar como máximo dos tendencias
   compatibles y descartar el resto conscientemente.
3. **Definir el nivel de intensidad.** Para cada tendencia elegida, la fuente
   recomienda sistemáticamente la dosis baja: una pizca de nostalgia, un acento
   de color, unas pocas líneas técnicas, un sonido suave.
4. **Construir la base sobria.** Tipografía (una familia si el eje es la
   tendencia 1), escala de espaciado, paleta reducida con un solo acento.
5. **Aplicar el acento de la tendencia** sobre esa base, no al revés. El
   degradado, el cursor, la textura o la animación entran como capa, no como
   fundamento.
6. **Verificar contra el objetivo.** Preguntar por cada elemento agregado: ¿esto
   comunica algo del sitio o solo demuestra que conozco la tendencia? Si es lo
   segundo, quitarlo.
7. **Extensión profesional — verificar accesibilidad.** Comprobar contraste de
   texto sobre degradados y sobre bloques de color saturado, tamaño de área
   clicable con cursores personalizados, y que ninguna información dependa solo
   del color o solo del sonido.
8. **Extensión profesional — verificar rendimiento.** Medir el peso y el tiempo de
   carga que agregan las escenas WebGL en dispositivos de gama media y en
   conexiones lentas antes de aprobarlas.
9. **Extensión profesional — respetar preferencias del sistema.** Honrar
   `prefers-reduced-motion` en animaciones y nunca reproducir audio sin acción
   deliberada del usuario.
10. **Extensión profesional — resolver licencias.** Verificar derechos de fuentes,
    texturas, ilustraciones y assets 3D antes de publicar.
11. **Documentar la decisión.** Registrar qué tendencias se adoptaron y por qué,
    para que la revisión posterior evalúe encaje y no gusto.

[S22]

### Contexto autónomo para un agente > Mapa temporal de procedencia

| 07:11–07:46 | Aplicación del sistema de diseño recién creado sobre el proyecto original mediante el ícono "+" y un nuevo prompt de refinamiento (hero a pantalla completa, animaciones de parallax con ingredientes). |
| 07:46–08:23 | El creador menciona haber alcanzado el límite de uso de la herramienta en ese punto de la grabación, e inserta una mención promocional a sus sesiones de mentoría y boletín. |
| 08:23–08:58 | Resultado tras aplicar el sistema de diseño: layout a pantalla completa, cursor personalizado, efecto parallax, sección de scroll horizontal sobre fondo color tomate. |
| 08:58–09:32 | Incorporación de imágenes generadas con ChatGPT (personas) y reemplazo de la ilustración de pizza por una fotografía real. |
| 09:32–10:04 | Resultado con las imágenes reales integradas: pizza más grande, animaciones de deslizamiento, calculadora funcional dentro del nuevo diseño. |
| 10:04–10:38 | El creador valora el resultado como muy superior al genérico inicial y explica la opción de enviar el proyecto a Claude Code (agente local, sesión web o descarga como zip). |
| 10:38–11:13 | Envío efectivo del prompt/diseño a Claude Code, creación de una carpeta local nueva y elección del modelo "Sonnet 5" para abaratar el consumo de tokens. |
| 11:13–11:46 | Mientras Claude Code trabaja, el creador vuelve a Claude Design para generar un menú de producto reutilizando el mismo sistema de diseño, mediante la plantilla de documento. |
| 11:46–12:17 | Configuración del menú mediante preguntas guiadas: una sola página, categorías (pizzas, bebidas, ensaladas), veinte ítems, sin fotos, solo estilos. |
| 12:17–12:51 | Resultado del menú: coherente visualmente con el sitio web, generado en minutos. |
| 12:51–13:27 | Generación de piezas para Instagram reutilizando el mismo sistema de diseño y una foto adjunta como referencia. |

[S23]

### Contexto autónomo para un agente > Mapa temporal de procedencia

Los tiempos siguientes provienen de los capítulos oficiales de YouTube y de la
lista de créditos de la descripción del video; ambos coinciden. Se listan como
procedencia, no como sustituto de la explicación del método (que se desarrolla
en la sección siguiente).

| Marca de tiempo | Sitio / estudio | URL (según descripción, marzo 2020) |
|---|---|---|
| 00:00–00:04 | Cortina de apertura sin título | — |
| 00:04–00:20 | Radical Everything | radicaleverything.wolffolins.com |
| 00:20–00:35 | Twenty Nine \| New York City & Berlin | xxix.co |
| 00:35–00:50 | QI Catalog (Qode Interactive) | qodeinteractive.com/catalog |
| 00:50–01:06 | TIGHT Top 2018 | en-2018.tight.media |
| 01:06–01:22 | De Vlieg | devlieg.eu |
| 01:22–01:38 | Lazy Eyes | lazyeyes.cool |
| 01:38–01:53 | Laurel Halo | laurelhalo.com |
| 01:53–02:09 | Jack Wild | isjackwild.com |
| 02:09–02:25 | Chrissie Abbott | chrissieabbott.com |
| 02:25–02:38 | One & All Conference | oneandall.io/2 |
| 02:38–02:45 | Zipeng Zhu Loves You | zz-is.it |
| 02:45–03:05 | High Five | highfivebro.com |
| (superpuesto, cierre) | Cortina de cierre con marca TemplateMonster | — |

[S24]

### Flujo integrado para el agente

1. Identificar el objetivo de la composición: ¿qué debe ver el espectador primero, segundo y al final? Definir el punto de apalancamiento antes de diagramar cualquier otra cosa.
2. Elegir el nivel de movimiento adecuado al mensaje: usar dirección literal solo si el mensaje es simple y urgente; para mensajes más sofisticados, apoyarse en jerarquía visual y flujos múltiples controlados.
3. Seleccionar un sistema de grilla acorde al medio: columnas para contenido editorial extenso, modular para catálogos o e-commerce, asimétrica o de jerarquía cuando un elemento debe dominar, isométrica o triangular para piezas con volumen o empaques, circular para logotipos orgánicos.
4. Aplicar la grilla de forma consistente y, si se desea generar impacto, romperla en un único punto de forma deliberada, nunca de manera accidental o generalizada.
5. Revisar el espacio en blanco micro (entre líneas y elementos cercanos) y macro (entre bloques y secciones), ajustando subdivisiones de la grilla si el resultado se siente apretado o desordenado.
6. Construir el ritmo interno agrupando elementos relacionados, manteniendo espaciado y alineación predecibles, y verificando que la mirada recorra el diseño en una secuencia lógica desde el punto de apalancamiento.
7. Introducir fricción solo donde aporte énfasis (tipografía apretada, un recorte, un elemento perturbador), evitando que se acumule en zonas que deban ser de lectura fácil.
8. Probar la transferibilidad: reducir el diseño a tamaño miniatura, cambiar el fondo claro/oscuro y proyectar el mismo sistema en al menos dos formatos distintos (por ejemplo impreso y digital) antes de darlo por finalizado.
9. Documentar qué principios se aplicaron y por qué, de modo que el sistema de diseño pueda transferirse a otros miembros de un equipo sin perder coherencia.
10. Aplicar las salvaguardas profesionales de la sección siguiente antes de presentar el trabajo como definitivo.

[S25]

### Antipatrones

- Aplicar varias tendencias simultáneamente porque todas están en la lista.
- Tomar la tendencia 1 y la 2 a la vez sin resolver cuál domina.
- Usar la etiqueta "wabi-sabi" para justificar un diseño simplemente descuidado.
- Poner líneas y etiquetas de plano técnico sobre un producto sin ninguna
  dimensión técnica, solo para parecer sofisticado.
- Agregar WebGL porque las herramientas lo permiten, sin relación con el mensaje
  del sitio. La fuente lo desaconseja explícitamente.
- Perseguir un sitio premiado cuando el cliente necesita un sitio que le sirva al
  negocio.
- Reproducir sonido automáticamente o sin control del usuario.
- Cursores personalizados exagerados del tipo que el propio autor señala como el
  error de la generación anterior.
- Texto de bajo contraste sobre degradados púrpura-azul.
- Presentar una captura de pantalla de un sitio de terceros como prueba de que la
  tendencia produce resultados de negocio.
- Copiar píxel a píxel cualquiera de los sitios exhibidos en el video.
- Tratar las causas que el autor atribuye a cada tendencia como hechos
  documentados en lugar de hipótesis.

[S26]

### Flujo integrado para el agente

1. Define usuario, tarea crítica, contenido indispensable, riesgo y métrica de comprensión.
2. Elige una tendencia primaria y, como máximo, una secundaria compatible; redacta por qué ayuda a la tarea.
3. Diseña la versión estática, jerarquía, navegación y CTA antes de efectos.
4. Añade el recurso expresivo: automatización confirmable, arte, revelado progresivo, profundidad, textura, tipo, cinética o nostalgia.
5. Implementa alternativas: HTML semántico, foco, teclado, contraste, texto alternativo, reducción de movimiento y fallback de fuentes/3D.
6. Mide carga, interacción y comprensión en móviles y equipos modestos; elimina efectos que no aporten evidencia de valor.
7. Verifica permiso, privacidad, licencias y autorización antes de personalizar, automatizar o reutilizar assets.

[S27]

### Método completo de la fuente > Principio 4: tipos de letra de display — diseñados para destacar, no para leer en párrafo

Cuando se busca un tipo de letra específicamente para logotipos, encabezados o títulos, se habla de un tipo de letra "display" (03:36). Los tipos display pueden ser serif, sans-serif, estar hechos de símbolos extraños o de cualquier otra forma; reciben su propia categoría porque están diseñados para ser únicos. El video es explícito en su limitación: "they don't make good paragraphs, buttons or labels" [no funcionan bien en párrafos, botones o etiquetas], pero si se busca que un fragmento corto de texto realmente destaque, un tipo display es la elección correcta (03:36).

`frame-30pct.png` muestra el texto "BE UNIQUE" en un tipo de letra tipo estarcido (stencil) de gran impacto visual, evidencia visual directa de un tipo de letra display usado precisamente para destacar un mensaje corto, tal como describe el narrador.

**Antipatrón explícito señalado por la fuente**: usar un tipo de letra display en párrafos largos, botones o etiquetas de interfaz, donde perjudica la legibilidad en lugar de ayudarla.

[S28]

### Flujo integrado para el agente

Un agente que reciba el encargo de **reconocer, clasificar o aplicar** uno de estos siete estilos de diseño gráfico puede seguir esta secuencia, basada en el método reconstruido de la fuente:

[S29]

### Reglas operativas

- Priorizar función y claridad por sobre la decoración; cada elemento debe
  justificar su presencia.
- Usar una grilla como base de alineación, incluso en composiciones
  asimétricas.
- Limitar la paleta a uno o dos colores neutros más, como máximo, un acento.
- Preferir variantes suaves de negro y blanco puros para evitar frialdad
  excesiva en pantalla.
- Dejar espacio en blanco intencional: no es "espacio desperdiciado", es
  parte activa del diseño.
- Elegir tipografía consciente del "peso" comunicativo que va a cargar,
  dado que hay pocos otros elementos que aporten personalidad.
- Adaptar el nivel de exigencia tipográfica y estructural al volumen de
  texto (más texto, más disciplina estructural, como en el estilo
  editorial).
- Separar siempre la recomendación de recursos o productos (libros,
  plantillas, suscripciones) del principio de diseño en sí.

**Extensión profesional** (salvaguardas añadidas por este documento, no
declaradas por el video):

[S30]

### Reglas operativas

- Elegir la familia tipográfica en función del tono comunicativo requerido, no de preferencia estética aislada del contexto (Principio 1).
- No usar tipos de letra display en párrafos, botones o etiquetas; reservarlos para fragmentos cortos de alto impacto como logotipos o títulos (Principio 4).
- No confundir tipos script con tipos handwritten: los primeros imitan caligrafía elegante, los segundos imitan escritura a mano real y suelen ser más informales (Principio 5).
- Reservar tipos monoespaciados para código o datos tabulares, nunca para texto de lectura general (Principio 6).
- Usar unidades relativas (em/rem) en lugar de píxeles fijos para tipografía en proyectos digitales, configurando la variable raíz en CSS (Principio 7).
- Ajustar peso, interlineado y tracking de forma inversamente proporcional al tamaño del texto: textos grandes más ajustados, textos pequeños más espaciados (Principios 8, 10, 11).
- Verificar siempre el contraste de color entre texto y fondo contra un umbral mínimo (7:1 según el video) antes de finalizar un diseño (Principio 12).
- Construir la jerarquía tipográfica de mayor a menor, definiendo primero el encabezado más grande y derivando los demás niveles de forma proporcional (Principio 13).
- Dar a los botones mayor peso que el párrafo circundante, compensando con letter-spacing adicional, para señalar interactividad sin sacrificar legibilidad (Principio 13).
- Elegir el número de columnas de la rejilla según el medio de salida (12 para web, 2 para impresos, 6 para periódicos, 3 para revistas, razón áurea para pósters) y mantenerlo consistente en todo el proyecto (Principio 14).
- Tratar cualquier cifra estadística citada verbalmente en el video (por ejemplo, "90 % de los sitios web" o "90 % de los productos de consumo") como una afirmación no verificada del narrador, no como un dato validado por este dossier.
- Tratar la atribución del rediseño del logo de Southern Living a Jessica Hische como una afirmación directa no verificada visualmente por este dossier.

[S31]

### Flujo integrado para el agente

Un agente que reciba una tarea de diseño o revisión de un sitio web y quiera
aplicar el método completo de este video debería seguir esta secuencia:

[S32]

### Flujo integrado para el agente

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

[S33]

### Demostraciones y ejemplos visibles

La progresión visual está construida por tarjetas de capítulo y referencias de sitios. Se distinguen flujos tipo dashboard al inicio; obras con collage y tipografía ornamental para la dirección artística; páginas de producto/documentación compactas para TL;DR; una narrativa de sectores en 300FeetOut para scroll; formas redondas, stickers y reseñas para calidez; Solare y Mars Rejects para capas; Al Murphy para imperfección; composiciones tipográficas enormes para maximalismo; páginas de comida/producto para movimiento; y pantallas de monitores retro para future-past. Los rótulos de capítulo y marcos rosas en la edición ayudan a identificar cada ejemplo, pero son elementos del video, no componentes recomendados de una web.

[S34]

### Método completo de la fuente > Principio / paso / elemento 4 — Wabi-sabi

Descrito como una estética japonesa orientada más al diseño de interiores pero aplicable al diseño gráfico, que "finds beauty in the imperfection and aging in nature... opposite of loud and flashy" (05:45). El presentador invoca imágenes de cuencos de cerámica agrietados, lino desgastado y bosques con niebla, insistiendo en una sensación de desaceleración y aprecio por lo hecho a mano.

Rasgos centrales: "earthy organic color palettes. Think clay, mossy green, natural textures, stone, linen, wood grain... minimalist layout... irregular shapes, irregular spacing" (06:15). El fotograma `frame-30pct.png` confirma visualmente el estilo: muestra un logotipo caligráfico "wabi-sabi" en tinta negra sobre fondo claro, junto a fotografías de interiores minimalistas con muebles de madera y luz natural, y una textura de piedra/cerámica agrietada en el borde izquierdo.

Casos de uso: branding de productos sostenibles, empaques minimalistas, contenido de estilo de vida o hogar orientado a la vida tranquila, apps de bienestar o mindfulness, y moodboards de diseño de interiores (06:15-06:46). El presentador menciona además Japandi como un estilo "hermano" de wabi-sabi cubierto en un video anterior del canal (06:46), lo cual se registra como referencia cruzada, no como parte del contenido de este video.

[S35]

### Contexto autónomo para un agente > Flujo integrado para el agente

9. **Documentar la decisión de diseño** (qué principio se aplicó y por qué), de forma que el resultado sea defendible ante un cliente o revisor, especialmente cuando se elige romper deliberadamente uno de los principios (por ejemplo, optar por la simetría estática para un cliente financiero).

[S36]

### Reglas operativas

1. Ninguna tendencia se adopta sin una justificación explícita de encaje con la
   marca y el objetivo del sitio.
2. Preferir la dosis mínima: la fuente recomienda contención en las nueve
   tendencias sin excepción.
3. Una familia tipográfica es suficiente cuando el eje es la interfaz apenas
   presente.
4. Un solo color de acento sobre una base neutra basta para leer como paleta
   contemporánea.
5. Las animaciones deben aportar a lo que el sitio comunica; si solo decoran, no
   se implementan.
6. Los elementos "hechos a mano" deben sentirse humanos, no desprolijos: la
   diferencia es intencionalidad, no cantidad.
7. Las etiquetas y líneas de estilo plano técnico son decorativas por definición;
   nunca deben ocupar el lugar de información real que el usuario necesita.
8. El sonido en la interfaz es opcional para el usuario, nunca impuesto.
   *(Regla de la fuente, reforzada como extensión profesional.)*
9. **Extensión profesional:** todo degradado debe validarse contra contraste
   mínimo AA en el texto que lo atraviesa.
10. **Extensión profesional:** todo cursor personalizado debe conservar un estado
    visible de foco y no reducir el área efectiva de clic.
11. **Extensión profesional:** toda experiencia WebGL debe tener una degradación
    definida para dispositivos que no la soporten o que la ejecuten mal.
12. **Extensión profesional:** las predicciones sobre 2026 se tratan como
    hipótesis con fecha de vencimiento y se revalidan antes de basarse en ellas.
13. Las promociones del creador —like, suscripción, recurso de la biografía,
    remisión al video sobre el "top 1 % de diseñadores web"— quedan fuera del
    método y no se replican como parte del consejo técnico.

[S37]

### Contexto autónomo para un agente > Mapa temporal de procedencia

Este mapa temporal existe solo como procedencia. Cada lección se explica de
forma completa y autónoma en la siguiente sección, sin depender de consultar
el video para entenderla.

[S38]

### Antipatrones

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

[S39]

### Contexto autónomo para un agente > Mapa temporal de procedencia

El mapa indica procedencia; la explicación completa de cada estilo está en la
sección siguiente, de modo que el lector no necesita consultar las marcas de
tiempo para entender el método.

[S40]

### Contexto autónomo para un agente > Mapa temporal de procedencia

| Tiempo | Evidencia principal | Uso correcto |
|---|---|---|
| 00:00–02:03 | Conversión frente a tráfico y diferencia entre belleza/claridad | Definir el trabajo de la página y comprobar comprensión inmediata. |
| 02:03–04:38 | Pocas decisiones, un test semanal, titular e imagen | Priorizar un experimento interpretable en la primera pantalla. |
| 04:38–05:41 | Imágenes reales frente a stock | Sustituir señales genéricas por evidencia visual creíble cuando sea posible. |
| 05:41–07:45 | Ecuación de valor, prueba y rapidez | Presentar resultado deseado y disminuir demora/esfuerzo percibidos. |
| 07:45–09:17 | Inacción, riesgo, Amazon, reseñas y garantía | Resolver objeciones justo antes de la acción. |
| 09:17–10:45 | Diferenciación | Convertir sin parecer intercambiable con competidores. |

[S41]

### Flujo integrado para el agente

Un agente que reciba un encargo de diseño gráfico y quiera aplicar el método completo de este video debería seguir esta secuencia operativa:

[S42]

### Antipatrones

- **Ejecutor de píxeles sin criterio**: aplicar visualmente lo que pide el
  cliente sin diagnosticar el problema real detrás del pedido (contradice el
  Principio 11).
- **Purismo de reglas**: tratar la proporción áurea, la regla de los tercios
  o cualquier framework de composición como una ley que no puede romperse,
  perdiendo de vista si el resultado final realmente se ve bien (contradice
  el Principio 5).
- **Saturación decorativa**: acumular colores, elementos y micro-detalles
  "porque se puede", en lugar de partir de un diseño reducido y añadir solo
  lo justificado (contradice el Principio 3).
- **Jerarquía plana**: diseñar una pantalla donde el titular, el subtítulo y
  el botón de acción tienen un peso visual similar, dejando al usuario sin
  pistas claras de qué mirar primero (contradice el Principio 8).
- **Mobile-first ciego**: diseñar siempre partiendo de la versión móvil sin
  analizar los problemas de contexto propios de cada tamaño de pantalla
  (contradice el Principio 6).
- **Silencio ante el cliente**: entregar un diseño sin explicar el motivo de
  cada decisión y luego frustrarse cuando el cliente pide cambios (contradice
  el Principio 12).
- **Optimismo de alcance total**: prometer que un proyecto será el mejor
  posible en SEO, UX, rendimiento, accesibilidad y diseño simultáneamente,
  sin reconocer que existen compensaciones (contradice el Principio 9).
- **Aceptación por necesidad económica**: tomar un proyecto con señales de
  alerta evidentes solo porque hace falta el ingreso, ignorando el criterio
  profesional (contradice el Principio 14).
- **Aislamiento profesional**: intentar resolver solo cada obstáculo de
  negocio o de diseño en lugar de buscar apoyo externo (contradice el
  Principio 15).

[S43]

### Contexto autónomo para un agente > Mapa temporal de procedencia

Este mapa orienta la procedencia, pero cada principio se explica de forma
completa en las secciones siguientes: el lector no necesita consultar las
marcas de tiempo para entender el método.

[S44]

### Método completo de la fuente > 1. Clásico, ornamental y romántico

**Neoclásico**: referencia a la Antigüedad grecorromana, composición formal y sensación monumental; `adaptive-contact-sheet-01.jpg` muestra arquitectura clásica y ejemplos tipográficos. **Barroco**: ornamentación dramática, contraste intenso y paletas ricas; el rótulo y el patrón dorado se ven en las primeras hojas. **Filigrana**: volutas finas, trabajo tipo metal o encaje, apropiado para invitación o packaging premium; los ejemplos visibles de `adaptive-contact-sheet-03.jpg` combinan marcos y líneas ornamentales. **Acanto**: hojas clásicas y bordes decorativos inspirados en columnas grecorromanas. **Victoriano**: exceso ornamental, flores, color rico y lettering de época. **Art Déco**: geometría simétrica, glamour y acentos metálicos; las hojas muestran carteles de líneas rectas y abanicos. **Art Nouveau**: línea orgánica, flora, figura e integración de ilustración con tipo; la fuente propone buscar Alphonse Mucha. **Tenebrismo**: foco luminoso contra sombras profundas. **Gótico**: arcos, tallas, dramatismo y aura oscura. **Steampunk**: mezcla victoriana y mecánica a vapor, visible en composiciones de engranajes. No mezclar estos nombres sólo por ser “vintage”: decidir si el proyecto pide rigidez geométrica, flora fluida, sombra teatral o maquinaria retro.

[S45]

### Contexto autónomo para un agente > Mapa temporal de procedencia

Este mapa temporal indica procedencia, no reemplaza la explicación: cada principio se desarrolla en detalle en la sección siguiente para que el agente lo entienda sin necesidad de consultar las marcas de tiempo.

[S46]

### Rúbrica de evaluación

Escala de 0 a 3 por dimensión:

- **Cobertura de los veinte estilos** (0 = omite estilos o los mezcla; 3 =
  cubre los veinte con nombre correcto, origen y rasgos visuales).
- **Uso correcto de evidencia visual** (0 = inventa apariencia sin citar
  fotograma; 3 = cada afirmación visual cita un archivo de fotograma
  existente y describe lo que realmente se ve en él).
- **Separación de clases de evidencia** (0 = mezcla fuente directa, inferencia
  visual y extensión profesional sin distinguirlas; 3 = las distingue de
  forma explícita y consistente).
- **Manejo de afirmaciones acotadas en el tiempo y no verificadas** (0 = las
  presenta como hechos firmes; 3 = las marca explícitamente como tales).
- **Sensibilidad cultural** (0 = aplica estilos con raíz cultural sin
  contexto; 3 = recomienda investigación adicional y evita apropiación
  superficial).
- **Autonomía del documento** (0 = requiere consultar el video original para
  entender un estilo; 3 = cada estilo se entiende completamente solo con este
  documento).

Resultado mínimo aceptable: promedio de 2 o más en todas las dimensiones, sin
ningún puntaje de 0.

[S47]

### Método completo de la fuente > Principio / paso 5 — Proyectos apropiados para brutalismo pleno

Cuando se opta por una aplicación completa y no moderada del estilo, la
fuente da una lista explícita y cerrada de tipos de proyecto recomendados
(03:13): portafolio personal, sitio de agencia creativa o estudio, un blog
sobre videojuegos estilo años 80, o páginas para eventos estacionales o de
una sola vez que necesiten volverse virales y atraer mucha atención en poco
tiempo. Esta lista debe preservarse completa: es un criterio operativo de
"encaja / no encaja" que un agente puede aplicar directamente al recomendar
o desaconsejar el estilo para un proyecto concreto.

[S48]

### Demostraciones y ejemplos visibles

- **Configurador de pizza interactivo (versión genérica inicial)**: selección
de tamaño, tipo de masa (aparentemente no funcional: "the crust is not
changing"), salsa, ajo, queso (sin funcionalidad de arrastrar y soltar),
proteínas (pepperoni, tocino, pollo a la parrilla, salchicha italiana) y
vegetales (alcachofa), con vista previa y confirmación final.
Confirmado en `frame-20pct.png` y `frame-25pct.png` (interfaz de
construcción de pizza y vista de confirmación/checkout).
- **Sistema de diseño "Pitalio"/"Pizzalio"**: recorrido completo por
navegación, tipografía, escala numérica, paleta de colores, formas,
logotipo, animaciones, elevaciones y radios, generado a partir de una
imagen de Pinterest. Confirmado en `frame-40pct.png`, `frame-45pct.png` y
`frame-50pct.png`.
- **Antes y después del mismo layout de landing page**: el estado inicial
("Build your perfect pizza" en tipografía mediana, calculadora compacta) se
confirma en `supplemental-3s.png` y `supplemental-431s.png`, aún idéntico
antes de reaplicar el sistema de diseño; el estado posterior
("THE builder" con un círculo de arrastre grande, y "THREE STEPS, ONE
PIZZA" con hero de pantalla completa en rojo) se confirma en
`frame-60pct.png` y `frame-65pct.png`.
- **Integración de fotografías reales**: reemplazo de una ilustración de
pizza por una fotografía real y adición de fotografías de personas
generadas con ChatGPT, visible en `frame-70pct.png` (fotografía de pizza
con overlay de opciones de publicación).
- **Menú de producto generado con el mismo sistema de diseño**: flujo de
configuración guiado (una página, categorías de pizzas/bebidas/ensaladas,
veinte ítems, sin fotos), confirmado en `frame-80pct.png`.
- **Piezas de Instagram generadas con el mismo sistema de diseño**: mosaico
de publicaciones visualmente coherentes con la paleta roja del proyecto,

[S49]

## Related rules and patterns

### Patterns > Reconocimiento en lugar de recuerdo para personas/entidades

Reconocimiento en lugar de recuerdo para personas/entidades

Principle: Mostrar una foto o icono reconocible junto al identificador textual reduce el riesgo de error al confirmar una persona o cuenta.

Problem: Identificar personas o cuentas solo por texto o numero obliga al usuario a recordar o releer detalles para confirmar que son correctos.

Source basis: El video nombra explicitamente el principio de 'reconocimiento sobre recuerdo' y su beneficio de reducir transferencias accidentales.

Professional extension: Al usar fotos reales de usuarios, obtener consentimiento/autorizacion apropiados y aplicar politicas reales de privacidad y retencion de datos.

[S50]

## Additional relevant context

### Método completo de la fuente

Método completo de la fuente

[S51]

### Contexto autónomo para un agente — The Art of Minimalism

# Contexto autónomo para un agente

## Propósito

Este documento convierte el video de YouTube "The Art of Minimalism" (ID
`bdC2BtJNt9s`), publicado por el creador de cine y contenido personal Seth Curl,
en un paquete de conocimiento autosuficiente. El objetivo es que otro agente
pueda entender, explicar y aplicar el método de minimalismo personal que
presenta el video sin necesidad de verlo, escucharlo ni consultar la fuente
original. El video es un monólogo directo a cámara —no un tutorial técnico ni
una demostración de software— en el que el creador expone su filosofía y
rutina personal de minimalismo, ilustrada con metraje casero (su cocina, su
oficina, su auto, una libreta de "cosas por hacer") y tarjetas de título
editadas ("CHAPTER 2: THE WHY", "less").

## Evidencia y límites

**Fuente de transcripción**: pista de subtítulos automáticos original en
inglés (`en-orig`), la única disponible (no hay subtítulos manuales). Se
utilizó exclusivamente esta pista, nunca una traducción automática, como
exige la disciplina de la fuente. El idioma hablado real es el inglés,
confirmado tanto por la pista `en-orig` como por el campo `language: en` de
los metadatos y por el contenido mismo del audio transcrito.

**Evidencia visual**: veinte fotogramas uniformes (0 % a 95 % de la duración)
más tres fotogramas suplementarios en los segundos 40, 255 y 450, todos
inspeccionados directamente con la herramienta de lectura de imágenes, no
solo enumerados como archivos.

**Límites explícitos**:

- El video es un testimonio personal y una pieza de contenido de un canal de
  cine/estilo de vida, no un estudio, ni una guía clínica, ni un documento con
  evidencia empírica externa. Todas las afirmaciones sobre beneficios
  (creatividad, foco, relaciones) son la experiencia subjetiva declarada por
  el creador, no resultados verificados.
- El video contiene autopromoción y enlaces de afiliados en su descripción
  (prueba gratuita de Musicbed, descuento de Dehancer, descuento de
  Zhiyun-Tech, enlaces de Amazon a su equipo de cámara). Ninguno de estos
  elementos forma parte del método de minimalismo enseñado; se documentan
  aparte como promociones.
- Los fotogramas muestran una escena doméstica y de oficina real del creador,
  pero no permiten verificar de forma independiente cuánto tiempo lleva
  practicando minimalismo ni el efecto medible en su carrera creativa: esas
  son afirmaciones directas de la fuente, no verificadas externamente.
- No hay segmento de subtítulos entre aproximadamente el minuto 13:41 y el
  15:34: en ese tramo el video pasa a una secuencia de cierre visual (auto,
  casa, créditos de música y agradecimientos) sin narración relevante nueva,
  consistente con los fotogramas del 80 % al 95 %.

## Tesis central

Seth Curl sostiene que el minimalismo no es sinónimo de organización, sino un
estilo de vida intencional que consiste en poseer y usar solo lo esencial y
valioso, reduciendo deliberadamente el exceso de posesiones, distracciones y
compromisos. Su tesis es que practicar minimalismo de forma constante y en
pequeñas acciones diarias —no como un evento único de deshacerse de cosas—
libera espacio mental, reduce distracciones y, como consecuencia, mejora la
concentración, la eficiencia creativa y la calidad del tiempo que se pasa con
las personas que importan. Resume el principio con su propia frase repetida:
"less is more" (menos es más).

## Mapa temporal de procedencia

Esta línea de tiempo documenta la procedencia de la evidencia; no sustituye la
explicación del método, que se desarrolla íntegramente en las secciones
siguientes.

- **00:10** — Definición inicial de minimalismo: posesión intencional de solo
  lo esencial, reducción de exceso, "less is more".
- **00:44–01:14** — El creador se presenta como practicante de minimalismo y
  explica que descubrió que podía practicarlo intencionalmente.
- **01:14–02:15** — Distinción explícita entre organización y minimalismo:
  no son lo mismo.
- **02:15–02:45** — Primer paso práctico: revisar pertenencias físicas
  (clóset, cajones, auto, apps del teléfono) y preguntarse qué es realmente
  necesario. `frame-25pct.png` y `supplemental-255s.png` muestran la lista de
  tareas manuscrita "THINGS TO DO" que ilustra este proceso.
- **02:45–04:18** — Cómo mantener el hábito: pequeñas acciones diarias
  repetidas (cerrar apps, borrar archivos, limpiar mostradores, sacar objetos
  del auto, anotar gastos, poner recordatorios, cancelar suscripciones).
- **04:18–05:51** — Advertencia: el hábito de minimalismo puede volverse
  controlador o adictivo si se practica sin propósito consciente.
- **05:51–06:55** — El paso final: reducir el ritmo al empezar el día, con la
  metáfora del árbol que enraíza lento antes de crecer con poco mantenimiento.
- **06:55–07:57** — Transición de "el cómo" a "el porqué"; tarjeta de
  capítulo "CHAPTER 2: THE WHY" visible en `frame-45pct.png`, hacia el
  segundo 455 (45 % de la duración total).
- **07:57–09:30** — El beneficio central: minimizar distracciones deja más
  espacio y tiempo mental para lo que realmente importa.
- **09:30–11:05** — Impacto declarado en su carrera creativa: mayor calma,
  foco y determinación mental.
- **11:05–11:36** — Impacto declarado en su flujo de edición de video:
  organización de archivos, interfaz de edición simplificada, línea de
  tiempo despejada.
- **11:36–12:39** — El beneficio que más valora: más tiempo de calidad con
  las personas que ama, gracias a menos distracciones y menos que procesar
  mentalmente.
- **12:39–13:41** — Cierre: por qué decidió compartir esto en YouTube y
  reflexión final sobre intencionalidad y propósito.
- **~15:34** — Fragmento residual de subtítulo ("You.") dentro de la
  secuencia visual de cierre (auto, casa al anochecer, créditos musicales y
  agradecimientos), visible en `frame-80pct.png` a `frame-95pct.png`.

# Método completo de la fuente

## Principio / paso 1 — Definir minimalismo con precisión

El creador insiste en una definición estricta antes de dar cualquier consejo
práctico: minimalismo es "poseer y usar solo lo que es esencial y valioso,
reduciendo intencionalmente el exceso de posesiones, distracciones y
compromisos". No es solamente deshacerse de objetos físicos: incluye tiempo,
energía y espacio mental. Cita textual traducida: "En términos aún más
simples, es minimizar en qué está enfocada mi mente para poder concentrarme
en lo que necesito. O en términos aún más simples, menos es más." (00:10)

Esta definición es la base de todo lo demás: sin ella, el resto de la
metodología se confunde fácilmente con simple organización doméstica.

## Principio / paso 2 — Separar minimalismo de organización

Uno de los puntos más enfatizados del video es que "organización" y
"minimalismo" no son sinónimos, aunque suelen complementarse. Cita traducida:
"La organización es el proceso de crear estructura y un sistema para tus
pertenencias, mientras que el minimalismo es un estilo de vida enfocado en
vivir intencionalmente con menos, priorizando la simplicidad y poseyendo solo
lo que realmente es necesario o valioso." (01:14–01:44)

Consecuencias prácticas que el creador extrae de esta distinción:

- Se puede ser organizado sin ser minimalista.
- Se puede ser minimalista sin tener todo perfectamente organizado ("minimalista
  desordenado").
- Ser ambas cosas a la vez es lo ideal, pero no es un requisito para empezar.
- Si una persona ya es organizada, el minimalismo le resultará más natural;
  si no lo es, el minimalismo se aprende como cualquier práctica, con tiempo.

## Principio / paso 3 — Auditoría inicial de posesiones y espacios

El primer paso operativo consiste en revisar sistemáticamente las
pertenencias físicas y digitales y preguntarse, para cada una, si realmente
se necesita. Cita traducida: "Uno de los puntos clave para ser minimalista es
eliminar lo que no necesitas. Revisa tu casa, tu laptop, tu auto, todo, y
pregúntate: ¿qué necesito realmente para vivir la vida que tengo ahora mismo
y para ser eficiente en las cosas que quiero perseguir?" (02:15–02:45)

Áreas explícitamente mencionadas para auditar: clóset, cajones del baño,
auto, aplicaciones del teléfono, el "cajón de trastos" que nunca se abre,
laptop. `frame-25pct.png` y, con más nitidez, `supplemental-255s.png`
muestran la evidencia visual directa de este paso: una hoja de papel
manuscrita con el encabezado "THINGS TO DO" y una lista numerada de tareas
domésticas (por ejemplo, "sacar la basura", "ir de compras", "limpiar la
casa", "vender ropa", "hacer una cita", "llamar a nuevos clientes" según se
lee en `frame-25pct.png`), sostenida en la mano del creador. Esta imagen
confirma materialmente que el método incluye escribir listas de tareas
concretas, no solo una intención abstracta.

## Principio / paso 4 — Convertir la auditoría en hábito diario mediante microacciones

El video enumera, de forma casi literal, una lista de microacciones diarias
que sostienen el hábito de minimalismo una vez hecha la auditoría inicial
(02:45–04:18). Se preserva la lista completa porque el creador la presenta
como una enumeración exhaustiva de ejemplos aplicables:

1. Cerrar aplicaciones abiertas en el teléfono.
2. Cerrar pestañas del navegador que no se están usando.
3. Borrar archivos que ya no se necesitan, con frecuencia.
4. Limpiar las superficies de la cocina inmediatamente después de usarlas.
5. Sacar uno o dos objetos del auto cada vez que se sale de él.
6. Anotar una compra en el momento para mantener el control del presupuesto
   (10 segundos).
7. Poner eventos importantes en el calendario cada semana.
8. Crear un recordatorio en el teléfono en el instante en que se piensa algo.
9. Usar "leer todo" en el correo o, mejor aún, darse de baja de correos que
   no se necesitan.
10. Quitar una canción de una lista de reproducción si ya no gusta.
11. Agregar una canción a una lista de reproducción si sí gusta.
12. Vender una prenda que no se ha usado en dos años.
13. Cancelar notificaciones de texto de tiendas que ya no se frecuentan.
14. Tirar cualquier basura o trasto en el momento en que se ve, en cualquier
    parte de la casa.

El creador aclara el mecanismo por el cual estas microacciones funcionan:
"Lo que parece mucho trabajo para empezar todos estos hábitos... en realidad
está agregando menos para mañana, e incluso menos para el día siguiente, e
incluso menos para el día después de eso." (03:47–04:18) Es decir, el costo
de instaurar el hábito es alto al principio y decreciente después, porque
cada microacción evita la acumulación de una tarea mayor futura.

## Principio / paso 5 — Vigilar que el hábito no se vuelva controlador

Este es el paso de advertencia y autorregulación, presentado como
igual de importante que la práctica misma. Cita traducida: "Una vez que se
vuelve un hábito, puede ser un buen hábito o un mal hábito... Caí en la
trampa de la necesidad de limpiar, organizar, completar, eliminar, restar
constantemente durante el día sin un propósito o meta real para ello."
(04:49–05:21)

El creador identifica el riesgo específico: "Lo que es más peligroso que no
vivir intencionalmente hacia algo es vivir intencionalmente hacia un ciclo
interminable de nada." (05:21) Su recomendación concreta es detenerse
periódicamente, preguntarse por qué se está haciendo cada tarea y recordar
hacia qué se está viviendo intencionalmente. En un fotograma de este tramo
(alrededor del minuto 05:21–05:51) el creador aparece señalando una planta en
su escritorio mientras dice, casi como aparte, que le gusta esa planta —un
detalle que ilustra el tono personal y no guionado del video, sin que
constituya evidencia de ningún método adicional.

## Principio / paso 6 — Empezar el día despacio como práctica ancla

El paso final del "cómo" es ralentizar el inicio del día antes de lanzarse a
las tareas. El creador usa una metáfora explícita: "Cuando un árbol empieza a
crecer, es lento al principio, pero una vez que las raíces están
establecidas, prosperan con poco mantenimiento. Lo mismo pasa con nuestra
vida diaria." (05:51–06:24) Ejemplos que da de esta pausa inicial: llevar un
diario, orar, sentarse en silencio. El objetivo declarado no es la lentitud
por sí misma, sino "establecer raíces" en lo que se quiere lograr y en lo que
se quiere ser intencional ese día.

## Principio / paso 7 — El porqué: minimizar distracciones como beneficio central

A partir del minuto 07:25, marcado visualmente por la tarjeta de capítulo
"CHAPTER 2: THE WHY" (visible en `frame-45pct.png`, aproximadamente en el
segundo 455, 45 % de la duración), el video cambia de "cómo" a "por qué".
Cita traducida: "El punto focal del minimalismo y el beneficio más fuerte
para tu vida, creatividad, relaciones y cualquier otra cosa es minimizar las
distracciones." (07:25–07:57)

El razonamiento que ofrece: no es posible eliminar por completo ciertas
distracciones de la vida (redes sociales, tareas, compromisos, personas,
lugares), pero sí es posible minimizarlas. Menos "desorden" (clutter) implica
menos distracciones, lo que implica más espacio y tiempo mental para lo que
sí importa.

## Principio / paso 8 — Impacto declarado en la mente y en la creatividad

El creador conecta explícitamente la práctica física con un efecto mental:
"Reducir el ritmo por la mañana para crear un hábito de minimalismo resultará
entonces en una mente más calmada durante el día, lo que a su vez hace que
reducir el ritmo se vuelva más fácil de hacer. Es un círculo que se vuelve
más sano con el tiempo y la práctica." (09:00–09:30) Declara que, para su
trabajo creativo específicamente, esto se traduce en foco y determinación: se
ha vuelto "un editor mucho más rápido en los últimos años" gracias a hábitos
de eliminar lo que no necesita y organizar lo que tiene, incluyendo organizar
archivos al subirlos a su unidad de almacenamiento, un diseño simplificado en
su software de edición y una línea de tiempo despejada durante la edición
(11:05–11:36). Estas afirmaciones sobre productividad de edición son
declaraciones directas de la fuente sin evidencia externa verificable; se
etiquetan como afirmaciones no verificadas en el resumen de evidencia.

## Principio / paso 9 — El beneficio que el creador valora más: tiempo de calidad con personas

El video cierra su argumentación de "el porqué" señalando que el mayor
beneficio no es la productividad ni el ahorro económico, sino la calidad del
tiempo compartido con otras personas. Cita traducida: "Otro subproducto del
minimalismo, y el mejor subproducto del minimalismo, es la capacidad de
pasar tiempo de calidad con la gente que amas y menos tiempo en cantidad con
todo lo demás en la vida." (11:36–12:07) El mecanismo que propone: menos
distracciones y menos que procesar mentalmente deja más capacidad para
conexión humana genuina y presencia real con otros.

# Demostraciones y ejemplos visibles

Este video no contiene demostraciones de software, interfaces digitales
complejas ni procesos técnicos paso a paso; es principalmente metraje de vida
cotidiana que ilustra, sin narrarlo explícitamente, el estilo de vida
descrito. Inventario de lo verificado visualmente:

- **Lista de tareas manuscrita ("THINGS TO DO")**: `frame-25pct.png` y
  `supplemental-255s.png` muestran una hoja de papel sostenida en la mano del
  creador con una lista numerada de tareas domésticas y de trabajo. Es la
  evidencia visual más directa del "paso 3" (auditoría convertida en lista
  escrita).
- **Rutina doméstica y de organización**: `frame-30pct.png` muestra al
  creador revisando el refrigerador/despensa; `frame-35pct.png` muestra una
  mano ajustando una planta en una maceta, coherente con el hábito de
  cuidado del entorno mencionado en el paso 5.
  `frame-10pct.png` y `frame-15pct.png` muestran manos manipulando objetos
  pequeños (posiblemente productos de limpieza o cuidado personal), consistentes
  con la idea de pequeñas tareas domésticas, aunque el objeto exacto no es
  identificable con certeza y no se afirma qué es específicamente.
- **Tarjeta de capítulo "CHAPTER 2: THE WHY"**: `frame-45pct.png` (segundo
  ≈455, 45 % de la duración) confirma visualmente la estructura editorial en
  dos partes del video (el cómo / el porqué) frente a una casa al atardecer.
  No existe una tarjeta equivalente "CHAPTER 1" en los fotogramas
  muestreados ni en los suplementarios; la primera mitad no está marcada con
  una tarjeta de título visible en la muestra inspeccionada.
- **Espacio de oficina/edición**: `frame-55pct.png` y `frame-60pct.png`
  muestran al creador sentado frente a monitores de computadora en una
  oficina en casa con decoración minimalista (paredes claras, pocos
  objetos), consistente con la afirmación de un flujo de trabajo de edición
  simplificado, aunque los fotogramas no muestran el software de edición en
  uso ni permiten verificar su interfaz.
- **Tarjeta tipográfica "less"**: `frame-65pct.png` muestra una tarjeta de
  título con la palabra "less" sobre fondo rojo oscuro, refuerzo visual
  directo del lema "less is more" repetido en el guion.
- **Actividad deportiva**: `frame-50pct.png` muestra pies con tacos de fútbol
  sobre césped, una escena de vida personal del creador sin narración
  específica asociada en la transcripción inspeccionada; se interpreta como
  metraje ilustrativo genérico de "vida con propósito", no como parte
  explicada del método.
- **Auto y trayecto nocturno**: `frame-80pct.png` (interior del auto) y
  `supplemental-450s.png` (auto y casa al anochecer) forman parte de la
  secuencia de cierre visual del video, coherente con el hueco de
  subtítulos entre 13:41 y 15:34.
- **Créditos finales**: `frame-85pct.png`, `frame-90pct.png` y
  `frame-95pct.png` muestran texto de créditos con nombres de canciones,
  artistas, ubicaciones de grabación (Charlotte NC, Indian Trail NC,
  Appalachian Mountains, Reykjavik Iceland, Madrid Spain, Chicago IL,
  Pensacola FL, entre otras) y un apartado de agradecimientos especiales.
  Esto es evidencia de la producción del video, no del método de
  minimalismo en sí.

Ningún fotograma muestra evidencia de una aplicación, panel de control o
integración de software que respalde afirmaciones de "productividad", por lo
que cualquier mejora de eficiencia de edición declarada por el creador se
mantiene como afirmación directa no verificada visualmente, nunca como
demostración técnica confirmada.

# Flujo integrado para el agente

Secuencia ejecutable que otro agente puede seguir para aplicar o explicar el
método completo, en orden:

1. Adoptar la definición estricta de minimalismo (paso 1) antes de dar
   cualquier consejo, para evitar confundirlo con simple organización.
2. Explicar la diferencia entre organización y minimalismo (paso 2) cuando el
   usuario mezcle ambos conceptos.
3. Guiar una auditoría inicial de posesiones y espacios físicos y digitales,
   pidiendo al usuario que liste por escrito qué necesita realmente (paso 3).
4. Traducir la auditoría en una lista concreta de microacciones diarias
   (paso 4), priorizando acciones de bajo costo y alta frecuencia (cerrar
   apps, borrar archivos, ordenar mientras se usa un espacio) sobre grandes
   purgas puntuales.
5. Incluir siempre una verificación de propósito (paso 5): antes de recomendar
   más tareas de orden, preguntar por qué se están haciendo y hacia qué
   objetivo intencional apuntan, para evitar que el minimalismo se vuelva
   compulsivo.
6. Sugerir una práctica de inicio de día lento y deliberado (paso 6) como
   ancla diaria, adaptable (diario, meditación, silencio, oración) según las
   preferencias del usuario.
7. Conectar explícitamente cada acción con el objetivo de reducir
   distracciones (paso 7), no solo reducir objetos.
8. Si el usuario busca beneficios creativos o de productividad, presentar el
   testimonio del creador (paso 8) como experiencia personal declarada, no
   como garantía de resultado.
9. Cerrar cualquier plan de minimalismo señalando el beneficio relacional
   (paso 9): más tiempo de calidad con las personas, como motivación de alto
   nivel, no solo eficiencia personal.
10. Separar siempre, en cualquier resumen generado, las promociones del
    creador (equipo de cámara, servicios de música, marcas) de las
    recomendaciones del método.

# Reglas operativas

- No confundir minimalismo con organización doméstica; son conceptos
  relacionados pero distintos según la fuente.
- No presentar las microacciones diarias como opcionales aisladas: el video
  las presenta como un conjunto que sostiene el hábito, no como una lista de
  la que basta elegir una.
- No recomendar purgas masivas puntuales como sustituto de la práctica diaria
  continua; la fuente enfatiza explícitamente la constancia sobre el
  esfuerzo puntual.
- Incluir siempre la verificación de propósito (paso 5) al recomendar tareas
  de organización repetidas, para prevenir que el hábito se vuelva
  compulsivo o controlador, tal como advierte el propio creador.
- No presentar los enlaces de afiliados, descuentos o promociones de la
  descripción del video como parte del método de minimalismo.
- No citar ningún fotograma como prueba de un resultado medible (por ejemplo,
  "más rápido como editor"); los fotogramas confirman solo lo que aparece en
  pantalla, no métricas de desempeño.
- Mantener las citas traducidas siempre con su marca de tiempo original para
  que sean verificables contra `transcript/source.txt`.

**Extensión profesional (salvaguardas añadidas por este dossier, no
declaradas por el video):**

- **Privacidad y consentimiento**: si se aplican estas prácticas a espacios
  compartidos (casa, oficina) con otras personas, obtener su consentimiento
  antes de desechar, vender o fotografiar pertenencias que no son propias.
- **Seguridad de datos**: al "borrar archivos" o "cerrar apps" como
  microacción, verificar que no se eliminen respaldos necesarios ni se cierren
  sesiones con pérdida de datos no guardados; aplicar buenas prácticas de
  copia de seguridad antes de purgas digitales.
- **Accesibilidad**: al recomendar reorganizar espacios físicos o digitales,
  considerar necesidades de accesibilidad de quienes conviven en el espacio
  (movilidad reducida, uso de lectores de pantalla en dispositivos, etc.).
- **Autorización y bienes de terceros**: no vender, donar ni desechar objetos
  que pertenezcan a otras personas sin autorización explícita.
- **Licencias y derechos**: al aplicar el método a archivos digitales
  (fotos, documentos, proyectos), verificar licencias y obligaciones
  contractuales antes de eliminar material que pueda tener valor legal,
  fiscal o contractual (comprobantes, contratos, backups regulatorios).
- **Transparencia comercial**: cualquier reproducción de este contenido debe
  distinguir claramente las recomendaciones de equipo, servicios o productos
  patrocinados (Musicbed, Dehancer, Zhiyun-Tech, enlaces de Amazon) de los
  principios del método, evitando que una audiencia confunda una promoción
  con un consejo neutral.
- **Bienestar y salud mental**: dado que el propio video advierte sobre el
  riesgo de que el hábito se vuelva compulsivo, se recomienda adicionalmente
  que cualquier aplicación asistida por un agente incluya límites de
  frecuencia sugeridos y evite reforzar patrones de conducta obsesivo-
  compulsiva relacionados con el orden o el descarte de objetos.

# Antipatrones

- Tratar el minimalismo como un evento único de "deshacerse de cosas" en vez
  de un hábito diario sostenido, contradiciendo el énfasis explícito de la
  fuente en la práctica continua.
- Perseguir la organización o la limpieza sin un propósito consciente,
  cayendo en el "ciclo interminable de nada" que el propio creador identifica
  como el riesgo central de esta práctica.
- Presentar el minimalismo como incompatible con la creatividad o como una
  orden de "reducir ideas creativas"; la fuente aclara explícitamente que no
  se trata de minimizar la cantidad de ideas, sino de ser más eficiente al
  perseguirlas.
- Usar las imágenes del video (oficina, lista de tareas, auto) como prueba de
  que una integración, aplicación o flujo de trabajo específico está en
  producción o funciona técnicamente: los fotogramas muestran un entorno,
  no un sistema verificado.
- Mezclar las recomendaciones de equipo de cámara, música o software
  patrocinado con los principios de minimalismo enseñados en el cuerpo del
  video.

# Criterios de aceptación

- El resumen o plan generado a partir de este contexto distingue
  explícitamente entre organización y minimalismo.
- Incluye al menos las cuatro fases del método: auditoría inicial,
  microacciones diarias, verificación de propósito y ancla de inicio de día
  lento.
- Cualquier cita usada está en español, traducida fielmente y acompañada de
  su marca de tiempo original.
- Ninguna afirmación de resultado (productividad, velocidad de edición,
  beneficio relacional) se presenta como hecho verificado externamente; se
  mantiene etiquetada como testimonio personal del creador.
- Las promociones (Musicbed, Dehancer, Zhiyun-Tech, enlaces de Amazon) quedan
  fuera de cualquier explicación del método.
- Toda referencia a un fotograma cita un archivo que existe físicamente en
  `visual/frames`.

# Rúbrica de evaluación

Escala 0–3 para evaluar una respuesta o plan derivado de este contexto:

- **0 — Inaceptable**: confunde minimalismo con organización, omite la
  verificación de propósito, o presenta promociones como parte del método.
- **1 — Insuficiente**: menciona el método de forma genérica sin las cuatro
  fases concretas ni evidencia trazable a marcas de tiempo.
- **2 — Aceptable**: cubre las cuatro fases con fidelidad, pero no separa
  claramente afirmaciones verificadas de testimonios personales no
  verificados.
- **3 — Ejemplar**: cubre las cuatro fases, incluye la verificación de
  propósito como salvaguarda explícita, distingue afirmaciones directas de
  extensiones profesionales, y evita cualquier promoción o inferencia de
  producción a partir de evidencia visual.

# Resumen compacto

"The Art of Minimalism" de Seth Curl (16:51 minutos) presenta el
minimalismo como un hábito diario intencional —no un evento único de
descarte ni sinónimo de organización— compuesto por cuatro fases: auditar
posesiones y espacios físicos y digitales para identificar lo esencial;
sostener esa auditoría con microacciones diarias de bajo costo (cerrar apps,
borrar archivos, ordenar al usar un espacio, cancelar suscripciones);
vigilar constantemente el propósito detrás de cada tarea para que el hábito
no se vuelva compulsivo o controlador; y anclar el día con un inicio lento y
deliberado antes de lanzarse a las tareas. El "porqué" declarado del
creador es que menos posesiones y compromisos significan menos distracciones,
lo cual libera espacio mental para la creatividad, el foco en el trabajo y,
sobre todo, tiempo de calidad genuino con las personas que importan. La
evidencia visual —una lista de tareas manuscrita, una oficina ordenada, una
tarjeta de capítulo "THE WHY"— respalda la existencia de la rutina, pero no
verifica externamente los resultados de productividad o creatividad que el
creador atribuye a la práctica, los cuales permanecen como testimonio
personal. El video incluye promociones de equipo de cámara y servicios
(Musicbed, Dehancer, Zhiyun-Tech) que deben mantenerse separadas del método.

[S52]

### Contexto autónomo — The Beginner's Guide To Visual Hierarchy

# Contexto autónomo para un agente

Este documento describe, sin necesidad de ver el video original, el contenido completo del video de YouTube con ID `kK1TOpI948o`, titulado "The Beginner's Guide To Visual Hierarchy" ("La guía para principiantes sobre jerarquía visual"), publicado por el canal DesignSpo. El video dura 928 segundos (15 minutos y 28 segundos) y fue subido el 22 de abril de 2026. Todo el audio está en inglés; no se detectaron fragmentos materiales en otros idiomas. El documento fue construido a partir de la pista de subtítulos automáticos original (`en-orig`), un video descargado en baja resolución, veinte fotogramas muestreados uniformemente entre el 0% y el 95% de la duración, y siete fotogramas suplementarios extraídos en instantes puntuales identificados como material relevante durante la inspección visual.

## Propósito

El video enseña qué es la jerarquía visual, por qué existe y cómo se construye, organizando la explicación en cinco reglas y, dentro de la tercera regla (contraste), una lista clasificada de diez técnicas concretas para generar contraste. El propósito declarado por el creador es que, al final del video, el espectador entienda: (1) qué es la jerarquía visual; (2) cómo se crea, mediante contraste, uniformidad y composición; y (3) cómo aplicar esos tres elementos para producir diseños compuestos y bien organizados. Es explícitamente un video "para principiantes" ("this is a beginner video"), por lo que el propio creador reconoce que no cubre todos los matices posibles del tema, sino los diez mecanismos de contraste "más comunes", listados de mayor a menor poder de contraste.

El video está pensado como una pieza de enseñanza aplicable a cualquier disciplina de diseño de comunicación visual: interfaces web, carteles, páginas de ventas, portadas de revista y materiales impresos se mencionan indistintamente como ejemplos, lo que indica que el método se presenta como transversal y no limitado a un solo medio.

## Evidencia y límites

Este contexto se construyó a partir de tres fuentes verificables:

1. **Transcripción**: derivada de la pista de subtítulos automáticos original en inglés (`en-orig`), normalizada en segmentos de aproximadamente 30 segundos con `vtt-to-clean-transcript.py`. Se revisaron el inicio, dos segmentos intermedios y el final; no se detectó duplicación incremental anómala ni huecos de contenido. El ritmo aproximado (3390 palabras en 928 segundos, ~219 palabras por minuto) es consistente con una locución explicativa pausada.
2. **Veinte fotogramas uniformes**, muestreados cada 5% de la duración (frame-00pct a frame-95pct), inspeccionados directamente mediante el contact sheet generado (`contact-sheet.jpg`).
3. **Siete fotogramas suplementarios**, extraídos en instantes puntuales donde el muestreo uniforme no capturó demostraciones visuales relevantes mencionadas en el guion: una cuadrícula de puntos (contraste), una portada de revista (rostros), una paleta de colores junto con una captura de un verificador de contraste web, un ejemplo tipográfico de legibilidad, una maqueta de landing page móvil y una sección de tarjetas de "beneficios de producto".

Límites explícitos de esta evidencia:

- El video no muestra ninguna herramienta de diseño en uso en tiempo real (no hay screencast de Figma, Photoshop u otro software); todos los ejemplos visuales son imágenes o mockups estáticos superpuestos sobre la locución del presentador.
- No hay métricas de conversión, pruebas A/B ni datos de negocio que respalden empíricamente ninguna de las reglas expuestas: son principios de diseño presentados como saber consolidado del oficio, no como resultados de un experimento propio del creador.
- El único dato cuantitativo citado en el video proviene de una fuente externa (WebAIM) sobre ratios de contraste de color; el resto de las afirmaciones son cualitativas.
- El video menciona, pero no explica en profundidad, la teoría del color («ya hice un video completo sobre eso»), por lo que este contexto no puede sustituir un análisis de teoría del color; solo recoge lo que efectivamente se dice aquí.
- Al final del video hay una promoción de un boletín de correo del propio creador (newsletter gratuito de "tips" de diseño) y una referencia cruzada a otro video del canal sobre teoría del color. Ambas cosas se registran como procedencia/promoción y no como parte del método.

## Tesis central

La jerarquía visual es el orden en que un espectador percibe los elementos de un diseño, y se construye deliberadamente combinando tres fuerzas: **contraste** (que separa un elemento del resto y le da primacía), **uniformidad** (que da estructura repetible y predecible al resto del diseño para que no todo compita por la atención) y **composición** (que organiza los elementos según patrones de escaneo visual que el público ya conoce, como de arriba hacia abajo, de izquierda a derecha, en Z o en F). La idea que atraviesa todo el video es que la jerarquía no determina qué elemento es "más importante" en términos absolutos, sino en qué orden el espectador debe notarlo; y que un buen diseño necesita, al mismo tiempo, unos pocos elementos con mucha primacía y una base grande de elementos uniformes que le den soporte y contexto.

## Mapa temporal de procedencia

| Tiempo | Contenido |
|---|---|
| 00:00–00:30 | Introducción: qué se va a aprender (jerarquía visual, cinco reglas) y definición de jerarquía visual como orden de percepción, con el concepto de "primacía". |
| 00:30–01:01 | Regla 1: la jerarquía está diseñada para guiar al espectador. Por qué se rankean elementos por primacía. |
| 01:01–01:33 | Regla 2: la cantidad de elementos y su primacía están correlacionadas. Introducción de contraste, uniformidad y composición como los tres pilares. |
| 01:33–02:05 | Explicación del contraste con el ejemplo de una cuadrícula de puntos idénticos (evidencia visual: `supplemental-108s.png`). Regla 3: no hay jerarquía sin contraste. |
| 02:05–02:35 | Introducción a la lista de diez formas de crear contraste. Técnica 1: movimiento. |
| 02:35–03:05 | Uso recomendado del movimiento: como impulso inicial, no como distracción sostenida. Técnica 2: información relacionada con la tarea del usuario. |
| 03:05–03:35 | Ejemplo de la receta de cocina y el botón "jump to recipe" (evidencia: `frame-35pct.png`, receta de galletas). |
| 03:35–04:07 | Técnica 3: puntos focales mediante espacio en blanco. Definición de "white space" (evidencia: `frame-20pct.png`). |
| 04:07–04:38 | Técnica 4: rostros humanos. Por qué los rostros captan atención más rápido que casi cualquier otro elemento (evidencia: `supplemental-260s.png`, portada de revista). |
| 04:38–05:09 | Advertencia sobre el uso irrelevante de rostros de stock; ejemplo de venta de clases de guitarra vs. venta de productos horneados. |
| 05:09–05:40 | Técnica 5: color. Introducción a mover valores de color en la rueda cromática para generar distancia. |
| 05:40–06:11 | Cita de WebAIM y su calculadora de contraste de color; ratio recomendado de 4.5:1 o superior (evidencia: `supplemental-345s.png`, `supplemental-410s.png`, captura con ratio 8.59:1). |
| 06:11–06:42 | Matización sobre luminancia vs. tono, y sobre accesibilidad para personas con deficiencias de visión del color. Dato sobre el rojo como el color que más capta la atención humana. |
| 06:42–07:14 | Técnica 6: tamaño. El tamaño es relativo al resto del diseño. |
| 07:14–07:44 | Técnica 7: peso (grosor) tipográfico. Ejemplo de encabezado y párrafo con jerarquía oculta (evidencia: `supplemental-440s.png`, ejemplo tipográfico "On Lying In Bed"). |
| 07:44–08:15 | Técnica 8: imágenes. Ejemplo de sección hero de "PopSci" donde el texto se lee primero y la imagen aporta evidencia de soporte (evidencia aproximada: `supplemental-495s.png`, maqueta de landing page móvil). |
| 08:15–08:46 | Técnica 9: elementos extra, como una etiqueta "best value" sobre una tarjeta de precios. |
| 08:46–09:16 | Técnica 10: desalineación deliberada de un elemento para atraer la mirada. |
| 09:16–09:48 | Cierre de la lista de diez técnicas; recordatorio de que es una lista de principiante, no exhaustiva. |
| 09:48–10:19 | Regla 4: la uniformidad da estructura al diseño. Introducción del concepto de predictibilidad. |
| 10:19–10:49 | Ejemplo de sección de beneficios con tarjetas: por qué las tarjetas deben ser visualmente iguales entre sí (evidencia: `supplemental-640s.png`, sección "Benefits Of Our Product" con tres tarjetas). |
| 10:49–11:20 | Detalle de qué valores deben igualarse entre elementos del mismo tipo (tamaño de imagen, fuente, peso, alto de párrafo, radio de esquina). Concepto de "cohesión". |
| 11:20–11:51 | Regla 5: la composición es clave para una buena jerarquía. Transición a la segunda mitad del video. |
| 11:51–12:22 | Reconstrucción del proceso de creación de jerarquía en tres pasos: ordenar mentalmente por primacía, aplicar contraste, agrupar elementos similares por uniformidad. |
| 12:22–12:52 | Patrón de composición 1: de arriba hacia abajo (top-to-bottom), y su inversión para audiencias que escanean de abajo hacia arriba. |
| 12:52–13:24 | Ejemplo de landing page con video: encabezado arriba, video debajo. Patrón de composición 2: de izquierda a derecha, y su inversión para audiencias que leen de derecha a izquierda. |
| 13:24–13:55 | Patrón de composición 3: patrón en Z, combinando arriba-abajo e izquierda-derecha. |
| 13:55–14:26 | Ejemplo del patrón en Z: encabezado y subtítulo arriba a la izquierda, imagen de soporte, tarjetas debajo (evidencia: `frame-90pct.png`, `frame-95pct.png`, maqueta "Launch Your Online Store" con flechas de recorrido en Z). |
| 14:26–14:56 | Patrón de composición 4: patrón en F, típico de diseños con mucho texto y muy común en la web. |
| 14:56–15:28 | Cierre: resumen de lo aprendido, promoción del video sobre teoría del color y del newsletter gratuito del creador, despedida. |

Este mapa registra procedencia; el cuerpo de las secciones siguientes explica cada principio sin necesidad de consultar los minutos.

# Método completo de la fuente

## Principio 1: la jerarquía visual es un orden de percepción, no un juicio de importancia absoluta

La jerarquía visual se define como el orden en que un espectador nota los elementos de un diseño. El video insiste en que llamarla "jerarquía" no implica que un elemento sea intrínsecamente más importante o más esencial que otro — de hecho, se afirma explícitamente que en un buen diseño todos los elementos son "absolutamente esenciales" — sino que el espectador humano solo puede procesar los elementos de a uno por vez, y el diseñador decide en qué orden ocurre esa lectura. El elemento que se busca que se note primero recibe el nombre de "primario" o se dice que tiene "primacía" sobre los demás.

Esta distinción es importante para un agente que aplique el método: la pregunta correcta al diseñar no es "¿qué elemento es más importante en abstracto?", sino "¿qué necesita ver el usuario primero, segundo, tercero, etc., para completar su tarea o entender el mensaje?". Por ejemplo, el video usa el caso de una landing page con un video incrustado: aunque el video en sí podría considerarse "más importante" que el encabezado en términos de contenido, el usuario necesita el encabezado primero para entender el contexto del video, así que el encabezado recibe primacía en el orden de lectura, no en abstracto.

## Principio 2: la primacía debe ser escasa para que funcione (Regla 1 y Regla 2)

Regla 1: la jerarquía está diseñada para guiar al espectador. Regla 2: el número de elementos y su primacía están correlacionados. El razonamiento es directo: si todos los elementos de un diseño tuvieran el mismo nivel de importancia visual, nada destacaría, y entonces la jerarquía —y con ella la posibilidad de guiar la mirada— desaparecería. Por eso solo puede haber un elemento verdaderamente primario, y solo unos pocos elementos "secundarios" que reciban un nivel de atención intermedio. La mayor parte del diseño, si va a funcionar, tiene que ser relativamente uniforme: unos pocos elementos concentran la primacía y dan contexto y soporte al resto.

Esto conecta directamente con por qué la jerarquía visual importa profesionalmente: es trabajo del diseñador organizar información de forma que sea fácil de entender y agradable de mirar, y la vía para lograrlo es manipular los valores de los elementos (tamaño, peso, color) para darles primacía y construir una estructura.

## Principio 3: no hay jerarquía sin contraste (Regla 3)

El contraste se define como las diferencias en un elemento que lo hacen destacar, y es el mecanismo por el cual el espectador sabe qué elementos tienen primacía. El ejemplo usado en el video es el de una cuadrícula de puntos idénticos: mientras todos los puntos comparten tamaño, color y espaciado, ninguno destaca; en cuanto se modifica el tamaño, el color y el espaciado de un solo punto, ese punto se vuelve inmediatamente el primero en notarse. `supplemental-108s.png` confirma visualmente esta cuadrícula de puntos negros idénticos usada como demostración didáctica de partida (el fotograma capturado corresponde al estado "antes", sin el punto modificado, ya que es el instante en que se introduce el concepto).

## Principio 4: diez formas de crear contraste, ordenadas de mayor a menor poder

El video reconoce que existen "un millón" de formas distintas de crear contraste, pero elige explicar las diez que considera más importantes, ordenadas de la que genera más contraste a la que genera menos. Es una lista explícitamente numerada y completa dentro del video; a continuación se reconstruye cada elemento sin omitir ninguno.

1. **Movimiento.** El ojo humano —y por extensión la mente humana— está programado para detectar movimiento, un mecanismo evolutivo de detección de amenazas. Estudios de escaneo cerebral citados en el video muestran que un elemento en movimiento es el primero en notarse. Sin embargo, el propio video advierte que "menos es más": si un elemento consume demasiada atención o se percibe como irrelevante o exagerado, frustra al usuario. La recomendación operativa es usar el movimiento para atraer la mirada inicialmente, y luego reducirlo al mínimo o detenerlo una vez que el usuario ya está mirando.

2. **Información relacionada con la tarea del usuario.** Después del movimiento, lo segundo que el ojo busca es lo conocido, es decir, lo que el usuario ya está buscando activamente. El video da el ejemplo de las recetas de cocina online: los usuarios ignoran automáticamente la imagen del blog, el título y la historia personal del autor, y van directo al botón "jump to recipe" (evidencia visual: `frame-35pct.png` muestra efectivamente una receta de galletas con chips de chocolate con texto extenso, ejemplificando ese tipo de página). La implicación para el diseñador es alinear lo que es prominente en el diseño con lo que el visitante realmente busca: en un póster de evento, los detalles del evento deben ser claros; en una página de ventas, el botón de compra y el precio deben ser obvios.

3. **Puntos focales mediante espacio en blanco.** Lo tercero que se nota en un diseño es lo que falta: el espacio en blanco ("white space"), que genera contraste por ausencia. Cuando se coloca un objeto en el centro de ese espacio, se crea un punto focal que dirige la mirada. `frame-20pct.png` confirma visualmente una tarjeta de definición con el término "White Space" y su definición ("el espacio alrededor de un punto focal dejado intencionalmente en blanco o vacío para atraer la mirada hacia algún elemento de un diseño"). El video advierte del efecto contrario: si se abarrota el diseño y se elimina todo el espacio en blanco, el resultado se parece a una página de "¿Dónde está Wally?", y se pierde la primacía y, con ella, la jerarquía.

4. **Rostros humanos.** Los humanos detectan otros rostros humanos —reales o ilustrados— más rápido que casi cualquier otro elemento de un diseño; por eso aparecen tan a menudo en anuncios, portadas de revista, pósteres y sitios web. `supplemental-260s.png` confirma esto con una portada de revista de moda (estilo Vogue) con un rostro femenino como elemento dominante, acompañada en pantalla del rótulo "4. Humans & Faces". El video matiza esta técnica con la Regla 2: solo un elemento puede ser el primero, así que incluir una persona —especialmente una foto de stock sin relación con el producto— puede en realidad restar atención al mensaje real: el usuario mira el rostro un instante y luego sigue su camino sin leer el titular. La recomendación es usar rostros solo cuando estén directamente relacionados con lo que el diseño promociona (un modelo tocando guitarra para vender clases de guitarra; en cambio, para una venta de productos horneados, es preferible mostrar los productos horneados en vez de un chef).

5. **Color.** Para usar el color como generador de contraste, la regla básica es separar los valores de color en la rueda cromática: crear distancia entre valores claros y oscuros, o entre matices (hues). Los ejemplos dados son un color claro sobre fondo oscuro, un color oscuro sobre fondo claro, o un elemento naranja sobre fondo azul. El video cita a WebAIM —descrita como una organización enfocada en accesibilidad web— y su calculadora de contraste de color, recomendando apuntar a un ratio de contraste de 4.5:1 o superior si se busca que un elemento destaque frente al fondo o sea visualmente distinguible de otros elementos. `supplemental-345s.png` y `supplemental-410s.png` confirman visualmente una paleta de colores tipo selector y una captura de pantalla de una herramienta "Contrast Checker" de WebAIM que muestra un ratio calculado de 8.59:1, consistente con la explicación verbal. El video aclara que ese ratio se refiere a la luminancia relativa (el valor de claridad percibida), que debe ser al menos cuatro veces y media más brillante que el fondo, y que esto es especialmente útil para la legibilidad de texto. También señala que, al diseñar un gráfico contra un fondo de color distinto, no siempre hace falta cambiar la luminancia —cambiar el matiz también aporta contraste—, aunque advierte que evitar cambios de luminancia perjudica la accesibilidad para personas con deficiencias de visión del color. Como dato adicional (curiosidad del creador, marcada explícitamente como tal —"one final note on color science because I find it so interesting"), se afirma que el rojo es el color que más capta la atención del ojo humano, con circuitos cerebrales dedicados a detectarlo, mientras que el significado del resto de los colores es subjetivo y depende del contexto cultural.

6. **Tamaño.** El tamaño de los elementos influye en qué se nota primero: aumentar el tamaño de un titular hace que sea más probable que se lea primero, incluso si su posición es algo incómoda. Pero, igual que con las otras técnicas, el tamaño es relativo al resto de los elementos del diseño: si todo es grande, nada destaca. La recomendación no es hacer elementos enormes, sino usar tamaños contrastantes: un titular solo necesita ser un poco más grande para leerse como titular, y un párrafo solo un poco más pequeño para leerse después.

7. **Peso (grosor tipográfico).** El peso es esencialmente el grosor de un elemento y, como el tamaño, dirige al espectador y da estructura al diseño. El video usa un ejemplo de encabezado y párrafo donde, aunque por posición y tamaño se intuye que hay que leer primero el titular, es fácil pasar por alto una lista estructurada oculta dentro del párrafo; cambiar el peso del texto más importante guía el ojo a lo largo del párrafo y facilita organizar la información. `supplemental-440s.png` confirma un ejemplo tipográfico con el título "On Lying In Bed" y un párrafo de cuerpo debajo, consistente con una demostración de jerarquía tipográfica mediante peso y tamaño relativos. La ventaja señalada del peso frente al movimiento es que no es tan llamativo, por lo que puede usarse para guiar al visitante a lo largo de un artículo o facilitar el escaneo de información útil sin romper la jerarquía general.

8. **Imágenes.** Más allá de los rostros, otros tipos de imágenes también captan atención y añaden contraste. Las imágenes pueden funcionar como elementos secundarios que dan soporte y contexto a otros elementos: el ejemplo dado es una sección "hero" de un sitio llamado "PopSci", donde el usuario lee primero el texto y luego ve las maquetas del sitio web como evidencia de soporte para la afirmación del titular. `supplemental-495s.png` (una maqueta de landing page móvil con el titular "Make a stunning site, easily" y varias capturas de pantalla de teléfono) es consistente con este tipo de composición texto-primero-imagen-de-soporte-después, aunque no se puede confirmar con certeza que corresponda exactamente al ejemplo "PopSci" mencionado verbalmente, dado que el nombre de marca no es legible en el fotograma disponible. Las imágenes también pueden ser el elemento primario de un diseño, en cuyo caso el contexto se entiende en relación con la imagen. El video advierte que, igual que con los rostros, hay que usar imágenes con moderación: si son irrelevantes o hay demasiadas, el ojo no sabe dónde enfocarse y se pierde la jerarquía.

9. **Elementos extra.** Añadir elementos adicionales que rompan un patrón de alguna manera es otra forma de generar contraste. El ejemplo dado es agregar una etiqueta como "best value" (mejor valor) sobre una de varias tarjetas de precios para hacerla destacar. Se describe como una forma sutil de aumentar el contraste sin romper la armonía estructural ya establecida: si hay una fila de elementos igualmente importantes pero se quiere que uno destaque primero, añadir un borde o una etiqueta es una manera efectiva de lograrlo.

10. **Desalineación.** La última técnica común es la desalineación deliberada: cualquier cosa fuera de lugar tiende a notarse. Si se desplaza levemente un elemento fuera de su posición esperada, esto atrae la mirada hacia él. El video advierte explícitamente que hay que ser cuidadoso con esta técnica, porque el objetivo final sigue siendo un diseño visualmente agradable, no añadir contraste de forma aleatoria: desalinear demasiados elementos puede hacer perder el flujo del diseño. Tomar un solo elemento y desplazarlo ligeramente ("out of place") puede aumentar el contraste y a menudo el interés y la intriga del resultado final.

El video cierra esta lista recordando que es un video de nivel principiante y que existen muchas otras formas sutiles de añadir contraste, pero que estas diez son, con diferencia, las más comunes.

## Principio 5: la uniformidad da estructura al diseño (Regla 4)

Sin uniformidad, el contraste (y por extensión la jerarquía) no funcionaría: si todo fuera diferente entre sí, nada destacaría por comparación. Se necesita un layout repetible y predecible para la mayoría de los elementos de un diseño si se quiere que el público pueda leerlo y comprenderlo. El secreto de la uniformidad, según el video, está en la predictibilidad: se puede diseñar un elemento exactamente como se quiera, siempre que los demás elementos del mismo tipo compartan los mismos valores.

El ejemplo desarrollado es una sección de sitio web que presenta los beneficios de un producto, con un titular, un subtítulo y varias tarjetas. Como cada tarjeta es igual de importante que las demás, no conviene que ninguna destaque individualmente con mucho contraste; en cambio, se busca que toda la fila de tarjetas se lea como una sección unificada, lo que aporta armonía visual y equilibra el titular de alto contraste. `supplemental-640s.png` confirma visualmente una sección titulada "Benefits Of Our Product" con tres tarjetas idénticas en estructura (marcador de imagen circular, "Card headline" y texto de relleno), consistente exactamente con este ejemplo.

Para lograr esa uniformidad, el video especifica qué valores deben igualarse entre elementos del mismo tipo: cada imagen debe tener el mismo tamaño; cada título de tarjeta debe usar la misma fuente, el mismo tamaño de fuente y el mismo peso; cada párrafo debe ser exactamente igual, incluso ocupando la misma altura; cada tarjeta debe tener el mismo color de borde y el mismo radio de esquina. Si se quiere cambiar un valor —por ejemplo, el peso de los títulos de tarjeta— debe cambiarse para todas las tarjetas por igual. Esta práctica recibe el nombre de "cohesión", y es, según el video, la razón por la que algunos diseños se perciben perfectamente equilibrados y armoniosos, mientras que otros se ven desordenados.

La conclusión de esta sección es que el secreto de una buena jerarquía visual es el equilibrio entre contraste y uniformidad.

## Principio 6: la composición ordena la jerarquía según patrones de escaneo conocidos (Regla 5)

La composición se define como la disposición de los elementos de forma visualmente agradable y fácil de leer, y constituye la quinta regla: la composición es clave para una buena jerarquía. Antes de explicar los patrones de composición, el video reconstruye el proceso completo en tres pasos, retomando lo ya aprendido:

1. Ordenar mentalmente cada elemento según su primacia: qué debe verse primero, segundo, tercero, etc. Esto define la jerarquía.
2. Usar las herramientas de contraste ya explicadas (tamaño, peso, color y otros valores) para dar contraste a los elementos importantes.
3. Agrupar los elementos similares entre sí, lo que aporta uniformidad y cohesión al diseño.

Con esa base, el video describe cuatro patrones de composición basados en hábitos de escaneo visual naturales del público:

- **De arriba hacia abajo (top-to-bottom).** El patrón más básico: la mayoría de las personas en el mundo están acostumbradas a escanear una página de arriba hacia abajo (y el patrón se invierte para audiencias que escanean de abajo hacia arriba). Se colocan los elementos más importantes arriba y los que dan contexto adicional debajo. El ejemplo dado es una landing page con video: el titular arriba, el video debajo; aunque como diseñador se podría pensar que el video es más importante que el titular, el visitante necesita el titular para entender el contexto del video, de modo que la jerarquía no es sobre qué es esencial, sino sobre qué debe verse primero, segundo, tercero.

- **De izquierda a derecha.** Para audiencias que leen de izquierda a derecha, este es su hábito natural de escaneo (y se invierte para quienes leen de derecha a izquierda). Una forma sencilla de crear un diseño fácil de escanear es organizar los elementos de más a menos importante, de izquierda a derecha.

- **Patrón en Z.** Al combinar los dos patrones anteriores, se observa que gran parte del público occidental escanea primero de izquierda a derecha y luego de arriba hacia abajo, lo que da lugar al llamado "patrón en Z", común en diseños más minimalistas. El ejemplo dado ubica el elemento más importante (titular y subtítulo) arriba a la izquierda, apoyado por una imagen, y con tarjetas debajo. `frame-90pct.png` y `frame-95pct.png` confirman visualmente una maqueta de landing page titulada "Launch Your Online Store" con flechas rojas superpuestas que trazan explícitamente un recorrido en zigzag (patrón Z) sobre los elementos de la página, incluyendo una segunda versión de la misma maqueta con marcadores numerados (1, 2, 3) que refuerzan el orden de lectura sugerido.

- **Patrón en F.** Para diseños con mucho texto, las personas escanean como si leyeran un libro: primero de arriba hacia abajo, luego de izquierda a derecha, en un patrón llamado "F", que el video señala como el más común en la web, donde el texto suele ocupar más espacio relativo que en un póster o una valla publicitaria. El ejemplo dado es un sitio web con titular, subtítulo y tarjetas debajo, con un gráfico de soporte a la derecha.

El video cierra señalando que la elección del patrón depende del medio y de la audiencia: el patrón en Z puede ser más efectivo en pósteres, vallas publicitarias o diseños más minimalistas; el patrón de arriba hacia abajo puede ser más efectivo en una carta o tarjeta enviada a otra persona; y el patrón en F, al menos para las primeras secciones de un diseño, tiende a ser el más común y efectivo en la web.

# Demostraciones y ejemplos visibles

Esta sección enumera exclusivamente lo que fue confirmado por inspección directa de fotogramas, distinguiéndolo de lo que solo se afirma verbalmente.

- `frame-00pct.png`, `frame-05pct.png`, `frame-15pct.png` (parcial), `frame-20pct.png` (parcial), `frame-25pct.png`, `frame-30pct.png`, `frame-55pct.png`, `frame-60pct.png`, `frame-70pct.png`, `frame-75pct.png`, `frame-80pct.png`, `frame-85pct.png` muestran al presentador hablando a cámara en un set con estantería de libros de fondo, gesticulando activamente: es el formato dominante del video (locución directa a cámara).
- `frame-10pct.png` muestra una tarjeta de título de sección "Building Blocks Of Hierarchy" ("bloques de construcción de la jerarquía") seguida del rótulo "1. Motion", confirmando visualmente el inicio de la lista numerada de técnicas de contraste.
- `frame-20pct.png` muestra la tarjeta de definición "White Space", con el texto "the space around a focal point left intentionally blank or bare in order to draw the eye towards some element in a design", confirmando la explicación verbal sobre puntos focales.
- `frame-35pct.png` muestra una receta de galletas con chips de chocolate ("Chocolate Chip Cookie Recipe") con texto extenso de instrucciones, consistente con el ejemplo verbal de páginas de recetas y el botón "jump to recipe".
- `frame-40pct.png` muestra una tarjeta de texto titulada "On Lying In Bed" con un párrafo de cuerpo, un ejemplo tipográfico reutilizado también en `supplemental-440s.png`.
- `frame-65pct.png` muestra una tarjeta "Rule #4 — Uniformity gives our design structure" con un bloque de colores (rosa, azul, verde) a modo de icono, confirmando visualmente la introducción textual de la cuarta regla.
- `frame-90pct.png` y `frame-95pct.png` muestran una maqueta de landing page "Launch Your Online Store" con flechas rojas trazando un recorrido en Z, y una segunda versión con marcadores numerados 1-2-3, confirmando visualmente el patrón de composición en Z.
- `supplemental-108s.png` muestra una cuadrícula de puntos negros idénticos sobre fondo blanco, confirmando el ejemplo de partida usado para introducir el concepto de contraste.
- `supplemental-260s.png` muestra una portada de revista de moda con un rostro femenino como elemento dominante, junto al rótulo en pantalla "4. Humans & Faces", confirmando la técnica de contraste número 4.
- `supplemental-345s.png` muestra una paleta de selección de color junto a una captura de pantalla parcial de una herramienta con el logo "WebAIM" y un "Contrast Checker" visible.
- `supplemental-410s.png` confirma con mayor detalle la misma herramienta "WebAIM Contrast Checker", mostrando un ratio de contraste calculado de 8.59:1, un botón "Run Contrast Test" y otros campos de la interfaz, consistente con la cita textual de WebAIM y su recomendación de un ratio mínimo de 4.5:1.
- `supplemental-440s.png` confirma la tarjeta tipográfica "On Lying In Bed" ya vista en `frame-40pct.png`, reforzando que corresponde a un ejemplo sostenido en pantalla durante varios segundos (una franja horaria consistente con la explicación de peso tipográfico, aproximadamente entre 07:14 y 07:44).
- `supplemental-495s.png` muestra una maqueta de landing page móvil con el titular "Make a stunning site, easily" y varias capturas de pantalla de teléfono alineadas, consistente con un ejemplo de "imágenes como elemento secundario de soporte", aunque no se pudo confirmar con certeza visual que corresponda específicamente a la marca "PopSci" mencionada verbalmente por el nombre.
- `supplemental-640s.png` muestra una sección "Benefits Of Our Product" con tres tarjetas idénticas en estructura, confirmando directamente el ejemplo verbal de uniformidad entre tarjetas.

No se encontró, ni en el muestreo uniforme ni en los fotogramas suplementarios adicionales, una demostración visual explícita y nítida de: la técnica de "elementos extra" (etiqueta "best value" sobre tarjetas de precios), la técnica de "desalineación", el ejemplo de tamaño de titular (técnica 6) de forma aislada, ni el patrón de composición en F de forma explícita con un gráfico dedicado. Estas afirmaciones permanecen respaldadas únicamente por la transcripción (evidencia directa de fuente), no por confirmación visual, y se marcan así en el resto del documento.

# Flujo integrado para el agente

Un agente que use este documento para producir o auditar un diseño debería seguir esta secuencia operativa, derivada directamente del método reconstruido:

1. **Definir la jerarquía deseada.** Antes de tocar cualquier valor visual, listar mentalmente (o en un documento) qué elemento debe notarse primero, cuál segundo, cuál tercero, etc., en función de lo que el usuario realmente necesita para completar su tarea, no en función de qué contenido "parece" más importante en abstracto.
2. **Aplicar contraste solo al elemento o los pocos elementos que deben tener primacía**, eligiendo entre las diez técnicas descritas (movimiento, información relacionada con la tarea, puntos focales por espacio en blanco, rostros, color, tamaño, peso, imágenes, elementos extra, desalineación), priorizando las de mayor impacto (movimiento, información relevante para la tarea) cuando el objetivo sea captar atención inmediata, y las de impacto más sutil (peso, elementos extra) cuando se busque guiar sin saturar.
3. **Aplicar uniformidad a todos los elementos que no deban competir por primacía**, igualando explícitamente tamaño, fuente, peso, color de borde, radio de esquina y otros valores repetibles dentro de cada grupo de elementos del mismo tipo (por ejemplo, todas las tarjetas de un mismo bloque).
4. **Agrupar elementos similares** para reforzar la cohesión visual y facilitar el escaneo.
5. **Elegir un patrón de composición según el medio y la audiencia**: arriba-abajo para cartas o audiencias con ese hábito de lectura; izquierda-derecha simple; patrón en Z para diseños minimalistas, pósteres o pantallas con poco texto; patrón en F para páginas web con abundante texto.
6. **Verificar el contraste de color con una herramienta de accesibilidad** (el video cita específicamente la calculadora de WebAIM) y apuntar a un ratio de al menos 4.5:1 quirúrgicamente cuando el objetivo sea legibilidad de texto o distinción de un elemento sobre el fondo.
7. **Aplicar moderación en el uso de rostros e imágenes**: usarlos solo cuando estén directamente relacionados con lo que el diseño promociona, evitando fotografías de stock genéricas que puedan robar atención sin aportar al mensaje.
8. **Revisar que solo un elemento tenga primacía absoluta** y que el resto del diseño sea deliberadamente uniforme; si varios elementos compiten por la máxima atención, hay que retroceder y reforzar la uniformidad de los que no deban destacar.
9. **Separar explícitamente las afirmaciones de tiempo limitado o no verificadas** (por ejemplo, cualquier cifra de conversión o "buenas prácticas" de una marca externa) de los principios estructurales estables del método.

# Reglas operativas

- Nunca dar a más de un elemento primacía absoluta en una misma vista o sección; si el negocio pide destacar varias cosas a la vez, negociar cuál va primero.
- Antes de aumentar el contraste de un elemento, confirmar que el resto de los elementos del mismo nivel jerárquico compartan exactamente los mismos valores visuales (tamaño, fuente, peso, color de borde, radio de esquina).
- Verificar cuantitativamente el contraste de color de cualquier texto o elemento crítico contra su fondo, con un objetivo mínimo de 4.5:1, usando una herramienta de verificación de contraste como la citada (WebAIM) u otra equivalente vigente.
- Usar movimiento con moderación: solo para atraer la atención inicial hacia un elemento, reduciéndolo o eliminándolo una vez que el usuario ya está mirando ese elemento.
- Alinear el elemento con mayor primacía con lo que el usuario realmente busca al llegar al diseño (precio y botón de compra en una página de ventas; detalles del evento en un póster), no con lo que el diseñador cree más atractivo.
- Usar rostros e imágenes de personas únicamente cuando tengan relación directa con lo que se está promocionando.
- Elegir el patrón de composición (arriba-abajo, izquierda-derecha, Z o F) en función del medio (impreso vs. web) y de la cantidad relativa de texto, no de forma arbitraria.
- Al usar desalineación como técnica de contraste, limitarla a un único elemento por composición para no perder el flujo general del diseño.
- Etiquetar cualquier elemento extra (insignias, etiquetas tipo "más vendido") como una técnica de contraste sutil, no como parte de la estructura base del diseño.

# Antipatrones

- Dar a todos los elementos el mismo nivel de contraste, lo que elimina la jerarquía y hace que nada destaque (contradice directamente la Regla 3).
- Usar movimiento de forma sostenida o exagerada, lo que frustra al usuario en lugar de guiarlo (advertencia explícita del video sobre la técnica 1).
- Incluir rostros o imágenes de stock sin relación con el producto, lo que puede robar atención del mensaje real (advertencia explícita del video sobre la técnica 4).
- Eliminar todo el espacio en blanco de un diseño, produciendo un efecto de sobrecarga visual tipo "¿Dónde está Wally?" donde el ojo no sabe qué mirar primero (advertencia explícita del video sobre la técnica 3).
- Dar a cada tarjeta o elemento repetido de una sección valores ligeramente distintos entre sí (tamaños, fuentes o colores de borde inconsistentes), lo que rompe la cohesión y hace que el diseño se perciba desordenado (contradice directamente el principio de uniformidad).
- Desalinear demasiados elementos a la vez, lo que hace perder el flujo general de la composición (advertencia explícita del video sobre la técnica 10).
- Ignorar la relación entre luminancia y accesibilidad al elegir dos colores que solo difieren en matiz mientras se mantiene la misma luminancia, lo que perjudica a personas con deficiencias de visión del color (advertencia explícita del video en la sección de color).
- Elegir un patrón de composición sin considerar el medio o la audiencia (por ejemplo, aplicar un patrón en Z a una página web muy larga y cargada de texto, en lugar del patrón en F recomendado para ese contexto).

# Criterios de aceptación

Un diseño puede considerarse alineado con el método de este video si cumple, de forma observable, lo siguiente:

- Existe un único elemento (o un conjunto muy reducido de elementos) que un observador identifica de inmediato como el primero en notarse, sin ambigüedad.
- Los elementos de un mismo grupo repetido (tarjetas, íconos, bloques de texto equivalentes) comparten tamaño, fuente, peso tipográfico, color de borde y radio de esquina de forma exacta.
- El contraste de color entre cualquier texto crítico y su fondo alcanza o supera un ratio de 4.5:1, verificable con una herramienta de contraste.
- El orden de lectura observable en el diseño (de arriba hacia abajo, izquierda a derecha, en Z o en F) corresponde de forma justificable al medio (impreso o web) y a la cantidad relativa de texto.
- Ningún elemento decorativo (movimiento, rostro o imagen no esencial) compite en atención con el elemento de mayor primacía.
- El espacio en blanco alrededor del elemento con mayor primacía es suficiente para que actúe como punto focal, sin saturación visual circundante.
- Cualquier elemento con desalineación deliberada es único dentro de su composición inmediata, no un patrón repetido de forma indiscriminada.

# Rúbrica de evaluación

Escala de 0 a 3 por dimensión (0 = ausente o contradictorio, 1 = presente pero débil, 2 = aplicado correctamente, 3 = ejemplar y verificable):

| Dimensión | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Primacía clara | No hay elemento dominante identificable | Hay un elemento dominante, pero compite con otros | Un único elemento domina de forma clara | El orden completo (primero, segundo, tercero) es evidente e intencional |
| Uniformidad estructural | Elementos repetidos con valores inconsistentes | Uniformidad parcial, con inconsistencias menores | Elementos repetidos comparten todos los valores clave | Uniformidad exacta, verificada valor por valor (tamaño, fuente, peso, borde, radio) |
| Contraste de color accesible | Sin verificación de contraste, legibilidad dudosa | Contraste aparente pero no verificado numéricamente | Ratio verificado igual o superior a 4.5:1 en los elementos críticos | Ratio verificado y documentado, con consideración explícita de deficiencias de visión del color |
| Uso moderado de movimiento, rostros e imágenes | Uso excesivo o irrelevante que distrae del mensaje | Uso presente pero con relación débil al contenido | Uso relacionado directamente con el contenido, en dosis moderada | Uso relacionado, moderado, y reforzando explícitamente el mensaje principal |
| Composición según patrón de escaneo | Disposición arbitraria sin patrón reconocible | Patrón presente pero inconsistente con el medio o la audiencia | Patrón elegido correctamente según medio y cantidad de texto | Patrón aplicado con justificación explícita y verificable en el propio diseño |

Resultado mínimo aceptable: promedio de 2 o superior en las cinco dimensiones, sin ninguna dimensión en 0.

Fallos bloqueantes (invalidan la aceptación sin importar el promedio):
- Más de un elemento con primacía absoluta simultánea en la misma vista.
- Contraste de color por debajo de 3:1 en texto considerado crítico para completar una tarea.
- Elementos repetidos del mismo tipo con valores visuales visiblemente distintos entre sí (rompe la cohesión).

# Resumen compacto

La jerarquía visual es el orden en que un espectador nota los elementos de un diseño, y se construye combinando tres fuerzas: contraste, que separa y da primacía a unos pocos elementos mediante diez técnicas posibles (movimiento, información relacionada con la tarea, puntos focales por espacio en blanco, rostros, color, tamaño, peso, imágenes, elementos extra y desalineación, ordenadas de mayor a menor poder relativo); uniformidad, que da estructura predecible al resto del diseño igualando los valores visuales de los elementos repetidos del mismo tipo (cohesión); y composición, que organiza todo según patrones de escaneo ya conocidos por la audiencia (arriba-abajo, izquierda-derecha, en Z o en F, según el medio y la cantidad de texto). Solo puede haber un elemento con primacía absoluta; el resto del diseño debe ser deliberadamente uniforme para que ese elemento realmente destaque. La verificación de contraste de color con una herramienta como la de WebAIM (ratio mínimo recomendado 4.5:1) es la única comprobación cuantitativa citada en el video; el resto de las reglas son cualitativas y de criterio de diseño. El video es explícitamente de nivel principiante y no exhaustivo, y cierra con una promoción de un video propio sobre teoría del color y de un boletín gratuito del creador, ambos marcados aquí como procedencia/promoción y no como parte del método central.

[S53]

### Contexto autónomo para un agente

Contexto autónomo para un agente

[S54]

### Patterns

12 validated rule patterns.

[S55]

## Coverage and limitations

- Blocks considered: 79
- Blocks included: 55
- The token budget was exhausted; 24 additional block(s) with real evidence were left out.

## Source registry

- auto-design / kK1TOpI948o — The Beginner's Guide To Visual Hierarchy (DesignSpo)
- auto-design / bdC2BtJNt9s — The Art of Minimalism (Seth Curl)
- auto-design / DU6vjWnH2p0 — How I design websites with EDITORIAL style layouts (part 1) (BONT)
- auto-design / PKfZ1gnVJ44 — The FULL 2026 Guide To Layout & Composition For Designers! (Satori Graphics)
- auto-design / 25UwZDuHfiQ — How I design websites with EDITORIAL style layouts (part 2) (BONT)
- auto-design / DRmnkaWQp4o — 9 Web Design Trends 2025 to Spruce Up Your Site (Showit)
- auto-design / AXpxZMRM1EY — The ULTIMATE Guide To Typography For Beginners (DesignSpo)
- auto-design / bT1tG_E8g-4 — 🚨 Top 6 Design Trends 2026: Flat Design is DEAD (Grayson's Graphics)
- auto-design / nlGr4GRIzAg — The REAL 2026 Color Theory Knowledge Designers Need To Know! (Satori Graphics)
- auto-design / qthkkHPNAYQ — You Should Try These 5 Web Design Trends (Codex Community)
- auto-design / u-JtFKXL_jY — 4 Graphic Design Tips For ELITE Design Thinkers! (Satori Graphics)
- auto-design / 8XWX5EIxBz8 — BRUTALIST WEB DESIGNS - The UGLIEST Design Trend of 2020 | TemplateMonster (TemplateMonster)
- auto-design / xpLUouSZHi8 — 20 More Design Styles You've Been Searching For (Kittl)
- auto-design / waHuVF3XuMA — Steal These Web Design Trends 2026 (Self-Made Web Designer)
- auto-design / T96O8dTzi2Q — NO MORE AI SLOP | Claude Design Full Tutorial (Sergei Chyrkov)
- auto-design / tbf6XDqCWFE — BRUTALISM: Best Website Examples for Your Web Design Inspiration |  TemplateMonster (TemplateMonster)
- auto-design / 8Z_MEP-_kxA — Web Design Trends 2026 (DesignSense)
- auto-design / vwVg1sBShH8 — 7 ESTILOS de Diseño Gráfico que No conocías (Crealondra)
- auto-design / _DHiyzRN4gY — Why Minimalism Dominates Modern Graphic Design (Kittl)
- auto-design / WxZHUe8mvhU — 11 Years of Brutally Honest Web Design Advice in 7 Minutes (Self-Made Web Designer)
- auto-design / uZWnxa4mkKA — 15 More Design Styles You've Never Heard Of (Kittl)
- auto-design / AzjbRybUX3M — Why Your Designs Still Look Amateur! (Hidden Rules Pros Use) (Satori Graphics)
- auto-design / Kzx8iw4hEc0 — Alex Hormozi's Advice on Web Design (Sam Crawford | Web Design Expert)
- auto-design / bZ1vbmV5gk8 — 40 Design Style Names You've Been Looking For (Find References Faster) (Kittl)
- auto-design / YlN28RNChl0 — This Video Will Take You From Junior to Senior UX/UI Designer (uxpeak)
