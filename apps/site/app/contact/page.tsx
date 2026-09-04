"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  Check,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { HorizonGlow } from "@/components/Glow";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * POST target for the form. Defaults to the site's own Resend-backed route
 * handler; override to point at an external form service instead.
 */
const CONTACT_ENDPOINT = "/api/contact";

const localeRanges = [
  "1–2 locales",
  "3–5 locales",
  "6–15 locales",
  "15+ locales",
];
const interests = [
  "Local Letter Cloud waitlist",
  "Self-hosted deployment",
  "Migrating existing templates",
  "An SDK for another language",
  "Security / compliance review",
];

interface FormState {
  name: string;
  email: string;
  company: string;
  locales: string;
  interest: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  locales: localeRanges[1],
  interest: interests[0],
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Tell us who we are talking to.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "A valid work email, please.";
    if (form.message.trim().length < 10)
      next.message = "A sentence or two about your setup helps.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok)
        throw new Error(`Request failed with ${response.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative isolate overflow-hidden pt-36 pb-28 sm:pt-44">
      <HorizonGlow intensity={0.5} />

      <div className="ll-shell relative z-10">
        <div className="grid gap-14 [&>*]:min-w-0 lg:grid-cols-[0.85fr_1fr] lg:items-start">
          <Reveal>
            <p className="ll-eyebrow">Contact sales</p>
            <h1 className="ll-h2 mt-4 text-ink-50">
              Talk to the people
              <br />
              <span className="ll-serif ll-gradient-text">who built it</span>
            </h1>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-300">
              Self-hosting is free — you do not need us to start. Get in touch
              if you want on the Local Letter Cloud waitlist, need help
              migrating existing templates, or have a security review to get
              through. Tell us what you are running and who it is for.
            </p>

            <div className="mt-10 space-y-5">
              <Perk
                icon={Clock}
                title="A reply within one business day"
                body="From an engineer, not a form autoresponder."
              />
              <Perk
                icon={MessageSquare}
                title="A working session, not a pitch"
                body="We will look at your current templates and map them to the model."
              />
              <Perk
                icon={ShieldCheck}
                title="Security review welcome"
                body="Send your questionnaire — self-hosted answers most of it already."
              />
            </div>

            <div className="ll-rule my-10" />

            <a
              href={`mailto:${site.salesEmail}`}
              className="inline-flex items-center gap-2.5 text-[0.9375rem] text-ink-300 transition-colors hover:text-ink-50"
            >
              <Mail className="size-4 text-ember-300" />
              {site.salesEmail}
            </a>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="ll-panel p-7 sm:p-9">
              {status === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[26rem] flex-col items-center justify-center text-center"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-ember-400/14 text-ember-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_28%,transparent)]">
                    <Check className="size-6" />
                  </span>
                  <h2 className="mt-6 text-xl font-medium tracking-[-0.02em] text-ink-50">
                    Message received
                  </h2>
                  <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-300">
                    Thanks — an engineer will reply within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(initialState);
                      setStatus("idle");
                    }}
                    className="ll-btn ll-btn-ghost mt-8"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" error={errors.name}>
                      <input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Sarah Okonkwo"
                        className={inputClass(errors.name)}
                      />
                    </Field>
                    <Field label="Work email" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="sarah@acme.com"
                        className={inputClass(errors.email)}
                      />
                    </Field>
                  </div>

                  <Field label="Company" optional>
                    <input
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      placeholder="Acme"
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="How many locales do you send in?">
                    <div className="flex flex-wrap gap-2">
                      {localeRanges.map((range) => (
                        <Chip
                          key={range}
                          active={form.locales === range}
                          onClick={() => set("locales", range)}
                        >
                          {range}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="What do you need most?">
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Chip
                          key={interest}
                          active={form.interest === interest}
                          onClick={() => set("interest", interest)}
                        >
                          {interest}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field
                    label="Tell us about your setup"
                    error={errors.message}
                  >
                    <textarea
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      rows={4}
                      placeholder="We send ~200k transactional emails a month across 6 languages, currently hardcoded in two Node services…"
                      className={cn(inputClass(errors.message), "resize-none")}
                    />
                  </Field>

                  {status === "error" ? (
                    <p className="rounded-xl bg-seal-500/10 px-4 py-3 text-[0.8125rem] text-seal-400">
                      That did not go through. Email us directly at{" "}
                      {site.salesEmail}.
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="ll-btn ll-btn-primary w-full disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending
                      </>
                    ) : (
                      "Contact sales"
                    )}
                  </button>

                  <p className="text-center text-[0.75rem] text-ink-500">
                    We only use this to reply to you. No newsletter, no
                    sequence.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function inputClass(error?: string) {
  return cn(
    "w-full rounded-xl bg-ink-950/60 px-4 py-3 text-[0.9375rem] text-ink-50 placeholder:text-ink-700 transition-shadow duration-200",
    "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_9%,transparent)]",
    "focus:outline-none focus:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_45%,transparent)]",
    error &&
      "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-seal-500)_55%,transparent)]",
  );
}

function Field({
  label,
  children,
  error,
  optional,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline gap-2 text-[0.8125rem] font-medium text-ink-100">
        {label}
        {optional ? (
          <span className="text-[0.6875rem] text-ink-500">optional</span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[0.75rem] text-seal-400">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-2 text-[0.8125rem] transition-all duration-200",
        active
          ? "bg-ember-400/14 text-ember-200 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ember-400)_32%,transparent)]"
          : "bg-ink-50/4 text-ink-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_8%,transparent)] hover:bg-ink-50/8 hover:text-ink-100",
      )}
    >
      {children}
    </button>
  );
}

function Perk({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink-50/5 text-ember-300 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-ink-50)_9%,transparent)]">
        <Icon className="size-4" />
      </span>
      <div>
        <h3 className="text-[0.9375rem] font-medium text-ink-50">{title}</h3>
        <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-500">
          {body}
        </p>
      </div>
    </div>
  );
}

