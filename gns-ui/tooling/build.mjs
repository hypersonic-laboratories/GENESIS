import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const source = path.join(root, "src");
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

const components = [
    "sg-action-list",
    "sg-alert",
    "sg-avatar",
    "sg-badge",
    "sg-breadcrumb",
    "sg-button",
    "sg-card",
    "sg-checkbox",
    "sg-chip",
    "sg-confirm-progress",
    "sg-context-menu",
    "sg-data-table",
    "sg-divider",
    "sg-drawer",
    "sg-empty-state",
    "sg-icon",
    "sg-icon-button",
    "sg-input",
    "sg-interaction-prompt",
    "sg-item-slot",
    "sg-keybind",
    "sg-list-row",
    "sg-meter",
    "sg-modal",
    "sg-number-stepper",
    "sg-pagination",
    "sg-panel",
    "sg-popover",
    "sg-progress",
    "sg-radial-menu",
    "sg-radio-group",
    "sg-segmented",
    "sg-select",
    "sg-slider",
    "sg-skeleton",
    "sg-stat",
    "sg-tabs",
    "sg-textarea",
    "sg-toast",
    "sg-toggle",
    "sg-tooltip",
];

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "assets", "fonts"), { recursive: true });
await mkdir(path.join(dist, "assets", "licenses"), { recursive: true });
await mkdir(path.join(dist, "themes"), { recursive: true });

await build({
    entryPoints: [path.join(source, "index.ts")],
    outfile: path.join(dist, "genesis-ui.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    target: ["chrome89"],
    legalComments: "eof",
    minify: true,
    sourcemap: false,
});

await build({
    entryPoints: [path.join(source, "index.ts")],
    outfile: path.join(dist, "genesis-ui.helix.js"),
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["chrome79"],
    define: {
        "import.meta.url": "document.currentScript.src",
    },
    legalComments: "eof",
    minify: true,
    sourcemap: false,
});

const styleFiles = ["tokens.css", "foundation.css", "components.css", "profiles.css"];
const styles = await Promise.all(styleFiles.map((file) => readFile(path.join(source, "styles", file), "utf8")));
await writeFile(
    path.join(dist, "genesis-ui.css"),
    `/* Genesis Shadow Glass UI ${packageJson.version} | GPL-3.0-only */\n${styles.join("\n")}`,
);
await cp(path.join(source, "styles", "profiles.css"), path.join(dist, "themes", "profiles.css"));
await cp(path.join(source, "genesis-ui.d.ts"), path.join(dist, "genesis-ui.d.ts"));

await copyPackageAsset(
    "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    "assets/fonts/inter-latin-wght-normal.woff2",
);
await copyPackageAsset(
    "@fontsource-variable/exo-2/files/exo-2-latin-wght-normal.woff2",
    "assets/fonts/exo-2-latin-wght-normal.woff2",
);
await copyPackageAsset("@fontsource-variable/inter/LICENSE", "assets/licenses/Inter-OFL-1.1.txt");
await copyPackageAsset("@fontsource-variable/exo-2/LICENSE", "assets/licenses/Exo2-OFL-1.1.txt");
await copyPackageAsset("lucide-static/LICENSE", "assets/licenses/Lucide-ISC.txt");

await writeIconSprite();
await writeFile(
    path.join(dist, "genesis-ui.manifest.json"),
    `${JSON.stringify({
        name: packageJson.name,
        version: packageJson.version,
        license: packageJson.license,
        format: "framework-neutral-custom-elements",
        browserTarget: "Chromium 89+ compatibility baseline; package harness passed in the current HELIX bleeding-edge client",
        runtimeDependencies: [],
        components,
        files: {
            styles: "genesis-ui.css",
            module: "genesis-ui.js",
            helixScript: "genesis-ui.helix.js",
            types: "genesis-ui.d.ts",
            icons: "genesis-icons.svg",
        },
    }, null, 2)}\n`,
);

await copyWebFixture("catalogue", "catalogue", "index.html");
await copyWebFixture("examples", "examples", "minimal.html");

const harnessVendor = path.join(root, "helix-harness", "vendor", "genesis-ui");
await rm(harnessVendor, { recursive: true, force: true });
await mkdir(path.dirname(harnessVendor), { recursive: true });
await cp(dist, harnessVendor, { recursive: true, filter: (entry) => !entry.includes(`${path.sep}catalogue`) });

const helixPackageHtml = path.resolve(root, "..", "gns-ui-harness", "html");
await rm(helixPackageHtml, { recursive: true, force: true });
await mkdir(helixPackageHtml, { recursive: true });
await cp(path.join(root, "helix-harness", "index.html"), path.join(helixPackageHtml, "index.html"));
await cp(path.join(root, "helix-harness", "harness.js"), path.join(helixPackageHtml, "harness.js"));
await cp(dist, path.join(helixPackageHtml, "vendor", "genesis-ui"), {
    recursive: true,
    filter: (entry) => !entry.includes(`${path.sep}catalogue`),
});

console.log(`Built ${packageJson.name} ${packageJson.version}`);
console.log(`Components: ${components.length}`);
console.log(`Distribution: ${path.relative(root, dist)}`);
console.log(`HELIX harness vendor copy: ${path.relative(root, harnessVendor)}`);
console.log(`HELIX package fixture: ${path.relative(root, helixPackageHtml)}`);

async function copyPackageAsset(packageRelativePath, destination) {
    const resolved = path.join(root, "node_modules", ...packageRelativePath.split("/"));
    await cp(resolved, path.join(dist, destination));
}

async function writeIconSprite() {
    const names = JSON.parse(await readFile(path.join(source, "icons", "icons.json"), "utf8"));
    const symbols = [];

    for (const name of names) {
        const iconPath = path.join(root, "node_modules", "lucide-static", "icons", `${name}.svg`);
        const svg = await readFile(iconPath, "utf8");
        const content = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1]?.trim();
        if (!content) {
            throw new Error(`Unable to parse Lucide icon: ${name}`);
        }
        symbols.push(`  <symbol id="sg-icon-${name}" viewBox="0 0 24 24">${content}</symbol>`);
    }

    await writeFile(
        path.join(dist, "genesis-icons.svg"),
        `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>\n`,
    );
}

async function copyWebFixture(folder, destination, entryFile) {
    const input = path.join(root, folder);
    const output = path.join(dist, destination);
    await cp(input, output, { recursive: true });

    const htmlPath = path.join(output, entryFile);
    const html = await readFile(htmlPath, "utf8");
    await writeFile(htmlPath, html.replaceAll("../dist/", "../"));
}
