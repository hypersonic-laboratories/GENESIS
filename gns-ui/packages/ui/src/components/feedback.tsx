import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Toast as RxToast } from "radix-ui";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  OctagonAlert,
  X,
} from "lucide-react";
import { cn } from "../lib/cn";
import { IconButton } from "./button";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const toneStyles: Record<
  Tone,
  { shell: string; icon: string; accent: string; glyph: ReactNode }
> = {
  neutral: {
    shell: "border-line",
    icon: "text-text-subtle",
    accent: "bg-text-subtle",
    glyph: <Info />,
  },
  info: {
    shell: "border-info-line bg-info-fill",
    icon: "text-info",
    accent: "bg-info",
    glyph: <Info />,
  },
  success: {
    shell: "border-success-line bg-success-fill",
    icon: "text-success",
    accent: "bg-success",
    glyph: <CheckCircle2 />,
  },
  warning: {
    shell: "border-warning-line bg-warning-fill",
    icon: "text-warning",
    accent: "bg-warning",
    glyph: <AlertTriangle />,
  },
  danger: {
    shell: "border-danger-line bg-danger-fill",
    icon: "text-danger",
    accent: "bg-danger",
    glyph: <OctagonAlert />,
  },
};

/* ------------------------------------------------------------------- Alert */

export interface AlertProps extends Omit<ComponentProps<"div">, "title"> {
  tone?: Tone;
  title?: ReactNode;
  /** Replaces the tone's default glyph. */
  icon?: ReactNode;
  /** Right-aligned actions. */
  actions?: ReactNode;
  onDismiss?: () => void;
}

/**
 * Persistent contextual information tied to the surrounding content. For
 * something transient and unrelated to the current view, use a toast.
 */
export function Alert({
  className,
  tone = "neutral",
  title,
  icon,
  actions,
  onDismiss,
  children,
  ...props
}: AlertProps) {
  const style = toneStyles[tone];

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-md border p-3",
        "inset-shadow-edge",
        tone === "neutral" && "surface-raised",
        style.shell,
        className,
      )}
      {...props}
    >
      <span className={cn("mt-px shrink-0 [&_svg]:size-4", style.icon)}>
        {icon ?? style.glyph}
      </span>
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="text-subheading uppercase text-text">{title}</p>
        ) : null}
        {children ? (
          <div className={cn("text-caption text-text-muted", title && "mt-1")}>
            {children}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
      {onDismiss ? (
        <IconButton
          aria-label="Dismiss"
          variant="ghost"
          size="xs"
          icon={<X />}
          onClick={onDismiss}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------- Toast */

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  /** Milliseconds on screen. Pass `0` to require manual dismissal. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastRecord extends ToastOptions {
  id: number;
  /** False while the exit animation plays; the record is dropped after it. */
  open: boolean;
}

/** Must outlast `--animate-toast-out`, or the toast vanishes mid-animation. */
const EXIT_MS = 220;

interface ToastContextValue {
  /** Queues a toast and returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  /** Default lifetime for toasts that do not set their own. */
  duration?: number;
  /** Corner the stack grows from. */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const positionClasses = {
  "top-right": "top-4 right-4 flex-col",
  "top-left": "top-4 left-4 flex-col",
  "bottom-right": "bottom-4 right-4 flex-col-reverse",
  "bottom-left": "bottom-4 left-4 flex-col-reverse",
} as const;

/**
 * Mount once near the root. Screens call `useToast().toast(...)` rather than
 * rendering toast elements themselves.
 */
export function ToastProvider({
  children,
  duration = 4000,
  position = "top-right",
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);
  const exitTimers = useRef(new Map<number, number>());

  /*
   * Dismissal is two-stage. Dropping the record the moment Radix reports the
   * toast closed would unmount it before its exit animation could run, so the
   * toast is first marked closed — which is what triggers the animation — and
   * only removed once that has had time to finish.
   */
  const dismiss = useCallback((id: number) => {
    setToasts((current) =>
      current.map((item) => (item.id === id ? { ...item, open: false } : item)),
    );

    if (exitTimers.current.has(id)) return;

    const handle = window.setTimeout(() => {
      exitTimers.current.delete(id);
      setToasts((current) => current.filter((item) => item.id !== id));
    }, EXIT_MS);

    exitTimers.current.set(id, handle);
  }, []);

  // Unmounting mid-exit would otherwise leave timers writing to dead state.
  useEffect(() => {
    const timers = exitTimers.current;
    return () => {
      timers.forEach((handle) => window.clearTimeout(handle));
      timers.clear();
    };
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { ...options, id, open: true }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RxToast.Provider
        duration={duration}
        swipeDirection={position.endsWith("left") ? "left" : "right"}
      >
        {children}

        {toasts.map((item) => {
          const style = toneStyles[item.tone ?? "neutral"];
          const life = item.duration ?? duration;

          return (
            <RxToast.Root
              key={item.id}
              open={item.open}
              duration={life === 0 ? Number.POSITIVE_INFINITY : life}
              onOpenChange={(open) => !open && dismiss(item.id)}
              className={cn(
                "relative w-80 overflow-hidden rounded-lg border p-3 pl-4 pr-9",
                // Unlike an Alert, a toast is portalled to the body and lands
                // straight on the game. It cannot tint a backdrop it does not
                // have, so the fill stays opaque and the tone moves to the
                // edge marker and the icon.
                "surface-solid border-line inset-shadow-edge shadow-overlay",
                "data-[state=open]:animate-toast-in",
                "data-[state=closed]:animate-toast-out",
                "data-[swipe=end]:animate-toast-out",
                "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
                "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[translate]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-[3px]",
                  style.accent,
                )}
              />

              <div className="flex items-start gap-2.5">
                <span className={cn("mt-px shrink-0 [&_svg]:size-4", style.icon)}>
                  {style.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <RxToast.Title className="text-subheading uppercase text-text">
                    {item.title}
                  </RxToast.Title>
                  {item.description ? (
                    <RxToast.Description className="mt-1 text-caption leading-[1.15rem] text-text-muted">
                      {item.description}
                    </RxToast.Description>
                  ) : null}
                  {item.action ? (
                    <RxToast.Action
                      altText={item.action.label}
                      onClick={item.action.onClick}
                      className="mt-2 text-control uppercase text-text underline underline-offset-2 hover:text-text-muted"
                    >
                      {item.action.label}
                    </RxToast.Action>
                  ) : null}
                </div>
              </div>

              <RxToast.Close asChild>
                <IconButton
                  aria-label="Dismiss"
                  variant="ghost"
                  size="xs"
                  icon={<X />}
                  className="absolute right-2 top-2"
                />
              </RxToast.Close>

              {/* Draining rule: shows how long is left without a countdown. */}
              {life > 0 ? (
                <span
                  aria-hidden
                  style={{ animationDuration: `${life}ms` }}
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 origin-left",
                    "animate-toast-timer opacity-60",
                    style.accent,
                  )}
                />
              ) : null}
            </RxToast.Root>
          );
        })}

        <RxToast.Viewport
          // Toasts leave towards the edge they are anchored to.
          style={
            position.endsWith("left")
              ? ({ "--toast-slide": "-110%" } as CSSProperties)
              : undefined
          }
          className={cn(
            "fixed z-[1500] flex max-h-screen w-80 gap-2 outline-none",
            positionClasses[position],
          )}
        />
      </RxToast.Provider>
    </ToastContext.Provider>
  );
}

/** Queue and dismiss toasts. Requires a {@link ToastProvider} above it. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a <ToastProvider>");
  }
  return context;
}
