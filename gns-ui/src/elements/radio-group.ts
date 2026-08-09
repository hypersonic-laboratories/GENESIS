import { defineElement, emit } from "../internal/element";

export interface SGRadioChangeDetail extends Record<string, unknown> {
    value: string;
    name: string;
}

interface RadioOption {
    value: string;
    label: string;
    disabled: boolean;
}

let radioGroupId = 0;

export class SGRadioGroup extends HTMLElement {
    static observedAttributes = ["label", "value", "name", "required", "disabled", "orientation", "hint", "error", "invalid", "state"];

    private initialized = false;
    private fieldset?: HTMLFieldSetElement;
    private legendNode?: HTMLLegendElement;
    private choicesNode?: HTMLElement;
    private messageNode?: HTMLElement;
    private controls: HTMLInputElement[] = [];
    private generatedName = "";

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.choicesNode!.addEventListener("change", this.handleChange);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.choicesNode?.removeEventListener("change", this.handleChange);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get value(): string { return this.controls.find((control) => control.checked)?.value || this.getAttribute("value") || ""; }
    set value(value: string) { this.setAttribute("value", value); }
    get disabled(): boolean { return this.hasAttribute("disabled"); }
    set disabled(value: boolean) { this.toggleAttribute("disabled", value); }

    private initialize(): void {
        const instance = ++radioGroupId;
        this.generatedName = `sg-radio-group-${instance}`;
        const options = Array.from(this.querySelectorAll<HTMLElement>(":scope > [data-sg-option]")).map((option, index): RadioOption => ({
            value: option.getAttribute("value") || `option-${index + 1}`,
            label: option.textContent?.trim() || `Option ${index + 1}`,
            disabled: option.hasAttribute("disabled"),
        }));
        this.fieldset = document.createElement("fieldset");
        this.fieldset.className = "sg-radio-group__fieldset";
        this.legendNode = document.createElement("legend");
        this.legendNode.className = "sg-radio-group__legend";
        this.choicesNode = document.createElement("div");
        this.choicesNode.className = "sg-radio-group__choices";

        options.forEach((option, index) => {
            const wrapper = document.createElement("label");
            wrapper.className = "sg-radio-group__option";
            const control = document.createElement("input");
            control.className = "sg-radio-group__control";
            control.type = "radio";
            control.id = `sg-radio-${instance}-${index + 1}`;
            control.value = option.value;
            control.dataset.optionDisabled = String(option.disabled);
            const marker = document.createElement("span");
            marker.className = "sg-radio-group__marker";
            marker.setAttribute("aria-hidden", "true");
            const text = document.createElement("span");
            text.className = "sg-radio-group__label";
            text.textContent = option.label;
            wrapper.htmlFor = control.id;
            wrapper.append(control, marker, text);
            this.controls.push(control);
            this.choicesNode!.append(wrapper);
        });

        this.messageNode = document.createElement("span");
        this.messageNode.className = "sg-radio-group__message";
        this.messageNode.id = `sg-radio-${instance}-message`;
        this.fieldset.append(this.legendNode, this.choicesNode, this.messageNode);
        this.replaceChildren(this.fieldset);
        this.initialized = true;
    }

    private readonly handleChange = (event: Event): void => {
        const control = event.target as HTMLInputElement;
        if (!control.checked) return;
        this.setAttribute("value", control.value);
        emit<SGRadioChangeDetail>(this, "sg-change", { value: control.value, name: control.name });
    };

    private syncState(): void {
        const hint = this.getAttribute("hint") || "";
        const error = this.getAttribute("error") || "";
        const invalid = this.hasAttribute("invalid") || this.getAttribute("state") === "danger" || Boolean(error);
        const requested = this.getAttribute("value") || "";
        const name = this.getAttribute("name") || this.generatedName;
        this.legendNode!.textContent = this.getAttribute("label") || "Options";
        this.fieldset!.disabled = this.disabled;
        this.controls.forEach((control) => {
            control.name = name;
            control.required = this.hasAttribute("required");
            control.disabled = this.disabled || control.dataset.optionDisabled === "true";
            control.checked = control.value === requested;
            control.setAttribute("aria-describedby", this.messageNode!.id);
            control.setAttribute("aria-invalid", String(invalid));
        });
        this.messageNode!.textContent = error || hint;
        this.messageNode!.hidden = !error && !hint;
        this.messageNode!.toggleAttribute("data-error", invalid);
        this.toggleAttribute("data-invalid", invalid);
    }
}

export function defineSGRadioGroup(): void {
    defineElement("sg-radio-group", SGRadioGroup);
}
