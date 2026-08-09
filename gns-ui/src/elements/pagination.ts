import { clamp, defineElement, emit } from "../internal/element";

export interface SGPaginationChangeDetail extends Record<string, unknown> {
    page: number;
    previousPage: number;
}

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

export class SGPagination extends HTMLElement {
    static observedAttributes = ["page", "total", "siblings", "size", "disabled", "label"];

    private initialized = false;
    private list?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.list!.addEventListener("click", this.handleClick);
        this.render();
    }

    disconnectedCallback(): void {
        this.list?.removeEventListener("click", this.handleClick);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.render();
    }

    get page(): number { return boundedInteger(this.getAttribute("page"), 1, this.total, 1); }
    set page(value: number) { this.setAttribute("page", String(boundedInteger(String(value), 1, this.total, 1))); }
    get total(): number { return positiveInteger(this.getAttribute("total"), 1); }

    private initialize(): void {
        this.setAttribute("role", "navigation");
        this.list = document.createElement("div");
        this.list.className = "sg-pagination__list";
        this.replaceChildren(this.list);
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const button = (event.target as Element).closest<HTMLButtonElement>("button[data-page]");
        if (!button || button.disabled || !this.list!.contains(button)) return;
        const requested = Number(button.dataset.page);
        const previousPage = this.page;
        if (!Number.isInteger(requested) || requested === previousPage) return;
        this.setAttribute("page", String(requested));
        emit<SGPaginationChangeDetail>(this, "sg-change", { page: requested, previousPage });
    };

    private render(): void {
        const current = this.page;
        const total = this.total;
        const disabled = this.hasAttribute("disabled");
        const siblings = boundedInteger(this.getAttribute("siblings"), 0, 3, 1);
        this.setAttribute("aria-label", this.getAttribute("label") || "Pagination");
        this.list!.replaceChildren(
            navigationButton("chevron-left", "Previous page", current - 1, disabled || current === 1),
            ...paginationItems(current, total, siblings).map((item) => {
                if (typeof item !== "number") {
                    const ellipsis = document.createElement("span");
                    ellipsis.className = "sg-pagination__ellipsis";
                    ellipsis.textContent = "…";
                    ellipsis.setAttribute("aria-hidden", "true");
                    return ellipsis;
                }
                const button = document.createElement("button");
                button.className = "sg-pagination__button";
                button.type = "button";
                button.dataset.page = String(item);
                button.textContent = String(item);
                button.disabled = disabled;
                button.setAttribute("aria-label", item === current ? `Page ${item}, current page` : `Go to page ${item}`);
                if (item === current) button.setAttribute("aria-current", "page");
                return button;
            }),
            navigationButton("chevron-right", "Next page", current + 1, disabled || current === total),
        );
    }
}

function navigationButton(icon: string, label: string, page: number, disabled: boolean): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "sg-pagination__button sg-pagination__button--navigation";
    button.type = "button";
    button.dataset.page = String(page);
    button.disabled = disabled;
    button.setAttribute("aria-label", label);
    button.innerHTML = `<sg-icon name="${icon}" aria-hidden="true"></sg-icon>`;
    return button;
}

function paginationItems(current: number, total: number, siblings: number): PaginationItem[] {
    if (total <= 7 + siblings * 2) return Array.from({ length: total }, (_, index) => index + 1);
    const pages = new Set<number>([1, total]);
    for (let page = current - siblings; page <= current + siblings; page += 1) {
        if (page > 1 && page < total) pages.add(page);
    }
    if (current <= siblings + 3) {
        for (let page = 2; page <= Math.min(total - 1, 3 + siblings * 2); page += 1) pages.add(page);
    }
    if (current >= total - siblings - 2) {
        for (let page = Math.max(2, total - 2 - siblings * 2); page < total; page += 1) pages.add(page);
    }
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const items: PaginationItem[] = [];
    sorted.forEach((page, index) => {
        const previous = sorted[index - 1];
        if (previous && page - previous > 1) items.push(index === 1 ? "ellipsis-start" : "ellipsis-end");
        items.push(page);
    });
    return items;
}

function positiveInteger(value: string | null, fallback: number): number {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function boundedInteger(value: string | null, minimum: number, maximum: number, fallback: number): number {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) ? clamp(parsed, minimum, maximum) : fallback;
}

export function defineSGPagination(): void {
    defineElement("sg-pagination", SGPagination);
}
