# auto-youtube-rag

Biblioteca RAG **local** que convierte los paquetes de conocimiento producidos
por la skill de videos en contexto amplio, ordenado y citado, listo para que un
agente razone sobre él.

No responde por sí misma. No hay ningún LLM adentro: recupera, deduplica,
ordena y cita: el agente que consulta —Codex, Claude u otro— es el único
cerebro generativo. Todo corre en tu máquina, sin APIs externas.

**Estado: completo y en uso.** El MVP (indexación incremental, recuperación
híbrida, ensamblado de contexto y skill portable) está cerrado, y también los
seis puntos posteriores, hasta `rebuild`. No queda ningún comando del contrato
sin implementar. Ver [`docs/build.md`](docs/build.md).

## Instalación

Requiere **Node.js 24.19.0** (fijado en `.node-version`).

```powershell
git clone https://github.com/LuchoC-Dev/auto-youtube-rag.git
cd auto-youtube-rag
npm ci
npm run build
```

Después, instalar la biblioteca y el modelo de embeddings:

```text
auto-youtube-rag init
```

`init` crea `~/.auto-youtube-rag/` con la base SQLite y el modelo (~130 MB).
**Es la única operación de toda la herramienta que usa la red**, y tarda:
dale tiempo. Es idempotente, así que repetirlo no rompe nada.

Si el binario no quedó en el `PATH`, todo funciona igual invocando
`node "<ruta-al-repo>/dist/main.js" <comando>`.

Dos banderas útiles: `--from <ruta>` copia un modelo que ya tengas en disco en
vez de descargarlo (segundos en lugar de minutos), y `--skip-model` prepara
sólo la base, para CI o entornos sin red.

## Uso

```text
auto-youtube-rag source add <ruta-a-la-coleccion> --name design
auto-youtube-rag sync
auto-youtube-rag retrieve "jerarquía tipográfica en diseño web" --depth balanced
```

`sync` indexa de forma incremental: la primera corrida sobre una colección
grande tarda varios minutos, las siguientes son casi instantáneas si nada
cambió. `retrieve` escribe dos archivos y devuelve un recibo JSON con sus
rutas:

- **`context.md`** — el contexto ensamblado, en seis secciones fijas, con cada
  bloque abierto por su marcador de cita (`### [S01] ...`);
- **`result.json`** — la procedencia exacta de cada cita: fuente, video,
  heading, timestamps y evidencia visual.

Los paquetes originales **nunca se modifican**: la herramienta sólo lee.

### Todos los comandos

```text
auto-youtube-rag init [--skip-model] [--from <ruta>]
auto-youtube-rag source add <ruta> --name <nombre>
auto-youtube-rag source list
auto-youtube-rag source remove <nombre>
auto-youtube-rag sync [--source <nombre>] [--force]
auto-youtube-rag retrieve <consulta> [--depth focused|balanced|deep]
                                     [--max-tokens <entero>]
                                     [--source <nombre>] [--out <directorio>]
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag models install [--force] [--from <ruta>]
auto-youtube-rag models status
auto-youtube-rag rebuild --confirm
```

Todos son no interactivos y emiten JSON compacto por `stdout`; `stderr` lleva
el progreso. Códigos de salida: `0` éxito, `1` fallo operativo o resultado
parcial, `2` uso inválido, `130` interrupción.

`doctor` es de sólo lectura y seguro de correr en cualquier momento: es el
primer lugar donde mirar si algo parece raro.

## Uso desde un agente

La forma prevista de consumir esto no es a mano, sino instalando
[`skill/SKILL.md`](skill/SKILL.md) en tu agente. Es autocontenida y sin lógica
específica de proveedor: enseña el flujo completo, cómo leer el bundle y cómo
citar con procedencia real.

## Documentación

**Para usar la herramienta:**

- [`skill/references/setup.md`](skill/references/setup.md) — instalación,
  rutas, variables de entorno y los errores más frecuentes.
- [`skill/references/troubleshooting.md`](skill/references/troubleshooting.md) —
  códigos de salida, `warnings` y recuperación de fallos.
- [`docs/cli-contract.md`](docs/cli-contract.md) — referencia normativa de cada
  comando, bandera y recibo.

**Para trabajar en el código:**

- [`docs/development.md`](docs/development.md) — toolchain, comandos de
  calidad y cómo arrancar desde un clon limpio.
- [`docs/agent-handoff.md`](docs/agent-handoff.md) — relevo completo para
  retomar el proyecto en frío.
- [`docs/product-spec.md`](docs/product-spec.md) — objetivo, alcance y límites.
- [`docs/architecture.md`](docs/architecture.md) — arquitectura acordada.
- [`docs/decisions.md`](docs/decisions.md) — decisiones tomadas y alternativas
  descartadas, con su porqué.
- [`docs/build.md`](docs/build.md) — progreso por punto.

Los `*-design.md` y `*-tasks.md` de `docs/` documentan el diseño y el checklist
de cada punto ya cerrado.

## Cómo está construido

- **TypeScript estricto sobre Node 24**, ESM, sin framework de CLI
  (`node:util.parseArgs`).
- **SQLite** vía `node:sqlite`, con FTS5 para la vía léxica.
- **Embeddings locales** con `Xenova/multilingual-e5-small` (384 dimensiones,
  cuantización `q8`) sobre Transformers.js, siempre en modo offline.
- **Recuperación híbrida**: FTS5 y búsqueda vectorial exacta en memoria,
  fusionadas con RRF ponderado.
- **Arquitectura por capas**: dominio y aplicación no conocen SQLite,
  Transformers.js ni el sistema de archivos; todo entra por puertos.

Decisiones deliberadas: contexto amplio y deduplicado en vez de un `top-k`
pequeño; procedencia preservada hasta el nivel de sección y evidencia; los
paquetes fuente son inmutables; una sola skill portable en vez de una por
proveedor.
