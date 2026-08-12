# Tareas de ensamblado de contexto

## Estado

Checklist aprobado el 12 de agosto de 2026 para el punto 2.3, junto con las
seis decisiones de diseño de
[context-assembly-design.md](context-assembly-design.md#decisiones-aprobadas-el-12-de-agosto-de-2026).
Listo para iniciar la implementación en orden I1–L3. Continúa la numeración de
[retrieval-tasks.md](retrieval-tasks.md), que cerró en H5.

## Convenciones de ejecución

Se mantienen las de 2.1 y 2.2:

- ejecutar una tarea por vez y mantener su commit enfocado;
- escribir primero la prueba o criterio ejecutable que falle;
- ejecutar la verificación específica y después `npm run build` y
  `npm run check`;
- marcar `[x]` y actualizar [build.md](build.md) sólo con todos los criterios
  satisfechos;
- no descargar modelos ni acceder a la red desde la suite rápida;
- no añadir dependencias ni cambiar contratos aprobados sin actualizar antes
  la especificación;
- ninguna tarea modifica más de cinco archivos.

Regla propia de 2.3: **ninguna tarea introduce escrituras en SQLite ni en las
fuentes**. Sólo se escribe el bundle de salida (`context.md`/`result.json`),
y únicamente en la tarea de escritura del bloque K.

## Bloque I — Contratos de ensamblado

### I1. Presupuesto por profundidad

- [x] Crear `ContextDepth` y `resolveTokenBudget` en el dominio.
  - Depende de: ninguna dependencia nueva de 2.3 (usa sólo tipos existentes).
  - Aceptación: `focused` = 12 000, `balanced` = 32 000, `deep` = 64 000;
    `--max-tokens` (override) reemplaza el número sin alterar los nombres
    públicos; un override no entero, cero o negativo se rechaza con
    `DomainValidationError`; sin override, `balanced` es el valor por
    defecto cuando no se especifica profundidad.
  - Verificar: `node --import tsx --test test/domain/context/context-budget.test.ts`
    y `npm run check`.
  - Archivos: `src/domain/context/context-budget.ts`,
    `test/domain/context/context-budget.test.ts`.

### I2. Tipos de solicitud y bundle

- [x] Declarar `ContextRequest`, `ContextUnitBlock`, `BudgetAllocation`,
      `CitationRecord` y los tipos de salida (`ContextBundle`,
      `ContextResultDocument`).
  - Depende de: I1.
  - Aceptación: ninguna firma expone tipos de SQLite, Transformers.js ni
    `node:fs`; `ContextUnitBlock` distingue `origin: "candidate" | "ancestor"`
    y transporta `tokenCount` ya calculado; `CitationRecord` refleja
    exactamente el esquema de cita de `cli-contract.md`.
  - Verificar: `npm run typecheck` y `npm run lint`.
  - Archivos: `src/application/context/context-request.ts`,
    `src/application/context/context-blocks.ts`,
    `src/application/context/context-bundle.ts`.

Checkpoint I: `npm run build && npm run check` sin cargar SQLite ni
Transformers.js.

## Bloque J — Expansión, deduplicación y presupuesto

### J1. Expansión a unidades padre

- [x] Implementar la función pura que combina candidatos y ancestros ya
      resueltos en bloques citables sin duplicados.
  - Depende de: I2.
  - Aceptación: cada `unitId` produce un único bloque aunque llegue como
    candidato y como ancestro de otro candidato a la vez; el bloque de un
    `unitId` que es candidato conserva `origin: "candidate"` y su
    `fusedScore`; un ancestro nunca pisa un candidato ya construido;
    determinista ante el mismo par de listas de entrada.
  - Nota de implementación: las llamadas a `knowledgeRepository.getUnits` y
    `knowledgeRepository.getAncestors` ocurren en el caso de uso (bloque K3),
    no aquí; esta función recibe ya resueltos `candidates: readonly
RetrievalCandidate[]`, `candidateUnits: ReadonlyMap<string,
KnowledgeUnit>` (clave = `unitId.value`, para conocer el `parentId` de
    cada candidato) y `ancestorUnits: readonly KnowledgeUnit[]`. Un bloque de
    ancestro hereda `packageRef`/`documentKind`/`documentRelativePath`/
    `videoTitle`/`creator`/`canonicalUrl`/`language` del candidato cuya cadena
    lo trajo, porque `KnowledgeUnit` no transporta esa metadata y un ancestro
    nunca cruza de documento.
  - Verificar: `node --import tsx --test test/application/context/expand-to-ancestors.test.ts`
    y `npm run check`.
  - Archivos: `src/application/context/expand-to-ancestors.ts`,
    `test/application/context/expand-to-ancestors.test.ts`.

### J2. Deduplicación por contenido

- [x] Añadir la deduplicación secundaria por `contentHash` sobre la salida de
      J1.
  - Depende de: J1.
  - Aceptación: dos bloques con `contentHash` idéntico bajo `unitId`
    distintos colapsan en uno solo; se conserva el primero según el orden de
    entrada (candidatos por `fusedScore` antes que ancestros); el bloque
    omitido no genera cita ni aparece en `coverage`.
  - Verificar: `node --import tsx --test test/application/context/deduplicate-blocks.test.ts`
    y `npm run check`.
  - Archivos: `src/application/context/deduplicate-blocks.ts`,
    `test/application/context/deduplicate-blocks.test.ts`.

### J3. Presupuesto y truncamiento

- [x] Implementar `allocateBudget` sobre la secuencia ordenada de bloques.
  - Depende de: J1, J2, I1.
  - Aceptación: orden fijo (documento/sección por `fusedScore` desc, luego
    reglas/patrones por `fusedScore` desc, luego ancestros por `fusedScore`
    del candidato de origen desc y `depth` desc, padre inmediato antes que
    abuelo); nunca corta un bloque a la
    mitad; incluye el primer bloque aunque exceda el presupuesto por sí solo
    y marca `budgetExhausted` de inmediato; `omittedCount` y
    `estimatedTokens` son exactos; determinista.
  - Verificar: `node --import tsx --test test/application/context/allocate-budget.test.ts`
    y `npm run check`.
  - Archivos: `src/application/context/allocate-budget.ts`,
    `test/application/context/allocate-budget.test.ts`.

### J4. Asignación de citas

- [x] Implementar `assignCitations` sobre los bloques finalmente incluidos.
  - Depende de: J3.
  - Aceptación: IDs `S01`, `S02`... secuenciales y sin huecos en el orden
    final de inclusión; un bloque omitido por presupuesto nunca reserva
    número; dos bloques del mismo video con `headingPath` distinto reciben
    citas distintas; cada `CitationRecord` incluye el primer timestamp si
    existe y toda la evidencia visual del bloque.
  - Verificar: `node --import tsx --test test/application/context/assign-citations.test.ts`
    y `npm run check`.
  - Archivos: `src/application/context/assign-citations.ts`,
    `test/application/context/assign-citations.test.ts`.

Checkpoint J: las cuatro políticas puras pasan sin instanciar SQLite, sin
`node:fs` y sin el generador de embeddings.

## Bloque K — Redacción, escritura y caso de uso

### K1. Redacción de `context.md`

- [x] Implementar `renderContextMarkdown` como función pura.
  - Depende de: J1–J4, I1.
  - Aceptación: produce front-matter y las seis secciones fijas de
    `cli-contract.md` en el orden aprobado; cada bloque incluido muestra su
    contenido íntegro seguido del marcador `[S0N]`; "Coverage and
    limitations" sólo describe señales reales (`warnings`, `budgetExhausted`,
    `omittedCount`, filtros aplicados); "Source registry" lista cada
    `packageRef` distinto sin repetir; los encabezados técnicos están en
    inglés y el contenido citado conserva su idioma original.
  - Verificar: `node --import tsx --test test/application/context/render-context-markdown.test.ts`
    y `npm run check`.
  - Archivos: `src/application/context/render-context-markdown.ts`,
    `test/application/context/render-context-markdown.test.ts`.

