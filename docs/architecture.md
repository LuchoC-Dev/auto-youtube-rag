# Arquitectura acordada

## Flujo general

```text
Paquetes validados en varias raíces
              ↓
       indexador incremental
              ↓
  SQLite + FTS5 + índice vectorial
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
textual estable. Los embeddings se almacenan junto con:

- identificador de modelo;
- versión;
- dimensión;
- hash del contenido;
- fecha de indexación.

La búsqueda vectorial se oculta detrás de una interfaz reemplazable. Una primera
implementación puede efectuar búsqueda exacta desde la aplicación o usar un
adaptador fijado de `sqlite-vec`. Una migración futura a una base especializada
no debe cambiar la CLI, la skill ni el modelo de dominio.

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
umbrales quedan pendientes de evaluación.

## Evolución prevista

1. MVP local para paquetes de video.
2. Evaluaciones y ajuste de recuperación.
3. Paquetes de páginas web.
4. Interfaz humana.
5. Búsqueda visual directa y base especializada si la escala lo requiere.
