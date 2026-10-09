"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

export const fieldId = (name: string) => `f-${name.replace(/\./g, "-")}`;

const inputBase =
  "w-full rounded-[4px] border bg-white px-3.5 text-base text-[#171a21] placeholder:text-[#87909f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2e4dff]/25 focus:border-[#2e4dff] disabled:bg-[#f0f3f8]";
const borderFor = (error?: string) => (error ? "border-[#d92d20]" : "border-[#d5dae3] hover:border-[#b9c0cc]");

interface FieldProps {
  name: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  as?: "div" | "fieldset";
}

/** Label + hint + error wrapper. Inputs reference the hint/error ids via aria-describedby. */
export function Field({ name, label, required, hint, error, children, as = "div" }: FieldProps) {
  const id = fieldId(name);
  const Tag = as;
  const LabelTag = as === "fieldset" ? "legend" : "label";
  return (
    <Tag className="flex flex-col gap-1.5 min-w-0">
      <LabelTag {...(as === "div" ? { htmlFor: id } : {})} className="text-sm font-semibold text-[#171a21]">
        {label}
        {required ? <span className="text-[#2e4dff]" aria-hidden="true"> *</span> : <span className="font-normal text-[#87909f]"> (optional)</span>}
      </LabelTag>
      {hint && <p id={`${id}-hint`} className="text-[13px] leading-snug text-[#636873] -mt-0.5">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[13px] font-medium text-[#b42318] flex gap-1.5 items-start">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </Tag>
  );
}

export const describedBy = (name: string, hint?: unknown, error?: string) =>
  [hint ? `${fieldId(name)}-hint` : "", error ? `${fieldId(name)}-error` : ""].filter(Boolean).join(" ") || undefined;

type InputProps = {
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: unknown;
  required?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "name">;

export function TextInput({ name, value, onChange, error, hint, required, className = "", ...rest }: InputProps) {
  return (
    <input
      id={fieldId(name)}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy(name, hint, error)}
      className={`${inputBase} ${borderFor(error)} h-12 ${className}`}
      {...rest}
    />
  );
}

export function TextArea({
  name,
  value,
  onChange,
  error,
  hint,
  required,
  max,
  min,
  rows = 5,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: unknown;
  required?: boolean;
  max: number;
  min?: number;
  rows?: number;
  placeholder?: string;
}) {
  const length = value.trim().length;
  return (
    <div className="relative">
      <textarea
        id={fieldId(name)}
        name={name}
        value={value}
        rows={rows}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={`${inputBase} ${borderFor(error)} py-3 pb-7 leading-relaxed resize-y min-h-[120px]`}
      />
      <span className="pointer-events-none absolute right-3 bottom-2 text-[11px] tabular-nums text-[#87909f]" aria-hidden="true">
        {min && length < min ? `${min - length} more characters needed` : `${value.length}/${max}`}
      </span>
    </div>
  );
}

export function Select({
  name,
  value,
  onChange,
  options,
  error,
  hint,
  required,
  placeholder = "Select…",
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { id: string; label: string }[];
  error?: string;
  hint?: unknown;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        id={fieldId(name)}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={`${inputBase} ${borderFor(error)} h-12 appearance-none pr-10 cursor-pointer ${value ? "" : "text-[#87909f]"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.id} value={o.id} className="text-[#171a21]">
            {o.label}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636873]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

/** Radio group rendered as selectable cards; arrow keys work natively. */
export function RadioCards({
  name,
  value,
  onChange,
  options,
  error,
  columns = 2,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { id: string; label: string; description?: string }[];
  error?: string;
  columns?: 1 | 2 | 3 | 4;
}) {
  const cols = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <div className={`grid grid-cols-1 ${cols} gap-2.5`} id={fieldId(name)} aria-describedby={describedBy(name, false, error)}>
      {options.map((o) => {
        const checked = value === o.id;
        return (
          <label
            key={o.id}
            className={`relative flex gap-3 items-start rounded-[4px] border p-3.5 cursor-pointer transition-colors min-h-12 ${
              checked ? "border-[#2e4dff] bg-[#2e4dff]/[0.05] ring-1 ring-[#2e4dff]" : `${error ? "border-[#d92d20]" : "border-[#d5dae3]"} bg-white hover:border-[#9aa3b5]`
            } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2e4dff]/40`}
          >
            <input
              type="radio"
              name={name}
              value={o.id}
              checked={checked}
              onChange={() => onChange(o.id)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#2e4dff]"
            />
            <span className="min-w-0">
              <span className="block text-[15px] font-medium leading-snug text-[#171a21]">{o.label}</span>
              {o.description && <span className="block mt-1 text-[13px] leading-snug text-[#636873]">{o.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function CheckboxPills({
  name,
  values,
  onChange,
  options,
}: {
  name: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-wrap gap-2" id={fieldId(name)}>
      {options.map((o) => {
        const checked = values.includes(o);
        return (
          <label
            key={o}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 min-h-10 text-sm cursor-pointer select-none transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2e4dff]/40 ${
              checked ? "border-[#2e4dff] bg-[#2e4dff] text-white" : "border-[#d5dae3] bg-white text-[#171a21] hover:border-[#9aa3b5]"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => onChange(checked ? values.filter((v) => v !== o) : [...values, o])}
            />
            <span aria-hidden="true">{checked ? "✓" : "+"}</span>
            {o}
          </label>
        );
      })}
    </div>
  );
}

/** Free-text chips: type, then Enter or comma to add. */
export function TagInput({
  name,
  values,
  onChange,
  error,
  hint,
  placeholder,
  max = 10,
  suggestions = [],
}: {
  name: string;
  values: string[];
  onChange: (v: string[]) => void;
  error?: string;
  hint?: unknown;
  placeholder?: string;
  max?: number;
  suggestions?: readonly string[];
}) {
  const [draft, setDraft] = useState("");
  const listId = useId();

  const add = (raw: string) => {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const next = [...values];
    for (const p of parts) {
      if (next.length >= max) break;
      if (!next.some((v) => v.toLowerCase() === p.toLowerCase())) next.push(p.slice(0, 60));
    }
    onChange(next);
    setDraft("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div>
      <div
        className={`flex flex-wrap gap-1.5 items-center rounded-[4px] border bg-white p-2 min-h-12 focus-within:ring-2 focus-within:ring-[#2e4dff]/25 focus-within:border-[#2e4dff] ${borderFor(error)}`}
      >
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-[3px] bg-[#eef1ff] text-[#1d33b8] pl-2.5 pr-1 py-1 text-sm">
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="w-6 h-6 inline-flex items-center justify-center rounded-[3px] hover:bg-[#2e4dff]/15 cursor-pointer"
              aria-label={`Remove ${v}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={fieldId(name)}
          value={draft}
          list={suggestions.length ? listId : undefined}
          onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={values.length >= max ? `Maximum of ${max} reached` : placeholder}
          disabled={values.length >= max}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(name, hint, error)}
          className="flex-1 min-w-[140px] h-8 px-1.5 text-base bg-transparent focus:outline-none placeholder:text-[#87909f]"
        />
      </div>
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
