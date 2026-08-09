import { defineElement, emit } from "../internal/element";

export interface SGDismissDetail extends Record<string, unknown> {
    reason: "dismiss-button";
}

export class SGAlert extends HTMLElement {
    static observedAttributes = ["title", "dismissible", "tone", "urgent"];

    private initialized = false;
    private titleNode?: HTMLElement;
    private dismissButton?: HTMLButtonElement;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.syncState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    private initialize(): void {
        const callerContent = Array.from(this.childNodes);
        const icon = document.createElement("span");
        icon.className = "sg-alert__icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = "<sg-icon></sg-icon>";

        const copy = document.createElement("span");
        copy.className = "sg-alert__copy";
        this.titleNode = document.createElement("strong");
        this.titleNode.className = "sg-alert__title";
        const message = document.createElement("span");
        message.className = "sg-alert__message";
        message.append(...callerContent);
        copy.append(this.titleNode, message);

        this.dismissButton = document.createElement("button");
        this.dismissButton.className = "sg-alert__dismiss";
        this.dismissButton.type = "button";
        this.dismissButton.setAttribute("aria-label", "Dismiss notification");
        this.dismissButton.innerHTML = '<sg-icon name="x" aria-hidden="true"></sg-icon>';
        this.dismissButton.addEventListener("click", this.dismiss);

        this.append(icon, copy, this.dismissButton);
        this.initialized = true;
    }

    private readonly dismiss = (): void => {
        const event = emit<SGDismissDetail>(this, "sg-dismiss", { reason: "dismiss-button" }, { cancelable: true });
        if (!event.defaultPrevented) {
            this.hidden = true;
        }
    };

    private syncState(): void {
        const tone = this.getAttribute("tone") || "info";
        this.setAttribute("role", this.hasAttribute("urgent") ? "alert" : "status");
        this.titleNode!.textContent = this.getAttribute("title") || defaultTitle(tone);
        this.querySelector(".sg-alert__icon sg-icon")?.setAttribute("name", iconForTone(tone));
        this.dismissButton!.hidden = !this.hasAttribute("dismissible");
    }
}

function iconForTone(tone: string): string {
    return ({ success: "circle-check", warning: "triangle-alert", danger: "circle-x", info: "info" } as Record<string, string>)[tone] || "info";
}

function defaultTitle(tone: string): string {
    return ({ success: "Success", warning: "Warning", danger: "Error", info: "Information" } as Record<string, string>)[tone] || "Information";
}

export function defineSGAlert(): void {
    defineElement("sg-alert", SGAlert);
}
