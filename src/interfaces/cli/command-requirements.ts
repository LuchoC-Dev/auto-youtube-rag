import type { ParsedCliCommand } from "./parse-command.js";

/**
 * What a command needs before it runs. Checked once, before the
 * Application is even built (see Z2 in run-cli.ts), instead of failing
 * once per video the way the 13 August cold run did (63 MODEL_LOAD_FAILED
 * issues from a single missing model). `doctor` deliberately requires
 * "none": diagnosing what is missing is its job, so it must run without
 * either.
 */
export type CommandRequirement = "none" | "library" | "library_and_model";

function unreachable(value: never): never {
  throw new Error(`Unsupported parsed command: ${JSON.stringify(value)}`);
}

export function commandRequirement(
  command: ParsedCliCommand,
): CommandRequirement {
  switch (command.kind) {
    case "init":
    case "doctor":
    case "models_install":
    case "models_status":
      return "none";
    case "source_add":
    case "source_list":
    case "source_remove":
    case "status":
      return "library";
    case "sync":
    case "rebuild":
    case "retrieve":
      // `rebuild` re-embeds everything, so it needs the model as much as
      // `sync` does. Leaving it at "library" would reproduce the 13 August
      // cold run: the missing model discovered once per video instead of once
      // before any work starts.
      return "library_and_model";
    default:
      return unreachable(command);
  }
}
