# Relevo detallado para continuar `auto-youtube-rag`

## Propósito de este documento

Este documento permite que un agente nuevo retome el proyecto sin depender de
la conversación que lo originó. Describe el objetivo del producto, el estado
exacto del repositorio, las decisiones confirmadas, la arquitectura ya
implementada, las invariantes que no deben romperse, las validaciones realizadas
y el siguiente bloque recomendado.

Estado de referencia: **11 de agosto de 2026**, después de completar el punto
2.1 — indexación incremental.

## Datos rápidos

| Dato                      | Valor                                                                    |
| ------------------------- | ------------------------------------------------------------------------ |
| Proyecto                  | `auto-youtube-rag`                                                       |
| Repositorio               | `C:\Users\lucho\Desktop\Programacion\fast-weekend-core\auto-youtube-rag` |
| Rama actual               | `feat/sqlite-vec-benchmark`                                              |
| Último commit documentado | `ed89878 docs(progress): complete synchronization phase`                 |
| Estado Git al cerrar      | Worktree limpio                                                          |
| Runtime                   | Node.js 24.19.0 LTS, ESM                                                 |
| Lenguaje                  | TypeScript 6.0.3 estricto                                                |
| Persistencia              | SQLite mediante `node:sqlite`                                            |
| Modelo                    | `Xenova/multilingual-e5-small`, revisión `main`, cuantización `q8`       |
| Dimensión                 | 384                                                                      |
| Caché aproximada          | 129 MB en `.cache/models`                                                |
| Operación                 | Exclusivamente local; sin APIs externas                                  |
| Próximo punto             | 2.2 — recuperación híbrida                                               |

La rama conserva el nombre de un benchmark anterior. No asumas que el proyecto
está trabajando actualmente en `sqlite-vec`: esa opción fue evaluada y
descartada para el MVP. No renombres la rama ni reescribas historial sin
autorización explícita.

## Orden de lectura recomendado

Antes de modificar código, leer en este orden:

1. `docs/product-spec.md`: objetivo, alcance, límites y producto completo.
2. `docs/decisions.md`: decisiones confirmadas y alternativas descartadas.
3. `docs/cli-contract.md`: contrato público aprobado, incluso comandos futuros.
4. `docs/build.md`: tracker de etapas y porcentaje real.
5. `docs/indexing-design.md`: modelo lógico y arquitectura del punto 2.1.
6. `docs/indexing-plan.md`: estrategia por bloques A–E.
7. `docs/indexing-tasks.md`: checklist fino ya completado para 2.1.
8. Este documento: estado operativo, gotchas y arranque de 2.2.

`docs/development.md` sigue siendo la referencia del toolchain. Su frase que
describe `src/main.ts` como un scaffold quedó históricamente desactualizada: la
CLI administrativa ya está implementada y probada.

## Objetivo del producto

El sistema construye una biblioteca local consultable a partir de los paquetes
autónomos generados por la skill de contexto de videos. No intenta responder con
un LLM interno. El agente que consulta —Codex, Claude u otro— es el único cerebro
generativo.

El producto debe recuperar contexto amplio, ordenado, citado y con procedencia.
No está diseñado sólo para encontrar una coincidencia puntual. Por ejemplo, una
consulta sobre un estilo de diseño debe entregar suficiente contexto relacionado
para que el agente pueda razonar correctamente sobre hechos, reglas, patrones,
limitaciones y evidencia.

El MVP es para agentes, no para búsqueda humana. La integración aprobada es una
CLI consumida por una única skill portable. MCP, API, interfaz web y soporte de
paquetes de páginas web quedan para fases posteriores.

## Alcance de las fuentes

Cada raíz registrada sigue la estructura producida por la skill de videos:

```text
collection/
  manifest.json
  videos/
    <slug>/
      deliverables/context.md
      deliverables/rules.json
      source/metadata.json
      ...otros archivos no indexados por el MVP
```

Se indexan:

- `manifest.json` como inventario autoritativo;
- `context.md` como conocimiento narrativo principal;
- `rules.json` como conocimiento estructurado de patrones;
- una allowlist estable de `metadata.json` para filtros y procedencia.

No se indexan como conocimiento:

- transcripciones redundantes;
- subtítulos equivalentes en varios formatos;
- imágenes o frames por nombre de archivo;
- páginas web del manifest;
- metadata volátil completa de yt-dlp;
- videos fuente.

