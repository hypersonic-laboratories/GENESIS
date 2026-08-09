import { defineElement } from "../internal/element";

export class SGDataTable extends HTMLElement {
    static observedAttributes = ["label", "compact", "striped", "sticky-header"];

    private initialized = false;
    private table?: HTMLTableElement;
    private wrapper?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.syncState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    private initialize(): void {
        this.table = Array.from(this.children).find((child): child is HTMLTableElement => child instanceof HTMLTableElement);
        if (!this.table) {
            this.table = document.createElement("table");
            this.table.innerHTML = "<tbody></tbody>";
        }
        this.table.classList.add("sg-data-table__table");
        this.wrapper = document.createElement("div");
        this.wrapper.className = "sg-data-table__viewport";
        this.wrapper.append(this.table);
        this.replaceChildren(this.wrapper);
        this.initialized = true;
    }

    private syncState(): void {
        const label = this.getAttribute("label") || "Data table";
        this.setAttribute("role", "region");
        this.setAttribute("aria-label", label);
        this.table!.setAttribute("aria-label", label);
    }
}

export function defineSGDataTable(): void {
    defineElement("sg-data-table", SGDataTable);
}
