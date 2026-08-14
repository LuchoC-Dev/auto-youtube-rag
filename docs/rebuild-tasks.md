# Checklist fino 4.6 — comando `rebuild --confirm`

Deriva de `docs/rebuild-design.md`. **Pendiente de aprobación**; ninguna tarea
empieza antes de que el diseño esté aprobado.

Cada tarea toca como máximo cinco archivos y cierra con su propio commit
mediante la skill `/git-commit`. Antes de cada commit: el test específico,
`npm run check` y, según el riesgo, `npm run build`.

## Bloque AE — purga del índice derivado

- [x] **AE1** — Agregar `purgeDerivedIndex(): Promise<number>` a `IndexStore`
      (`src/application/ports/index-store.ts`), documentando en el propio
      puerto qué borra y qué preserva, igual que hace `supersedeActiveRun`.
- [x] **AE2** — Implementar `SQLiteIndexStore.purgeDerivedIndex`: el `SELECT`
      de runs activos y el `DELETE FROM video_packages` bajo un único
      `BEGIN IMMEDIATE`, devolviendo la cantidad borrada. Sin tocar el esquema.
      El guard quedó **acá** y no en el caso de uso, para no reabrir la ventana
      entre comprobar y borrar que 4.3 cerró en `recordRun`.
- [x] **AE3** — Tests de `sqlite-index-store`:
  - borra paquetes, documentos, unidades, fragmentos y embeddings sobre dos
    fuentes, no sólo la primera;
  - deja `fragment_fts` vacía por los triggers, sin borrarla a mano;
  - preserva `sources`, `schema_meta`, `sync_runs` y `sync_issues`;
  - devuelve 0 sobre una biblioteca ya purgada sin fallar;
  - una biblioteca purgada sigue siendo utilizable por `sync` sin reabrir;
  - un run activo en **cualquier** fuente rechaza la purga sin borrar nada.

## Bloque AF — caso de uso `rebuildIndex`

- [x] **AF1** — Crear `src/application/indexing/rebuild-index.ts` con
      `rebuildIndex`: lista las fuentes, purga (el guard de runs activos vive
      dentro de la purga, ver AE2) y re-sincroniza cada fuente con la función
      `sync` inyectada. Es **secuencial**, no `Promise.all` como `sync`: un
      rebuild es el caso de máxima carga y 4.3 midió que paralelizar la
      indexación rinde 1,00x porque ONNX ya satura los núcleos.
- [x] **AF2** — Recibo agregado: `sourcesRebuilt`, `packagesDeleted`,
      `packagesIndexed`, `packagesFailed`, detalle por fuente e `issues`.
      `status` agregado según la regla del diseño (`ok`/`partial`/`failed`).
- [x] **AF3** — Tests de aplicación con fakes (sin SQLite ni modelo real):
  - reconstruye dos fuentes y agrega sus contadores;
  - **no purga nada** si una fuente tiene un run activo, y ninguna fuente
    llega a sincronizar;
  - la purga ya ocurrió cuando la primera fuente sincroniza, nunca al revés;
  - una fuente que falla deja `partial` sin impedir que las otras se
    reconstruyan; todas fallando da `failed`, no `partial`;
  - biblioteca sin fuentes registradas → `ok`, `sourcesRebuilt: 0`;
  - llama `purgeDerivedIndex` exactamente una vez, no una por fuente.
- [x] **AF4** — Exponer `rebuildIndex` en `Application`
      (`create-application.ts`) reutilizando el mismo cableado de `syncSource`
      que usa `sync`, con su test contra una biblioteca real vacía.

## Bloque AG — superficie de CLI

- [ ] **AG1** — `kind: "rebuild"` en `parse-command.ts`, con `--confirm`
      obligatorio: ausente o mal escrito → código de uso `2`, sin construir la
      `Application`. Rechazar `--force` explícitamente.
- [ ] **AG2** — Entrada `rebuild` en `command-requirements.ts` como
      `library_and_model`, y **actualizar** el test que hoy afirma que `sync` y
      `retrieve` son los únicos comandos que requieren biblioteca y modelo, para
      que contemple los tres.
- [ ] **AG3** — Rama `rebuild` en `run-cli.ts`: invoca
      `application.rebuildIndex`, emite el recibo y mapea `ok` → 0,
      `partial`/`failed` → 1.
- [ ] **AG4** — Tests de CLI: recibo bien formado, `--confirm` faltante → 2,
      `partial` → 1, y que `rebuild` sin biblioteca reporte
      `LIBRARY_NOT_FOUND` y sin modelo `MODEL_NOT_INSTALLED` (preflight, no
      un error por video).

## Bloque AH — E2E, documentación y cierre

- [ ] **AH1** — E2E sobre SQLite real (no fakes) con fixture de dos fuentes:
      sincroniza, corrompe deliberadamente un derivado o cambia el
      `parser_version` persistido, corre `rebuild --confirm` y verifica que la
      biblioteca queda idéntica a un `sync` desde cero.
- [ ] **AH2** — Test del índice vectorial: un `rebuild` que termina **sin
      ningún paquete** deja el índice en memoria vacío, no sirviendo vectores
      fantasma desde el snapshot previo (el defecto que 4.4 encontró).
- [ ] **AH3** — Documentar el recibo, los códigos de salida y la
      obligatoriedad de `--confirm` en `docs/cli-contract.md`, sección
      `rebuild`, que hoy tiene sólo dos frases.
- [ ] **AH4** — Enseñar `rebuild` a `skill/SKILL.md`: cuándo corresponde
      correrlo (vectores mezclados, cambio de parser), que **no** es el
      remedio de un `sync` fallido, y la ventana de reconstrucción parcial si
      el proceso muere a mitad.
- [ ] **AH5** — Cerrar el punto en `docs/build.md`, registrar las decisiones
      en `docs/decisions.md` (incluido el cierre sin código del ordenamiento
      por longitud) y actualizar `docs/agent-handoff.md`.

## Riesgos anotados

- **La ventana entre purga y re-sync no es transaccional.** Es deliberado y
  está declarado en el diseño; el remedio es la idempotencia. No intentar
  envolver todo en una transacción: dejaría un `BEGIN IMMEDIATE` abierto
  durante el embedding de la biblioteca entera.
- **`rebuild` es el comando más lento del producto.** Sobre 51 videos con
  lote 1 son varios minutos. Debe emitir progreso por stderr como `sync`, no
  parecer colgado.
- **AG2 modifica un test existente.** Es un cambio intencional del contrato de
  requisitos; no silenciarlo ni ampliarlo más allá de sumar `rebuild`.
