# Diseño de indexación incremental

## Estado

Especificación aprobada el 10 de agosto de 2026. Este documento es la fuente de
verdad para entidades, puertos y esquema SQLite del punto 2.1. La implementación
debe seguir un plan y tareas revisados antes de comenzar.

## Evidencia inspeccionada

La colección real `auto-design` contiene 33 videos y una entrada web. Los 33
`video_id` y slugs son únicos. Todos los videos poseen `context.md`,
`rules.json` y `metadata.json`; en conjunto contienen 243 patrones. Los
`rules.json` comparten la misma forma y los IDs de patrón son únicos al
combinarlos con su video.

Los frontmatters de `context.md` varían ligeramente, pero comparten identidad,
idiomas y procedencia. `metadata.json` es una salida extensa y volátil de
yt-dlp, por lo que no debe copiarse completo al índice.

## Suposiciones revisables

1. El `manifest.json` ubicado sobre `videos/` es el inventario autoritativo de
   cada raíz registrada. `source add` acepta la raíz de colección o su carpeta
   `videos/`; al registrar se resuelven y almacenan ambas rutas canónicas.
2. `video_id` identifica el video y `(source_name, video_id)` identifica el
   paquete concreto. El slug sólo localiza archivos y puede cambiar.
3. El MVP procesa únicamente `manifest.videos`; ignora `manifest.pages` sin
   considerarlo un error.
4. `context.md` y `rules.json` aportan conocimiento. `manifest.json` y el
   subconjunto seleccionado de `metadata.json` aportan inventario, filtros y
   procedencia.
5. Los archivos fuente son inmutables para el RAG. Todos los datos generados se
   guardan en la biblioteca SQLite.
6. Una misma instancia SQLite administra múltiples raíces.

## Modelo del dominio

### `SourceRoot`

Raíz registrada por el usuario. Su nombre es único y estable; conserva las
rutas canónicas de la colección, el manifest y `videos/`, además del estado
habilitado y la fecha de registro. La ruta puede cambiar mediante una operación
explícita futura, pero nunca se infiere por el slug de un paquete.

### `VideoPackage`

Representa una aparición de un video dentro de una raíz. Su identidad natural
es `(sourceName, videoId)`. Conserva slug, ruta relativa, estado del manifest,
metadata estable, huella del paquete y última sincronización en la que fue
observado.

### `SourceDocument`

Archivo derivado de un paquete con tipo `context`, `rules`, `analysis` o
`metadata`. `rules` y `analysis` son mutuamente excluyentes por paquete: cada
video real trae `rules.json` (schema 1.0) o `analysis.json` (schema 2.0),
nunca ambos — ver "Soporte de `analysis.json` (schema 2.0)" en
`docs/decisions.md` y `docs/analysis-schema-design.md`. Conserva ruta
relativa, hash SHA-256, tamaño y parser versionado. Un cambio de hash o de
versión del parser invalida únicamente sus datos derivados.

### `KnowledgeUnit`

Unidad amplia que puede devolverse al agente. Forma una jerarquía mediante
`parentId`, `depth` y `ordinal`. Tipos iniciales:

- `context_document` y `context_section`;
- `rules_document` y `rules_section`;
- `rule_pattern`, `rule_item`, `avoid_item` y `acceptance_criterion`;
- `analysis_document` y `analysis_section` (punto 4.1, schema 2.0);
- `analysis_topic` y `analysis_recommendation`.

Cada unidad conserva texto renderizado, representación estructurada opcional,
ruta de encabezados, timestamps existentes, evidencia visual, estimación de
tokens y procedencia. Los documentos raíz sirven para expansión; no necesitan
ser candidatos de búsqueda si exceden el límite del modelo.

### `SearchFragment`

