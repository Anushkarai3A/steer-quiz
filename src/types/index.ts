export type ConcernId = "regain" | "safety" | "appetite" | "fit";

export type HookAnswer = {
  id: string;
  label: string;
  /** Short, non-judgemental reply shown the moment the user picks this answer. */
  response: string;
};

export type InfoCard = {
  id: string;
  index: string;
  title: string;
  reveal: string;
  claimIds: string[];
};

export type Concern = {
  id: ConcernId;
  title: string;
  summary: string;
  takeaways: string[];
  claimIds: string[];
};

/** One selectable concept on the hunger-signals explorer (Experience 2). */
export type SignalConcept = {
  id: string;
  label: string;
  body: string;
  claimIds: string[];
};

/** One clickable step of the GLP-1 pathway (Experience 3). */
export type PathwayStep = {
  id: string;
  tag: string;
  title: string;
  detail: string;
  claimIds: string[];
};

/** Tap-to-expand card on the natural-vs-medicines screen (Experience 4). */
export type CompareCard = {
  id: string;
  label: string;
  title: string;
  teaser: string;
  body: string;
  claimIds: string[];
};

export type ScreenId = "hook" | "signals" | "glp1" | "medicines" | "concern" | "summary";
