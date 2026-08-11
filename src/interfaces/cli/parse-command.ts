import { parseArgs } from "node:util";

export type ParsedCliCommand =
  | { readonly kind: "init" }
  | {
      readonly kind: "source_add";
      readonly path: string;
      readonly name: string;
    }
  | { readonly kind: "source_list" }
  | { readonly kind: "source_remove"; readonly name: string }
  | { readonly kind: "sync"; readonly source: string | null }
  | { readonly kind: "status" }
  | { readonly kind: "doctor" };

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
      const { positionals } = parse(rest);
      exactPositionals(positionals, 0, "auto-youtube-rag init");
      return { kind: "init" };
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
      });
      exactPositionals(
        positionals,
        0,
        "auto-youtube-rag sync [--source <name>]",
      );
      return {
        kind: "sync",
        source: typeof values.source === "string" ? values.source : null,
      };
    }
    case "status":
    case "doctor": {
      const { positionals } = parse(rest);
      exactPositionals(positionals, 0, `auto-youtube-rag ${command}`);
      return { kind: command };
    }
    default:
      return usage(`Unknown command: ${command}`);
  }
}
