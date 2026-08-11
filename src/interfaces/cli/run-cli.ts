import { access, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

import { getStatus } from "../../application/diagnostics/get-status.js";
import { runDoctor } from "../../application/diagnostics/run-doctor.js";
import { SourceName } from "../../domain/indexing/identifiers.js";
import { SQLiteDiagnosticsRepository } from "../../infrastructure/sqlite/sqlite-diagnostics.js";
import type {
  Application,
  ApplicationConfig,
} from "../../main/create-application.js";
import { createApplication } from "../../main/create-application.js";
import { parseCommand } from "./parse-command.js";
import { renderCliError, renderCliSuccess } from "./render-cli-output.js";

export interface CliWriter {
  write(text: string): void;
}

export interface RunCliOptions {
  readonly argv: readonly string[];
  readonly config: ApplicationConfig;
  readonly stdout: CliWriter;
  readonly stderr: CliWriter;
  readonly applicationFactory?: (config: ApplicationConfig) => Application;
}

function sourceReceipt(source: Awaited<ReturnType<Application["addSource"]>>) {
  return {
    name: source.name.value,
    collection_path: source.collectionPath,
    manifest_path: source.manifestPath,
    videos_path: source.videosPath,
    enabled: source.enabled,
  };
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function interrupted(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "AbortError" ||
      ("code" in error && error.code === "ABORT_ERR"))
  );
}

function unreachable(value: never): never {
  throw new Error(`Unsupported parsed command: ${JSON.stringify(value)}`);
}

export async function runCli(options: RunCliOptions): Promise<number> {
  let application: Application | undefined;
  try {
    const command = parseCommand(options.argv);
    const alreadyInitialized = await exists(options.config.databasePath);
    if (command.kind === "init") {
      await mkdir(dirname(options.config.databasePath), { recursive: true });
    }
    application = (options.applicationFactory ?? createApplication)(
      options.config,
    );

    switch (command.kind) {
      case "init":
        options.stdout.write(
          renderCliSuccess({
            status: alreadyInitialized ? "already_initialized" : "initialized",
            database_path: options.config.databasePath,
          }),
        );
        return 0;
      case "source_add": {
        const source = await application.addSource({
          name: command.name,
          path: command.path,
        });
        options.stdout.write(
          renderCliSuccess({ status: "ok", source: sourceReceipt(source) }),
        );
        return 0;
      }
      case "source_list": {
        const sources = await application.listSources();
        options.stdout.write(
          renderCliSuccess({
            status: "ok",
            sources: sources.map(sourceReceipt),
          }),
        );
        return 0;
      }
      case "source_remove":
        await application.removeSource(command.name);
        options.stdout.write(
          renderCliSuccess({ status: "ok", source_name: command.name }),
        );
        return 0;
      case "sync": {
        if (command.source !== null) {
          const sources = await application.listSources();
          const requested = SourceName.create(command.source);
          if (!sources.some((source) => source.name.equals(requested))) {
            throw Object.assign(
              new Error(`Source ${command.source} is not registered.`),
              { code: "SOURCE_NOT_FOUND", retryable: false },
            );
          }
        }
        options.stderr.write("Synchronizing registered sources...\n");
        const results = await application.sync(command.source ?? undefined);
        const partial = results.some(
          (result) => result.status === "partial" || result.status === "failed",
        );
        const noChanges =
          results.length === 0 ||
          results.every((result) => result.status === "no_changes");
        options.stdout.write(
          renderCliSuccess({
            status: partial ? "partial" : noChanges ? "no_changes" : "ok",
            results,
          }),
        );
        return partial ? 1 : 0;
      }
      case "status": {
        const status = await getStatus(
          new SQLiteDiagnosticsRepository(application.database),
          application.embeddingGenerator,
        );
        options.stdout.write(renderCliSuccess({ status: "ok", ...status }));
        return 0;
      }
      case "doctor": {
        const result = await runDoctor(
          new SQLiteDiagnosticsRepository(application.database),
          application.sourceRegistry,
          application.embeddingGenerator,
          options.config.modelCachePath,
        );
        options.stdout.write(renderCliSuccess({ ...result }));
        return result.status === "ok" ? 0 : 1;
      }
    }
    return unreachable(command);
  } catch (error: unknown) {
    const rendered = renderCliError(error);
    options.stdout.write(rendered.output);
    return interrupted(error) ? 130 : rendered.exitCode;
  } finally {
    await application?.close();
  }
}
