# Progreso de construcción

## Estados

- ⚪ Pendiente
- 🔵 En progreso
- ✅ Completado

---

| Fase                       | N°  | Etapa                                   | Estado |  %   | Descripción                                               |
| -------------------------- | --- | --------------------------------------- | :----: | :--: | --------------------------------------------------------- |
| **1 — Definición**         | 1.1 | Repositorio y contexto inicial          |   ✅   | 100% | Git y decisiones documentadas                             |
|                            | 1.2 | Contrato de CLI y salidas               |   ✅   | 100% | Comandos, formatos y códigos definidos                    |
|                            | 1.3 | Stack y estrategia vectorial            |   ✅   | 100% | Stack y toolchain reproducible aprobados                  |
| **2 — Implementación MVP** | 2.1 | Indexación incremental                  |   ✅   | 100% | Sync incremental y CLI verificadas                        |
|                            | 2.2 | Recuperación híbrida                    |   ✅   | 100% | FTS5, vectores y ranking verificados                      |
|                            | 2.3 | Ensamblado de contexto                  |   ✅   | 100% | Expansión, presupuesto, citas y `retrieve`                |
|                            | 2.4 | Skill general                           |   ✅   | 100% | `skill/SKILL.md` verificada en frío                       |
| **3 — Calidad**            | 3.1 | Pruebas funcionales                     |   ✅   | 100% | Dominio, SQLite, CLI y E2E cubiertos                      |
|                            | 3.2 | Evaluaciones del MVP                    |   ✅   | 100% | M, N y O completos; MVP cerrado                           |
| **4 — Posterior al MVP**   | 4.1 | Soporte de `analysis.json` (schema 2.0) |   ✅   | 100% | Bloques P–T completos; validado contra `auto-design` real |
|                            | 4.2 | Instalación: hogar de usuario y `init`  |   ✅   | 100% | Bloques U–Z e Y completos; validado en frío desde cero    |

---

## Detalle por etapa

### Etapa 1 — Definición

#### 1.1 Repositorio y contexto inicial

- [x] Crear el repositorio Git
- [x] Documentar el objetivo y alcance
- [x] Documentar la arquitectura acordada
- [x] Registrar decisiones y asuntos abiertos
- [x] Crear el seguimiento de construcción

#### 1.2 Contrato de CLI y salidas

- [x] Definir comandos y argumentos
- [x] Definir códigos de salida
- [x] Definir formato Markdown
- [x] Definir esquema JSON versionado

#### 1.3 Stack y estrategia vectorial

- [x] Elegir lenguaje y empaquetado
- [x] Evaluar y elegir el modelo local
- [x] Definir límites de dominio y adaptadores
- [x] Comparar búsqueda exacta y sqlite-vec
- [x] Elegir implementación vectorial inicial
- [x] Evaluar clientes SQLite reproduciblemente
- [x] Elegir `node:sqlite` y fijar Node 24.19.0
- [x] Definir comandos de build, test y lint

### Etapa 2 — Implementación MVP

#### 2.1 Indexación incremental

- [x] Definir identidades validadas del dominio
- [x] Definir entidades base de catálogo
- [x] Definir unidades, fragmentos y embeddings
- [x] Definir runs, issues e identidad de contenido
- [x] Definir snapshots y cambio atómico
- [x] Definir puertos de indexación
- [x] Resolver layouts de fuentes
- [x] Leer y validar manifests
- [x] Parsear contextos Markdown
- [x] Parsear reglas JSON
- [x] Seleccionar metadata estable
- [x] Registrar múltiples raíces
- [x] Leer paquetes sin modificarlos
- [x] Crear unidades jerárquicas
- [x] Fragmentar unidades por tokens
- [x] Generar embeddings E5 locales
- [x] Validar el modelo local por smoke
- [x] Detectar cambios mediante hashes

#### 2.2 Recuperación híbrida

- [x] Implementar búsqueda FTS5
- [x] Implementar búsqueda semántica
- [x] Combinar y diversificar resultados
- [x] Filtrar por metadatos

#### 2.3 Ensamblado de contexto

- [x] Expandir unidades padre
- [x] Deduplicar contenido
- [x] Aplicar presupuestos por profundidad
- [x] Preservar citas y limitaciones
- [x] Implementar el comando `retrieve` de la CLI

