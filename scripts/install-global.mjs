/**
 * Installs the CLI globally from a packed tarball instead of from the working
 * directory.
 *
 * `npm install --global .` ignores the `files` field and copies the whole
 * directory: measured at 605 MB and 8549 files, `.git`, `.cache`, `src`,
 * `test`, `docs` and `evals` included. `npm pack` does honour `files`, so
 * packing first and installing the tarball ships only `dist/` (about 150 kB
 * compressed) plus the runtime dependency.
 *
 * The tarball name is read from package.json rather than hardcoded, so a
 * version bump cannot silently break this script.
 */
import { execSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const tarball = join(root, `${manifest.name}-${manifest.version}.tgz`);

// `execSync` with a single command string, not `execFileSync` with an argument
// array. On Windows npm is a `.cmd` shim, which Node refuses to spawn without a
// shell (EINVAL, the CVE-2024-27980 mitigation), and passing an argument array
// *with* a shell is deprecated in turn (DEP0190). A quoted command string
// sidesteps both, and the quotes keep paths with spaces intact.
const npm = (command) =>
  execSync(`npm ${command}`, { cwd: root, stdio: "inherit" });

try {
  npm("pack --pack-destination .");
  npm(`install --global "${tarball}"`);
  console.log(
    `\nInstalled. Run "${manifest.name} init" to set up the library.`,
  );
} finally {
  rmSync(tarball, { force: true });
}
