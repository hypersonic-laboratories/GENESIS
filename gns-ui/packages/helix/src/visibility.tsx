import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { emit } from "./bridge";
import { useHelixEvent } from "./use-helix-event";

interface VisibilityValue {
  visible: boolean;
  /** Local-only. Use `close()` when Lua also needs to release input. */
  setVisible: (visible: boolean) => void;
  /** Hides the UI and tells the client to hand input back to the game. */
  close: () => void;
}

const VisibilityContext = createContext<VisibilityValue | null>(null);

export interface VisibilityProviderProps {
  children: ReactNode;
  /** Lua event that carries the boolean. */
  eventName?: string;
  /** Event emitted when the player dismisses the UI from the page. */
  closeEventName?: string;
  /** Start visible — correct for a HUD, wrong for a menu. */
  defaultVisible?: boolean;
  /** Escape closes the UI. Disable when a screen handles Escape itself. */
  closeOnEscape?: boolean;
  /**
   * Unmount the tree while hidden instead of just hiding it. Cheapest option
   * for menus; set `false` for a HUD that must keep its state between opens.
   */
  unmountWhenHidden?: boolean;
  /**
   * Elements whose presence means Escape belongs to them, not to the WebUI.
   * Override only if a screen introduces its own dismissible layer.
   */
  overlaySelector?: string;
}

/**
 * Anything Radix portals out and closes on Escape. Matching on roles rather
 * than component identity keeps this working for overlays we have not added
 * yet, and for any the consuming package builds itself.
 *
 * `data-state="open"` is load-bearing: a dismissed overlay stays mounted for
 * the length of its exit animation, and matching it in that window would keep
 * swallowing Escape after the layer is conceptually gone.
 */
const OPEN_OVERLAY_SELECTOR = [
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[role="menu"]',
  '[role="listbox"]',
]
  .map((role) => `${role}[data-state="open"]`)
  .join(",");

/**
 * Owns whether the WebUI is on screen.
 *
 * A HELIX page is always loaded and always composited, so a hidden UI must
 * also stop taking pointer events — otherwise it silently eats clicks meant
 * for the game. That is what the `pointer-events` toggle below is for.
 */
export function VisibilityProvider({
  children,
  eventName = "gnsui:setVisible",
  closeEventName = "gnsui:close",
  defaultVisible = false,
  closeOnEscape = true,
  unmountWhenHidden = true,
  overlaySelector = OPEN_OVERLAY_SELECTOR,
}: VisibilityProviderProps) {
  const [visible, setVisible] = useState(defaultVisible);

  useHelixEvent<boolean>(eventName, (next) => setVisible(Boolean(next)));

  const close = useCallback(() => {
    setVisible(false);
    emit(closeEventName);
  }, [closeEventName]);

  useEffect(() => {
    if (!closeOnEscape || !visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;

      // Escape unwinds one layer at a time. If a modal, drawer or menu is
      // open it owns this press — closing the whole WebUI here would yank the
      // player out of the screen instead of out of the dialog.
      //
      // The check runs in the capture phase, before any overlay has had the
      // chance to remove itself from the DOM in response to the same event.
      if (document.querySelector(overlaySelector)) return;

      event.preventDefault();
      close();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [closeOnEscape, visible, close, overlaySelector]);

  const value = useMemo(
    () => ({ visible, setVisible, close }),
    [visible, close],
  );

  return (
    <VisibilityContext.Provider value={value}>
      <div
        data-visible={visible}
        style={{
          height: "100%",
          visibility: visible ? "visible" : "hidden",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {unmountWhenHidden && !visible ? null : children}
      </div>
    </VisibilityContext.Provider>
  );
}

/** Read or change WebUI visibility. Requires a {@link VisibilityProvider}. */
export function useVisibility(): VisibilityValue {
  const context = useContext(VisibilityContext);
  if (!context) {
    throw new Error("useVisibility must be used inside a <VisibilityProvider>");
  }
  return context;
}