### K2. Redacción de `result.json`

- [x] Implementar `renderContextResult` como función pura.
  - Depende de: J1–J4, I1.
  - Aceptación: valida contra el esquema de `cli-contract.md`
    (`schema_version`, `status`, `request`, `metrics`, `units`, `sources`,
    `coverage`, `warnings`, `limitations`); `status` es `"no_results"` cuando
    no hay bloques incluidos; todo `[S0N]` de `context.md` resuelve a un
    elemento de `units`/citas y viceversa; `limitations` nunca inventa una
    causa no respaldada por una señal real.
  - Verificar: `node --import tsx --test test/application/context/render-context-result.test.ts`
    y `npm run check`.
  - Archivos: `src/application/context/render-context-result.ts`,
    `test/application/context/render-context-result.test.ts`.

### K3. Caso de uso `assembleContext`

- [x] Orquestar `retrieveCandidates`, `getAncestors`, expansión,
      deduplicación, presupuesto, citas y redacción.
  - Depende de: J1–J4, K1, K2, H2 (2.2).
  - Aceptación: llama `getAncestors` una sola vez por lote con los `unitId`
    de todos los candidatos; propaga `RetrievalOutcome.warnings` al bundle;
    una consulta `no_results` produce igual un bundle válido explicando la
    ausencia de evidencia; sólo conoce puertos (`KnowledgeRepository`), nunca
    SQLite ni `node:fs` directamente.
  - Verificar: `node --import tsx --test test/application/context/assemble-context.test.ts`
    y `npm run check`.
  - Archivos: `src/application/context/assemble-context.ts`,
    `test/fakes/fake-knowledge-repository.ts` (extender si falta algo),
    `test/application/context/assemble-context.test.ts`.

### K4. Escritura del bundle

