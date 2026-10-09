"use client";

import { createContext, startTransition, useActionState, useContext, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "../actions";

const PendingContext = createContext(false);

export function SubmitButton({ children, variant = "primary", className = "" }: { children: ReactNode; variant?: "primary" | "secondary" | "danger"; className?: string }) {
  const { pending: formPending } = useFormStatus();
  const pending = useContext(PendingContext) || formPending;
  const styles = {
    primary: "bg-[#2e4dff] text-white hover:bg-[#1534dc]",
    secondary: "bg-white border border-[#d5dae3] text-[#171a21] hover:border-[#171a21]",
    danger: "bg-[#b42318] text-white hover:bg-[#912018]",
  }[variant];
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`h-10 px-4 rounded-[3px] text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait ${styles} ${className}`}>
      {pending ? "Saving…" : children}
    </button>
  );
}

/**
 * Server-action form with inline pending/success/error feedback. Submits via a
 * transition rather than the `action` prop so React doesn't clear what the
 * recruiter typed when the server returns a validation error.
 */
export function ActionForm({
  action,
  children,
  className = "",
  resetOnSuccess = false,
}: {
  action: (state: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };
  return (
    <PendingContext.Provider value={pending}>
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children}
        {state?.message && (
          <p role={state.ok ? "status" : "alert"} className={`text-[13px] font-medium ${state.ok ? "text-[#1f7a4d]" : "text-[#b42318]"}`}>
            {state.message}
          </p>
        )}
      </form>
    </PendingContext.Provider>
  );
}
