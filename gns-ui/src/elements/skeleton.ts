import { defineElement } from "../internal/element";

export class SGSkeleton extends HTMLElement {
    static observedAttributes = ["shape", "width", "height", "lines", "label", "animated"];

    private initialized = false;

    connectedCallback(): void {
        this.initialized = true;
        this.render();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.render();
    }

    private render(): void {
        const shape = this.getAttribute("shape") || "text";
        const lines = boundedInteger(this.getAttribute("lines"), 1, 6, 1);
        this.style.width = safeLength(this.getAttribute("width"));
        this.style.height = safeLength(this.getAttribute("height"));
        const fragments = shape === "text" ? Array.from({ length: lines }, (_, index) => {
            const line = document.createElement("span");
            line.className = "sg-skeleton__line";
            if (index === lines - 1 && lines > 1) line.style.width = "68%";
            return line;
        }) : [document.createElement("span")];
        if (shape !== "text") fragments[0].className = "sg-skeleton__shape";
        this.replaceChildren(...fragments);
        const label = this.getAttribute("label") || "";
        if (label) {
            this.setAttribute("role", "status");
            this.setAttribute("aria-label", label);
            this.removeAttribute("aria-hidden");
        } else {
            this.removeAttribute("role");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-hidden", "true");
        }
    }
}

function boundedInteger(value: string | null, minimum: number, maximum: number, fallback: number): number {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function safeLength(value: string | null): string {
    if (!value) return "";
    return /^\d+(?:\.\d+)?(?:px|%|rem|em)$/.test(value) ? value : "";
}

export function defineSGSkeleton(): void {
    defineElement("sg-skeleton", SGSkeleton);
}
