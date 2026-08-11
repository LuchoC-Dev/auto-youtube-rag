# auto-youtube-rag

Biblioteca RAG local para recuperar contexto amplio, ordenado y citado desde los
paquetes de conocimiento producidos por la skill de videos.

La indexación incremental y la CLI administrativa están implementadas y
verificadas. El próximo bloque es la recuperación híbrida del punto 2.2.

## Propósito

`auto-youtube-rag` permitirá que agentes de distintos proveedores consulten una
colección creciente de paquetes de video sin abrir los videos originales. El
sistema no responderá por sí mismo: recuperará y ensamblará contexto suficiente
para que el agente consultante razone y redacte la respuesta.

## Principios acordados

- Funcionamiento exclusivamente local.
- Una única skill portable para Codex, Claude y futuros agentes.
- CLI estable como interfaz del núcleo.
- SQLite como persistencia del MVP.
- Recuperación híbrida: FTS5, embeddings locales y filtros.
- Contexto amplio y deduplicado, no un `top-k` pequeño y aislado.
- Procedencia preservada por video, documento, sección y evidencia.
- Los paquetes originales permanecen inmutables.
- MVP exclusivo para videos; paquetes web e interfaz humana quedan para después.

## Documentación

- [`docs/agent-handoff.md`](docs/agent-handoff.md): estado completo y relevo
  detallado para continuar el proyecto en frío.
- [`docs/product-spec.md`](docs/product-spec.md): objetivo, alcance y criterios.
- [`docs/architecture.md`](docs/architecture.md): arquitectura acordada.
- [`docs/cli-contract.md`](docs/cli-contract.md): comandos y formatos aprobados.
- [`docs/decisions.md`](docs/decisions.md): decisiones y asuntos pendientes.
- [`docs/build.md`](docs/build.md): progreso de construcción.