Unidad pequeña que sí participa en FTS5 y embeddings. Pertenece a una
`KnowledgeUnit` y conserva posición, texto y hash. Los fragmentos respetan
límites semánticos —párrafos, listas y campos JSON— y se dividen de nuevo según
el límite de entrada declarado por el generador de embeddings. Una coincidencia
en un fragmento se expande después a su unidad y padres.

### `EmbeddingRecord`

Vector asociado a un fragmento y a un modelo concreto. Incluye identificador y
versión del modelo, dimensión, hash del fragmento y vector `float32` como BLOB.
Una clave de modelo diferente permite reconstruir embeddings sin alterar las
unidades.

### `SyncRun` y `SyncIssue`

`SyncRun` registra alcance, inicio, fin, estado y contadores. `SyncIssue`
registra problemas por paquete o archivo sin abortar los demás. Una lectura
inválida conserva la última versión válida del paquete y marca el resultado
como parcial.

## Identificadores deterministas

- Paquete: `(source_name, video_id)`.
- Documento: `(package_id, document_kind)`.
- Sección Markdown: hash de la ruta normalizada de encabezados más el número de
  aparición cuando una ruta se repite.
- Patrón: `pattern:<pattern.id>`, siempre dentro del paquete.
- Hijo de patrón: tipo más posición estable dentro del patrón.
- Fragmento: `(unit_id, ordinal)` más `content_hash` para invalidación.

Renombrar un encabezado crea una unidad nueva; cambiar sólo su contenido
conserva la identidad y reemplaza fragmentos afectados. Los IDs internos de
SQLite son sustitutos y nunca se exponen como identidad pública.

## Metadata admitida

Se conservan únicamente campos útiles y relativamente estables:

- `video_id`, título, creador/canal y URL canónica;
- duración, fecha de publicación e idiomas;
- estado y slug del manifest;
- tags y categorías cuando existan;
- perfil y cobertura visual declarados en los deliverables;
- limitaciones y rutas relativas de evidencia.

No se indexan como conocimiento contadores, formatos de descarga, URLs
temporales, cookies, headers ni el objeto crudo completo de yt-dlp.

## Puertos de aplicación

Los contratos usan tipos propios; ningún tipo de SQLite, Transformers.js o del
sistema de archivos los atraviesa.

### Lectura e inventario

```ts
interface PackageSourceReader {
  readManifest(source: SourceRoot): Promise<ManifestSnapshot>;
  readPackage(ref: PackageRef): Promise<PackageSnapshot>;
}

interface SourceRegistry {
  add(source: SourceRoot): Promise<void>;
  getByName(name: SourceName): Promise<SourceRoot | null>;
  list(): Promise<readonly SourceRoot[]>;
  remove(name: SourceName): Promise<void>;
}
```

### Persistencia e indexación

```ts
interface IndexStore {
  getPackageState(ref: PackageRef): Promise<IndexedPackageState | null>;
  applyPackage(change: IndexedPackageChange): Promise<void>;
  deletePackagesNotSeen(source: SourceName, syncId: SyncId): Promise<number>;
  recordRun(run: SyncRun): Promise<void>;
  recordIssue(issue: SyncIssue): Promise<void>;
}

interface EmbeddingGenerator {
  describe(): Promise<EmbeddingModelDescriptor>;
  countTokens(texts: readonly string[]): Promise<readonly number[]>;
  embedDocuments(texts: readonly string[]): Promise<readonly Float32Array[]>;
  embedQuery(query: string): Promise<Float32Array>;
}
```

`applyPackage` es una operación atómica: reemplaza documentos, unidades,
fragmentos, filas FTS y embeddings derivados sólo después de construir una
versión completa y válida.

### Recuperación futura

```ts
interface KnowledgeRepository {
  getUnits(ids: readonly KnowledgeUnitId[]): Promise<readonly KnowledgeUnit[]>;
  getAncestors(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]>;
}

interface TextSearchIndex {
  search(request: TextSearchRequest): Promise<readonly SearchHit[]>;
}

interface VectorSearchIndex {
  load(model: EmbeddingModelDescriptor): Promise<void>;
  search(
    vector: Float32Array,
    request: VectorSearchRequest,
  ): Promise<readonly SearchHit[]>;
  apply(change: VectorIndexChange): Promise<void>;
}
```

