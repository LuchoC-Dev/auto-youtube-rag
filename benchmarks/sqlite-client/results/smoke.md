# Resultado del benchmark de clientes SQLite

Generado: 2026-08-10T12:39:58.628Z

| Cliente | Filas | SQLite | Inserción ms | FTS p50 ms | FTS p95 ms | BLOB stream ms | Backup ms | RSS MB |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| node-sqlite | 1,000 | 3.53.3 | 50.39 | 0.2987 | 0.6826 | 8.03 | 39.9 | 59.3 |
| better-sqlite3 | 1,000 | 3.51.2 | 81.8 | 0.2816 | 1.3939 | 8.71 | 37.49 | 62.2 |

Ambos clientes ejecutaron el mismo esquema, transacciones, FTS5, BLOBs, reapertura, backup e integrity check.
