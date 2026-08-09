import { defineElement, emit } from "../internal/element";

export interface SGSegmentedChangeDetail extends Record<string, unknown> {
    value: string;
    previousValue: string;
}

export class SGSegmented extends HTMLElement {
    static observedAttributes = ["value", "label", "disabled"];

    private initialized = false;
    private options: HTMLButtonElement[] = [];
    private activeValue = "";
    private stateObserver?: MutationObserver;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.addEventListener("click", this.handleClick);
        this.addEventListener("keydown", this.handleKeyDown);
        this.observeState();
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this.handleClick);
        this.removeEventListener("keydown", this.handleKeyDown);
        this.stateObserver?.disconnect();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    get value(): string {
        return this.activeValue || this.getAttribute("value") || "";
    }

    set value(value: string) {
        this.setAttribute("value", value);
    }

    private initialize(): void {
        this.options = Array.from(this.children).filter(
            (child): child is HTMLButtonElement => child instanceof HTMLButtonElement,
        );
        this.setAttribute("role", "radiogroup");
        this.options.forEach((option, index) => {
            option.type = "button";
            option.setAttribute("role", "radio");
            option.setAttribute("data-value", option.value || `option-${index + 1}`);
            option.classList.add("sg-segmented__option");
        });
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const option = (event.target as Element).closest<HTMLButtonElement>("button.sg-segmented__option");
        if (!option || option.disabled || this.hasAttribute("disabled") || !this.contains(option)) {
            return;
        }
        this.select(option.getAttribute("data-value") || "");
    };

    private observeState(): void {
        if (!this.stateObserver) {
            this.stateObserver = new MutationObserver(() => this.syncState());
        }
        this.stateObserver.observe(this, { subtree: true, attributes: true, attributeFilter: ["disabled"] });
    }

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
            return;
        }
        const enabled = this.options.filter((option) => !option.disabled && !this.hasAttribute("disabled"));
        const currentIndex = enabled.indexOf(document.activeElement as HTMLButtonElement);
        if (currentIndex === -1 || enabled.length === 0) {
            return;
        }
        event.preventDefault();
        let nextIndex = currentIndex;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = enabled.length - 1;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % enabled.length;
        enabled[nextIndex].focus();
        this.select(enabled[nextIndex].getAttribute("data-value") || "");
    };

    private select(value: string): void {
        if (!value || value === this.activeValue) {
            return;
        }
        const previousValue = this.activeValue;
        this.setAttribute("value", value);
        emit<SGSegmentedChangeDetail>(this, "sg-change", { value, previousValue });
    }

    private syncState(): void {
        const disabled = this.hasAttribute("disabled");
        const requested = this.getAttribute("value") || "";
        const active = this.options.find((option) => !option.disabled && option.getAttribute("data-value") === requested)
            || this.options.find((option) => !option.disabled);
        this.activeValue = active?.getAttribute("data-value") || "";
        this.setAttribute("aria-label", this.getAttribute("label") || "Options");
        this.setAttribute("aria-disabled", String(disabled));
        this.options.forEach((option) => {
            const selected = option === active;
            option.setAttribute("aria-checked", String(selected));
            option.tabIndex = !disabled && selected ? 0 : -1;
        });
    }
}

export function defineSGSegmented(): void {
    defineElement("sg-segmented", SGSegmented);
}
