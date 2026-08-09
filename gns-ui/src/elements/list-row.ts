import { defineElement, emit } from "../internal/element";

export interface SGListRowActivateDetail extends Record<string, unknown> {
    label: string;
    selected: boolean;
    value: string;
}

export class SGListRow extends HTMLElement {
    static observedAttributes = ["label", "detail", "meta", "icon", "value", "selectable", "selected", "disabled", "tone"];

    private initialized = false;
    private action?: HTMLElement;
    private iconNode?: HTMLElement;
    private labelNode?: HTMLElement;
    private detailNode?: HTMLElement;
    private metaNode?: HTMLElement;
    private trailingNodes: Node[] = [];

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.action!.addEventListener("click", this.handleActivate);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.action?.removeEventListener("click", this.handleActivate);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get selected(): boolean { return this.hasAttribute("selected"); }
    set selected(value: boolean) { this.toggleAttribute("selected", value); }

    private initialize(): void {
        this.trailingNodes = Array.from(this.childNodes);
        this.rebuild();
        this.initialized = true;
    }

    private rebuild(): void {
        this.action = document.createElement(this.hasAttribute("selectable") ? "button" : "div");
        this.action.className = "sg-list-row__action";
        if (this.action instanceof HTMLButtonElement) this.action.type = "button";
        this.iconNode = document.createElement("span");
        this.iconNode.className = "sg-list-row__icon";
        const copy = document.createElement("span");
        copy.className = "sg-list-row__copy";
        this.labelNode = document.createElement("strong");
        this.labelNode.className = "sg-list-row__label";
        this.detailNode = document.createElement("span");
        this.detailNode.className = "sg-list-row__detail";
        copy.append(this.labelNode, this.detailNode);
        this.metaNode = document.createElement("span");
        this.metaNode.className = "sg-list-row__meta";
        this.action.append(this.iconNode, copy, this.metaNode);
        const trailing = document.createElement("span");
        trailing.className = "sg-list-row__trailing";
        trailing.append(...this.trailingNodes);
        this.replaceChildren(this.action, trailing);
    }

    private readonly handleActivate = (): void => {
        if (!this.hasAttribute("selectable") || this.hasAttribute("disabled")) return;
        const selected = !this.selected;
        this.toggleAttribute("selected", selected);
        emit<SGListRowActivateDetail>(this, "sg-item-activate", {
            label: this.getAttribute("label") || "List item",
            selected,
            value: this.getAttribute("value") || "",
        });
    };

    private syncState(): void {
        const shouldBeButton = this.hasAttribute("selectable");
        if ((this.action instanceof HTMLButtonElement) !== shouldBeButton) {
            this.action?.removeEventListener("click", this.handleActivate);
            this.trailingNodes = Array.from(this.querySelector(".sg-list-row__trailing")?.childNodes || []);
            this.rebuild();
            this.action!.addEventListener("click", this.handleActivate);
        }
        const label = this.getAttribute("label") || "List item";
        const icon = this.getAttribute("icon") || "";
        this.labelNode!.textContent = label;
        this.detailNode!.textContent = this.getAttribute("detail") || "";
        this.detailNode!.hidden = !this.getAttribute("detail");
        this.metaNode!.textContent = this.getAttribute("meta") || "";
        this.metaNode!.hidden = !this.getAttribute("meta");
        this.iconNode!.innerHTML = icon ? `<sg-icon name="${icon}" aria-hidden="true"></sg-icon>` : "";
        this.iconNode!.hidden = !icon;
        if (this.action instanceof HTMLButtonElement) {
            this.action.disabled = this.hasAttribute("disabled");
            this.action.setAttribute("aria-pressed", String(this.selected));
            this.action.setAttribute("aria-label", label);
        }
    }
}

export function defineSGListRow(): void {
    defineElement("sg-list-row", SGListRow);
}
