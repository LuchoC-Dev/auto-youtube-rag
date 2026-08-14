# Contrato de CLI

## Estado

Contrato aprobado y completo para el MVP, ampliado el 13 de agosto de 2026
con el punto 4.2 (hogar de usuario e instalación del modelo). Diseño en
`docs/install-design.md`, checklist fino en `docs/install-tasks.md`.

## Principios

- El ejecutable se llama `auto-youtube-rag`.
- La CLI es neutral respecto de Codex, Claude y futuros agentes.
- Ningún comando utiliza un LLM para responder.
- Los paquetes fuente se consideran inmutables.
- `stdout` contiene recibos o resultados estructurados.
- `stderr` contiene progreso, diagnósticos y advertencias.
- Los comandos usados por la skill funcionan sin interacción.
- Las claves técnicas están en inglés; el contenido conserva su idioma original.

## Comandos del MVP

```text
auto-youtube-rag init [--skip-model] [--from <path>]
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>] [--force]
auto-youtube-rag retrieve <query> [options]
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag models install [--force] [--from <path>]
auto-youtube-rag models status
auto-youtube-rag rebuild --confirm
```

No existen comandos separados `index` o `search` en el MVP. `sync` cubre la
indexación inicial e incremental; `retrieve` busca y ensambla contexto.
`models install`/`models status` y las banderas `--skip-model`/`--from` de
`init` son del punto 4.2.

## Administración

### `init`

Inicializa el hogar de usuario (`~/.auto-youtube-rag/`, o
`AUTO_YOUTUBE_RAG_HOME` si está definida), crea/migra la base SQLite y deja
el modelo de embeddings instalado. Debe ser idempotente y nunca reemplazar
una biblioteca existente.

```text
auto-youtube-rag init [--skip-model] [--from <path>]
```

`--skip-model` omite la instalación del modelo (pensado para CI y entornos
sin red). `--from <path>` copia un modelo ya presente en disco en vez de
descargarlo — ver `models install` para el orden de resolución completo, que
`init` reutiliza internamente.

`init` deja de ser instantáneo por defecto: sin `--skip-model`, tarda lo que
tarde bajar ~130 MB la primera vez que corre en un hogar nuevo.

El recibo suma `home` (el hogar resuelto) y `model` (el mismo objeto que
emite `models install`, o `null` si se usó `--skip-model`) al
`database_path` que ya emitía. También puede sumar `warnings` con
`LEGACY_LIBRARY_FOUND` — ver más abajo.

### `source add`

Registra una raíz de paquetes. El nombre es único y estable.

```text
auto-youtube-rag source add <path> --name <name>
```

Ejemplo:

```powershell
auto-youtube-rag source add `
  "C:\Users\lucho\Desktop\Programacion\ai-transcripcion\auto-design\videos" `
  --name auto-design
```

### `source list`

Lista nombres, rutas, estado, cantidad de paquetes y última sincronización.

```text
auto-youtube-rag source list
```

### `source remove`

Desregistra la raíz y retira sólo sus registros derivados. Nunca elimina ni
modifica archivos fuente.

```text
auto-youtube-rag source remove <name>
```

### `sync`

Realiza indexación inicial o incremental. Detecta paquetes nuevos, cambios por
hash y paquetes eliminados. Un paquete inválido no debe impedir procesar los
demás; el resultado informa éxitos, omisiones y errores.

```text
auto-youtube-rag sync
auto-youtube-rag sync --source <name>
auto-youtube-rag sync --force
```

Sólo puede haber un run `running` por fuente a la vez: es la invariante que
impide que dos syncs concurrentes sobre la misma fuente se borren paquetes
entre sí (ver `docs/sync-safety-design.md`). Si ya hay uno activo, `sync`
falla con código de salida `1` y símbolo `SYNC_ALREADY_RUNNING`, nombrando el
id del run activo, cuándo empezó y `auto-youtube-rag sync --force` como
salida.

`--force` marca ese run activo como `failed` (registrando un `SyncIssue` con
código `RUN_SUPERSEDED` que deja constancia de que fue abandonado, no
completado) y arranca uno nuevo. Es la salida cuando el proceso que dejó el
run activo murió (Ctrl+C, cierre de terminal, corte); nunca se abandona un
run automáticamente. Sin un run activo, `--force` no hace nada distinto de
un `sync` normal.

### `status`

Informa fuentes, videos, documentos, secciones, reglas, embeddings, errores,
última sincronización, modelo de embeddings y versión de esquema. Suma
`warnings` con `LEGACY_LIBRARY_FOUND` cuando el hogar resuelto está vacío
(sin fuentes) y existe una base `.auto-youtube-rag/index.sqlite` relativa al
`cwd` — ver Decisión 6 de `docs/install-design.md`.

