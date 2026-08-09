const output = document.querySelector("#harness-output");
const state = document.querySelector("#runtime-state");

function setVisible(visible) {
    document.body.classList.toggle("is-visible", visible);
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
    if (event.key !== "Escape") return;
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

        document.querySelector("#emit-test").addEventListener("sg-activate", (event) => {
            output.textContent = `sg-activate delivered - source: ${event.detail.source}`;
        });

        document.querySelector("#update-test").addEventListener("sg-activate", () => {
            const health = document.querySelector('sg-stat[label="Health"]');
            const value = health.getAttribute("value") === "100%" ? "22%" : "100%";
            health.setAttribute("value", value);
            health.setAttribute("progress", value.replace("%", ""));
            output.textContent = `Targeted attribute update delivered - health: ${value}`;
        });

        document.querySelector("#close-harness").addEventListener("sg-activate", requestClose);
    });
}
