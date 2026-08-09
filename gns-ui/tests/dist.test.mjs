import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

test("manifest exposes a framework-neutral zero-dependency contract", async () => {
    const manifest = JSON.parse(await readFile(path.join(dist, "genesis-ui.manifest.json"), "utf8"));
    assert.equal(manifest.format, "framework-neutral-custom-elements");
    assert.deepEqual(manifest.runtimeDependencies, []);
    assert.equal(manifest.files.helixScript, "genesis-ui.helix.js");
    assert.ok(manifest.components.includes("sg-button"));
    assert.ok(manifest.components.includes("sg-item-slot"));
});

test("minimal consumer loads only local distribution files", async () => {
    const html = await readFile(path.join(dist, "examples", "minimal.html"), "utf8");
    assert.match(html, /\.\.\/genesis-ui\.css/);
    assert.match(html, /\.\.\/genesis-ui\.js/);
    assert.doesNotMatch(html, /https?:\/\//i);
    assert.match(html, /sg-activate/);
});

test("compiled CSS includes canonical tokens and rendering profiles", async () => {
    const css = await readFile(path.join(dist, "genesis-ui.css"), "utf8");
    assert.match(css, /--sg-color-cyan:\s*#00d4ff/);
    assert.match(css, /data-sg-density="compact"/);
    assert.match(css, /data-sg-effects="reduced"/);
    assert.doesNotMatch(css, /color-mix\(/, "Chromium 89 baseline must not rely on color-mix");
    assert.doesNotMatch(css, /:root[\s\S]{0,120}color-scheme:\s*dark/);
});

test("catalogue exposes the complete public registry and truthful integration tooling", async () => {
    const html = await readFile(path.join(root, "catalogue", "index.html"), "utf8");
    const script = await readFile(path.join(root, "catalogue", "catalogue.js"), "utf8");

    assert.match(html, /Components registered/);
    assert.match(html, /HELIX validation pending/);
    assert.doesNotMatch(html, /Runtime ready|Stable contract/);

    const publicRecords = script.match(/id:\s*"sg-[a-z-]+"/g) || [];
    assert.equal(publicRecords.length, 10);
    assert.match(script, /#?components\/sg-button/);
    assert.match(script, /execCommand\("copy"\)/);
    assert.match(script, /sg-item-activate/);
    assert.match(script, /dataset\.eventExpanded/);
});

test("alpha hardening guards contradictory states and truthful readiness", async () => {
    const catalogueScript = await readFile(path.join(root, "catalogue", "catalogue.js"), "utf8");
    const catalogueCss = await readFile(path.join(root, "catalogue", "catalogue.css"), "utf8");
    const statSource = await readFile(path.join(root, "src", "elements", "stat.ts"), "utf8");
    const harness = await readFile(path.join(root, "helix-harness", "harness.js"), "utf8");
    const harnessHtml = await readFile(path.join(root, "helix-harness", "index.html"), "utf8");

    assert.match(catalogueScript, /function normalizeModel/);
    assert.match(catalogueCss, /visibility:\s*hidden/);
    assert.match(statSource, /Number\.isFinite\(rawProgress\)/);
    assert.match(statSource, /this\.isConnected && this\.initialized/);
    assert.match(harness, /Components registered/);
    assert.doesNotMatch(harness, /Runtime ready/);
    assert.match(harnessHtml, /html,[\s\S]*body[\s\S]*background:\s*transparent\s*!important/);
    assert.match(harnessHtml, /body\.is-visible \.harness[\s\S]*display:\s*block/);
    assert.doesNotMatch(harnessHtml, /body\s*\{[^}]*opacity:\s*0/s);
    assert.match(harnessHtml, /defer src="\.\/vendor\/genesis-ui\/genesis-ui\.helix\.js"/);
    assert.doesNotMatch(harnessHtml, /type="module"/);
});

test("HELIX harness is emitted as a package-local classic-script fixture", async () => {
    const packageRoot = path.resolve(root, "..", "gns-ui-harness");
    const client = await readFile(path.join(packageRoot, "client.lua"), "utf8");
    const html = await readFile(path.join(packageRoot, "html", "index.html"), "utf8");
    const script = await readFile(path.join(packageRoot, "html", "harness.js"), "utf8");

    assert.match(client, /gns-ui-harness\/html\/index\.html/);
    assert.match(html, /genesis-ui\.helix\.js/);
    assert.doesNotMatch(html, /type="module"/);
    assert.doesNotMatch(script, /^await\s/m);
});
