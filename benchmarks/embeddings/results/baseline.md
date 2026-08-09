# Línea base de embeddings

Mediciones realizadas en el equipo objetivo, con Node.js 24.13.1 y cada modelo ejecutado en un proceso nuevo. Los pesos se cargaron exclusivamente desde la caché local.

| Modelo | Dim. | Disco | Hit@1 | Recall@5 | MRR | Consulta media | Indexación | RSS final |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| E5 Small | 384 | 129,1 MB | 100 % | 100 % | 1,000 | 11,5 ms | 40,72 pasajes/s | 570,5 MB |
| MiniLM | 384 | 129,1 MB | 93,75 % | 100 % | 0,953 | 9,7 ms | 52,06 pasajes/s | 564,0 MB |
| E5 Base | 768 | 282,0 MB | 100 % | 100 % | 1,000 | 29,0 ms | 15,04 pasajes/s | 720,4 MB |
| Jina ES | 768 | 156,8 MB | 87,5 % | 100 % | 0,922 | 25,7 ms | 14,13 pasajes/s | 504,8 MB |

## Lectura

E5 Small y E5 Base resolvieron correctamente las 16 consultas en primera posición. E5 Small necesitó menos de la mitad del espacio de E5 Base, respondió aproximadamente 2,5 veces más rápido e indexó cerca de 2,7 veces más pasajes por segundo.

MiniLM fue el más rápido, pero colocó la consulta `q16` en la cuarta posición. Jina ES colocó `q02` en segunda posición y `q16` en cuarta. Los cuatro modelos conservaron el resultado esperado dentro de los primeros cinco.

La recomendación provisional es `e5-small`. Esta línea base usa 18 pasajes y 16 consultas curadas; no constituye una selección definitiva hasta repetir la evaluación sobre una muestra representativa del corpus completo.
