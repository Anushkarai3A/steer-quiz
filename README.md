# Your Body Isn't a Calculator — Steer Hackathon, Problem Statement 1

A mobile-first, playable educational experience about hunger, appetite and GLP-1 medicines,
built for Instagram/Facebook traffic and reusable as a standalone website.

**Core hook:** *"You've been trying so hard. So why does it still feel so difficult?"* — then
one tap on *"What's been on your mind lately?"* reveals a short, non-judgemental explanation and
a **"Discover how it works →"** action into the experience.

The experience challenges the assumption that hunger is a willpower problem, explains how the
gut and brain trade hunger signals, introduces GLP-1 without hype, lets the user pick the one
question they actually care about, and answers *that* question with a sourced, personalised
field note — ending in an optional, non-pushy handoff to Steer.

Target completion time: **~45 seconds**. No login. No backend. No personal data.

---

## Main features

| Experience | What it does |
| --- | --- |
| 1. Hook (THE QUESTION) | Empathetic headline + three question cards; a tap shows the matching explanation in-card (one at a time, subtle reveal) and a **"Discover how it works"** action — nothing auto-advances, re-taps allowed. |
| 2. The signals | Tappable **Signal Map** (Hunger / Fullness / Digestion) driving an animated SVG gut↔brain illustration and per-concept source panels, "day context" chips, and a tap-to-flip **Myth Flip** card. |
| 3. The pathway | Three-step numbered **Pathway Steps** accordion (gut → body → response) with a takeaway card framing GLP-1 as one signal among many, plus one consolidated source panel. |
| 4. Natural vs medicines | Two tap-to-expand **compare cards** — your body's natural GLP-1 vs GLP-1-based medicines — with mechanism-level copy and no drug names. |
| 5. Your concern | Four questions; selecting one shows an **inline "IN SHORT" answer with sources on the same screen**; continue stays disabled until one is picked. |
| 6. Field notes | Journey recap + a summary generated from the selected concern only; optional "Explore Steer" CTA **or** a quiet "I'm happy with what I learned." path — both end with restart and the persistent disclaimer. |

- **Signal Map interaction** — three concepts, keyed `aria-live` explanation panels, animated
  SVG connectors, and per-concept sources.
- **Pathway Steps** — single-active accordion with connector fill; `aria-expanded` panels that
  leave the accessibility tree when collapsed; instant collapse under reduced motion.
- **Compare cards** — tap-to-expand (`Escape` closes), animated Plus icon, mechanism-level copy.
- **Myth Flip interaction** — CSS 3D flip, keyboard accessible (`Enter`/`Space`/`Escape`),
  `aria-expanded`/`aria-controls`, and instant (no-motion) behaviour under
  `prefers-reduced-motion`. Never hover-dependent.
