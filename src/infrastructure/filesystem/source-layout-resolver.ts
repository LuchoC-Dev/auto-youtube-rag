import { realpath, stat } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

export type SourceLayoutErrorCode =
  | "INVALID_SOURCE_PATH"
  | "SOURCE_PATH_NOT_FOUND"
  | "SOURCE_PATH_NOT_DIRECTORY"
  | "SOURCE_PATH_UNREADABLE"
  | "INVALID_SOURCE_LAYOUT"
  | "AMBIGUOUS_SOURCE_LAYOUT";

export interface SourceLayout {
  readonly collectionPath: string;
  readonly manifestPath: string;
  readonly videosPath: string;
}

export class SourceLayoutError extends Error {
  public constructor(
    public readonly code: SourceLayoutErrorCode,
    public readonly inputPath: string,
    message: string,
  ) {
    super(message);
    this.name = "SourceLayoutError";
  }
}

function layoutError(
  code: SourceLayoutErrorCode,
  inputPath: string,
  message: string,
): never {
  throw new SourceLayoutError(code, inputPath, message);
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function readInputPath(input: unknown): string {
  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input !== input.trim() ||
    input.includes("\0")
  ) {
    layoutError(
      "INVALID_SOURCE_PATH",
      typeof input === "string" ? input : "",
      "source path must be non-empty canonical text",
    );
  }

  return input;
}

async function readPathKind(
  path: string,
  inputPath: string,
): Promise<"file" | "directory" | null> {
  try {
    const pathStat = await stat(path);

    if (pathStat.isFile()) {
      return "file";
    }

    if (pathStat.isDirectory()) {
      return "directory";
    }

    return null;
  } catch (error: unknown) {
    if (
      isErrnoException(error) &&
      (error.code === "ENOENT" || error.code === "ENOTDIR")
    ) {
      return null;
    }

    layoutError(
      "SOURCE_PATH_UNREADABLE",
      inputPath,
      `could not inspect source layout path: ${path}`,
    );
  }
}

async function inspectCandidate(
  collectionPath: string,
  videosPath: string,
  inputPath: string,
): Promise<SourceLayout | null> {
  const manifestPath = join(collectionPath, "manifest.json");
  const [manifestKind, videosKind] = await Promise.all([
    readPathKind(manifestPath, inputPath),
    readPathKind(videosPath, inputPath),
  ]);

  if (manifestKind !== "file" || videosKind !== "directory") {
    return null;
  }

  const [canonicalCollection, canonicalManifest, canonicalVideos] =
    await Promise.all([
      realpath(collectionPath),
      realpath(manifestPath),
      realpath(videosPath),
    ]);

  return Object.freeze({
    collectionPath: canonicalCollection,
    manifestPath: canonicalManifest,
    videosPath: canonicalVideos,
  });
}

export async function resolveSourceLayout(
  input: unknown,
): Promise<SourceLayout> {
  const inputPath = readInputPath(input);
  const absoluteInput = resolve(inputPath);
  let canonicalInput: string;

  try {
    canonicalInput = await realpath(absoluteInput);
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      layoutError(
        "SOURCE_PATH_NOT_FOUND",
        inputPath,
        `source path does not exist: ${inputPath}`,
      );
    }

    layoutError(
      "SOURCE_PATH_UNREADABLE",
      inputPath,
      `source path could not be resolved: ${inputPath}`,
    );
  }

  const inputKind = await readPathKind(canonicalInput, inputPath);

  if (inputKind !== "directory") {
    layoutError(
      "SOURCE_PATH_NOT_DIRECTORY",
      inputPath,
      `source path must be a directory: ${inputPath}`,
    );
  }

  const candidates: SourceLayout[] = [];
  const collectionCandidate = await inspectCandidate(
    canonicalInput,
    join(canonicalInput, "videos"),
    inputPath,
  );

  if (collectionCandidate !== null) {
    candidates.push(collectionCandidate);
  }

  if (basename(canonicalInput).toLowerCase() === "videos") {
    const videosCandidate = await inspectCandidate(
      dirname(canonicalInput),
      canonicalInput,
      inputPath,
    );

    if (videosCandidate !== null) {
      candidates.push(videosCandidate);
    }
  }

  if (candidates.length === 0) {
    layoutError(
      "INVALID_SOURCE_LAYOUT",
      inputPath,
      "source layout must contain manifest.json and a videos directory",
    );
  }

  if (candidates.length > 1) {
    layoutError(
      "AMBIGUOUS_SOURCE_LAYOUT",
      inputPath,
      "source path matches more than one collection layout",
    );
  }

  const layout = candidates.at(0);

  if (layout === undefined) {
    layoutError(
      "INVALID_SOURCE_LAYOUT",
      inputPath,
      "source layout candidate could not be selected",
    );
  }

  return layout;
}
