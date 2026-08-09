import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const required = [
    "genesis-ui.css",
    "genesis-ui.js",
    "genesis-ui.helix.js",
    "genesis-ui.d.ts",
    "genesis-ui.manifest.json",
    "genesis-icons.svg",
    "assets/fonts/inter-latin-wght-normal.woff2",
    "assets/fonts/exo-2-latin-wght-normal.woff2",
    "examples/minimal.html",
    "catalogue/index.html",
];

for (const file of required) {
    await access(path.join(dist, file));
}

const manifest = JSON.parse(await readFile(path.join(dist, "genesis-ui.manifest.json"), "utf8"));
if (manifest.runtimeDependencies.length !== 0) {
    throw new Error("The distribution declares a runtime dependency.");
}

for (const file of ["genesis-ui.css", "genesis-ui.js", "genesis-ui.helix.js", "examples/minimal.html", "catalogue/index.html"]) {
    const contents = await readFile(path.join(dist, file), "utf8");
    const remoteRuntimeReference = /(?:src|href)\s*=\s*["']https?:|url\(\s*["']?https?:|fetch\(\s*["']https?:/i;
    if (remoteRuntimeReference.test(contents)) {
        throw new Error(`Remote runtime URL found in ${file}.`);
    }
}

const budgets = {
    "genesis-ui.css": 96 * 1024,
    "genesis-ui.js": 64 * 1024,
    "genesis-ui.helix.js": 64 * 1024,
    "genesis-icons.svg": 128 * 1024,
};

for (const [file, budget] of Object.entries(budgets)) {
    const size = (await stat(path.join(dist, file))).size;
    if (size > budget) {
        throw new Error(`${file} exceeds its ${budget}-byte Phase 1 budget (${size} bytes).`);
    }
    console.log(`${file}: ${size} bytes`);
}

console.log(`Verified ${required.length} required distribution files.`);
console.log(`Verified ${manifest.components.length} registered components with zero runtime dependencies.`);
