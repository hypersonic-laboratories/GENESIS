import { defineElement, emit } from "../internal/element";

export interface SGTabsChangeDetail extends Record<string, unknown> {
    value: string;
    previousValue: string;
}

let tabsId = 0;

export class SGTabs extends HTMLElement {
    static observedAttributes = ["value", "orientation"];

    private initialized = false;
    private tabList?: HTMLElement;
    private tabs: HTMLButtonElement[] = [];
    private panels: HTMLElement[] = [];
    private activeValue = "";
    private stateObserver?: MutationObserver;

    connectedCallback(): void {
        if (!this.initialized) {
            this.initialize();
        }
        this.tabList!.addEventListener("click", this.handleClick);
        this.tabList!.addEventListener("keydown", this.handleKeyDown);
        this.observeState();
        this.syncState();
    }

    disconnectedCallback(): void {
        this.tabList?.removeEventListener("click", this.handleClick);
        this.tabList?.removeEventListener("keydown", this.handleKeyDown);
        this.stateObserver?.disconnect();
    }

    attributeChangedCallback(): void {
        if (this.isConnected && this.initialized) {
            this.syncState();
        }
    }

    get value(): string {
        return this.activeValue || this.getAttribute("value") || "";
    }

    set value(value: string) {
        this.setAttribute("value", value);
    }

    private initialize(): void {
        const instance = ++tabsId;
        this.tabs = Array.from(this.children).filter(
            (child): child is HTMLButtonElement => child instanceof HTMLButtonElement && child.hasAttribute("data-sg-tab"),
        );
        this.panels = Array.from(this.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement && child.hasAttribute("data-sg-panel"),
        );

        this.tabList = document.createElement("div");
        this.tabList.className = "sg-tabs__list";
        this.tabList.setAttribute("role", "tablist");
        const content = document.createElement("div");
        content.className = "sg-tabs__content";

        this.tabs.forEach((tab, index) => {
            const value = tabValue(tab, index);
            const tabIdentifier = `sg-tabs-${instance}-tab-${index + 1}`;
            const panel = this.panels.find((candidate, panelIndex) => panelValue(candidate, panelIndex) === value);
            tab.type = "button";
            tab.id = tab.id || tabIdentifier;
            tab.setAttribute("role", "tab");
            tab.setAttribute("data-value", value);
            if (panel) {
                panel.id = panel.id || `sg-tabs-${instance}-panel-${index + 1}`;
                panel.setAttribute("role", "tabpanel");
                panel.setAttribute("aria-labelledby", tab.id);
                tab.setAttribute("aria-controls", panel.id);
            }
            this.tabList!.append(tab);
        });
        this.panels.forEach((panel) => content.append(panel));
        this.replaceChildren(this.tabList, content);
        this.initialized = true;
    }

    private readonly handleClick = (event: MouseEvent): void => {
        const tab = (event.target as Element).closest<HTMLButtonElement>("button[data-sg-tab]");
        if (!tab || tab.disabled || !this.tabList!.contains(tab)) {
            return;
        }
        this.select(tab.getAttribute("data-value") || "");
    };

    private observeState(): void {
        if (!this.stateObserver) {
            this.stateObserver = new MutationObserver(() => this.syncState());
        }
        this.stateObserver.observe(this.tabList!, { subtree: true, attributes: true, attributeFilter: ["disabled"] });
    }

    private readonly handleKeyDown = (event: KeyboardEvent): void => {
        const orientation = this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
        const previousKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
        const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
        if (![previousKey, nextKey, "Home", "End"].includes(event.key)) {
            return;
        }
        const enabled = this.tabs.filter((tab) => !tab.disabled);
        const currentIndex = enabled.indexOf(document.activeElement as HTMLButtonElement);
        if (currentIndex === -1 || enabled.length === 0) {
            return;
        }
        event.preventDefault();
        let nextIndex = currentIndex;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = enabled.length - 1;
        if (event.key === previousKey) nextIndex = (currentIndex - 1 + enabled.length) % enabled.length;
        if (event.key === nextKey) nextIndex = (currentIndex + 1) % enabled.length;
        enabled[nextIndex].focus();
        this.select(enabled[nextIndex].getAttribute("data-value") || "");
    };

    private select(value: string): void {
        if (!value || value === this.activeValue) {
            return;
        }
        const previousValue = this.activeValue;
        this.setAttribute("value", value);
        emit<SGTabsChangeDetail>(this, "sg-change", { value, previousValue });
    }

    private syncState(): void {
        const orientation = this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
        this.tabList!.setAttribute("aria-orientation", orientation);
        const requested = this.getAttribute("value") || "";
        const active = this.tabs.find((tab) => !tab.disabled && tab.getAttribute("data-value") === requested)
            || this.tabs.find((tab) => !tab.disabled);
        this.activeValue = active?.getAttribute("data-value") || "";

        this.tabs.forEach((tab) => {
            const selected = tab === active;
            tab.setAttribute("aria-selected", String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });
        this.panels.forEach((panel, index) => {
            panel.hidden = panelValue(panel, index) !== this.activeValue;
        });
    }
}

function tabValue(tab: HTMLButtonElement, index: number): string {
    return tab.getAttribute("value") || tab.getAttribute("data-sg-tab") || `tab-${index + 1}`;
}

function panelValue(panel: HTMLElement, index: number): string {
    return panel.getAttribute("value") || panel.getAttribute("data-sg-panel") || `tab-${index + 1}`;
}

export function defineSGTabs(): void {
    defineElement("sg-tabs", SGTabs);
}
