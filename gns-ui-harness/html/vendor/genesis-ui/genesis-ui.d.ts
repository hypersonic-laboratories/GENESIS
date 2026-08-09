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
    reason: "dismiss-button" | "timeout";
}

export interface SGCloseDetail {
    reason: "close-button" | "escape" | "scrim";
}

export interface SGSelectionChangeDetail {
    value: string;
    previousValue: string;
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

export interface SGCheckboxChangeDetail {
    checked: boolean;
    indeterminate: boolean;
    value: string;
    name: string;
}

export interface SGChipChangeDetail {
    selected: boolean;
    value: string;
}

export interface SGChipRemoveDetail {
    value: string;
}

export interface SGPaginationChangeDetail {
    page: number;
    previousPage: number;
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

export class SGCheckbox extends HTMLElement {
    checked: boolean;
    indeterminate: boolean;
    disabled: boolean;
    focus(options?: FocusOptions): void;
}

export class SGRadioGroup extends HTMLElement {
    value: string;
    disabled: boolean;
}

export class SGTextarea extends HTMLElement {
    value: string;
    disabled: boolean;
    focus(options?: FocusOptions): void;
    select(): void;
}

export class SGNumberStepper extends HTMLElement {
    value: number;
    disabled: boolean;
    focus(options?: FocusOptions): void;
}

export class SGChip extends HTMLElement {
    selected: boolean;
    disabled: boolean;
}

export class SGBreadcrumb extends HTMLElement {}

export class SGPagination extends HTMLElement {
    page: number;
    readonly total: number;
}

export class SGTabs extends HTMLElement {
    value: string;
}

export class SGSegmented extends HTMLElement {
    value: string;
}

export class SGModal extends HTMLElement {
    open: boolean;
}

export class SGDrawer extends HTMLElement {
    open: boolean;
}

export class SGTooltip extends HTMLElement {}

export class SGToast extends HTMLElement {
    show(): void;
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
        "sg-breadcrumb": SGBreadcrumb;
        "sg-button": SGButton;
        "sg-card": HTMLElement;
        "sg-checkbox": SGCheckbox;
        "sg-chip": SGChip;
        "sg-divider": HTMLElement;
        "sg-drawer": SGDrawer;
        "sg-icon": SGIcon;
        "sg-icon-button": SGIconButton;
        "sg-input": SGInput;
        "sg-item-slot": SGItemSlot;
        "sg-keybind": SGKeybind;
        "sg-modal": SGModal;
        "sg-number-stepper": SGNumberStepper;
        "sg-pagination": SGPagination;
        "sg-panel": HTMLElement;
        "sg-radio-group": SGRadioGroup;
        "sg-segmented": SGSegmented;
        "sg-select": SGSelect;
        "sg-slider": SGSlider;
        "sg-stat": SGStat;
        "sg-tabs": SGTabs;
        "sg-textarea": SGTextarea;
        "sg-toast": SGToast;
        "sg-toggle": SGToggle;
        "sg-tooltip": SGTooltip;
    }

    interface HTMLElementEventMap {
        "sg-activate": CustomEvent<SGActivateDetail>;
        "sg-item-activate": CustomEvent<SGItemActivateDetail>;
        "sg-dismiss": CustomEvent<SGDismissDetail>;
        "sg-input": CustomEvent<SGValueDetail | SGSelectDetail>;
        "sg-change": CustomEvent<SGValueDetail | SGSelectDetail | SGToggleChangeDetail | SGCheckboxChangeDetail | SGChipChangeDetail | SGPaginationChangeDetail | SGSelectionChangeDetail>;
        "sg-close": CustomEvent<SGCloseDetail>;
        "sg-remove": CustomEvent<SGChipRemoveDetail>;
    }

    interface Window {
        GenesisUI?: {
            version: string;
            defineAll: typeof defineAll;
        };
    }
}
