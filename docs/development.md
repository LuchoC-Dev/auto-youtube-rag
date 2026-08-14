# Desarrollo local

## Estado

Toolchain aprobado para el MVP. Este documento define el contrato de calidad
del repositorio; no implementa todavía el dominio ni los casos de uso.

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

`src/main.ts` y `test/main.test.ts` son un smoke scaffold para validar el
toolchain. No constituyen la implementación de la CLI ni autorizan decisiones
de dominio pendientes.

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
