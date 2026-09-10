import { ImageResponse } from 'next/og'

export const alt = 'Local Letter Docs — self-hosted, multi-language transactional email'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const ink = '#0a0a0c'
const ember = '#f2b45c'
const seal = '#f2705c'

// The brand mark, inlined as a data URI — Satori renders <img> reliably, where
// its support for arbitrary inline SVG children is patchier.
const mark = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="112" height="112">
    <rect width="32" height="32" rx="8" fill="${ink}"/>
    <path d="M7 11.5A2.5 2.5 0 0 1 9.5 9h13a2.5 2.5 0 0 1 2.5 2.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 7 20.5v-9Z" fill="none" stroke="${ember}" stroke-width="1.8"/>
    <path d="m7.8 11 7.2 5.6a1.6 1.6 0 0 0 2 0L24.2 11" fill="none" stroke="${ember}" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="24" cy="21" r="3.4" fill="${ink}"/>
    <circle cx="24" cy="21" r="2.4" fill="${seal}"/>
  </svg>`,
)}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: ink,
          padding: 80,
          // The ember wash the marketing site's hero carries, flattened to a
          // single gradient so it survives Satori.
          backgroundImage: `radial-gradient(900px 420px at 78% -12%, rgba(242,180,92,0.22), transparent 70%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={112} height={112} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 44, color: '#fafaf9', letterSpacing: -1 }}>Local Letter</div>
            <div style={{ fontSize: 28, color: ember, letterSpacing: 4, textTransform: 'uppercase' }}>
              Docs
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 62,
              color: '#fafaf9',
              lineHeight: 1.12,
              letterSpacing: -1.6,
            }}
          >
            <div>Transactional email that</div>
            <div>speaks every language.</div>
          </div>
          <div style={{ fontSize: 30, color: '#a8a29e', lineHeight: 1.4 }}>
            Design once, translate per locale, render from Node, Python or Go.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, color: '#78716c' }}>
          <div style={{ width: 40, height: 3, background: seal }} />
          <div>Open source · self-hosted · MIT</div>
        </div>
      </div>
    ),
    size,
  )
}
