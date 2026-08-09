import { defineElement, emit } from "../internal/element";

export interface SGInteractionPromptActivateDetail extends Record<string, unknown> {
    source: "keyboard" | "pointer";
    value: string;
}

export class SGInteractionPrompt extends HTMLElement {
    static observedAttributes = ["key", "label", "hint", "icon", "value", "disabled", "tone"];

    private initialized = false;
    private control?: HTMLButtonElement;
    private keyNode?: HTMLElement;
    private labelNode?: HTMLElement;
    private hintNode?: HTMLElement;
    private iconNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.control!.addEventListener("click", this.handleActivate);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("click", this.handleActivate);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    private initialize(): void {
        this.control = document.createElement("button");
        this.control.className = "sg-interaction-prompt__control";
        this.control.type = "button";

        this.keyNode = document.createElement("kbd");
        this.keyNode.className = "sg-interaction-prompt__key";

        const copy = document.createElement("span");
        copy.className = "sg-interaction-prompt__copy";
        this.labelNode = document.createElement("strong");
        this.labelNode.className = "sg-interaction-prompt__label";
        this.hintNode = document.createElement("span");
        this.hintNode.className = "sg-interaction-prompt__hint";
        copy.append(this.labelNode, this.hintNode);

        this.iconNode = document.createElement("span");
        this.iconNode.className = "sg-interaction-prompt__icon";
        this.iconNode.setAttribute("aria-hidden", "true");
        this.control.append(this.keyNode, copy, this.iconNode);
        this.replaceChildren(this.control);
        this.initialized = true;
    }

    private readonly handleActivate = (event: MouseEvent): void => {
        if (this.hasAttribute("disabled")) return;
        emit<SGInteractionPromptActivateDetail>(this, "sg-activate", {
            source: event.detail === 0 ? "keyboard" : "pointer",
            value: this.getAttribute("value") || "",
        });
    };

    private syncState(): void {
        const label = this.getAttribute("label") || "Interact";
        const hint = this.getAttribute("hint") || "";
        const icon = this.getAttribute("icon") || "";
        this.keyNode!.textContent = this.getAttribute("key") || "E";
        this.labelNode!.textContent = label;
        this.hintNode!.textContent = hint;
        this.hintNode!.hidden = !hint;
        this.iconNode!.innerHTML = icon ? `<sg-icon name="${icon}"></sg-icon>` : "";
        this.iconNode!.hidden = !icon;
        this.control!.disabled = this.hasAttribute("disabled");
        this.control!.setAttribute("aria-label", `${label}, ${this.keyNode!.textContent}`);
    }
}

export function defineSGInteractionPrompt(): void {
    defineElement("sg-interaction-prompt", SGInteractionPrompt);
}
