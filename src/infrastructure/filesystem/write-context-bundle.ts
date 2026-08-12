import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { ContextBundle } from "../../application/context/context-bundle.js";

export type WriteContextBundleErrorCode = "REQUEST_ID_ALREADY_USED";

export class WriteContextBundleError extends Error {
  public constructor(
    public readonly code: WriteContextBundleErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "WriteContextBundleError";
  }
}

export interface WrittenContextBundle {
  readonly requestId: string;
  readonly contextPath: string;
  readonly resultPath: string;
}

/**
 * Same ad-hoc shape already used for `SyncId` in `sync-source.ts`: a
 * timestamp plus a random suffix, not a real ULID. `cli-contract.md`'s
 * `01J...` example is illustrative, not a format requirement, so no
 * dependency is added to generate one.
 */
function defaultRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Writes `context.md` and `result.json` under `<outputDir>/<requestId>/`.
 * Fails explicitly instead of mixing files into an existing directory —
 * a `requestId` collision should never happen given the generator above, so
 * treating one as an error rather than silently merging surfaces the bug
 * instead of hiding it.
 */
export async function writeContextBundle(
  bundle: ContextBundle,
  outputDir: string,
  createRequestId: () => string = defaultRequestId,
): Promise<WrittenContextBundle> {
  const requestId = createRequestId();
  const requestDir = join(outputDir, requestId);

  if (await exists(requestDir)) {
    throw new WriteContextBundleError(
      "REQUEST_ID_ALREADY_USED",
      `Request directory already exists: ${requestDir}`,
    );
  }

  await mkdir(requestDir, { recursive: true });

  const contextPath = join(requestDir, "context.md");
  const resultPath = join(requestDir, "result.json");

  await writeFile(contextPath, bundle.markdown, "utf8");
  await writeFile(
    resultPath,
    `${JSON.stringify(bundle.result, null, 2)}\n`,
    "utf8",
  );

  return { requestId, contextPath, resultPath };
}
