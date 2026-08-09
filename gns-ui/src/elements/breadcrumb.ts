import { defineElement } from "../internal/element";

export class SGBreadcrumb extends HTMLElement {
    static observedAttributes = ["label"];

    private initialized = false;
    private navigation?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.syncState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    private initialize(): void {
        const items = Array.from(this.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
        this.navigation = document.createElement("nav");
        this.navigation.className = "sg-breadcrumb__nav";
        const list = document.createElement("ol");
        list.className = "sg-breadcrumb__list";

        items.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.className = "sg-breadcrumb__item";
            if (index === items.length - 1 && !item.hasAttribute("aria-current")) item.setAttribute("aria-current", "page");
            listItem.append(item);
            if (index < items.length - 1) {
                const separator = document.createElement("sg-icon");
                separator.className = "sg-breadcrumb__separator";
                separator.setAttribute("name", "chevron-right");
                separator.setAttribute("aria-hidden", "true");
                listItem.append(separator);
            }
            list.append(listItem);
        });
        this.navigation.append(list);
        this.replaceChildren(this.navigation);
        this.initialized = true;
    }

    private syncState(): void {
        this.navigation!.setAttribute("aria-label", this.getAttribute("label") || "Breadcrumb");
    }
}

export function defineSGBreadcrumb(): void {
    defineElement("sg-breadcrumb", SGBreadcrumb);
}