```text
auto-youtube-rag status
```

### `doctor`

Comprueba SQLite, FTS5, modelo local, rutas, configuración, permisos e
integridad de esquema sin modificar datos. El check `EMBEDDING_MODEL` lee la
misma ruta que resuelve `models status`, y su mensaje ante un modelo
ausente nombra `auto-youtube-rag models install`, no un comando de
benchmarks. Es el único comando administrativo que sigue corriendo — y
reporta el detalle — incluso si la base falla al abrirse (`SQLITE_INTEGRITY`
en `error`), en vez de propagar el error crudo del driver.

El check `STALE_SYNC_RUN` lista los runs `running` de cualquier fuente, con
su id y antigüedad. Estado `error` sólo si existe alguno, con el mensaje
nombrando `auto-youtube-rag sync --force`; `ok` si no hay ninguno. `doctor`
nunca marca un run activo como fallido por sí mismo — sólo informa; el
usuario decide si correr `sync --force`.

```text
auto-youtube-rag doctor
```

### `models install`

Instala el modelo de embeddings (E5 Small multilingüe, ~130 MB) en el hogar
resuelto. Reutiliza el orden de resolución de la Decisión 5 de
`docs/install-design.md`:

1. si el destino ya tiene el modelo instalado (recibo y disco coinciden) →
   `already_installed`, no hace nada, salvo `--force`;
2. si se pasó `--from <path>` y esa ruta tiene el modelo completo → copia
   (nunca mueve) y reporta `adopted`;
3. si se pasó `--from` y la ruta no tiene el modelo completo → error de uso,
   código `2`, `MODEL_SOURCE_INVALID`;
4. en caso contrario → descarga desde Hugging Face y reporta `installed`.

```text
auto-youtube-rag models install [--force] [--from <path>]
```

No requiere que exista la base ni el hogar previamente. Toca la red salvo
que se use `--from`; queda fuera de `npm run check` por el mismo motivo que
el smoke de E5.

Recibo:

```json
{
  "schema_version": "1.0",
  "status": "installed",
  "model": { "key": "e5-small", "version": "1", "dimensions": 384 },
  "cache_path": "C:\\Users\\lucho\\.auto-youtube-rag\\models",
  "bytes": 135266304,
  "source": "download"
}
```

`status` admite `installed`, `already_installed` y `adopted`. `source`
admite `download` y `copy` (`null` cuando `status` es `already_installed`).

### `models status`

Reporta el estado del modelo sin descargar ni modificar nada. Código de
salida `0` en los tres estados: informar ausencia no es un fallo operativo.

```text
auto-youtube-rag models status
```

```json
{
  "schema_version": "1.0",
  "status": "incomplete",
  "model": { "key": "e5-small", "version": "1", "dimensions": 384 },
  "cache_path": "C:\\Users\\lucho\\.auto-youtube-rag\\models",
  "issues": [{ "path": "onnx/model_quantized.onnx", "reason": "missing" }]
}
```

`status` admite `installed`, `incomplete` y `absent`. `issues` sólo aparece
cuando `status` es `incomplete`, listando cada archivo requerido ausente
(`reason: "missing"`) o de tamaño distinto al recibo (`reason:
"size_mismatch"`) — nunca hashea los ~130 MB.

#### Advertencia `LOW_RELEVANCE`

`retrieve` la emite cuando el mejor puntaje de similitud de la vía vectorial
queda por debajo del piso calibrado (`0.84` por defecto, ver
`docs/low-relevance-design.md`). Significa que la biblioteca no tiene contenido
sobre el tema, no que algo haya fallado.

**No degrada el resultado**: `status` sigue `"ok"` y el código de salida es
`0`, a diferencia de las advertencias que reportan una vía caída. Tampoco
filtra candidatos: el bundle se arma igual, con las mismas citas.

### `rebuild`

Regenera el índice derivado y exige confirmación explícita. Nunca modifica las
raíces registradas.

```text
auto-youtube-rag rebuild --confirm
```

Implementado en el punto 4.6. Borra todos los paquetes indexados y todo lo
derivado de ellos —documentos, unidades, fragmentos, FTS5 y embeddings— y
después re-sincroniza cada fuente registrada. **Preserva** el registro de
fuentes, la versión de esquema y el historial de runs e issues.

Sirve para los cambios que `sync` no puede detectar, porque `unchanged()` sólo
compara el hash del paquete y la identidad del modelo: un tamaño de lote de
embeddings distinto (ver `sync-safety-design.md`), un `parser_version` nuevo o
un cambio de fragmentación. No es el remedio de un `sync` fallido.