Las rutas de evidencia visual y timestamps existentes sí se preservan dentro de
las unidades para futuras citas o inspección.

## Decisiones confirmadas que no deben reabrirse sin motivo

- Ejecución local exclusiva.
- TypeScript sobre Node 24.19.0; no Go ni Rust para este MVP.
- SQLite, no PostgreSQL.
- `node:sqlite` como cliente; `better-sqlite3` sólo permanece por benchmarks
  históricos.
- FTS5 para recuperación textual.
- E5 Small multilingüe `q8` para documentos y consultas.
- Vectores persistidos como BLOB `Float32Array` little-endian y búsqueda exacta
  en memoria durante el MVP.
- `sqlite-vec` no se integra inicialmente: el benchmark no justificó asumir su
  inestabilidad y complejidad operativa en este punto.
- Dominio y aplicación no conocen SQLite, Transformers.js ni formatos de
  archivo.
- Una sola skill general para Codex, Claude y futuros agentes.
- CLI con `node:util.parseArgs` estricto, sin framework adicional.
- Códigos de proceso públicos: `0`, `1`, `2`, `130`.
- Claves técnicas y códigos simbólicos en inglés; contenido en su idioma
  original.
- Los paquetes fuente son inmutables.
- Las evaluaciones de recuperación se preparan antes de cerrar el MVP.

El único asunto de producto todavía abierto en `product-spec.md` es la política
de combinación y reranking de resultados.

## Estado completado

### Definición y stack

- Repositorio, especificaciones y tracker creados.
- Contrato CLI y esquemas de salida aprobados.
- Benchmarks de modelos realizados; E5 Small seleccionado.
- Benchmark de `sqlite-vec` frente a búsqueda exacta realizado; exacta elegida.
- Benchmark de clientes SQLite realizado; `node:sqlite` elegido.
- Toolchain fijado y reproducible.

### Punto 2.1 — indexación incremental

Los bloques A–E están completados:

- A: identidades, entidades, contenido, runs, issues, puertos y cambios
  atómicos.
- B: layout, manifest, Markdown, reglas, metadata, lector de paquetes, unidades
  y fragmentación.
- C: adaptador local E5 y smoke offline.
- D: esquema SQLite, registro de fuentes, estado, runs, issues, reemplazo
  transaccional, FTS5 y embeddings.
- E: casos de uso de fuentes, orquestador `sync`, composition root, CLI,
  `status`, `doctor` y E2E.

`docs/build.md` marca 2.1 y las pruebas funcionales actuales al 100%.

## Arquitectura implementada

### Dominio — `src/domain/indexing`

No importa infraestructura. Contiene:

- identificadores: `SourceName`, `VideoId`, `PackageRef`, `DocumentId`,
  `KnowledgeUnitId`, `SearchFragmentId`, `SyncId`;
- entidades: `SourceRoot`, `VideoPackage`, `SourceDocument`, `KnowledgeUnit`,
  `SearchFragment`, `EmbeddingRecord`, `SyncRun`, `SyncIssue`;
- hashes y claves estructurales deterministas;
- validación estricta y errores de dominio.

Identidad importante: un paquete es `(source_name, video_id)`. El slug sólo
localiza el directorio y puede cambiar.

### Aplicación — `src/application`

Puertos actuales:

- `PackageSourceReader`;
- `SourceRegistry`;
- `IndexStore`;
- `EmbeddingGenerator`;
- `VectorIndexSink`.

Casos de uso principales:

- `addSource`, `listSources`, `removeSource`;
- `buildKnowledgeUnits`;
- `fragmentKnowledgeUnits`;
- `syncSource`;
- `getStatus`;
- `runDoctor`.

El orquestador sólo conoce puertos. Tests de aplicación usan fakes y no cargan
SQLite ni el modelo real.

### Infraestructura — `src/infrastructure`

Filesystem:

- resolución canónica de colección o carpeta `videos/`;
- parsing del manifest;
- parsing de `context.md` y `rules.json`;
- selección de metadata estable;
- lectura completa de paquetes sin escrituras.

Embeddings:

- `E5EmbeddingGenerator` carga perezosamente;
- prefijos E5: `passage:` y `query:`;
- límite declarado: 512 tokens;
- lotes configurables;
- vectores normalizados y validados;
- runtime forzado a local mediante `env.allowRemoteModels = false` y
  `env.cacheDir` antes de crear el pipeline.

