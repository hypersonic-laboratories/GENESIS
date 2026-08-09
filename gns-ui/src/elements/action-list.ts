import { defineElement, emit } from "../internal/element";

export interface SGActionSelectDetail extends Record<string, unknown> {
    value: string;
    label: string;
}

export class SGActionList extends HTMLElement {
    static observedAttributes = ["label", "disabled", "compact"];

    private initialized = false;
    private actions: HTMLButtonElement[] = [];

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.addEventListener("click", this.handleClick);
        this.addEventListener("keydown", this.handleKeyDown);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this.handleClick);
        this.removeEventListener("keydown", this.handleKeyDown);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    private initialize(): void {
        this.actions = Array.from(this.children).filter(
            (child): child is HTMLButtonElement => child instanceof HTMLButtonElement,
        );
        this.setAttribute("role", "menu");
        this.actions.forEach((action, index) => {
            action.type = "button";
            action.classList.add("sg-action-list__item");
            action.setAttribute("role", "menuitem");
            action.setAttribute("data-value", action.value || action.dataset.value || `action-${index + 1}`);
            const icon = action.dataset.icon;
            if (icon && !action.querySelector("sg-icon")) {
                action.insertAdjacentHTML("afterbegin", `<sg-icon name="${icon}" aria-hidden="true"></sg-icon>`);
            }
            if (!action.querySelector(".sg-action-list__indicator")) {
                action.insertAdjacentHTML("beforeend", '<sg-icon class="sg-action-list__indicator" name="chevron-right" aria-hidden="true"></sg-icon>');
            }
        });
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const action = (event.target as Element).closest<HTMLButtonElement>("button.sg-action-list__item");
        if (!action || !this.contains(action) || action.disabled || this.hasAttribute("disabled")) return;
        this.select(action);
    };

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            emit(this, "sg-close", { reason: "escape" });
            return;
        }
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const enabled = this.actions.filter((action) => !action.disabled && !this.hasAttribute("disabled"));
        if (!enabled.length) return;
        event.preventDefault();
        const current = enabled.indexOf(document.activeElement as HTMLButtonElement);
        let next = current < 0 ? 0 : current;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = enabled.length - 1;
        if (event.key === "ArrowDown") next = current < 0 ? 0 : (current + 1) % enabled.length;
        if (event.key === "ArrowUp") next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;
        enabled[next].focus();
    };

    private select(action: HTMLButtonElement): void {
        emit<SGActionSelectDetail>(this, "sg-action-select", {
            value: action.getAttribute("data-value") || "",
            label: action.textContent?.trim() || "Action",
        });
    }

    private syncState(): void {
        const disabled = this.hasAttribute("disabled");
        this.setAttribute("aria-label", this.getAttribute("label") || "Actions");
        this.setAttribute("aria-disabled", String(disabled));
        const firstEnabled = this.actions.find((action) => !action.disabled);
        this.actions.forEach((action) => {
            action.tabIndex = !disabled && action === firstEnabled ? 0 : -1;
        });
    }
}

export function defineSGActionList(): void {
    defineElement("sg-action-list", SGActionList);
}
