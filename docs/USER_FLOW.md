# User Flow — "Your Body Isn't a Calculator"

Target duration: **~45 seconds** across six experiences. Nothing auto-advances — every screen
transitions on the user's tap, and browser back returns to the previous experience. No login,
no forms, no personal data.

## 1. Hook (≈5 s) — THE QUESTION

- Eyebrow: *"A NOTE FOR YOU"*. Headline: *"You've been trying so hard. / So why does it still
  feel so difficult?"* — the sole visual focus, with the supporting line *"Your body is more
  complicated than willpower alone."* beneath it; the headline, supporting line, prompt and all
  three answers sit above the fold even at 320 × 640 (asserted in the smoke test).
- Prompt: *"What's been on your mind lately?"* over three large answer cards (A / B / C) with a
  hover/press lift and a visible arrow affordance.
- The three answers are questions, not verdicts: *hunger again soon · weight feels difficult ·
  missing something about how the body works*. No answer is scored, judged, or linked to a
  medical condition.
- Tapping an answer (whole card is the target):
  - marks it selected (rust border, tinted background, check mark),
  - shows the matching explanation **inside the card** immediately with a subtle, quick reveal
    (instant under reduced motion), e.g. *"Hunger isn't simply a test of willpower…"*,
  - shows exactly one explanation at a time; tapping another card swaps it,
  - records `hook_answer_selected { answer }` (`hungry-again` \| `weight-hard` \| `body-signals`),
  - and reveals the **"Discover how it works →"** action — there is no timer; the user can
    re-tap other answers until they continue.
- The selection is preserved if the user navigates away and comes back (browser Back), and is
  cleared only by a restart.

## 2. The signals (≈10 s) — FIELD NOTE 01

- Headline: *"Hunger isn't a character flaw."*
- **Signal Map**: three tap targets — **Hunger**, **Fullness**, **Digestion** — each driving an
  animated gut ↔ brain SVG (connectors flow toward the active node) and a keyed, `aria-live`
  explanation panel with its own source panel. Selecting a concept records
  `signal_concept_selected { concept }`.
- "The short version" paper card: hunger is multi-signal; the day adds context — made concrete
  with four chips (a short night, a stressful afternoon, little movement, the 1 PM meal).
- **Myth Flip**: tap the myth card — *"'Needing food again means I lack discipline.'"* — to flip
  it and read what is actually going on.
  - Keyboard: `Tab` to the card, `Enter`/`Space` flips, `Escape` flips back.
  - `aria-expanded` + `aria-controls` reflect state; hidden face is `aria-hidden`.
  - Under `prefers-reduced-motion` the flip is instant and all content stays reachable.
- Closing note: *"Appetite is shaped by many signals — digestion, hormones, brain, sleep,
  stress and more. No single hormone explains every person's hunger."*
- Button: **"What about GLP-1?"**

## 3. The pathway (≈10 s) — FIELD NOTE 02

- Headline: *"Your gut does more than digest food."*
- **Pathway Steps**: a three-step numbered accordion — tap any step to expand it (single active
  step; connector fills as steps are visited; chevrons rotate). Selecting a step records
  `pathway_step_selected { step }`.
  1. *STEP 1 · YOUR GUT* — "GLP-1 is released by the gut in response to food."
  2. *STEP 2 · YOUR BODY'S SIGNALS* — "GLP-1 acts on pathways involved in glucose regulation
     and appetite."
  3. *STEP 3 · THE RESPONSE* — "GLP-1 can support glucose-dependent insulin release, slow
     stomach emptying, and participate in appetite regulation."
- **Takeaway card**: *"GLP-1 is one of the signals involved in how your body handles food.
  It isn't the whole story."*
- One collapsed **"Sources & status"** panel holds the source links and review-status chips
  for the four claims behind the steps.
- Button: **"Natural GLP-1 vs medicines"**

## 4. Natural vs medicines (≈10 s) — FIELD NOTE 03

- Headline: *"One pathway, two versions."*
- Two **compare cards** — *"Your body's natural GLP-1"* and *"GLP-1-based medicines"* — tap to
  expand each (`aria-expanded`/`aria-controls`, `Escape` closes, Plus icon rotates 45°).
  Opening a card records `compare_card_opened { card }`.
- Copy stays mechanism-level: no drug names, no doses, no kilograms, no promises — the
  medicine card states the group differs in properties, effects, risks, indications and
  suitability, and is not appropriate for everyone.
