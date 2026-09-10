/**
 * The Local Letter mark, matching `apps/site`'s `components/Logo.tsx`.
 *
 * Two differences from the marketing site's copy: the envelope gradient darkens
 * on the light theme, where the site's amber would all but vanish against white,
 * and the disc behind the seal is painted with Nextra's own `--nextra-bg` so it
 * punches through whichever background is under it.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="26"
      height="26"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ll-mark" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ll-mark-from)" />
          <stop offset="1" stopColor="var(--ll-mark-to)" />
        </linearGradient>
      </defs>
      <rect
        x="4.9"
        y="7.9"
        width="22.2"
        height="16.2"
        rx="4.2"
        stroke="url(#ll-mark)"
        strokeWidth="1.9"
      />
      <path
        d="m6.6 10.4 7.5 6a2.9 2.9 0 0 0 3.8 0l7.5-6"
        stroke="url(#ll-mark)"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="24" cy="21.6" r="4.4" fill="rgb(var(--nextra-bg))" />
      <circle cx="24" cy="21.6" r="2.7" fill="var(--ll-seal)" />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="ll-wordmark">
      <LogoMark />
      <span>
        <b>Local Letter</b>
        <span className="ll-wordmark-suffix">Docs</span>
      </span>
    </span>
  )
}
