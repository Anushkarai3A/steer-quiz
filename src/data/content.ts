import type { CompareCard, Concern, HookAnswer, InfoCard, PathwayStep, SignalConcept } from "../types";

export const STEER_URL = "https://steerclub.com/";

/* ------------------------------------------------------------------ *
 * Experience 1 — The hook
 * ------------------------------------------------------------------ */

export const hookCopy = {
  eyebrow: "A NOTE FOR YOU",
  supporting: "Your body is more complicated than willpower alone.",
  question: "What's been on your mind lately?",
  cta: "Discover how it works",
} as const;

export const hookAnswers: HookAnswer[] = [
  {
    id: "hungry-again",
    label: "Why am I hungry again so soon?",
    response:
      "Hunger isn't simply a test of willpower. Your brain, digestive system, hormones, sleep and other factors all contribute to appetite.",
  },
  {
    id: "weight-hard",
    label: "Why does changing my weight feel so difficult?",
    response:
      "Body weight is influenced by many interacting factors, including biology, environment, health, sleep and medication. There isn't one explanation that fits everyone.",
  },
  {
    id: "body-signals",
    label: "Am I missing something about how my body works?",
    response:
      "Your body uses interconnected signals to regulate appetite and blood glucose. GLP-1 is one of the signals researchers and clinicians study.",
  },
];

/* ------------------------------------------------------------------ *
 * Experience 2 — Explore hunger signals
 * ------------------------------------------------------------------ */

/** Three tappable concepts around the meal illustration. */
export const signalConcepts: SignalConcept[] = [
  {
    id: "hunger",
    label: "Hunger",
    body:
      "Hunger builds through messages between your gut, brain and body. Hormones rise and fall around meals — and a short night or a stressful afternoon can turn up how loudly they feel.",
    claimIds: ["hunger-multisignal", "hunger-context"],
  },
  {
    id: "fullness",
    label: "Fullness",
    body:
      "After you eat, stretch and hormone signals travel from the gut to the brain. Appetite settles as those messages land — fullness is something your body reports, not something you decide.",
    claimIds: ["hunger-multisignal", "fullness-signals"],
  },
  {
    id: "digestion",
    label: "Digestion",
    body:
      "Signals from the gut reach the brain during and after a meal — how a meal moves through your digestive system is part of the conversation, not separate from it.",
    claimIds: ["digestion-signals"],
  },
];

export const revealContent = {
  headline: "Hunger isn't a character flaw.",
  body:
    "Hunger isn't one switch. Your gut, brain and body send several signals at once — and your day turns their volume up or down.",
  signalChips: ["A short night", "A stressful afternoon", "Little movement", "Your 1 PM meal"],
  version: "In short: hunger is a signal, not a scoreboard.",
  takeaway:
    "Appetite is shaped by many signals — digestion, hormones, brain, sleep, stress and more. No single hormone explains every person's hunger.",
} as const;

/* ------------------------------------------------------------------ *
 * Experience 3 — Explain GLP-1 visually (three-step pathway)
 * ------------------------------------------------------------------ */

export const pathway = {
  steps: [
    {
      id: "gut",
      tag: "STEP 1 · YOUR GUT",
      title: "GLP-1 is released by the gut in response to food.",
      detail:
        "Cells lining your gut sense a meal and release GLP-1. The signal starts in digestion — with food arriving, not with willpower.",
      claimIds: ["glp1-role"],
    },
    {
      id: "signals",
      tag: "STEP 2 · YOUR BODY'S SIGNALS",
      title: "GLP-1 acts on pathways involved in glucose regulation and appetite.",
      detail:
        "From there it travels to the pancreas, the brain and the gut itself, taking part in how your body responds to the meal.",
      claimIds: ["glp1-role", "glp1-appetite-effect"],
    },
    {
      id: "response",
      tag: "STEP 3 · THE RESPONSE",
      title:
        "GLP-1 can support glucose-dependent insulin release, slow stomach emptying, and participate in appetite regulation.",
      detail:
        "Because the insulin effect depends on glucose, it mainly comes into play when blood sugar rises after eating — and these actions are only one part of a much larger system.",
      claimIds: ["glp1-insulin", "glp1-digestion"],
    },
  ] satisfies PathwayStep[],
  takeaway:
    "GLP-1 is one of the signals involved in how your body handles food. It isn't the whole story.",
  claimIds: ["glp1-role", "glp1-appetite-effect", "glp1-insulin", "glp1-digestion"],
} as const;

/* ------------------------------------------------------------------ *
 * Experience 4 — Natural GLP-1 vs GLP-1-based medicines
 * ------------------------------------------------------------------ */

export const compareCards: CompareCard[] = [
  {
    id: "natural",
    label: "YOUR BODY'S VERSION",
    title: "Your body's natural GLP-1",
    teaser: "Released when you eat.",
    body:
      "Your gut releases GLP-1 after a meal. It takes part in glucose regulation — helping your body handle the incoming food — and carries fullness signals to your brain. This happens in everyone, whether or not treatment is ever discussed.",
    claimIds: ["glp1-role"],
  },
  {
    id: "medicine",
    label: "THE MEDICINE VERSION",
    title: "GLP-1-based medicines",
    teaser: "Act on the same pathway.",
    body:
      "Certain medicines act on the GLP-1 pathway and can affect glucose regulation, appetite and how quickly the stomach empties. Medicines in this group differ from one another — in their properties, effects, risks, indications and suitability — and they are not appropriate for everyone.",
    claimIds: ["glp1-appetite-effect", "glp1-digestion", "glp1-care"],
  },
];

