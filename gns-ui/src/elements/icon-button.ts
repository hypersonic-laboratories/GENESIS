import { defineElement, emit } from "../internal/element";

export interface SGIconButtonActivateDetail extends Record<string, unknown> {
    source: "keyboard" | "pointer";
}

export class SGIconButton extends HTMLElement {
    static observedAttributes = ["icon", "label", "disabled", "loading", "pressed"];

    private initialized = false;
    private iconNode?: HTMLElement;
    private spacePressed = false;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.addEventListener("click", this.handleClick);
        this.addEventListener("keydown", this.handleKeyDown);
        this.addEventListener("keyup", this.handleKeyUp);
        this.addEventListener("blur", this.handleBlur);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this.handleClick);
        this.removeEventListener("keydown", this.handleKeyDown);
        this.removeEventListener("keyup", this.handleKeyUp);
        this.removeEventListener("blur", this.handleBlur);
        this.clearPressedState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
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

    get pressed(): boolean {
        return this.hasAttribute("pressed");
    }

    set pressed(value: boolean) {
        this.toggleAttribute("pressed", value);
    }

    private initialize(): void {
        const callerContent = Array.from(this.childNodes);
        this.iconNode = document.createElement("span");
        this.iconNode.className = "sg-icon-button__icon";
        this.iconNode.setAttribute("aria-hidden", "true");

        const content = document.createElement("span");
        content.className = "sg-icon-button__content";
        content.append(...callerContent);

        this.append(this.iconNode, content);
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        if (this.disabled || this.loading) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
        this.activate("pointer");
    };

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        if (this.disabled || this.loading) {
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            this.activate("keyboard");
        } else if (event.key === " ") {
            event.preventDefault();
            this.spacePressed = true;
            this.setAttribute("data-pressed", "");
        }
    };

    private readonly handleKeyUp = (event: KeyboardEvent): void => {
        if (event.key !== " " || !this.spacePressed) {
            return;
        }
        event.preventDefault();
        this.clearPressedState();
        if (!this.disabled && !this.loading) {
            this.activate("keyboard");
        }
    };

    private readonly handleBlur = (): void => {
        this.clearPressedState();
    };

    private clearPressedState(): void {
        this.spacePressed = false;
        this.removeAttribute("data-pressed");
    }

    private activate(source: SGIconButtonActivateDetail["source"]): void {
        emit<SGIconButtonActivateDetail>(this, "sg-activate", { source });
    }

    private syncState(): void {
        const unavailable = this.disabled || this.loading;
        const label = this.getAttribute("label") || this.getAttribute("aria-label") || this.getAttribute("title") || "Icon action";
        const icon = this.getAttribute("icon") || "circle";

        this.iconNode!.replaceChildren();
        const glyph = document.createElement("sg-icon");
        glyph.setAttribute("name", icon);
        this.iconNode!.append(glyph);

        this.setAttribute("role", "button");
        this.setAttribute("aria-label", label);
        this.setAttribute("aria-disabled", String(unavailable));
        if (this.loading) {
            this.setAttribute("aria-busy", "true");
        } else {
            this.removeAttribute("aria-busy");
        }
        if (this.hasAttribute("pressed")) {
            this.setAttribute("aria-pressed", String(this.pressed));
        } else {
            this.removeAttribute("aria-pressed");
        }
        this.tabIndex = unavailable ? -1 : 0;

        if (unavailable) {
            this.clearPressedState();
        }
    }
}

export function defineSGIconButton(): void {
    defineElement("sg-icon-button", SGIconButton);
}