- **Browser navigation** — every transition pushes history state; back/forward returns between
  experiences (guarded so history can't skip the concern pick); scroll resets to the top with
  focus moved to the new heading (`npm run audit:scroll`, `npm run verify:scroll`).
- **Concern-driven summary** — four genuinely different summaries; the app never states or
  implies eligibility for treatment.
- **Source transparency** — every health claim links to its source in the UI and in
  `docs/CONTENT_REVIEW.md`, with "source checked" and "clinical review: pending" status chips.
- **Anonymous analytics** — eleven events, local-only, documented in `docs/ANALYTICS.md`.
- **Accessibility** — semantic headings, visible focus rings, 40px+ touch targets, screen-reader
  labels, reduced-motion support, and full content availability without animation.
- **Responsive** — verified at 320 / 375 / 390 / 430 / 768 / 1280 px with no horizontal overflow.

## Technology stack

- **React 19 + TypeScript** (strict mode)
- **Vite** (static build, no env vars, no API keys)
- **Framer Motion** (screen transitions, staggered summary entrance, `useReducedMotion`)
- **Lucide React** (icons only)
- **CSS** (hand-written, brand palette; no CSS framework)
- **playwright-core** (dev-only: headless smoke test against system Chrome)

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev        # http://localhost:5173
```

## Checks, build and test

```bash
npm run build      # tsc -b && vite build  → dist/
npm run preview    # serves the production build on :4173
npm run smoke      # end-to-end smoke test (run in a second terminal while preview is up)
```

`scripts/smoke.mjs` drives the real production build in headless Chrome and asserts the full
six-experience flow (including browser back-navigation, inline concern answers, signal map,
pathway steps and compare cards), above-the-fold fit of the hook at every viewport, keyboard
access, reduced-motion behaviour, all four concern summaries, the finish-without-CTA path,
analytics events, the CTA URL, console cleanliness and the absence of third-party network calls.
It writes screenshots to `smoke-output/` (git-ignored).

## Project structure

```text
src/
├── components/
│   ├── AnswerCard.tsx        # Hook answer option (A/B/C) with selection feedback
│   ├── ClaimSources.tsx      # Collapsible source links + review-status chips
│   ├── CompareCard.tsx       # Tap-to-expand natural vs medicine card
│   ├── ConcernCard.tsx       # Selectable concern with indicator + aria-pressed
│   ├── MythFlip.tsx          # Tap-to-flip myth card
│   ├── PathwaySteps.tsx      # Three-step numbered GLP-1 pathway accordion
│   ├── ProgressBar.tsx       # Accessible animated progress
│   ├── SignalIllustration.tsx# Inline SVG gut↔brain animation
│   ├── SignalMap.tsx         # Hunger/Fullness/Digestion concept buttons + panel
│   └── SummaryCard.tsx       # "Your field notes" summary
├── data/
│   ├── claims.ts             # Every claim → sources, links, notes, review status
│   └── content.ts            # All UI copy (kept separate from components)
├── lib/
│   └── analytics.ts          # Anonymous, local-only analytics adapter
├── styles/
│   ├── app.css               # Brand + component styles
│   └── global.css            # Fonts, resets, focus, reduced-motion
├── types/index.ts
├── App.tsx                   # Flow state machine (6 experiences + history back-nav)
└── main.tsx
scripts/smoke.mjs             # End-to-end smoke test
scripts/scroll-audit.mjs      # Scroll-reset audit across every transition
scripts/verify-scroll.mjs     # Independent scroll/reset verification run
docs/
├── ANALYTICS.md              # Event schema, privacy stance, future use
├── CONTENT_REVIEW.md         # Claim → source → status review table
├── SUBMISSION.md             # Hackathon deliverables + Loom checklist
└── USER_FLOW.md              # Screen-by-screen flow and UX rules
```

## Deployment

The build is a static site — deploy `dist/` to any static host.

```bash
npm run build
# Netlify / Vercel / GitHub Pages / S3+CloudFront:
# publish directory: dist
```

No environment variables, API keys, servers or databases are required. The only outbound
network request in production is the Google Fonts stylesheet; if you prefer zero external
requests, self-host the two font files and drop the `@import` in `src/styles/global.css`.

## Analytics approach

Anonymous, local-first events (`experience_started`, `hook_answer_selected`,
`signal_concept_selected`, `science_card_opened`, `pathway_step_selected`,
`compare_card_opened`, `concern_selected`, `experience_completed`, `steer_cta_clicked`,
`experience_finished`, `experience_restarted`) are recorded through a swappable adapter into
`localStorage` and `window.__steerAnalytics`. Nothing is transmitted anywhere, and no name,
phone number, medical record or free text is collected. See `docs/ANALYTICS.md` for the schema
and how Steer could later use *aggregated* engagement data.

## Medical-content verification approach

- Every health claim is registered in `src/data/claims.ts` with its source, link, a note on what
  the source supports, a source status, and a clinical-review status.
- Sources are authoritative: peer reviews (The Lancet Gastroenterology & Hepatology, Diabetes
  Care, Reviews in Endocrine and Metabolic Disorders), trial publications (STEP 1 extension,
  *Diabetes, Obesity and Metabolism*), and clinical references (StatPearls/NCBI Bookshelf,
  Cleveland Clinic).
- No invented statistics, no percentages shown in the UI, no drug names, no dosage, no
  testimonials, no before/after imagery, no eligibility scoring.
- One claim is deliberately flagged **source not yet checked** (see `docs/CONTENT_REVIEW.md`)
  rather than presented as established fact.
- **All claims are marked "clinical review: pending"** until Steer's medical reviewer signs off.
  The in-app chips say the same thing, so the prototype never pretends to be clinically approved.

## Tools and AI assistance

- AI assistance (OpenAI coding agent) was used to draft, refactor and test this prototype,
  including the copy structure, components, styles, analytics layer, documentation and the
  end-to-end smoke test. Medical claims were mapped to sources found via live web search during
  authoring; each source was read for the specific claim it is cited against.
- Manual and automated verification: TypeScript strict build, production build, and a headless
  Chrome end-to-end smoke test across six viewports including keyboard and reduced-motion runs.

## Important

This is a hackathon **prototype for education**, not a medical device, diagnosis, prescription
or substitute for professional advice. It must not be submitted to ad platforms as a
pharmaceutical advertisement, and the copy must not be edited in ways that promise outcomes,
name prescription drugs, or imply suitability for an individual.
