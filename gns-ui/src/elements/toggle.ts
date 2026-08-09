import { defineElement, emit } from "../internal/element";

export interface SGToggleChangeDetail extends Record<string, unknown> {
    checked: boolean;
    value: string;
    name: string;
}

let toggleId = 0;

export class SGToggle extends HTMLElement {
    static observedAttributes = ["label", "checked", "disabled", "required", "name", "value", "hint"];

    private initialized = false;
    private control?: HTMLInputElement;
    private labelNode?: HTMLElement;
    private hintNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.control!.addEventListener("change", this.handleChange);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("change", this.handleChange);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    get checked(): boolean {
        return this.control?.checked ?? this.hasAttribute("checked");
    }

    set checked(value: boolean) {
        this.toggleAttribute("checked", value);
    }

    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }

    set disabled(value: boolean) {
        this.toggleAttribute("disabled", value);
    }

    focus(options?: FocusOptions): void {
        this.control?.focus(options);
    }

    private initialize(): void {
        const id = `sg-toggle-${++toggleId}`;
        const wrapper = document.createElement("label");
        wrapper.className = "sg-toggle__wrapper";
        wrapper.htmlFor = id;

        this.control = document.createElement("input");
        this.control.className = "sg-toggle__control";
        this.control.id = id;
        this.control.type = "checkbox";
        this.control.setAttribute("role", "switch");

        const track = document.createElement("span");
        track.className = "sg-toggle__track";
        track.setAttribute("aria-hidden", "true");
        const thumb = document.createElement("span");
        thumb.className = "sg-toggle__thumb";
        track.append(thumb);

        this.labelNode = document.createElement("span");
        this.labelNode.className = "sg-toggle__label";
        wrapper.append(this.control, track, this.labelNode);

        this.hintNode = document.createElement("span");
        this.hintNode.className = "sg-toggle__hint";
        this.hintNode.id = `${id}-hint`;

        this.replaceChildren(wrapper, this.hintNode);
        this.initialized = true;
    }

    private readonly handleChange = (): void => {
        this.toggleAttribute("checked", this.control!.checked);
        emit<SGToggleChangeDetail>(this, "sg-change", {
            checked: this.control!.checked,
            value: this.control!.value,
            name: this.control!.name,
        });
    };

    private syncState(): void {
        const label = this.getAttribute("label") || "Toggle";
        const hint = this.getAttribute("hint") || "";
        this.labelNode!.textContent = label;
        this.control!.checked = this.hasAttribute("checked");
        this.control!.disabled = this.disabled;
        this.control!.required = this.hasAttribute("required");
        this.control!.name = this.getAttribute("name") || "";
        this.control!.value = this.getAttribute("value") || "on";
        this.control!.setAttribute("aria-describedby", this.hintNode!.id);

        this.hintNode!.textContent = hint;
        this.hintNode!.hidden = !hint;
    }
}

export function defineSGToggle(): void {
    defineElement("sg-toggle", SGToggle);
}
