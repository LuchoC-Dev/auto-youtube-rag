# Arquitectura acordada

## Principio rector

El sistema usa una arquitectura centrada en el dominio con puertos y
adaptadores. Las reglas de indexación, recuperación y ensamblado permanecen
independientes de modelos, bases de datos, librerías y agentes concretos.

```text
interfaces/cli ──→ application ──→ domain
                         ↑
infrastructure/adapters ─┘
```

`domain` no importa ninguna capa externa. `application` orquesta el dominio y
declara los puertos que necesita. `infrastructure` implementa esos puertos. La
CLI recibe entradas y presenta salidas, mientras `main` selecciona y conecta
los adaptadores concretos.

## Límites de módulos

| Módulo | Contiene | No puede conocer |
| --- | --- | --- |
| Dominio | entidades, value objects, reglas y políticas | SQLite, E5, ONNX, CLI |
| Aplicación | casos de uso, DTO internos y puertos | implementaciones concretas |
| Infraestructura | SQLite, FTS5, E5 Small y búsqueda vectorial | decisiones de presentación |
| Interfaces | comandos, validación y formatos públicos | detalles internos de adaptadores |
| Main | configuración y composition root | reglas de negocio nuevas |

Los puertos mínimos previstos son `EmbeddingGenerator`, `KnowledgeRepository`,
`TextSearchIndex` y `VectorSearchIndex`. Sus nombres y firmas definitivos se
especificarán antes de implementar, pero su responsabilidad y dirección de
dependencias son requisitos aprobados.

## Flujo general

```text
Paquetes validados en varias raíces
              ↓
       indexador incremental
              ↓
  SQLite + FTS5 + índice exacto en memoria
              ↓
 recuperación híbrida de alta cobertura
              ↓
 expansión jerárquica y deduplicación
              ↓
  paquete Markdown + resultado JSON
              ↓
         agente consultante
```

## Responsabilidades

### Skill general

- Explicar cuándo y cómo invocar la CLI.
- Elegir la profundidad solicitada.
- Entregar el resultado al agente.
- No implementar recuperación ni lógica específica de un proveedor.

### CLI

- Validar argumentos y configuración.
- Administrar raíces, indexación, búsqueda y diagnóstico.
- Emitir salidas estables y códigos de proceso previsibles.
- No generar respuestas mediante un LLM.

### Indexador

- Leer `manifest.json`, `context.md`, `rules.json` y `metadata.json`.
- Crear unidades internas por documento, sección y regla.
- Calcular hashes y embeddings solamente cuando cambie el contenido.
- Mantener relaciones padre-hijo sin escribir en los paquetes fuente.

### Recuperador

- Combinar FTS5, similitud semántica y filtros.
- Recuperar inicialmente un conjunto amplio de candidatos.
- Expandir coincidencias a secciones o documentos padre.
- Diversificar por video y eliminar duplicados.

### Ensamblador de contexto

- Respetar la profundidad y el presupuesto configurados.
- Organizar el material por tema y relevancia.
- Preservar procedencia y limitaciones.
- Generar Markdown para consumo directo y JSON para integración.

## Índice jerárquico

```text
Colección
  └─ Video
      ├─ Documento context.md completo
      │   └─ Secciones y subsecciones
      └─ rules.json
          └─ Patrones y reglas
```

La jerarquía permite buscar con unidades pequeñas y devolver unidades amplias.
No se crean documentos intermedios en las carpetas de origen.

## Persistencia y portabilidad

SQLite es la persistencia confirmada para el MVP. FTS5 constituye la capa
textual inicial. Ambos se implementan fuera del dominio. Los embeddings se
almacenan junto con:

- identificador de modelo;
- versión;
- dimensión;
- hash del contenido;
- fecha de indexación.

La implementación aprobada de `VectorSearchIndex` carga los BLOB persistidos en
un bloque contiguo `Float32Array` y ejecuta búsqueda exacta desde la aplicación.
Los vectores de E5 Small están normalizados, por lo que ordenar por distancia L2
produce el mismo ranking que similitud coseno. El índice en memoria se reconstruye
al iniciar y se actualiza después de confirmar cambios persistidos.

`sqlite-vec` no forma parte del runtime del MVP. Permanece como benchmark y como
posible adaptador futuro si la memoria o el tiempo de carga se convierten en un
problema. Una migración futura no debe cambiar la CLI, la skill ni el dominio.

E5 Small es el generador de embeddings aprobado para el MVP y vive en un
adaptador de infraestructura. El identificador de modelo, versión y dimensión
forman parte de la metadata del índice para detectar cuándo una sustitución
requiere reindexación. Cambiar el modelo no modifica los casos de uso.

## Verificación de desacoplamiento

- El dominio se prueba sin cargar SQLite, ONNX ni Transformers.js.
- Los casos de uso se prueban con implementaciones en memoria de los puertos.
- Cada adaptador ejecuta una suite de contrato compartida.
- Las pruebas de integración verifican el wiring real desde el composition root.
- Ningún tipo de una dependencia externa cruza un puerto público.

## Recuperación y ensamblado

```text
consulta
  → expansión y normalización
  → candidatos textuales y semánticos
  → combinación de puntuaciones
  → agrupación por tema, sección y video
  → expansión a unidades padre
  → deduplicación y diversidad
  → ensamblado hasta el presupuesto
```

Los modos previstos son `focused`, `balanced` y `deep`. Sus presupuestos y
umbrales iniciales son 12k, 32k y 64k tokens estimados. Las evaluaciones podrán
ajustar esas cifras sin cambiar los nombres públicos.

## Bundle de recuperación

`retrieve` escribe `context.md` y `result.json` en un directorio temporal o en
la ruta indicada por `--out`. La terminal recibe sólo un JSON compacto con las
rutas, métricas y advertencias. Esto evita truncar contexto extenso en shells o
herramientas de agentes.

El Markdown contiene unidades citadas mediante `[S01]` y equivalentes. El JSON
resuelve cada cita a fuente, video, archivo, sección, timestamp opcional y
evidencia visual. El RAG organiza evidencia, pero no responde ni infiere por el
agente.

## Evolución prevista

1. MVP local para paquetes de video.
2. Evaluaciones y ajuste de recuperación.
3. Paquetes de páginas web.
4. Interfaz humana.
5. Búsqueda visual directa y base especializada si la escala lo requiere.
