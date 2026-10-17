# Health Content Review — claims, sources, status

Every health statement in the interface maps to a row below. The machine-readable version of
this table lives in `src/data/claims.ts` (the app renders its source links from there), so the
UI and this document cannot drift apart silently.

**Status legend**

- **Source checked** — a reputable source was located and read during authoring, and the wording
  in the UI is within what the source states.
- **Source not yet checked** — the source could not be confirmed in the authoring environment.
  The wording must not be presented as established fact until verified; it is currently phrased
  as a cautionary framing statement, not a finding.
- **Clinical review: pending** — a qualified clinician has **not** yet approved the wording.
  Every claim in this prototype is pending. In-app chips display the same status.

**Rules enforced in the copy**

- No named prescription drugs, doses, prices or outcome promises.
- No statistics or percentages shown to users (trial figures stay in this document for
  traceability only).
- No diagnosis, eligibility statement, before/after imagery or testimonials.
- Association-level evidence is described as association, never as cause.
- Every claim that involves a specific medicine or trial is scoped ("one trial", "one medicine")
  so it is not read as a universal rule.

---

## Claim table (rendered in the UI)

### C1 — Hunger is multi-signal

> "Hunger is produced by several signals travelling between the gut, the brain and the rest of
> the body — not by willpower alone." (hook answer 1's explanation; signals screen: myth flip,
> Hunger/Fullness panels)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Parmar & Can, *Physiology, Appetite And Weight Regulation*, StatPearls/NCBI | Textbook | https://www.ncbi.nlm.nih.gov/books/NBK574539/ | Hypothalamus integrates gut, pancreas, liver and adipose inputs; GLP-1, PYY, ghrelin, CCK, leptin act as satiety/hunger signals. |
| Niwano et al., *Physiology, Obesity Neurohormonal Appetite And Satiety Control*, StatPearls/NCBI | Textbook | https://www.ncbi.nlm.nih.gov/books/NBK555906/ | Multiple gut/adipose hormones relay short- and long-term hunger/fullness signals. |
| Clarke, Page & Eldeghaidy, *The gut–brain axis in appetite, satiety…*, Physiological Reports | Peer-reviewed review | https://pmc.ncbi.nlm.nih.gov/articles/PMC11483575/ | Mechanical and chemical gut signals to the brain, plus sensory/habitual/psychological factors. |

**Status:** source checked · **Clinical review: pending**

### C2 — Context influences hunger (sleep, stress, activity, food)

> "…your day turns their volume up or down" / context chips: a short night, a stressful
> afternoon, little movement, the 1 PM meal. (signals screen: Hunger panel, paper card)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Spiegel et al., *Sleep curtailment… increased hunger and appetite*, Annals of Internal Medicine | Controlled study (n = 12 young men) | https://pubmed.ncbi.nlm.nih.gov/15583226/ | Short sleep was **associated** with higher reported hunger/appetite under controlled conditions. Small sample; not a population claim. |
| Lin et al., *Associations of short sleep duration with appetite-regulating hormones…* | Systematic review + meta-analysis | https://pubmed.ncbi.nlm.nih.gov/32537891/ | Short sleep **associated** with higher ghrelin across 21 studies (2,250 participants). Association only. |
| Woods, *Gastrointestinal Satiety Signals I*, Am. J. Physiol.-Gastrointestinal and Liver Physiology | Peer-reviewed review | https://journals.physiology.org/doi/full/10.1152/ajpgi.00448.2003 | Sensitivity to satiety signals is modulated by adiposity signals, habits, learning, social situation and stressors. |

**Status:** source checked for the sleep and stress/context elements · **Open item:**
the *physical activity* element of this claim has no dedicated source yet and must either be
sourced or removed before launch (candidate: an appetite–exercise review). **Clinical review:
pending.**

### C3 — A single moment of hunger is not a diagnosis

> "One hungry moment says nothing about your metabolism. It's information about your day." /
> myth reveal framing. (hook framing, signals screen)

**Status: SOURCE NOT YET CHECKED.** This is a negative/framing statement rather than a measured
finding; no source is cited in the UI as "proving" it. It should be reviewed by a clinician for
tone and accuracy, or reworded, before publication. **Clinical review: pending.**

### C4 — GLP-1 role (blood sugar + fullness signalling)

