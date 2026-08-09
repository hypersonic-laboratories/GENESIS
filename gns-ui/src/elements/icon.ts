import { defineElement } from "../internal/element";

const defaultSpriteUrl = new URL("./genesis-icons.svg?rev=35", import.meta.url).toString();

export class SGIcon extends HTMLElement {
    static observedAttributes = ["name", "label", "src"];

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(): void {
        if (this.isConnected) {
            this.render();
        }
    }

    private render(): void {
        const name = this.getAttribute("name") || "circle";
        const label = this.getAttribute("label");
        const spriteUrl = this.getAttribute("src") || defaultSpriteUrl;

        this.replaceChildren();
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", `${spriteUrl}#sg-icon-${name}`);
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("focusable", "false");

        if (label) {
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", label);
        } else {
            svg.setAttribute("aria-hidden", "true");
        }

        svg.append(use);
        this.append(svg);
    }
}

export function defineSGIcon(): void {
    defineElement("sg-icon", SGIcon);
}
