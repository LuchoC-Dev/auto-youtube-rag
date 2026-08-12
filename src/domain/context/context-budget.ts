import { DomainValidationError } from "../indexing/domain-error.js";

/**
 * The three depth presets approved in `cli-contract.md`. Their public names
 * are stable; only the token ceiling they resolve to can be replaced by an
 * explicit override, and `--max-tokens` never renames a preset.
 */
export const contextDepths = ["focused", "balanced", "deep"] as const;

export type ContextDepth = (typeof contextDepths)[number];

export const contextDepthPresets: Readonly<Record<ContextDepth, number>> =
  Object.freeze({
    focused: 12_000,
    balanced: 32_000,
    deep: 64_000,
  });

export const defaultContextDepth: ContextDepth = "balanced";

export interface ContextBudgetInput {
  readonly depth?: unknown;
  readonly maxTokensOverride?: unknown;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_CONTEXT_BUDGET",
    field,
    `${field} ${expectation}`,
  );
}

function readDepth(input: unknown): ContextDepth {
  if (input === undefined) {
    return defaultContextDepth;
  }

  if (
    typeof input !== "string" ||
    !contextDepths.some((depth) => depth === input)
  ) {
    invalid("depth", `must be one of ${contextDepths.join(", ")}`);
  }

  return input as ContextDepth;
}

function readMaxTokens(input: unknown, preset: number): number {
  if (input === undefined || input === null) {
    return preset;
  }

  if (typeof input !== "number" || !Number.isSafeInteger(input) || input < 1) {
    invalid("maxTokensOverride", "must be a positive safe integer");
  }

  return input;
}

/**
 * The resolved token ceiling for an assembly request. `maxTokens` is a
 * maximum, not a fill target: the assembled bundle can be smaller when the
 * library holds less relevant evidence than the budget allows.
 */
export class ContextBudget {
  private constructor(
    public readonly depth: ContextDepth,
    public readonly maxTokens: number,
  ) {}

  public static default(): ContextBudget {
    return ContextBudget.create({});
  }

  public static create(input: ContextBudgetInput): ContextBudget {
    const depth = readDepth(input.depth);
    const maxTokens = readMaxTokens(
      input.maxTokensOverride,
      contextDepthPresets[depth],
    );

    return new ContextBudget(depth, maxTokens);
  }
}
