# Línea base de búsqueda vectorial

Equipo objetivo: Windows x64, Node.js 24.13.1, Intel i7-4790S y 7,9 GB de RAM.
Cada backend se midió en un proceso nuevo con vectores normalizados `float32[384]`,
50 consultas por escala y `top-k = 20`.

| Backend | Vectores | p50 | p95 | Consultas/s | Disco | RSS cargado |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Memoria | 10.000 | 5,70 ms | 10,12 ms | 159,29 | 19,6 MB | 88,5 MB |
| sqlite-vec | 10.000 | 30,87 ms | 34,85 ms | 31,65 | 15,3 MB | 81,0 MB |
| Memoria | 50.000 | 31,71 ms | 45,35 ms | 29,74 | 97,9 MB | 148,9 MB |
| sqlite-vec | 50.000 | 156,60 ms | 193,11 ms | 6,19 | 74,7 MB | 82,0 MB |

Los conjuntos `top-k` coincidieron al 100 %. Ambos backends superaron inserción,
actualización, eliminación y reapertura. `sqlite-vec` redujo memoria y disco,
pero la búsqueda exacta en memoria fue aproximadamente cinco veces más rápida.

Recomendación provisional: adaptador exacto en memoria para el MVP. La decisión
permanece pendiente de aprobación del usuario.
