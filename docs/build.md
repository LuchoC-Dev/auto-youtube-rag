# Progreso de construcción

## Estados

- ⚪ Pendiente
- 🔵 En progreso
- ✅ Completado

---

| Fase                       | N°  | Etapa                          | Estado |  %   | Descripción                                |
| -------------------------- | --- | ------------------------------ | :----: | :--: | ------------------------------------------ |
| **1 — Definición**         | 1.1 | Repositorio y contexto inicial |   ✅   | 100% | Git y decisiones documentadas              |
|                            | 1.2 | Contrato de CLI y salidas      |   ✅   | 100% | Comandos, formatos y códigos definidos     |
|                            | 1.3 | Stack y estrategia vectorial   |   ✅   | 100% | Stack y toolchain reproducible aprobados   |
| **2 — Implementación MVP** | 2.1 | Indexación incremental         |   ✅   | 100% | Sync incremental y CLI verificadas         |
|                            | 2.2 | Recuperación híbrida           |   ✅   | 100% | FTS5, vectores y ranking verificados       |
|                            | 2.3 | Ensamblado de contexto         |   ✅   | 100% | Expansión, presupuesto, citas y `retrieve` |
|                            | 2.4 | Skill general                  |   ✅   | 100% | `skill/SKILL.md` verificada en frío        |
| **3 — Calidad**            | 3.1 | Pruebas funcionales            |   ✅   | 100% | Dominio, SQLite, CLI y E2E cubiertos       |
|                            | 3.2 | Evaluaciones del MVP           |   ⚪   |  0%  | Recall, precisión y cobertura              |

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

- [ ] Preparar consultas reales
- [ ] Medir recall y precisión
- [ ] Medir cobertura temática
- [ ] Evaluar con Codex y Claude
