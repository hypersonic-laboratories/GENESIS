import { defineElement } from "../internal/element";

let emptyStateId = 0;

export class SGEmptyState extends HTMLElement {
    static observedAttributes = ["label", "description", "icon", "compact"];

    private initialized = false;
    private titleNode?: HTMLElement;
    private descriptionNode?: HTMLElement;
    private iconNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.syncState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    private initialize(): void {
        const id = `sg-empty-state-${++emptyStateId}`;
        const actions = Array.from(this.childNodes);
        this.iconNode = document.createElement("span");
        this.iconNode.className = "sg-empty-state__icon";
        this.iconNode.setAttribute("aria-hidden", "true");
        this.titleNode = document.createElement("strong");
        this.titleNode.className = "sg-empty-state__title";
        this.titleNode.id = `${id}-title`;
        this.descriptionNode = document.createElement("span");
        this.descriptionNode.className = "sg-empty-state__description";
        this.descriptionNode.id = `${id}-description`;
        const actionNode = document.createElement("span");
        actionNode.className = "sg-empty-state__actions";
        actionNode.append(...actions);
        this.setAttribute("role", "region");
        this.setAttribute("aria-labelledby", this.titleNode.id);
        this.setAttribute("aria-describedby", this.descriptionNode.id);
        this.replaceChildren(this.iconNode, this.titleNode, this.descriptionNode, actionNode);
        this.initialized = true;
    }

    private syncState(): void {
        const icon = this.getAttribute("icon") || "package";
        this.iconNode!.innerHTML = `<sg-icon name="${icon}" aria-hidden="true"></sg-icon>`;
        this.titleNode!.textContent = this.getAttribute("label") || "Nothing here";
        this.descriptionNode!.textContent = this.getAttribute("description") || "There is no data available yet.";
    }
}

export function defineSGEmptyState(): void {
    defineElement("sg-empty-state", SGEmptyState);
}
