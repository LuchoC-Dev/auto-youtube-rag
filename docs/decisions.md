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
| Códigos de proceso | `0`, `1`, `2` y `130` | Convención portable; detalle mediante códigos JSON |
| Skills | Una fuente canónica | Evitar variantes para Codex y Claude |
| Agentes iniciales | Codex y Claude | Compatibilidad mínima requerida |
| Lenguaje | TypeScript estricto | Ruta integrada y soportada para ONNX en Windows |
| Runtime | Node.js 24+ con ESM | Disponible localmente y compatible con Transformers.js |
| Empaquetado | npm + `package-lock.json` | Instalación reproducible sin otro runtime |
| Arquitectura | Dominio + puertos y adaptadores | Sustituir infraestructura sin alterar casos de uso |
| Persistencia | SQLite | Simplicidad local y escala suficiente |
| Texto | SQLite FTS5 | Búsqueda exacta y por relevancia |
| Embeddings | E5 Small multilingüe `q8` | Mejor equilibrio del benchmark local |
| Acoplamiento | Modelo y DB sólo en infraestructura | Mantener dominio y aplicación reemplazables |
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

## Modelo de embeddings aprobado

El benchmark inicial sobre 18 pasajes y 16 consultas dejó a
`multilingual-e5-small` como modelo del MVP: obtuvo `Hit@1 = 1.0` y
`MRR = 1.0`, igual que E5 Base, con 129 MB de caché y una latencia media de
11.5 ms frente a 29 ms de E5 Base. Puede sustituirse si las evaluaciones futuras
lo justifican; esa sustitución afectará al adaptador y al índice, no al dominio.

## Pendientes de decisión

- Estrategia vectorial inicial concreta.
- Pesos de búsqueda híbrida y reranking.
- Presupuestos de contexto por profundidad.
