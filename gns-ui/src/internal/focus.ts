const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "sg-button:not([disabled]):not([loading])",
    "sg-icon-button:not([disabled]):not([loading])",
].join(",");

export function focusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
        return !element.hidden && element.getAttribute("aria-hidden") !== "true" && element.getClientRects().length > 0;
    });
}

export function focusFirst(container: HTMLElement): void {
    const first = focusableElements(container)[0];
    (first || container).focus();
}

export function trapTab(event: KeyboardEvent, container: HTMLElement): void {
    if (event.key !== "Tab") {
        return;
    }

    const focusable = focusableElements(container);
    if (focusable.length === 0) {
        event.preventDefault();
        container.focus();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

export function restoreFocus(target?: HTMLElement): void {
    if (target?.isConnected) {
        target.focus();
    }
}
