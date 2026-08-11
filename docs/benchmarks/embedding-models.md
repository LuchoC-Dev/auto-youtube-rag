# Benchmark de modelos de embeddings

## Objetivo

Comparar modelos locales multilingües compatibles con Transformers.js antes de
seleccionar el backend semántico del MVP. El benchmark no evalúa la calidad del
RAG completo; aísla la recuperación densa sobre un fixture pequeño y trazable.

## Modelos

| ID | Repositorio | Dimensión esperada | Configuración |
| --- | --- | ---: | --- |
| `e5-small` | `Xenova/multilingual-e5-small` | 384 | `q8`, prefijos E5 |
| `minilm` | `Xenova/paraphrase-multilingual-MiniLM-L12-v2` | 384 | `q8` |
| `e5-base` | `Xenova/multilingual-e5-base` | 768 | `q8`, prefijos E5 |
| `jina-es` | `jinaai/jina-embeddings-v2-base-es` | 768 | ONNX cuantizado explícito |

## Fixture

El fixture contiene fragmentos derivados de paquetes reales y validados de
`auto-design`. Las consultas mezclan español e inglés para medir recuperación
monolingüe y cruzada. Cada consulta declara uno o más IDs relevantes.

El fixture es deliberadamente pequeño. Sirve para detectar incompatibilidad,
regresiones obvias y diferencias iniciales; no reemplaza las evaluaciones del
MVP sobre todo el corpus.

## Métricas

- `hit_at_1`: proporción de consultas cuyo primer resultado es relevante.
- `recall_at_5`: proporción con al menos un relevante entre los cinco primeros.
- `mrr`: media del recíproco del rango del primer relevante.
- tiempo de carga del modelo;
- tiempo y rendimiento de indexación del fixture;
- latencia media de consultas;
- RSS observado después de cargar y ejecutar;
- bytes presentes en la caché del modelo.

## Procedimiento

```text
npm install
npm run typecheck
npm run models:download:benchmarks
npm run benchmark:embeddings
```

La descarga usa `.cache/models`, ignorada por Git. La medición final se ejecuta
con `local_files_only` para no mezclar tiempo de red con inferencia. Los modelos
se procesan secuencialmente para reducir la presión de memoria.

La comparación de memoria se repite con un proceso Node fresco por modelo para
evitar que las reservas nativas de ONNX contaminen la medición siguiente.

La línea base revisada se conserva en
`benchmarks/embeddings/results/baseline.md` y `baseline.json`.

## Criterio de decisión

Se prefiere el modelo más pequeño que mantenga buena recuperación en español,
inglés y consultas cruzadas. Una mejora marginal de calidad no justifica
duplicar memoria o latencia en el hardware objetivo. El ganador deberá volver a
evaluarse sobre consultas reales al completar el MVP.
