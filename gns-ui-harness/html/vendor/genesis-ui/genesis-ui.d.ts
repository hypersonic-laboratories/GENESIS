export type SGTone = "neutral" | "primary" | "info" | "success" | "warning" | "danger" | "violet";
export type SGButtonVariant = "primary" | "secondary" | "ghost" | "success" | "warning" | "danger";
export type SGButtonSize = "sm" | "md" | "lg";

export interface SGActivateDetail {
    source: "keyboard" | "pointer";
}

export interface SGItemActivateDetail {
    label: string;
    selected: boolean;
}

export interface SGDismissDetail {
    reason: "dismiss-button";
}

export class SGIcon extends HTMLElement {
    name: string;
    label?: string;
    src?: string;
}

export class SGButton extends HTMLElement {
    disabled: boolean;
    loading: boolean;
}

export class SGStat extends HTMLElement {}
export class SGItemSlot extends HTMLElement {}
export class SGAlert extends HTMLElement {}
export class SGKeybind extends HTMLElement {}

export const version: string;
export function defineAll(): void;

declare global {
    interface HTMLElementTagNameMap {
        "sg-alert": SGAlert;
        "sg-badge": HTMLElement;
        "sg-button": SGButton;
        "sg-card": HTMLElement;
        "sg-divider": HTMLElement;
        "sg-icon": SGIcon;
        "sg-item-slot": SGItemSlot;
        "sg-keybind": SGKeybind;
        "sg-panel": HTMLElement;
        "sg-stat": SGStat;
    }

    interface HTMLElementEventMap {
        "sg-activate": CustomEvent<SGActivateDetail>;
        "sg-item-activate": CustomEvent<SGItemActivateDetail>;
        "sg-dismiss": CustomEvent<SGDismissDetail>;
    }

    interface Window {
        GenesisUI?: {
            version: string;
            defineAll: typeof defineAll;
        };
    }
}
