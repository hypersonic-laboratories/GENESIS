import { defineElement, emit } from "../internal/element";

export interface SGToastDismissDetail extends Record<string, unknown> {
    reason: "dismiss-button" | "timeout";
}

export class SGToast extends HTMLElement {
    static observedAttributes = ["title", "tone", "dismissible", "duration", "urgent"];

    private initialized = false;
    private titleNode?: HTMLElement;
    private iconNode?: HTMLElement;
    private dismissButton?: HTMLButtonElement;
    private dismissTimer = 0;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.addEventListener("mouseenter", this.pauseTimer);
        this.addEventListener("mouseleave", this.startTimer);
        this.addEventListener("focusin", this.pauseTimer);
        this.addEventListener("focusout", this.handleFocusOut);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("mouseenter", this.pauseTimer);
        this.removeEventListener("mouseleave", this.startTimer);
        this.removeEventListener("focusin", this.pauseTimer);
        this.removeEventListener("focusout", this.handleFocusOut);
        this.pauseTimer();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    show(): void {
        this.hidden = false;
        this.startTimer();
    }

    private initialize(): void {
        const callerContent = Array.from(this.childNodes);
        this.iconNode = document.createElement("span");
        this.iconNode.className = "sg-toast__icon";
        this.iconNode.setAttribute("aria-hidden", "true");
        this.iconNode.innerHTML = "<sg-icon></sg-icon>";

        const copy = document.createElement("span");
        copy.className = "sg-toast__copy";
        this.titleNode = document.createElement("strong");
        this.titleNode.className = "sg-toast__title";
        const message = document.createElement("span");
        message.className = "sg-toast__message";
        message.append(...callerContent);
        copy.append(this.titleNode, message);

        this.dismissButton = document.createElement("button");
        this.dismissButton.className = "sg-toast__dismiss";
        this.dismissButton.type = "button";
        this.dismissButton.setAttribute("aria-label", "Dismiss notification");
        this.dismissButton.innerHTML = '<sg-icon name="x" aria-hidden="true"></sg-icon>';
        this.dismissButton.addEventListener("click", () => this.dismiss("dismiss-button"));
        this.append(this.iconNode, copy, this.dismissButton);
        this.initialized = true;
    }

    private readonly pauseTimer = (): void => {
        window.clearTimeout(this.dismissTimer);
        this.dismissTimer = 0;
    };

    private readonly startTimer = (): void => {
        this.pauseTimer();
        const duration = Number(this.getAttribute("duration") || "0");
        if (!this.hidden && Number.isFinite(duration) && duration > 0) {
            this.dismissTimer = window.setTimeout(() => this.dismiss("timeout"), duration);
        }
    };

    private readonly handleFocusOut = (event: FocusEvent): void => {
        if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) return;
        this.startTimer();
    };

    private dismiss(reason: SGToastDismissDetail["reason"]): void {
        this.pauseTimer();
        const event = emit<SGToastDismissDetail>(this, "sg-dismiss", { reason }, { cancelable: true });
        if (!event.defaultPrevented) this.hidden = true;
    }

    private syncState(): void {
        const tone = this.getAttribute("tone") || "info";
        this.setAttribute("role", this.hasAttribute("urgent") ? "alert" : "status");
        this.titleNode!.textContent = this.getAttribute("title") || defaultTitle(tone);
        this.iconNode!.querySelector("sg-icon")!.setAttribute("name", iconForTone(tone));
        this.dismissButton!.hidden = !this.hasAttribute("dismissible");
        this.startTimer();
    }
}

function iconForTone(tone: string): string {
    return ({ success: "circle-check", warning: "triangle-alert", danger: "circle-x", info: "info" } as Record<string, string>)[tone] || "info";
}

function defaultTitle(tone: string): string {
    return ({ success: "Success", warning: "Warning", danger: "Error", info: "Information" } as Record<string, string>)[tone] || "Information";
}

export function defineSGToast(): void {
    defineElement("sg-toast", SGToast);
}
