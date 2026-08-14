# Diseño 4.3: guard de concurrencia, runs fantasma y tamaño de lote

## Estado

Propuesto y aprobado el 14 de agosto de 2026. Dos trabajos independientes que
comparten origen: la corrida en frío del 13 de agosto.

## Parte 1 — Borrado cruzado entre syncs concurrentes

### El bug, confirmado

Hasta ahora la hipótesis estaba anotada como plausible pero sin confirmar. Se
reprodujo de forma determinista el 14 de agosto:

```text
3 paquetes indexados
run A marca video_1 y video_2 como vistos
run B marca video_3 como visto
A termina → deletePackagesNotSeen(A) borra 1 (el de B)
B termina → deletePackagesNotSeen(B) borra 2 (los de A)
resultado: 0 paquetes
```

**Los dos runs terminan sin error, cada video fue visto por alguno de ellos, y
aun así la fuente queda vacía.** Explica lo observado el 13 de agosto, cuando
`status` reportó 13 videos habiendo 53.

Mecanismo:

```sql
DELETE FROM video_packages WHERE source_id = ? AND last_seen_sync_id <> ?
```

Cada run borra lo que no reclamó él. Lo que un run concurrente ya reclamó
parece no visto. El guard existente sólo valida que el run exista, sea de esa
fuente y esté `running`; **no valida que sea el único activo**, así que dos
runs concurrentes lo pasan los dos.

### Decisión: rechazar el segundo sync, sin heurísticas de tiempo

`sync` falla si ya hay un run `running` para esa fuente. Código simbólico
`SYNC_ALREADY_RUNNING`, salida `1`, mensaje que nombra el id del run activo y
cuándo empezó.

Se descartó una heurística de antigüedad ("un run de más de N minutos está
muerto"): no existe un N defendible. Un sync de 60 videos tarda 11 minutos y
uno de 500 tardaría hora y media, así que cualquier umbral o mata syncs vivos
o deja pasar fantasmas.

### Runs fantasma

Un proceso muerto —Ctrl+C, cierre de terminal, corte— deja su run en
`running` para siempre. Hoy es inofensivo porque nadie lo lee; con el guard
pasaría a bloquear todos los syncs futuros. Sin salida, cambiaríamos un bug
silencioso por uno ruidoso.

Dos mecanismos, ambos explícitos:

- **`sync --force`**: marca el run activo como `failed`, registrando un
  `SyncIssue` con código `RUN_SUPERSEDED` que deja constancia de que fue
  abandonado y no completado, y arranca uno nuevo. Es la salida cuando el
  usuario sabe que el proceso murió.
- **`doctor` los reporta**: un check nuevo `STALE_SYNC_RUN` que lista los
  runs `running` por fuente, con su id y antigüedad. Estado `error` sólo si
  existe alguno, con el mensaje nombrando `sync --force`. Así el usuario se
  entera sin tener que deducirlo de un fallo.

No se abandona ningún run automáticamente. Marcar como fallido el trabajo de
otro proceso sin que nadie lo pida es exactamente el tipo de decisión que el
resto del producto evita.

### Dónde vive el guard

En el store, no en el caso de uso: es una invariante de la persistencia y
tiene que sostenerse aunque mañana otro camino inicie un sync.
`recordRun` rechaza registrar un run `running` para una fuente que ya tiene
otro `running`, con `SQLiteIndexStoreError` de código `SYNC_ALREADY_RUNNING`.

Esto **no** elimina la carrera real entre dos procesos del sistema operativo
—dos `recordRun` simultáneos podrían pasar ambos—, pero `sync_runs` está en
la misma base y `node:sqlite` serializa las escrituras, así que la ventana es
de microsegundos y el caso que importa (un usuario o agente lanzando un
segundo sync mientras ve correr el primero) queda cubierto. Un lock real de
base de datos queda fuera de alcance y se registra como tal.

## Parte 2 — Tamaño de lote de embeddings

### La medición

Con fragmentos reales de la biblioteca (13 a 511 tokens, 115 de promedio):

| Configuración                 | frag/s | vs. actual |
| ----------------------------- | -----: | ---------: |
| Lote 1                        |  17,09 |      2,27x |
| Lote 2                        |  15,78 |      2,09x |
| Lote 16 ordenado por longitud |  14,52 |      1,93x |
| Lote 4                        |  11,36 |      1,51x |
| **Lote 16 (actual)**          |   7,54 |          — |
| Lote 32                       |   7,20 |      0,95x |
| Lote 64                       |   5,60 |      0,74x |

Causa: dentro de un lote, todos los textos se rellenan hasta el más largo. Con
fragmentos de 13 a 511 tokens, un lote de 16 hace que un fragmento corto
cueste como uno de 511. El lote 1 no tiene relleno posible.

El embedding explica prácticamente todo el tiempo de `sync`: 688 s
proyectados contra 660 s medidos sobre 63 videos.

**Paralelizar no sirve.** Medido con contenido real: concurrencia 2 → 0,99x,
concurrencia 4 → 1,00x. ONNX ya satura los 8 núcleos internamente, así que
repartir videos entre tareas competiría por la misma CPU.

### Decisión: `defaultBatchSize` pasa de 16 a 1

Un cambio de constante que rinde 2,27x. El sync de 63 videos baja de ~11
minutos a menos de 5.

`batchSize` sigue siendo configurable: no se elimina la opción, sólo cambia
el default.

### Consecuencia que hay que declarar

**Los vectores cambian levemente con el tamaño de lote.** Medido: desviación
del coseno de 4,8×10⁻³ entre lote 1 y lote 16 para el mismo texto. El modelo
no enmascara el relleno de forma perfecta.

Implicaciones:

- La desviación (0,5%) está muy por debajo de lo que separa a dos fragmentos
  distintos, así que no debería mover rankings.
- `unchanged()` **no** lo detecta: el tamaño de lote no forma parte de la
  identidad del modelo (`key`/`version`/`dimensions`), así que una biblioteca
  existente conserva sus vectores viejos y sólo los paquetes que cambien se
  reindexan con el default nuevo. Quedan vectores mezclados.
- Se documenta que reindexar es recomendable pero no obligatorio. No se
  fuerza: obligar a reindexar 63 videos por una desviación de 0,5% sería
  desproporcionado.

**No se agrega el tamaño de lote a la identidad del modelo.** Haría que
cualquier ajuste de rendimiento invalidara la biblioteca entera, que es peor
que la mezcla que evita.

Efecto secundario bienvenido: con lote 1 el embedding pasa a ser
determinista respecto de la composición del lote, porque no hay lote.

## Fuera de alcance

- Ordenar fragmentos por longitud antes de lotear (1,93x, menos que lote 1 y
  más complejo).
- Un lock de base de datos real entre procesos del sistema operativo.
- Reindexado automático al cambiar el tamaño de lote.

## Bloques

| Bloque | Contenido                                                        |
| ------ | ---------------------------------------------------------------- |
| AA     | Guard en el store y regresión del borrado cruzado                |
| AB     | `sync --force`, `RUN_SUPERSEDED` y `doctor` con `STALE_SYNC_RUN` |
| AC     | `defaultBatchSize` a 1 y su documentación                        |
