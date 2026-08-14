# Desarrollo local

## Estado

Toolchain aprobado y en uso. Este documento define el contrato de calidad del
repositorio y cómo ponerse a trabajar en una máquina nueva.

La frase original decía que el repositorio "no implementa todavía el dominio ni
los casos de uso". Quedó desactualizada hace tiempo: el MVP completo (2.1–2.4,
3.1–3.2) y los puntos 4.1–4.6 están cerrados, con la CLI administrativa,
`retrieve` y `rebuild` implementados y probados. Ver `docs/build.md`.

## Versiones fijadas

- Node.js 24.19.0 mediante `.node-version`.
- TypeScript 6.0.3 en modo estricto.
- ESLint 10 con las configuraciones `strictTypeChecked` y
  `stylisticTypeChecked` de typescript-eslint.
- Prettier 3.9.6 con `eslint-config-prettier`.
- `node:test`, ejecutado sobre TypeScript mediante `tsx`.

TypeScript 7.0.2 no se utiliza por ahora porque typescript-eslint 8.67.0
declara compatibilidad con TypeScript `>=4.8.4 <6.1.0`. Mantener el compilador
en 6.0.3 evita una instalación forzada y permite lint con información de tipos.
La actualización se reconsiderará cuando la cadena oficial sea compatible.

## Arrancar en una máquina nueva

Nada de lo que no está versionado es irrecuperable. Un clon limpio se pone a
trabajar con estos pasos:

```powershell
git clone https://github.com/LuchoC-Dev/auto-youtube-rag.git
cd auto-youtube-rag
npm.cmd ci          # respeta package-lock.json; no uses "npm install"
npm.cmd run check   # 342 tests, sin red y sin modelo
npm.cmd run build
```

**Hasta acá no hace falta ni red ni modelo de embeddings.** La suite rápida
omite los smokes por el patrón `smoke` y trabaja con
`FakeEmbeddingGenerator`, así que typecheck, lint, tests, formato y build
corren enteros sobre un clon recién bajado.

Sólo dos cosas requieren un paso extra, y cada una tiene su comando:

| Para                            | Ejecutar                      | Requiere red |
| ------------------------------- | ----------------------------- | ------------ |
| Los dos smokes y los benchmarks | `npm.cmd run models:download` | Sí, ~129 MB  |
| Usar el producto de verdad      | `auto-youtube-rag init`       | Sí, ~130 MB  |

Son rutas distintas a propósito: `models:download` llena el caché **del
repositorio** (`<repo>/.cache/models`) y es herramienta de desarrollo;
`init` instala en el **hogar del usuario** y no sabe que este repositorio
existe. Ver la sección siguiente.

Qué falta en un clon y cómo vuelve:

| Ausente         | Se regenera con               |
| --------------- | ----------------------------- |
| `node_modules/` | `npm.cmd ci`                  |
| `dist/`         | `npm.cmd run build`           |
| `.cache/models` | `npm.cmd run models:download` |
| La biblioteca   | `auto-youtube-rag init`       |

`.cache/` está en `.gitignore` y **nunca viajó al remoto**: ninguna máquina lo
recibe al clonar, y esa es la intención. Es territorio local de desarrollo,
reconstruible en un comando.

### Cuidado con la profundidad de la ruta en Windows

La ruta relativa más larga del repositorio mide **95 caracteres**
(`evals/results/2026-08-12/judgments/...`). Con el límite de 260 caracteres de
Windows, eso deja unos **164 para el directorio donde clones**. Pasado ese
punto el `git clone` falla a mitad del checkout con `Filename too long` y deja
un árbol incompleto — comprobado: un clon en una ruta de 170 caracteres se cayó
con 7 archivos sin crear, mientras que uno en `C:\tmp-clone-test` trajo los 325
archivos sin un solo error.

Clonar en una ruta corta (`C:\dev\...`) alcanza. Si hace falta una profunda:

```powershell
git config --global core.longpaths true
```

Verificado el 14 de agosto de 2026 sobre un clon limpio en `C:\tmp-clone-test`:
`npm ci`, `npm run check` (342 tests) y `npm run build` pasaron **sin `.cache/`
y sin red**. `test:embedding:smoke` falló con su mensaje indicando
`npm run models:download`, y `test:install:smoke` se saltó solo, tal como está
diseñado.

Lo único que existe sólo en la máquina donde se corrió son los resultados
sueltos de benchmark (`benchmarks/*/results/`, salvo los `baseline.*`
versionados). Es deliberado: las **conclusiones** de cada benchmark están en
`docs/decisions.md`, que sí se versiona; los datos crudos de cada corrida no
se conservan.

