# Especificación de producto: auto-youtube-rag

## Estado

Fase `SPECIFY`. Las decisiones confirmadas son fuente de verdad; los asuntos
marcados como pendientes no deben resolverse durante la implementación sin
actualizar primero esta especificación.

## Objetivo

Construir una biblioteca RAG local que indexe los paquetes validados generados
por la skill de videos y entregue a un agente un paquete de contexto temático
amplio, ordenado, deduplicado y citado.

El producto no contiene un agente generativo interno. El agente que ejecuta la
consulta es el único responsable de interpretar el contexto y redactar la
respuesta.

### Capacidades objetivo

- Encontrar videos que tratan un concepto.
- Buscar elementos y características descritas visualmente.
- Comparar recomendaciones entre varios videos.
- Recuperar reglas, patrones, procedimientos y antipatrones.
- Exponer coincidencias, diferencias y contradicciones entre fuentes.
- Ensamblar contexto suficiente para consultas factuales amplias.

Localizar momentos específicos del video no es una función del producto. Los
timestamps existentes pueden conservarse únicamente como procedencia.

## Criterio de éxito

Ante una consulta, el sistema recupera y organiza una porción suficientemente
amplia del conocimiento relevante, elimina repeticiones, conserva la
procedencia y construye un paquete citado dentro de un presupuesto configurable.
El agente debe poder responder basándose principalmente en ese paquete, sin
consultar los videos originales.

El resultado no se limita a un número fijo pequeño de fragmentos. La búsqueda
recupera candidatos con alta cobertura, expande las coincidencias a sus secciones
padre, diversifica fuentes y ensambla contexto hasta alcanzar el presupuesto.

## Usuarios y compatibilidad

- MVP consumido por agentes, no por humanos.
- Compatibilidad mínima con Codex y Claude.
- Diseño neutral respecto del proveedor.
- Una única skill canónica, instalable o enlazable desde diferentes agentes.
- Interfaz humana reservada para una fase posterior.

## Fuentes de entrada

El sistema admite varias raíces registradas, inicialmente:

- `auto-design\videos`
- `catalog-design\videos`

Cada paquete conserva su estructura original. El indexador no agrega ni modifica
archivos dentro de esos paquetes.

| Fuente | Uso en el MVP |
| --- | --- |
| `manifest.json` | Inventario y estado; no corpus semántico |
| `deliverables/context.md` | Fuente principal de conocimiento |
| `deliverables/rules.json` | Patrones y reglas estructuradas |
| `source/metadata.json` | Identidad, filtros y procedencia |
| `transcript/source.txt` | Respaldo opcional; no indexado por defecto |
| Archivos VTT | No indexados |
| `visual/coverage.json` | Metadatos de evidencia |
| Imágenes | Ruta preservada; sin embeddings en el MVP |

## Alcance del MVP

- Registrar múltiples raíces de paquetes.
- Indexar y sincronizar paquetes de video de manera incremental e idempotente.
- Detectar altas, cambios y eliminaciones mediante hashes de contenido.
- Ejecutar búsqueda textual, semántica y por metadatos.
- Recuperar jerárquicamente documentos, secciones y reglas.
- Deduplicar y diversificar fuentes.
- Ensamblar un paquete de contexto con profundidad configurable.
- Entregar Markdown para el agente y JSON versionado para integración.
- Incluir procedencia, cobertura y limitaciones.
- Proporcionar una CLI local consumible desde la skill general.

## Fuera del MVP

- Chat o LLM interno.
- MCP.
- API remota.
- Interfaz web para humanos.
- Procesamiento directo de videos crudos.
- Indexación semántica de imágenes.
- OCR adicional.
- GraphRAG.
- Paquetes generados por la skill de páginas web.

## Stack confirmado

- Persistencia: SQLite.
- Búsqueda textual: SQLite FTS5.
- Búsqueda semántica: embeddings multilingües locales y pequeños.
- Vectores: almacenamiento versionado detrás de una interfaz reemplazable.
- Integración: CLI y una única skill portable.

El lenguaje de implementación, el framework de CLI y el adaptador vectorial
concreto permanecen pendientes.

## Comandos previstos

La sintaxis definitiva se aprobará en la siguiente fase. La superficie funcional
esperada es:

```text
auto-youtube-rag source add <ruta>
auto-youtube-rag source list
auto-youtube-rag index
auto-youtube-rag sync
auto-youtube-rag search <consulta> --depth <focused|balanced|deep>
auto-youtube-rag status
auto-youtube-rag validate
auto-youtube-rag remove <fuente-o-paquete>
auto-youtube-rag rebuild
```

Los comandos de desarrollo, pruebas, lint y build se definirán cuando se apruebe
el lenguaje y la herramienta de empaquetado.

## Estructura conceptual

```text
skill/          skill portable que enseña a usar la CLI
src/            núcleo de dominio, indexación, recuperación y ensamblado
tests/          pruebas unitarias e integración
evals/          evaluaciones de calidad de recuperación
docs/           especificaciones, decisiones y progreso
```

Esta estructura es conceptual y no autoriza todavía la creación de `src/`.

## Estilo de código

Pendiente de la elección del lenguaje. Se exigirán nombres explícitos, tipos en
los límites públicos, funciones pequeñas, dependencias invertidas para
persistencia y ausencia de lógica específica de proveedores dentro del núcleo.

## Estrategia de pruebas

### Durante el desarrollo

- Pruebas unitarias del dominio y ranking.
- Pruebas de integración con una base SQLite temporal.
- Pruebas de CLI.
- Indexación repetida sin duplicados.
- Actualización y eliminación verificables.
- Compatibilidad del esquema de salida.
- Recuperación determinista sobre fixtures pequeños.

### Al completar el MVP

- Evaluaciones de recall, precisión y cobertura temática.
- Consultas reales en español e inglés.
- Comparación de modelos de embeddings pequeños.
- Evaluación del contexto con Codex y Claude.
- Casos sin respuesta y fuentes contradictorias.

## Escala prevista

- Aproximadamente 40 videos iniciales.
- Crecimiento promedio estimado: 4 videos por día.
- Picos estimados: hasta 10 videos por día.
- Ejecución local y sin usuarios humanos concurrentes en el MVP.

## Límites de actuación

### Siempre

- Preservar los paquetes originales.
- Mantener procedencia y esquema versionado.
- Validar entradas y hashes.
- Ejecutar pruebas antes de cada commit.
- Mantener la CLI neutral respecto del agente.

### Preguntar antes

- Cambiar el esquema persistido.
- Añadir dependencias o extensiones nativas.
- Cambiar el modelo o dimensión de embeddings.
- Ampliar el MVP a páginas web, MCP, API o interfaz humana.

### Nunca

- Indexar secretos o archivos `.env`.
- Sobrescribir paquetes fuente.
- Presentar un resultado sin procedencia.
- Acoplar el dominio a Codex, Claude o una base vectorial específica.
- Eliminar pruebas fallidas para permitir una entrega.

## Asuntos abiertos

1. Lenguaje y herramienta de empaquetado.
2. Contrato definitivo de la CLI.
3. Formato exacto del paquete Markdown y JSON.
4. Presupuestos para `focused`, `balanced` y `deep`.
5. Modelo local de embeddings, elegido mediante benchmark.
6. Búsqueda vectorial exacta en aplicación o adaptador `sqlite-vec` fijado.
7. Política de combinación y reranking de resultados.
