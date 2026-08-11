import type { EmbeddingGenerator } from "../ports/embedding-generator.js";
import {
  createFragmentKey,
  sha256,
} from "../../domain/indexing/content-identity.js";
import { SearchFragmentId } from "../../domain/indexing/identifiers.js";
import type { KnowledgeUnit } from "../../domain/indexing/knowledge-unit.js";
import { SearchFragment } from "../../domain/indexing/search-fragment.js";

export type FragmentationErrorCode =
  | "INVALID_MAX_INPUT_TOKENS"
  | "TOKEN_COUNT_MISMATCH"
  | "INVALID_TOKEN_COUNT"
  | "CONTENT_UNSPLITTABLE";

export class FragmentationError extends Error {
  public constructor(
    public readonly code: FragmentationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "FragmentationError";
  }
}

type FragmentationModel = Pick<EmbeddingGenerator, "describe" | "countTokens">;

interface SplitStrategy {
  readonly separator: string;
  split(text: string): readonly string[];
}

const splitStrategies: readonly SplitStrategy[] = Object.freeze([
  {
    separator: "\n\n",
    split: (text: string) => text.split(/\n(?:[\t ]*\n)+/u),
  },
  {
    separator: "\n",
    split: (text: string) => text.split(/\n+/u),
  },
  {
    separator: " ",
    split: (text: string) => text.split(/(?<=[.!?])\s+/u),
  },
  {
    separator: " ",
    split: (text: string) => text.split(/\s+/u),
  },
  {
    separator: "",
    split: (text: string) => Array.from(text),
  },
]);

function canonicalContent(content: string): string {
  return content.replace(/\r\n?/gu, "\n").trim();
}

function canonicalParts(parts: readonly string[]): readonly string[] {
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
}

class TokenCountingSession {
  private readonly cache = new Map<string, number>();

  public constructor(private readonly model: FragmentationModel) {}

  public async count(text: string): Promise<number> {
    const cached = this.cache.get(text);
    if (cached !== undefined) {
      return cached;
    }

    const counts = await this.model.countTokens(Object.freeze([text]));
    if (!Array.isArray(counts) || counts.length !== 1) {
      throw new FragmentationError(
        "TOKEN_COUNT_MISMATCH",
        "countTokens must return exactly one count for each requested text",
      );
    }

    const count: unknown = (counts as readonly unknown[])[0];
    if (
      typeof count !== "number" ||
      !Number.isSafeInteger(count) ||
      count <= 0
    ) {
      throw new FragmentationError(
        "INVALID_TOKEN_COUNT",
        "countTokens must return positive safe integers for non-empty text",
      );
    }

    this.cache.set(text, count);
    return count;
  }
}

async function splitToFit(
  text: string,
  strategyIndex: number,
  maxInputTokens: number,
  counter: TokenCountingSession,
): Promise<readonly string[]> {
  const canonical = canonicalContent(text);
  if ((await counter.count(canonical)) <= maxInputTokens) {
    return Object.freeze([canonical]);
  }

  const strategy = splitStrategies[strategyIndex];
  if (strategy === undefined) {
    throw new FragmentationError(
      "CONTENT_UNSPLITTABLE",
      "one Unicode code point exceeds the model input token limit",
    );
  }

  const parts = canonicalParts(strategy.split(canonical));
  if (parts.length <= 1) {
    return splitToFit(canonical, strategyIndex + 1, maxInputTokens, counter);
  }

  const fragments: string[] = [];
  let current = "";

  for (const part of parts) {
    const candidate =
      current.length === 0 ? part : `${current}${strategy.separator}${part}`;

    if ((await counter.count(candidate)) <= maxInputTokens) {
      current = candidate;
      continue;
    }

    if (current.length > 0) {
      fragments.push(current);
      current = "";
    }

    if ((await counter.count(part)) <= maxInputTokens) {
      current = part;
      continue;
    }

    fragments.push(
      ...(await splitToFit(part, strategyIndex + 1, maxInputTokens, counter)),
    );
  }

  if (current.length > 0) {
    fragments.push(current);
  }

  return Object.freeze(fragments);
}

function readMaxInputTokens(input: unknown): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input <= 0) {
    throw new FragmentationError(
      "INVALID_MAX_INPUT_TOKENS",
      "maxInputTokens must be a positive safe integer",
    );
  }

  return input;
}

export async function fragmentKnowledgeUnits(
  units: readonly KnowledgeUnit[],
  model: FragmentationModel,
): Promise<readonly SearchFragment[]> {
  const descriptor = await model.describe();
  const maxInputTokens = readMaxInputTokens(descriptor.maxInputTokens);
  const counter = new TokenCountingSession(model);
  const fragments: SearchFragment[] = [];

  for (const unit of units) {
    if (!unit.searchable) {
      continue;
    }

    const contents = await splitToFit(unit.content, 0, maxInputTokens, counter);

    for (const [ordinal, content] of contents.entries()) {
      const tokenCount = await counter.count(content);
      if (tokenCount > maxInputTokens) {
        throw new FragmentationError(
          "CONTENT_UNSPLITTABLE",
          "fragment exceeds the model input token limit after splitting",
        );
      }

      fragments.push(
        SearchFragment.create({
          id: SearchFragmentId.create(createFragmentKey(unit.id, ordinal)),
          unitId: unit.id,
          ordinal,
          title: unit.title,
          headingPath: unit.headingPath,
          content,
          tokenCount,
          contentHash: sha256(content),
        }),
      );
    }
  }

  return Object.freeze(fragments);
}
