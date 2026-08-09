import { defineElement, emit } from "../internal/element";

export interface SGTextareaDetail extends Record<string, unknown> {
    value: string;
    name: string;
}

let textareaId = 0;

export class SGTextarea extends HTMLElement {
    static observedAttributes = [
        "label", "value", "name", "placeholder", "rows", "minlength", "maxlength", "required",
        "readonly", "disabled", "invalid", "state", "hint", "error", "show-count",
    ];

    private initialized = false;
    private control?: HTMLTextAreaElement;
    private labelNode?: HTMLLabelElement;
    private countNode?: HTMLOutputElement;
    private messageNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.control!.addEventListener("input", this.handleInput);
        this.control!.addEventListener("change", this.handleChange);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("input", this.handleInput);
        this.control?.removeEventListener("change", this.handleChange);
    }

    attributeChangedCallback(name: string): void {
        if (this.isConnected && this.initialized) this.syncState(name);
    }

    get value(): string { return this.control?.value ?? this.getAttribute("value") ?? ""; }
    set value(value: string) { this.setAttribute("value", value); }
    get disabled(): boolean { return this.hasAttribute("disabled"); }
    set disabled(value: boolean) { this.toggleAttribute("disabled", value); }
    focus(options?: FocusOptions): void { this.control?.focus(options); }
    select(): void { this.control?.select(); }

    private initialize(): void {
        const id = `sg-textarea-${++textareaId}`;
        const heading = document.createElement("span");
        heading.className = "sg-textarea__heading";
        this.labelNode = document.createElement("label");
        this.labelNode.className = "sg-textarea__label";
        this.labelNode.htmlFor = id;
        this.countNode = document.createElement("output");
        this.countNode.className = "sg-textarea__count";
        heading.append(this.labelNode, this.countNode);
        this.control = document.createElement("textarea");
        this.control.className = "sg-textarea__control";
        this.control.id = id;
        this.messageNode = document.createElement("span");
        this.messageNode.className = "sg-textarea__message";
        this.messageNode.id = `${id}-message`;
        this.replaceChildren(heading, this.control, this.messageNode);
        this.initialized = true;
    }

    private readonly handleInput = (): void => {
        this.syncCount();
        emit<SGTextareaDetail>(this, "sg-input", this.eventDetail());
    };
    private readonly handleChange = (): void => {
        emit<SGTextareaDetail>(this, "sg-change", this.eventDetail());
    };
    private eventDetail(): SGTextareaDetail { return { value: this.control!.value, name: this.control!.name }; }

    private syncState(changedAttribute?: string): void {
        const label = this.getAttribute("label") || "";
        const hint = this.getAttribute("hint") || "";
        const error = this.getAttribute("error") || "";
        const invalid = this.hasAttribute("invalid") || this.getAttribute("state") === "danger" || Boolean(error);
        this.labelNode!.textContent = label;
        this.labelNode!.hidden = !label;
        if (changedAttribute === undefined || changedAttribute === "value") this.control!.value = this.getAttribute("value") || "";
        this.control!.name = this.getAttribute("name") || "";
        this.control!.placeholder = this.getAttribute("placeholder") || "";
        if (label) this.control!.removeAttribute("aria-label");
        else this.control!.setAttribute("aria-label", this.getAttribute("placeholder") || "Text area");
        this.control!.rows = positiveInteger(this.getAttribute("rows"), 4);
        syncLengthAttribute(this.control!, "minlength", this.getAttribute("minlength"));
        syncLengthAttribute(this.control!, "maxlength", this.getAttribute("maxlength"));
        this.control!.required = this.hasAttribute("required");
        this.control!.readOnly = this.hasAttribute("readonly");
        this.control!.disabled = this.disabled;
        this.control!.setAttribute("aria-invalid", String(invalid));
        this.control!.setAttribute("aria-describedby", this.messageNode!.id);
        this.messageNode!.textContent = error || hint;
        this.messageNode!.hidden = !error && !hint;
        this.messageNode!.toggleAttribute("data-error", invalid);
        this.toggleAttribute("data-invalid", invalid);
        this.countNode!.hidden = !this.hasAttribute("show-count");
        this.syncCount();
    }

    private syncCount(): void {
        const maximum = this.control!.maxLength;
        this.countNode!.textContent = maximum > 0 ? `${this.control!.value.length} / ${maximum}` : String(this.control!.value.length);
    }
}

function integerAttribute(value: string | null, fallback: number): number {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function positiveInteger(value: string | null, fallback: number): number {
    const parsed = integerAttribute(value, fallback);
    return parsed > 0 ? parsed : fallback;
}

function syncLengthAttribute(control: HTMLTextAreaElement, name: "minlength" | "maxlength", value: string | null): void {
    const parsed = integerAttribute(value, -1);
    if (parsed >= 0) control.setAttribute(name, String(parsed));
    else control.removeAttribute(name);
}

export function defineSGTextarea(): void {
    defineElement("sg-textarea", SGTextarea);
}
