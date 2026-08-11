export type DomainValidationErrorCode =
  "INVALID_IDENTIFIER" | "INVALID_PACKAGE_REF";

export class DomainValidationError extends Error {
  public constructor(
    public readonly code: DomainValidationErrorCode,
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "DomainValidationError";
  }
}
