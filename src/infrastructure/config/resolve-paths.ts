import { resolve } from "node:path";

export interface ResolvedPaths {
  readonly home: string;
  readonly databasePath: string;
  readonly modelsPath: string;
}

function readEnv(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

/**
 * Single source of truth for where the library and the embedding model
 * live. `env` and `homedir` are injected so tests never touch the real
 * environment or the real home directory of whoever runs the suite.
 *
 * Precedence for the home: `AUTO_YOUTUBE_RAG_HOME` -> `<homedir>/.auto-youtube-rag`.
 * Precedence for the model: `AUTO_YOUTUBE_RAG_MODELS_DIR` -> `<home>/models`.
 */
export function resolvePaths(
  env: NodeJS.ProcessEnv,
  homedir: () => string,
): ResolvedPaths {
  const home = resolve(
    readEnv(env, "AUTO_YOUTUBE_RAG_HOME") ??
      resolve(homedir(), ".auto-youtube-rag"),
  );
  const modelsPath = resolve(
    readEnv(env, "AUTO_YOUTUBE_RAG_MODELS_DIR") ?? resolve(home, "models"),
  );

  return Object.freeze({
    home,
    databasePath: resolve(home, "index.sqlite"),
    modelsPath,
  });
}
