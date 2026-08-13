export type ModelInstallStatus = "installed" | "already_installed" | "adopted";
export type ModelInstallSource = "download" | "copy" | null;

export interface ModelInstallOptions {
  readonly modelsPath: string;
  /** An explicit path to copy an already-present model from, per Decision 5
   * of docs/install-design.md. `null` means "download only". */
  readonly from: string | null;
  readonly force: boolean;
}

export interface ModelInstallOutcome {
  readonly status: ModelInstallStatus;
  readonly source: ModelInstallSource;
  readonly bytes: number;
}

export type ModelInstallerErrorCode =
  "MODEL_SOURCE_INVALID" | "MODEL_DOWNLOAD_FAILED";

export class ModelInstallerError extends Error {
  public constructor(
    public readonly code: ModelInstallerErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ModelInstallerError";
  }
}

/**
 * The application never knows about Hugging Face, `--from` filesystem
 * copies or the shape of the install receipt: it only calls this port. The
 * adapter (infrastructure) owns the full decision described in Decision 5
 * of docs/install-design.md: already-installed short-circuit, adoption from
 * `--from`, rejection of an incomplete `--from`, and download as the last
 * resort.
 */
export interface ModelInstaller {
  install(options: ModelInstallOptions): Promise<ModelInstallOutcome>;
}
