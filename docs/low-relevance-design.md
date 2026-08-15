# Diseño 4.7: aviso de baja relevancia (`LOW_RELEVANCE`)

## Estado

Propuesto e implementado el 14 de agosto de 2026, a partir de evidencia
empírica sobre la biblioteca real de 51 videos.

Cierra —parcialmente y con una forma distinta a la prevista— el frente que 2.2
dejó abierto como "piso mínimo de similitud vectorial, salvo evidencia clara"
y que 3.2 no pudo cerrar por falta de esa evidencia.

## El problema, reproducido con datos reales

La búsqueda vectorial es un ranking exhaustivo sin piso de similitud: toda
consulta sobre una biblioteca no vacía devuelve candidatos. Medido sobre la
colección `auto-design` ya indexada:

```text
auto-youtube-rag retrieve "síntomas y tratamiento de la diabetes tipo 2 en adultos mayores"
→ status: "ok", 31.982 tokens, 29 videos, warnings: []
```

El primer bloque citado provenía de _"8 advanced rules of minimal Web Design"_ y
hablaba de usar como máximo dos tipografías. **El bundle no declara en ninguna
parte que nada de eso responde la consulta**: `warnings` vacío y `limitations`
mencionando sólo el presupuesto agotado.

Un agente atento lo detecta al leer el contenido —es lo que 3.2 concluyó y
sigue siendo cierto—, pero el producto tiene la señal y no la comunica.

## Por qué no se puede usar `fusedScore`

RRF asigna `1/(k + rank)`: codifica **posición, no similitud**. El primer
candidato de una consulta perfecta y el de una absurda reciben exactamente el
mismo `fusedScore`. Comparar `rawScore` entre vías tampoco sirve, y el propio
puerto lo advierte: BM25 no tiene cota, el coseno vive en `0..1`.

La única señal con significado absoluto es el **coseno de la vía vectorial**.

## La medición

24 consultas contra la biblioteca real (51 videos, 3.635 fragmentos),
clasificadas a mano en tres grupos, registrando el coseno del mejor hit:

| Clase                                | mín    | máx    | promedio |
| ------------------------------------ | ------ | ------ | -------- |
| **Alta** — en dominio (10 consultas) | 0,8657 | 0,9012 | 0,8824   |
| **Media** — técnica no cubierta (5)  | 0,8428 | 0,8600 | 0,8526   |
| **Baja** — fuera de dominio (9)      | 0,8149 | 0,8389 | 0,8253   |

Las tres clases **no se solapan**. Pero los márgenes son estrechos: 0,0057
entre alta y media, y **0,0039** entre media y baja. E5 comprime toda la
distribución entre 0,81 y 0,90, así que ningún valor baja de 0,80 por absurda
que sea la consulta.

## Decisiones

**El umbral por defecto es `0.84`.** Separa limpiamente la clase baja (máximo
0,8389) de la media (mínimo 0,8428) en el corpus medido. Se eligió el corte
más conservador de los dos posibles: avisar sólo cuando la consulta está
claramente fuera de dominio, en vez de intentar distinguir "media" de "alta",
donde el margen es aún más fino y el juicio más discutible.

**El aviso no filtra nada.** `LOW_RELEVANCE` es informativo: el bundle se
arma igual, con los mismos bloques y las mismas citas. Es la decisión de
diseño más importante del punto, y se toma precisamente porque el umbral es
frágil:

- un umbral demasiado alto produce un aviso de más — molesto, inocuo;
- un umbral demasiado bajo guarda silencio — exactamente el comportamiento
  de hoy.

Ninguno de los dos errores puede ocultar evidencia real ni vaciar un bundle.
Un piso que **descartara** candidatos tendría el riesgo opuesto y mucho peor,
y por eso se sigue descartando, igual que en 2.2 y 3.2.

