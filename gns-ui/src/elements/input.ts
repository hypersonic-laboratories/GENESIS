import { defineElement, emit } from "../internal/element";

export interface SGInputDetail extends Record<string, unknown> {
    value: string;
    name: string;
}

let inputId = 0;

export class SGInput extends HTMLElement {
    static observedAttributes = [
        "label", "value", "type", "name", "placeholder", "autocomplete", "inputmode",
        "min", "max", "step", "minlength", "maxlength", "pattern", "required",
        "readonly", "disabled", "invalid", "state", "icon", "hint", "error",
    ];

    private initialized = false;
    private control?: HTMLInputElement;
    private labelNode?: HTMLLabelElement;
    private iconNode?: HTMLElement;
    private messageNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.control!.addEventListener("input", this.handleInput);
        this.control!.addEventListener("change", this.handleChange);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("input", this.handleInput);
        this.control?.removeEventListener("change", this.handleChange);
    }

    attributeChangedCallback(name: string): void {
        if (this.isConnected && this.initialized) {
            this.syncState(name);
        }
    }

    get value(): string {
        return this.control?.value ?? this.getAttribute("value") ?? "";
    }

    set value(value: string) {
        this.setAttribute("value", String(value));
    }

    get disabled(): boolean {
        return this.hasAttribute("disabled");
    }

    set disabled(value: boolean) {
        this.toggleAttribute("disabled", value);
    }

    get readOnly(): boolean {
        return this.hasAttribute("readonly");
    }

    set readOnly(value: boolean) {
        this.toggleAttribute("readonly", value);
    }

    get required(): boolean {
        return this.hasAttribute("required");
    }

    set required(value: boolean) {
        this.toggleAttribute("required", value);
    }

    focus(options?: FocusOptions): void {
        this.control?.focus(options);
    }

    select(): void {
        this.control?.select();
    }

    private initialize(): void {
        const id = `sg-input-${++inputId}`;
        this.labelNode = document.createElement("label");
        this.labelNode.className = "sg-input__label";
        this.labelNode.htmlFor = id;

        const frame = document.createElement("span");
        frame.className = "sg-input__frame";
        this.iconNode = document.createElement("sg-icon");
        this.iconNode.className = "sg-input__icon";
        this.iconNode.setAttribute("aria-hidden", "true");
        this.control = document.createElement("input");
        this.control.className = "sg-input__control";
        this.control.id = id;
        frame.append(this.iconNode, this.control);

        this.messageNode = document.createElement("span");
        this.messageNode.className = "sg-input__message";
        this.messageNode.id = `${id}-message`;

        this.replaceChildren(this.labelNode, frame, this.messageNode);
        this.initialized = true;
    }

    private readonly handleInput = (): void => {
        emit<SGInputDetail>(this, "sg-input", this.eventDetail());
    };

    private readonly handleChange = (): void => {
        emit<SGInputDetail>(this, "sg-change", this.eventDetail());
    };

    private eventDetail(): SGInputDetail {
        return { value: this.control!.value, name: this.control!.name };
    }

    private syncState(changedAttribute?: string): void {
        const label = this.getAttribute("label") || "";
        const hint = this.getAttribute("hint") || "";
        const error = this.getAttribute("error") || "";
        const state = this.getAttribute("state") || "";
        const invalid = this.hasAttribute("invalid") || state === "danger" || Boolean(error);
        const type = this.getAttribute("type") || "text";
        const icon = this.getAttribute("icon") || "";

        this.labelNode!.textContent = label;
        this.labelNode!.hidden = !label;
        this.control!.type = type;
        if ((changedAttribute === undefined || changedAttribute === "value") && type !== "file") {
            this.control!.value = this.getAttribute("value") || "";
        }
        this.control!.name = this.getAttribute("name") || "";
        this.control!.placeholder = this.getAttribute("placeholder") || "";
        this.control!.disabled = this.disabled;
        this.control!.readOnly = this.readOnly;
        this.control!.required = this.required;
        this.iconNode!.hidden = !icon;
        if (icon) {
            this.iconNode!.setAttribute("name", icon);
        }

        copyAttribute(this, this.control!, "autocomplete");
        copyAttribute(this, this.control!, "inputmode");
        copyAttribute(this, this.control!, "min");
        copyAttribute(this, this.control!, "max");
        copyAttribute(this, this.control!, "step");
        copyAttribute(this, this.control!, "minlength");
        copyAttribute(this, this.control!, "maxlength");
        copyAttribute(this, this.control!, "pattern");

        const accessibleLabel = this.getAttribute("aria-label") || label || this.control!.placeholder || "Input";
        if (label) {
            this.control!.removeAttribute("aria-label");
        } else {
            this.control!.setAttribute("aria-label", accessibleLabel);
        }
        this.control!.setAttribute("aria-invalid", String(invalid));
        this.control!.setAttribute("aria-describedby", this.messageNode!.id);

        this.messageNode!.textContent = error || hint;
        this.messageNode!.hidden = !error && !hint;
        this.messageNode!.toggleAttribute("data-error", invalid);
        this.toggleAttribute("data-invalid", invalid);
    }
}

function copyAttribute(source: HTMLElement, target: HTMLElement, name: string): void {
    const value = source.getAttribute(name);
    if (value === null) {
        target.removeAttribute(name);
    } else {
        target.setAttribute(name, value);
    }
}

export function defineSGInput(): void {
    defineElement("sg-input", SGInput);
}