> "GLP-1 is a hormone the gut releases after eating. It helps regulate blood sugar and signals
> fullness to the brain." (hook answer 3's explanation, pathway step 1, natural compare card)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Rode Andreasen et al., *How GLP-1 receptor agonists work*, Rev Endocr Metab Disord | Peer-reviewed review | https://pmc.ncbi.nlm.nih.gov/articles/PMC8346189/ | GLP-1 released after eating; glucose-dependent insulin secretion, glucagon suppression, delayed gastric emptying, brain satiety pathways. |
| Cleveland Clinic, *GLP-1 Agonists* | Clinical reference | https://my.clevelandclinic.org/health/treatments/13901-glp-1-agonists | Same physiology in patient-facing language. |
| StatPearls, *Physiology, Appetite And Weight Regulation* | Textbook | https://www.ncbi.nlm.nih.gov/books/NBK574539/ | GLP-1 promotes satiety via hypothalamic nuclei and vagal afferents. |

**Status:** source checked · **Clinical review: pending**

### C5 — Glucose-dependent insulin release

> "GLP-1 supports insulin release in a glucose-dependent way — it mainly acts when blood sugar
> rises, such as after a meal." (pathway step 3)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Rode Andreasen et al. | Peer-reviewed review | https://pmc.ncbi.nlm.nih.gov/articles/PMC8346189/ | Enhanced glucose-dependent insulin secretion; glucagon suppression. |
| Cleveland Clinic, *GLP-1 Agonists* | Clinical reference | https://my.clevelandclinic.org/health/treatments/13901-glp-1-agonists | GLP-1's role in insulin release in patient-facing language. |

**Status:** source checked. Physiological description only — no therapeutic recommendation.
**Clinical review: pending**

### C6 — Digestion is part of the gut → brain conversation

> "Signals from the gut travel to the brain during and after a meal — how a meal is digested is
> part of what those signals report." (signals screen: Digestion panel)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Clarke, Page & Eldeghaidy, Physiological Reports | Peer-reviewed review | https://pmc.ncbi.nlm.nih.gov/articles/PMC11483575/ | Mechanical and chemical gut signals sent to the brain during and after eating. |
| Woods, *Gastrointestinal Satiety Signals I* | Peer-reviewed review | https://journals.physiology.org/doi/full/10.1152/ajpgi.00448.2003 | Gut satiety signals relayed to the hindbrain. |

**Status:** source checked · **Clinical review: pending**

### C7 — Fullness is reported, not decided

> "After a meal, stretch and hormone signals from the gut report fullness to the brain, and
> appetite settles as those messages land." (signals screen: Fullness panel)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Woods, *Gastrointestinal Satiety Signals I* | Peer-reviewed review | https://journals.physiology.org/doi/full/10.1152/ajpgi.00448.2003 | Gastrointestinal satiety signals relayed to the hindbrain. |
| Niwano et al., StatPearls | Textbook | https://www.ncbi.nlm.nih.gov/books/NBK555906/ | CCK, PYY, GLP-1 catalogued as fullness signals. |

**Status:** source checked · **Clinical review: pending**

### C8 — Medicines on this pathway affect appetite and intake; responses differ

> "Medicines that act on the GLP-1 pathway can affect appetite and how much food someone eats.
> People respond differently." (pathway step 2, medicine compare card, appetite concern)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Rode Andreasen et al. | Peer-reviewed review | https://pmc.ncbi.nlm.nih.gov/articles/PMC8346189/ | Weight reduction with GLP-1RAs is driven by suppression of food intake; effects differ between compounds. |
| StatPearls, *GLP-1 Receptor Agonists* | Clinical reference | https://www.ncbi.nlm.nih.gov/books/NBK551568/ | Class overview: indications, mechanism, adverse effects. |
| Jalleh et al., Lancet Gastroenterology & Hepatology | Peer-reviewed review | https://doi.org/10.1016/S2468-1253(24)00188-2 | "Individual responses to these therapies can vary." |

**Status:** source checked · **Clinical review: pending**

### C9 — Digestion: stomach emptying varies by medicine and person

> "GLP-1 slows how quickly the stomach empties. The size of that effect varies by medicine and
> by person." (pathway step 3, medicine compare card)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Jalleh et al., Lancet Gastroenterology & Hepatology | Peer-reviewed review | https://doi.org/10.1016/S2468-1253(24)00188-2 | Delayed gastric emptying differs between short- and long-acting agents; variation between individuals. |
| Rode Andreasen et al. | Peer-reviewed review | https://pmc.ncbi.nlm.nih.gov/articles/PMC8346189/ | Short-acting agents retain the gastric-emptying effect; long-acting agents show tolerance to it. |

**Status:** source checked · **Clinical review: pending**

### C10 — Indications, side effects, precautions; not for everyone

