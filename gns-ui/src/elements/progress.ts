import { clamp, defineElement } from "../internal/element";

let progressId = 0;

export class SGProgress extends HTMLElement {
    static observedAttributes = ["label", "value", "max", "tone", "size", "show-value", "indeterminate", "detail"];

    private initialized = false;
    private control?: HTMLProgressElement;
    private labelNode?: HTMLLabelElement;
    private valueNode?: HTMLOutputElement;
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
        const id = `sg-progress-${++progressId}`;
        const heading = document.createElement("span");
        heading.className = "sg-progress__heading";
        this.labelNode = document.createElement("label");
        this.labelNode.className = "sg-progress__label";
        this.labelNode.htmlFor = id;
        this.valueNode = document.createElement("output");
        this.valueNode.className = "sg-progress__value";
        heading.append(this.labelNode, this.valueNode);
        this.control = document.createElement("progress");
        this.control.className = "sg-progress__control";
        this.control.id = id;
        this.detailNode = document.createElement("span");
        this.detailNode.className = "sg-progress__detail";
        this.replaceChildren(heading, this.control, this.detailNode);
        this.initialized = true;
    }

    private syncState(): void {
        const maximum = positiveNumber(this.getAttribute("max"), 100);
        const value = clamp(numericAttribute(this.getAttribute("value"), 0), 0, maximum);
        const indeterminate = this.hasAttribute("indeterminate") || !this.hasAttribute("value");
        this.labelNode!.textContent = this.getAttribute("label") || "Progress";
        this.control!.max = maximum;
        if (indeterminate) this.control!.removeAttribute("value");
        else this.control!.value = value;
        this.valueNode!.textContent = indeterminate ? "In progress" : `${Math.round((value / maximum) * 100)}%`;
        this.valueNode!.hidden = !this.hasAttribute("show-value");
        const detail = this.getAttribute("detail") || "";
        this.detailNode!.textContent = detail;
        this.detailNode!.hidden = !detail;
        this.toggleAttribute("data-indeterminate", indeterminate);
    }
}

function numericAttribute(value: string | null, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function positiveNumber(value: string | null, fallback: number): number {
    const parsed = numericAttribute(value, fallback);
    return parsed > 0 ? parsed : fallback;
}

export function defineSGProgress(): void {
    defineElement("sg-progress", SGProgress);
}
