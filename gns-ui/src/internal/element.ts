export type SGEventDetail = Record<string, unknown>;

export function defineElement(name: string, constructor: CustomElementConstructor): void {
    if (!customElements.get(name)) {
        customElements.define(name, constructor);
    }
}

export function emit<T extends SGEventDetail>(
    target: HTMLElement,
    name: string,
    detail: T,
    options: Pick<CustomEventInit<T>, "cancelable"> = {},
): CustomEvent<T> {
    const event = new CustomEvent<T>(name, {
        bubbles: true,
        composed: true,
        cancelable: options.cancelable ?? false,
        detail,
    });

    target.dispatchEvent(event);
    return event;
}

export function clamp(value: number, minimum = 0, maximum = 100): number {
    return Math.min(maximum, Math.max(minimum, value));
}
