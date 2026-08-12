---
schema_version: "1.0"
query: "recetas de cocina vegana para principiantes"
depth: focused
estimated_tokens: 11997
sources_used: 23
---

# Context package

## Query and scope

Query: recetas de cocina vegana para principiantes
Depth: focused (max 12000 estimated tokens)

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

### Contexto autónomo para un agente > Mapa temporal de procedencia

El mapa indica procedencia; la explicación completa de cada estilo está en la
sección siguiente, de modo que el lector no necesita consultar las marcas de
tiempo para entender el método.

[S39]

### Flujo integrado para el agente

Un agente que reciba un encargo de diseño gráfico y quiera aplicar el método completo de este video debería seguir esta secuencia operativa:

[S40]

### Contexto autónomo para un agente > Mapa temporal de procedencia

Este mapa orienta la procedencia, pero cada principio se explica de forma
completa en las secciones siguientes: el lector no necesita consultar las
marcas de tiempo para entender el método.

[S41]

## Related rules and patterns

No evidence matched this section.

## Additional relevant context

### Método completo de la fuente

Método completo de la fuente

[S42]

### Contexto autónomo para un agente

Contexto autónomo para un agente

[S43]

### Patterns

12 validated rule patterns.

[S44]

## Coverage and limitations

- Blocks considered: 79
- Blocks included: 44
- The token budget was exhausted; 35 additional block(s) with real evidence were left out.

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
- auto-design / YlN28RNChl0 — This Video Will Take You From Junior to Senior UX/UI Designer (uxpeak)
