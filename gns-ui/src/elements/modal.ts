import { defineElement, emit } from "../internal/element";
import { focusFirst, restoreFocus, trapTab } from "../internal/focus";

export interface SGCloseDetail extends Record<string, unknown> {
    reason: "close-button" | "escape" | "scrim";
}

let modalId = 0;

export class SGModal extends HTMLElement {
    static observedAttributes = ["open", "label", "dismissible", "size"];

    private initialized = false;
    private surface?: HTMLElement;
    private titleNode?: HTMLElement;
    private closeButton?: HTMLButtonElement;
    private previousFocus?: HTMLElement;
    private wasOpen = false;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.addEventListener("click", this.handleClick);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this.handleClick);
        document.removeEventListener("keydown", this.handleDocumentKeyDown);
        restoreFocus(this.previousFocus);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    get open(): boolean {
        return this.hasAttribute("open");
    }

    set open(value: boolean) {
        this.toggleAttribute("open", value);
    }

    private initialize(): void {
        const id = `sg-modal-${++modalId}`;
        const callerContent = Array.from(this.childNodes);
        const scrim = document.createElement("div");
        scrim.className = "sg-modal__scrim";
        scrim.setAttribute("data-sg-scrim", "");

        this.surface = document.createElement("section");
        this.surface.className = "sg-modal__surface";
        this.surface.setAttribute("role", "dialog");
        this.surface.setAttribute("aria-modal", "true");
        this.surface.tabIndex = -1;

        const header = document.createElement("header");
        header.className = "sg-modal__header";
        this.titleNode = document.createElement("h2");
        this.titleNode.className = "sg-modal__title";
        this.titleNode.id = `${id}-title`;
        this.surface.setAttribute("aria-labelledby", this.titleNode.id);

        this.closeButton = document.createElement("button");
        this.closeButton.className = "sg-modal__close";
        this.closeButton.type = "button";
        this.closeButton.setAttribute("aria-label", "Close dialog");
        this.closeButton.innerHTML = '<sg-icon name="x" aria-hidden="true"></sg-icon>';
        header.append(this.titleNode, this.closeButton);

        const body = document.createElement("div");
        body.className = "sg-modal__body";
        body.append(...callerContent);
        this.surface.append(header, body);
        scrim.append(this.surface);
        this.append(scrim);
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const target = event.target as HTMLElement;
        if (target.closest("button") === this.closeButton) {
            this.requestClose("close-button");
        } else if (target.hasAttribute("data-sg-scrim")) {
            this.requestClose("scrim");
        }
    };

    private readonly handleDocumentKeyDown = (event: KeyboardEvent): void => {
        if (!this.open) {
            return;
        }
        if (event.key === "Escape" && this.hasAttribute("dismissible")) {
            event.preventDefault();
            this.requestClose("escape");
            return;
        }
        trapTab(event, this.surface!);
    };

    private requestClose(reason: SGCloseDetail["reason"]): void {
        if (!this.hasAttribute("dismissible")) {
            return;
        }
        const event = emit<SGCloseDetail>(this, "sg-close", { reason }, { cancelable: true });
        if (!event.defaultPrevented) {
            this.open = false;
        }
    }

    private syncState(): void {
        this.titleNode!.textContent = this.getAttribute("label") || "Dialog";
        this.closeButton!.hidden = !this.hasAttribute("dismissible");
        this.setAttribute("aria-hidden", String(!this.open));

        if (this.open && !this.wasOpen) {
            this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
            document.addEventListener("keydown", this.handleDocumentKeyDown);
            window.setTimeout(() => {
                if (this.open && this.isConnected) focusFirst(this.surface!);
            }, 0);
        } else if (!this.open && this.wasOpen) {
            document.removeEventListener("keydown", this.handleDocumentKeyDown);
            restoreFocus(this.previousFocus);
            this.previousFocus = undefined;
        }
        this.wasOpen = this.open;
    }
}

export function defineSGModal(): void {
    defineElement("sg-modal", SGModal);
}
