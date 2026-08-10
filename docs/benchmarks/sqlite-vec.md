# Benchmark de sqlite-vec

## Objetivo

Determinar si `sqlite-vec` es compatible y suficientemente estable para ser el
primer adaptador de `VectorSearchIndex` del MVP, comparándolo con una búsqueda
exacta implementada en memoria por la aplicación.

## Entorno

- Windows x64.
- Node.js 24.13.1 o superior dentro de la línea 24.
- `node:sqlite` como cliente de base de datos.
- `sqlite-vec` 0.1.9.
- Vectores `float32` de 384 dimensiones, iguales a la salida de E5 Small.

## Comandos

```text
npm install
npm run typecheck
npm run benchmark:vector -- --sizes=10000,50000 --queries=50 --k=20
npm run benchmark:vector:smoke
```

## Estructura

```text
benchmarks/vector-search/run.ts       harness comparativo
benchmarks/vector-search/results/     ejecuciones generadas y baseline revisada
docs/benchmarks/sqlite-vec.md         protocolo, resultados y decisión
```

## Protocolo

1. Generar vectores normalizados y consultas mediante un PRNG con semilla fija.
2. Insertar el mismo conjunto en una tabla SQLite ordinaria y en una tabla
   virtual `vec0`.
3. Construir el adaptador en memoria desde los BLOB persistidos, para incluir
   su costo real de carga.
4. Ejecutar búsquedas L2 exactas sobre vectores normalizados, equivalentes en
   ranking a distancia coseno, y comparar IDs.
5. Medir inserción, carga, latencias p50/p95, throughput, RSS y bytes en disco.
6. Cerrar y reabrir la base para verificar persistencia.
7. Actualizar y eliminar filas, y comprobar que no aparezcan resultados
   obsoletos.

Las escalas principales son 10.000 y 50.000 vectores. El modo smoke utiliza un
dataset pequeño y valida únicamente compatibilidad y operaciones básicas.

## Estilo

El harness usa TypeScript estricto, datos deterministas y resultados JSON
versionados. Los adaptadores comparten tipos de entrada y salida; ninguna
medición modifica paquetes de video ni el dominio del producto.

## Verificación

- `sqlite-vec` carga desde una instalación npm limpia en Windows.
- La extensión informa su versión y acepta vectores de 384 dimensiones.
- Inserción, consulta, actualización, eliminación y reapertura funcionan.
- Los primeros `k` IDs coinciden con la referencia exacta dentro de la
  tolerancia documentada.
- Una falla genera un proceso distinto de cero y queda registrada en JSON.

## Límites

### Siempre

- Ejecutar ambos backends con los mismos datos y consultas.
- Separar tiempo de generación de datos de las métricas de búsqueda.
- Conservar una línea base revisada y excluir ejecuciones temporales de Git.

### Preguntar antes

- Cambiar dimensiones, métrica o escalas de aceptación.
- Adoptar `sqlite-vec` como decisión final del producto.

### Nunca

- Interpretar un dataset sintético como evaluación de calidad semántica.
- Usar índices aproximados experimentales como fundamento de la decisión.
- Ocultar fallos de instalación u operaciones no soportadas.

## Criterio de decisión

`sqlite-vec` será recomendable si supera todas las operaciones, mantiene
resultados exactos, reduce memoria o latencia de forma útil en 50.000 vectores y
no introduce un problema de instalación reproducible. El benchmark informa la
recomendación; la adopción requiere aprobación del usuario.

## Resultados

La ejecución revisada se realizó con 50 consultas por escala y `top-k = 20`.
Ambos backends devolvieron los mismos conjuntos `top-k`, acertaron el resultado
esperado en primera posición y superaron actualización, eliminación y reapertura.

| Backend | Vectores | Inserción | p50 | p95 | Consultas/s | Disco | RSS cargado |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Memoria | 10.000 | 552,62 ms | 5,70 ms | 10,12 ms | 159,29 | 19,6 MB | 88,5 MB |
| sqlite-vec | 10.000 | 617,62 ms | 30,87 ms | 34,85 ms | 31,65 | 15,3 MB | 81,0 MB |
| Memoria | 50.000 | 2.352,90 ms | 31,71 ms | 45,35 ms | 29,74 | 97,9 MB | 148,9 MB |
| sqlite-vec | 50.000 | 2.581,07 ms | 156,60 ms | 193,11 ms | 6,19 | 74,7 MB | 82,0 MB |

El adaptador en memoria fue aproximadamente cinco veces más rápido. En 10.000
vectores, `sqlite-vec` ahorró 7,5 MB de RSS y 4,3 MB de disco; en 50.000 ahorró
66,9 MB de RSS y 23,2 MB de disco. También evitó la carga inicial del índice,
que tomó 95,75 ms y 519,15 ms respectivamente en memoria.

## Hallazgos de compatibilidad

- El paquete npm instaló el binario Windows x64 sin compilación manual.
- `node:sqlite` cargó `sqlite-vec` 0.1.9 y aceptó vectores `float32[384]`.
- Las claves primarias y el parámetro `k` deben enlazarse como `BigInt` para que
  `vec0` los reciba como enteros estrictos.
- Node.js 24.13.1 todavía marca `node:sqlite` como experimental.
- `sqlite-vec` continúa siendo pre-v1 y puede introducir cambios incompatibles.

## Recomendación del benchmark

`sqlite-vec` es técnicamente viable, exacto y operativo en el equipo objetivo,
pero no ofrece el mejor equilibrio para el volumen inicial. La recomendación
provisional es comenzar con el adaptador exacto en memoria, persistiendo los
vectores como BLOB en SQLite. En 10.000 vectores su costo adicional de memoria es
pequeño y su latencia es mucho menor. Incluso en 50.000, los 66,9 MB ahorrados
por `sqlite-vec` representan menos del 1 % de la RAM total del equipo.

`sqlite-vec` queda como adaptador alternativo cuando la memoria o el tiempo de
carga sean más importantes que la latencia, o cuando sus índices aproximados
maduren. Esta recomendación no constituye todavía la decisión arquitectónica;
la adopción final corresponde al usuario.
