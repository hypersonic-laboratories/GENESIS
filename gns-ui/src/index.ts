import { defineSGAlert } from "./elements/alert";
import { defineSGActionList } from "./elements/action-list";
import { defineSGAvatar } from "./elements/avatar";
import { defineSGBreadcrumb } from "./elements/breadcrumb";
import { defineSGButton } from "./elements/button";
import { defineSGCheckbox } from "./elements/checkbox";
import { defineSGChip } from "./elements/chip";
import { defineSGConfirmProgress } from "./elements/confirm-progress";
import { defineSGContextMenu } from "./elements/context-menu";
import { defineSGDataTable } from "./elements/data-table";
import { defineSGDrawer } from "./elements/drawer";
import { defineSGEmptyState } from "./elements/empty-state";
import { defineSGIcon } from "./elements/icon";
import { defineSGIconButton } from "./elements/icon-button";
import { defineSGInput } from "./elements/input";
import { defineSGInteractionPrompt } from "./elements/interaction-prompt";
import { defineSGItemSlot } from "./elements/item-slot";
import { defineSGKeybind } from "./elements/keybind";
import { defineSGListRow } from "./elements/list-row";
import { defineSGMeter } from "./elements/meter";
import { defineSGModal } from "./elements/modal";
import { defineSGNumberStepper } from "./elements/number-stepper";
import { defineSGPagination } from "./elements/pagination";
import { defineSGPopover } from "./elements/popover";
import { defineSGProgress } from "./elements/progress";
import { defineSGRadialMenu } from "./elements/radial-menu";
import { defineSGRadioGroup } from "./elements/radio-group";
import { defineSGSegmented } from "./elements/segmented";
import { defineSGSelect } from "./elements/select";
import { defineSGSlider } from "./elements/slider";
import { defineSGSkeleton } from "./elements/skeleton";
import { defineSGStat } from "./elements/stat";
import { defineSGTabs } from "./elements/tabs";
import { defineSGTextarea } from "./elements/textarea";
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
    defineSGCheckbox();
    defineSGRadioGroup();
    defineSGTextarea();
    defineSGNumberStepper();
    defineSGChip();
    defineSGInteractionPrompt();
    defineSGActionList();
    defineSGConfirmProgress();
    defineSGPopover();
    defineSGContextMenu();
    defineSGRadialMenu();
    defineSGBreadcrumb();
    defineSGPagination();
    defineSGProgress();
    defineSGMeter();
    defineSGAvatar();
    defineSGListRow();
    defineSGEmptyState();
    defineSGSkeleton();
    defineSGDataTable();
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
export { SGActionList } from "./elements/action-list";
export { SGAvatar } from "./elements/avatar";
export { SGBreadcrumb } from "./elements/breadcrumb";
export { SGButton } from "./elements/button";
export { SGCheckbox } from "./elements/checkbox";
export { SGChip } from "./elements/chip";
export { SGConfirmProgress } from "./elements/confirm-progress";
export { SGContextMenu } from "./elements/context-menu";
export { SGDataTable } from "./elements/data-table";
export { SGDrawer } from "./elements/drawer";
export { SGEmptyState } from "./elements/empty-state";
export { SGIcon } from "./elements/icon";
export { SGIconButton } from "./elements/icon-button";
export { SGInput } from "./elements/input";
export { SGInteractionPrompt } from "./elements/interaction-prompt";
export { SGItemSlot } from "./elements/item-slot";
export { SGKeybind } from "./elements/keybind";
export { SGListRow } from "./elements/list-row";
export { SGMeter } from "./elements/meter";
export { SGModal } from "./elements/modal";
export { SGNumberStepper } from "./elements/number-stepper";
export { SGPagination } from "./elements/pagination";
export { SGPopover } from "./elements/popover";
export { SGProgress } from "./elements/progress";
export { SGRadialMenu } from "./elements/radial-menu";
export { SGRadioGroup } from "./elements/radio-group";
export { SGSegmented } from "./elements/segmented";
export { SGSelect } from "./elements/select";
export { SGSlider } from "./elements/slider";
export { SGSkeleton } from "./elements/skeleton";
export { SGStat } from "./elements/stat";
export { SGTabs } from "./elements/tabs";
export { SGTextarea } from "./elements/textarea";
export { SGToast } from "./elements/toast";
export { SGToggle } from "./elements/toggle";
export { SGTooltip } from "./elements/tooltip";
