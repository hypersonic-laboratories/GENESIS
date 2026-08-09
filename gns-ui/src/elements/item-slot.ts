import { defineElement, emit } from "../internal/element";

export interface SGItemActivateDetail extends Record<string, unknown> {
    label: string;
    selected: boolean;
}

export class SGItemSlot extends HTMLElement {
    static observedAttributes = ["label", "quantity", "meta", "selected", "disabled", "locked", "empty"];

    private initialized = false;
    private labelNode?: HTMLElement;
    private quantityNode?: HTMLElement;
    private metaNode?: HTMLElement;
    private stateNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.addEventListener("click", this.handleActivate);
        this.addEventListener("keydown", this.handleKeyDown);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this.handleActivate);
        this.removeEventListener("keydown", this.handleKeyDown);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    private initialize(): void {
        const callerContent = Array.from(this.childNodes);
        const media = document.createElement("span");
        media.className = "sg-item-slot__media";
        media.append(...callerContent);

        this.quantityNode = document.createElement("span");
        this.quantityNode.className = "sg-item-slot__quantity";

        this.labelNode = document.createElement("span");
        this.labelNode.className = "sg-item-slot__label";

        this.metaNode = document.createElement("span");
        this.metaNode.className = "sg-item-slot__meta";

        this.stateNode = document.createElement("span");
        this.stateNode.className = "sg-item-slot__state";
        this.stateNode.innerHTML = '<sg-icon name="lock"></sg-icon><span>Locked</span>';
        this.stateNode.hidden = true;

        this.append(media, this.quantityNode, this.labelNode, this.metaNode, this.stateNode);
        this.initialized = true;
    }

    private readonly handleActivate = (event: Event): void => {
        if (this.hasAttribute("disabled") || this.hasAttribute("locked")) {
            event.preventDefault();
            return;
        }
        this.activate();
    };

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        if ((event.key === "Enter" || event.key === " ") && !this.hasAttribute("disabled") && !this.hasAttribute("locked")) {
            event.preventDefault();
            this.activate();
        }
    };

    private activate(): void {
        emit<SGItemActivateDetail>(this, "sg-item-activate", {
            label: this.getAttribute("label") || "",
            selected: !this.hasAttribute("selected"),
        });
    }

    private syncState(): void {
        const label = this.getAttribute("label") || (this.hasAttribute("empty") ? "Empty slot" : "Item");
        const unavailable = this.hasAttribute("disabled") || this.hasAttribute("locked");
        this.labelNode!.textContent = label;
        this.quantityNode!.textContent = this.getAttribute("quantity") || "";
        this.quantityNode!.hidden = !this.hasAttribute("quantity");
        this.metaNode!.textContent = this.getAttribute("meta") || "";
        this.metaNode!.hidden = !this.hasAttribute("meta");
        this.stateNode!.hidden = !this.hasAttribute("locked");
        this.setAttribute("role", "button");
        const quantity = this.getAttribute("quantity");
        const state = this.hasAttribute("locked") ? "locked" : this.hasAttribute("disabled") ? "disabled" : this.hasAttribute("selected") ? "selected" : "available";
        this.setAttribute("aria-label", [label, quantity ? `quantity ${quantity}` : "", state].filter(Boolean).join(", "));
        this.setAttribute("aria-pressed", String(this.hasAttribute("selected")));
        this.setAttribute("aria-disabled", String(unavailable));
        this.tabIndex = unavailable ? -1 : 0;
    }
}

export function defineSGItemSlot(): void {
    defineElement("sg-item-slot", SGItemSlot);
}