#### 2.4 Skill general

- [x] Crear una skill canónica
- [x] Invocar la CLI sin lógica de proveedor
- [x] Verificar uso desde Claude (agente en frío, sin contexto previo)
- [ ] Verificar uso desde Codex (agente externo real, pendiente de que el
      usuario la corra)

`skill/SKILL.md` es autocontenida (no depende de rutas relativas a `docs/`)
para poder instalarse fuera de este repositorio. Verificada con dos corridas
de un subagente en frío (sin contexto previo del proyecto, sólo el texto de
la skill) contra una copia temporal de dos videos reales de `auto-design`: la
primera corrida detectó que faltaba documentar `init` como paso previo
obligatorio; corregido, la segunda corrida completó el flujo completo
(`init` → `status` → `source add` → `sync` → `retrieve`) y produjo un bundle
citado correctamente sin inspeccionar `src/`. Cerrado con verificación sólo
en Claude por decisión explícita del usuario; ver `docs/agent-handoff.md`
para el procedimiento de verificación en Codex si hace falta más adelante.

### Etapa 3 — Calidad

#### 3.1 Pruebas funcionales

- [x] Cubrir dominio e indexación
- [x] Probar SQLite temporal
- [x] Probar CLI y esquemas de salida
- [x] Probar actualización y eliminación

#### 3.2 Evaluaciones del MVP

Diseño y checklist fino propuestos y aprobados el 12 de agosto de 2026 en
`docs/eval-design.md` y `docs/eval-tasks.md` (bloques M–O). Sin ground truth
etiquetado: mide en dos capas independientes, mecánica (cobertura, integridad
de citas) y juzgada (rúbrica respondida por Codex y por Claude sobre el mismo
bundle). Checklist fino en `docs/eval-tasks.md`, bloques M–O.

- [x] M1. Verificador de integridad de citas (`evals/citation-integrity.ts`)
- [x] M2. Script de orquestación de consultas semilla (`evals/run-seed-queries.ts`)
- [x] M3. Agregador de métricas de Capa A (`evals/aggregate-mechanical-metrics.ts`)
- [x] M4. Ejecución real sobre `auto-design` (24 bundles en `evals/results/2026-08-12/`; hallazgo de deriva de esquema en 17/51 videos del manifest real, ver `docs/eval-tasks.md`)
- [x] N1. Plantilla de rúbrica (`evals/rubric-template.md`)
- [x] N2. Juicio de Claude (`evals/results/2026-08-12/judgments/claude/`, subagente en frío)
- [x] N3. Juicio de Codex (`evals/results/2026-08-12/judgments/codex/`, corrido por el usuario)
- [x] N4. Comparación Codex vs. Claude (9/24 pares divergen, sólo por ambigüedad de rúbrica, ver `evals/results/2026-08-12/report.md`)
- [x] O1. Decisión sobre pesos RRF y presupuestos (defaults mantenidos sin
      cambios; evidencia y razonamiento en `docs/decisions.md`, sección
      "Decisión de calibración (O1, punto 3.2)")
- [x] O2. Reporte final y cierre de 3.2
      (`evals/results/2026-08-12/report.md`)

MVP completo: 2.1–2.4 y 3.1–3.2 están al 100%. Decisión de calibración de
O1 y hallazgos accionables de 3.2 en
`evals/results/2026-08-12/report.md` y `docs/decisions.md`. Trabajo
posterior razonable (piso de similitud vectorial, MCP, interfaz web,
paquetes de páginas web) queda fuera de este MVP, documentado en
`docs/agent-handoff.md`, no como pendiente urgente. El soporte de
`analysis.json`/schema 2.0, el primer frente de trabajo posterior, ya se
implementó y validó — ver 4.1 abajo.

### Etapa 4 — Posterior al MVP

#### 4.1 Soporte de `analysis.json` (schema 2.0)

