import { access, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname } from "node:path";

import { getStatus } from "../../application/diagnostics/get-status.js";
import { runDoctor } from "../../application/diagnostics/run-doctor.js";
import { installModel } from "../../application/models/install-model.js";
import type { ModelInstaller } from "../../application/ports/model-installer.js";
import { ContextBudget } from "../../domain/context/context-budget.js";
import { SourceName } from "../../domain/indexing/identifiers.js";
import { RetrievalFilter } from "../../domain/retrieval/retrieval-filter.js";
import { RetrievalQuery } from "../../domain/retrieval/retrieval-query.js";
import {
  describeModelState,
  readModelState,
} from "../../infrastructure/config/model-install-state.js";
import { E5EmbeddingGenerator } from "../../infrastructure/embeddings/e5-embedding-generator.js";
import { E5ModelInstaller } from "../../infrastructure/embeddings/e5-model-installer.js";
import { writeContextBundle } from "../../infrastructure/filesystem/write-context-bundle.js";
import { SQLiteMigrationError } from "../../infrastructure/sqlite/open-database.js";
import { SQLiteDiagnosticsRepository } from "../../infrastructure/sqlite/sqlite-diagnostics.js";
import type {
  Application,
  ApplicationConfig,
} from "../../main/create-application.js";
import { createApplication } from "../../main/create-application.js";
import { commandRequirement } from "./command-requirements.js";
import type { ParsedCliCommand } from "./parse-command.js";
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
  /** `models install`/`models status` require no library (Decision 7 of
   * docs/install-design.md), so they never call applicationFactory or open
   * SQLite. This override exists purely for tests: it lets them avoid a
   * real network download the same way applicationFactory lets other tests
   * avoid a real SQLite database. */
  readonly modelInstallerFactory?: (
    config: ApplicationConfig,
  ) => ModelInstaller;
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

/**
 * Detects a pre-4.2 cwd-relative library the resolved home does not know
 * about (Decision 6 of docs/install-design.md). Only warns when the
 * resolved home is itself empty: a legacy file next to a home that already
 * has a library is noise, not a signal.
 */
async function legacyLibraryWarnings(
  config: ApplicationConfig,
  homeIsEmpty: boolean,
): Promise<readonly Record<string, unknown>[]> {
  if (
    !homeIsEmpty ||
    config.legacyDatabasePath === undefined ||
    config.legacyDatabasePath === config.databasePath ||
    !(await exists(config.legacyDatabasePath))
  ) {
    return [];
  }

  return [
    {
      code: "LEGACY_LIBRARY_FOUND",
      message:
        `A library was found at ${config.legacyDatabasePath} (the pre-4.2 ` +
        `cwd-relative default), but it is not visible from the active home ` +
        `${config.databasePath}. Move the file under the new home, or set ` +
        "AUTO_YOUTUBE_RAG_HOME to point at its parent directory.",
      home_database_path: config.databasePath,
      legacy_database_path: config.legacyDatabasePath,
    },
  ];
}

/**
 * Verifies a command's requirement exactly once, before the Application is
 * built (Z2 of docs/install-tasks.md): a missing library or model produces
 * one accessible error naming the command that fixes it, instead of the
 * raw ERR_SQLITE_ERROR (missing library) or one MODEL_LOAD_FAILED issue
 * per video (missing model) the 13 August cold run hit.
 */
async function preflight(
  command: ParsedCliCommand,
  options: RunCliOptions,
): Promise<void> {
  const requirement = commandRequirement(command);
  if (requirement === "none") return;

  if (!(await exists(options.config.databasePath))) {
    throw Object.assign(
      new Error(
        `No library was found at ${options.config.databasePath}. Run "auto-youtube-rag init" first.`,
      ),
      { code: "LIBRARY_NOT_FOUND", retryable: false },
    );
  }

  if (requirement === "library_and_model") {
    const modelState = await readModelState(options.config.modelCachePath);
    if (modelState !== "installed") {
      throw Object.assign(
        new Error(
          `The embedding model is not installed at ${options.config.modelCachePath}. Run "auto-youtube-rag models install" first.`,
        ),
        { code: "MODEL_NOT_INSTALLED", retryable: false },
      );
    }
  }
}

/**
 * Recognizes a raw SQLite driver failure so it can be translated instead
 * of propagated (Z4 of docs/install-tasks.md): `SQLiteMigrationError`
 * (open-database.ts's own schema/version checks) and `ERR_SQLITE_ERROR`
 * (node:sqlite's code for a file that fails to open as a database, e.g.
 * "file is not a database").
 */
function isDatabaseIntegrityError(error: unknown): boolean {
  return (
    error instanceof SQLiteMigrationError ||
    (error instanceof Error &&
      "code" in error &&
      error.code === "ERR_SQLITE_ERROR")
  );
}

function doctorIntegrityFailureReceipt(
  databasePath: string,
  error: unknown,
): Record<string, unknown> {
  const detail = error instanceof Error ? error.message : String(error);
  return {
    status: "error",
    checks: [
      {
        code: "SQLITE_INTEGRITY",
        status: "error",
        message: `Could not open the database at ${databasePath}: ${detail}`,
      },
    ],
  };
}

