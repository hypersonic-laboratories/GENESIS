import { defineElement, emit } from "../internal/element";

export interface SGSliderDetail extends Record<string, unknown> {
    value: number;
    name: string;
}

let sliderId = 0;

export class SGSlider extends HTMLElement {
    static observedAttributes = ["label", "value", "min", "max", "step", "name", "disabled", "show-value", "unit", "hint"];

    private initialized = false;
    private control?: HTMLInputElement;
    private labelNode?: HTMLLabelElement;
    private valueNode?: HTMLOutputElement;
    private hintNode?: HTMLElement;

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

    get value(): number {
        return this.control?.valueAsNumber ?? numericAttribute(this, "value", 50);
    }

    set value(value: number) {
        this.setAttribute("value", String(value));
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
        const id = `sg-slider-${++sliderId}`;
        const heading = document.createElement("span");
        heading.className = "sg-slider__heading";

        this.labelNode = document.createElement("label");
        this.labelNode.className = "sg-slider__label";
        this.labelNode.htmlFor = id;
        this.valueNode = document.createElement("output");
        this.valueNode.className = "sg-slider__value";
        this.valueNode.htmlFor = id;
        heading.append(this.labelNode, this.valueNode);

        const frame = document.createElement("span");
        frame.className = "sg-slider__frame";
        this.control = document.createElement("input");
        this.control.className = "sg-slider__control";
        this.control.id = id;
        this.control.type = "range";
        frame.append(this.control);

        this.hintNode = document.createElement("span");
        this.hintNode.className = "sg-slider__hint";
        this.hintNode.id = `${id}-hint`;

        this.replaceChildren(heading, frame, this.hintNode);
        this.initialized = true;
    }

    private readonly handleInput = (): void => {
        this.syncVisualValue();
        emit<SGSliderDetail>(this, "sg-input", this.eventDetail());
    };

    private readonly handleChange = (): void => {
        this.syncVisualValue();
        emit<SGSliderDetail>(this, "sg-change", this.eventDetail());
    };

    private eventDetail(): SGSliderDetail {
        return { value: this.control!.valueAsNumber, name: this.control!.name };
    }

    private syncState(changedAttribute?: string): void {
        const label = this.getAttribute("label") || "Value";
        const hint = this.getAttribute("hint") || "";
        const min = numericAttribute(this, "min", 0);
        const max = Math.max(min, numericAttribute(this, "max", 100));
        const step = positiveNumberAttribute(this, "step", 1);

        this.labelNode!.textContent = label;
        this.control!.min = String(min);
        this.control!.max = String(max);
        this.control!.step = String(step);
        this.control!.name = this.getAttribute("name") || "";
        this.control!.disabled = this.disabled;
        if ((changedAttribute === undefined || changedAttribute === "value") && this.hasAttribute("value")) {
            this.control!.value = this.getAttribute("value")!;
        }
        this.control!.setAttribute("aria-describedby", this.hintNode!.id);

        this.hintNode!.textContent = hint;
        this.hintNode!.hidden = !hint;
        this.valueNode!.hidden = !this.hasAttribute("show-value");
        this.syncVisualValue();
    }

    private syncVisualValue(): void {
        const value = this.control!.valueAsNumber;
        const min = this.control!.min === "" ? 0 : Number(this.control!.min);
        const max = this.control!.max === "" ? 100 : Number(this.control!.max);
        const ratio = max > min ? (value - min) / (max - min) : 0;
        const unit = this.getAttribute("unit") || "";
        const formattedValue = `${value}${unit}`;

        this.valueNode!.value = formattedValue;
        this.valueNode!.textContent = formattedValue;
        this.control!.setAttribute("aria-valuetext", formattedValue);
        this.style.setProperty("--sg-slider-ratio", String(Math.min(1, Math.max(0, ratio))));
        this.style.setProperty("--sg-slider-percent", `${Math.min(100, Math.max(0, ratio * 100))}%`);
    }
}

function numericAttribute(element: HTMLElement, name: string, fallback: number): number {
    const attribute = element.getAttribute(name);
    if (attribute === null || attribute.trim() === "") {
        return fallback;
    }
    const value = Number(attribute);
    return Number.isFinite(value) ? value : fallback;
}

function positiveNumberAttribute(element: HTMLElement, name: string, fallback: number): number {
    const value = numericAttribute(element, name, fallback);
    return value > 0 ? value : fallback;
}

export function defineSGSlider(): void {
    defineElement("sg-slider", SGSlider);
}