`--confirm` es obligatorio; sin él el comando termina con código `2`.
`rebuild` **no acepta `--force`**: destrabar un run fantasma es una decisión
aparte (`sync --force`). Si alguna fuente tiene un `sync` en curso, `rebuild`
falla con `SYNC_ALREADY_RUNNING` sin borrar nada.

Requiere biblioteca y modelo, como `sync` y `retrieve`.

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "sources_rebuilt": 2,
  "packages_deleted": 51,
  "packages_indexed": 51,
  "packages_failed": 0,
  "sources": [
    {
      "name": "auto-design",
      "status": "ok",
      "packages_indexed": 34,
      "packages_failed": 0
    }
  ],
  "issues": []
}
```

`status` agregado: `ok` si toda fuente terminó bien, `partial` si alguna
degradó, `failed` si ninguna pudo reconstruirse. Una biblioteca sin fuentes
registradas devuelve `ok` con `sources_rebuilt: 0`. Códigos de salida: `0`
para `ok`, `1` para `partial` y `failed`.

Sólo la purga es transaccional. Si el proceso muere entre la purga y el final
de la re-sincronización, la biblioteca queda parcialmente reconstruida; el
remedio es volver a correr `rebuild`, que es idempotente.

## Recuperación

### `retrieve`

Construye un paquete de contexto para el agente.

```text
auto-youtube-rag retrieve <query> \
  [--depth focused|balanced|deep] \
  [--max-tokens <positive-integer>] \
  [--source <name>] \
  [--out <directory>]
```

`balanced` es la profundidad predeterminada. `--max-tokens` reemplaza el
presupuesto del preset. `--source` puede repetirse para limitar la consulta a
raíces concretas. `--out` conserva el bundle en una ubicación elegida; sin él,
se utiliza un directorio temporal identificado por `request_id`.

### Presupuestos iniciales

| Depth | Estimated tokens | Purpose |
| --- | ---: | --- |
| `focused` | 12,000 | Consulta relativamente puntual |
| `balanced` | 32,000 | Contexto amplio predeterminado |
| `deep` | 64,000 | Investigación extensa |

Los presupuestos son máximos, no objetivos de relleno. Si no existe evidencia
relevante suficiente, el bundle debe ser menor. Las cifras se ajustarán mediante
evaluaciones sin cambiar los nombres públicos de los presets.

## Bundle de salida

`retrieve` crea:

```text
<output>/<request-id>/
  context.md
  result.json
```

La CLI no imprime el contexto extenso en la terminal. Emite un recibo compacto:

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "request_id": "01J...",
  "context_path": "C:\\...\\context.md",
  "result_path": "C:\\...\\result.json",
  "estimated_tokens": 28740,
  "sources_used": 7,
  "warnings": []
}
```

## Contrato de `context.md`

`context.md` organiza evidencia; no responde la consulta ni agrega inferencias.
Cada bloque recuperado contiene al menos una cita corta.

```markdown
---
schema_version: "1.0"
query: "características del diseño brutalista"
depth: balanced
estimated_tokens: 28740
sources_used: 7
---

# Context package

## Query and scope
## Highest-relevance context
## Related rules and patterns
## Additional relevant context
## Coverage and limitations
## Source registry
```

Los encabezados técnicos del bundle son estables y están en inglés. Los
fragmentos recuperados se conservan en el idioma de sus paquetes.

## Contrato de `result.json`

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "request": {
    "query": "características del diseño brutalista",
    "depth": "balanced",
    "max_tokens": 32000,
    "sources": []
  },
  "metrics": {
    "candidates_considered": 50,
    "units_selected": 18,
    "sources_used": 7,
    "estimated_tokens": 28740
  },
  "units": [],
  "sources": [],
  "coverage": {},
  "warnings": [],
  "limitations": []
}
```

`schema_version` permite ampliar el contrato sin romper consumidores. Un
resultado sin coincidencias válidas usa `status: "no_results"` y entrega un
bundle con cobertura y limitaciones, sin fabricar contenido.

## Citaciones

El Markdown utiliza `[S01]`, `[S02]` y equivalentes. **El ID abre el bloque,
como parte de su encabezado**, y etiqueta el contenido que viene debajo:

```text
### [S01] Método completo de la fuente > Brutalismo

