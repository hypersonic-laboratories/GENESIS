import { defineElement, emit } from "../internal/element";

export interface SGChipChangeDetail extends Record<string, unknown> {
    selected: boolean;
    value: string;
}

export interface SGChipRemoveDetail extends Record<string, unknown> {
    value: string;
}

export class SGChip extends HTMLElement {
    static observedAttributes = ["label", "value", "selected", "selectable", "removable", "disabled", "tone"];

    private initialized = false;
    private originalLabel = "";
    private selectionNode?: HTMLElement;
    private labelNode?: HTMLElement;
    private removeButton?: HTMLButtonElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.selectionNode?.addEventListener("click", this.handleSelection);
        this.removeButton?.addEventListener("click", this.handleRemove);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.selectionNode?.removeEventListener("click", this.handleSelection);
        this.removeButton?.removeEventListener("click", this.handleRemove);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get selected(): boolean { return this.hasAttribute("selected"); }
    set selected(value: boolean) { this.toggleAttribute("selected", value); }
    get disabled(): boolean { return this.hasAttribute("disabled"); }
    set disabled(value: boolean) { this.toggleAttribute("disabled", value); }

    private initialize(): void {
        this.originalLabel = this.textContent?.trim() || "Chip";
        this.rebuild();
        this.initialized = true;
    }

    private rebuild(): void {
        const selectable = this.hasAttribute("selectable");
        this.selectionNode = document.createElement(selectable ? "button" : "span");
        this.selectionNode.className = "sg-chip__selection";
        if (this.selectionNode instanceof HTMLButtonElement) this.selectionNode.type = "button";
        this.labelNode = document.createElement("span");
        this.labelNode.className = "sg-chip__label";
        this.selectionNode.append(this.labelNode);

        const children: HTMLElement[] = [this.selectionNode];
        if (this.hasAttribute("removable")) {
            this.removeButton = document.createElement("button");
            this.removeButton.className = "sg-chip__remove";
            this.removeButton.type = "button";
            this.removeButton.innerHTML = '<sg-icon name="x" aria-hidden="true"></sg-icon>';
            children.push(this.removeButton);
        } else {
            this.removeButton = undefined;
        }
        this.replaceChildren(...children);
    }

    private readonly handleSelection = (): void => {
        if (!this.hasAttribute("selectable") || this.disabled) return;
        const selected = !this.selected;
        this.toggleAttribute("selected", selected);
        emit<SGChipChangeDetail>(this, "sg-change", { selected, value: this.value() });
    };

    private readonly handleRemove = (): void => {
        if (this.disabled) return;
        const event = emit<SGChipRemoveDetail>(this, "sg-remove", { value: this.value() }, { cancelable: true });
        if (!event.defaultPrevented) this.hidden = true;
    };

    private syncState(): void {
        const expectedTag = this.hasAttribute("selectable") ? "BUTTON" : "SPAN";
        const expectedRemove = this.hasAttribute("removable");
        if (this.selectionNode?.tagName !== expectedTag || Boolean(this.removeButton) !== expectedRemove) {
            this.selectionNode?.removeEventListener("click", this.handleSelection);
            this.removeButton?.removeEventListener("click", this.handleRemove);
            this.rebuild();
            this.selectionNode!.addEventListener("click", this.handleSelection);
            this.removeButton?.addEventListener("click", this.handleRemove);
        }
        const label = this.getAttribute("label") || this.originalLabel;
        this.labelNode!.textContent = label;
        if (this.selectionNode instanceof HTMLButtonElement) {
            this.selectionNode.disabled = this.disabled;
            this.selectionNode.setAttribute("aria-pressed", String(this.selected));
        }
        this.removeButton?.toggleAttribute("disabled", this.disabled);
        this.removeButton?.setAttribute("aria-label", `Remove ${label}`);
        this.setAttribute("aria-disabled", String(this.disabled));
    }

    private value(): string {
        return this.getAttribute("value") || this.getAttribute("label") || this.originalLabel;
    }
}

export function defineSGChip(): void {
    defineElement("sg-chip", SGChip);
}
