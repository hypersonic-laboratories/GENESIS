import { defineElement, emit } from "../internal/element";

export interface SGConfirmDetail extends Record<string, unknown> {
    source: "keyboard" | "pointer";
    value: string;
    duration: number;
}

let confirmProgressId = 0;

export class SGConfirmProgress extends HTMLElement {
    static observedAttributes = ["key", "label", "hint", "duration", "value", "disabled", "tone"];

    private initialized = false;
    private control?: HTMLButtonElement;
    private keyNode?: HTMLElement;
    private labelNode?: HTMLElement;
    private hintNode?: HTMLElement;
    private progressNode?: HTMLProgressElement;
    private frame = 0;
    private startedAt = 0;
    private activeSource?: SGConfirmDetail["source"];

    connectedCallback(): void {
        if (!this.initialized) this.initialize();
        this.control!.addEventListener("pointerdown", this.handlePointerDown);
        this.control!.addEventListener("pointerleave", this.cancelHold);
        this.control!.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("pointerup", this.cancelHold);
        window.addEventListener("pointercancel", this.cancelHold);
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("blur", this.cancelHold);
        this.syncState();
    }

    disconnectedCallback(): void {
        this.control?.removeEventListener("pointerdown", this.handlePointerDown);
        this.control?.removeEventListener("pointerleave", this.cancelHold);
        this.control?.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("pointerup", this.cancelHold);
        window.removeEventListener("pointercancel", this.cancelHold);
        window.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("blur", this.cancelHold);
        this.cancelHold();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) this.syncState();
    }

    private initialize(): void {
        const id = `sg-confirm-progress-${++confirmProgressId}`;
        this.control = document.createElement("button");
        this.control.className = "sg-confirm-progress__control";
        this.control.type = "button";

        this.keyNode = document.createElement("kbd");
        this.keyNode.className = "sg-confirm-progress__key";
        const copy = document.createElement("span");
        copy.className = "sg-confirm-progress__copy";
        this.labelNode = document.createElement("strong");
        this.labelNode.className = "sg-confirm-progress__label";
        this.hintNode = document.createElement("span");
        this.hintNode.className = "sg-confirm-progress__hint";
        this.hintNode.id = `${id}-hint`;
        copy.append(this.labelNode, this.hintNode);
        this.progressNode = document.createElement("progress");
        this.progressNode.className = "sg-confirm-progress__meter";
        this.progressNode.max = 100;
        this.progressNode.value = 0;
        this.progressNode.setAttribute("aria-hidden", "true");
        this.control.setAttribute("aria-describedby", this.hintNode.id);
        this.control.append(this.keyNode, copy, this.progressNode);
        this.replaceChildren(this.control);
        this.initialized = true;
    }

    private readonly handlePointerDown = (event: PointerEvent): void => {
        if (event.button !== 0 || this.hasAttribute("disabled")) return;
        this.startHold("pointer");
    };

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        if (![" ", "Enter"].includes(event.key) || event.repeat || this.hasAttribute("disabled")) return;
        event.preventDefault();
        this.startHold("keyboard");
    };

    private readonly handleKeyUp = (event: KeyboardEvent): void => {
        if (this.activeSource === "keyboard" && [" ", "Enter"].includes(event.key)) this.cancelHold();
    };

    private startHold(source: SGConfirmDetail["source"]): void {
        if (this.activeSource) return;
        this.activeSource = source;
        this.startedAt = performance.now();
        this.setAttribute("data-holding", "");
        this.control!.setAttribute("aria-pressed", "true");
        this.frame = window.requestAnimationFrame(this.updateHold);
    }

    private readonly updateHold = (time: number): void => {
        if (!this.activeSource) return;
        const duration = this.duration;
        const progress = Math.min(1, (time - this.startedAt) / duration);
        const percent = Math.round(progress * 100);
        this.progressNode!.value = percent;
        this.style.setProperty("--sg-confirm-progress", `${percent}%`);
        this.control!.setAttribute("aria-label", `${this.label}, ${percent}% complete`);
        if (progress >= 1) {
            const source = this.activeSource;
            this.cancelHold();
            emit<SGConfirmDetail>(this, "sg-confirm", {
                source,
                value: this.getAttribute("value") || "",
                duration,
            });
            return;
        }
        this.frame = window.requestAnimationFrame(this.updateHold);
    };

    private readonly cancelHold = (): void => {
        window.cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.startedAt = 0;
        this.activeSource = undefined;
        this.removeAttribute("data-holding");
        this.control?.setAttribute("aria-pressed", "false");
        if (this.progressNode) this.progressNode.value = 0;
        this.style.setProperty("--sg-confirm-progress", "0%");
        if (this.control) this.control.setAttribute("aria-label", `Hold to ${this.label}`);
    };

    private get duration(): number {
        const requested = Number(this.getAttribute("duration") || "1200");
        return Number.isFinite(requested) ? Math.min(10000, Math.max(300, requested)) : 1200;
    }

    private get label(): string {
        return this.getAttribute("label") || "Confirm action";
    }

    private syncState(): void {
        this.keyNode!.textContent = this.getAttribute("key") || "E";
        this.labelNode!.textContent = this.label;
        this.hintNode!.textContent = this.getAttribute("hint") || `Hold for ${(this.duration / 1000).toFixed(1)} seconds`;
        this.control!.disabled = this.hasAttribute("disabled");
        if (this.hasAttribute("disabled")) this.cancelHold();
        else this.control!.setAttribute("aria-label", `Hold to ${this.label}`);
    }
}

export function defineSGConfirmProgress(): void {
    defineElement("sg-confirm-progress", SGConfirmProgress);
}
