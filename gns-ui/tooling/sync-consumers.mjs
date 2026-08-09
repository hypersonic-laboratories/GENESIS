import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const uiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptsRoot = path.resolve(uiRoot, "..");
const source = path.join(uiRoot, "dist");
const checkOnly = process.argv.includes("--check");
const registry = JSON.parse(await readFile(path.join(uiRoot, "consumers.json"), "utf8"));
const consumers = registry.consumers;

if (!Array.isArray(consumers) || consumers.length === 0) {
    throw new Error("consumers.json must contain at least one package name.");
}

await assertDirectory(source, "Run npm.cmd run build before syncing consumers.");

const seen = new Set();
let drifted = false;

for (const packageName of consumers) {
    validatePackageName(packageName);
    if (seen.has(packageName)) {
        throw new Error(`Duplicate consumer package: ${packageName}`);
    }
    seen.add(packageName);

    const packageRoot = path.join(scriptsRoot, packageName);
    await assertDirectory(packageRoot, `Registered consumer package does not exist: ${packageName}`);

    const target = path.join(packageRoot, "html", "vendor", "genesis-ui");
    assertInsideScriptsRoot(target);

    if (checkOnly) {
        const matches = await directoriesMatch(source, target);
        console.log(`${matches ? "OK" : "DRIFT"} ${packageName}`);
        drifted ||= !matches;
        continue;
    }

    const vendorRoot = path.dirname(target);
    const staging = path.join(vendorRoot, `.genesis-ui-sync-${process.pid}`);
    await mkdir(vendorRoot, { recursive: true });
    await rm(staging, { recursive: true, force: true });
    await cp(source, staging, { recursive: true, filter: includeConsumerFile });
    await rm(target, { recursive: true, force: true });
    await rename(staging, target);
    console.log(`SYNCED ${packageName}`);
}

if (drifted) {
    console.error("One or more Genesis UI consumers are out of sync. Run npm.cmd run sync.");
    process.exitCode = 1;
}

function validatePackageName(packageName) {
    if (typeof packageName !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(packageName)) {
        throw new Error(`Invalid consumer package name: ${String(packageName)}`);
    }
}

function assertInsideScriptsRoot(target) {
    const relative = path.relative(scriptsRoot, target);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new Error(`Refusing to sync outside the scripts checkout: ${target}`);
    }
}

async function assertDirectory(directory, message) {
    try {
        if ((await stat(directory)).isDirectory()) return;
    } catch {
        // The purpose-specific error below is more useful than the filesystem error.
    }
    throw new Error(message);
}

function includeConsumerFile(entry) {
    const relative = path.relative(source, entry);
    return relative !== "catalogue" && !relative.startsWith(`catalogue${path.sep}`);
}

async function directoriesMatch(left, right) {
    try {
        const [leftFiles, rightFiles] = await Promise.all([
            collectFiles(left, true),
            collectFiles(right, false),
        ]);
        if (leftFiles.size !== rightFiles.size) return false;

        for (const [file, hash] of leftFiles) {
            if (rightFiles.get(file) !== hash) return false;
        }
        return true;
    } catch {
        return false;
    }
}

async function collectFiles(root, skipCatalogue) {
    const files = new Map();
    await walk(root, "");
    return files;

    async function walk(directory, relativeDirectory) {
        const entries = await readdir(directory, { withFileTypes: true });
        for (const entry of entries) {
            const relative = path.join(relativeDirectory, entry.name);
            if (skipCatalogue && (relative === "catalogue" || relative.startsWith(`catalogue${path.sep}`))) {
                continue;
            }
            const absolute = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                await walk(absolute, relative);
            } else if (entry.isFile()) {
                const digest = createHash("sha256").update(await readFile(absolute)).digest("hex");
                files.set(relative.replaceAll(path.sep, "/"), digest);
            }
        }
    }
}
