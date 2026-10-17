# Analytics — anonymous, local-first, swappable

## Design stance

This is a health-education prototype shown to people who did not sign in. Therefore:

- **No third-party analytics service is used.** No network call is made with event data. The
  smoke test asserts that the only external hosts contacted in production are Google Fonts.
- **No personal data.** No name, phone number, email, medical record, IP enrichment, device
  fingerprint, free text, or precise location is collected or derived.
- **Sensitive-by-default events.** `concern_selected` records *which topic the user picked*.
  It is treated as sensitive interaction data: it is written only to this device's
  `localStorage`, never transmitted, and never joined with identifiers.
- **Transparent.** Everything recorded is readable in DevTools (`localStorage` key
  `steer:fieldnotes:events:v1`) and on `window.__steerAnalytics`.

## Event schema

| Event | Fired when | Props | Notes |
| --- | --- | --- | --- |
| `experience_started` | App mounts | — | Once per page load. |
| `hook_answer_selected` | User taps an answer on the hook | `answer`: `hungry-again` \| `weight-hard` \| `body-signals` | Anonymous topic interest, not a health fact. Re-taps before the Discover action are recorded too. |
| `signal_concept_selected` | User taps Hunger / Fullness / Digestion on the signal map | `concept`: `hunger` \| `fullness` \| `digestion` | Which idea the user explored, not a health fact. |
| `science_card_opened` | User opens a flip note (the myth card) | `card`: card id | Only fires on open, not close. |
| `pathway_step_selected` | User expands a GLP-1 pathway step | `step`: `gut` \| `signals` \| `response` | Progress through the three-step explanation. |
| `compare_card_opened` | User expands a natural-vs-medicine compare card | `card`: `natural` \| `medicine` | Only fires on open, not close. |
| `concern_selected` | User picks a concern | `concern`: `regain` \| `safety` \| `appetite` \| `fit` | Sensitive. Local only. |
| `experience_completed` | Summary screen is reached | `concern` | Fires once per completion. |
| `steer_cta_clicked` | "Explore Steer" is activated (CTA panel or finish panel) | `screen` | Outbound click only; no click ID is sent. |
| `experience_finished` | User taps "I'm happy with what I learned." on the final screen | `concern` | The pressure-free completion path — no CTA click required. |
| `experience_restarted` | Restart via header, wordmark, or "Start over" | `from`: screen id | |

## Implementation

`src/lib/analytics.ts` exposes:

```ts
track(event: AnalyticsEventName, props?: AnalyticsProps);   // never throws
getStoredEvents(): StoredEvent[];                            // capped at 200 records
clearStoredEvents();                                         // demo/testing helper
useAnalyticsAdapter(next: AnalyticsAdapter);                 // swap the backend
```

The default `localAdapter` writes `eventName {"prop":value}` strings to `localStorage`
(capped at 200 records) and mirrors them to `window.__steerAnalytics` for inspection. In dev
builds each event is also `console.debug`-ed.

### Swapping in a real provider later

1. Write an adapter: `{ name: "vendor", track: (event, props) => … }`.
2. Call `useAnalyticsAdapter(myAdapter)` once at startup.
3. Nothing else changes — call sites are already event-named.

Any real vendor must be reviewed for: data residency appropriate for Indian users, no
cross-site ad targeting on health topics, retention limits, and a published DPA. Events should
stay coarse (topic-level), and `concern_selected` should either stay local or be replaced with a
non-sensitive surrogate (e.g. `concern_selected { concern: "topic_a" }` with a mapped key that
the product team keeps private).

## How Steer could use aggregated engagement data

Once consented, first-party aggregation (not raw device logs) would answer questions like:

- **Which question do people actually care about?** A skewed split towards `regain` or
  `safety` tells the education team which follow-up field notes to write.
- **Where do people drop off?** `experience_started` → `hook_answer_selected` → … →
  `experience_completed` gives a funnel per screen without knowing anything about the person.
- **Do the explainers earn their keep?** `signal_concept_selected`, `pathway_step_selected` and
  `compare_card_opened` show which of the three explainers people actually tap — and which
  concepts are ignored, so copy can be tightened.
- **Is the CTA honest?** `steer_cta_clicked ÷ experience_completed` is a trust signal: a very
  low ratio with high completion — and a healthy share of `experience_finished` — can mean the
  ending is respectful rather than pushy. The goal is understanding, not conversion at any cost.

**Not collected, ever:** anything that could re-identify a person, any free text, any health
measure, and any event fired from a screen the user never saw.

## Verifying in the browser

```js
// In DevTools console on the running app:
JSON.parse(localStorage.getItem("steer:fieldnotes:events:v1"));
window.__steerAnalytics.events;
```

The automated check lives in `scripts/smoke.mjs`, which walks the full flow and asserts that all
eleven events are recorded.
