import { defineElement, emit } from "../internal/element";
import { focusFirst, restoreFocus } from "../internal/focus";
import type { SGActionSelectDetail } from "./action-list";

export interface SGContextMenuCloseDetail extends Record<string, unknown> {
    reason: "escape" | "outside" | "selection";
}

let contextMenuId = 0;

export class SGContextMenu extends HTMLElement {
    static observedAttributes = ["open", "label", "x", "y", "disabled"];

    private initialized = false;
    private surface?: HTMLElement;
    private actions: HTMLButtonElement[] = [];
    private previousFocus?: HTMLElement;
    private wasOpen = false;

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.surface!.addEventListener("click", this.handleClick);
        this.surface!.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("resize", this.positionSurface);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.surface?.removeEventListener("click", this.handleClick);
        this.surface?.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("resize", this.positionSurface);
        document.removeEventListener("pointerdown", this.handleOutsidePointer, true);
        restoreFocus(this.previousFocus);
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    get open(): boolean { return this.hasAttribute("open"); }
    set open(value: boolean) { this.toggleAttribute("open", value); }

    private initialize(): void {
        const content = Array.from(this.childNodes);
        this.surface = document.createElement("div");
        this.surface.className = "sg-context-menu__surface";
        this.surface.id = `sg-context-menu-${++contextMenuId}`;
        this.surface.setAttribute("role", "menu");
        this.surface.tabIndex = -1;
        this.surface.append(...content);
        this.append(this.surface);
        this.actions = Array.from(this.surface.children).filter(
            (child): child is HTMLButtonElement => child instanceof HTMLButtonElement,
        );
        this.actions.forEach((action, index) => {
            action.type = "button";
            action.classList.add("sg-context-menu__item");
            action.setAttribute("role", "menuitem");
            action.setAttribute("data-value", action.value || action.dataset.value || `action-${index + 1}`);
            const icon = action.dataset.icon;
            if (icon && !action.querySelector("sg-icon")) {
                action.insertAdjacentHTML("afterbegin", `<sg-icon name="${icon}" aria-hidden="true"></sg-icon>`);
            }
        });
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const action = (event.target as Element).closest<HTMLButtonElement>("button.sg-context-menu__item");
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
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        const enabled = this.actions.filter((action) => !action.disabled && !this.hasAttribute("disabled"));
        if (!enabled.length) return;
        event.preventDefault();
        const current = enabled.indexOf(document.activeElement as HTMLButtonElement);
        let next = current < 0 ? 0 : current;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = enabled.length - 1;
        if (event.key === "ArrowDown") next = current < 0 ? 0 : (current + 1) % enabled.length;
        if (event.key === "ArrowUp") next = current < 0 ? enabled.length - 1 : (current - 1 + enabled.length) % enabled.length;
        enabled[next].focus();
    };

    private readonly handleOutsidePointer = (event: PointerEvent): void => {
        if (event.target instanceof Node && !this.contains(event.target)) this.requestClose("outside");
    };

    private readonly positionSurface = (): void => {
        if (!this.open || !this.surface) return;
        const requestedX = Number(this.getAttribute("x") || "0");
        const requestedY = Number(this.getAttribute("y") || "0");
        const bounds = this.surface.getBoundingClientRect();
        const gutter = 8;
        const x = Math.min(Math.max(gutter, requestedX), Math.max(gutter, window.innerWidth - bounds.width - gutter));
        const y = Math.min(Math.max(gutter, requestedY), Math.max(gutter, window.innerHeight - bounds.height - gutter));
        this.style.setProperty("--sg-context-menu-x", `${x}px`);
        this.style.setProperty("--sg-context-menu-y", `${y}px`);
    };

    private requestClose(reason: SGContextMenuCloseDetail["reason"]): void {
        const event = emit<SGContextMenuCloseDetail>(this, "sg-close", { reason }, { cancelable: true });
        if (!event.defaultPrevented) this.open = false;
    }

    private syncState(): void {
        this.surface!.setAttribute("aria-label", this.getAttribute("label") || "Context actions");
        this.setAttribute("aria-hidden", String(!this.open));
        const disabled = this.hasAttribute("disabled");
        const firstEnabled = this.actions.find((action) => !action.disabled);
        this.actions.forEach((action) => { action.tabIndex = !disabled && action === firstEnabled ? 0 : -1; });
        if (this.open && !this.wasOpen) {
            this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
            document.addEventListener("pointerdown", this.handleOutsidePointer, true);
            window.requestAnimationFrame(() => {
                this.positionSurface();
                if (this.open) focusFirst(this.surface!);
            });
        } else if (!this.open && this.wasOpen) {
            document.removeEventListener("pointerdown", this.handleOutsidePointer, true);
            restoreFocus(this.previousFocus);
            this.previousFocus = undefined;
        } else if (this.open) {
            window.requestAnimationFrame(this.positionSurface);
        }
        this.wasOpen = this.open;
    }
}

export function defineSGContextMenu(): void {
    defineElement("sg-context-menu", SGContextMenu);
}
