# Plan técnico de indexación incremental

## Estado

Plan aprobado el 11 de agosto de 2026. La especificación está en
[indexing-design.md](indexing-design.md) y el desglose ejecutable está en
[indexing-tasks.md](indexing-tasks.md). La implementación comienza únicamente
después de aprobar también ese checklist.

## Objetivo del plan

Implementar el punto 2.1 mediante cortes verificables que mantengan el dominio
independiente, lean los paquetes como datos inmutables y sólo persistan una
versión cuando esté completamente validada. Al finalizar, `source` y `sync`
deben funcionar sobre múltiples colecciones con altas, cambios, omisiones,
errores aislados y eliminaciones seguras.

## Estrategia general

El trabajo avanza desde el núcleo puro hacia los bordes:

```text
identidades e invariantes
  → contratos de aplicación
  → lectura y parsing de paquetes
  → unidades y fragmentos
  → embeddings
  → persistencia SQLite + FTS5
  → orquestación incremental
  → CLI y pruebas extremo a extremo
```

Cada bloque se verifica antes de que el siguiente dependa de él. Los adaptadores
se prueban contra contratos compartidos y los casos de uso se prueban primero
con implementaciones en memoria.

## Componentes y dependencias

### 1. Núcleo de dominio

Contiene value objects, entidades, tipos discriminados, hashes e invariantes de
jerarquía. No conoce rutas del sistema operativo, SQLite, JSON crudo, Markdown,
Transformers.js ni la CLI.

Dependencias: ninguna capa interna.

Resultados principales:

- identidades validadas para fuente, video, documento, unidad y sync;
- `SourceRoot`, `VideoPackage`, `SourceDocument`, `KnowledgeUnit`,
  `SearchFragment`, `EmbeddingRecord`, `SyncRun` y `SyncIssue`;
- funciones deterministas para claves estables y hashes de contenido;
- errores de dominio explícitos, sin códigos de infraestructura.

### 2. Contratos y casos de uso de aplicación

Declara `PackageSourceReader`, `SourceRegistry`, `IndexStore` y
`EmbeddingGenerator`, además de DTOs que no contienen tipos externos. Orquesta
registro de fuentes y sincronización sin decidir cómo se leen archivos o se
abren transacciones.

Dependencias: dominio.

Se usarán fakes en memoria para probar decisiones de sincronización antes de
crear SQLite.

### 3. Adaptador de paquetes del sistema de archivos

Resuelve una entrada de `source add` como raíz de colección o carpeta `videos/`,
normaliza rutas y valida la relación entre `manifest.json` y los paquetes.
Después convierte archivos externos en snapshots internos:

- manifest: sólo `videos`; `pages` se ignora;
- `context.md`: frontmatter, documento y árbol de secciones;
- `rules.json`: secciones, patrones y elementos hijos;
- `metadata.json`: allowlist estable;
- evidencia: rutas relativas, timestamps y limitaciones existentes.

Dependencias: puertos y DTOs de aplicación. Los parsers concretos viven en
infraestructura y nunca atraviesan los puertos.

### 4. Constructor de unidades y fragmentos

Convierte snapshots válidos en `KnowledgeUnit` y `SearchFragment`. Mantiene
padres, orden, rutas de encabezados, IDs repetibles y contenido estructurado.
Divide por límites semánticos y consulta el límite/tokenizador expuesto por
`EmbeddingGenerator`; nunca entrega al modelo un texto fuera de rango.

Dependencias: dominio, contratos de aplicación y generador de embeddings.

La política de fragmentación se mantiene pura y configurable. Los valores
iniciales se fijarán en tareas y podrán ajustarse mediante evaluaciones sin
cambiar identidades de unidades amplias.

### 5. Adaptador E5 Small

Implementa descripción del modelo, conteo de tokens y embeddings de documentos.
Usa el modelo local aprobado, procesa por lotes y valida dimensión y finitud de
cada vector. No persiste datos ni conoce SQLite.

Dependencias: `EmbeddingGenerator` y la dependencia existente
`@huggingface/transformers`.

### 6. Adaptador SQLite

Implementa registro de fuentes, estado indexado y aplicación atómica de un
paquete. Incluye:

- migración versionada inicial;
- foreign keys, WAL e integridad al abrir;
- tablas, índices y triggers FTS5;
- BLOB `float32` con modelo, versión, dimensión y hash;
- transacción que reemplaza los derivados de un paquete como una unidad;
- eliminación por `last_seen_sync_id` únicamente tras un manifest válido.

Dependencias: puertos de aplicación y `node:sqlite`. Ningún tipo de
`node:sqlite` sale del adaptador.

### 7. Orquestador de sincronización

Coordina el ciclo completo por fuente: crea el run, lee manifest, compara estado,
procesa sólo cambios, registra issues, elimina ausentes y cierra contadores. La
unidad de fallo es el paquete; un manifest ilegible detiene eliminaciones.

Dependencias: casos de uso, puertos y políticas puras.

El índice vectorial en memoria se actualiza sólo después del commit. Durante el
punto 2.1 basta con publicar el cambio confirmado a `VectorSearchIndex`; la
búsqueda se implementará en 2.2.

### 8. Interfaz CLI y composition root

Conecta `init`, `source add/list/remove`, `sync`, `status` y `doctor` con los
casos de uso existentes. Para el MVP se propone `node:util.parseArgs`, evitando
otra dependencia mientras la superficie siga siendo pequeña. La presentación
traduce errores internos a los códigos JSON y códigos de proceso aprobados.

