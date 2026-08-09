import { defineSGAlert } from "./elements/alert";
import { defineSGButton } from "./elements/button";
import { defineSGDrawer } from "./elements/drawer";
import { defineSGIcon } from "./elements/icon";
import { defineSGIconButton } from "./elements/icon-button";
import { defineSGInput } from "./elements/input";
import { defineSGItemSlot } from "./elements/item-slot";
import { defineSGKeybind } from "./elements/keybind";
import { defineSGModal } from "./elements/modal";
import { defineSGSegmented } from "./elements/segmented";
import { defineSGSelect } from "./elements/select";
import { defineSGSlider } from "./elements/slider";
import { defineSGStat } from "./elements/stat";
import { defineSGTabs } from "./elements/tabs";
import { defineSGToast } from "./elements/toast";
import { defineSGToggle } from "./elements/toggle";
import { defineSGTooltip } from "./elements/tooltip";
import { defineElement } from "./internal/element";

export const version = "0.1.0-alpha.0";

export function defineAll(): void {
    defineSGIcon();
    defineSGButton();
    defineSGIconButton();
    defineSGInput();
    defineSGSelect();
    defineSGToggle();
    defineSGSlider();
    defineSGTabs();
    defineSGSegmented();
    defineSGModal();
    defineSGDrawer();
    defineSGTooltip();
    defineSGToast();
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
export { SGDrawer } from "./elements/drawer";
export { SGIcon } from "./elements/icon";
export { SGIconButton } from "./elements/icon-button";
export { SGInput } from "./elements/input";
export { SGItemSlot } from "./elements/item-slot";
export { SGKeybind } from "./elements/keybind";
export { SGModal } from "./elements/modal";
export { SGSegmented } from "./elements/segmented";
export { SGSelect } from "./elements/select";
export { SGSlider } from "./elements/slider";
export { SGStat } from "./elements/stat";
export { SGTabs } from "./elements/tabs";
export { SGToast } from "./elements/toast";
export { SGToggle } from "./elements/toggle";
export { SGTooltip } from "./elements/tooltip";
