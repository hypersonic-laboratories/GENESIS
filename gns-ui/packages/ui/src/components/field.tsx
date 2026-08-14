import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type ReactNode,
} from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../lib/cn";

interface FieldContextValue {
  controlId: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<ComponentProps<"div">, "title"> {
  label?: ReactNode;
  /** Supporting copy shown under the control while it is valid. */
  hint?: ReactNode;
  /** Replaces the hint and flips the control into its error styling. */
  error?: ReactNode;
  /** Marks the control required and shows the indicator on the label. */
  required?: boolean;
  /** Right-aligned content on the label row — a counter, a reset link. */
  aside?: ReactNode;
}

/**
 * Label, control and message in one block. Wrapping a control in a Field is
 * what wires up `id` / `aria-describedby` / `aria-invalid`, so validation is
 * never communicated by border colour alone.
 */
export function Field({
  className,
  label,
  hint,
  error,
  required = false,
  aside,
  children,
  ...props
}: FieldProps) {
  const controlId = useId();
  const messageId = `${controlId}-message`;
  const invalid = Boolean(error);
  const message = error ?? hint;

  return (
    <FieldContext.Provider
      value={{
        controlId,
        describedBy: message ? messageId : undefined,
        invalid,
      }}
    >
      <div className={cn("flex flex-col gap-1.5", className)} {...props}>
        {label || aside ? (
          <div className="flex items-baseline justify-between gap-3">
            {label ? (
              <label
                htmlFor={controlId}
                className="text-overline text-text-subtle"
              >
                {label}
                {required ? (
                  <span aria-hidden className="ml-1 text-danger">
                    *
                  </span>
                ) : null}
              </label>
            ) : (
              <span />
            )}
            {aside ? (
              <span className="text-caption text-text-faint">{aside}</span>
            ) : null}
          </div>
        ) : null}

        {children}

        {message ? (
          <p
            id={messageId}
            className={cn(
              "flex items-start gap-1.5 text-caption",
              invalid ? "text-danger" : "text-text-faint",
            )}
          >
            {invalid ? (
              <AlertCircle aria-hidden className="mt-px size-3 shrink-0" />
            ) : null}
            {message}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

/** Reads the surrounding {@link Field}, if there is one. */
export function useField() {
  return useContext(FieldContext);
}

/** Shared shell for anything that looks like a text box. */
export const controlShell = [
  "flex w-full items-center gap-2",
  "surface-well rounded-md border border-line",
  "inset-shadow-well",
  "text-control text-text",
  "transition-[border-color,box-shadow,background-color] duration-100 ease-snap",
  "hover:border-line-strong",
  "has-[:focus-visible]:border-line-accent",
  "has-[:focus-visible]:shadow-glow-accent",
  "has-[:disabled]:pointer-events-none has-[:disabled]:opacity-40",
  "has-[[aria-invalid=true]]:border-danger-line",
];

export interface InputProps
  extends Omit<ComponentProps<"input">, "size" | "prefix"> {
  size?: "sm" | "md" | "lg";
  /** Glyph or short unit rendered before the value. */
  prefix?: ReactNode;
  /** Glyph or short unit rendered after the value. */
  suffix?: ReactNode;
  invalid?: boolean;
  /** Class names for the outer shell rather than the `<input>` itself. */
  wrapperClassName?: string;
}

const inputSizes = {
  sm: "h-7 px-2",
  md: "h-8 px-2.5",
  lg: "h-10 px-3",
} as const;

export function Input({
  className,
  wrapperClassName,
  size = "md",
  prefix,
  suffix,
  invalid,
  id,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const field = useField();
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <div
      className={cn(
        controlShell,
        inputSizes[size],
        "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-text-faint",
        wrapperClassName,
      )}
    >
      {prefix}
      <input
        id={id ?? field?.controlId}
        aria-describedby={describedBy ?? field?.describedBy}
        aria-invalid={isInvalid || undefined}
        className={cn(
          "min-w-0 flex-1 bg-transparent outline-none",
          "placeholder:text-text-disabled placeholder:uppercase",
          className,
        )}
        {...props}
      />
      {suffix}
    </div>
  );
}

export interface TextareaProps extends ComponentProps<"textarea"> {
  invalid?: boolean;
  wrapperClassName?: string;
}

export function Textarea({
  className,
  wrapperClassName,
  invalid,
  id,
  rows = 4,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const field = useField();
  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <div className={cn(controlShell, "p-2.5", wrapperClassName)}>
      <textarea
        id={id ?? field?.controlId}
        rows={rows}
        aria-describedby={describedBy ?? field?.describedBy}
        aria-invalid={isInvalid || undefined}
        className={cn(
          "min-w-0 flex-1 resize-y bg-transparent outline-none",
          "placeholder:text-text-disabled placeholder:uppercase",
          className,
        )}
        {...props}
      />
    </div>
  );
}
