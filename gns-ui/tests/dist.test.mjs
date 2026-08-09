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
    assert.ok(manifest.components.includes("sg-icon-button"));
    assert.ok(manifest.components.includes("sg-input"));
    assert.ok(manifest.components.includes("sg-select"));
    assert.ok(manifest.components.includes("sg-toggle"));
    assert.ok(manifest.components.includes("sg-slider"));
    assert.ok(manifest.components.includes("sg-item-slot"));
    assert.equal(manifest.components.length, 15);
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
    assert.match(html, /HELIX harness passed/);
    assert.doesNotMatch(html, /Runtime ready|Stable contract/);

    const publicRecords = script.match(/id:\s*"sg-[a-z-]+"/g) || [];
    assert.equal(publicRecords.length, 15);
    assert.match(script, /#?components\/sg-button/);
    assert.match(script, /execCommand\("copy"\)/);
    assert.match(script, /sg-item-activate/);
    assert.match(script, /sg-input/);
    assert.match(script, /sg-change/);
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
    assert.match(html, /<sg-input/);
    assert.match(html, /<sg-select/);
    assert.match(html, /<sg-toggle/);
    assert.match(html, /<sg-slider/);
    assert.match(html, /<sg-icon-button/);
    assert.match(script, /addEventListener\("sg-input"/);
    assert.match(script, /addEventListener\("sg-change"/);
});

test("production controls preserve native Chromium behavior and framework-neutral events", async () => {
    const input = await readFile(path.join(root, "src", "elements", "input.ts"), "utf8");
    const select = await readFile(path.join(root, "src", "elements", "select.ts"), "utf8");
    const toggle = await readFile(path.join(root, "src", "elements", "toggle.ts"), "utf8");
    const slider = await readFile(path.join(root, "src", "elements", "slider.ts"), "utf8");
    const iconButton = await readFile(path.join(root, "src", "elements", "icon-button.ts"), "utf8");
    const controls = [input, select, toggle, slider, iconButton].join("\n");

    assert.match(input, /document\.createElement\("input"\)/);
    assert.match(select, /document\.createElement\("select"\)/);
    assert.match(toggle, /type = "checkbox"/);
    assert.match(slider, /type = "range"/);
    assert.match(controls, /"sg-input"/);
    assert.match(controls, /"sg-change"/);
    assert.match(iconButton, /"sg-activate"/);
    assert.doesNotMatch(controls, /ElementInternals|formAssociated/);
});