Los puertos de recuperación se detallarán en los puntos 2.2 y 2.3. Aquí sólo se
fijan las dependencias que la indexación debe alimentar.

## Esquema SQLite propuesto

Todas las fechas usan texto UTC ISO 8601; los booleanos usan `INTEGER` con
`CHECK`; los JSON se validan con `json_valid`. Las claves foráneas y el modo
WAL se habilitan al abrir la base.

```sql
CREATE TABLE schema_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  collection_path TEXT NOT NULL UNIQUE,
  manifest_path TEXT NOT NULL UNIQUE,
  videos_path TEXT NOT NULL UNIQUE,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE sync_runs (
  id TEXT PRIMARY KEY,
  source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'ok', 'partial', 'failed')),
  started_at TEXT NOT NULL,
  finished_at TEXT,
  counters_json TEXT NOT NULL CHECK (json_valid(counters_json))
);

CREATE TABLE video_packages (
  id INTEGER PRIMARY KEY,
  source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  relative_path TEXT NOT NULL,
  manifest_stage TEXT,
  title TEXT,
  creator TEXT,
  canonical_url TEXT,
  duration_seconds INTEGER,
  published_at TEXT,
  source_language TEXT,
  context_language TEXT,
  tags_json TEXT CHECK (tags_json IS NULL OR json_valid(tags_json)),
  categories_json TEXT CHECK (categories_json IS NULL OR json_valid(categories_json)),
  visual_profile TEXT,
  package_hash TEXT NOT NULL,
  last_seen_sync_id TEXT NOT NULL REFERENCES sync_runs(id),
  indexed_at TEXT NOT NULL,
  UNIQUE (source_id, video_id)
);

CREATE TABLE source_documents (
  id INTEGER PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES video_packages(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('context', 'rules', 'analysis', 'metadata')),
  relative_path TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  parser_version TEXT NOT NULL,
  UNIQUE (package_id, kind)
);

CREATE TABLE knowledge_units (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES source_documents(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES knowledge_units(id) ON DELETE CASCADE,
  stable_key TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  depth INTEGER NOT NULL CHECK (depth >= 0),
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  title TEXT,
  content TEXT NOT NULL,
  structured_json TEXT CHECK (structured_json IS NULL OR json_valid(structured_json)),
  heading_path_json TEXT NOT NULL CHECK (json_valid(heading_path_json)),
  timestamps_json TEXT NOT NULL CHECK (json_valid(timestamps_json)),
  visual_evidence_json TEXT NOT NULL CHECK (json_valid(visual_evidence_json)),
  estimated_tokens INTEGER NOT NULL CHECK (estimated_tokens >= 0),
  content_hash TEXT NOT NULL,
  searchable INTEGER NOT NULL CHECK (searchable IN (0, 1)),
  UNIQUE (document_id, stable_key)
);

CREATE TABLE search_fragments (
  id INTEGER PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES knowledge_units(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  title TEXT,
  heading_path TEXT NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL CHECK (token_count > 0),
  content_hash TEXT NOT NULL,
  UNIQUE (unit_id, ordinal)
);

CREATE VIRTUAL TABLE fragment_fts USING fts5(
  title,
  heading_path,
  content,
  content='search_fragments',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2'
);

CREATE TABLE embeddings (
  fragment_id INTEGER NOT NULL REFERENCES search_fragments(id) ON DELETE CASCADE,
  model_key TEXT NOT NULL,
  model_version TEXT NOT NULL,
  dimensions INTEGER NOT NULL CHECK (dimensions > 0),
  content_hash TEXT NOT NULL,
  vector BLOB NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (fragment_id, model_key)
);

CREATE TABLE sync_issues (
  id INTEGER PRIMARY KEY,
  sync_id TEXT NOT NULL REFERENCES sync_runs(id) ON DELETE CASCADE,
  video_id TEXT,
  relative_path TEXT,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  retryable INTEGER NOT NULL CHECK (retryable IN (0, 1))
);
```