SQLite:

- apertura con WAL y foreign keys;
- migración inicial versionada;
- registro de fuentes;
- estado de paquetes y runs;
- aplicación transaccional completa;
- triggers de sincronización FTS5;
- diagnósticos read-only.

### Interfaz — `src/interfaces/cli`

- `parse-command.ts`: argumentos estrictos con `parseArgs`.
- `render-cli-output.ts`: JSON compacto versionado.
- `run-cli.ts`: ejecución de casos de uso y códigos de salida.
- `src/main.ts`: entry point ESM y configuración por entorno.

### Composition root — `src/main/create-application.ts`

Conecta adaptadores concretos y permite reemplazarlos mediante overrides. Crear
la aplicación no descarga modelos ni sincroniza. El modelo se carga sólo al
contar tokens o generar embeddings.

El `MemoryVectorIndexSink` actual recibe cambios confirmados, pero no es todavía
el motor de consulta de 2.2. No confundir publicación de cambios con búsqueda
vectorial implementada.

## Flujo exacto de `sync`

1. Crea y persiste un `SyncRun` en estado `running`.
2. Lee y valida el manifest completo.
3. Si el manifest falla, registra issue, cierra `failed` y no elimina paquetes.
4. Obtiene descriptor de modelo y referencias persistidas.
5. Por cada video, lee el paquete y calcula hash sobre documentos/versiones.
6. Si no cambió, ejecuta `markPackageSeen` con el run actual; no recalcula
   unidades ni embeddings.
7. Si cambió, construye unidades, fragmenta bajo el tokenizador real, genera
   embeddings y prepara el cambio completo.
8. `applyPackage` reemplaza paquete y derivados en una única transacción.
9. Sólo después del commit publica el cambio al sink vectorial.
10. Un fallo aislado registra issue; si existía una versión válida, la marca
    vista para conservarla.
11. Después de un manifest válido elimina paquetes no vistos.
12. Publica removals vectoriales y cierra el run como `ok` o `partial`.
13. Si no hubo indexaciones ni borrados devuelve `no_changes`.

## Esquema SQLite actual

Versión: `1`.

Tablas principales:

- `schema_meta`;
- `sources`;
- `sync_runs`;
- `video_packages`;
- `source_documents`;
- `knowledge_units`;
- `search_fragments`;
- `embeddings`;
- `sync_issues`.

Tabla virtual: `fragment_fts`, external-content sobre `search_fragments`.

Triggers: insert, update y delete mantienen FTS5 alineado. Las eliminaciones de
paquetes usan cascadas y `last_seen_sync_id`. Los embeddings incluyen modelo,
versión, dimensión, hash y BLOB.

## CLI implementada y CLI futura

Implementado actualmente:

```text
auto-youtube-rag init
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>]
auto-youtube-rag status
auto-youtube-rag doctor
```

Todavía no implementado, aunque el contrato público ya está aprobado:

```text
auto-youtube-rag retrieve <query> [options]
auto-youtube-rag rebuild --confirm
```

No anuncies `retrieve` como disponible hasta completar 2.2 y 2.3.

## Configuración de ejecución

Por defecto:

- base: `<cwd>/.auto-youtube-rag/index.sqlite`;
- modelo: `<cwd>/.cache/models`.

Variables admitidas:

```text
AUTO_YOUTUBE_RAG_HOME
AUTO_YOUTUBE_RAG_MODEL_CACHE
```

El modelo esperado existe bajo:

```text
.cache/models/Xenova/multilingual-e5-small/
  config.json
  tokenizer.json
  tokenizer_config.json
  onnx/model_quantized.onnx
```

Si falta, ejecutar `npm run models:download`. El producto no debe descargar
durante `sync`, `doctor` ni tests normales.

## Comandos de desarrollo y calidad

```powershell
cd C:\Users\lucho\Desktop\Programacion\fast-weekend-core\auto-youtube-rag
node --version
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run format:check
npm.cmd run check
npm.cmd run build
npm.cmd run test:coverage
npm.cmd run test:embedding:smoke
```

En PowerShell puede ser necesario usar `npm.cmd` porque la política de ejecución
puede bloquear `npm.ps1`.

`npm run check` omite la inferencia real mediante el patrón `smoke`. El smoke de
E5 se ejecuta explícitamente y nunca debe depender de red.

## Última validación conocida

Puerta final de 2.1:

- 91 tests aprobados;
- cobertura: 93,90% líneas, 81,73% ramas, 98,17% funciones;
- `npm run build`: aprobado;
- `npm run check`: aprobado;
- `npm run test:embedding:smoke`: aprobado con E5 local;
- worktree limpio.

Validación sobre una copia temporal de los recursos indexables de la colección
real `auto-design`:

- 34 videos observados;
- 34 paquetes persistidos;
- 102 documentos;
- 2.965 unidades de conocimiento;
- 2.967 fragmentos y embeddings con el tokenizador real;
- segundo `sync`: 34 unchanged, 0 indexed, estado `no_changes`;
- `doctor`: integridad, foreign keys, FTS5, fuente y modelo en `ok`;
- digest SHA-256 del árbol fuente idéntico antes y después.

La copia y su base temporal fueron eliminadas tras validar.

## Bugs importantes ya corregidos

### Paquetes sin cambios eliminados accidentalmente

Un paquete unchanged debe actualizar `last_seen_sync_id`. Para eso existen
`listPackageRefs` y `markPackageSeen`. No elimines esta operación ni vuelvas a
derivar “visto” sólo desde reemplazos.

### Preflight de Transformers.js intentaba red

En Transformers.js 4.2, `pipeline()` realiza inspecciones antes de propagar
`local_files_only`. El adaptador configura el entorno global local antes de
crear el pipeline. Mantener esta secuencia o el smoke puede intentar Hugging
Face y producir tokenizer nulo.

### Slugs Unicode inconsistentes

Manifest y dominio deben aceptar la misma forma canónica Unicode. El paquete
real `7-estilos-de-diseño-gráfico-que-no-conocías` es la regresión. No volver a
un patrón ASCII.

## Invariantes y límites obligatorios

- Nunca escribir, mover ni eliminar archivos de las fuentes registradas.
- Nunca interpretar un manifest ilegible como eliminación masiva.
- Nunca publicar cambios vectoriales antes del commit SQLite.
- Nunca perder la última versión válida por un fallo parcial.
- Nunca acoplar dominio o aplicación a SQLite, Transformers.js o Node paths.
- Nunca persistir `.env`, cookies, headers, URLs temporales ni metadata cruda.
- Nunca descargar el modelo implícitamente durante tests o uso normal.
- Nunca cambiar esquema, modelo/dimensión o dependencia nativa sin aprobación.
- Mantener commits convencionales pequeños mediante la skill `git-commit`.
- Antes de cada commit ejecutar al menos el test específico, `npm run check` y
  `npm run build` según el riesgo.
- Preservar stdout JSON y stderr para progreso.

## Próximo trabajo: punto 2.2 — recuperación híbrida

No existe todavía un checklist fino aprobado equivalente a
`indexing-tasks.md` para 2.2. Antes de implementar, crear y revisar una spec,
diseño y tareas. El orden recomendado es:

### 1. Congelar contratos de recuperación

Definir tipos y puertos propios para:

- consulta normalizada;
- filtros por fuente, video, idioma y metadata estable;
- hit textual y hit vectorial;
- score original y score fusionado;
- procedencia hasta fragmento/unidad/documento/paquete;
- límites de candidatos;
- resultado vacío y warnings.

No exponer filas SQLite ni objetos de Transformers.js.

### 2. Implementar búsqueda textual FTS5

- Adaptador detrás de `TextSearchIndex`.
- Sanitizar la consulta para la gramática `MATCH`; no tratarla como `LIKE`.
- Recuperar `fragment_id`, score y procedencia suficiente.
- Aplicar filtros sin romper índices.
- Probar Unicode, diacríticos, términos vacíos, caracteres especiales y
  consultas sin resultados.

### 3. Implementar búsqueda vectorial exacta

- Generar `embedQuery` con prefijo E5 correcto.
- Cargar embeddings BLOB del modelo activo.
- Validar modelo, versión y 384 dimensiones.
- Calcular similitud coseno o dot product sobre vectores normalizados.
- Mantener una abstracción reemplazable para que sqlite-vec pueda incorporarse
  en el futuro sin cambiar aplicación.
- Definir estrategia de recarga al abrir la aplicación y tras `sync`.

### 4. Diseñar fusión y diversidad

La política sigue abierta. Evaluar como baseline RRF porque combina rankings sin
comparar escalas incompatibles. Después incorporar:

