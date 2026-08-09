import { defineElement } from "../internal/element";

export class SGAvatar extends HTMLElement {
    static observedAttributes = ["src", "alt", "initials", "size", "shape", "status"];

    private initialized = false;
    private image?: HTMLImageElement;
    private fallback?: HTMLElement;
    private statusNode?: HTMLElement;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.image!.addEventListener("load", this.handleImageLoad);
        this.image!.addEventListener("error", this.handleImageError);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.image?.removeEventListener("load", this.handleImageLoad);
        this.image?.removeEventListener("error", this.handleImageError);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    private initialize(): void {
        this.image = document.createElement("img");
        this.image.className = "sg-avatar__image";
        this.image.decoding = "async";
        this.fallback = document.createElement("span");
        this.fallback.className = "sg-avatar__fallback";
        this.statusNode = document.createElement("span");
        this.statusNode.className = "sg-avatar__status";
        this.statusNode.setAttribute("aria-hidden", "true");
        this.replaceChildren(this.image, this.fallback, this.statusNode);
        this.initialized = true;
    }

    private readonly handleImageLoad = (): void => {
        this.toggleAttribute("data-image-ready", true);
    };
    private readonly handleImageError = (): void => {
        this.toggleAttribute("data-image-ready", false);
    };

    private syncState(): void {
        const source = this.getAttribute("src") || "";
        const label = this.getAttribute("alt") || this.getAttribute("initials") || "Player avatar";
        if (this.image!.src !== source) {
            this.toggleAttribute("data-image-ready", false);
            if (source) this.image!.src = source;
            else this.image!.removeAttribute("src");
        }
        this.image!.alt = label;
        this.fallback!.textContent = normalizedInitials(this.getAttribute("initials") || label);
        this.setAttribute("aria-label", label);
        const status = this.getAttribute("status") || "";
        this.statusNode!.hidden = !status;
        if (status) this.statusNode!.setAttribute("title", status);
    }
}

function normalizedInitials(value: string): string {
    const words = value.trim().split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join("") || "?";
}

export function defineSGAvatar(): void {
    defineElement("sg-avatar", SGAvatar);
}