Diseño propuesto y aprobado el 13 de agosto de 2026 en
`docs/analysis-schema-design.md`, checklist fino en
`docs/analysis-schema-tasks.md` (bloques P–T). Motivo: la skill productora
`youtube-video-context` reemplazó `rules.json`/schema 1.0 por
`analysis.json`/schema 2.0 el 2 de agosto de 2026; `auto-youtube-rag` nunca
soportó el esquema nuevo, así que los 17 videos reales de `auto-design`
generados con la skill actual —y todo video futuro— quedan fuera de la
biblioteca. Decisiones cerradas: ambos esquemas se sostienen
indefinidamente; `topics`/`recommendations` reutilizan las secciones fijas
ya publicadas del bundle sin agregar una cuarta; la migración SQLite edita
`001-initial.ts` in place (no existe base real que preservar). Detalle
completo en `docs/decisions.md`.

- [x] P1–P3. Contratos de dominio y aplicación
- [x] Q1. Parser de `analysis.json`
- [x] R1–R2. Lectura de paquete y unidades de conocimiento
- [x] S1–S3. Migración SQLite, bucketing y E2E con fixtures
- [x] T1–T3. Validación real sobre `auto-design` y cierre

Cerrado el 13 de agosto de 2026. Validación real (bloque T) contra una
copia temporal de la colección real `auto-design` (51 videos, incluidos
los 17 con `analysis.json`) con el modelo E5 real: los 51 paquetes se
indexaron sin ningún `issue`, `doctor` reportó los cinco checks en `ok`, y
el digest SHA-256 del árbol fuente fue idéntico antes/después de `sync`.
Una consulta semilla nueva (`es-analysis-neumorphism-accessibility`)
orientada específicamente a contenido de `analysis.json` produjo un bundle
real donde una cita resolvió a una unidad `analysis_topic` con procedencia
correcta. `design-catalog` no se validó explícitamente: su manifest no
declara ningún video con `resources.analysis`, así que no ejercita este
trabajo. Detalle completo en `docs/decisions.md`, sección "Soporte de
`analysis.json` (schema 2.0): implementado y validado".

#### 4.2 Instalación: hogar de usuario, `init` instalador y preflight

Origen: la corrida de verificación en frío del 13 de agosto falló con 63
issues `MODEL_LOAD_FAILED` y expuso que **nunca se había decidido cómo se
instala el producto**. El único instalador era el arnés de benchmarks, que
no existe fuera del repositorio clonado, y cuatro lugares distintos
calculaban la ruta del modelo con reglas incompatibles.

- [x] U1–U2. Resolutor de rutas compartido, recibo y estado del modelo
- [x] V1–V3. Eliminación de los tres defaults duplicados de `cwd`
- [x] W1–W4. Puerto, adaptador de descarga y copia desde `--from`
- [x] X1–X5. `models` e `init` en la CLI, `main.ts` y `doctor` alineados
- [x] Z1–Z4. Preflight de requisitos y traducción de fallos de estado
- [x] Y1–Y3. Smoke real, validación en frío y cierre

Cerrado el 14 de agosto de 2026. Diseño en `docs/install-design.md`,
checklist en `docs/install-tasks.md`, decisiones en `docs/decisions.md`.

**Validación en frío (Y2)**: un subagente sin contexto previo, con acceso
sólo a `skill/SKILL.md` y sus referencias, partió de una máquina sin hogar
de usuario y llegó de cero a una respuesta citada. Instaló con
`init --from`, registró `catalog-design`, indexó los 12 videos en 3 min
54 s sin ningún `issue` y recuperó un bundle de 54 unidades con cero citas
huérfanas. **No copió ningún archivo a mano ni relanzó ningún `sync`** —las
dos cosas que había hecho la corrida anterior—, y encontró la bandera
`--from` leyendo la skill, sin ayuda.

Dos hallazgos de la corrida:

1. **`doctor` daba un parte falso de salud** ante un modelo truncado:
   detectaba con `readdir(...).length > 0` aunque su mensaje ya apuntaba a
   `models install`. Corregido; `runDoctor` recibe el estado ya resuelto.
2. **El marcador de cita de `context.md` se lee mal.** Es de cierre y el
   agente lo interpretó como de apertura, produciendo un resumen con
   procedencia equivocada pese a que las 54 citas resuelven y no hay
   huérfanas. Reprodujo dos veces, incluso leyendo el bundle entero de una
   sola vez. Queda registrado como pendiente de decisión: cambiarlo toca el
   contrato de `cli-contract.md`.
