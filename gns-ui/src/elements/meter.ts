import { clamp, defineElement } from "../internal/element";

let meterId = 0;

export class SGMeter extends HTMLElement {
    static observedAttributes = ["label", "value", "min", "max", "low", "high", "optimum", "unit", "tone", "size", "detail"];

    private initialized = false;
    private control?: HTMLMeterElement;
    private labelNode?: HTMLLabelElement;
    private valueNode?: HTMLElement;
    private detailNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.syncState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get value(): number { return numericAttribute(this.getAttribute("value"), 0); }
    set value(value: number) { this.setAttribute("value", String(value)); }

    private initialize(): void {
        const id = `sg-meter-${++meterId}`;
        this.control = document.createElement("meter");
        this.control.className = "sg-meter__control";
        this.control.id = id;
        const visual = document.createElement("span");
        visual.className = "sg-meter__visual";
        visual.setAttribute("aria-hidden", "true");
        visual.innerHTML = '<svg viewBox="0 0 44 44"><circle class="sg-meter__track" cx="22" cy="22" r="18" pathLength="100"></circle><circle class="sg-meter__fill" cx="22" cy="22" r="18" pathLength="100"></circle></svg>';
        this.valueNode = document.createElement("strong");
        this.valueNode.className = "sg-meter__value";
        visual.append(this.valueNode);
        const copy = document.createElement("span");
        copy.className = "sg-meter__copy";
        this.labelNode = document.createElement("label");
        this.labelNode.className = "sg-meter__label";
        this.labelNode.htmlFor = id;
        this.detailNode = document.createElement("span");
        this.detailNode.className = "sg-meter__detail";
        copy.append(this.labelNode, this.detailNode);
        this.replaceChildren(this.control, visual, copy);
        this.initialized = true;
    }

    private syncState(): void {
        const minimum = numericAttribute(this.getAttribute("min"), 0);
        const maximum = Math.max(minimum + 1, numericAttribute(this.getAttribute("max"), 100));
        const value = clamp(numericAttribute(this.getAttribute("value"), minimum), minimum, maximum);
        const ratio = ((value - minimum) / (maximum - minimum)) * 100;
        this.control!.min = minimum;
        this.control!.max = maximum;
        this.control!.value = value;
        syncOptionalNumber(this.control!, "low", this.getAttribute("low"));
        syncOptionalNumber(this.control!, "high", this.getAttribute("high"));
        syncOptionalNumber(this.control!, "optimum", this.getAttribute("optimum"));
        this.style.setProperty("--sg-meter-progress", String(ratio));
        this.labelNode!.textContent = this.getAttribute("label") || "Meter";
        this.valueNode!.textContent = `${formatNumber(value)}${this.getAttribute("unit") || ""}`;
        this.detailNode!.textContent = this.getAttribute("detail") || `${formatNumber(value)} of ${formatNumber(maximum)}`;
    }
}

function numericAttribute(value: string | null, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function syncOptionalNumber(control: HTMLMeterElement, name: "low" | "high" | "optimum", value: string | null): void {
    if (value === null || !Number.isFinite(Number(value))) control.removeAttribute(name);
    else control.setAttribute(name, value);
}

function formatNumber(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function defineSGMeter(): void {
    defineElement("sg-meter", SGMeter);
}