> "These medicines have specific indications, potential side effects and precautions, and are
> not appropriate for everyone." (medicine compare card, safety + suitability concerns)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| StatPearls, *GLP-1 Receptor Agonists* | Clinical reference | https://www.ncbi.nlm.nih.gov/books/NBK551568/ | Indications, adverse-effect profile, contraindications (e.g. pregnancy, severe renal dysfunction), monitoring. |
| Cleveland Clinic, *GLP-1 Agonists* | Clinical reference | https://my.clevelandclinic.org/health/treatments/13901-glp-1-agonists | "Just one part of your treatment plan… your healthcare provider can help you decide." |

**Status:** source checked · **Clinical review: pending**

### C11 — Regain can happen after stopping; outcomes vary

> "Weight regain can happen after treatment ends — how much, and for whom, varies." (regain
> concern summary + takeaways)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Wilding et al., *STEP 1 trial extension*, Diabetes, Obesity and Metabolism | Trial extension (n = 327; exploratory) | https://doi.org/10.1111/dom.14725 | One year after withdrawal, participants regained about two-thirds of prior weight loss on average. One medicine, one trial; analyses exploratory. |

**Status:** source checked. The UI shows **no numbers** and states that evidence comes from
specific trials of specific medicines. **Clinical review: pending**

### C12 — Suitability is a clinical decision

> "Whether a treatment is appropriate is decided by a clinician using medical history, health
> measurements, goals and alternatives." (regain, safety and suitability concerns)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| Cleveland Clinic, *GLP-1 Agonists* | Clinical reference | https://my.clevelandclinic.org/health/treatments/13901-glp-1-agonists | A healthcare provider decides whether these medicines are appropriate for a given person. |
| StatPearls, *GLP-1 Receptor Agonists* | Clinical reference | https://www.ncbi.nlm.nih.gov/books/NBK551568/ | Prescribing requires clinical assessment of indications and contraindications. |

**Status:** source checked · **Clinical review: pending**

### C13 — Product disclaimer (no medical claim)

> "Educational information only — not a diagnosis, prescription or substitute for medical
> advice…" (persistent footer, summary CTA panel)

No source: this asserts nothing about health. The registry entry (`no-diagnosis`) carries no
source links by design; the copy itself is rendered as the persistent disclaimer.
**Clinical review: pending** (legal/comms wording sign-off).

### C14 — Body weight is multi-factorial

> "Body weight is influenced by many interacting factors, including biology, environment,
> health, sleep and medication. There isn't one explanation that fits everyone." (hook answer 2's
> explanation)

| Source | Type | Link | What it supports |
| --- | --- | --- | --- |
| NIDDK (NIH), *Factors Affecting Weight & Health* | Clinical reference | https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/factors-affecting-weight-health | Many factors can affect weight: lifestyle habits, where a person lives/works/plays, sleep, medicines, health problems, and family history/genes. Read during authoring; page last reviewed May 2023. |

**Status:** source checked. The hook renders this as orientation copy without a source chip
(keeping the opening screen uncluttered by design); the appetite-side chips appear on the next
screen. **Clinical review: pending**

---

## Retired claims (in the registry, not currently rendered)

The muscle concern was replaced by an appetite concern in the current flow. These rows stay in
`src/data/claims.ts` so they can be re-enabled with their review history intact — they are **not
shown to users** in this build:

| Claim id | Wording | Sources | Status |
| --- | --- | --- | --- |
| `weight-loss-composition` | "Weight loss can involve changes in both fat and lean tissue — not fat alone." | lean-mass, body-composition, resistance-exercise | source checked · clinical review pending · **not rendered** |
| `muscle-support` | "Appropriate nutrition and suitable resistance exercise are the two supports most consistently associated with preserving muscle during weight loss." | lean-mass, resistance-exercise, body-composition | source checked · clinical review pending · **not rendered** |

If the muscle concern is ever restored, both rows are ready — with the standing caveat that the
UI must promise no prevention of muscle loss and quote no percentages.

---

## Pre-launch checklist

- [ ] A qualified clinician reviews every row above and flips **Clinical review** to *reviewed*.
- [ ] C2 activity element is sourced or removed.
- [ ] C3 is reworded or approved as framing language.
- [ ] Confirm the ad-platform framing: this is health **education**, not prescription-drug
      advertising; it names no medicinal product and makes no efficacy claim.
- [ ] Confirm https://steerclub.com/ remains the correct destination at submission time
      (verified reachable, HTTP 200, during authoring).
- [ ] Re-check that no new copy introduces drug names, dosages, percentages, guarantees,
      eligibility language, testimonials or before/after imagery.