Diez de los doce sitios usan tipografía de gran escala...
```

Un ID nunca aparece fuera de una línea de encabezado. Hasta el 14 de agosto
de 2026 el marcador cerraba el bloque, en su propia línea, lo que lo dejaba
visualmente pegado al encabezado siguiente: un agente consumidor atribuyó
citas a la unidad equivocada aunque todos los IDs resolvían. Ver
`docs/decisions.md`.

Cada ID se resuelve en `result.json`:

```json
{
  "citation_id": "S01",
  "source_name": "auto-design",
  "video_id": "...",
  "video_title": "...",
  "creator": "...",
  "file": "deliverables/context.md",
  "heading_path": ["Método completo", "Brutalismo"],
  "unit_type": "section",
  "timestamp": null,
  "visual_evidence": []
}
```

Los timestamps se preservan cuando existen, pero no son una capacidad de
búsqueda. Las rutas visuales se conservan como evidencia verificable.

## Salida de proceso

- `stdout`: JSON compacto o salida estructurada solicitada.
- `stderr`: progreso, logs y advertencias.
- Sin color cuando la salida no es interactiva.
- Los comandos administrativos podrán aceptar `--json`.
- La skill utilizará siempre opciones no interactivas.

### Códigos de salida

La CLI utiliza un contrato pequeño y convencional, portable entre shells,
agentes y herramientas de automatización.

| Código | Significado |
| ---: | --- |
| `0` | Ejecución válida y completa |
| `1` | Fallo operativo o resultado parcial |
| `2` | Uso inválido de la CLI o argumentos incorrectos |
| `130` | Interrupción solicitada por el usuario mediante `Ctrl+C` |

El código `0` incluye estados terminales válidos que no producen trabajo o
evidencia: `no_results`, `no_changes` y `already_initialized`. Un resultado
parcial utiliza el código `1`, declara `status: "partial"` y puede conservar el
bundle o los registros utilizables que haya producido antes del fallo.

Los códigos numéricos no describen cada causa concreta. Las salidas JSON
incluyen un código simbólico estable, por ejemplo `SOURCE_NOT_FOUND`,
`PACKAGE_INVALID`, `DATABASE_BUSY`, `SCHEMA_INCOMPATIBLE`,
`EMBEDDING_MODEL_MISSING` u `OUTPUT_WRITE_FAILED`, además de `retryable` cuando
corresponda.

Códigos del punto 4.2 (preflight de requisitos e instalación, ver
`docs/install-design.md`):

| Código                    | Tipo             | Cuándo                                                              |
| ------------------------- | ---------------- | --------------------------------------------------------------------- |
| `LIBRARY_NOT_FOUND`       | error            | Preflight: `sync`/`retrieve`/`status`/`source *` sin base, código `1` |
| `MODEL_NOT_INSTALLED`     | error            | Preflight: `sync`/`retrieve` sin modelo instalado, código `1`         |
| `MODEL_SOURCE_INVALID`    | uso (`2`)        | `--from` apunta a una ruta sin modelo completo                        |
| `MODEL_DOWNLOAD_FAILED`   | error, retryable | La red falló durante `models install`/`init`                          |
| `DATABASE_INTEGRITY_ERROR`| error            | La base falla al abrirse; el mensaje remite a `auto-youtube-rag doctor` |
| `LEGACY_LIBRARY_FOUND`    | warning          | Hay una base `.auto-youtube-rag/index.sqlite` relativa al `cwd` no visible desde el hogar resuelto, y el hogar está vacío |
| `VECTORS_STALE`           | warning          | `retrieve`: la vía textual encontró resultados pero el índice vectorial cargó cero vectores para el modelo activo; los resultados provienen sólo de búsqueda textual. Aparece en `warnings` del recibo de `retrieve` y en "Coverage and limitations" de `context.md` |

Códigos del punto 4.3 (guard de concurrencia, ver `docs/sync-safety-design.md`):

| Código                    | Tipo             | Cuándo                                                              |
| ------------------------- | ---------------- | --------------------------------------------------------------------- |
| `SYNC_ALREADY_RUNNING`    | error            | `sync` sin `--force` con un run `running` activo para la fuente, código `1` |
| `RUN_SUPERSEDED`          | `SyncIssue`, no de proceso | Registrado sobre el run que `sync --force` marcó `failed` en vez de completar |
| `STALE_SYNC_RUN`          | check de `doctor`| Runs `running` listados por `doctor`, con id y antigüedad; `error` sólo si hay alguno |

Cada comando declara qué necesita antes de ejecutar nada: `init`, `doctor`,
`models install` y `models status` no requieren base ni modelo; `source
add/list/remove` y `status` requieren base; `sync` y `retrieve` requieren
base y modelo. Un requisito ausente produce **un** error, no un fallo por
elemento procesado.

La aplicación no emite internamente `126`, `127` ni códigos de la familia
`128 + señal`, porque están reservados para el shell o el entorno de ejecución.
