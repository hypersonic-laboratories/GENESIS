/**
 * The Lua ↔ WebUI transport.
 *
 * HELIX delivers Lua events to the page as `window.postMessage({ name, args })`
 * and exposes `window.hEvent(name, data, callback)` for the return path. Both
 * are absent in an ordinary browser, so every entry point here degrades to a
 * no-op or a mock rather than throwing during development.
 */

declare global {
  interface Window {
    hEvent?: (name: string, data?: unknown, callback?: (value: never) => void) => void;
  }
}

export interface HelixMessage<T = unknown> {
  name: string;
  args: T[];
}

/** True when the page is running outside the game client. */
export function isBrowser(): boolean {
  return !window.hEvent;
}

/**
 * Fire-and-forget event to the Lua client.
 *
 * ```lua
 * ui:RegisterEventHandler('gnsui:close', function() ... end)
 * ```
 */
export function emit(name: string, data?: unknown): void {
  window.hEvent?.(name, data);
}

/**
 * Event to the Lua client that expects a reply.
 *
 * ```lua
 * ui:RegisterEventHandler('inventory:use', function(data, callback)
 *     callback({ ok = true })
 * end)
 * ```
 *
 * @param mock Returned immediately in the browser, so screens stay usable
 *   outside the client instead of hanging on a promise nothing will resolve.
 */
export function request<T = unknown>(
  name: string,
  data?: unknown,
  mock?: T,
): Promise<T> {
  if (isBrowser()) return Promise.resolve(mock as T);

  return new Promise<T>((resolve) => {
    window.hEvent?.(name, data, (value) => resolve(value as T));
  });
}

/**
 * Dispatches events as if Lua had sent them. Development only — the guard
 * keeps the calls in place without shipping fake data to the client.
 */
export function debugData<T>(
  events: Array<{ name: string; data: T }>,
  delay = 0,
): void {
  if (!import.meta.env.DEV || !isBrowser()) return;

  for (const event of events) {
    window.setTimeout(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { name: event.name, args: [event.data] },
        }),
      );
    }, delay);
  }
}

type LogLevel = "info" | "warn" | "error" | "debug";

function forward(level: LogLevel, message: string, payload?: unknown) {
  if (isBrowser()) {
    console[level === "debug" ? "log" : level](`[gns] ${message}`, payload ?? "");
    return;
  }
  emit("gnsui:log", { level, message, payload });
}

/**
 * Writes to the Lua console. The client package decides how to print it —
 * see the `gnsui:log` handler in `client.lua`.
 */
export const log = {
  info: (message: string, payload?: unknown) => forward("info", message, payload),
  warn: (message: string, payload?: unknown) => forward("warn", message, payload),
  error: (message: string, payload?: unknown) => forward("error", message, payload),
  debug: (message: string, payload?: unknown) => forward("debug", message, payload),
};