- [ ] Implementar `writeContextBundle` en infraestructura.
  - Depende de: K3.
  - Aceptación: crea `<outputDir>/<request_id>/context.md` y `result.json`;
    `request_id` usa el mismo generador ad-hoc que `SyncId`, inyectable para
    pruebas deterministas; sin `--out` usa `os.tmpdir()`; una ruta de salida
    ya ocupada por otro `request_id` falla explícitamente en vez de
    mezclarse; no escribe nada fuera del subdirectorio del `request_id`.
  - Verificar: `node --import tsx --test test/infrastructure/filesystem/write-context-bundle.test.ts`
    y `npm run check`.
  - Archivos: `src/infrastructure/filesystem/write-context-bundle.ts`,
    `test/infrastructure/filesystem/write-context-bundle.test.ts`.

Checkpoint K: `assembleContext` + `writeContextBundle` producen un bundle
válido sobre una base temporal real, sin tocar las fuentes registradas.

## Bloque L — CLI y verificación

### L1. Comando `retrieve`

- [ ] Extender `parse-command.ts`, `run-cli.ts` y el composition root.
  - Depende de: K3, K4.
  - Aceptación: acepta `<query>`, `--depth`, `--max-tokens`, `--source`
    (repetible), `--out`; construye `RetrievalQuery`/`RetrievalFilter`/
    `RetrievalLimits` con los valores por defecto de 2.2; emite el recibo
    compacto exacto de `cli-contract.md` en `stdout` y progreso en `stderr`;
    código `0` para `ok`/`no_results`, `1` para `partial`, `2` para uso
    inválido; `Application` expone `assembleContext` reemplazable igual que
    `retrieveCandidates`.
  - Verificar: `node --import tsx --test test/interfaces/cli/parse-command.test.ts`,
    `node --import tsx --test test/interfaces/cli/run-cli.test.ts` y
    `npm run check`.
  - Archivos: `src/interfaces/cli/parse-command.ts`,
    `src/interfaces/cli/run-cli.ts`, `src/main/create-application.ts`.

### L2. Integración extremo a extremo

- [ ] Verificar el ciclo completo sobre la colección temporal reproducible.
  - Depende de: L1.
  - Aceptación: `retrieve` sobre una biblioteca sincronizada escribe un
    bundle válido y consistente con `RetrievalOutcome`; `--depth focused` con
    una consulta amplia produce menos tokens que `--depth deep` con la misma
    consulta; `--source` repetido filtra correctamente; una consulta sin
    coincidencias produce `status: "no_results"` con bundle igual escrito;
    el árbol fuente conserva su digest SHA-256; no hay accesos de red.
  - Verificar: `node --import tsx --test test/e2e/context-assembly.e2e.test.ts`,
    `npm run test:coverage`, `npm run build` y `npm run check`.
  - Archivos: `test/e2e/context-assembly.e2e.test.ts`.

### L3. Documentación y cierre

- [ ] Actualizar la documentación del proyecto para reflejar 2.3 completo.
  - Depende de: L2.
  - Aceptación: `build.md` marca 2.3 al 100%; `decisions.md` registra las
    decisiones aprobadas en la sección final de
    `context-assembly-design.md`; `agent-handoff.md` refleja el estado real
    y el siguiente bloque recomendado (evaluaciones 3.x); `cli-contract.md`
    se actualiza sólo si la implementación reveló una aclaración necesaria,
    nunca un cambio de contrato sin aprobación.
  - Verificar: `npm run check` y revisión manual del worktree.
  - Archivos: `docs/build.md`, `docs/decisions.md`, `docs/agent-handoff.md`.

Checkpoint L: `retrieve` queda disponible y anunciado; los diez puntos del
criterio de éxito del relevo en `agent-handoff.md` siguen siendo explicables,
más el ensamblado de contexto.

## Cierre del punto 2.3

Cuando I1–L3 estén completas:

1. ejecutar `npm run build`, `npm run check`, `npm run test:coverage` y
   `npm run test:embedding:smoke`;
2. decidir junto al usuario si corresponde una recuperación manual sobre la
   colección real `auto-design` con el modelo E5 real (pendiente también
   desde el cierre de 2.2, ver `agent-handoff.md`);
3. verificar que el digest del árbol fuente no cambió;
4. actualizar `build.md` sólo si las capacidades de 2.3 están verificadas;
5. revisar que el worktree no contenga bases, modelos ni artefactos locales;
6. no avanzar a 3.x sin aprobar antes su propio alcance.

## Decisiones aprobadas para las tareas

1. Ejecutar las trece tareas en orden I1–L3, respetando dependencias.
2. Las seis decisiones de diseño de `context-assembly-design.md` quedaron
   aprobadas el 12 de agosto de 2026, incluida la deduplicación por
   `contentHash` desde J2 (no se pospone).
3. Mantener los presupuestos `focused`/`balanced`/`deep` sin recalibrar en
   este punto.
4. No añadir dependencias nuevas (`request_id` sigue el patrón ad-hoc de
   `SyncId`).
5. Exigir `npm run build` y `npm run check` en cada commit, además del test
   específico.
