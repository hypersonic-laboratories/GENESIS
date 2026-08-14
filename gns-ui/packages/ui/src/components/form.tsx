import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { Alert } from "./feedback";
import { Field } from "./field";
import { Button, type ButtonProps } from "./button";

/**
 * What a submit handler resolves to.
 *
 * Deliberately not imported from `@gns/helix`: the form has no business
 * knowing HELIX exists. `submitTo()` over there returns this same shape, and
 * TypeScript's structural typing makes the two interchangeable without either
 * package depending on the other.
 */
export interface FormResult<T = unknown> {
  ok: boolean;
  /** Payload on success — a saved record, a new id, a balance. */
  data?: T;
  /** Field-scoped messages, keyed by field name. */
  errors?: Record<string, string>;
  /** Form-level message, for failures no single field owns. */
  message?: string;
}

export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface FormFieldApi<T = unknown> {
  name: string;
  value: T;
  error?: string;
  invalid: boolean;
  setValue: (next: T) => void;
  /**
   * Spread onto a native input or textarea. Anything else — a Select, a
   * Slider, a Toggle — takes `value` and `setValue` directly, because those
   * report through `onValueChange` rather than a DOM event.
   */
  inputProps: {
    name: string;
    value: string | number;
    onChange: (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    "aria-invalid"?: true;
  };
}

export interface UseFormOptions<V extends Record<string, unknown>> {
  initialValues: V;
  /**
   * Where the values go. Returning `{ ok: false, errors }` puts the messages
   * on the matching fields; anything thrown becomes a form-level message.
   */
  onSubmit: (values: V) => Promise<FormResult> | FormResult;
  /** Runs before submit. Return a map of messages to block the submission. */
  validate?: (values: V) => Record<string, string> | undefined;
  onSuccess?: (data: unknown, values: V) => void;
  onError?: (result: FormResult) => void;
  /** Restore the initial values once the server has accepted them. */
  resetOnSuccess?: boolean;
}

export interface FormApi<V extends Record<string, unknown>> {
  values: V;
  errors: Record<string, string>;
  message?: string;
  status: FormStatus;
  submitting: boolean;
  /** True once a value has changed and not yet been submitted. */
  dirty: boolean;
  setValue: <K extends keyof V>(name: K, value: V[K]) => void;
  setErrors: (errors: Record<string, string>) => void;
  field: <K extends keyof V & string>(name: K) => FormFieldApi<V[K]>;
  submit: () => Promise<void>;
  reset: () => void;
}

/**
 * Form state: values, per-field errors, submission status.
 *
 * Server-owned validation is the point. The screen sends what the player
 * typed and renders whatever comes back — it does not decide whether a name
 * is taken or a balance is sufficient, because only the server can know.
 */
export function useForm<V extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate,
  onSuccess,
  onError,
  resetOnSuccess = false,
}: UseFormOptions<V>): FormApi<V> {
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | undefined>();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [dirty, setDirty] = useState(false);

  const setValue = useCallback(
    <K extends keyof V>(name: K, value: V[K]) => {
      setValues((current) => ({ ...current, [name]: value }));
      setDirty(true);
      // Clear the field's error as soon as it is edited: keeping a stale
      // message under a field the player is fixing reads as unresponsive.
      setErrors((current) => {
        if (!(name in current)) return current;
        const next = { ...current };
        delete next[name as string];
        return next;
      });
      setStatus((current) => (current === "success" ? "idle" : current));
    },
    [],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setMessage(undefined);
    setStatus("idle");
    setDirty(false);
  }, [initialValues]);

  const submit = useCallback(async () => {
    setMessage(undefined);

    const local = validate?.(values);
    if (local && Object.keys(local).length > 0) {
      setErrors(local);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const result = await onSubmit(values);

      if (result.ok) {
        setStatus("success");
        setDirty(false);
        setMessage(result.message);
        onSuccess?.(result.data, values);
        if (resetOnSuccess) reset();
        return;
      }

      setStatus("error");
      setErrors(result.errors ?? {});
      setMessage(
        result.message ??
          (result.errors ? undefined : "The request was rejected."),
      );
      onError?.(result);
    } catch (error) {
      // A transport failure is not a validation failure — it belongs to the
      // form, not to a field.
      setStatus("error");
      const text =
        error instanceof Error ? error.message : "The request could not be sent.";
      setMessage(text);
      onError?.({ ok: false, message: text });
    }
  }, [values, validate, onSubmit, onSuccess, onError, resetOnSuccess, reset]);

  const field = useCallback(
    <K extends keyof V & string>(name: K): FormFieldApi<V[K]> => {
      const error = errors[name];
      const value = values[name];

      return {
        name,
        value,
        error,
        invalid: Boolean(error),
        setValue: (next) => setValue(name, next),
        inputProps: {
          name,
          value: (value ?? "") as string | number,
          onChange: (event) =>
            setValue(name, event.target.value as V[K]),
          "aria-invalid": error ? true : undefined,
        },
      };
    },
    [values, errors, setValue],
  );

  return useMemo(
    () => ({
      values,
      errors,
      message,
      status,
      submitting: status === "submitting",
      dirty,
      setValue,
      setErrors,
      field,
      submit,
      reset,
    }),
    [values, errors, message, status, dirty, setValue, field, submit, reset],
  );
}

