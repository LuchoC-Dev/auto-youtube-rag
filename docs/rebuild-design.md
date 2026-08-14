# Diseño 4.6: el comando `rebuild --confirm`

## Estado

**Propuesto el 14 de agosto de 2026. Pendiente de aprobación explícita.**

Es el punto 2 del orden de prioridad fijado por el usuario el 14 de agosto. El
punto 1 —ordenar fragmentos por longitud antes de lotear— quedó cerrado sin
implementar: es inerte con el `batchSize = 1` que adoptó 4.3 (ver "Por qué el
punto 1 se cerró sin código" más abajo).

`rebuild` es el único comando cuyo contrato público está aprobado en
`cli-contract.md` desde el MVP y nunca se implementó.

## El problema que resuelve

`sync` es incremental por diseño: `unchanged()` compara el hash del paquete
en disco contra el persistido, y si coinciden marca el paquete visto sin
recalcular nada. Eso es correcto y es lo que hace que un `sync` sobre 51
videos sin cambios termine en segundos.

Pero `unchanged()` sólo mira **el contenido de la fuente y la identidad del
modelo** (`key`/`version`/`dimensions`). No mira nada más del pipeline
derivado. Hay al menos cuatro cambios reales, ya ocurridos o previsibles, que
invalidan el índice sin que `sync` pueda notarlo:

1. **Tamaño de lote de embeddings.** 4.3 bajó el default de 16 a 1 y midió
   una desviación de coseno de 4,8×10⁻³ entre ambos. El diseño de 4.3 declaró
   explícitamente que el lote **no** forma parte de la identidad del modelo,
   así que una biblioteca existente conserva sus vectores viejos: quedan
   vectores mezclados y "reindexar es recomendable pero no obligatorio". Hoy
   no existe ninguna forma de ejercer esa recomendación salvo borrar el
   archivo SQLite a mano.
2. **Cambios de parser.** `source_documents.parser_version` se persiste por
   documento precisamente porque un parser nuevo produce unidades distintas
   del mismo byte de entrada. `unchanged()` no lo compara.
3. **Cambios de fragmentación o de tipos de unidad.** 4.1 agregó cuatro
   `KnowledgeUnitType` nuevos; un cambio equivalente futuro no re-fragmenta
   paquetes ya indexados.
4. **Cambio de perfil de modelo.** 4.5 hizo que la política de prefijos
   participe de `modelVersion`, así que ese caso **sí** dispara reindexación
   automática — es el único de los cuatro que ya está cubierto, y conviene
   dejar constancia de por qué no necesita `rebuild`.

En los tres primeros casos la biblioteca queda internamente inconsistente sin
ninguna señal: `doctor` reporta `ok`, `retrieve` devuelve resultados y nadie
se entera. Es exactamente la forma de defecto que la sesión del 13 y 14 de
agosto identificó como la más cara: _el sistema responde correctamente
mientras algo está roto_.

## Qué hace exactamente

```text
auto-youtube-rag rebuild --confirm
```

Tres fases, en orden, sobre la biblioteca del hogar de usuario:

1. **Purga** todo el índice derivado.
2. **Re-sincroniza** cada fuente registrada, en el orden en que las devuelve
   el registro, reutilizando `syncSource` sin duplicar una línea de su
   lógica.
3. **Emite un recibo** agregado que suma lo que reportó cada `sync`.

### Por qué re-sincroniza en vez de sólo purgar

El contrato dice "**regenera** el índice derivado", no "borra". Una purga
seca dejaría la biblioteca vacía y silenciosamente inservible hasta que el
usuario se acuerde de correr `sync` — el peor estado posible para un comando
cuyo propósito es reparar. Un agente consumidor que ejecute `rebuild` y
después `retrieve` obtendría `no_results` sin ninguna explicación.

Como `rebuild` deja el mismo estado que un `sync` completo desde cero, es
además idempotente en el sentido que importa: correrlo dos veces seguidas
produce la misma biblioteca.

### Qué se borra y qué sobrevive

La frontera se lee directamente del esquema de `001-initial.ts`:

| Tabla                                                                   | Destino    | Por qué                                                                                     |
| ----------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| `video_packages`                                                        | se borra   | Derivado: se reconstruye leyendo el manifest y los paquetes                                 |
| `source_documents`, `knowledge_units`, `search_fragments`, `embeddings` | se borran  | Cascada de `video_packages`; ningún dato propio no derivable                                |
| `fragment_fts`                                                          | se vacía   | Los triggers `fragment_fts_delete` la mantienen alineada sola                               |
| `sources`                                                               | **queda**  | Es configuración del usuario, no derivado. Borrarla haría a `rebuild` destructivo de verdad |
| `schema_meta`                                                           | **queda**  | La versión de esquema no cambia; `rebuild` no es una migración                              |
| `sync_runs`, `sync_issues`                                              | **quedan** | Historial de operaciones, no derivado del contenido                                         |

Preservar el historial de runs sigue un precedente ya establecido, no una
preferencia nueva: `source remove` "removes catalog derivatives but preserves
detached run history" (su propio test lo fija), y `sync_runs.source_id` es
`ON DELETE SET NULL` justamente para permitirlo. Un `rebuild` que borrara el
historial destruiría la única evidencia de por qué alguien tuvo que
reconstruir.

Consecuencia aceptada: quedan filas en `sync_runs` sin ningún
`video_packages` que las referencie. Es el mismo estado desprendido que ya
produce `source remove`, y `doctor` no lo trata como error.

### La purga va en una sola transacción

Un `rebuild` interrumpido a mitad de la purga no debe dejar media biblioteca.
El borrado de `video_packages` de todas las fuentes ocurre en un único
`BEGIN IMMEDIATE`, igual que `applyPackage`. La re-sincronización posterior
**no** entra en esa transacción: cada `syncSource` gestiona las suyas, y un
fallo parcial de una fuente debe comportarse exactamente como en un `sync`
normal (issue registrado, run `partial`), no revertir la purga entera.

Esto implica una ventana real: si el proceso muere entre la purga y el fin de
la re-sincronización, la biblioteca queda parcialmente reconstruida. Es
aceptable y no se disimula — el remedio es volver a correr `rebuild`, que es
idempotente. Se declara en el recibo y en la skill.

## Interacción con el guard de concurrencia de 4.3

`rebuild` **respeta el guard, no lo esquiva**. Si alguna fuente tiene un run
`running`, `rebuild` falla completo antes de borrar nada, con el mismo código
`SYNC_ALREADY_RUNNING` que ya emite `sync`.

La verificación ocurre **dentro de la misma transacción que la purga**, no
antes ni por fuente durante el bucle. Al implementarlo quedó claro que
comprobar en la aplicación y borrar después reabre exactamente la ventana que
4.3 cerró en `recordRun`: entre la comprobación y el `DELETE` puede arrancar un
`sync` que indexa sobre una biblioteca a punto de vaciarse. Poner el `SELECT`
de runs activos y el `DELETE` bajo un único `BEGIN IMMEDIATE` convierte el
guard en garantía, igual que allá. Además, un rebuild abarca **todas** las
fuentes, así que un run activo en cualquiera lo bloquea, no sólo en la que se
esté por tocar.

Consecuencia de diseño: el guard vive en `purgeDerivedIndex`, no en el caso de
uso, y `rebuildIndex` no necesita ningún método de lectura de runs activos.

**`rebuild` no acepta `--force`.** Destrabar un run fantasma y reconstruir la
biblioteca entera son dos decisiones distintas y el usuario debe tomarlas por
separado: primero `sync --source <name> --force`, después `rebuild`.
Combinarlas en una bandera haría que un solo comando destrabe un run que
quizá esté vivo y además borre todo.

## Superficie de CLI

### `--confirm` es obligatorio

Sin la bandera, `rebuild` termina con **código 2** (error de uso), validado en
`parse-command.ts` antes de construir la `Application`, consistente con la
regla ya fijada para `--depth` y `--max-tokens`: un argumento faltante o mal
escrito nunca produce el código 1 de fallo operativo. No hay prompt
interactivo: la CLI es no interactiva por contrato y su consumidor es un
agente.

### Requisitos

`rebuild` se suma a `sync` y `retrieve` como `library_and_model` en
`command-requirements.ts`. Necesita el modelo porque re-embebe todo: dejarlo
en `library` reproduciría exactamente el defecto que 4.2 corrigió — descubrir
el modelo faltante una vez por video en vez de una vez antes de empezar.

Esto rompe el test `sync and retrieve are the only commands requiring both the
library and the model`, que hay que actualizar a los tres comandos. Es una
actualización deliberada del contrato, no una regresión.

### Recibo

El contrato aprobado no define recibo para `rebuild` (`cli-contract.md`
sólo declara dos frases), así que hay que definirlo y documentarlo. Propuesta,
siguiendo la forma del recibo de `sync`:

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "sources_rebuilt": 2,
  "packages_deleted": 51,
  "packages_indexed": 51,
  "packages_failed": 0,
  "sources": [
    { "name": "auto-design", "status": "ok", "packages_indexed": 51 }
  ],
  "issues": []
}
```

`status` agregado: `ok` si toda fuente terminó `ok`; `partial` si alguna
terminó `partial` o `failed`, con las demás reconstruidas; `failed` si ninguna
pudo reconstruirse. Códigos de salida: `0` para `ok`, `1` para `partial` y
`failed`, igual que `sync`.

Una biblioteca sin ninguna fuente registrada devuelve `status: "ok"` con
`sources_rebuilt: 0` y código `0`. No es un error: no hay nada que
reconstruir y no hay nada roto.

## Dónde vive el código

`rebuild` es un caso de uso de aplicación, no lógica de CLI:

- **Dominio**: sin cambios. No aparece ningún concepto nuevo.
- **Puerto**: `IndexStore` suma una operación —`purgeDerivedIndex(): Promise<number>`—
  que devuelve cuántos paquetes borró. Es la única capacidad genuinamente
  nueva; todo lo demás ya existe.
- **Aplicación**: `src/application/indexing/rebuild-index.ts` con
  `rebuildIndex`, que llama `purgeDerivedIndex` y después `syncSource` por cada
  fuente. No conoce SQLite ni comprueba runs activos por su cuenta: el guard es
  parte de la purga.
- **Infraestructura**: `SQLiteIndexStore.purgeDerivedIndex` —el `SELECT` de
  runs activos y un `DELETE FROM video_packages` bajo un único
  `BEGIN IMMEDIATE`, apoyado en las cascadas y los triggers que ya existen, sin
  tocar el esquema.
- **Interfaz**: `kind: "rebuild"` en `parse-command.ts`, su entrada en
  `command-requirements.ts` y su rama en `run-cli.ts`.
- **Composition root**: `Application` expone `rebuildIndex`, reemplazable
  igual que `retrieveCandidates` y `assembleContext`.

**No hay migración de esquema.** `rebuild` borra filas con las cascadas ya
declaradas; no agrega, quita ni altera ninguna tabla, índice o trigger.

## El índice vectorial en memoria

`InMemoryVectorSearchIndex` es la misma instancia que sirve las consultas y
recibe los cambios de `sync`. Después de una purga su snapshot queda
describiendo vectores que ya no existen.

El primer borrador de este diseño daba por sentado que no hacía falta ningún
mecanismo nuevo: el índice **ya invalida su snapshot completo en `apply`**
(decisión de 2.2) y la re-sincronización publica cambios por cada paquete.

**Era falso, y el test de AH2 lo probó.** La purga borra filas por SQL, y SQL
no publica nada al índice: `apply` es lo único que lo invalida. Un `rebuild`
que termina sin ningún paquete —todas las fuentes con manifest vacío o
ilegible— no publica ni un cambio, así que el snapshot anterior sobrevive
entero y `load()` sigue devolviendo vectores cuyos fragmentos ya no existen.
Medido: 2 vectores servidos sobre una biblioteca con cero embeddings.

Es exactamente el defecto que 4.4 encontró —el snapshot obsoleto tapando
`VECTORS_STALE`— reapareciendo por un camino nuevo, y confirma la lección del
13 y 14 de agosto: el sistema respondía correctamente mientras algo estaba
roto.

Corrección: `rebuildIndex` recibe el `VectorIndexSink` y publica un
`remove_packages` con los `PackageRef` que había, **después** de que la purga
commitea, nunca antes — el mismo orden que respeta `sync`. Los refs se
recolectan antes de purgar, mientras las filas todavía existen, para que lo
publicado nombre los paquetes que realmente se fueron.

## Fuera de alcance

- Reindexado automático al detectar vectores de lotes mezclados. `rebuild` es
  y sigue siendo explícito: lo corre el usuario cuando decide correrlo.
- `rebuild --source <name>` para reconstruir una sola fuente. El contrato
  aprobado no lo incluye y no hay evidencia de que haga falta; agregar una
  bandera al contrato público requiere aprobación aparte.
- Agregar el tamaño de lote a la identidad del modelo. 4.3 lo descartó con
  causa y `rebuild` es justamente la alternativa que lo hace innecesario.
- Backup o rollback de la biblioteca previa. Los paquetes fuente son
  inmutables y siguen en disco: la biblioteca es reconstruible por
  definición, que es la razón misma de que este comando pueda existir.
- Barra de progreso. `sync` ya emite progreso por stderr y `rebuild` lo
  hereda.

## Bloques

| Bloque | Contenido                                                                  |
| ------ | -------------------------------------------------------------------------- |
| AE     | Puerto `purgeDerivedIndex` y su implementación SQLite transaccional        |
| AF     | Caso de uso `rebuildIndex`: guard previo, purga, re-sync y recibo agregado |
| AG     | Superficie de CLI: `parse-command`, requisitos, `run-cli` y recibo         |
| AH     | E2E sobre SQLite real, `cli-contract.md`, `SKILL.md` y `build.md`          |

## Por qué el punto 1 se cerró sin código

El orden de prioridad del 14 de agosto ponía "ordenar fragmentos por longitud
antes de lotear" antes que `rebuild`. Se descartó tras verificarlo contra el
código, no contra el documento:

- `defaultBatchSize` ya es `1` (`transformers-embedding-generator.ts:18`) y
  ningún llamador de producto lo sobrescribe.
- El loteo es un slice secuencial
  (`transformers-embedding-generator.ts:373-375`): con lote 1 cada llamada
  recibe un solo texto, y el padding es relativo al más largo del lote. Sin
  lote no hay padding contra el cual ordenar; ordenar la entrada no cambia
  una sola operación del runtime.
- `embedDocuments` se llama **por paquete**
  (`sync-source.ts:287-289`, dentro del bucle de videos), así que el universo
  ordenable serían los fragmentos de un video, no el corpus con el que se
  midió el 1,93x.
- La medición de 4.3 ya lo decía: lote 16 ordenado por longitud rinde 1,93x,
  contra 2,27x del lote 1 que se adoptó. No era una mejora sobre el lote 1;
  era la alternativa que el lote 1 le ganó.
- Reintroducirlo costaría el determinismo que 4.3 celebró: el vector de un
  fragmento pasaría a depender de qué otros fragmentos del mismo video tienen
  longitud parecida.

Queda como **medido y descartado con causa**, no como pendiente. Sólo
reabrirlo si aparece un motivo independiente para volver a un lote mayor que 1.
