import { defineElement, emit } from "../internal/element";
import { restoreFocus } from "../internal/focus";
import type { SGActionSelectDetail } from "./action-list";

export interface SGRadialMenuCloseDetail extends Record<string, unknown> {
    reason: "escape" | "selection";
}

export class SGRadialMenu extends HTMLElement {
    static observedAttributes = ["open", "label", "center-icon", "disabled", "icon-only"];

    private initialized = false;
    private actions: HTMLButtonElement[] = [];
    private center?: HTMLElement;
    private previousFocus?: HTMLElement;
    private wasOpen = false;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.addEventListener("click", this.handleClick);
        this.addEventListener("keydown", this.handleKeyDown);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this.handleClick);
        this.removeEventListener("keydown", this.handleKeyDown);
        restoreFocus(this.previousFocus);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get open(): boolean { return this.hasAttribute("open"); }
    set open(value: boolean) { this.toggleAttribute("open", value); }

    private initialize(): void {
        this.actions = Array.from(this.children).filter(
            (child): child is HTMLButtonElement => child instanceof HTMLButtonElement,
        );
        this.setAttribute("role", "menu");
        this.setAttribute("data-count", String(this.actions.length));
        this.actions.forEach((action, index) => {
            const label = action.getAttribute("aria-label") || action.textContent?.trim() || `Action ${index + 1}`;
            const existingIcon = action.querySelector("sg-icon");
            action.type = "button";
            action.classList.add("sg-radial-menu__item");
            action.setAttribute("role", "menuitem");
            action.setAttribute("aria-label", label);
            action.setAttribute("data-value", action.value || action.dataset.value || `action-${index + 1}`);
            const icon = action.dataset.icon;
            const iconNode = existingIcon || document.createElement("sg-icon");
            iconNode.setAttribute("name", icon || iconNode.getAttribute("name") || "circle");
            iconNode.setAttribute("aria-hidden", "true");

            const labelNode = document.createElement("span");
            labelNode.className = "sg-radial-menu__label";
            labelNode.textContent = label;

            const content = document.createElement("span");
            content.className = "sg-radial-menu__content";
            content.append(iconNode, labelNode);
            action.replaceChildren(content);

            const count = Math.max(1, this.actions.length);
            const angle = -90 + (360 * index) / count;
            const radius = count >= 8 ? 34.5 : 35;
            const radians = angle * Math.PI / 180;
            action.style.clipPath = slicePolygon(index, count);
            action.style.setProperty("--sg-radial-x", `${50 + Math.cos(radians) * radius}%`);
            action.style.setProperty("--sg-radial-y", `${50 + Math.sin(radians) * radius}%`);
        });
        this.center = document.createElement("span");
        this.center.className = "sg-radial-menu__center";
        this.center.setAttribute("aria-hidden", "true");
        this.append(this.center);
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const action = (event.target as Element).closest<HTMLButtonElement>("button.sg-radial-menu__item");
        if (!action || !this.contains(action) || action.disabled || this.hasAttribute("disabled")) return;
        emit<SGActionSelectDetail>(this, "sg-action-select", {
            value: action.getAttribute("data-value") || "",
            label: action.textContent?.trim() || "Action",
        });
        if (!this.hasAttribute("keep-open")) this.requestClose("selection");
    };

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "Escape") {
            event.preventDefault();
            this.requestClose("escape");
            return;
        }
        if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const enabled = this.actions.filter((action) => !action.disabled && !this.hasAttribute("disabled"));
        if (!enabled.length) return;
        event.preventDefault();
        const current = enabled.indexOf(document.activeElement as HTMLButtonElement);
        let next = current < 0 ? 0 : current;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = enabled.length - 1;
        if (["ArrowRight", "ArrowDown"].includes(event.key)) next = current < 0 ? 0 : (current + 1) % enabled.length;
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;
        enabled[next].focus();
    };

    private requestClose(reason: SGRadialMenuCloseDetail["reason"]): void {
        const event = emit<SGRadialMenuCloseDetail>(this, "sg-close", { reason }, { cancelable: true });
        if (!event.defaultPrevented) this.open = false;
    }

    private syncState(): void {
        const disabled = this.hasAttribute("disabled");
        this.setAttribute("aria-label", this.getAttribute("label") || "Quick actions");
        this.setAttribute("aria-hidden", String(!this.open));
        this.center!.innerHTML = `<sg-icon name="${this.getAttribute("center-icon") || "circle"}"></sg-icon>`;
        const firstEnabled = this.actions.find((action) => !action.disabled);
        this.actions.forEach((action) => { action.tabIndex = !disabled && action === firstEnabled ? 0 : -1; });
        if (this.open && !this.wasOpen) {
            this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
            window.setTimeout(() => { if (this.open) firstEnabled?.focus(); }, 0);
        } else if (!this.open && this.wasOpen) {
            restoreFocus(this.previousFocus);
            this.previousFocus = undefined;
        }
        this.wasOpen = this.open;
    }
}

function slicePolygon(index: number, count: number): string {
    const slice = 360 / count;
    const gap = Math.min(2.4, slice * 0.06);
    const start = -90 - slice / 2 + gap / 2 + index * slice;
    const end = start + slice - gap;
    const steps = count <= 4 ? 7 : 5;
    const points: string[] = [];

    for (let step = 0; step <= steps; step += 1) {
        points.push(radialPoint(start + (end - start) * step / steps, 49));
    }
    for (let step = steps; step >= 0; step -= 1) {
        points.push(radialPoint(start + (end - start) * step / steps, 16));
    }
    return `polygon(${points.join(", ")})`;
}

function radialPoint(angle: number, radius: number): string {
    const radians = angle * Math.PI / 180;
    const x = 50 + Math.cos(radians) * radius;
    const y = 50 + Math.sin(radians) * radius;
    return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
}

export function defineSGRadialMenu(): void {
    defineElement("sg-radial-menu", SGRadialMenu);
}