La migración inicial añadirá triggers para mantener `fragment_fts` sincronizada
con `search_fragments`, índices sobre relaciones y filtros frecuentes, y un
`schema_version` explícito. El SQL final vivirá en infraestructura; este esquema
es su contrato lógico.

## Algoritmo de sincronización

1. Crear un `SyncRun` y leer el manifest sin modificarlo.
2. Validar cada entrada de `manifest.videos` y construir su `PackageRef`.
3. Comparar hashes y versiones de parser/modelo con `IndexedPackageState`.
4. Saltar paquetes sin cambios.
5. Parsear completamente los documentos cambiados en memoria.
6. Construir jerarquía, fragmentos y embeddings antes de persistir.
7. Aplicar cada paquete válido en una transacción atómica.
8. Registrar issues y conservar la última versión válida de paquetes fallidos.
9. Tras completar un escaneo válido del manifest, eliminar paquetes que no
   fueron vistos en ese run.
10. Confirmar el run como `ok` o `partial` y actualizar el índice vectorial en
    memoria sólo después del commit SQLite.

Si el manifest completo es ilegible (raíz no es un objeto, `videos` no es un
array, JSON inválido o archivo no leíble), no se interpretan todos los
paquetes como eliminados. El run falla y el índice previo permanece intacto.

**Una entrada individual inválida de `manifest.videos` no aborta el manifest
completo.** Desde el 13 de agosto de 2026 (ver `docs/decisions.md`,
"Validación tolerante por video"), un video con esquema roto o un id/slug
duplicado se descarta como `ManifestVideoIssue` y el resto del manifest se
procesa igual. `syncSource` registra cada una como `SyncIssue` y, si el video
tenía una versión previa indexada, la marca vista para que sobreviva a la
eliminación por "no visto en este run" — un video que retrocede a un esquema
inválido nunca debe parecer eliminado de la colección.

## Invariantes

- Sin escrituras dentro de las raíces fuente.
- Una unidad siempre pertenece a exactamente un documento y paquete.
- Un fragmento nunca excede el límite declarado por el modelo.
- Un embedding coincide en hash con su fragmento y en dimensión con su modelo.
- FTS5 contiene exactamente los fragmentos persistidos.
- Repetir `sync` sin cambios no crea filas ni recalcula embeddings.
- Un error aislado no destruye la última versión válida del paquete.
- Las eliminaciones sólo se aplican después de leer correctamente el manifest.

## Pruebas exigidas para implementar

- Parser de manifest con videos y páginas mezclados.
- Identidades estables ante cambios de slug y contenido.
- Jerarquía Markdown con encabezados repetidos y niveles omitidos.
- Conversión completa de cada forma de `rules.json` observada.
- Selección explícita de metadata y rechazo de campos volátiles.
- Fragmentación bajo el límite del modelo, incluso con un bloque largo.
- Sincronización inicial, repetida, modificada y con eliminación.
- Paquete inválido que conserva su última versión válida.
- Manifest inválido que no provoca eliminaciones.
- Atomicidad SQLite, cascadas, triggers FTS5 y reapertura.
- Reconstrucción por cambio de parser o modelo.

## Decisiones aprobadas

El 10 de agosto de 2026 se aprobaron explícitamente:

1. la separación entre `KnowledgeUnit` amplia y `SearchFragment` pequeño;
2. la identidad `(source_name, video_id)` del paquete;
3. el subconjunto de metadata;
4. la granularidad de `rules.json`;
5. el esquema SQLite y la política de conservar el último paquete válido.
