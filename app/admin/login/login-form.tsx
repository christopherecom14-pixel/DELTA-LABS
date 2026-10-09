"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions";
import { SubmitButton } from "../_components/action-form";
import { adminInput } from "../_components/styles";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(loginAction, undefined);
  // Controlled so a failed attempt doesn't clear it (React resets uncontrolled fields after an action).
  const [email, setEmail] = useState("");
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={`${adminInput} h-11 text-base`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={`${adminInput} h-11 text-base`} />
      </div>
      {state?.message && (
        <p role="alert" className="text-sm font-medium text-[#b42318]">{state.message}</p>
      )}
      <SubmitButton className="h-11 w-full">Sign in</SubmitButton>
    </form>
  );
}