Dependencias: aplicación, adaptadores concretos y contrato público de CLI.

## Orden de implementación

### Bloque A — Fundamentos puros

1. Crear estructura real de `domain` y `application`.
2. Implementar identidades, entidades e invariantes.
3. Declarar puertos y DTOs.
4. Implementar hashes y claves estables.

Checkpoint: build, lint y pruebas unitarias sin cargar SQLite, Transformers.js
ni archivos reales.

### Bloque B — Lectura y transformación

1. Resolver las dos formas aceptadas de ruta fuente.
2. Leer y validar manifest y paquetes.
3. Parsear `context.md`, `rules.json` y metadata seleccionada.
4. Construir jerarquías y fragmentos deterministas.

Checkpoint: fixtures pequeños y una muestra real copiada a un directorio
temporal producen el snapshot esperado sin modificar el original.

### Bloque C — Embeddings

1. Implementar el adaptador E5.
2. Contar tokens y fragmentar bajo el límite real.
3. Generar lotes reproducibles y validar vectores.

Checkpoint: smoke test local con el modelo ya descargado y fake determinista en
la suite rápida. La suite rápida no descarga modelos ni depende de red.

### Bloque D — Persistencia

1. Crear migración SQLite y apertura segura.
2. Implementar contratos de fuentes y estado indexado.
3. Aplicar paquetes atómicamente y mantener FTS5.
4. Persistir y reconstruir cambios vectoriales confirmados.

Checkpoint: suite de contrato contra SQLite temporal, reapertura, cascadas,
triggers, rollback e idempotencia.

### Bloque E — Sincronización y CLI

1. Implementar el caso de uso `sync` con fakes.
2. Conectar adaptadores reales.
3. Exponer comandos administrativos mediante `node:util.parseArgs`.
4. Probar códigos de salida y recibos JSON.

Checkpoint: colección temporal con alta, `no_changes`, cambio, paquete inválido
y eliminación; snapshots de la fuente antes y después deben ser idénticos.

## Paralelización posible

Después de fijar entidades y puertos, los parsers de Markdown, reglas y metadata
son independientes entre sí. La migración SQLite puede avanzar en paralelo con
los parsers una vez congelados los contratos. El orquestador y la CLI son
secuenciales porque dependen de todos los contratos anteriores.

La implementación normal seguirá commits pequeños aunque componentes sean
paralelizables; no se mezclarán cambios de contrato y adaptadores no relacionados
en un mismo commit.

## Riesgos y mitigaciones

| Riesgo                                         | Mitigación                                                     |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Encabezados duplicados o renombrados           | Ruta normalizada, ordinal de aparición y fixtures específicos  |
| JSON válido pero incompatible                  | Validación estructural antes de construir entidades            |
| Bloques mayores que el límite E5               | Conteo real, división recursiva y rechazo antes de embed       |
| Modelo ausente o vector inválido               | `doctor`, error explícito y paquete previo intacto             |
| Manifest parcial interpretado como borrado     | Eliminar sólo después de lectura completa válida               |
| SQLite confirmado pero memoria desactualizada  | Publicar cambio después del commit y permitir recarga completa |
| Mismo video en dos fuentes                     | Identidad compuesta y deduplicación posterior por `video_id`   |
| Migración acoplada a `node:sqlite`             | SQL versionado y suite de contrato en el borde                 |
| Pruebas que dependan de la biblioteca personal | Fixtures mínimos y directorios temporales                      |

## Estrategia de commits

Los commits seguirán dependencias y Conventional Commits:

1. `feat(domain): add indexing identities and entities`
2. `feat(application): define indexing ports and snapshots`
3. commits separados para parsers y fragmentación;
4. commits separados para E5 y SQLite;
5. `feat(indexing): orchestrate incremental sync`;
6. `feat(cli): expose source and sync commands`.

Cada commit debe pasar `npm run build` y `npm run check`. Los checkpoints con
modelo local se ejecutan adicionalmente cuando el bloque correspondiente cambia.

## Criterio de finalización del punto 2.1

- Se pueden registrar, listar y retirar varias fuentes.
- Una ruta de colección y su carpeta `videos/` se normalizan a la misma fuente.
- `sync` indexa paquetes válidos sin escribir en ellos.
- Una repetición sin cambios no recalcula ni duplica derivados.
- Cambios y eliminaciones actualizan sólo el alcance correcto.
- Un paquete inválido produce resultado parcial y conserva su versión anterior.
- Un manifest inválido no elimina conocimiento.
- Las unidades preservan jerarquía, metadata admitida y evidencia.
- Los fragmentos cumplen el límite real del modelo.
- SQLite, FTS5 y embeddings quedan consistentes tras reapertura.
- Dominio y aplicación se prueban sin infraestructura concreta.
- CLI respeta recibos y códigos de salida ya aprobados.

## Decisiones aprobadas del plan

El 11 de agosto de 2026 se aprobaron:

1. Seguir el orden por bloques A → E.
2. Incluir embeddings dentro de `sync` y tratar su fallo como fallo del paquete.
3. Usar `node:util.parseArgs` para la CLI inicial, sin dependencia adicional.
4. Mantener benchmarks históricos fuera de la suite rápida, con smoke tests
   explícitos para el modelo.
5. Implementar la migración SQLite sólo después de congelar dominio, puertos y
   snapshots.
