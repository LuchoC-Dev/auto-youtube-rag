# Códigos, estados y recuperación de fallos

Leé este archivo cuando un comando falle, devuelva un código de salida
distinto de `0`, o produzca `warnings` que no sepas interpretar. Para
problemas de instalación, rutas o del modelo de embeddings, leé
`setup.md` en su lugar.

## Códigos de salida del proceso

| Código | Significado                                               | Qué hacer                                                 |
| -----: | --------------------------------------------------------- | --------------------------------------------------------- |
|    `0` | Éxito, incluidos `no_results`, `no_changes`, etc.         | Continuar normalmente.                                    |
|    `1` | Fallo operativo o resultado parcial (`status: "partial"`) | Revisar `warnings`/`limitations`; no reintentar a ciegas. |
|    `2` | Uso inválido de la CLI (argumento mal escrito)            | Corregir el comando, no es un bug del producto.           |
|  `130` | Interrupción manual (Ctrl+C)                              | No aplica a uso no interactivo.                           |

Un código `2` siempre es tuyo: un flag mal escrito, un preset de `--depth`
inventado o un `--max-tokens` que no es un entero positivo. Corregí el
comando en vez de investigar el producto.

## `status` en el recibo de `retrieve`

- `"ok"`: hay bundle con evidencia. Un `status: "ok"` con relevancia baja
  sigue siendo un resultado válido y esperado, no un error — la búsqueda
  semántica no descarta nada por similitud, así que consultas poco
  relacionadas con la colección igual devuelven candidatos. **Desde el punto
  4.7 eso ya no es silencioso**: cuando el mejor puntaje queda bajo el piso
  calibrado aparece `LOW_RELEVANCE` en `warnings` (ver más abajo). Igual
  conviene leer `Coverage and limitations` en `context.md` antes de confiar
  ciegamente en la relevancia: el aviso puede no dispararse y el contenido
  ser tangencial.
- `"no_results"`: la biblioteca (tras aplicar `--source` u otros filtros)
  quedó vacía de candidatos. El bundle igual se escribe, explicando la
  ausencia de evidencia. No es un fallo del comando.
- `"partial"`: una vía de recuperación se degradó (por ejemplo, búsqueda
  textual o vectorial no disponible) pero igual se produjo un bundle
  utilizable. Revisá `warnings` antes de confiar en la cobertura.

## Códigos simbólicos

Cada salida JSON incluye códigos simbólicos estables (por ejemplo
`SOURCE_NOT_FOUND`, `PACKAGE_INVALID`) y un `retryable` cuando corresponde.
Usalos para decidir si tiene sentido reintentar o si hace falta intervención
humana.

Códigos de estado de instalación, todos resueltos en `setup.md`:

| Código                     | Qué significa                                                    |
| -------------------------- | ---------------------------------------------------------------- |
| `LIBRARY_NOT_FOUND`        | Falta la base. Corré `init`.                                     |
| `MODEL_NOT_INSTALLED`      | Falta el modelo o está dañado. Corré `models install`.           |
| `MODEL_SOURCE_INVALID`     | `--from` apunta a una ruta sin el modelo completo. Error de uso. |
| `MODEL_DOWNLOAD_FAILED`    | La red falló durante la descarga. Es retryable.                  |
| `DATABASE_INTEGRITY_ERROR` | La base está dañada. Corré `doctor` para el detalle.             |
| `LEGACY_LIBRARY_FOUND`     | Advertencia: hay una base vieja relativa al directorio actual.   |

Ninguno de los tres primeros es transitorio: reintentar el mismo comando sin
cambiar nada vuelve a fallar igual.

Aparte, en los `warnings` de `retrieve`:

| Código                      | Qué significa                                                                  |
| --------------------------- | ------------------------------------------------------------------------------ |
| `EMBEDDING_MODEL_MISSING`   | La vía vectorial se degradó; el bundle igual se produce, sólo con vía textual. |
| `VECTOR_SEARCH_UNAVAILABLE` | La vía vectorial falló con error; el bundle se armó sólo con búsqueda textual. |
| `TEXT_SEARCH_UNAVAILABLE`   | La vía textual falló; el bundle se armó sólo con búsqueda semántica.           |
| `VECTORS_STALE`             | La biblioteca tiene contenido pero **ningún vector** para el modelo activo.    |
| `LOW_RELEVANCE`             | Nada de la biblioteca responde de verdad la consulta. Ver abajo.               |

En los tres primeros el bundle sirve, pero se armó con una sola vía. Decilo
si vas a apoyarte en esa evidencia.

**`VECTORS_STALE` merece atención aparte.** Significa que la búsqueda
semántica no participó en absoluto: los resultados salieron sólo de
coincidencia léxica, así que la cobertura es bastante peor de lo normal. Pasa
cuando los vectores no corresponden al modelo activo, típicamente porque la
biblioteca se indexó con otro modelo y todavía no se regeneró.

Se resuelve reindexando:

```text
auto-youtube-rag sync
```

Si `sync` responde `no_changes` y el warning **sigue apareciendo**, los
paquetes no cambiaron y el modelo tampoco, así que la indexación incremental no
tiene nada que recalcular. Ahí hace falta forzar la regeneración completa:

```text
auto-youtube-rag rebuild --confirm
```

Hasta entonces podés usar el bundle, pero **avisá en tu respuesta que la
búsqueda semántica no participó**: puede faltar contenido relevante que la
coincidencia léxica no alcanza a encontrar.

## `LOW_RELEVANCE`

**No es una degradación**: todas las vías funcionaron, el bundle está completo
y bien citado. Lo que dice es que la biblioteca **no tiene contenido sobre el
tema consultado**, y por eso `status` sigue siendo `"ok"` con código de salida
`0`.

Aparece porque la búsqueda vectorial es un ranking exhaustivo sin piso: toda
consulta sobre una biblioteca no vacía devuelve algo, aunque sea el material
menos lejano en vez de una respuesta. El mensaje incluye el puntaje real y el
umbral, por ejemplo `0.8206 against a 0.84 relevance floor`.

Qué hacer cuando aparece:

- **Decilo en tu respuesta.** No presentes ese contenido como si respondiera
  la pregunta; lo más probable es que no tenga relación.
- **Leé igual el bundle antes de descartarlo.** El umbral está calibrado sobre
  una colección concreta y puede equivocarse: si el contenido resulta
  pertinente, usalo y aclará el matiz.
- **No reintentes el mismo comando**: va a dar exactamente lo mismo. Si creés
  que la biblioteca sí cubre el tema, reformulá la consulta con los términos
  que usaría el video.
- **Si esperabas cobertura y no la hay**, puede faltar sincronizar una fuente
  (`sync`) o directamente registrarla (`source add`).

**El número está siempre disponible**, dispare o no el aviso:
`metrics.top_vector_similarity` en `result.json` trae el coseno del mejor
resultado semántico. Úsalo para juzgar por tu cuenta en vez de confiar sólo en
la presencia o ausencia del aviso — el umbral está calibrado sobre una
colección concreta y el margen es fino. Un caso real midió `0.8399` contra un
piso de `0.84`: una diezmilésima más y no habría avisado.

## `sync` falló parcialmente

Un paquete inválido no bloquea el resto de la colección: se aísla como issue
y los demás videos se indexan igual. Revisá `warnings` en el recibo para ver
qué videos quedaron afuera y por qué.

Un `sync` interrumpido, relanzado o cortado a la mitad **no corrompe la
biblioteca**: la siguiente corrida completa reconstruye el estado correcto.
No intentes reparar nada a mano.

## `sync` parece colgado

Antes de asumir que falló, leé la sección de `sync` en `SKILL.md`: la primera
indexación de una colección grande tarda entre 5 y 10 minutos, y eso es
normal.

No uses el conteo de videos de `status` como señal de progreso: mientras un
`sync` está en curso puede subir y bajar. La única señal fiable de que
terminó es el recibo JSON del propio comando.

Un segundo `sync` simultáneo ya no es posible: el producto lo rechaza con
`SYNC_ALREADY_RUNNING`.

## `SYNC_ALREADY_RUNNING`

Hay un run activo para esa fuente. Dos casos:

1. **Un `sync` sigue trabajando de verdad.** Esperá su recibo JSON. No
   fuerces nada.
2. **Un `sync` anterior murió** (Ctrl+C, terminal cerrada, corte) y dejó su
   registro marcado como activo. `doctor` lo reporta como `STALE_SYNC_RUN`
   con su antigüedad. Para destrabarlo:

   ```text
   auto-youtube-rag sync --force
   ```

   Marca el run abandonado como fallido —dejando un issue `RUN_SUPERSEDED`
   como constancia— y arranca uno nuevo.

La antigüedad que informa `doctor` es la señal para distinguir los dos casos:
un run de minutos probablemente siga vivo; uno de horas, no.

`rebuild` emite el mismo código, con una diferencia: abarca **todas** las
fuentes, así que un run activo en cualquiera de ellas lo bloquea, y **no acepta
`--force`**. Destrabá primero con `sync --source <nombre> --force` y después
corré el rebuild.

## `rebuild` terminó en `partial` o `failed`

`partial` significa que alguna fuente se degradó mientras se regeneraba, y las
demás se reconstruyeron bien; `failed`, que ninguna pudo reconstruirse. En los
dos casos el código de salida es `1` y los `issues` del recibo dicen qué video
falló y por qué — se leen igual que los de `sync`.

**La biblioteca no queda corrupta.** Si el proceso se interrumpe a la mitad
(Ctrl+C, corte, terminal cerrada) queda parcialmente reconstruida, que no es un
estado dañado ni requiere reparación manual: volvé a correr
`rebuild --confirm`, que deja siempre el mismo resultado. Mientras tanto
`retrieve` puede devolver menos contexto del esperado.

Lo que `rebuild` **no** arregla: un `sync` que falló por un paquete inválido.
Eso se resuelve leyendo los `issues` del recibo de `sync`, no borrando y
regenerando la biblioteca entera.

## Verificar integridad

`auto-youtube-rag doctor` corre un chequeo de sólo lectura sobre SQLite,
FTS5, el modelo local y el esquema. Es seguro correrlo en cualquier momento
y no modifica nada. Si `doctor` da `ok` pero un resultado te parece raro, el
problema no es de integridad de la base.
