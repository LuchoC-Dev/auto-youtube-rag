import type {
  ContextDocumentSnapshot,
  ContextFrontmatterSnapshot,
  ContextFrontmatterValue,
  ContextSectionSnapshot,
} from "../../application/indexing/package-snapshots.js";

export type ContextMarkdownParseErrorCode =
  | "CONTEXT_INPUT_INVALID"
  | "CONTEXT_FRONTMATTER_UNTERMINATED"
  | "CONTEXT_FRONTMATTER_INVALID"
  | "CONTEXT_HEADING_INVALID";

export class ContextMarkdownParseError extends Error {
  public constructor(
    public readonly code: ContextMarkdownParseErrorCode,
    public readonly sourcePath: string,
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "ContextMarkdownParseError";
  }
}

interface ParsedFrontmatter {
  readonly frontmatter: ContextFrontmatterSnapshot;
  readonly bodyStart: number;
}

interface MutableContextSection {
  readonly title: string;
  readonly level: number;
  readonly ordinal: number;
  readonly headingPath: readonly string[];
  readonly contentLines: string[];
  readonly children: MutableContextSection[];
}

interface FenceMarker {
  readonly character: "`" | "~";
  readonly length: number;
}

const frontmatterKeyPattern = /^[A-Za-z_][A-Za-z0-9_-]*$/u;
const numericPattern = /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/u;
const headingPattern = /^ {0,3}(#{1,6})(?:[\t ]+|$)(.*)$/u;
const fencePattern = /^ {0,3}(`{3,}|~{3,})(.*)$/u;
const timestampPattern =
  /(?<!\d)(?:\d{1,2}:)?\d{2}:\d{2}(?:\s*[–—-]\s*(?:\d{1,2}:)?\d{2}:\d{2})?(?!\d)/gu;
const visualEvidencePattern =
  /(?<![A-Za-z0-9._/-])visual\/[A-Za-z0-9][A-Za-z0-9._%*?/-]*/gu;

function parseError(
  code: ContextMarkdownParseErrorCode,
  sourcePath: string,
  field: string,
  message: string,
): never {
  throw new ContextMarkdownParseError(code, sourcePath, field, message);
}

function parseDoubleQuoted(
  input: string,
  sourcePath: string,
  field: string,
): string {
  try {
    const value = JSON.parse(input) as unknown;

    if (typeof value === "string") {
      return value;
    }
  } catch {
    // The common error below supplies the stable parser contract.
  }

  return parseError(
    "CONTEXT_FRONTMATTER_INVALID",
    sourcePath,
    field,
    `${field} contains an invalid double-quoted string`,
  );
}

function parseSingleQuoted(
  input: string,
  sourcePath: string,
  field: string,
): string {
  if (input.length < 2 || !input.endsWith("'")) {
    return parseError(
      "CONTEXT_FRONTMATTER_INVALID",
      sourcePath,
      field,
      `${field} contains an invalid single-quoted string`,
    );
  }

  const inner = input.slice(1, -1);

  if (/(^|[^'])'(?!')/u.test(inner)) {
    return parseError(
      "CONTEXT_FRONTMATTER_INVALID",
      sourcePath,
      field,
      `${field} contains an unescaped single quote`,
    );
  }

  return inner.replace(/''/gu, "'");
}

function splitInlineArray(
  input: string,
  sourcePath: string,
  field: string,
): readonly string[] {
  const values: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (const character of input) {
    if (quote === '"') {
      current += character;

      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (quote === "'") {
      current += character;

      if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      current += character;
    } else if (character === ",") {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  if (quote !== null || escaped) {
    return parseError(
      "CONTEXT_FRONTMATTER_INVALID",
      sourcePath,
      field,
      `${field} contains an unterminated quoted value`,
    );
  }

  values.push(current.trim());
  return values;
}

function parseFrontmatterScalar(
  input: string,
  sourcePath: string,
  field: string,
): ContextFrontmatterValue {
  const value = input.trim();

  if (value === "" || value === "null" || value === "~") {
    return null;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value.startsWith('"')) {
    return parseDoubleQuoted(value, sourcePath, field);
  }

  if (value.startsWith("'")) {
    return parseSingleQuoted(value, sourcePath, field);
  }

  if (value.startsWith("[")) {
    if (!value.endsWith("]")) {
      return parseError(
        "CONTEXT_FRONTMATTER_INVALID",
        sourcePath,
        field,
        `${field} contains an unterminated inline array`,
      );
    }

    const inner = value.slice(1, -1).trim();

    if (inner === "") {
      return Object.freeze([]);
    }

    const items = splitInlineArray(inner, sourcePath, field).map((item) => {
      const parsed = parseFrontmatterScalar(item, sourcePath, field);

      if (typeof parsed !== "string") {
        return parseError(
          "CONTEXT_FRONTMATTER_INVALID",
          sourcePath,
          field,
          `${field} must contain only strings`,
        );
      }

      return parsed;
    });

    return Object.freeze(items);
  }

  if (numericPattern.test(value)) {
    const number = Number(value);

    if (Number.isFinite(number)) {
      return number;
    }
  }

  if (value.startsWith("{") || value.startsWith("-") || value.endsWith("]")) {
    return parseError(
      "CONTEXT_FRONTMATTER_INVALID",
      sourcePath,
      field,
      `${field} uses an unsupported frontmatter value`,
    );
  }

  return value;
}

function parseFrontmatter(
  lines: readonly string[],
  sourcePath: string,
): ParsedFrontmatter {
  if (lines[0] !== "---") {
    return { frontmatter: Object.freeze({}), bodyStart: 0 };
  }

  const closingIndex = lines.indexOf("---", 1);

  if (closingIndex === -1) {
    return parseError(
      "CONTEXT_FRONTMATTER_UNTERMINATED",
      sourcePath,
      "frontmatter",
      "frontmatter is missing its closing delimiter",
    );
  }

  const frontmatter: Record<string, ContextFrontmatterValue> = {};

  for (let index = 1; index < closingIndex; index += 1) {
    const line = lines[index] ?? "";

    if (line.trim() === "" || line.trimStart().startsWith("#")) {
      continue;
    }

    const separator = line.indexOf(":");

    if (separator <= 0 || line.startsWith(" ") || line.startsWith("\t")) {
      return parseError(
        "CONTEXT_FRONTMATTER_INVALID",
        sourcePath,
        `frontmatter.line:${String(index + 1)}`,
        `frontmatter line ${String(index + 1)} is not a supported key-value pair`,
      );
    }

    const key = line.slice(0, separator).trim();
    const field = `frontmatter.${key}`;

    if (!frontmatterKeyPattern.test(key)) {
      return parseError(
        "CONTEXT_FRONTMATTER_INVALID",
        sourcePath,
        field,
        `${field} is not a valid key`,
      );
    }

    if (Object.hasOwn(frontmatter, key)) {
      return parseError(
        "CONTEXT_FRONTMATTER_INVALID",
        sourcePath,
        field,
        `${field} is duplicated`,
      );
    }

    frontmatter[key] = parseFrontmatterScalar(
      line.slice(separator + 1),
      sourcePath,
      field,
    );
  }

  return {
    frontmatter: Object.freeze(frontmatter),
    bodyStart: closingIndex + 1,
  };
}

function fenceMarker(line: string): FenceMarker | null {
  const match = fencePattern.exec(line);

  if (match === null) {
    return null;
  }

  const marker = match[1];

  if (marker === undefined) {
    return null;
  }

  return {
    character: marker[0] as "`" | "~",
    length: marker.length,
  };
}

