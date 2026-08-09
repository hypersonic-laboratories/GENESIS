import { defineElement, emit } from "../internal/element";

export interface SGNumberDetail extends Record<string, unknown> {
    value: number;
    name: string;
}

let stepperId = 0;

export class SGNumberStepper extends HTMLElement {
    static observedAttributes = [
        "label", "value", "min", "max", "step", "name", "unit", "disabled", "readonly", "required",
        "invalid", "state", "hint", "error",
    ];

    private initialized = false;
    private control?: HTMLInputElement;
    private labelNode?: HTMLLabelElement;
    private decrementButton?: HTMLButtonElement;
    private incrementButton?: HTMLButtonElement;
    private unitNode?: HTMLElement;
    private messageNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.control!.addEventListener("input", this.handleInput);
        this.control!.addEventListener("change", this.handleChange);
        this.decrementButton!.addEventListener("click", this.decrement);
        this.incrementButton!.addEventListener("click", this.increment);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("input", this.handleInput);
        this.control?.removeEventListener("change", this.handleChange);
        this.decrementButton?.removeEventListener("click", this.decrement);
        this.incrementButton?.removeEventListener("click", this.increment);
    }

    attributeChangedCallback(name: string): void {
        if (this.isConnected && this.initialized) this.syncState(name);
    }

    get value(): number {
        const liveValue = this.control?.valueAsNumber;
        return liveValue !== undefined && Number.isFinite(liveValue) ? liveValue : numericAttribute(this.getAttribute("value"), 0);
    }
    set value(value: number) { this.setAttribute("value", String(value)); }
    get disabled(): boolean { return this.hasAttribute("disabled"); }
    set disabled(value: boolean) { this.toggleAttribute("disabled", value); }
    focus(options?: FocusOptions): void { this.control?.focus(options); }

    private initialize(): void {
        const id = `sg-number-stepper-${++stepperId}`;
        this.labelNode = document.createElement("label");
        this.labelNode.className = "sg-number-stepper__label";
        this.labelNode.htmlFor = id;
        const frame = document.createElement("span");
        frame.className = "sg-number-stepper__frame";
        this.decrementButton = stepButton("minus", "Decrease value", "sg-number-stepper__decrement");
        this.control = document.createElement("input");
        this.control.className = "sg-number-stepper__control";
        this.control.id = id;
        this.control.type = "number";
        this.unitNode = document.createElement("span");
        this.unitNode.className = "sg-number-stepper__unit";
        this.incrementButton = stepButton("plus", "Increase value", "sg-number-stepper__increment");
        frame.append(this.decrementButton, this.control, this.unitNode, this.incrementButton);
        this.messageNode = document.createElement("span");
        this.messageNode.className = "sg-number-stepper__message";
        this.messageNode.id = `${id}-message`;
        this.replaceChildren(this.labelNode, frame, this.messageNode);
        this.initialized = true;
    }

    private readonly decrement = (): void => this.stepBy(-1);
    private readonly increment = (): void => this.stepBy(1);
    private readonly handleInput = (): void => {
        this.updateButtons();
        emit<SGNumberDetail>(this, "sg-input", this.eventDetail());
    };
    private readonly handleChange = (): void => {
        this.updateButtons();
        emit<SGNumberDetail>(this, "sg-change", this.eventDetail());
    };

    private stepBy(direction: -1 | 1): void {
        if (this.disabled || this.hasAttribute("readonly")) return;
        try {
            if (direction < 0) this.control!.stepDown();
            else this.control!.stepUp();
        } catch {
            return;
        }
        this.updateButtons();
        const detail = this.eventDetail();
        emit<SGNumberDetail>(this, "sg-input", detail);
        emit<SGNumberDetail>(this, "sg-change", detail);
    }

    private eventDetail(): SGNumberDetail {
        const value = this.control!.valueAsNumber;
        return { value: Number.isFinite(value) ? value : numericAttribute(this.control!.value, 0), name: this.control!.name };
    }

    private syncState(changedAttribute?: string): void {
        const label = this.getAttribute("label") || "Value";
        const hint = this.getAttribute("hint") || "";
        const error = this.getAttribute("error") || "";
        const invalid = this.hasAttribute("invalid") || this.getAttribute("state") === "danger" || Boolean(error);
        this.labelNode!.textContent = label;
        this.control!.min = attributeOrEmpty(this, "min");
        this.control!.max = attributeOrEmpty(this, "max");
        this.control!.step = this.getAttribute("step") || "1";
        if (changedAttribute === undefined || changedAttribute === "value") this.control!.value = this.getAttribute("value") || "0";
        this.control!.name = this.getAttribute("name") || "";
        this.control!.disabled = this.disabled;
        this.control!.readOnly = this.hasAttribute("readonly");
        this.control!.required = this.hasAttribute("required");
        this.control!.setAttribute("aria-invalid", String(invalid));
        this.control!.setAttribute("aria-describedby", this.messageNode!.id);
        this.unitNode!.textContent = this.getAttribute("unit") || "";
        this.unitNode!.hidden = !this.getAttribute("unit");
        this.messageNode!.textContent = error || hint;
        this.messageNode!.hidden = !error && !hint;
        this.messageNode!.toggleAttribute("data-error", invalid);
        this.toggleAttribute("data-invalid", invalid);
        this.updateButtons();
    }

    private updateButtons(): void {
        const unavailable = this.disabled || this.hasAttribute("readonly");
        const value = this.control!.valueAsNumber;
        const minimum = this.control!.min === "" ? Number.NEGATIVE_INFINITY : Number(this.control!.min);
        const maximum = this.control!.max === "" ? Number.POSITIVE_INFINITY : Number(this.control!.max);
        this.decrementButton!.disabled = unavailable || Number.isFinite(value) && value <= minimum;
        this.incrementButton!.disabled = unavailable || Number.isFinite(value) && value >= maximum;
        const label = this.getAttribute("label") || "value";
        this.decrementButton!.setAttribute("aria-label", `Decrease ${label}`);
        this.incrementButton!.setAttribute("aria-label", `Increase ${label}`);
    }
}

function stepButton(icon: string, label: string, className: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = className;
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.innerHTML = `<sg-icon name="${icon}" aria-hidden="true"></sg-icon>`;
    return button;
}

function attributeOrEmpty(element: HTMLElement, name: string): string {
    return element.getAttribute(name) || "";
}

function numericAttribute(value: string | null, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function defineSGNumberStepper(): void {
    defineElement("sg-number-stepper", SGNumberStepper);
}
