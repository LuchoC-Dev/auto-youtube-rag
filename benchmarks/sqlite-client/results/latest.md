# Resultado del benchmark de clientes SQLite

Generado: 2026-08-10T00:35:44.645Z

| Cliente | Filas | SQLite | Inserción ms | FTS p50 ms | FTS p95 ms | BLOB stream ms | Backup ms | RSS MB |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| node-sqlite | 10,000 | 3.51.2 | 9052.74 | 2.0086 | 3.808 | 140.39 | 548.09 | 74.2 |
| better-sqlite3 | 10,000 | 3.51.2 | 1386.31 | 2.8938 | 5.4999 | 108.45 | 545.14 | 89.8 |
| node-sqlite | 50,000 | 3.51.2 | 7353.82 | 9.5207 | 11.8866 | 420.07 | 5216.01 | 75.5 |
| better-sqlite3 | 50,000 | 3.51.2 | 9984.7 | 10.0378 | 12.9912 | 391.29 | 2926.46 | 93.9 |

Ambos clientes ejecutaron el mismo esquema, transacciones, FTS5, BLOBs, reapertura, backup e integrity check.
