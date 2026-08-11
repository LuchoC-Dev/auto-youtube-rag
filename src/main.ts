#!/usr/bin/env node

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { runCli } from "./interfaces/cli/run-cli.js";

export const applicationName = "auto-youtube-rag";

export async function main(
  argv: readonly string[] = process.argv.slice(2),
): Promise<number> {
  const dataDirectory = resolve(
    process.env.AUTO_YOUTUBE_RAG_HOME ??
      resolve(process.cwd(), ".auto-youtube-rag"),
  );
  return runCli({
    argv,
    config: {
      databasePath: resolve(dataDirectory, "index.sqlite"),
      modelCachePath: resolve(
        process.env.AUTO_YOUTUBE_RAG_MODEL_CACHE ??
          resolve(process.cwd(), ".cache", "models"),
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