**El umbral es configurable, no una constante escondida.** Vive en
`retrieval-thresholds.ts` junto a la tabla de mediciones que lo justifica, y se
puede inyectar por dependencia. Está calibrado sobre **una** colección de
diseño en español: otro corpus, otro idioma u otro modelo desplazan la
distribución, y el número tendría que volver a medirse. Eso queda escrito
donde vive el número, no sólo en este documento.

**No dispara cuando la vía vectorial no participó.** Si el vector falló, si no
hay vectores para el modelo activo (`VECTORS_STALE`) o si no hubo hits, no hay
coseno que evaluar y el aviso no se emite: ya existe un warning específico para
cada uno de esos casos, y sumar `LOW_RELEVANCE` sólo agregaría ruido.

## Comportamiento esperado

| Consulta                              | coseno | ¿avisa? |
| ------------------------------------- | ------ | ------- |
| "jerarquía tipográfica en diseño web" | 0,8914 | no      |
| "arquitectura hexagonal en backend"   | 0,8600 | no      |
| "cómo configurar un pipeline de CI"   | 0,8428 | no      |
| "receta de pan de masa madre"         | 0,8389 | **sí**  |
| "síntomas de la diabetes tipo 2"      | 0,8206 | **sí**  |
| "historia de la revolución francesa"  | 0,8149 | **sí**  |

## El número se reporta siempre, no sólo cuando avisa

`metrics.top_vector_similarity` lleva el coseno del mejor hit vectorial en
**cada** consulta (o `null` si la vía semántica no corrió). El aviso es un
juicio con un umbral discutible; el número es el dato.

La razón es la filosofía del producto: el agente que consulta es el único
cerebro. Decidir qué significa un 0,84 es exactamente el tipo de juicio que el
diseño delega en él, así que darle sólo el veredicto —y no la evidencia— sería
incoherente. Con el número puede aplicar su propio criterio, o calibrar otro
umbral para su corpus sin tocar el producto.

También corrige un riesgo que el aviso solo introduce: **falsa confianza por
ausencia**. Un agente podría razonar "no hay `LOW_RELEVANCE`, entonces esto es
relevante", y es falso — el umbral puede no dispararse con contenido
tangencial. Teniendo el número, la ausencia de aviso deja de ser la única
información disponible.

Lo estrecho del margen quedó demostrado en la primera corrida real tras
implementarlo: "síntomas de la diabetes tipo 2" midió **0,8399** contra un piso
de 0,84. Una diezmilésima más y no habría avisado, con el contenido siendo
igual de irrelevante.

## Limitación conocida: la vía textual no participa

El juicio se apoya sólo en el coseno vectorial. Si FTS5 encontrara una
coincidencia léxica exacta —señal fuerte de relevancia— pero el coseno quedara
bajo el piso, el aviso saltaría igual: un falso positivo.

En la práctica es poco probable, porque un término presente en la colección
suele elevar también el coseno. Y el costo está acotado por diseño: como el
aviso informa y no filtra, un falso positivo cuesta una advertencia de más,
nunca contenido perdido. Pero el criterio no cubre ese caso y conviene saberlo
antes de subir el umbral.

## Fuera de alcance

- **Filtrar o descartar candidatos por umbral.** Se mantiene la decisión de
  2.2 y 3.2.
- **Calibrar el umbral por biblioteca en tiempo de ejecución.** Sería más
  robusto que una constante, pero exige una línea base por corpus y no hay
  evidencia todavía de que haga falta.
- **Cambiar `status`.** Una consulta fuera de dominio sigue devolviendo `ok`
  con código de salida `0`: hay evidencia real recuperada, sólo que poco
  relacionada. Degradarla a `no_results` sería mentir en la otra dirección.

## Bloques

| Bloque | Contenido                                                          |
| ------ | ------------------------------------------------------------------ |
| AI     | Umbral medido, código de warning y emisión en `retrieveCandidates` |
| AJ     | Propagación al bundle, documentación y skill                       |
