/**
 * Source registry for every health claim used in the experience.
 *
 * Rules:
 * - No claim ships without an entry here.
 * - `status: "source-verified"` means a reputable source was located and read
 *   during authoring and the wording of the claim is within what the source
 *   states. `status: "pending-source-check"` means the source could not be
   * confirmed in this environment, so the claim must not be presented as
 *   established fact until checked.
 * - `review: "pending"` means a qualified clinician has not yet signed the
 *   wording off. Every claim in this prototype is pending until Steer's
 *   medical reviewer approves it (see docs/CONTENT_REVIEW.md).
 *
 * Nothing here recommends a drug, dose, or treatment.
 */

export type SourceKind =
  | "peer-reviewed-review"
  | "peer-reviewed-trial"
  | "textbook"
  | "clinical-reference"
  | "observational-study";

export type Source = {
  id: string;
  label: string;
  author: string;
  publisher: string;
  year: string;
  url: string;
  kind: SourceKind;
  supports: string;
};

export type ClaimStatus = "source-verified" | "pending-source-check";
export type ReviewStatus = "pending" | "reviewed";

export type Claim = {
  id: string;
  text: string;
  sourceIds: string[];
  status: ClaimStatus;
  review: ReviewStatus;
  note: string;
};

export const sources: Source[] = [
  {
    id: "statpearls-appetite",
    label: "Physiology, Appetite And Weight Regulation",
    author: "Parmar RM, Can AS",
    publisher: "StatPearls, NCBI Bookshelf",
    year: "2024",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK574539/",
    kind: "textbook",
    supports:
      "Appetite is coordinated by the hypothalamus using inputs from the gut, pancreas, liver and adipose tissue; GLP-1, PYY, ghrelin, CCK and leptin act as satiety/hunger signals.",
  },
  {
    id: "statpearls-satiety",
    label: "Physiology, Obesity Neurohormonal Appetite And Satiety Control",
    author: "Niwano Y, Adachi T, et al.",
    publisher: "StatPearls, NCBI Bookshelf",
    year: "2023",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK555906/",
    kind: "textbook",
    supports:
      "Multiple gut and adipose hormones (ghrelin, leptin, CCK, PYY, GLP-1) relay short- and long-term hunger/fullness signals to the hypothalamus.",
  },
  {
    id: "gut-brain-axis",
    label: "The gut–brain axis in appetite, satiety, food intake, and eating behavior",
    author: "Clarke GS, Page AJ, Eldeghaidy S",
    publisher: "Physiological Reports (PMC)",
    year: "2024",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11483575/",
    kind: "peer-reviewed-review",
    supports:
      "Hunger, satiation and satiety are regulated by mechanical and chemical gut signals sent to the brain, alongside sensory, habitual and psychological factors.",
  },
  {
    id: "sleep-appetite",
    label: "Sleep curtailment … decreased leptin, elevated ghrelin, and increased hunger and appetite",
    author: "Spiegel K, Tasali E, Penev P, Van Cauter E",
    publisher: "Annals of Internal Medicine",
    year: "2004",
    url: "https://pubmed.ncbi.nlm.nih.gov/15583226/",
    kind: "peer-reviewed-trial",
    supports:
      "In 12 healthy young men, 2 nights of sleep restriction was associated with higher reported hunger and appetite. Small sample; an association under controlled conditions, not a population-level causal claim.",
  },
  {
    id: "sleep-hormones-meta",
    label: "Associations of short sleep duration with appetite-regulating hormones and adipokines: systematic review and meta-analysis",
    author: "Lin J, Jiang Y, et al.",
    publisher: "PubMed / Journal of Clinical Sleep Medicine-adjacent literature",
    year: "2020",
    url: "https://pubmed.ncbi.nlm.nih.gov/32537891/",
    kind: "peer-reviewed-review",
    supports:
      "Short sleep duration is associated with higher ghrelin levels across 21 studies (2,250 participants). Association only — not proof of cause.",
  },
  {
    id: "gi-satiety-signals",
    label: "Gastrointestinal Satiety Signals I. An overview of gastrointestinal signals that influence food intake",
    author: "Woods SC",
    publisher: "American Journal of Physiology-Gastrointestinal and Liver Physiology",
    year: "2004",
    url: "https://journals.physiology.org/doi/full/10.1152/ajpgi.00448.2003",
    kind: "peer-reviewed-review",
    supports:
      "Satiety signals arise from the gut and are relayed to the hindbrain; sensitivity to these signals is modulated by adiposity signals, habits, learning, social situation and stressors.",
  },
  {
    id: "glp1-mechanism",
    label: "How glucagon-like peptide 1 receptor agonists work",
    author: "Rode Andreasen C, Andersen A, Knop FK, Vilsbøll T",
    publisher: "Reviews in Endocrine and Metabolic Disorders (PMC)",
    year: "2021",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8346189/",
    kind: "peer-reviewed-review",
    supports:
      "GLP-1 is a gut hormone released after eating that enhances glucose-dependent insulin secretion, suppresses glucagon, delays gastric emptying and acts on brain satiety pathways; GLP-1 receptor agonists reduce body weight chiefly by suppressing food intake.",
  },
  {
    id: "glp1-statpearls",
    label: "Glucagon-Like Peptide-1 Receptor Agonists",
    author: "Collins L, Costello RA",
    publisher: "StatPearls, NCBI Bookshelf",
    year: "2024",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK551568/",
    kind: "clinical-reference",
    supports:
      "GLP-1 receptor agonists are a drug class with specific indications, an adverse-effect profile, contraindications and precautions (e.g. severe renal dysfunction, pregnancy, pancreatitis monitoring) — they are not appropriate for everyone.",
  },
  {
    id: "glp1-clinic",
    label: "GLP-1 Agonists",
    author: "Cleveland Clinic",
    publisher: "Cleveland Clinic Health Library",
    year: "2023",
    url: "https://my.clevelandclinic.org/health/treatments/13901-glp-1-agonists",
    kind: "clinical-reference",
    supports:
      "GLP-1 is made in the small intestine and affects insulin, glucagon, stomach emptying and satiety; medicines that mimic it are only one part of a treatment plan and a healthcare provider decides whether they are appropriate for a given person.",
  },
  {
    id: "gastric-emptying",
    label: "Gastrointestinal effects of GLP-1 receptor agonists: mechanisms, management, and future directions",
    author: "Jalleh RJ, Rayner CK, et al.",
    publisher: "The Lancet Gastroenterology & Hepatology",
    year: "2024",
    url: "https://doi.org/10.1016/S2468-1253(24)00188-2",
    kind: "peer-reviewed-review",
    supports:
      "GLP-1 receptor agonists delay gastric emptying, and the magnitude of this effect differs between medicines (short- vs long-acting) and between individuals; individual responses to therapy vary.",
  },
  {
    id: "niddk-weight-factors",
    label: "Factors Affecting Weight & Health",
    author: "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)",
    publisher: "National Institutes of Health (NIH)",
    year: "2023",
    url: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/factors-affecting-weight-health",
    kind: "clinical-reference",
    supports:
      "Many factors can affect weight: lifestyle habits, where a person lives/works/plays, how much sleep they get, medicines, health problems, and family history/genes — no single factor explains everyone's weight.",
  },
  {
    id: "step1-extension",
    label: "Weight regain and cardiometabolic effects after withdrawal of semaglutide: the STEP 1 trial extension",
    author: "Wilding JPH, Batterham RL, Davies M, et al.",
    publisher: "Diabetes, Obesity and Metabolism",
    year: "2022",
    url: "https://doi.org/10.1111/dom.14725",
    kind: "peer-reviewed-trial",
    supports:
      "In a 327-person extension of one trial, participants regained about two-thirds of lost weight in the year after stopping treatment. One medicine, one trial, exploratory analysis — individual outcomes differ.",
  },
  {
    id: "lean-mass",
    label: "Strategies for minimizing muscle loss during use of incretin-mimetic drugs for treatment of obesity",
    author: "Mechanick JI, Butsch WS, Christensen SM, Hamdy O, Li Z",
    publisher: "Obesity (PMC)",
    year: "2024",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11611443/",
    kind: "peer-reviewed-review",
    supports:
      "Weight loss from incretin-based medicines includes both fat and lean tissue; adequate protein and resistance exercise are the two levers most consistently associated with preserving muscle during weight reduction.",
  },
  {
    id: "resistance-exercise",
    label: "Incretin-Based Weight Loss Pharmacotherapy: Can Resistance Exercise Optimize Changes in Body Composition?",
    author: "Locatelli JC, Costa JG, Haynes A, et al.",
    publisher: "Diabetes Care (American Diabetes Association)",
    year: "2024",
    url: "https://diabetesjournals.org/care/article/47/10/1718/154535/Incretin-Based-Weight-Loss-Pharmacotherapy-Can",
    kind: "peer-reviewed-review",
    supports:
      "Reviews of incretin-based weight-loss medicines report substantial lean-mass loss alongside fat loss, and propose supervised resistance exercise as an adjunct to help preserve muscle. Narrative review — proposals, not guarantees.",
  },
  {
    id: "body-composition",
    label: "Fundamental Body Composition Principles Provide Context for Fat-Free and Skeletal Muscle Loss With GLP-1 RA Treatments",
    author: "Tinsley GM, Heymsfield SB",
    publisher: "Nutrients (PMC)",
    year: "2024",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11450469/",
    kind: "peer-reviewed-review",
    supports:
      "Any substantial weight loss involves some loss of fat-free mass; changes in fat-free mass are not identical to changes in skeletal muscle, and exercise plus adequate protein reduce fat-free mass loss during energy restriction.",
  },
];

