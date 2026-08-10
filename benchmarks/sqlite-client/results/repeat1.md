# Resultado del benchmark de clientes SQLite

Generado: 2026-08-10T00:37:04.775Z

| Cliente | Filas | SQLite | Inserción ms | FTS p50 ms | FTS p95 ms | BLOB stream ms | Backup ms | RSS MB |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| node-sqlite | 10,000 | 3.51.2 | 2812.64 | 2.1479 | 2.9668 | 85.79 | 5358.38 | 81 |
| better-sqlite3 | 10,000 | 3.51.2 | 1319.69 | 1.8885 | 2.5818 | 90.22 | 464.27 | 89.3 |
| node-sqlite | 50,000 | 3.51.2 | 7950.73 | 9.0014 | 10.9429 | 398.87 | 2414.18 | 76.6 |
| better-sqlite3 | 50,000 | 3.51.2 | 23341.15 | 11.3503 | 18.3405 | 460.06 | 2845.83 | 95 |

Ambos clientes ejecutaron el mismo esquema, transacciones, FTS5, BLOBs, reapertura, backup e integrity check.
