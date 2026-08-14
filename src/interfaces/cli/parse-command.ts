import { parseArgs } from "node:util";

import { contextDepths } from "../../domain/context/context-budget.js";

export type ParsedCliCommand =
  | {
      readonly kind: "init";
      readonly skipModel: boolean;
      readonly from: string | null;
    }
  | {
      readonly kind: "source_add";
      readonly path: string;
      readonly name: string;
    }
  | { readonly kind: "source_list" }
  | { readonly kind: "source_remove"; readonly name: string }
  | {
      readonly kind: "sync";
      readonly source: string | null;
      readonly force: boolean;
    }
  | { readonly kind: "rebuild" }
  | { readonly kind: "status" }
  | { readonly kind: "doctor" }
  | {
      readonly kind: "retrieve";
      readonly query: string;
      readonly depth: string | null;
      readonly maxTokens: number | null;
      readonly sources: readonly string[];
      readonly out: string | null;
    }
  | {
      readonly kind: "models_install";
      readonly force: boolean;
      readonly from: string | null;
    }
  | { readonly kind: "models_status" };

export class CliUsageError extends Error {
  public readonly code = "INVALID_ARGUMENTS";
  public readonly exitCode = 2;
  public readonly retryable = false;

  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "CliUsageError";
  }
}

type ParseOptions = NonNullable<Parameters<typeof parseArgs>[0]>["options"];

function usage(message: string, cause?: unknown): never {
  throw new CliUsageError(message, cause === undefined ? undefined : { cause });
}

function parse(
  args: readonly string[],
  options: ParseOptions = {},
): ReturnType<typeof parseArgs> {
  try {
    return parseArgs({
      args: [...args],
      options,
      strict: true,
      allowPositionals: true,
    });
  } catch (error: unknown) {
    return usage(
      error instanceof Error ? error.message : "Invalid command arguments.",
      error,
    );
  }
}

function exactPositionals(
  positionals: readonly string[],
  count: number,
  usageText: string,
): void {
  if (positionals.length !== count) usage(`Usage: ${usageText}`);
}

export function parseCommand(argv: readonly string[]): ParsedCliCommand {
  const [command, ...rest] = argv;
  if (command === undefined) return usage("A command is required.");

  switch (command) {
    case "init": {
      const { positionals, values } = parse(rest, {
        "skip-model": { type: "boolean" },
        from: { type: "string" },
      });
      exactPositionals(
        positionals,
        0,
        "auto-youtube-rag init [--skip-model] [--from <path>]",
      );
      return {
        kind: "init",
        skipModel: values["skip-model"] === true,
        from: typeof values.from === "string" ? values.from : null,
      };
    }
    case "source": {
      const [subcommand, ...sourceArgs] = rest;
      if (subcommand === "add") {
        const { positionals, values } = parse(sourceArgs, {
          name: { type: "string" },
        });
        exactPositionals(
          positionals,
          1,
          "auto-youtube-rag source add <path> --name <name>",
        );
        if (typeof values.name !== "string") {
          return usage(
            "Usage: auto-youtube-rag source add <path> --name <name>",
          );
        }
        return {
          kind: "source_add",
          path: positionals[0] ?? "",
          name: values.name,
        };
      }
      if (subcommand === "list") {
        const { positionals } = parse(sourceArgs);
        exactPositionals(positionals, 0, "auto-youtube-rag source list");
        return { kind: "source_list" };
      }
      if (subcommand === "remove") {
        const { positionals } = parse(sourceArgs);
        exactPositionals(
          positionals,
          1,
          "auto-youtube-rag source remove <name>",
        );
        return { kind: "source_remove", name: positionals[0] ?? "" };
      }
      return usage("Usage: auto-youtube-rag source <add|list|remove> ...");
    }
    case "sync": {
      const { positionals, values } = parse(rest, {
        source: { type: "string" },
        force: { type: "boolean" },
      });
      exactPositionals(
        positionals,
        0,
        "auto-youtube-rag sync [--source <name>] [--force]",
      );
      return {
        kind: "sync",
        source: typeof values.source === "string" ? values.source : null,
        force: values.force === true,
      };
    }
    case "rebuild": {
      const usageText = "auto-youtube-rag rebuild --confirm";
      // `strict` parsing already rejects any other flag — `--force` included,
      // which rebuild deliberately does not accept: superseding a ghost run
      // and rebuilding the whole library are two separate decisions.
      const { positionals, values } = parse(rest, {
        confirm: { type: "boolean" },
      });
      exactPositionals(positionals, 0, usageText);
      if (values.confirm !== true) {
        return usage(
          "rebuild deletes and regenerates the whole derived index, so it " +
            `requires explicit confirmation. Usage: ${usageText}`,
        );
      }
      return { kind: "rebuild" };
    }
    case "status":
    case "doctor": {
      const { positionals } = parse(rest);
      exactPositionals(positionals, 0, `auto-youtube-rag ${command}`);
      return { kind: command };
    }
    case "retrieve": {
      const usageText =
        "auto-youtube-rag retrieve <query> [--depth focused|balanced|deep] " +
        "[--max-tokens <positive-integer>] [--source <name>] [--out <directory>]";
      const { positionals, values } = parse(rest, {
        depth: { type: "string" },
        "max-tokens": { type: "string" },
        source: { type: "string", multiple: true },
        out: { type: "string" },
      });
      exactPositionals(positionals, 1, usageText);

      if (
        typeof values.depth === "string" &&
        !contextDepths.some((depth) => depth === values.depth)
      ) {
        return usage(`--depth must be one of ${contextDepths.join(", ")}.`);
      }

      let maxTokens: number | null = null;
      if (typeof values["max-tokens"] === "string") {
        const parsed = Number(values["max-tokens"]);
        if (!Number.isSafeInteger(parsed) || parsed < 1) {
          return usage("--max-tokens must be a positive integer.");
        }
        maxTokens = parsed;
      }

      return {
        kind: "retrieve",
        query: positionals[0] ?? "",
        depth: typeof values.depth === "string" ? values.depth : null,
        maxTokens,
        sources:
          Array.isArray(values.source) &&
          values.source.every((entry) => typeof entry === "string")
            ? values.source
            : [],
        out: typeof values.out === "string" ? values.out : null,
      };
    }
    case "models": {
      const [subcommand, ...modelArgs] = rest;
      if (subcommand === "install") {
        const { positionals, values } = parse(modelArgs, {
          force: { type: "boolean" },
          from: { type: "string" },
        });
        exactPositionals(
          positionals,
          0,
          "auto-youtube-rag models install [--force] [--from <path>]",
        );
        return {
          kind: "models_install",
          force: values.force === true,
          from: typeof values.from === "string" ? values.from : null,
        };
      }
      if (subcommand === "status") {
        const { positionals } = parse(modelArgs);
        exactPositionals(positionals, 0, "auto-youtube-rag models status");
        return { kind: "models_status" };
      }
      return usage("Usage: auto-youtube-rag models <install|status> ...");
    }
    default:
      return usage(`Unknown command: ${command}`);
  }
}
