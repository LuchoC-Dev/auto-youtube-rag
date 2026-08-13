import type {
  ModelInstallOptions,
  ModelInstallOutcome,
  ModelInstaller,
} from "../../src/application/ports/model-installer.js";

export class FakeModelInstaller implements ModelInstaller {
  public calls: ModelInstallOptions[] = [];

  public constructor(
    private readonly outcome: ModelInstallOutcome = {
      status: "installed",
      source: "download",
      bytes: 1024,
    },
    private readonly error: Error | null = null,
  ) {}

  public install(options: ModelInstallOptions): Promise<ModelInstallOutcome> {
    this.calls.push(options);
    return this.error === null
      ? Promise.resolve(this.outcome)
      : Promise.reject(this.error);
  }
}
