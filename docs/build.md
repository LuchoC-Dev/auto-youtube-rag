# Progreso de construcción

## Estados

- ⚪ Pendiente
- 🔵 En progreso
- ✅ Completado

---

| Fase                       | N°  | Etapa                          | Estado |  %   | Descripción                              |
| -------------------------- | --- | ------------------------------ | :----: | :--: | ---------------------------------------- |
| **1 — Definición**         | 1.1 | Repositorio y contexto inicial |   ✅   | 100% | Git y decisiones documentadas            |
|                            | 1.2 | Contrato de CLI y salidas      |   ✅   | 100% | Comandos, formatos y códigos definidos   |
|                            | 1.3 | Stack y estrategia vectorial   |   ✅   | 100% | Stack y toolchain reproducible aprobados |
| **2 — Implementación MVP** | 2.1 | Indexación incremental         |   🔵   | 70%  | Contextos Markdown estructurados         |
|                            | 2.2 | Recuperación híbrida           |   ⚪   |  0%  | FTS5, vectores y ranking                 |
|                            | 2.3 | Ensamblado de contexto         |   ⚪   |  0%  | Profundidad, citas y presupuesto         |
|                            | 2.4 | Skill general                  |   ⚪   |  0%  | Integración portable con CLI             |
| **3 — Calidad**            | 3.1 | Pruebas funcionales            |   ⚪   |  0%  | Unidad, integración y CLI                |
|                            | 3.2 | Evaluaciones del MVP           |   ⚪   |  0%  | Recall, precisión y cobertura            |

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
- [ ] Registrar múltiples raíces
- [ ] Leer paquetes sin modificarlos
- [ ] Crear unidades jerárquicas
- [ ] Detectar cambios mediante hashes

#### 2.2 Recuperación híbrida

- [ ] Implementar búsqueda FTS5
- [ ] Implementar búsqueda semántica
- [ ] Combinar y diversificar resultados
- [ ] Filtrar por metadatos

#### 2.3 Ensamblado de contexto

- [ ] Expandir unidades padre
- [ ] Deduplicar contenido
- [ ] Aplicar presupuestos por profundidad
- [ ] Preservar citas y limitaciones

#### 2.4 Skill general

- [ ] Crear una skill canónica
- [ ] Invocar la CLI sin lógica de proveedor
- [ ] Verificar uso desde Codex y Claude

### Etapa 3 — Calidad

#### 3.1 Pruebas funcionales

- [ ] Cubrir dominio e indexación
- [ ] Probar SQLite temporal
- [ ] Probar CLI y esquemas de salida
- [ ] Probar actualización y eliminación

#### 3.2 Evaluaciones del MVP

- [ ] Preparar consultas reales
- [ ] Medir recall y precisión
- [ ] Medir cobertura temática
- [ ] Evaluar con Codex y Claude
