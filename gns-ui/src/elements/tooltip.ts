import { defineElement } from "../internal/element";

let tooltipId = 0;

export class SGTooltip extends HTMLElement {
    static observedAttributes = ["content", "placement", "disabled"];

    private initialized = false;
    private tooltipNode?: HTMLElement;
    private describedElement?: HTMLElement;
    private showTimer = 0;
    private hideTimer = 0;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.addEventListener("mouseenter", this.scheduleShow);
        this.addEventListener("mouseleave", this.scheduleHide);
        this.addEventListener("focusin", this.show);
        this.addEventListener("focusout", this.handleFocusOut);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("mouseenter", this.scheduleShow);
        this.removeEventListener("mouseleave", this.scheduleHide);
        this.removeEventListener("focusin", this.show);
        this.removeEventListener("focusout", this.handleFocusOut);
        this.clearTimers();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    private initialize(): void {
        const callerContent = Array.from(this.childNodes);
        const trigger = document.createElement("span");
        trigger.className = "sg-tooltip__trigger";
        trigger.append(...callerContent);

        this.tooltipNode = document.createElement("span");
        this.tooltipNode.className = "sg-tooltip__bubble";
        this.tooltipNode.id = `sg-tooltip-${++tooltipId}`;
        this.tooltipNode.setAttribute("role", "tooltip");
        this.tooltipNode.setAttribute("aria-hidden", "true");
        this.append(trigger, this.tooltipNode);
        this.describedElement = trigger.querySelector<HTMLElement>("button, input, select, textarea, a[href], [tabindex], sg-button, sg-icon-button") || trigger;
        this.initialized = true;
    }

    private readonly scheduleShow = (): void => {
        if (this.hasAttribute("disabled")) return;
        window.clearTimeout(this.hideTimer);
        this.showTimer = window.setTimeout(this.show, 320);
    };

    private readonly scheduleHide = (): void => {
        window.clearTimeout(this.showTimer);
        this.hideTimer = window.setTimeout(this.hide, 70);
    };

    private readonly handleFocusOut = (event: FocusEvent): void => {
        if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) {
            return;
        }
        this.hide();
    };

    private readonly show = (): void => {
        if (this.hasAttribute("disabled") || !this.getAttribute("content")) return;
        this.clearTimers();
        this.setAttribute("data-open", "");
        this.tooltipNode!.setAttribute("aria-hidden", "false");
    };

    private readonly hide = (): void => {
        this.clearTimers();
        this.removeAttribute("data-open");
        this.tooltipNode!.setAttribute("aria-hidden", "true");
    };

    private syncState(): void {
        const content = this.getAttribute("content") || "";
        this.tooltipNode!.textContent = content;
        const describedBy = (this.describedElement!.getAttribute("aria-describedby") || "")
            .split(/\s+/)
            .filter(Boolean)
            .filter((id) => id !== this.tooltipNode!.id);
        if (content && !this.hasAttribute("disabled")) describedBy.push(this.tooltipNode!.id);
        if (describedBy.length) {
            this.describedElement!.setAttribute("aria-describedby", describedBy.join(" "));
        } else {
            this.describedElement!.removeAttribute("aria-describedby");
        }
        if (!this.hasAttribute("placement")) this.setAttribute("placement", "top");
        if (!content || this.hasAttribute("disabled")) this.hide();
    }

    private clearTimers(): void {
        window.clearTimeout(this.showTimer);
        window.clearTimeout(this.hideTimer);
        this.showTimer = 0;
        this.hideTimer = 0;
    }
}

export function defineSGTooltip(): void {
    defineElement("sg-tooltip", SGTooltip);
}