function closesFence(line: string, openFence: FenceMarker): boolean {
  const match = fencePattern.exec(line);

  if (match === null || (match[2] ?? "").trim() !== "") {
    return false;
  }

  const marker = match[1] ?? "";
  return (
    marker.startsWith(openFence.character) && marker.length >= openFence.length
  );
}

function trimBlankLines(lines: readonly string[]): string {
  let start = 0;
  let end = lines.length;

  while (start < end && (lines[start] ?? "").trim() === "") {
    start += 1;
  }

  while (end > start && (lines[end - 1] ?? "").trim() === "") {
    end -= 1;
  }

  return lines.slice(start, end).join("\n");
}

function evidenceText(lines: readonly string[]): string {
  const evidenceLines: string[] = [];
  let openFence: FenceMarker | null = null;

  for (const line of lines) {
    if (openFence !== null) {
      if (closesFence(line, openFence)) {
        openFence = null;
      }

      continue;
    }

    const marker = fenceMarker(line);

    if (marker !== null) {
      openFence = marker;
    } else {
      evidenceLines.push(line);
    }
  }

  return evidenceLines.join("\n");
}

function uniqueMatches(input: string, pattern: RegExp): readonly string[] {
  const matches: string[] = [];
  const seen = new Set<string>();

  for (const match of input.matchAll(pattern)) {
    const value = match[0].replace(/[.,;:!?]+$/u, "").trim();

    if (value !== "" && !seen.has(value)) {
      seen.add(value);
      matches.push(value);
    }
  }

  return Object.freeze(matches);
}

