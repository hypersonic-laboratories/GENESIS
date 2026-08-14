import { request } from "./bridge";

/**
 * The shape a Lua handler is expected to reply with.
 *
 * Structurally identical to `FormResult` in `@gns/ui`, and deliberately
 * redeclared rather than imported: the design system must not depend on the
 * transport, and the transport must not depend on the components. Structural
 * typing lets `submitTo()` feed `useForm()` with neither package importing
 * the other.
 */
export interface SubmitResult<T = unknown> {
  ok: boolean;
  data?: T;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Normalises whatever Lua sent back.
 *
 * Lua handlers are written by many hands, and a callback that replies `true`,
 * replies with nothing at all, or replies with a full table are all reasonable
 * things to write. Rather than force one convention on every script, accept
 * the obvious ones and let the form see a single shape.
 */
export function normalizeResult<T>(raw: unknown): SubmitResult<T> {
  if (raw === undefined || raw === null) return { ok: true };
  if (typeof raw === "boolean") return { ok: raw };

  if (typeof raw === "object") {
    const value = raw as Record<string, unknown>;

    // Only an explicit `false` counts as failure — a handler that replies
    // with just `{ data = ... }` succeeded.
    const ok = value.ok !== false && value.success !== false;

    return {
      ok,
      data: value.data as T | undefined,
      errors:
        typeof value.errors === "object" && value.errors !== null
          ? (value.errors as Record<string, string>)
          : undefined,
      message:
        typeof value.message === "string"
          ? value.message
          : typeof value.error === "string"
            ? value.error
            : undefined,
    };
  }

  return { ok: true };
}

/**
 * Builds a submit handler that sends the form's values to a Lua event and
 * waits for its verdict.
 *
 * ```tsx
 * const form = useForm({
 *   initialValues: { displayName: "" },
 *   onSubmit: submitTo("profile:save"),
 * });
 * ```
 *
 * ```lua
 * ui:RegisterEventHandler('profile:save', function(values, callback)
 *     if #values.displayName < 3 then
 *         callback({ ok = false, errors = { displayName = 'Too short.' } })
 *         return
 *     end
 *     callback({ ok = true, message = 'Profile saved.' })
 * end)
 * ```
 *
 * The server decides. The screen only renders the verdict — which is why
 * `errors` is keyed by field name: those keys must match the form's fields.
 *
 * @param mock Returned in the browser, where there is no Lua to answer.
 */
export function submitTo<V = Record<string, unknown>, T = unknown>(
  event: string,
  mock?: SubmitResult<T>,
) {
  return async (values: V): Promise<SubmitResult<T>> => {
    const reply = await request<unknown>(event, values, mock);
    return normalizeResult<T>(reply);
  };
}
