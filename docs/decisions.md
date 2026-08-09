# Registro de decisiones

## Confirmadas

| Tema | Decisión | Motivo |
| --- | --- | --- |
| Nombre | `auto-youtube-rag` | Identidad del proyecto |
| Ejecución | Exclusivamente local | Privacidad y ausencia de servicios externos |
| Cerebro generativo | Agente consultante | Evitar duplicar razonamiento dentro del RAG |
| Integración | Skill general + CLI | Portabilidad entre proveedores |
| Ejecutable | `auto-youtube-rag` | Nombre explícito y neutral |
| Indexación | Un único comando `sync` | Evitar duplicar `index` y `sync` |
| Recuperación CLI | Comando `retrieve` | Ensambla contexto, no sólo coincidencias |
| Salida | Bundle Markdown + JSON | Evitar truncamiento y permitir integración |
| Profundidades | 12k / 32k / 64k | Presets ajustables por evaluación |
| Citaciones | `[S01]` resuelto en JSON | Lectura compacta con procedencia completa |
| Idioma | Contenido original; claves inglesas | Neutralidad entre proveedores |
| Skills | Una fuente canónica | Evitar variantes para Codex y Claude |
| Agentes iniciales | Codex y Claude | Compatibilidad mínima requerida |
| Persistencia | SQLite | Simplicidad local y escala suficiente |
| Texto | SQLite FTS5 | Búsqueda exacta y por relevancia |
| Embeddings | Locales, pequeños y multilingües | Sin APIs externas ni hardware potente |
| Vectores | Backend reemplazable | Poder migrar sin romper la CLI |
| Recuperación | Híbrida y jerárquica | Combinar precisión con cobertura amplia |
| Resultado | Contexto amplio y citado | Proveer hechos suficientes al agente |
| Fuentes | Múltiples raíces registradas | Unificar `auto-design` y `catalog-design` |
| Corpus principal | `context.md` | Documento autónomo y validado |
| Reglas | `rules.json` | Fuente estructurada de patrones |
| Metadata | Filtros y procedencia | Evitar tratar metadata como conocimiento |
| Transcripción | Respaldo opcional | Evitar duplicar VTT y texto equivalente |
| Imágenes | Referencias, sin embeddings MVP | El nombre del archivo no es semántico |
| Alcance MVP | Sólo paquetes de video | Reducir superficie inicial |
| UI humana | Posterior al MVP | Primero validar recuperación para agentes |
| Pruebas | Durante todo el desarrollo | Detectar regresiones funcionales |
| Evals | Al cerrar el MVP | Medir calidad sobre el flujo completo |

## Volumen esperado

- Inicio: aproximadamente 40 videos.
- Crecimiento medio: aproximadamente 4 videos diarios.
- Picos: hasta 10 videos diarios.

## Pendientes de decisión

- Lenguaje de implementación.
- Códigos numéricos de salida de la CLI.
- Modelo local de embeddings.
- Estrategia vectorial inicial concreta.
- Pesos de búsqueda híbrida y reranking.
- Presupuestos de contexto por profundidad.
