export type SGTone = "neutral" | "primary" | "info" | "success" | "warning" | "danger" | "violet";
export type SGButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "success" | "warning" | "danger";
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

export interface SGValueDetail {
    value: string | number;
    name: string;
}

export interface SGSelectDetail {
    value: string;
    values: string[];
    name: string;
}

export interface SGToggleChangeDetail {
    checked: boolean;
    value: string;
    name: string;
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

export class SGIconButton extends HTMLElement {
    disabled: boolean;
    loading: boolean;
    pressed: boolean;
}

export class SGInput extends HTMLElement {
    value: string;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    focus(options?: FocusOptions): void;
    select(): void;
}

export class SGSelect extends HTMLElement {
    value: string;
    readonly values: string[];
    disabled: boolean;
    focus(options?: FocusOptions): void;
}

export class SGToggle extends HTMLElement {
    checked: boolean;
    disabled: boolean;
    focus(options?: FocusOptions): void;
}

export class SGSlider extends HTMLElement {
    value: number;
    disabled: boolean;
    focus(options?: FocusOptions): void;
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
        "sg-icon-button": SGIconButton;
        "sg-input": SGInput;
        "sg-item-slot": SGItemSlot;
        "sg-keybind": SGKeybind;
        "sg-panel": HTMLElement;
        "sg-select": SGSelect;
        "sg-slider": SGSlider;
        "sg-stat": SGStat;
        "sg-toggle": SGToggle;
    }

    interface HTMLElementEventMap {
        "sg-activate": CustomEvent<SGActivateDetail>;
        "sg-item-activate": CustomEvent<SGItemActivateDetail>;
        "sg-dismiss": CustomEvent<SGDismissDetail>;
        "sg-input": CustomEvent<SGValueDetail | SGSelectDetail>;
        "sg-change": CustomEvent<SGValueDetail | SGSelectDetail | SGToggleChangeDetail>;
    }

    interface Window {
        GenesisUI?: {
            version: string;
            defineAll: typeof defineAll;
        };
    }
}
