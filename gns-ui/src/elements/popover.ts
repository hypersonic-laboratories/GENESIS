import { defineElement, emit } from "../internal/element";
import { focusFirst, restoreFocus } from "../internal/focus";

export interface SGPopoverCloseDetail extends Record<string, unknown> {
    reason: "escape" | "outside" | "trigger";
}

let popoverId = 0;

export class SGPopover extends HTMLElement {
    static observedAttributes = ["open", "label", "placement", "disabled", "autofocus"];

    private initialized = false;
    private trigger?: HTMLElement;
    private content?: HTMLElement;
    private previousFocus?: HTMLElement;
    private wasOpen = false;
    private triggerUsesActivate = false;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        if (!this.trigger || !this.content) return;
        this.trigger!.addEventListener(this.triggerUsesActivate ? "sg-activate" : "click", this.handleTrigger);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.trigger?.removeEventListener(this.triggerUsesActivate ? "sg-activate" : "click", this.handleTrigger);
        document.removeEventListener("pointerdown", this.handleOutsidePointer, true);
        document.removeEventListener("keydown", this.handleDocumentKeyDown);
        restoreFocus(this.previousFocus);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get open(): boolean { return this.hasAttribute("open"); }
    set open(value: boolean) { this.toggleAttribute("open", value); }

    private initialize(): void {
        const children = Array.from(this.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
        this.trigger = this.querySelector<HTMLElement>("[data-sg-trigger]") || children[0];
        this.content = this.querySelector<HTMLElement>("[data-sg-content]") || children[1];
        if (!this.trigger || !this.content) {
            this.setAttribute("data-invalid", "");
            return;
        }
        this.removeAttribute("data-invalid");
        const id = `sg-popover-${++popoverId}`;
        this.trigger.classList.add("sg-popover__trigger");
        this.triggerUsesActivate = this.trigger.matches("sg-button, sg-icon-button");
        this.trigger.setAttribute("aria-haspopup", "dialog");
        this.trigger.setAttribute("aria-controls", id);
        this.content.classList.add("sg-popover__content");
        this.content.id = id;
        this.content.setAttribute("role", "dialog");
        this.content.tabIndex = -1;
        this.initialized = true;
    }

    private readonly handleTrigger = (): void => {
        if (this.hasAttribute("disabled")) return;
        if (this.open) {
            this.requestClose("trigger");
        } else {
            this.open = true;
        }
    };

    private readonly handleOutsidePointer = (event: PointerEvent): void => {
        if (event.target instanceof Node && !this.contains(event.target)) this.requestClose("outside");
    };

    private readonly handleDocumentKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== "Escape" || !this.open) return;
        event.preventDefault();
        this.requestClose("escape");
    };

    private requestClose(reason: SGPopoverCloseDetail["reason"]): void {
        const event = emit<SGPopoverCloseDetail>(this, "sg-close", { reason }, { cancelable: true });
        if (!event.defaultPrevented) this.open = false;
    }

    private syncState(): void {
        if (!this.hasAttribute("placement")) this.setAttribute("placement", "bottom-start");
        if (this.hasAttribute("disabled") && this.open) {
            this.open = false;
            return;
        }
        this.trigger!.setAttribute("aria-expanded", String(this.open));
        this.content!.setAttribute("aria-label", this.getAttribute("label") || "More information");
        this.content!.setAttribute("aria-hidden", String(!this.open));
        if (this.open && !this.wasOpen) {
            this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
            document.addEventListener("pointerdown", this.handleOutsidePointer, true);
            document.addEventListener("keydown", this.handleDocumentKeyDown);
            if (this.hasAttribute("autofocus")) {
                window.setTimeout(() => { if (this.open) focusFirst(this.content!); }, 0);
            }
        } else if (!this.open && this.wasOpen) {
            document.removeEventListener("pointerdown", this.handleOutsidePointer, true);
            document.removeEventListener("keydown", this.handleDocumentKeyDown);
            restoreFocus(this.previousFocus);
            this.previousFocus = undefined;
        }
        this.wasOpen = this.open;
    }
}

export function defineSGPopover(): void {
    defineElement("sg-popover", SGPopover);
}
