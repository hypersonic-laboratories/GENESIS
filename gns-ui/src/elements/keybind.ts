import { defineElement } from "../internal/element";

export class SGKeybind extends HTMLElement {
    static observedAttributes = ["key", "keys"];

    private keysNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.keysNode) {
            const callerContent = Array.from(this.childNodes);
            this.keysNode = document.createElement("span");
            this.keysNode.className = "sg-keybind__keys";
            const label = document.createElement("span");
            label.className = "sg-keybind__label";
            label.append(...callerContent);
            this.append(this.keysNode, label);
        }
        this.syncState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.keysNode) {
            this.syncState();
        }
    }

    private syncState(): void {
        const keys = (this.getAttribute("keys") || this.getAttribute("key") || "?")
            .split("+")
            .map((key) => key.trim())
            .filter(Boolean);
        this.keysNode!.replaceChildren();
        keys.forEach((key, index) => {
            if (index > 0) {
                const joiner = document.createElement("span");
                joiner.className = "sg-keybind__joiner";
                joiner.setAttribute("aria-hidden", "true");
                joiner.textContent = "+";
                this.keysNode!.append(joiner);
            }
            const keycap = document.createElement("kbd");
            keycap.textContent = key;
            this.keysNode!.append(keycap);
        });
    }
}

export function defineSGKeybind(): void {
    defineElement("sg-keybind", SGKeybind);
}
