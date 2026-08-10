# Resultado del benchmark de clientes SQLite

Generado: 2026-08-10T00:34:48.348Z

| Cliente | Filas | SQLite | Inserción ms | FTS p50 ms | FTS p95 ms | BLOB stream ms | Backup ms | RSS MB |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| node-sqlite | 1,000 | 3.51.2 | 54.6 | 0.2952 | 0.6042 | 10.2 | 63.31 | 69.5 |
| better-sqlite3 | 1,000 | 3.51.2 | 55.12 | 0.2926 | 0.7034 | 11.05 | 60.05 | 72 |

Ambos clientes ejecutaron el mismo esquema, transacciones, FTS5, BLOBs, reapertura, backup e integrity check.
