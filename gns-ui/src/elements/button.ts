import { defineElement, emit } from "../internal/element";

export interface SGActivateDetail extends Record<string, unknown> {
    source: "keyboard" | "pointer";
}

export class SGButton extends HTMLElement {
    static observedAttributes = ["disabled", "loading"];

    private spacePressed = false;

    connectedCallback(): void {
        this.setAttribute("role", "button");
        this.addEventListener("click", this.handleClick);
        this.addEventListener("keydown", this.handleKeyDown);
        this.addEventListener("keyup", this.handleKeyUp);
        this.addEventListener("blur", this.clearPressedState);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this.handleClick);
        this.removeEventListener("keydown", this.handleKeyDown);
        this.removeEventListener("keyup", this.handleKeyUp);
        this.removeEventListener("blur", this.clearPressedState);
        this.clearPressedState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected) {
            this.syncState();
        }
    }

    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }

    set disabled(value: boolean) {
        this.toggleAttribute("disabled", value);
    }

    get loading(): boolean {
        return this.hasAttribute("loading");
    }

    set loading(value: boolean) {
        this.toggleAttribute("loading", value);
    }

    private readonly handleClick = (event: MouseEvent): void => {
        if (this.disabled || this.loading) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }

        this.activate("pointer");
    };

    private readonly clearPressedState = (): void => {
        this.spacePressed = false;
        this.removeAttribute("data-pressed");
    };

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        if (this.disabled || this.loading) {
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            this.activate("keyboard");
        }

        if (event.key === " ") {
            event.preventDefault();
            this.spacePressed = true;
            this.setAttribute("data-pressed", "");
        }
    };

    private readonly handleKeyUp = (event: KeyboardEvent): void => {
        if (event.key !== " " || !this.spacePressed) {
            return;
        }

        this.spacePressed = false;
        this.removeAttribute("data-pressed");
        if (!this.disabled && !this.loading) {
            this.activate("keyboard");
        }
    };

    private activate(source: SGActivateDetail["source"]): void {
        emit<SGActivateDetail>(this, "sg-activate", { source });
    }

    private syncState(): void {
        const unavailable = this.disabled || this.loading;
        if (unavailable) {
            this.clearPressedState();
        }
        this.setAttribute("aria-disabled", String(unavailable));
        if (this.loading) {
            this.setAttribute("aria-busy", "true");
        } else {
            this.removeAttribute("aria-busy");
        }
        this.tabIndex = unavailable ? -1 : 0;
    }
}

export function defineSGButton(): void {
    defineElement("sg-button", SGButton);
}