async function runModelsCommand(
  command:
    | {
        readonly kind: "models_install";
        readonly force: boolean;
        readonly from: string | null;
      }
    | { readonly kind: "models_status" },
  options: RunCliOptions,
): Promise<number> {
  const embeddingGenerator = new E5EmbeddingGenerator({
    cacheDir: options.config.modelCachePath,
  });
  const modelInstaller = (
    options.modelInstallerFactory ?? (() => new E5ModelInstaller())
  )(options.config);

  if (command.kind === "models_status") {
    const [model, description] = await Promise.all([
      embeddingGenerator.describe(),
      describeModelState(options.config.modelCachePath),
    ]);
    const receipt: Record<string, unknown> = {
      status: description.state,
      model,
      cache_path: options.config.modelCachePath,
    };
    if (description.state === "incomplete") {
      receipt.issues = description.issues;
    }
    options.stdout.write(renderCliSuccess(receipt));
    return 0;
  }

  options.stderr.write("Installing the embedding model...\n");
  const result = await installModel(
    { modelInstaller, embeddingGenerator },
    {
      modelsPath: options.config.modelCachePath,
      from: command.from,
      force: command.force,
    },
  );
  options.stdout.write(
    renderCliSuccess({
      status: result.status,
      model: result.model,
      cache_path: result.cachePath,
      bytes: result.bytes,
      source: result.source,
    }),
  );
  return 0;
}

export async function runCli(options: RunCliOptions): Promise<number> {
  let application: Application | undefined;
  try {
    const command = parseCommand(options.argv);

    // models install/status require no library (Decision 7 of
    // docs/install-design.md): they never build the Application, so a
    // models command works even before `init` has ever run.
    if (command.kind === "models_install" || command.kind === "models_status") {
      return await runModelsCommand(command, options);
    }

    const alreadyInitialized = await exists(options.config.databasePath);
    if (command.kind === "init") {
      await mkdir(dirname(options.config.databasePath), { recursive: true });
    } else {
      await preflight(command, options);
    }

    try {
      application = (options.applicationFactory ?? createApplication)(
        options.config,
      );
    } catch (error: unknown) {
      if (!isDatabaseIntegrityError(error)) throw error;

      // doctor's whole job is diagnosing what is broken: it must keep
      // running and report the detail instead of crashing the same way
      // sync/retrieve do (Z4 of docs/install-tasks.md).
      if (command.kind === "doctor") {
        options.stdout.write(
          renderCliSuccess(
            doctorIntegrityFailureReceipt(options.config.databasePath, error),
          ),
        );
        return 1;
      }

      throw Object.assign(
        new Error(
          `The library at ${options.config.databasePath} failed an integrity check. Run "auto-youtube-rag doctor" for details.`,
        ),
        { code: "DATABASE_INTEGRITY_ERROR", retryable: false, cause: error },
      );
    }

    switch (command.kind) {
      case "init": {
        let model: Record<string, unknown> | null = null;
        if (!command.skipModel) {
          const modelInstaller = (
            options.modelInstallerFactory ?? (() => new E5ModelInstaller())
          )(options.config);
          const installed = await installModel(
            {
              modelInstaller,
              embeddingGenerator: application.embeddingGenerator,
            },
            {
              modelsPath: options.config.modelCachePath,
              from: command.from,
              force: false,
            },
          );
          model = {
            status: installed.status,
            key: installed.model.key,
            version: installed.model.version,
            dimensions: installed.model.dimensions,
            bytes: installed.bytes,
            source: installed.source,
            cache_path: installed.cachePath,
          };
        }

        options.stdout.write(
          renderCliSuccess({
            status: alreadyInitialized ? "already_initialized" : "initialized",
            database_path: options.config.databasePath,
            home: dirname(options.config.databasePath),
            model,
            warnings: await legacyLibraryWarnings(
              options.config,
              !alreadyInitialized,
            ),
          }),
        );
        return 0;
      }
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
        options.stdout.write(
          renderCliSuccess({
            status: "ok",
            ...status,
            warnings: await legacyLibraryWarnings(
              options.config,
              status.counts.sources === 0,
            ),
          }),
        );
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
      case "retrieve": {
        const request = {
          query: RetrievalQuery.create({
            text: command.query,
            filter: RetrievalFilter.create({
              sources: command.sources.map((name) => SourceName.create(name)),
            }),
          }),
          budget: ContextBudget.create({
            depth: command.depth ?? undefined,
            maxTokensOverride: command.maxTokens,
          }),
        };

        options.stderr.write("Retrieving context...\n");
        const bundle = await application.assembleContext(request);
        const written = await writeContextBundle(
          bundle,
          command.out ?? tmpdir(),
        );

        const degraded = bundle.result.warnings.length > 0;
        options.stdout.write(
          renderCliSuccess({
            status: degraded ? "partial" : bundle.result.status,
            request_id: written.requestId,
            context_path: written.contextPath,
            result_path: written.resultPath,
            estimated_tokens: bundle.result.metrics.estimated_tokens,
            sources_used: bundle.result.metrics.sources_used,
            warnings: bundle.result.warnings,
          }),
        );
        return degraded ? 1 : 0;
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
