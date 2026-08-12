# Tareas de evaluaciones del MVP

## Estado

Checklist propuesto y aprobado el 12 de agosto de 2026 para el punto 3.2.
Continúa la numeración conceptual de `retrieval-tasks.md` (F–H) y
`context-assembly-tasks.md` (I–L) con los bloques M–O.

## Convenciones de ejecución

Se mantienen sin cambios las de 2.1–2.3:

- ejecutar una tarea por vez y mantener su commit enfocado;
- escribir primero la prueba o criterio ejecutable que falle, cuando la tarea
  produce código en `src/`/`evals/`;
- ejecutar la verificación específica y después `npm run build` y
  `npm run check`;
- marcar `[x]` y actualizar [build.md](build.md) sólo con todos los criterios
  satisfechos;
- no descargar modelos ni acceder a la red desde la suite rápida;
- ninguna tarea modifica más de cinco archivos.

Regla propia de 3.2: **ninguna tarea toca `src/domain`, `src/application` ni
el contrato público de la CLI**, salvo la tarea O1 si —y sólo si— la
evidencia recogida en M–N justifica ajustar pesos de RRF o presupuestos por
profundidad, y sólo detrás de las interfaces ya sustituibles
(`FusionStrategy`, `--max-tokens`).

## Bloque M — Instrumentación mecánica (Capa A)

### M1. Verificador de integridad de citas

- [x] Implementar una función pura que, dado un bundle (`markdown` +
      `ContextResultDocument`), detecte citas huérfanas (`[S0N]` en el
      Markdown sin `citation_id` correspondiente en `result.json.units`) y
      unidades sin cita (`citation_id` en `result.json.units` que no aparece
      en el Markdown).
  - Depende de: `ContextBundle` (2.3, ya existente).
  - Aceptación: un bundle bien formado no reporta descalces; un bundle con una
    cita huérfana inyectada a mano falla con el `citation_id` exacto; un
    bundle con una unidad sin cita inyectada a mano falla igual; no requiere
    SQLite ni el modelo real.
  - Verificar: `node --import tsx --test test/evals/citation-integrity.test.ts`
    y `npm run check`.
  - Archivos: `evals/citation-integrity.ts`,
    `test/evals/citation-integrity.test.ts`.

### M2. Script de orquestación de consultas semilla

- [x] Implementar un script que, dado un directorio de colección ya
      sincronizado, ejecute las ocho consultas de `seed-queries.json` en las
      tres profundidades usando la `Application` real (`assembleContext`), y
      vuelque cada bundle bajo
      `evals/results/<fecha>/<query-id>/<depth>/{context.md,result.json}`.
  - Depende de: M1, `Application.assembleContext` (2.3, ya existente).
  - Aceptación: genera los 24 bundles sin duplicar código de `run-cli.ts`
    (reutiliza `writeContextBundle` y `assembleContext` directamente, no pasa
    por el binario CLI); corre `M1` sobre cada bundle generado y aborta con
    mensaje explícito si encuentra un descalce; no escribe fuera de
    `evals/results/`; acepta la ruta de colección y la fecha como argumentos,
    sin rutas hardcodeadas al equipo del autor.
  - Verificar: `npm run check` y `npm run build`; la ejecución real contra la
    colección temporal se hace manualmente en M4, no en este paso.
  - Archivos: `evals/run-seed-queries.ts`.

### M3. Agregador de métricas de Capa A

- [x] Implementar una función que, dados los 24 `result.json` generados,
      produzca la tabla de Capa A del reporte (estado vs. `kind` esperado,
      cobertura, `budget_exhausted`, advertencias).
  - Depende de: M2.
  - Aceptación: produce una tabla Markdown por consulta × profundidad;
    señala explícitamente cualquier consulta cuyo `status` no coincide con lo
    esperable por su `kind` (sin bloquear el reporte: es una señal a revisar
    en la Capa B, no un fallo automático salvo el caso de integridad de citas
    ya cubierto en M1).
  - Verificar: `node --import tsx --test test/evals/aggregate-mechanical-metrics.test.ts`
    y `npm run check`, sobre resultados de ejemplo fijos, no sobre la
    colección real.
  - Archivos: `evals/aggregate-mechanical-metrics.ts`,
    `test/evals/aggregate-mechanical-metrics.test.ts`.

### M4. Ejecución real sobre `auto-design`

- [ ] Correr M2 sobre una copia temporal de la colección real con el modelo
      E5 real y guardar los 24 bundles.
  - Depende de: M1–M3.
  - Aceptación: digest SHA-256 del árbol fuente idéntico antes y después;
    `evals/results/<fecha>/` contiene los 24 bundles y la tabla de M3 sin
    descalces de citas; la copia temporal y su base SQLite se eliminan al
    terminar; ningún archivo de la colección ni el índice queda comprometido
    al repositorio.
  - Verificar: revisión manual del worktree (`git status --short` limpio
    salvo `evals/results/<fecha>/`) y lectura cualitativa rápida de al menos
    dos bundles.
  - Archivos: `evals/results/<fecha>/` (generado, no manual).

Checkpoint M: los 24 bundles reales existen, pasan integridad de citas y la
tabla de Capa A está lista para alimentar el reporte final.

## Bloque N — Juicio de Capa B

### N1. Plantilla de rúbrica

