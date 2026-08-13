import { ModelInstallerError } from "../../application/ports/model-installer.js";
import { CliUsageError } from "./parse-command.js";

export const cliSchemaVersion = "1.0";

export interface RenderedCliError {
  readonly exitCode: 1 | 2;
  readonly output: string;
}

function compact(value: unknown): string {
  return `${JSON.stringify(value)}\n`;
}

export function renderCliSuccess(
  receipt: Readonly<Record<string, unknown>>,
): string {
  return compact({ schema_version: cliSchemaVersion, ...receipt });
}

export function renderCliError(error: unknown): RenderedCliError {
  // --from pointing at an incomplete model is a usage mistake (the user
  // asked for something concrete that was not there), not an operational
  // failure: exit code 2, per Decision 5 of docs/install-design.md. Kept
  // as its own symbolic code (MODEL_SOURCE_INVALID) rather than wrapped in
  // CliUsageError, which would flatten it to the generic
  // INVALID_ARGUMENTS.
  const usage =
    error instanceof CliUsageError ||
    (error instanceof ModelInstallerError &&
      error.code === "MODEL_SOURCE_INVALID");
  const code =
    error instanceof Error && "code" in error && typeof error.code === "string"
      ? error.code
      : "OPERATION_FAILED";
  const retryable =
    error instanceof Error &&
    "retryable" in error &&
    typeof error.retryable === "boolean"
      ? error.retryable
      : false;
  const message = error instanceof Error ? error.message : "Operation failed.";
  return {
    exitCode: usage ? 2 : 1,
    output: compact({
      schema_version: cliSchemaVersion,
      status: "error",
      error: { code, message, retryable },
    }),
  };
}