/** Consolidated claims behind the comparison cards (one source block). */
export const glp1ClaimIds = [
  "glp1-role",
  "glp1-appetite-effect",
  "glp1-insulin",
  "glp1-digestion",
  "glp1-care",
  "clinical-assessment",
];

export const compareNote =
  "Treatment decisions belong with a qualified clinician — nothing here recommends, rules out or replaces a clinical conversation.";

/* ------------------------------------------------------------------ *
 * Experience 5 — Choose a concern
 * ------------------------------------------------------------------ */

export const concerns: Concern[] = [
  {
    id: "regain",
    title: "Will I regain weight if I stop treatment?",
    summary:
      "Weight regain can happen after treatment ends — how much, and for whom, varies. The evidence comes from specific trials of specific medicines, not a universal rule.",
    takeaways: [
      "Discuss any treatment change with the clinician who prescribed it.",
      "Long-term habits and a maintenance plan matter before, during and after treatment.",
      "Trial results describe averages — they cannot predict an individual's outcome.",
    ],
    claimIds: ["regain-after-stopping", "clinical-assessment"],
  },
  {
    id: "safety",
    title: "What about side effects and safety?",
    summary:
      "Every medicine has side effects, and this group has specific precautions and situations where it is not advised. Safety depends on your own health history and on the exact treatment being considered — not on a headline or a 40-second quiz.",
    takeaways: [
      "Medicines in this class can have side effects, and some people should not take them at all.",
      "A clinician can weigh benefits, risks, other medicines and alternatives against your history.",
      "Never start, change or stop a prescription treatment without medical guidance.",
    ],
    claimIds: ["glp1-care", "clinical-assessment"],
  },
  {
    id: "appetite",
    title: "How does GLP-1 affect hunger and fullness?",
    summary:
      "GLP-1 is one of several signals that shape hunger and fullness. Medicines acting on its pathway can change appetite and how much people eat — and people respond differently.",
    takeaways: [
      "Your gut, brain and hormones all report on a meal at once — GLP-1 is one voice in that conversation.",
      "Appetite changes are commonly reported with these medicines, but experiences vary between people.",
      "Sleep, stress and daily habits still move your hunger signals, medicine or not.",
    ],
    claimIds: ["glp1-appetite-effect", "hunger-multisignal", "hunger-context"],
  },
  {
    id: "fit",
    title: "How do I know whether treatment is appropriate for me?",
    summary:
      "A short interactive experience cannot determine whether any treatment is suitable for you. Nobody can — from a quiz.",
    takeaways: [
      "A clinician considers medical history, health measurements, goals and non-medication options.",
      "There are reasonable non-medication paths, and medication is never the only option on the table.",
      "You should never feel pressured into a particular treatment.",
    ],
    claimIds: ["clinical-assessment", "glp1-care"],
  },
];

/* ------------------------------------------------------------------ *
 * Experience 6 — Personalised ending
 * ------------------------------------------------------------------ */

export const closing = {
  headline: "Personal health questions deserve a personal conversation.",
  body:
    "Explore Steer's doctor-led programme and learn whether a consultation may be useful for you.",
  cta: "Explore Steer",
  disclaimer:
    "Educational information only — not a diagnosis, prescription or substitute for medical advice. Treatment decisions belong with an appropriately qualified clinician.",
} as const;

/** Three short takeaways from the journey (the concern summary lives in SummaryCard). */
export const recap = {
  label: "IN 60 SECONDS",
  lines: [
    "Hunger is a signal from your gut, brain and day — not a character flaw.",
    "GLP-1 is one of those signals: your gut releases it after food, and it helps with glucose regulation and appetite.",
    "Medicines act on the same pathway but differ from each other — and from your body's own GLP-1.",
  ],
} as const;

/** Quiet completion state for users who finish without the Steer CTA. */
export const finish = {
  label: "FINISHED",
  headline: "That's the end of the field notes.",
  body: "Nothing was sent anywhere, and there's nothing to sign up for. Your notes stay on this device.",
  linkText: "Visit steerclub.com if you're ever curious",
} as const;

/* ------------------------------------------------------------------ *
 * Shared — the myth flip (kept as a working interaction on Experience 2)
 * ------------------------------------------------------------------ */

export const mythCard: InfoCard = {
  id: "willpower-myth",
  index: "MYTH",
  title: "\u201CNeeding food again means I lack discipline.\u201D",
  reveal:
    "Hunger at 4 PM is a signal, not a character reading. Several hormones and nerve pathways report on the meal, and context \u2014 a short night, a stressful afternoon, what you ate \u2014 changes how loud that report feels. Willpower is not the only variable in the room.",
  claimIds: ["hunger-multisignal", "hunger-context", "hunger-not-diagnosis"],
};
