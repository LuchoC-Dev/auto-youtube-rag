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
  const usage = error instanceof CliUsageError;
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
