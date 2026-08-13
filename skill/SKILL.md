---
name: auto-youtube-rag
description: Recupera contexto amplio, citado y con procedencia desde una biblioteca RAG local de paquetes de video ya indexados, usando la CLI `auto-youtube-rag`. Usar cuando el usuario pide investigar, comparar, resumir o citar contenido de una colección de videos ya registrada, en vez de abrir los videos originales o leer sus paquetes fuente directamente.
---

# auto-youtube-rag

Esta skill enseña a operar `auto-youtube-rag`, una biblioteca RAG local que
indexa paquetes de video ya generados (uno por video, con `context.md`,
metadata, y contenido estructurado en `rules.json` **o** `analysis.json`
según la versión de esquema con que se generó el paquete) y devuelve
contexto amplio, deduplicado y citado.

**El producto no responde preguntas por sí mismo.** No contiene un LLM
interno. Vos —el agente que ejecuta esta skill— sos el único responsable de
leer el contexto recuperado, razonar sobre él y redactar la respuesta. Nunca
asumas que `retrieve` te da una respuesta final; te da evidencia con
procedencia.

Funciona exclusivamente en local y nunca escribe ni modifica los paquetes
fuente registrados.

## Archivos de referencia

Esta skill se lee entera cada vez. Los procedimientos que sólo hacen falta de
vez en cuando viven en archivos aparte, junto a este:

| Archivo                         | Leelo cuando                                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `references/setup.md`           | Es la primera vez en esta máquina, o falla la base de datos, las rutas o la carga del modelo de embeddings.    |
| `references/troubleshooting.md` | Un comando devolvió un código distinto de `0`, o hay `warnings` o códigos simbólicos que no sabés interpretar. |

Si la biblioteca ya está funcionando, no abras ninguno de los dos: todo lo
que necesitás para operar está acá abajo.

## Cuándo usar esta skill

Usala cuando el usuario pida algo que se responde mejor con contenido de una
colección de videos ya indexada: encontrar qué videos tratan un concepto,
comparar recomendaciones entre fuentes, recuperar reglas o patrones,
identificar coincidencias o contradicciones, o ensamblar contexto amplio para
una pregunta factual sobre el dominio de la colección.

No la uses para encontrar un instante puntual de un video (no es su función)
ni para tareas que no dependen de esta biblioteca.

## Antes de empezar

La CLI se invoca como `auto-youtube-rag <comando>`. Si el comando no está en
el PATH, leé `references/setup.md` para la forma alternativa.

Todos los comandos son no interactivos y seguros de ejecutar sin supervisión
humana, salvo `rebuild`, que **todavía no está implementado** — no lo
invoques ni lo ofrezcas como disponible.

`stdout` siempre imprime JSON compacto (recibos o resultados estructurados).
`stderr` lleva progreso y advertencias; no forma parte del contrato de datos.
Nunca imprimas de más pidiendo `--json` extra: ya es el formato por defecto.

**Las rutas de la base y del modelo son relativas al directorio de trabajo.**
Usá el mismo `cwd` en todas las invocaciones de la sesión. Si cambiás de
directorio entre comandos, vas a apuntar a otra base sin ningún aviso.

## Flujo recomendado

1. **Inicializar antes de cualquier otro comando.** `status`, `doctor` y
   `source add` necesitan que la base de datos local ya exista:

   ```text
   auto-youtube-rag init
   ```

   Es idempotente. Si te lo saltás, esos comandos fallan con
   `ERR_SQLITE_ERROR: unable to open database file` → `references/setup.md`.

2. **Diagnosticar antes de asumir estado.** Corré `auto-youtube-rag status`
   para ver fuentes registradas, última sincronización y salud del modelo.
   Si algo parece roto (y ya corriste `init`), corré `auto-youtube-rag doctor`
   para un chequeo de integridad de sólo lectura.

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

   La estructura esperada es `videos/<slug>/deliverables/context.md` y
   `source/metadata.json`, más `deliverables/rules.json` **o**
   `deliverables/analysis.json`. Los dos formatos estructurados son
   igualmente válidos y conviven en la misma biblioteca: `rules.json` es el
   esquema original y `analysis.json` el de los paquetes más recientes. Una
   colección puede mezclar ambos, e incluso tener videos sin ninguno.
   **No trates la ausencia de `rules.json` como una colección inválida** y no
   intentes convertir un formato al otro.

4. **Sincronizar.** Antes de una consulta importante, o si `status` muestra
   una sincronización vieja:

   ```text
   auto-youtube-rag sync
   auto-youtube-rag sync --source <nombre>
   ```

   `sync` es incremental e idempotente: repetirlo sin cambios no hace nada
   destructivo. Un paquete inválido no bloquea el resto; revisá `warnings`
   en el recibo si algo falló parcialmente.

   **`sync` es una operación larga.** La primera indexación tarda del orden
   de **10 a 15 segundos por video** — una colección de 60 videos lleva entre
   10 y 15 minutos. Un `sync` posterior sin cambios termina en segundos.
   Planificá la espera antes de lanzarlo: en segundo plano si tu entorno
   puede, o con un timeout holgado (15 minutos o más) si sólo podés en
   primer plano.

   Mientras corre: **nunca lances un segundo `sync`**, y no uses el conteo de
   videos de `status` como señal de progreso — puede subir y bajar. La única
   señal fiable de que terminó es el recibo JSON del propio comando.

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

   Para una investigación amplia, varias consultas `focused` o `balanced`
   desde ángulos distintos suelen rendir más que una sola `deep`: una
   colección de catálogos temáticos devuelve mucho contenido tangencial
   cuando el presupuesto es grande.

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

   Si el recibo trae un `status` distinto de `"ok"` o `warnings` no vacíos,
   leé `references/troubleshooting.md` antes de interpretar la cobertura.

7. **Citar con procedencia real.** Cuando uses contenido recuperado en tu
   respuesta, citá los IDs `[S0N]` tal como aparecen en `context.md`. Nunca
   fabriques una cita que no venga del bundle.

## Reglas de oro

- Nunca leas los paquetes fuente (`context.md`, `rules.json` o
  `analysis.json` originales) directamente cuando `retrieve` puede darte el
  mismo contenido ya organizado, deduplicado y citado.
- Nunca modifiques ni borres archivos dentro de una fuente registrada; el
  producto tampoco lo hace.
- Nunca fabriques una cita `[S0N]` ni contenido que no venga del bundle.
- Nunca ofrezcas `rebuild` como comando disponible: el contrato lo aprueba
  pero todavía no está implementado.
- Nunca asumas que un `status: "ok"` de baja relevancia es un bug: es el
  comportamiento esperado del MVP.
- Nunca lances un `sync` mientras otro sigue corriendo, ni uses el conteo
  intermedio de `status` como señal de progreso.
- Nunca reintentes un comando fallido sin haber leído antes el archivo de
  referencia que corresponde: la mayoría de los fallos son de configuración
  y reintentar a ciegas los repite igual.