- Closing note: *"Treatment decisions belong with a qualified clinician — nothing here
  recommends, rules out or replaces a clinical conversation."* One consolidated source panel
  (six claims) sits at the bottom.
- Button: **"My biggest question"** → concern screen.

## 5. Your concern (≈5 s) — FIELD NOTE 04

- Headline: *"What would you most like to understand?"*
- Four cards (single-select, `aria-pressed`, visible indicator, `concern_selected { concern }`):
  1. *"Will I regain weight if I stop treatment?"*
  2. *"What about side effects and safety?"*
  3. *"How does GLP-1 affect hunger and fullness?"*
  4. *"How do I know whether treatment is appropriate for me?"*
- Selecting a card immediately shows an inline **"IN SHORT"** panel (keyed, `aria-live`) with
  the concern-specific educational summary and its sources — the answer appears on the same
  screen, not in a later step.
- **Continue ("My takeaway") is disabled until a card is chosen** (focusable but `disabled`),
  with on-screen microcopy: *"Picking a question is a preference, not a diagnosis or an
  eligibility check."*

## 6. Field notes (≈10 s) — summary

- Headline: *"Better questions. Clearer conversations."* Staggered entrance of the recap and
  the card (kicker: *"YOUR FIELD NOTES · COMPLETE"*).
- **"IN 60 SECONDS" recap** — three numbered takeaways from the journey:

  1. Hunger is a signal from your gut, brain and day — not a character flaw.
  2. GLP-1 is one of those signals: your gut releases it after food, and it helps with glucose
     regulation and appetite.
  3. Medicines act on the same pathway but differ from each other — and from your body's own
     GLP-1.

- **"YOUR FIELD NOTES" summary card** — content generated **from the selected concern only**
  (summary line + three takeaways); four distinct versions exist:

  | Concern | Core message |
  | --- | --- |
  | Stopping | Regain can happen after treatment ends; how much, and for whom, varies; evidence comes from specific trials of specific medicines; discuss changes with the prescriber; maintenance planning matters. |
  | Safety | Every medicine has side effects; this group has precautions and situations where it is not advised; safety depends on your history and the exact treatment; never start, change or stop without guidance. |
  | Appetite | GLP-1 is one of several signals shaping hunger and fullness; medicines on this pathway can change appetite and intake; responses differ; sleep, stress and habits still matter. |
  | Suitability | A short interactive experience cannot determine suitability — nobody can, from a quiz; a clinician weighs history, measurements, goals and non-medication options; you should never feel pressured. |

- Persistent disclaimer on every screen and on the summary.
- Primary CTA panel: **Explore Steer** → https://steerclub.com/ (verified, opens in a new
  tab), records `steer_cta_clicked`, with explicitly optional copy ("Optional, and no pressure
  — you can finish here and keep the notes.").
- **"I'm happy with what I learned."** (secondary text button) completes the experience
  *without* touching the CTA: it swaps the CTA panel for a quiet completion panel ("That's the
  end of the field notes…" nothing sent, nothing to sign up for), keeps the field notes on
  screen, records `experience_finished`, and leaves only a small secondary Steer link plus
  **Start over**.
- **Start over** resets all state and records `experience_restarted`. The wordmark and the
  header restart button do the same.

## Navigation rules

- **Browser back/forward** is wired: every transition pushes history state, and `popstate`
  returns to the previous experience (guarded so a deep history entry can't skip the concern
  pick — it lands on the concern screen instead). Restart replaces the history entry so back
  after a restart returns to the hook, not the finished run.
- **Scroll resets to the top** on every screen change (document scroll; focus moves to the new
  screen's heading with `preventScroll`), verified by `npm run audit:scroll` and
  `npm run verify:scroll`.
- No nested scroll containers — the document owns the scroll position.

## UX rules applied throughout

- Mobile-first, single narrow column, 320 px+ with no horizontal overflow; the hook question
  and all answers fit above the fold at every tested mobile width.
- Every control ≥ 44 px tall; visible `:focus-visible` rings on all interactive elements.
- Screen transitions ~300 ms in / 150 ms out; skipped entirely under reduced motion.
- No hover-only affordances. Nothing auto-advances or forces the user to wait a timer out —
  including the hook, which waits for an explicit "Discover how it works".
- Selected state is never communicated by colour alone (check icon + inset border +
  `aria-pressed`); expanded panels keep collapsed content out of the accessibility tree
  (`aria-hidden`) and collapse instantly under reduced motion.