## Comandos

| Comando                        | Responsabilidad                                            |
| ------------------------------ | ---------------------------------------------------------- |
| `npm run build`                | Compilar `src/` en `dist/` con declaraciones y source maps |
| `npm run typecheck`            | Verificar todo el TypeScript sin emitir archivos           |
| `npm run lint`                 | Ejecutar reglas estrictas y conscientes de tipos           |
| `npm test`                     | Ejecutar pruebas con el runner nativo de Node              |
| `npm run test:watch`           | Repetir las pruebas afectadas durante el desarrollo        |
| `npm run test:coverage`        | Generar cobertura con el soporte nativo de Node            |
| `npm run test:embedding:smoke` | Validar E5 Small usando sólo el modelo local               |
| `npm run format`               | Aplicar Prettier                                           |
| `npm run format:check`         | Verificar formato sin modificar archivos                   |
| `npm run check`                | Ejecutar typecheck, lint, tests y formato                  |

Los benchmarks conservan comandos separados porque no forman parte de la
puerta rápida de calidad de cada cambio.

### Smoke local de E5 Small

El smoke del modelo es deliberadamente independiente de `npm run check`. La
suite rápida descubre su archivo, pero lo omite por el patrón `smoke`; sólo el
comando explícito ejecuta la inferencia:

```text
npm run models:download
npm run test:embedding:smoke
npm run test:install:smoke
```

`models:download` descarga únicamente E5 Small **al caché del repositorio**
(`<repo>/.cache/models`). Es herramienta de desarrollo: alimenta los
benchmarks y los dos smokes. Para descargar todos los modelos del benchmark
histórico se usa `npm run models:download:benchmarks`.

**No es la forma de instalar el producto.** Desde el punto 4.2, el usuario
instala con `auto-youtube-rag init`, que escribe en el hogar de usuario
(`~/.auto-youtube-rag/models/`) y no sabe que este repositorio existe.
`models:download` depende de `tsx` y de `benchmarks/`, ninguno de los cuales
está disponible fuera de un repositorio clonado. El `.cache/` del repositorio
es territorio exclusivo de desarrollo.

El smoke de embeddings exige los archivos en `.cache/models`, trabaja con
`local_files_only` y nunca accede a la red. `test:install:smoke` copia ese
mismo modelo a un hogar temporal para ejercitar la adopción real por
`--from`; se omite si el caché no existe, en vez de fallar. Ambos quedan
fuera de `npm run check` por el patrón `smoke`.

## Estructura y límites

`tsconfig.json` cubre producto, pruebas y benchmarks. `tsconfig.build.json`
emite únicamente `src/`. Los benchmarks históricos siguen bajo typecheck, pero
se excluyen temporalmente de ESLint y Prettier para no mezclar su migración con
la implementación del producto. Todo código nuevo en `src/` y `test/` utiliza
el baseline estricto. Los directorios generados, cachés, resultados y pesos
locales quedan excluidos de lint, formato y Git según corresponda.

`src/main.ts` es el entry point real de la CLI: resuelve las rutas del hogar de
usuario con `resolvePaths` y delega en `runCli`, que implementa todos los
comandos del contrato. Fue un smoke scaffold al principio del proyecto y esta
sección lo describía así; dejó de serlo al cerrarse el punto 2.1.

## Cómo commitear

**Los commits se hacen con la skill `/git-commit`, no con `git commit` a
mano.** Es la convención del proyecto y aplica a cualquier agente que trabaje
acá, sin excepción por urgencia o por tamaño del cambio.

La skill analiza el diff real para elegir tipo y alcance, en vez de confiar en
lo que el autor cree haber cambiado, y evita las desviaciones que aparecen
cuando cada quien redacta el mensaje a su criterio.

Reglas que la acompañan:

- Un cambio lógico por commit; máximo cinco archivos por tarea. Si un commit
  necesita más, decilo explícitamente en el cuerpo y explicá por qué partirlo
  habría sido peor.
- Mensajes en inglés, siguiendo el historial del repositorio.
- Nunca `Co-Authored-By`.
- Nunca `--no-verify` ni saltear hooks.
- **Nunca pushear ni reescribir historial sin pedido explícito del usuario**:
  `main` está publicada en un repositorio privado y el push la hace visible
  fuera de esta máquina.

## Criterio de aceptación

Antes de integrar un cambio deben pasar:

```text
npm run build
npm run check
```

Las pruebas funcionales crecerán junto con cada caso de uso. Las suites de
contrato de adaptadores y las pruebas SQLite usarán recursos temporales y no
dependerán del índice personal del usuario.
