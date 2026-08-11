import { DomainValidationError } from "./domain-error.js";
import { SourceName, SyncId, VideoId } from "./identifiers.js";

export const syncRunStatuses = ["running", "ok", "partial", "failed"] as const;
export type SyncRunStatus = (typeof syncRunStatuses)[number];
export type TerminalSyncRunStatus = Exclude<SyncRunStatus, "running">;

export interface SyncCounters {
  readonly packagesSeen: number;
  readonly packagesUnchanged: number;
  readonly packagesIndexed: number;
  readonly packagesFailed: number;
  readonly packagesDeleted: number;
}

interface SyncCountersInput {
  readonly packagesSeen: unknown;
  readonly packagesUnchanged: unknown;
  readonly packagesIndexed: unknown;
  readonly packagesFailed: unknown;
  readonly packagesDeleted: unknown;
}

export interface StartSyncRunInput {
  readonly id: SyncId;
  readonly sourceName: SourceName;
  readonly startedAt: unknown;
}

export interface FinishSyncRunInput {
  readonly status: unknown;
  readonly finishedAt: unknown;
  readonly counters: unknown;
}

export interface SyncIssueInput {
  readonly syncId: SyncId;
  readonly videoId: unknown;
  readonly relativePath: unknown;
  readonly code: unknown;
  readonly message: unknown;
  readonly retryable: unknown;
}

const emptyCounters: SyncCounters = Object.freeze({
  packagesSeen: 0,
  packagesUnchanged: 0,
  packagesIndexed: 0,
  packagesFailed: 0,
  packagesDeleted: 0,
});

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_IDENTIFIER",
    field,
    `${field} ${expectation}`,
  );
}

function readTimestamp(input: unknown, field: string): string {
  if (typeof input !== "string") {
    invalid(field, "must be a canonical UTC ISO 8601 timestamp");
  }

  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== input) {
    invalid(field, "must be a canonical UTC ISO 8601 timestamp");
  }

  return input;
}

function readTerminalStatus(input: unknown): TerminalSyncRunStatus {
  if (input !== "ok" && input !== "partial" && input !== "failed") {
    invalid("status", "must transition from running to ok, partial or failed");
  }

  return input;
}

function readCounter(input: unknown, field: keyof SyncCounters): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input < 0) {
    invalid(field, "must be a non-negative safe integer");
  }

  return input;
}

function copyCounters(input: unknown): SyncCounters {
  if (typeof input !== "object" || input === null) {
    invalid("counters", "must contain all approved sync counters");
  }

  const counters = input as SyncCountersInput;

  return Object.freeze({
    packagesSeen: readCounter(counters.packagesSeen, "packagesSeen"),
    packagesUnchanged: readCounter(
      counters.packagesUnchanged,
      "packagesUnchanged",
    ),
    packagesIndexed: readCounter(counters.packagesIndexed, "packagesIndexed"),
    packagesFailed: readCounter(counters.packagesFailed, "packagesFailed"),
    packagesDeleted: readCounter(counters.packagesDeleted, "packagesDeleted"),
  });
}

function readOptionalVideoId(input: unknown): VideoId | null {
  if (input === null || input === undefined) {
    return null;
  }

  if (!(input instanceof VideoId)) {
    invalid("videoId", "must be null or a VideoId");
  }

  return input;
}

function readOptionalRelativePath(input: unknown): string | null {
  if (input === null || input === undefined) {
    return null;
  }

  if (
    typeof input !== "string" ||
    input.length === 0 ||
    input !== input.trim() ||
    input.includes("\0") ||
    input.includes("\\") ||
    input.startsWith("/") ||
    /^[A-Za-z]:/u.test(input)
  ) {
    invalid("relativePath", "must be null or a canonical relative POSIX path");
  }

  if (
    input
      .split("/")
      .some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    invalid("relativePath", "must not contain ambiguous path segments");
  }

  return input;
}

function readIssueCode(input: unknown): string {
  if (typeof input !== "string" || !/^[A-Z][A-Z0-9_]*$/u.test(input)) {
    invalid("code", "must be an uppercase symbolic code");
  }

  return input;
}

function readMessage(input: unknown): string {
  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input !== input.trim() ||
    input.includes("\0")
  ) {
    invalid("message", "must be non-empty canonical text");
  }

  return input;
}

export class SyncRun {
  private constructor(
    public readonly id: SyncId,
    public readonly sourceName: SourceName,
    public readonly status: SyncRunStatus,
    public readonly startedAt: string,
    public readonly finishedAt: string | null,
    public readonly counters: SyncCounters,
  ) {}

  public static start(input: StartSyncRunInput): SyncRun {
    if (!(input.id instanceof SyncId)) {
      invalid("id", "must be a SyncId");
    }

    if (!(input.sourceName instanceof SourceName)) {
      invalid("sourceName", "must be a SourceName");
    }

    return new SyncRun(
      input.id,
      input.sourceName,
      "running",
      readTimestamp(input.startedAt, "startedAt"),
      null,
      emptyCounters,
    );
  }

  public finish(input: FinishSyncRunInput): SyncRun {
    if (this.status !== "running") {
      invalid("status", "cannot transition after a run is finished");
    }

    const finishedAt = readTimestamp(input.finishedAt, "finishedAt");

    if (finishedAt < this.startedAt) {
      invalid("finishedAt", "must not precede startedAt");
    }

    return new SyncRun(
      this.id,
      this.sourceName,
      readTerminalStatus(input.status),
      this.startedAt,
      finishedAt,
      copyCounters(input.counters),
    );
  }
}

export class SyncIssue {
  private constructor(
    public readonly syncId: SyncId,
    public readonly videoId: VideoId | null,
    public readonly relativePath: string | null,
    public readonly code: string,
    public readonly message: string,
    public readonly retryable: boolean,
  ) {}

  public static create(input: SyncIssueInput): SyncIssue {
    if (!(input.syncId instanceof SyncId)) {
      invalid("syncId", "must be a SyncId");
    }

    if (typeof input.retryable !== "boolean") {
      invalid("retryable", "must be a boolean");
    }

    return new SyncIssue(
      input.syncId,
      readOptionalVideoId(input.videoId),
      readOptionalRelativePath(input.relativePath),
      readIssueCode(input.code),
      readMessage(input.message),
      input.retryable,
    );
  }
}