const FormContext = createContext<FormApi<Record<string, unknown>> | null>(
  null,
);

export interface FormProps<V extends Record<string, unknown>>
  extends Omit<ComponentProps<"form">, "onSubmit" | "onError"> {
  form: FormApi<V>;
}

/**
 * Wires a {@link useForm} api to a real `<form>`, so Enter submits and the
 * browser's own semantics apply.
 *
 * Generic over the caller's value type: `setValue` takes its key type as a
 * parameter, so a widened `FormApi<Record<string, unknown>>` would reject
 * every concrete form handed to it.
 */
export function Form<V extends Record<string, unknown>>({
  form,
  className,
  children,
  ...props
}: FormProps<V>) {
  const api = form as unknown as FormApi<Record<string, unknown>>;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void api.submit();
  };

  return (
    <FormContext.Provider value={api}>
      <form
        noValidate
        onSubmit={handleSubmit}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

function useFormContext(component: string) {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(`<${component}> must be used inside a <Form>`);
  }
  return context;
}

export interface FormFieldProps {
  name: string;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  aside?: ReactNode;
  className?: string;
  children: (field: FormFieldApi) => ReactNode;
}

/**
 * One labelled control bound to the form. The render prop hands back the
 * binding rather than cloning children, so a control that reports through
 * `onValueChange` is wired as plainly as a native input.
 */
export function FormField({
  name,
  label,
  hint,
  required,
  aside,
  className,
  children,
}: FormFieldProps) {
  const form = useFormContext("FormField");
  const field = form.field(name);

  return (
    <Field
      label={label}
      hint={hint}
      error={field.error}
      required={required}
      aside={aside}
      className={className}
    >
      {children(field)}
    </Field>
  );
}

export interface FormMessageProps {
  className?: string;
  /** Shown when the submission succeeds and the server sent no message. */
  successText?: ReactNode;
}

/** Form-level result banner. Field errors render under their own fields. */
export function FormMessage({ className, successText }: FormMessageProps) {
  const form = useFormContext("FormMessage");

  if (form.status === "error" && form.message) {
    return (
      <Alert tone="danger" title="Rejected" className={className}>
        {form.message}
      </Alert>
    );
  }

  if (form.status === "success" && (form.message || successText)) {
    return (
      <Alert tone="success" title="Saved" className={className}>
        {form.message ?? successText}
      </Alert>
    );
  }

  return null;
}

export interface FormSubmitProps extends Omit<ButtonProps, "type" | "loading"> {
  /** Stay disabled until something has actually changed. */
  requireDirty?: boolean;
}

/** Submit button, tied to the form's status. */
export function FormSubmit({
  requireDirty = false,
  disabled,
  variant = "primary",
  children,
  ...props
}: FormSubmitProps) {
  const form = useFormContext("FormSubmit");

  return (
    <Button
      type="submit"
      variant={variant}
      loading={form.submitting}
      disabled={disabled || (requireDirty && !form.dirty)}
      {...props}
    >
      {children}
    </Button>
  );
}

/** Resets the form to its initial values. */
export function FormReset({ children, ...props }: Omit<ButtonProps, "type">) {
  const form = useFormContext("FormReset");

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={form.reset}
      disabled={form.submitting}
      {...props}
    >
      {children}
    </Button>
  );
}
