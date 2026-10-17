# Submission — Steer Hackathon, Problem Statement 1

**Working title:** Your Body Isn't a Calculator

## The three one-liners

- **Trigger:** *"You've been trying so hard. So why does it still feel so difficult?"* — an
  empathetic opening for anyone frustrated by weight or hunger, answered with a tap instead of
  a lecture.
- **Value:** In ~45 seconds the user works through six small experiences — multi-signal hunger,
  the GLP-1 pathway, natural vs medicine versions — and gets a source-linked field note on the
  one question they actually care about (regain, safety, appetite, or fit), with no drug
  promotion and no eligibility claims.
- **Next step (optional):** "Explore Steer" → https://steerclub.com/ — a doctor-led programme,
  offered as a conversation, not a prescription.

## Deliverables

- [x] Playable web prototype (static site; `npm run build` → deploy `dist/`)
- [ ] Public URL (deploy `dist/` to Netlify/Vercel/GitHub Pages and paste here: ____________)
- [x] One-line trigger / value / next-step answers (above)
- [x] Documentation: README, USER_FLOW, CONTENT_REVIEW, ANALYTICS, SUBMISSION
- [ ] 2-minute Loom walkthrough (checklist below)
- [ ] Clinical sign-off on all claims (`docs/CONTENT_REVIEW.md` — all rows currently *pending*)

## 2-minute Loom walkthrough — shot checklist

Record the screen at 390 × 844 (mobile emulation) plus your camera. Keep it under 2:00.

- [ ] **0:00–0:15 — Hook.** Show the headline and the three question cards. Tap one; show the
      instant in-card explanation and the **"Discover how it works"** action it creates. Say:
      *"No timers, no scores, no judgement — you move when you're ready."*
- [ ] **0:15–0:40 — Signals.** Tap Hunger, Fullness and Digestion on the signal map — show the
      illustration and the per-concept sources. Read the short version and flip the myth card:
      *"Every claim links to a source, and every claim says clinical review is still pending."*
- [ ] **0:40–1:05 — Pathway + compare.** Walk the three pathway steps, then open both compare
      cards. Emphasise: mechanism, variation between people, no drug names, no numbers, no
      promises. Use browser back once to show history navigation.
- [ ] **1:05–1:30 — Your concern.** Show the disabled continue button, pick *"What about side
      effects and safety?"* and show the inline IN SHORT answer with sources; continue to the
      field notes. Restart and pick *"Will I regain weight if I stop treatment?"* to prove the
      summary changes per concern.
- [ ] **1:30–1:45 — Closing.** Show the recap, the optional Steer CTA (mention it opens
      steerclub.com), then tap **"I'm happy with what I learned."** to show the pressure-free
      completion panel. Mention the restart and the persistent medical disclaimer.
- [ ] **1:45–2:00 — Proof of craft.** Two sentences on accessibility (keyboard flip, reduced
      motion, 320 px layout), two on privacy (no login, no data leaves the device — open
      `localStorage` in DevTools), and one on the checks you ran (`npm run smoke`,
      `npm run audit:scroll`).

## Judging criteria — where to point the reviewer

| Criterion | Where it lives |
| --- | --- |
| Attention in 3 s | Hook screen: empathetic headline as the sole focus, three question cards as tap targets, everything above the fold at 320 px |
| Educational value in 15–60 s | Signal map → myth flip → three-step pathway → natural vs medicines → inline concern answer → personalised field note |
| Indian context | Copy written for Indian work-day routines; Steer is an Indian programme |
| Not an ad for medicines | No drug names, doses, efficacy numbers, eligibility or urgency anywhere |
| Medical accuracy | `docs/CONTENT_REVIEW.md` + in-app source links and status chips |
| Trust & safety | Persistent disclaimer, "pending clinical review" honesty, optional CTA, browser back-nav that never skips consent |
| Craft | Three new interactions (signal map, pathway accordion, compare cards), SVG illustration, 6-viewport smoke test, scroll audits, reduced motion, keyboard |

## Before you submit publicly

1. Get the clinical review done — flip every row in `docs/CONTENT_REVIEW.md`.
2. Resolve the two open copy items (C2 activity source, C3 framing statement).
3. Deploy `dist/` and verify the public URL on a real phone on cellular.
4. Re-verify https://steerclub.com/ is the intended destination.
5. Record the Loom against the checklist above.
6. If running paid ads, confirm platform policy: this is health education, not prescription-drug
   promotion, and names no medicinal product.
