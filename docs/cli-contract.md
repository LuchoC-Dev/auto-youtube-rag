# Contrato de CLI

## Estado

Contrato aprobado para el MVP. Los códigos numéricos de salida permanecen
pendientes y deberán añadirse antes de completar la etapa 1.2.

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
auto-youtube-rag init
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>]
auto-youtube-rag retrieve <query> [options]
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag rebuild --confirm
```

No existen comandos separados `index` o `search` en el MVP. `sync` cubre la
indexación inicial e incremental; `retrieve` busca y ensambla contexto.

## Administración

### `init`

Inicializa configuración y SQLite. Debe ser idempotente y nunca reemplazar una
biblioteca existente.

```text
auto-youtube-rag init
```

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
```

### `status`

Informa fuentes, videos, documentos, secciones, reglas, embeddings, errores,
última sincronización, modelo de embeddings y versión de esquema.

```text
auto-youtube-rag status
```

### `doctor`

Comprueba SQLite, FTS5, modelo local, rutas, configuración, permisos e
integridad de esquema sin modificar datos.

```text
auto-youtube-rag doctor
```

### `rebuild`

Regenera el índice derivado y exige confirmación explícita. Nunca modifica las
raíces registradas.

```text
auto-youtube-rag rebuild --confirm
```

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

El Markdown utiliza `[S01]`, `[S02]` y equivalentes. Cada ID se resuelve en
`result.json`:

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
- Los códigos numéricos de salida se definirán antes de cerrar la etapa 1.2.
