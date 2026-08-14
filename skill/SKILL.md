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
humana, salvo `rebuild`, que borra y regenera la biblioteca entera: exige
`--confirm` y no conviene lanzarlo por iniciativa propia (ver "Reconstruir la
biblioteca" más abajo).

`stdout` siempre imprime JSON compacto (recibos o resultados estructurados).
`stderr` lleva progreso y advertencias; no forma parte del contrato de datos.
Nunca imprimas de más pidiendo `--json` extra: ya es el formato por defecto.

**La biblioteca vive en el hogar del usuario**, en `~/.auto-youtube-rag/`, no
en el directorio desde el que ejecutás. Podés invocar la CLI parado en
cualquier carpeta y siempre vas a hablar con la misma biblioteca.

## Flujo recomendado

1. **Instalar antes de cualquier otro comando.** `init` deja el sistema
   entero listo: crea el hogar, prepara la base y deja instalado el modelo de
   embeddings.

   ```text
   auto-youtube-rag init
   ```

   Es idempotente: repetirlo no destruye nada.

   **`init` no es instantáneo.** Sin banderas descarga el modelo, unos 130 MB,
   y es la única operación de toda la herramienta que usa la red. Dale un
   timeout holgado o corrélo en segundo plano. Dos banderas lo cambian:

   - `--from <ruta>` copia un modelo que ya está en disco en vez de
     descargarlo, y tarda segundos;
   - `--skip-model` prepara sólo la base, sin modelo. Sirve para CI o sin
     red, pero `sync` y `retrieve` **no van a funcionar** hasta que instales
     el modelo.

   Si te lo saltás, los demás comandos fallan con `LIBRARY_NOT_FOUND` y te
   dicen exactamente qué correr.

2. **Diagnosticar antes de asumir estado.** Corré `auto-youtube-rag status`
   para ver fuentes registradas, última sincronización y salud del modelo.
   Si algo parece roto (y ya corriste `init`), corré `auto-youtube-rag doctor`
   para un chequeo de integridad de sólo lectura.

   Para el modelo específicamente:

   ```text
   auto-youtube-rag models status
   auto-youtube-rag models install [--force] [--from <ruta>]
   ```

   `models status` devuelve `installed`, `incomplete` o `absent`, siempre con
   código de salida `0` — informar ausencia no es un fallo. `incomplete`
   significa instalación dañada o a medias, típicamente una descarga cortada,
   y se repara con `models install --force`.

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
   de **5 a 10 segundos por video** — una colección de 60 videos lleva entre
   5 y 10 minutos. Un `sync` posterior sin cambios termina en segundos.
   Planificá la espera antes de lanzarlo: en segundo plano si tu entorno
   puede, o con un timeout holgado (15 minutos o más) si sólo podés en
   primer plano.

   **No lances un segundo `sync` mientras haya uno corriendo.** Desde el
   punto 4.3 el producto lo rechaza con `SYNC_ALREADY_RUNNING` en vez de
   dejarte corromper la biblioteca, pero igual estarías perdiendo el tiempo.
   La única señal fiable de que terminó es el recibo JSON del propio comando;
   el conteo de videos de `status` no sirve como señal de progreso.

   Si un `sync` anterior murió (Ctrl+C, terminal cerrada, corte), su registro
   queda marcado como activo para siempre y bloquea los siguientes. `doctor`
   lo reporta como `STALE_SYNC_RUN`. Para destrabarlo:

   ```text
   auto-youtube-rag sync --force
   ```

   Marca el run abandonado como fallido y arranca uno nuevo. **Usalo sólo si
   estás seguro de que el proceso anterior ya no existe**, no para saltear un
   sync que sigue trabajando.

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
   `[S01]`, `[S02]`, etc.

   **Cada ID abre su bloque, dentro del encabezado**, y etiqueta el texto que
   viene debajo:

   ```text
   ### [S01] Método completo de la fuente > Brutalismo

   Diez de los doce sitios usan tipografía de gran escala...
   ```

   Un ID nunca aparece fuera de una línea de encabezado, así que no hay
   ambigüedad sobre a qué contenido pertenece.

   Abrí `result_path` (`result.json`) sólo cuando
   necesites resolver una cita a su procedencia exacta (fuente, video,
   heading, evidencia visual) o inspeccionar métricas.

   Si el recibo trae un `status` distinto de `"ok"` o `warnings` no vacíos,
   leé `references/troubleshooting.md` antes de interpretar la cobertura.

7. **Citar con procedencia real.** Cuando uses contenido recuperado en tu
   respuesta, citá los IDs `[S0N]` tal como aparecen en `context.md`. Nunca
   fabriques una cita que no venga del bundle.

## Reconstruir la biblioteca

`rebuild` borra todo el índice derivado y lo regenera desde los paquetes que
siguen en disco. Conserva las fuentes registradas y el historial; los paquetes
fuente nunca se tocan.

```text
auto-youtube-rag rebuild --confirm
```

Sirve para lo que un `sync` normal **no puede** detectar: `sync` es
incremental y compara el hash del paquete contra el indexado, así que si el
paquete no cambió no recalcula nada, aunque el modo de indexar sí haya
cambiado. Casos típicos: el producto se actualizó y cambió cómo genera
embeddings o cómo parsea los archivos.

Cuándo **no** usarlo:

- para arreglar un `sync` que falló: eso se resuelve leyendo los `issues` del
  recibo, no borrando la biblioteca;
- para "refrescar" contenido nuevo: para eso está `sync`, que es incremental
  y mucho más rápido;
- mientras haya un `sync` corriendo: el comando falla con
  `SYNC_ALREADY_RUNNING` sin borrar nada.

Qué esperar al correrlo:

- **tarda minutos**, porque vuelve a generar los embeddings de la biblioteca
  entera. No lo confundas con un comando colgado;
- `--confirm` es obligatorio; sin esa bandera termina con código `2`;
- no acepta `--force`. Si hay un run fantasma bloqueando, primero
  `sync --source <nombre> --force` y después `rebuild`;
- **si el proceso se interrumpe a mitad, la biblioteca queda parcialmente
  reconstruida.** No es un estado corrupto y no requiere ninguna reparación
  especial: volvé a correr `rebuild --confirm`, que deja siempre el mismo
  resultado. Hasta que termine, `retrieve` puede devolver menos contexto del
  esperado.

El recibo trae `status` (`ok`, `partial` o `failed`), `packages_deleted`,
`packages_indexed`, `packages_failed`, el detalle por fuente e `issues`.
`partial` y `failed` salen con código `1`.

## Reglas de oro

- Nunca leas los paquetes fuente (`context.md`, `rules.json` o
  `analysis.json` originales) directamente cuando `retrieve` puede darte el
  mismo contenido ya organizado, deduplicado y citado.
- Nunca modifiques ni borres archivos dentro de una fuente registrada; el
  producto tampoco lo hace.
- Nunca fabriques una cita `[S0N]` ni contenido que no venga del bundle.
- Nunca lances `rebuild` por tu cuenta para "arreglar" un `sync` que falló:
  no es su función y tarda minutos. Sugerilo sólo ante los casos de la
  sección "Reconstruir la biblioteca", y dejá que el usuario decida.
- Nunca asumas que un `status: "ok"` de baja relevancia es un bug: es el
  comportamiento esperado del MVP.
- Nunca lances un `sync` mientras otro sigue corriendo, ni uses el conteo
  intermedio de `status` como señal de progreso.
- Nunca uses `sync --force` para saltear un `sync` en curso: es sólo para
  destrabar uno que murió.
- Nunca reintentes un comando fallido sin haber leído antes el archivo de
  referencia que corresponde: la mayoría de los fallos son de configuración
  y reintentar a ciegas los repite igual.
