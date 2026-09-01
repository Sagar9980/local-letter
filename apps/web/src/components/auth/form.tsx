import * as React from "react"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const fieldClass =
  "h-11 rounded-xl border-ink-50/10 bg-ink-50/4 px-3.5 text-[0.9375rem] text-ink-50 placeholder:text-ink-700 focus-visible:border-ember-400/60 focus-visible:ring-ember-400/25 md:text-[0.9375rem]"

export function AuthField({
  id,
  label,
  hint,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string; hint?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-[0.8125rem] font-medium text-ink-100">
          {label}
        </Label>
        {hint}
      </div>
      <Input id={id} className={cn(fieldClass, className)} {...props} />
    </div>
  )
}

/** Password field with a reveal toggle — the standard fix for typo-driven
 *  sign-in failures, and expected on any modern auth screen. */
export function AuthPasswordField({
  id,
  label,
  hint,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string
  label: string
  hint?: React.ReactNode
  children?: React.ReactNode
}) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-[0.8125rem] font-medium text-ink-100">
          {label}
        </Label>
        {hint}
      </div>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(fieldClass, "pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-ink-500 transition-colors hover:text-ink-100"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {children}
    </div>
  )
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl bg-seal-500/10 px-3.5 py-3 text-[0.8125rem] leading-relaxed text-seal-400 ring-1 ring-seal-500/25"
    >
      <AlertCircle className="mt-px size-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"] as const

/** Cheap heuristic — length carries most of the weight, character variety the
 *  rest. It is guidance for the user, not a gate; the API is the real check. */
function scorePassword(value: string): number {
  if (value.length < 8) return 0
  let score = 1
  if (value.length >= 12) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value) && /[^\w\s]/.test(value)) score += 1
  return Math.min(score, 4)
}

export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null

  const score = scorePassword(value)
  const tone =
    score === 0 ? "bg-seal-500" : score === 1 ? "bg-seal-400" : score < 4 ? "bg-ember-400" : "bg-ember-300"

  return (
    <div className="flex items-center gap-2.5 pt-0.5">
      <div className="flex flex-1 gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < Math.max(score, 1) ? tone : "bg-ink-50/10"
            )}
          />
        ))}
      </div>
      <span className="w-16 shrink-0 text-right text-[0.6875rem] text-ink-500">
        {strengthLabels[score]}
      </span>
    </div>
  )
}
