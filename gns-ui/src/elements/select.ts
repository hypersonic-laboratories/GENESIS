import { defineElement, emit } from "../internal/element";

export interface SGSelectDetail extends Record<string, unknown> {
    value: string;
    values: string[];
    name: string;
}

let selectId = 0;

export class SGSelect extends HTMLElement {
    static observedAttributes = [
        "label", "value", "name", "placeholder", "required", "disabled", "invalid", "state",
        "multiple", "size", "hint", "error",
    ];

    private initialized = false;
    private control?: HTMLSelectElement;
    private labelNode?: HTMLLabelElement;
    private messageNode?: HTMLElement;
    private placeholderOption?: HTMLOptionElement;
    private optionObserver?: MutationObserver;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.control!.addEventListener("input", this.handleInput);
        this.control!.addEventListener("change", this.handleChange);
        this.observeOptions();
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("input", this.handleInput);
        this.control?.removeEventListener("change", this.handleChange);
        this.optionObserver?.disconnect();
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

    get values(): string[] {
        return this.control ? Array.from(this.control.selectedOptions, (option) => option.value) : [];
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
        const id = `sg-select-${++selectId}`;
        const options = Array.from(this.children).filter(
            (child): child is HTMLOptionElement | HTMLOptGroupElement => child instanceof HTMLOptionElement || child instanceof HTMLOptGroupElement,
        );

        this.labelNode = document.createElement("label");
        this.labelNode.className = "sg-select__label";
        this.labelNode.htmlFor = id;

        const frame = document.createElement("span");
        frame.className = "sg-select__frame";
        this.control = document.createElement("select");
        this.control.className = "sg-select__control";
        this.control.id = id;
        this.control.append(...options);

        const indicator = document.createElement("sg-icon");
        indicator.className = "sg-select__indicator";
        indicator.setAttribute("name", "chevron-down");
        indicator.setAttribute("aria-hidden", "true");
        frame.append(this.control, indicator);

        this.messageNode = document.createElement("span");
        this.messageNode.className = "sg-select__message";
        this.messageNode.id = `${id}-message`;

        this.append(this.labelNode, frame, this.messageNode);
        this.initialized = true;
    }

    private observeOptions(): void {
        if (!this.optionObserver) {
            this.optionObserver = new MutationObserver((records) => {
                for (const record of records) {
                    for (const node of Array.from(record.addedNodes)) {
                        if (node instanceof HTMLOptionElement || node instanceof HTMLOptGroupElement) {
                            this.control!.append(node);
                        }
                    }
                }
                this.applyValue();
            });
        }
        this.optionObserver.observe(this, { childList: true });
    }

    private readonly handleInput = (): void => {
        emit<SGSelectDetail>(this, "sg-input", this.eventDetail());
    };

    private readonly handleChange = (): void => {
        emit<SGSelectDetail>(this, "sg-change", this.eventDetail());
    };

    private eventDetail(): SGSelectDetail {
        return { value: this.control!.value, values: this.values, name: this.control!.name };
    }

    private syncState(changedAttribute?: string): void {
        const label = this.getAttribute("label") || "";
        const hint = this.getAttribute("hint") || "";
        const error = this.getAttribute("error") || "";
        const state = this.getAttribute("state") || "";
        const invalid = this.hasAttribute("invalid") || state === "danger" || Boolean(error);
        const placeholder = this.getAttribute("placeholder") || "";

        this.labelNode!.textContent = label;
        this.labelNode!.hidden = !label;
        this.control!.name = this.getAttribute("name") || "";
        this.control!.disabled = this.disabled;
        this.control!.required = this.hasAttribute("required");
        this.control!.multiple = this.hasAttribute("multiple");
        this.control!.size = positiveInteger(this.getAttribute("size"));

        if (placeholder) {
            if (!this.placeholderOption) {
                this.placeholderOption = document.createElement("option");
                this.placeholderOption.value = "";
                this.placeholderOption.disabled = this.control!.required;
                this.control!.prepend(this.placeholderOption);
            }
            this.placeholderOption.textContent = placeholder;
            this.placeholderOption.hidden = this.control!.multiple;
            this.placeholderOption.disabled = this.control!.required;
        } else {
            this.placeholderOption?.remove();
            this.placeholderOption = undefined;
        }

        if (changedAttribute === undefined || changedAttribute === "value" || changedAttribute === "placeholder" || changedAttribute === "multiple") {
            this.applyValue();
        }
        const accessibleLabel = this.getAttribute("aria-label") || label || placeholder || "Select an option";
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

    private applyValue(): void {
        if (!this.control) {
            return;
        }
        const value = this.getAttribute("value");
        if (value !== null) {
            this.control.value = value;
        } else if (this.placeholderOption && !this.control.multiple) {
            this.control.value = "";
        }
    }
}

function positiveInteger(value: string | null): number {
    const parsed = Number.parseInt(value || "0", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function defineSGSelect(): void {
    defineElement("sg-select", SGSelect);
}
