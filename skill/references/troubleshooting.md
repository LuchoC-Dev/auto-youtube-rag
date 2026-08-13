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

- `"ok"`: hay bundle con evidencia. Un `status: "ok"` con relevancia baja es
  un resultado válido y esperado, no un error — la búsqueda semántica no
  tiene piso de similitud, así que consultas poco relacionadas con la
  colección igual devuelven candidatos. Leé `Coverage and limitations` en
  `context.md` antes de confiar ciegamente en la relevancia.
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

Dos códigos se refieren al modelo de embeddings y **no son sinónimos**:

| Código                    | Dónde aparece                   | Qué significa                                                                  |
| ------------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| `MODEL_LOAD_FAILED`       | Issues de `sync`, uno por video | El modelo no está en la ruta de caché que la herramienta consultó.             |
| `EMBEDDING_MODEL_MISSING` | `warnings` de `retrieve`        | La vía vectorial se degradó; el bundle igual se produce, sólo con vía textual. |

Ante `MODEL_LOAD_FAILED` no reintentes `sync` sin cambiar nada: es
configuración, no un fallo transitorio. Leé `setup.md`.

Ante `EMBEDDING_MODEL_MISSING` el bundle sirve, pero se armó sólo con
búsqueda textual. Decilo si vas a apoyarte en esa evidencia.

## `sync` falló parcialmente

Un paquete inválido no bloquea el resto de la colección: se aísla como issue
y los demás videos se indexan igual. Revisá `warnings` en el recibo para ver
qué videos quedaron afuera y por qué.

Un `sync` interrumpido, relanzado o cortado a la mitad **no corrompe la
biblioteca**: la siguiente corrida completa reconstruye el estado correcto.
No intentes reparar nada a mano.

## `sync` parece colgado

Antes de asumir que falló, leé la sección de `sync` en `SKILL.md`: la primera
indexación de una colección grande tarda entre 10 y 15 minutos, y eso es
normal.

Dos cosas que **no** debés hacer mientras haya un `sync` corriendo:

- lanzar un segundo `sync` — no hay ningún bloqueo que te lo impida, y dos
  procesos sobre la misma base producen conteos inconsistentes;
- usar el conteo de videos de `status` como señal de progreso — mientras un
  `sync` está en curso puede subir y bajar.

La única señal fiable de que terminó es el recibo JSON del propio comando.

## Verificar integridad

`auto-youtube-rag doctor` corre un chequeo de sólo lectura sobre SQLite,
FTS5, el modelo local y el esquema. Es seguro correrlo en cualquier momento
y no modifica nada. Si `doctor` da `ok` pero un resultado te parece raro, el
problema no es de integridad de la base.
