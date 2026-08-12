---
name: auto-youtube-rag
description: Recupera contexto amplio, citado y con procedencia desde una biblioteca RAG local de paquetes de video ya indexados, usando la CLI `auto-youtube-rag`. Usar cuando el usuario pide investigar, comparar, resumir o citar contenido de una colección de videos ya registrada, en vez de abrir los videos originales o leer sus paquetes fuente directamente.
---

# auto-youtube-rag

Esta skill enseña a operar `auto-youtube-rag`, una biblioteca RAG local que
indexa paquetes de video ya generados (uno por video, con `context.md`,
`rules.json` y metadata) y devuelve contexto amplio, deduplicado y citado.

**El producto no responde preguntas por sí mismo.** No contiene un LLM
interno. Vos —el agente que ejecuta esta skill— sos el único responsable de
leer el contexto recuperado, razonar sobre él y redactar la respuesta. Nunca
asumas que `retrieve` te da una respuesta final; te da evidencia con
procedencia.

Funciona exclusivamente en local, sin red, y nunca escribe ni modifica los
paquetes fuente registrados.

## Cuándo usar esta skill

Usala cuando el usuario pida algo que se responde mejor con contenido de una
colección de videos ya indexada: encontrar qué videos tratan un concepto,
comparar recomendaciones entre fuentes, recuperar reglas o patrones,
identificar coincidencias o contradicciones, o ensamblar contexto amplio para
una pregunta factual sobre el dominio de la colección.

No la uses para encontrar un instante puntual de un video (no es su función)
ni para tareas que no dependen de esta biblioteca.

## Antes de empezar

La CLI se invoca como `auto-youtube-rag <comando>`. Si el comando no está
disponible en el PATH, buscá el repositorio del proyecto y usá
`node "<ruta-al-repo>/dist/main.js" <comando>` en su lugar (requiere haber
corrido `npm run build` una vez en ese repo). El resto de esta skill asume
que ya resolviste ese detalle y usa la forma corta.

Todos los comandos son no interactivos y seguros de ejecutar sin supervisión
humana, salvo `rebuild`, que **todavía no está implementado** — no lo
invoques ni lo ofrezcas como disponible.

`stdout` siempre imprime JSON compacto (recibos o resultados estructurados).
`stderr` lleva progreso y advertencias; no forma parte del contrato de datos.
Nunca imprimas de más pidiendo `--json` extra: ya es el formato por defecto.

## Flujo recomendado

1. **Inicializar antes de cualquier otro comando.** `auto-youtube-rag status`,
   `doctor` y `source add` necesitan que la base de datos local ya exista.
   Si es la primera vez que usás la herramienta en esta máquina (o no estás
   seguro), corré primero:

   ```text
   auto-youtube-rag init
   ```

   Es idempotente — si ya está inicializada, no hace nada destructivo ni la
   reemplaza. Si te saltás este paso, `status`/`doctor`/`source add` fallan
   con un error de base de datos poco claro (`ERR_SQLITE_ERROR: unable to
open database file`).

   La base de datos se ubica por defecto en `<cwd>/.auto-youtube-rag/`,
   relativa al directorio de trabajo del proceso. El mismo error también
   aparece si invocás un comando posterior desde un `cwd` distinto al que
   usaste para `init` — no asumas que siempre significa "falta `init`";
   confirmá primero que estás ejecutando desde el mismo directorio de
   trabajo en cada invocación.

2. **Diagnosticar antes de asumir estado.** Corré `auto-youtube-rag status`
   para ver fuentes registradas, última sincronización y salud del modelo.
   Si algo parece roto (y ya corriste `init`), corré `auto-youtube-rag doctor`
   para un chequeo de integridad de sólo lectura (SQLite, FTS5, modelo local,
   esquema).

3. **Registrar una fuente si hace falta.** Si `status` no muestra la
   colección que el usuario necesita:

   ```text
   auto-youtube-rag source add <ruta-a-la-carpeta-videos> --name <nombre>
   auto-youtube-rag source list
   ```

   El nombre es único y estable; usalo después para filtrar consultas.
   La ruta que le pasás a `source add` es la carpeta `videos/` en sí (la
   que contiene un subdirectorio por `<slug>`), no su carpeta padre. El
   recibo puede devolver un `collection_path` un nivel arriba de esa ruta
   — es la resolución esperada de la raíz de la colección, no un error.
   Nunca registres una ruta que no siga la estructura esperada
   (`videos/<slug>/deliverables/context.md`, `rules.json`,
   `source/metadata.json`) sin confirmarlo primero.

