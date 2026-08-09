import { defineElement, emit } from "../internal/element";

export interface SGCheckboxChangeDetail extends Record<string, unknown> {
    checked: boolean;
    indeterminate: boolean;
    value: string;
    name: string;
}

let checkboxId = 0;

export class SGCheckbox extends HTMLElement {
    static observedAttributes = [
        "label", "checked", "indeterminate", "disabled", "required", "name", "value",
        "hint", "error", "invalid", "state",
    ];

    private initialized = false;
    private control?: HTMLInputElement;
    private labelNode?: HTMLElement;
    private messageNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.control!.addEventListener("change", this.handleChange);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("change", this.handleChange);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get checked(): boolean { return this.control?.checked ?? this.hasAttribute("checked"); }
    set checked(value: boolean) { this.toggleAttribute("checked", value); }
    get indeterminate(): boolean { return this.control?.indeterminate ?? this.hasAttribute("indeterminate"); }
    set indeterminate(value: boolean) { this.toggleAttribute("indeterminate", value); }
    get disabled(): boolean { return this.hasAttribute("disabled"); }
    set disabled(value: boolean) { this.toggleAttribute("disabled", value); }
    focus(options?: FocusOptions): void { this.control?.focus(options); }

    private initialize(): void {
        const id = `sg-checkbox-${++checkboxId}`;
        const wrapper = document.createElement("label");
        wrapper.className = "sg-checkbox__wrapper";
        wrapper.htmlFor = id;

        this.control = document.createElement("input");
        this.control.className = "sg-checkbox__control";
        this.control.id = id;
        this.control.type = "checkbox";

        const box = document.createElement("span");
        box.className = "sg-checkbox__box";
        box.setAttribute("aria-hidden", "true");
        this.labelNode = document.createElement("span");
        this.labelNode.className = "sg-checkbox__label";
        wrapper.append(this.control, box, this.labelNode);

        this.messageNode = document.createElement("span");
        this.messageNode.className = "sg-checkbox__message";
        this.messageNode.id = `${id}-message`;
        this.replaceChildren(wrapper, this.messageNode);
        this.initialized = true;
    }

    private readonly handleChange = (): void => {
        this.toggleAttribute("indeterminate", false);
        this.toggleAttribute("checked", this.control!.checked);
        emit<SGCheckboxChangeDetail>(this, "sg-change", {
            checked: this.control!.checked,
            indeterminate: this.control!.indeterminate,
            value: this.control!.value,
            name: this.control!.name,
        });
    };

    private syncState(): void {
        const hint = this.getAttribute("hint") || "";
        const error = this.getAttribute("error") || "";
        const invalid = this.hasAttribute("invalid") || this.getAttribute("state") === "danger" || Boolean(error);
        this.labelNode!.textContent = this.getAttribute("label") || "Checkbox";
        this.control!.checked = this.hasAttribute("checked");
        this.control!.indeterminate = this.hasAttribute("indeterminate");
        this.control!.disabled = this.disabled;
        this.control!.required = this.hasAttribute("required");
        this.control!.name = this.getAttribute("name") || "";
        this.control!.value = this.getAttribute("value") || "on";
        this.control!.setAttribute("aria-invalid", String(invalid));
        this.control!.setAttribute("aria-describedby", this.messageNode!.id);
        this.messageNode!.textContent = error || hint;
        this.messageNode!.hidden = !error && !hint;
        this.messageNode!.toggleAttribute("data-error", invalid);
        this.toggleAttribute("data-invalid", invalid);
    }
}

export function defineSGCheckbox(): void {
    defineElement("sg-checkbox", SGCheckbox);
}
