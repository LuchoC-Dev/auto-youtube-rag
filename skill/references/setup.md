# Instalación y entorno

Leé este archivo **sólo** cuando se cumpla alguna de estas condiciones:

- es la primera vez que usás la herramienta en esta máquina;
- un comando falló con `LIBRARY_NOT_FOUND` o `MODEL_NOT_INSTALLED`;
- `models status` devolvió `incomplete`;
- querés mover la biblioteca a otra ubicación.

Si la biblioteca ya funciona, no necesitás nada de acá.

## Cómo invocar la CLI

La forma canónica es `auto-youtube-rag <comando>`. Si el comando no está en el
`PATH`, buscá el repositorio del proyecto y usá
`node "<ruta-al-repo>/dist/main.js" <comando>`; requiere haber corrido
`npm run build` una vez en ese repositorio.

## Dónde vive todo

Un único directorio, en el hogar del usuario:

```text
~/.auto-youtube-rag/
  index.sqlite       ← la biblioteca
  models/            ← el modelo de embeddings (130 MB)
```

En Windows es `C:\Users\<usuario>\.auto-youtube-rag\`.

**No depende del directorio desde el que ejecutás.** Podés invocar la CLI
parado en cualquier carpeta y siempre vas a hablar con la misma biblioteca.

Dos variables de entorno lo mueven, y sólo hacen falta en casos especiales
—aislar una biblioteca de prueba, o compartir el modelo entre varios hogares:

| Variable                      | Qué mueve                     |
| ----------------------------- | ----------------------------- |
| `AUTO_YOUTUBE_RAG_HOME`       | El hogar entero               |
| `AUTO_YOUTUBE_RAG_MODELS_DIR` | Sólo el directorio del modelo |

Si definís alguna, usá **el mismo valor en todas las invocaciones** de la
sesión.

## Instalar por primera vez

```text
auto-youtube-rag init
```

Crea el hogar, prepara la base y deja el modelo instalado. Es idempotente.

**Tarda.** Sin banderas descarga unos 130 MB, y es la única operación de toda
la herramienta que usa la red. Dale un timeout holgado o corrélo en segundo
plano.

Dos banderas cambian ese comportamiento:

- **`--from <ruta>`**: copia un modelo que ya existe en disco en vez de
  descargarlo. Tarda segundos. La ruta debe contener
  `Xenova/multilingual-e5-small/` con sus cuatro archivos. Si no los tiene,
  falla con `MODEL_SOURCE_INVALID` (código `2`) en vez de descargar en
  silencio.
- **`--skip-model`**: prepara sólo la base. Para CI o entornos sin red.
  `sync` y `retrieve` no van a funcionar hasta que instales el modelo.

## `LIBRARY_NOT_FOUND`

Falta la base. El mensaje incluye la ruta exacta donde la buscó.

Causas, en orden de probabilidad:

1. **Nunca corriste `init`.** Corrélo.
2. **Definiste `AUTO_YOUTUBE_RAG_HOME` con un valor distinto** al que usaste
   antes, o lo definiste en una invocación y no en otra. Verificá que sea el
   mismo valor en todas.

## `MODEL_NOT_INSTALLED`

La base existe pero falta el modelo, o está dañado. `sync` y `retrieve` lo
necesitan; `status`, `doctor` y `source` no.

```text
auto-youtube-rag models install
auto-youtube-rag models install --from <ruta-a-un-modelo-existente>
auto-youtube-rag models install --force
```

**No es un fallo transitorio.** Reintentar `sync` sin instalar el modelo
vuelve a fallar igual.

## `models status` devuelve `incomplete`

La instalación está a medias o dañada: típicamente una descarga cortada, que
deja los archivos en su lugar con el tamaño equivocado. También aparece si
alguien copió el modelo a mano, sin pasar por la herramienta.

El recibo `models/.install.json` guarda el tamaño esperado de cada archivo, y
`models status` lista en `issues` cuáles no coinciden.

Se repara reinstalando encima:

```text
auto-youtube-rag models install --force
```

## Mover la biblioteca

No hay comando de mudanza. Movés el directorio a mano y definís
`AUTO_YOUTUBE_RAG_HOME` apuntando al lugar nuevo, en todas las invocaciones.

## `LEGACY_LIBRARY_FOUND`

Advertencia, no error. Hay una base vieja en `<directorio-actual>/.auto-youtube-rag/`,
de cuando la herramienta guardaba la biblioteca junto al directorio de
trabajo. Ya no se lee.

Si esa base tenía contenido que te importa, movela al hogar nuevo o apuntá
`AUTO_YOUTUBE_RAG_HOME` hacia ella. La herramienta no la migra sola: mover
datos del usuario sin pedirlo no es su trabajo.
