# Installation and environment

Read this file **only** when one of these conditions holds:

- it is the first time you use the tool on this machine;
- a command failed with `LIBRARY_NOT_FOUND` or `MODEL_NOT_INSTALLED`;
- `models status` returned `incomplete`;
- you want to move the library to another location.

If the library already works, you need nothing from here.

## How to invoke the CLI

The canonical form is `auto-youtube-rag <command>`. If the command is not on the
`PATH`, find the repository of the project and use
`node "<path-to-the-repo>/dist/main.js" <command>`; it requires having run
`npm run build` once in that repository.

## Where everything lives

A single directory, in the user's home:

```text
~/.auto-youtube-rag/
  index.sqlite       ← the library
  models/            ← the embedding model (130 MB)
```

On Windows it is `C:\Users\<user>\.auto-youtube-rag\`.

**It does not depend on the directory you run from.** You can invoke the CLI
standing in any folder and you will always be talking to the same library.

Two environment variables move it, and they are only needed in special cases
—isolating a test library, or sharing the model between several homes:

| Variable                      | What it moves            |
| ----------------------------- | ------------------------ |
| `AUTO_YOUTUBE_RAG_HOME`       | The whole home           |
| `AUTO_YOUTUBE_RAG_MODELS_DIR` | Only the model directory |

If you define either, use **the same value in every invocation** of the
session.

## Installing for the first time

```text
auto-youtube-rag init
```

It creates the home, prepares the database and leaves the model installed. It is
idempotent.

**It takes a while.** With no flags it downloads about 130 MB, and it is the
only operation in the whole tool that uses the network. Give it a generous
timeout or run it in the background.

Two flags change that behaviour:

- **`--from <path>`**: copies a model that already exists on disk instead of
  downloading it. It takes seconds. The path must contain
  `Xenova/multilingual-e5-small/` with its four files. If it does not have
  them, it fails with `MODEL_SOURCE_INVALID` (code `2`) instead of downloading
  silently.
- **`--skip-model`**: prepares only the database. For CI or environments
  without network. `sync` and `retrieve` will not work until you install the
  model.

## `LIBRARY_NOT_FOUND`

The database is missing. The message includes the exact path where it looked for
it.

Causes, in order of likelihood:

1. **You never ran `init`.** Run it.
2. **You defined `AUTO_YOUTUBE_RAG_HOME` with a value different** from the one
   you used before, or you defined it in one invocation and not in another.
   Check that it is the same value in all of them.

## `MODEL_NOT_INSTALLED`

The database exists but the model is missing, or it is damaged. `sync` and
`retrieve` need it; `status`, `doctor` and `source` do not.

```text
auto-youtube-rag models install
auto-youtube-rag models install --from <path-to-an-existing-model>
auto-youtube-rag models install --force
```

**It is not a transient failure.** Retrying `sync` without installing the model
fails again just the same.

## `models status` returns `incomplete`

The installation is half-finished or damaged: typically an interrupted download,
which leaves the files in place with the wrong size. It also appears if someone
copied the model by hand, without going through the tool.

The `models/.install.json` receipt stores the expected size of every file, and
`models status` lists in `issues` which ones do not match.

It is repaired by reinstalling on top:

```text
auto-youtube-rag models install --force
```

## Moving the library

There is no relocation command. You move the directory by hand and define
`AUTO_YOUTUBE_RAG_HOME` pointing at the new place, in every invocation.

## `LEGACY_LIBRARY_FOUND`

A warning, not an error. There is an old database in
`<current-directory>/.auto-youtube-rag/`, from when the tool kept the library
next to the working directory. It is no longer read.

If that database had content you care about, move it to the new home or point
`AUTO_YOUTUBE_RAG_HOME` at it. The tool does not migrate it on its own: moving
the user's data without being asked is not its job.
