# Daniel Diaz — Portfolio

Personal portfolio built with Next.js 16 (App Router), React 19, Tailwind CSS v4
and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
npx tsc --noEmit  # typecheck
```

## Where things live

```
app/
  layout.tsx          root layout, fonts, metadata
  page.tsx            section composition
  globals.css         design tokens + type scale
  opengraph-image.tsx generated social card
  api/contact/        contact form endpoint
components/
  ui/                 reusable primitives (Button, Card, Section, Field, …)
  layout/             navbar, background, cursor glow, scroll progress
  sections/           one file per page section
lib/
  data.ts             ALL content — edit here, not in components
  motion.ts           shared animation variants and easings
  validation.ts       contact rules, shared by client and server
  hooks/              useMounted, useActiveSection, useCopy
```

**All copy lives in `lib/data.ts`.** No component hardcodes content.

## Design system

Tokens are defined in `app/globals.css` and exposed as Tailwind utilities.

| Token | Utility | Notes |
|---|---|---|
| `--canvas` | `bg-canvas` | page background |
| `--surface` / `--card` | `bg-surface` / `bg-card` | raised surfaces |
| `--elevated` | `bg-elevated` | chips, inputs, hover fills |
| `--line` / `--line-strong` | `border-line` | hairlines |
| `--ink` / `--ink-soft` / `--muted` | `text-ink` | text hierarchy |
| `--accent` | `text-accent` | violet; used sparingly |
| `--elev-1` / `--elev-2` | `shadow-card` / `shadow-card-hover` | elevation |

Light and dark are **not** inversions of each other. Light mode separates
surfaces with shadow; dark mode uses borders and a lighter fill. Grain, grid,
bloom and image-veil intensities are per-theme tokens for the same reason.

Type is a fluid `clamp()` scale — `text-display`, `text-h1`…`text-h3`,
`text-lead`, `text-body`, `text-caption`, `text-eyebrow`. None of it needs
breakpoint overrides.

## Contact form setup

The form validates and renders with no configuration. To actually deliver mail:

1. `cp .env.example .env.local`
2. Create a free key at [resend.com](https://resend.com) → **API Keys**
3. Set `RESEND_API_KEY`
4. Verify a sending domain in Resend and set `CONTACT_FROM_EMAIL` to an address
   on it. The default `onboarding@resend.dev` only delivers to your own Resend
   account address.
5. Add the same variables in your Vercel project settings before deploying.

Until a key is present the endpoint returns 503 and the form shows a
pre-filled `mailto:` fallback, so a visitor's message is never lost.

## Before you deploy

- [ ] `personalInfo.portfolio` in `lib/data.ts` — still the placeholder Vercel URL
- [ ] `projects[].demoUrl` / `githubUrl` — empty; buttons appear once filled
- [ ] `experiences[].period` — blank; date chips appear once filled
- [ ] `galleryImages[].alt` — generic; replace with real descriptions
- [ ] `RESEND_API_KEY` set in Vercel

## Accessibility

Skip link, visible focus rings on every interactive element, a 44px minimum
touch target, `prefers-reduced-motion` honoured in both CSS and each animated
component, and a keyboard-navigable gallery lightbox with a focus trap.
