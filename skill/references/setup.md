# Instalación y entorno

Leé este archivo **sólo** cuando se cumpla alguna de estas condiciones:

- es la primera vez que usás la herramienta en esta máquina;
- `sync` devolvió issues `MODEL_LOAD_FAILED`;
- un comando falló con `ERR_SQLITE_ERROR: unable to open database file`;
- `status` reporta una biblioteca vacía que esperabas que tuviera contenido.

Si la biblioteca ya funciona y los comandos responden con normalidad, no
necesitás nada de acá.

## Cómo invocar la CLI

La forma canónica es `auto-youtube-rag <comando>`. Si el comando no está
disponible en el PATH, buscá el repositorio del proyecto y usá
`node "<ruta-al-repo>/dist/main.js" <comando>` en su lugar; requiere haber
corrido `npm run build` una vez en ese repositorio.

## Ubicación de la base y del modelo

Ambas rutas se resuelven **relativas al directorio de trabajo del proceso**,
no a la ubicación del repositorio ni del binario. Esta es la causa más común
de fallos de arranque.

| Qué              | Default                    | Variable de entorno            |
| ---------------- | -------------------------- | ------------------------------ |
| Base de datos    | `<cwd>/.auto-youtube-rag/` | `AUTO_YOUTUBE_RAG_HOME`        |
| Caché del modelo | `<cwd>/.cache/models/`     | `AUTO_YOUTUBE_RAG_MODEL_CACHE` |

Consecuencia práctica: si trabajás desde un directorio distinto al
repositorio —que es el caso normal— el modelo de embeddings **no va a estar
donde la herramienta lo busca**, aunque ya esté descargado en el repo.

## El modelo de embeddings no carga

Síntoma: `sync` termina con `status: "partial"` y un issue
`MODEL_LOAD_FAILED` **por cada video**, con este mensaje:

```text
E5 Small could not be loaded from the local cache at <cwd>/.cache/models.
Run npm run models:download first.
```

No es un fallo transitorio y reintentar sin cambiar nada vuelve a fallar
igual. Es configuración.

**La solución correcta es apuntar la variable a un caché que ya exista**, en
vez de descargar el modelo de nuevo:

```text
AUTO_YOUTUBE_RAG_MODEL_CACHE=<ruta-al-repo>/.cache/models
```

Definila en el entorno antes de invocar la CLI y usá exactamente el mismo
valor en todas las invocaciones de la sesión.

Sólo si no existe ningún caché en ninguna parte corré `npm run
models:download` dentro del repositorio. Ese comando sí requiere red y
descarga alrededor de 130 MB — es la única operación de toda la herramienta
que usa la red, y ocurre una sola vez por máquina.

## Inicializar la base

`status`, `doctor` y `source add` necesitan que la base de datos local ya
exista. Si es la primera vez en esta máquina, o no estás seguro:

```text
auto-youtube-rag init
```

Es idempotente: si ya está inicializada, no hace nada destructivo ni la
reemplaza.

## La base no aparece donde esperabas

Síntoma: `ERR_SQLITE_ERROR: unable to open database file`, o un `status` que
reporta una biblioteca vacía que sabés que tiene contenido.

Tiene dos causas posibles y conviene descartarlas en este orden:

1. **Falta `init`.** Corrí `auto-youtube-rag init` y reintentá.
2. **Cambiaste de directorio de trabajo entre comandos.** La base es
   relativa al `cwd`, así que invocar desde otra carpeta apunta a una base
   distinta —vacía o inexistente— sin ningún aviso.

Para evitar la segunda: invocá siempre desde el mismo `cwd` durante toda la
sesión, o fijá `AUTO_YOUTUBE_RAG_HOME` a una ruta absoluta y usá ese mismo
valor en cada invocación.
