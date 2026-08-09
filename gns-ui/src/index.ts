import { defineSGAlert } from "./elements/alert";
import { defineSGButton } from "./elements/button";
import { defineSGIcon } from "./elements/icon";
import { defineSGItemSlot } from "./elements/item-slot";
import { defineSGKeybind } from "./elements/keybind";
import { defineSGStat } from "./elements/stat";
import { defineElement } from "./internal/element";

export const version = "0.1.0-alpha.0";

export function defineAll(): void {
    defineSGIcon();
    defineSGButton();
    defineSGStat();
    defineSGItemSlot();
    defineSGAlert();
    defineSGKeybind();

    for (const name of ["sg-panel", "sg-card", "sg-badge", "sg-divider"]) {
        defineElement(name, class extends HTMLElement {});
    }
}

defineAll();

declare global {
    interface Window {
        GenesisUI?: {
            version: string;
            defineAll: typeof defineAll;
        };
    }
}

window.GenesisUI = Object.freeze({ version, defineAll });

export { SGAlert } from "./elements/alert";
export { SGButton } from "./elements/button";
export { SGIcon } from "./elements/icon";
export { SGItemSlot } from "./elements/item-slot";
export { SGKeybind } from "./elements/keybind";
export { SGStat } from "./elements/stat";