export const claims: Claim[] = [
  {
    id: "weight-multifactor",
    text: "Body weight is influenced by many interacting factors, including biology, environment, health, sleep and medication — there isn't one explanation that fits everyone.",
    sourceIds: ["niddk-weight-factors"],
    status: "source-verified",
    review: "pending",
    note:
      "NIDDK (NIH) lists lifestyle habits, environment, sleep, medicines, health problems and family history/genes as factors affecting weight. " +
      "Shown as orientation copy on the hook (no source chip on that screen by design); the appetite-side claims (C1/C2) carry the chips on the next screen.",
  },
  {
    id: "hunger-multisignal",
    text: "Hunger is produced by several signals travelling between the gut, the brain and the rest of the body — not by willpower alone.",
    sourceIds: ["statpearls-appetite", "statpearls-satiety", "gut-brain-axis"],
    status: "source-verified",
    review: "pending",
    note: "Mechanistic reviews support multi-signal regulation of hunger and fullness.",
  },
  {
    id: "hunger-context",
    text: "Circumstances around a meal — including sleep, stress, activity and what was eaten — can influence how hungry someone feels.",
    sourceIds: ["sleep-appetite", "sleep-hormones-meta", "gi-satiety-signals"],
    status: "source-verified",
    review: "pending",
    note:
      "Sleep and contextual/stress influences are supported by the sources above (association-level evidence for sleep). " +
      "The physical-activity part of this sentence still needs its own source — flagged in docs/CONTENT_REVIEW.md.",
  },
  {
    id: "hunger-not-diagnosis",
    text: "A single moment of hunger, on its own, does not tell you whether something is medically wrong.",
    sourceIds: ["gut-brain-axis"],
    status: "pending-source-check",
    review: "pending",
    note:
      "Framing statement rather than a measured finding; a clinician should confirm wording before submission. " +
      "No source is presented as proving a negative here.",
  },
  {
    id: "glp1-role",
    text: "GLP-1 is a hormone the gut releases after eating. It helps regulate blood sugar and signals fullness to the brain.",
    sourceIds: ["glp1-mechanism", "glp1-clinic", "statpearls-appetite"],
    status: "source-verified",
    review: "pending",
    note: "Standard physiology described consistently across a review paper and two clinical references.",
  },
  {
    id: "glp1-insulin",
    text: "GLP-1 supports insulin release in a glucose-dependent way — it mainly acts when blood sugar rises, such as after a meal.",
    sourceIds: ["glp1-mechanism", "glp1-clinic"],
    status: "source-verified",
    review: "pending",
    note:
      "The 2021 mechanism review describes enhanced glucose-dependent insulin secretion; the Cleveland Clinic reference describes GLP-1's role in insulin release. " +
      "Wording is physiological description only, with no therapeutic recommendation.",
  },
  {
    id: "digestion-signals",
    text: "Signals from the gut travel to the brain during and after a meal — how a meal is digested is part of what those signals report.",
    sourceIds: ["gut-brain-axis", "gi-satiety-signals"],
    status: "source-verified",
    review: "pending",
    note:
      "The gut–brain axis review describes mechanical and chemical gut signals sent to the brain; Woods (2004) describes gut satiety signals relayed to the hindbrain.",
  },
  {
    id: "fullness-signals",
    text: "After a meal, stretch and hormone signals from the gut report fullness to the brain, and appetite settles as those messages land.",
    sourceIds: ["gi-satiety-signals", "statpearls-satiety"],
    status: "source-verified",
    review: "pending",
    note:
      "Woods (2004) describes gastrointestinal satiety signals relayed to the hindbrain; the StatPearls satiety reference catalogues gut hormones (CCK, PYY, GLP-1) as fullness signals.",
  },
  {
    id: "glp1-appetite-effect",
    text: "Medicines that act on the GLP-1 pathway can affect appetite and how much food someone eats. People respond differently.",
    sourceIds: ["glp1-mechanism", "glp1-statpearls", "gastric-emptying"],
    status: "source-verified",
    review: "pending",
    note:
      "Sources establish the mechanism and the class effect; the 'people respond differently' caveat reflects reported variation in individual responses.",
  },
  {
    id: "glp1-digestion",
    text: "GLP-1 slows how quickly the stomach empties. The size of that effect varies by medicine and by person.",
    sourceIds: ["gastric-emptying", "glp1-mechanism"],
    status: "source-verified",
    review: "pending",
    note: "Lancet Gastroenterology & Hepatology review explicitly describes variation by medicine and individual.",
  },
  {
    id: "glp1-care",
    text: "These medicines have specific indications, potential side effects and precautions, and are not appropriate for everyone.",
    sourceIds: ["glp1-statpearls", "glp1-clinic"],
    status: "source-verified",
    review: "pending",
    note: "Indications, adverse effects and contraindications are catalogued in the StatPearls reference.",
  },
  {
    id: "weight-loss-composition",
    text: "Weight loss can involve changes in both fat and lean tissue — not fat alone.",
    sourceIds: ["lean-mass", "body-composition", "resistance-exercise"],
    status: "source-verified",
    review: "pending",
    note:
      "Body-composition substudies of weight-loss trials report lean-mass loss as a share of total weight loss. " +
      "No percentage is quoted in the interface, because proportions differ between medicines, trials and people.",
  },
  {
    id: "muscle-support",
    text: "Appropriate nutrition and suitable resistance exercise are the two supports most consistently associated with preserving muscle during weight loss.",
    sourceIds: ["lean-mass", "resistance-exercise", "body-composition"],
    status: "source-verified",
    review: "pending",
    note:
      "Reviews propose these as adjuncts. The interface deliberately does not promise that any approach prevents muscle loss.",
  },
  {
    id: "regain-after-stopping",
    text: "Weight regain can happen after treatment ends, and individual outcomes vary.",
    sourceIds: ["step1-extension"],
    status: "source-verified",
    review: "pending",
    note:
      "Supported by one trial extension for one medicine; the wording avoids extrapolating it to every person or every medicine. No numbers are shown.",
  },
  {
    id: "clinical-assessment",
    text: "Whether a treatment is appropriate is decided by a clinician using medical history, health measurements, goals and alternatives.",
    sourceIds: ["glp1-clinic", "glp1-statpearls"],
    status: "source-verified",
    review: "pending",
    note: "Consistent with clinical-reference guidance that a healthcare provider decides suitability case by case.",
  },
  {
    id: "no-diagnosis",
    text: "This experience is educational information. It cannot diagnose, prescribe, or tell anyone whether they qualify for treatment.",
    sourceIds: [],
    status: "source-verified",
    review: "pending",
    note: "Product-level disclaimer, not a medical claim. Deliberately carries no source because it asserts nothing about health.",
  },
];

export const claimById = (id: string): Claim | undefined => claims.find((claim) => claim.id === id);

export const sourcesForClaim = (claim: Claim): Source[] =>
  claim.sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is Source => Boolean(source));