function freezeSection(section: MutableContextSection): ContextSectionSnapshot {
  const evidence = evidenceText(section.contentLines);

  return Object.freeze({
    kind: "context_section",
    title: section.title,
    level: section.level,
    ordinal: section.ordinal,
    headingPath: Object.freeze([...section.headingPath]),
    content: trimBlankLines(section.contentLines),
    timestamps: uniqueMatches(evidence, timestampPattern),
    visualEvidence: uniqueMatches(evidence, visualEvidencePattern),
    children: Object.freeze(section.children.map(freezeSection)),
  });
}

export function parseContextMarkdown(
  input: unknown,
  sourcePath = "<memory>",
): ContextDocumentSnapshot {
  if (typeof input !== "string") {
    return parseError(
      "CONTEXT_INPUT_INVALID",
      sourcePath,
      "$",
      "context markdown must be a string",
    );
  }

  const normalized = input.replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n");
  const lines = normalized.split("\n");
  const { frontmatter, bodyStart } = parseFrontmatter(lines, sourcePath);
  const preambleLines: string[] = [];
  const roots: MutableContextSection[] = [];
  const stack: MutableContextSection[] = [];
  let openFence: FenceMarker | null = null;

  for (let index = bodyStart; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const currentSection = stack.at(-1);

    if (openFence !== null) {
      (currentSection?.contentLines ?? preambleLines).push(line);

      if (closesFence(line, openFence)) {
        openFence = null;
      }

      continue;
    }

    const marker = fenceMarker(line);

    if (marker !== null) {
      (currentSection?.contentLines ?? preambleLines).push(line);
      openFence = marker;
      continue;
    }

    const heading = headingPattern.exec(line);

    if (heading === null) {
      (currentSection?.contentLines ?? preambleLines).push(line);
      continue;
    }

    const hashes = heading[1] ?? "";
    const title = (heading[2] ?? "").replace(/[\t ]+#+[\t ]*$/u, "").trim();

    if (title === "") {
      return parseError(
        "CONTEXT_HEADING_INVALID",
        sourcePath,
        `line:${String(index + 1)}.heading`,
        `heading at line ${String(index + 1)} must have a title`,
      );
    }

    const level = hashes.length;

    while ((stack.at(-1)?.level ?? 0) >= level) {
      stack.pop();
    }

    const parent = stack.at(-1);
    const siblings = parent?.children ?? roots;
    const section: MutableContextSection = {
      title,
      level,
      ordinal: siblings.length,
      headingPath: Object.freeze([...(parent?.headingPath ?? []), title]),
      contentLines: [],
      children: [],
    };

    siblings.push(section);
    stack.push(section);
  }

  return Object.freeze({
    kind: "context",
    frontmatter,
    preamble: trimBlankLines(preambleLines),
    sections: Object.freeze(roots.map(freezeSection)),
  });
}
