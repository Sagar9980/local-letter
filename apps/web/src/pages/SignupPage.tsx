import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth-client"
import { AuthShell } from "@/components/auth/AuthShell"
import {
  AuthField,
  AuthPasswordField,
  FormAlert,
  PasswordStrength,
} from "@/components/auth/form"
import { Button } from "@/components/ui/button"

const MIN_PASSWORD_LENGTH = 8

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: signUpError } = await authClient.signUp.email({ name, email, password })

    setIsSubmitting(false)

    if (signUpError) {
      setError(signUpError.message ?? "Failed to sign up")
      return
    }

    navigate("/projects")
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      description="Spin up a project, design your first template, and render it from your app in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-ember-300 underline-offset-4 transition-colors hover:text-ember-200 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthField
          id="name"
          label="Name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <AuthField
          id="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthPasswordField
          id="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={MIN_PASSWORD_LENGTH}
          aria-invalid={tooShort || undefined}
          aria-describedby="password-hint"
          required
        >
          <PasswordStrength value={password} />
          <p id="password-hint" className="text-[0.75rem] text-ink-500">
            Use 8 characters or more — mixing case, numbers and symbols makes it stronger.
          </p>
        </AuthPasswordField>

        {error && <FormAlert>{error}</FormAlert>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="group h-11 w-full rounded-xl text-[0.9375rem]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
