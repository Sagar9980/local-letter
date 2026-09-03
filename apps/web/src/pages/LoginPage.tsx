import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth-client"
import { AuthShell } from "@/components/auth/AuthShell"
import { AuthField, AuthPasswordField, FormAlert } from "@/components/auth/form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    })

    setIsSubmitting(false)

    if (signInError) {
      setError(signInError.message ?? "Failed to sign in")
      return
    }

    navigate("/projects")
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Pick up where you left off — your projects, templates and keys are waiting."
      footer={
        <>
          New to Local Letter?{" "}
          <Link
            to="/signup"
            className="font-medium text-ember-300 underline-offset-4 transition-colors hover:text-ember-200 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthField
          id="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthPasswordField
          id="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center gap-2.5">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label htmlFor="remember" className="text-[0.8125rem] font-normal text-ink-300">
            Keep me signed in on this device
          </Label>
        </div>

        {error && <FormAlert>{error}</FormAlert>}

        <Button type="submit" disabled={isSubmitting} className="group h-11 w-full rounded-xl text-[0.9375rem]">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
