import { createHash } from "node:crypto";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

export interface TestVideo {
  readonly videoId: string;
  readonly slug: string;
}

export interface TestCollection {
  readonly root: string;
  readonly collectionPath: string;
  readonly databasePath: string;
  readonly modelCachePath: string;
  writeManifest(videos: readonly TestVideo[]): Promise<void>;
  writeContext(video: TestVideo, content: string): Promise<void>;
  removeContext(video: TestVideo): Promise<void>;
  snapshot(): Promise<Readonly<Record<string, string>>>;
  cleanup(): Promise<void>;
}

async function filesBelow(root: string, current = root): Promise<string[]> {
  const entries = await readdir(current, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(current, entry.name);
      return entry.isDirectory()
        ? filesBelow(root, path)
        : [relative(root, path)];
    }),
  );
  return nested.flat().sort((left, right) => left.localeCompare(right, "en"));
}

export async function createTestCollection(
  videos: readonly TestVideo[],
): Promise<TestCollection> {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-e2e-"));
  const collectionPath = join(root, "collection");
  const modelCachePath = join(root, "models");
  await mkdir(join(collectionPath, "videos"), { recursive: true });
  await mkdir(join(root, "data"));
  await mkdir(modelCachePath);
  await writeFile(join(modelCachePath, "model.onnx"), "test model", "utf8");

  const writeManifest = async (listed: readonly TestVideo[]) => {
    await writeFile(
      join(collectionPath, "manifest.json"),
      JSON.stringify({
        videos: listed.map((video) => ({
          video_id: video.videoId,
          slug: video.slug,
          source_language: "es",
          dossier_language: "es",
          stage: "complete",
          resources: { context: true, rules: false, metadata: false },
        })),
      }),
      "utf8",
    );
  };
  const writeContext = async (video: TestVideo, content: string) => {
    const deliverables = join(
      collectionPath,
      "videos",
      video.slug,
      "deliverables",
    );
    await mkdir(deliverables, { recursive: true });
    await writeFile(
      join(deliverables, "context.md"),
      `---\nvideo_id: ${video.videoId}\n---\n# ${video.slug}\n\n${content}\n`,
      "utf8",
    );
  };

  await writeManifest(videos);
  await Promise.all(
    videos.map((video) =>
      writeContext(video, `Contexto inicial de diseño para ${video.slug}.`),
    ),
  );

  return {
    root,
    collectionPath,
    databasePath: join(root, "data", "index.sqlite"),
    modelCachePath,
    writeManifest,
    writeContext,
    removeContext: (video) =>
      rm(
        join(
          collectionPath,
          "videos",
          video.slug,
          "deliverables",
          "context.md",
        ),
      ),
    async snapshot() {
      const paths = await filesBelow(collectionPath);
      const hashes: (readonly [string, string])[] = await Promise.all(
        paths.map(async (path): Promise<readonly [string, string]> => [
          path.replaceAll("\\", "/"),
          createHash("sha256")
            .update(await readFile(join(collectionPath, path)))
            .digest("hex"),
        ]),
      );
      const snapshot: Readonly<Record<string, string>> = Object.freeze(
        Object.fromEntries(hashes) as Record<string, string>,
      );
      return snapshot;
    },
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}
