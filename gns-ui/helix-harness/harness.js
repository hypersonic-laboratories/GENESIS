const output = document.querySelector("#harness-output");
const state = document.querySelector("#runtime-state");
const harness = document.querySelector(".harness");

function describeEvent(event) {
    var detail = event.detail || {};
    return event.type + " delivered - " + JSON.stringify(detail);
}

function setVisible(visible) {
    document.body.classList.toggle("is-visible", visible);
    if (!visible) {
        document.querySelectorAll("sg-modal[open], sg-drawer[open]").forEach((overlay) => {
            overlay.open = false;
        });
    }
}

function requestClose() {
    setVisible(false);
    if (typeof window.hEvent === "function") {
        window.hEvent("gnsui:close");
    }
}

window.addEventListener("message", (event) => {
    const data = event.data || {};
    const args = data.args || [];
    if (data.name !== "gnsui:setVisible") return;
    setVisible(Boolean(args[0] && args[0].visible));
});

window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    if (document.querySelector("sg-modal[open], sg-drawer[open]")) return;
    event.preventDefault();
    requestClose();
});

if (!window.customElements) {
    state.textContent = "Custom elements unavailable";
    state.setAttribute("tone", "danger");
    output.textContent = "This HELIX Chromium build does not expose Custom Elements.";
} else {
    customElements.whenDefined("sg-button").then(() => {
        const version = window.GenesisUI && window.GenesisUI.version
            ? window.GenesisUI.version
            : "unknown";

        state.textContent = "Components registered";
        state.setAttribute("tone", "success");
        output.textContent = `Genesis UI ${version} registered without a framework. Press F10 or Escape to close.`;

        harness.addEventListener("sg-input", (event) => {
            output.textContent = describeEvent(event);
        });

        harness.addEventListener("sg-change", (event) => {
            output.textContent = describeEvent(event);
        });

        harness.addEventListener("sg-item-activate", (event) => {
            output.textContent = describeEvent(event);
        });

        document.addEventListener("sg-close", (event) => {
            output.textContent = describeEvent(event);
        });

        document.addEventListener("sg-dismiss", (event) => {
            output.textContent = describeEvent(event);
        });

        document.addEventListener("sg-remove", (event) => {
            output.textContent = describeEvent(event);
        });

        document.querySelector("#emit-test").addEventListener("sg-activate", (event) => {
            output.textContent = `sg-activate delivered - source: ${event.detail.source}`;
        });

        document.querySelector("#update-test").addEventListener("sg-activate", () => {
            const health = document.querySelector('sg-stat[label="Health"]');
            const value = health.getAttribute("value") === "100%" ? "22%" : "100%";
            health.setAttribute("value", value);
            health.setAttribute("progress", value.replace("%", ""));
            const stepper = document.querySelector("#unit-count");
            stepper.value = stepper.value === 2 ? 6 : 2;
            const chip = document.querySelector("#filter-chip");
            chip.hidden = false;
            const progress = document.querySelector("#skill-progress");
            progress.value = progress.value === 68 ? 92 : 68;
            const meter = document.querySelector("#hunger-meter");
            meter.value = meter.value === 64 ? 18 : 64;
            output.textContent = `Targeted attribute update delivered - health: ${value}, units: ${stepper.value}, skill: ${progress.value}%`;
        });

        document.querySelector("#close-harness").addEventListener("sg-activate", requestClose);

        document.querySelector("#settings-action").addEventListener("sg-activate", (event) => {
            output.textContent = describeEvent(event);
        });

        document.querySelector("#open-modal").addEventListener("sg-activate", () => {
            document.querySelector("#harness-modal").open = true;
        });

        document.querySelector("#open-drawer").addEventListener("sg-activate", () => {
            document.querySelector("#harness-drawer").open = true;
        });

        document.querySelector("#show-toast").addEventListener("sg-activate", () => {
            document.querySelector("#harness-toast").show();
        });

        document.querySelector("#modal-done").addEventListener("sg-activate", () => {
            document.querySelector("#harness-modal").open = false;
        });
    });
}