- [ ] Redactar la plantilla que un juez (Claude o Codex) completa por bundle:
      precisión aparente, cobertura suficiente, brecha percibida,
      coincidencia con `expected.notes`.
  - Depende de: M4 (necesita bundles reales para validar que la plantilla es
    completable sin ambigüedad).
  - Aceptación: cada campo tiene su formato exacto (número, escala 1–5, texto
    libre, sí/no/parcial) y un ejemplo resuelto sobre un bundle real; la
    plantilla no asume que el juez vea la colección completa.
  - Verificar: revisión manual; no aplica test automatizado.
  - Archivos: `evals/rubric-template.md`.

### N2. Juicio de Claude

- [ ] Completar la rúbrica de N1 para los 24 bundles con Claude como juez.
  - Depende de: N1.
  - Aceptación: 24 rúbricas completas, una por bundle, guardadas en
    `evals/results/<fecha>/judgments/claude/`.
  - Verificar: revisión manual de que ninguna rúbrica quedó incompleta.
  - Archivos: `evals/results/<fecha>/judgments/claude/*.md` (generado).

### N3. Juicio de Codex

- [ ] Completar la rúbrica de N1 para los mismos 24 bundles con Codex como
      juez, sin que Codex vea las respuestas de Claude de antemano.
  - Depende de: N1, mismos bundles que N2.
  - Aceptación: 24 rúbricas completas guardadas en
    `evals/results/<fecha>/judgments/codex/`.
  - Verificar: revisión manual de que ninguna rúbrica quedó incompleta.
  - Archivos: `evals/results/<fecha>/judgments/codex/*.md` (generado).

### N4. Comparación Codex vs. Claude

- [ ] Comparar las 24 parejas de rúbricas y señalar discrepancias
      (precisión aparente fuera de ±0.2, cobertura suficiente fuera de ±1, o
      coincidencia con `expected.notes` divergente).
  - Depende de: N2, N3.
  - Aceptación: tabla de comparación por consulta × profundidad con las
    discrepancias resaltadas; cada discrepancia trae una hipótesis breve
    (¿problema del bundle o de interpretación del agente?).
  - Verificar: revisión manual.
  - Archivos: sección "Comparación Codex vs. Claude" de
    `evals/results/<fecha>/report.md`.

Checkpoint N: las 48 rúbricas (24 por juez) existen y la comparación está
lista.

## Bloque O — Decisión de calibración y cierre

### O1. Decisión sobre pesos RRF y presupuestos

- [ ] Revisar M3 y N4 en conjunto y decidir si hay evidencia suficiente para
      cambiar `k`/`wText`/`wVector` o los presupuestos por profundidad.
  - Depende de: M4, N4.
  - Aceptación: si hay evidencia, el cambio se implementa detrás de
    `FusionStrategy`/`ContextBudget` ya existentes (sin tocar dominio, casos
    de uso ni CLI) y se documenta en `docs/decisions.md` con la evidencia
    concreta; si no hay evidencia suficiente, se documenta igual la decisión
    de mantener los defaults, con el mismo nivel de detalle.
  - Verificar: si hubo cambio de código, `npm run check`, `npm run build` y
    reejecución de M2 sobre los mismos bundles para confirmar el efecto;
    revisión manual si no hubo cambio.
  - Archivos: `docs/decisions.md`, y sólo si aplica,
    `src/application/retrieval/rrf-fusion.ts` (valores por defecto) o
    `src/domain/context/context-budget.ts` (presets).

### O2. Reporte final y cierre de 3.2

- [ ] Redactar `evals/results/<fecha>/report.md` con resumen ejecutivo, las
      tablas de M3 y N4, los hallazgos accionables y la decisión de O1.
      Actualizar `build.md` y `agent-handoff.md`.
  - Depende de: O1.
  - Aceptación: `build.md` marca 3.2 al 100%; `agent-handoff.md` refleja el
    MVP completo (2.1–2.4 y 3.1–3.2) y documenta cualquier trabajo posterior
    razonable (p. ej. web, MCP, umbral de similitud) como explícitamente
    fuera de este MVP, no como pendiente urgente.
  - Verificar: `npm run check` y revisión manual del worktree.
  - Archivos: `evals/results/<fecha>/report.md`, `docs/build.md`,
    `docs/agent-handoff.md`.

Checkpoint O: MVP completo según `product-spec.md`.

## Cierre del punto 3.2 y del MVP

Cuando M1–O2 estén completas:

1. ejecutar `npm run build`, `npm run check` y `npm run test:coverage`;
2. confirmar que `evals/results/<fecha>/` es el único rastro nuevo en el
   worktree además de los archivos de `docs/` y `evals/*.ts` listados arriba;
3. confirmar que ninguna colección, base SQLite temporal ni modelo quedó
   comprometido al repositorio;
4. actualizar `build.md` y `agent-handoff.md` sólo con las seis condiciones
   del criterio de cierre de `eval-design.md` satisfechas;
5. el MVP completo queda cerrado; cualquier extensión (MCP, API, web,
   umbral de similitud, recalibración futura) es trabajo de una etapa
   posterior, no de este punto.

## Decisiones solicitadas para aprobar las tareas

1. Ejecutar las nueve tareas en orden M1–O2, respetando dependencias.
2. Medir en dos capas independientes (mecánica y juzgada) en vez de perseguir
   un recall/precisión clásico sin ground truth etiquetado.
3. Ambos jueces (Codex y Claude) evalúan exactamente los mismos 24 bundles,
   nunca corridas de `retrieve` independientes por agente.
4. No barrer pesos de RRF ni presupuestos a ciegas: sólo se ajustan con
   evidencia concreta de M–N, documentada en `decisions.md`.
5. Exigir `npm run build` y `npm run check` en cada commit de código, además
   del test específico; las tareas puramente manuales (M4, N1–N4, O2) no
   producen commits de código pero sí se registran en `build.md`.
