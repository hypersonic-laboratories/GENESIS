import { clamp, defineElement } from "../internal/element";

export class SGStat extends HTMLElement {
    static observedAttributes = ["icon", "label", "value", "detail", "progress", "tone"];

    private initialized = false;
    private iconNode?: HTMLElement;
    private labelNode?: HTMLElement;
    private valueNode?: HTMLElement;
    private detailNode?: HTMLElement;
    private trackNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.syncState();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    private initialize(): void {
        this.iconNode = document.createElement("span");
        this.iconNode.className = "sg-stat__icon";
        this.iconNode.setAttribute("aria-hidden", "true");

        const content = document.createElement("span");
        content.className = "sg-stat__content";
        this.labelNode = document.createElement("span");
        this.labelNode.className = "sg-stat__label";
        this.valueNode = document.createElement("span");
        this.valueNode.className = "sg-stat__value";
        this.detailNode = document.createElement("span");
        this.detailNode.className = "sg-stat__detail";
        content.append(this.labelNode, this.valueNode, this.detailNode);

        this.trackNode = document.createElement("span");
        this.trackNode.className = "sg-stat__track";
        this.trackNode.setAttribute("aria-hidden", "true");
        this.trackNode.append(document.createElement("span"));
        this.replaceChildren(this.iconNode, content, this.trackNode);
        this.initialized = true;
    }

    private syncState(): void {
        const label = this.getAttribute("label") || "Status";
        const value = this.getAttribute("value") || "—";
        const detail = this.getAttribute("detail");
        const icon = this.getAttribute("icon");
        const hasProgress = this.hasAttribute("progress");
        const rawProgress = Number(this.getAttribute("progress") || 0);
        const progress = Number.isFinite(rawProgress) ? clamp(rawProgress) : 0;

        this.setAttribute("role", "group");
        this.setAttribute("aria-label", `${label}: ${value}`);
        this.style.setProperty("--sg-stat-progress", `${progress}%`);
        this.style.setProperty("--sg-stat-progress-ratio", String(progress / 100));

        this.iconNode!.replaceChildren();
        if (icon) {
            const glyph = document.createElement("sg-icon");
            glyph.setAttribute("name", icon);
            this.iconNode!.append(glyph);
        }
        this.labelNode!.textContent = label;
        this.valueNode!.textContent = value;
        this.detailNode!.textContent = detail || "";
        this.detailNode!.hidden = !detail;
        this.trackNode!.hidden = !hasProgress;
        if (hasProgress) {
            this.trackNode!.removeAttribute("aria-hidden");
            this.trackNode!.setAttribute("role", "progressbar");
            this.trackNode!.setAttribute("aria-label", `${label} progress`);
            this.trackNode!.setAttribute("aria-valuemin", "0");
            this.trackNode!.setAttribute("aria-valuemax", "100");
            this.trackNode!.setAttribute("aria-valuenow", String(progress));
        } else {
            this.trackNode!.setAttribute("aria-hidden", "true");
            this.trackNode!.removeAttribute("role");
            this.trackNode!.removeAttribute("aria-label");
            this.trackNode!.removeAttribute("aria-valuemin");
            this.trackNode!.removeAttribute("aria-valuemax");
            this.trackNode!.removeAttribute("aria-valuenow");
        }
    }
}

export function defineSGStat(): void {
    defineElement("sg-stat", SGStat);
}
