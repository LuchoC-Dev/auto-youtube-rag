#!/usr/bin/env node

import { homedir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { resolvePaths } from "./infrastructure/config/resolve-paths.js";
import { runCli } from "./interfaces/cli/run-cli.js";

export const applicationName = "auto-youtube-rag";

export async function main(
  argv: readonly string[] = process.argv.slice(2),
): Promise<number> {
  const paths = resolvePaths(process.env, homedir);
  return runCli({
    argv,
    config: {
      databasePath: paths.databasePath,
      modelCachePath: paths.modelsPath,
      legacyDatabasePath: resolve(
        process.cwd(),
        ".auto-youtube-rag",
        "index.sqlite",
      ),
    },
    stdout: process.stdout,
    stderr: process.stderr,
  });
}

const entryPoint = process.argv[1];
if (
  entryPoint !== undefined &&
  pathToFileURL(resolve(entryPoint)).href === import.meta.url
) {
  process.exitCode = await main();
}
