# Benchmark de clientes SQLite

## Objetivo

Elegir el cliente SQLite del MVP entre `node:sqlite` y `better-sqlite3` sin
cambiar SQLite, FTS5 ni los límites de arquitectura ya aprobados.

## Criterios

La decisión pondera, en este orden: estabilidad de API para Node 24,
instalación reproducible en Windows x64, corrección, mantenimiento y
distribución, y finalmente rendimiento. Una diferencia menor de velocidad no
compensa un riesgo operativo mayor.

## Protocolo

Ambos clientes ejecutan, en procesos separados, el mismo trabajo determinista:

1. Crear una tabla de fragmentos y un índice FTS5 sincronizado por triggers.
2. Insertar 10.000 y 50.000 filas dentro de una transacción inmediata.
3. Persistir un BLOB `float32[384]` por fila.
4. Actualizar y eliminar contenido, cerrar y reabrir la base.
5. Ejecutar 100 consultas FTS5 y comparar sus IDs ordenados.
6. Recorrer todos los BLOB mediante iteradores y comparar bytes leídos.
7. Crear un backup y ejecutar `PRAGMA integrity_check`.
8. Registrar versiones, latencias, throughput, RSS y tamaño en disco.

## Comandos

```text
npm run benchmark:sqlite-client:smoke
npm run benchmark:sqlite-client
npm run typecheck
```

## Aceptación

- Ambos clientes deben instalar y cargar sin compilación manual en el equipo objetivo.
- FTS5, transacciones, BLOB, iteradores, reapertura y backup deben funcionar.
- Los resultados FTS5 y los bytes leídos deben coincidir.
- Toda base y su backup deben superar `integrity_check`.
- El benchmark informa una recomendación; adoptar un cliente requiere aprobación del usuario.

## Límites

Los datos son sintéticos y sirven para comparar adaptadores, no para medir la
calidad semántica del RAG. Las bases generadas permanecen en `.cache` y no se
versionan.

## Resultados

Entorno: Windows x64, Node.js 24.13.1, SQLite 3.51.2, 8 GB de RAM. Ambos
clientes produjeron exactamente los mismos resultados FTS5 y bytes de BLOB,
superaron actualización, eliminación, reapertura, backup e `integrity_check`.

| Corrida | Cliente | Filas | Inserción | FTS p50 | FTS p95 | BLOB stream | Backup | RSS final |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Inicial | node:sqlite | 10.000 | 9.052,74 ms | 2,0086 ms | 3,8080 ms | 140,39 ms | 548,09 ms | 74,2 MB |
| Inicial | better-sqlite3 | 10.000 | 1.386,31 ms | 2,8938 ms | 5,4999 ms | 108,45 ms | 545,14 ms | 89,8 MB |
| Inicial | node:sqlite | 50.000 | 7.353,82 ms | 9,5207 ms | 11,8866 ms | 420,07 ms | 5.216,01 ms | 75,5 MB |
| Inicial | better-sqlite3 | 50.000 | 9.984,70 ms | 10,0378 ms | 12,9912 ms | 391,29 ms | 2.926,46 ms | 93,9 MB |
| Repetición | node:sqlite | 10.000 | 2.812,64 ms | 2,1479 ms | 2,9668 ms | 85,79 ms | 5.358,38 ms | 81,0 MB |
| Repetición | better-sqlite3 | 10.000 | 1.319,69 ms | 1,8885 ms | 2,5818 ms | 90,22 ms | 464,27 ms | 89,3 MB |
| Repetición | node:sqlite | 50.000 | 7.950,73 ms | 9,0014 ms | 10,9429 ms | 398,87 ms | 2.414,18 ms | 76,6 MB |
| Repetición | better-sqlite3 | 50.000 | 23.341,15 ms | 11,3503 ms | 18,3405 ms | 460,06 ms | 2.845,83 ms | 95,0 MB |

La inserción y el backup variaron demasiado entre corridas para fundamentar la
decisión, probablemente por caché y actividad de disco. FTS5 y lectura de BLOB
fueron comparables; a 50.000 filas `node:sqlite` obtuvo menor latencia FTS5 en
ambas corridas. También usó entre 8,3 y 18,4 MB menos de RSS final.

## Hallazgos de instalación y estabilidad

- `node:sqlite` funcionó sin paquetes ni bindings adicionales, aunque Node
  24.13.1 todavía emite una advertencia experimental.
- La documentación de Node 24.15.0 y posteriores clasifica la API como release
  candidate. El proyecto fue actualizado y validado con Node 24.19.0 LTS.
- `better-sqlite3` 12.6.2 declara soporte para Node 24 y su prebuild Windows x64
  funcionó, pero la configuración local `ignore-scripts=true` impidió que se
  instalara automáticamente. Fue necesario ejecutar
  `npm rebuild better-sqlite3 --ignore-scripts=false`.
- `better-sqlite3` añadió 37 paquetes y un binding nativo. El audit no atribuyó
  vulnerabilidades nuevas a esos paquetes; las cuatro alertas existentes
  provienen de la dependencia de embeddings.

## Decisión confirmada

El usuario aprobó `node:sqlite` como adaptador inicial y Node 24.19.0 LTS como
runtime de desarrollo. Entrega todas las capacidades requeridas, evita una
dependencia nativa y funciona con instalaciones que deshabilitan scripts. El benchmark no
muestra una ventaja consistente de `better-sqlite3` que compense ese costo de
distribución. La elección no cambia el dominio: el acceso seguirá detrás de
`KnowledgeRepository` y `TextSearchIndex`.

Una ejecución smoke posterior a la actualización validó ambos clientes con
Node 24.19.0. `node:sqlite` utilizó SQLite 3.53.3 y no emitió la advertencia
experimental observada con Node 24.13.1.