4. **Sincronizar.** Antes de una consulta importante, o si `status` muestra
   una sincronización vieja:

   ```text
   auto-youtube-rag sync
   auto-youtube-rag sync --source <nombre>
   ```

   `sync` es incremental e idempotente: repetirlo sin cambios no hace nada
   destructivo. Un paquete inválido no bloquea el resto; revisá `warnings`
   en el recibo si algo falló parcialmente.

5. **Recuperar contexto.**

   ```text
   auto-youtube-rag retrieve "<consulta en lenguaje natural>" \
     --depth focused|balanced|deep \
     [--max-tokens <entero-positivo>] \
     [--source <nombre>] [--source <otro-nombre>] \
     [--out <directorio>]
   ```

   - `--depth balanced` (32k tokens estimados) es el valor por defecto;
     usá `focused` (12k) para una pregunta puntual y `deep` (64k) para
     investigación amplia. No inventes otros nombres de preset.
   - `--source` es repetible; usalo para acotar a una colección concreta
     cuando el usuario lo pida o cuando ya sabés qué fuente es relevante.
   - Sin `--out`, el bundle queda en un directorio temporal cuya ruta te
     da el recibo; no necesitás elegir `--out` salvo que el usuario quiera
     conservarlo en un lugar concreto.

6. **Leer el bundle, no adivinar desde el recibo.** `retrieve` nunca imprime
   el contexto completo en `stdout`; imprime un recibo compacto:

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

   Abrí `context_path` (`context.md`) para leer el contexto organizado en
   secciones fijas (`Query and scope`, `Highest-relevance context`,
   `Related rules and patterns`, `Additional relevant context`,
   `Coverage and limitations`, `Source registry`), citado con marcas
   `[S01]`, `[S02]`, etc. Abrí `result_path` (`result.json`) sólo cuando
   necesites resolver una cita a su procedencia exacta (fuente, video,
   heading, evidencia visual) o inspeccionar métricas.

7. **Citar con procedencia real.** Cuando uses contenido recuperado en tu
   respuesta, citá los IDs `[S0N]` tal como aparecen en `context.md`. Nunca
   fabriques una cita que no venga del bundle.

## Interpretar `status` en el recibo

- `"ok"`: hay bundle con evidencia. Un `status: "ok"` con relevancia baja es
  un resultado válido y esperado, no un error — la búsqueda semántica no
  tiene piso de similitud, así que consultas poco relacionadas con la
  colección igual devuelven candidatos. Leé `Coverage and limitations` en
  `context.md` antes de confiar ciegamente en la relevancia.
- `"no_results"`: la biblioteca (tras aplicar `--source` u otros filtros)
  quedó vacía de candidatos. El bundle igual se escribe, explicando la
  ausencia de evidencia. No es un fallo del comando.
- `"partial"`: una vía de recuperación se degradó (por ejemplo, búsqueda
  textual o vectorial no disponible) pero igual se produjo un bundle
  utilizable. Revisá `warnings` antes de confiar en la cobertura.

## Códigos de salida

| Código | Significado                                               | Qué hacer                                                 |
| -----: | --------------------------------------------------------- | --------------------------------------------------------- |
|    `0` | Éxito, incluidos `no_results`, `no_changes`, etc.         | Continuar normalmente.                                    |
|    `1` | Fallo operativo o resultado parcial (`status: "partial"`) | Revisar `warnings`/`limitations`; no reintentar a ciegas. |
|    `2` | Uso inválido de la CLI (argumento mal escrito)            | Corregir el comando, no es un bug del producto.           |
|  `130` | Interrupción manual (Ctrl+C)                              | No aplica a uso no interactivo.                           |

Cada salida JSON también incluye códigos simbólicos estables (por ejemplo
`SOURCE_NOT_FOUND`, `PACKAGE_INVALID`, `EMBEDDING_MODEL_MISSING`) y un
`retryable` cuando corresponde. Usalos para decidir si tiene sentido
reintentar o si hace falta intervención humana (por ejemplo, descargar el
modelo local con `npm run models:download` en el repositorio).

## Reglas de oro

- Nunca leas los paquetes fuente (`context.md`, `rules.json` originales)
  directamente cuando `retrieve` puede darte el mismo contenido ya
  organizado, deduplicado y citado.
- Nunca modifiques ni borres archivos dentro de una fuente registrada; el
  producto tampoco lo hace.
- Nunca fabriques una cita `[S0N]` ni contenido que no venga del bundle.
- Nunca ofrezcas `rebuild` como comando disponible: el contrato lo aprueba
  pero todavía no está implementado.
- Nunca asumas que un `status: "ok"` de baja relevancia es un bug: es el
  comportamiento esperado del MVP.
