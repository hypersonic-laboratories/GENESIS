import { useEffect, useRef } from "react";
import type { HelixMessage } from "./bridge";

/**
 * Subscribes to one event name sent from Lua with `ui:SendEvent(name, data)`.
 *
 * The handler is kept in a ref so passing an inline function does not tear the
 * listener down and rebuild it on every render — a real problem in-game, where
 * an event can arrive during that gap and be lost.
 *
 * ```tsx
 * useHelixEvent<boolean>("gnsui:setVisible", setVisible);
 * ```
 */
export function useHelixEvent<T = unknown>(
  name: string,
  handler: (data: T) => void,
): void {
  const saved = useRef(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MessageEvent<HelixMessage<T>>) => {
      const message = event.data;
      if (!message || message.name !== name) return;
      saved.current(message.args?.[0] as T);
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [name]);
}