- deduplicación por fragmento y unidad;
- límite por video/fuente;
- diversidad temática;
- preservación de hits fuertes de reglas y contexto;
- candidatos suficientes para no depender sólo del top mínimo.

No fijar pesos finales sin evaluaciones reales.

### 5. Filtros y repositorio de conocimiento

Implementar lectura de unidades y ancestros para que 2.3 pueda expandir un hit
pequeño a contexto amplio. Evitar ensamblar todavía `context.md` dentro de 2.2:
separar recuperación de candidatos y ensamblado presupuestado.

### 6. Pruebas y evaluación inicial

Crear fixtures pequeños con resultados esperados y un conjunto inicial de
consultas reales de diseño en español e inglés. Medir al menos:

- recall de candidatos relevantes;
- posición del primer resultado relevante;
- cobertura de unidades/videos;
- duplicación;
- latencia y memoria;
- comportamiento sin resultados.

La evaluación no necesita un LLM interno.

## Criterio provisional de cierre para 2.2

Antes de marcar recuperación híbrida al 100%, demostrar:

- FTS5 recupera términos exactos y relacionados por tokenización;
- búsqueda exacta recupera similitud semántica con el E5 local;
- la fusión es determinista;
- filtros no contaminan resultados;
- un paquete sincronizado se vuelve consultable sin reconstrucción manual;
- una eliminación desaparece de ambos rankings;
- reiniciar el proceso reconstruye correctamente el índice vectorial derivado;
- no hay llamadas de red ni mutación de fuentes;
- las métricas y procedencia permiten que 2.3 construya citas.

## Primer turno recomendado para el próximo agente

1. Confirmar `git status --short` vacío y revisar los últimos commits.
2. Ejecutar `npm.cmd run check` y `npm.cmd run build`.
3. Leer los ocho documentos indicados al inicio.
4. Inspeccionar puertos, `sync-source.ts`, `sqlite-index-store.ts`, migración y
   `create-application.ts`.
5. No empezar código directamente: proponer el diseño y checklist fino de 2.2.
6. Resolver con el usuario la política baseline de fusión/reranking.
7. Implementar en cortes de máximo cinco archivos por tarea, conservando
   arquitectura y commits convencionales.

Prompt sugerido para retomar:

> Retoma `auto-youtube-rag` desde `docs/agent-handoff.md`. Verifica primero el
> estado del repositorio y las pruebas. El punto 2.1 está terminado; planifica
> 2.2 — recuperación híbrida — con contratos independientes de SQLite/E5,
> búsqueda FTS5, búsqueda vectorial exacta, fusión, diversidad, filtros y tests.
> No implementes hasta presentar y aprobar el checklist detallado.

## Historial reciente relevante

```text
ed89878 docs(progress): complete synchronization phase
35ef5d1 fix(domain): accept canonical unicode slugs
b902d0c fix(embeddings): enforce offline model loading
705a444 test(e2e): verify incremental indexing workflow
7a498fb feat(diagnostics): add status and doctor commands
d82092c feat(cli): add administrative executable
193a067 feat(cli): parse administrative commands
e467252 feat(main): compose indexing application
b0e5c0b feat(indexing): orchestrate incremental source sync
6f0fb10 fix(indexing): preserve unchanged packages during sync
be34690 feat(sources): add source management use cases
2fb1510 docs(progress): complete persistence block
8c629c1 feat(sqlite): apply package updates atomically
f5ed973 feat(sqlite): persist sync runs and package state
7f33d19 feat(sqlite): persist source registry
2cdc17a feat(sqlite): add initial database migration
2213542 test(embeddings): add offline E5 smoke test
96fa2dc feat(embeddings): add local E5 generator
160c415 feat(application): fragment knowledge units by tokens
f862982 feat(application): build hierarchical knowledge units
```

## Definición de éxito del relevo

Un agente está correctamente situado cuando puede explicar, antes de escribir
código:

1. por qué el agente consultante es el único LLM;
2. por qué existen `KnowledgeUnit` y `SearchFragment` separados;
3. cómo `sync` preserva paquetes válidos ante fallos;
4. por qué los paquetes fuente son estrictamente read-only;
5. cómo se mantienen alineados SQLite, FTS5 y embeddings;
6. por qué la búsqueda vectorial inicial será exacta y reemplazable;
7. qué parte corresponde a 2.2 y qué debe esperar a 2.3;
8. qué decisión de fusión/reranking aún requiere validación.
