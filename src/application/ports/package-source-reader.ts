import type {
  ManifestSnapshot,
  PackageSnapshot,
} from "../indexing/package-snapshots.js";
import type { PackageRef } from "../../domain/indexing/identifiers.js";
import type { SourceRoot } from "../../domain/indexing/source-root.js";

export interface PackageSourceReader {
  readManifest(source: SourceRoot): Promise<ManifestSnapshot>;
  readPackage(ref: PackageRef): Promise<PackageSnapshot>;
}
