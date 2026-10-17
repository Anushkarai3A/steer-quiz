import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  concerns,
  closing,
  compareCards,
  compareNote,
  finish,
  glp1ClaimIds,
  hookAnswers,
  hookCopy,
  mythCard,
  pathway,
  recap,
  revealContent,
  signalConcepts,
  STEER_URL,
} from "./data/content";
import { track } from "./lib/analytics";
import { ProgressBar } from "./components/ProgressBar";
import { AnswerCard } from "./components/AnswerCard";
import { ConcernCard } from "./components/ConcernCard";
import { MythFlip } from "./components/MythFlip";
import { SummaryCard } from "./components/SummaryCard";
import { ClaimSources } from "./components/ClaimSources";
import { SignalMap } from "./components/SignalMap";
import { PathwaySteps } from "./components/PathwaySteps";
import { CompareCard } from "./components/CompareCard";
import type { ConcernId, ScreenId } from "./types";
import "./styles/app.css";

const screenOrder: ScreenId[] = ["hook", "signals", "glp1", "medicines", "concern", "summary"];
const optionKeys = ["A", "B", "C"];

const screenLabels: Record<ScreenId, string> = {
  hook: "THE QUESTION",
  signals: "THE SIGNALS",
  glp1: "THE PATHWAY",
  medicines: "NATURAL VS MEDICINES",
  concern: "YOUR CONCERN",
  summary: "FIELD NOTES",
};

/**
 * Scrolls every scrolling container to the top-left, instantly.
 * This experience scrolls on the document (no inner overflow containers), so
 * `window` is the real container — the document fallback and the
 * `overflow-y: auto/scroll` scan keep it correct if that ever changes.
 */
function resetScrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  const root = document.scrollingElement;
  if (root && (root.scrollTop !== 0 || root.scrollLeft !== 0)) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
  }
  document.querySelectorAll<HTMLElement>(".app-shell *").forEach((el) => {
    const overflowY = getComputedStyle(el).overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollTop !== 0) {
      el.scrollTop = 0;
    }
  });
}

/**
 * Mounted once per screen: the screen wrapper in App is keyed by screen id, so
 * this mounts exactly when a new screen mounts — i.e. after AnimatePresence
 * (mode="wait") has finished the exit of the old screen, and via useLayoutEffect
 * before the new screen paints. It resets the document scroll to the top and
 * moves focus to the new screen with `preventScroll` — focus must never trigger
 * its own scroll, otherwise the browser scrolls a still-exiting screen into
 * view mid-transition (the visible "jump"). Card flips/expansions happen
 * inside an already-mounted screen and never re-run this effect.
 */
function ScrollToTopOnMount({
  screenRef,
}: {
  screenRef: RefObject<HTMLDivElement | null>;
}) {
  const isFirstMount = useRef(true);
  useLayoutEffect(() => {
    resetScrollToTop();
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    screenRef.current?.focus({ preventScroll: true });
  }, [screenRef]);
  return null;
}

export default function App() {
  const prefersReduced = useReducedMotion();
  const [screen, setScreen] = useState<ScreenId>("hook");
  const [hookAnswer, setHookAnswer] = useState<string | null>(null);
  const [concern, setConcern] = useState<ConcernId | null>(null);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const [pathwayIndex, setPathwayIndex] = useState(0);
  const [openCompare, setOpenCompare] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const screenRef = useRef<HTMLDivElement>(null);
  const concernRef = useRef<ConcernId | null>(null);

  useEffect(() => {
    concernRef.current = concern;
  }, [concern]);

  useEffect(() => {
    track("experience_started");
    // Own one history entry so browser Back moves between screens instead of
    // leaving the experience mid-journey.
    window.history.replaceState({ screen: "hook" }, "");
    const onPopState = (event: PopStateEvent) => {
      const state = event.state as { screen?: ScreenId } | null;
      let next: ScreenId = state?.screen ?? "hook";
      // Guard: the summary needs a chosen concern (state may have been reset).
      if (next === "summary" && !concernRef.current) next = "concern";
      setFinished(false);
      setScreen(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (screen === "summary") track("experience_completed", { concern: concern ?? "unknown" });
  }, [screen, concern]);

  const goTo = (next: ScreenId) => {
    if (next === screen) return;
    window.history.pushState({ screen: next }, "");
    setScreen(next);
  };

  const goNext = () => {
    const index = screenOrder.indexOf(screen);
    goTo(screenOrder[Math.min(index + 1, screenOrder.length - 1)]);
  };

  const restart = () => {
    track("experience_restarted", { from: screen });
    window.history.replaceState({ screen: "hook" }, "");
    setScreen("hook");
    setHookAnswer(null);
    setConcern(null);
    setOpenCard(null);
    setActiveConcept(null);
    setPathwayIndex(0);
    setOpenCompare([]);
    setFinished(false);
  };

  const handleHookAnswer = (id: string) => {
    setHookAnswer(id);
    track("hook_answer_selected", { answer: id });
  };

  const toggleCard = (id: string) => {
    const willOpen = openCard !== id;
    setOpenCard(willOpen ? id : null);
    if (willOpen) track("science_card_opened", { card: id });
  };

  const selectConcept = (id: string) => {
    setActiveConcept(id);
    track("signal_concept_selected", { concept: id });
  };

  const selectPathwayStep = (index: number) => {
    setPathwayIndex((current) => (current === index ? -1 : index));
    track("pathway_step_selected", { step: index + 1 });
  };

  const toggleCompare = (id: string) => {
    const willOpen = !openCompare.includes(id);
    setOpenCompare((current) =>
      willOpen ? [...current, id] : current.filter((item) => item !== id),
    );
    if (willOpen) track("compare_card_opened", { card: id });
  };

  const selectConcern = (id: ConcernId) => {
    setConcern(id);
    track("concern_selected", { concern: id });
  };

  const finishHere = () => {
    setFinished(true);
    track("experience_finished", { concern: concern ?? "unknown" });
  };

  const step = screenOrder.indexOf(screen) + 1;
  const progress = (step / screenOrder.length) * 100;
  const selectedConcern = concern ? concerns.find((item) => item.id === concern) ?? null : null;
  const summaryConcern = selectedConcern ?? concerns[0];

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReduced ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const staggerItem = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          type="button"
          className="wordmark"
          onClick={restart}
          aria-label="steer — restart the experience"
        >
          steer<span>.</span>
        </button>
        <span className="eyebrow">METABOLIC HEALTH · FIELD NOTES</span>
        <button className="icon-button" onClick={restart} aria-label="Restart experience" title="Restart">
          <RotateCcw size={17} />
        </button>
      </header>

      <section className="experience">
        <ProgressBar
          value={progress}
          step={step}
          total={screenOrder.length}
          label={screenLabels[screen]}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            ref={screenRef}
            className={`screen screen-${screen}`}
            tabIndex={-1}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
            animate={{ opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.3, ease: "easeOut" } }}
            exit={{
              opacity: 0,
              y: prefersReduced ? 0 : -8,
              transition: { duration: prefersReduced ? 0 : 0.15, ease: "easeIn" },
            }}
          >
            <ScrollToTopOnMount screenRef={screenRef} />

            {screen === "hook" && (
              <>
                <p className="kicker">{hookCopy.eyebrow}</p>
                <h1>
                  You've been trying so hard.
                  <br />
                  So why does it still feel <em>so difficult?</em>
                </h1>
                <p className="hook-support">{hookCopy.supporting}</p>
                <p className="hook-question" id="answer-help">
                  {hookCopy.question}
                </p>
                <div className="answer-list" role="group" aria-label={hookCopy.question}>
                  {hookAnswers.map((answer, index) => (
                    <AnswerCard
                      key={answer.id}
                      answer={answer}
                      optionKey={optionKeys[index]}
                      selected={hookAnswer === answer.id}
                      onClick={() => handleHookAnswer(answer.id)}
                    />
                  ))}
                </div>
                {hookAnswer && (
                  <button className="primary-button hook-continue" onClick={() => goTo("signals")}>
                    {hookCopy.cta} <ArrowRight size={17} aria-hidden="true" />
                  </button>
                )}
              </>
            )}

            {screen === "signals" && (
              <>
                <p className="kicker">FIELD NOTE 01 · THE SIGNALS</p>
                <h1>
                  Hunger isn't a <em>character flaw.</em>
                </h1>
                <p className="lede">
                  Your gut, brain and body talk to each other around every meal. Tap each signal
                  to hear its part.
                </p>
                <SignalMap
                  concepts={signalConcepts}
                  activeId={activeConcept}
                  onSelect={selectConcept}
                />
                <div className="paper-card">
                  <span className="card-label">THE SHORT VERSION</span>
                  <p className="paper-lede">{revealContent.body}</p>
                  <ul className="signal-chips" aria-label="Everyday factors that change hunger signals">
                    {revealContent.signalChips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                  <p className="paper-version">{revealContent.version}</p>
                </div>
                <MythFlip
                  card={mythCard}
                  open={openCard === mythCard.id}
                  onToggle={() => toggleCard(mythCard.id)}
                  showSources
                />
                <p className="note">{revealContent.takeaway}</p>
                <button className="primary-button" onClick={goNext}>
                  What about GLP-1? <ArrowRight size={17} aria-hidden="true" />
                </button>
              </>
            )}

            {screen === "glp1" && (
              <>
                <p className="kicker">FIELD NOTE 02 · THE PATHWAY</p>
                <h1>
                  Your gut does more than <em>digest food.</em>
                </h1>
                <p className="lede">Follow GLP-1 in three steps — tap each one.</p>
                <PathwaySteps
                  steps={pathway.steps}
                  activeIndex={pathwayIndex}
                  onSelect={selectPathwayStep}
                />
                <div className="takeaway-card">
                  <span className="card-label">TAKEAWAY</span>
                  <p>{pathway.takeaway}</p>
                </div>
                <ClaimSources claimIds={[...pathway.claimIds]} />
                <button className="primary-button" onClick={goNext}>
                  Natural GLP-1 vs medicines <ArrowRight size={17} aria-hidden="true" />
                </button>
              </>
            )}

            {screen === "medicines" && (
              <>
                <p className="kicker">FIELD NOTE 03 · NATURAL VS MEDICINES</p>
                <h1>
                  One pathway, <em>two versions.</em>
                </h1>
                <p className="lede">Tap each card to open it.</p>
                <div className="compare-grid">
                  {compareCards.map((card) => (
                    <CompareCard
                      key={card.id}
                      card={card}
                      open={openCompare.includes(card.id)}
                      onToggle={() => toggleCompare(card.id)}
                    />
                  ))}
                </div>
                <p className="note">{compareNote}</p>
                <ClaimSources claimIds={glp1ClaimIds} />
                <button className="primary-button" onClick={goNext}>
                  My biggest question <ArrowRight size={17} aria-hidden="true" />
                </button>
              </>
            )}

            {screen === "concern" && (
              <>
                <p className="kicker">FIELD NOTE 04 · YOUR QUESTIONS</p>
                <h1>
                  What would you most like to <em>understand?</em>
                </h1>
                <p className="lede">
                  Choose one. We'll write you a short educational takeaway — not a verdict on your
                  health.
                </p>
                <div className="concern-grid" role="group" aria-label="Choose a question">
                  {concerns.map((item) => (
                    <ConcernCard
                      key={item.id}
                      concern={item}
                      selected={concern === item.id}
                      onClick={() => selectConcern(item.id)}
                    />
                  ))}
                </div>
                {selectedConcern && (
                  <div
                    key={selectedConcern.id}
                    className="concern-answer"
                    aria-live="polite"
                  >
                    <span className="card-label">IN SHORT</span>
                    <p>{selectedConcern.summary}</p>
                    <ClaimSources claimIds={selectedConcern.claimIds} />
                  </div>
                )}
                <button className="primary-button" disabled={!concern} onClick={goNext}>
                  My takeaway <ArrowRight size={17} aria-hidden="true" />
                </button>
                <p className="microcopy">
                  Picking a question is a preference, not a diagnosis or an eligibility check.
                </p>
              </>
            )}

            {screen === "summary" && (
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.p className="kicker" variants={staggerItem}>
                  YOUR FIELD NOTES · COMPLETE
                </motion.p>
                <motion.h1 variants={staggerItem}>
                  Better questions. <em>Clearer conversations.</em>
                </motion.h1>

                <motion.div className="recap-card" variants={staggerItem}>
                  <span className="card-label">{recap.label}</span>
                  <ul className="recap-list">
                    {recap.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <SummaryCard concern={summaryConcern} />
                </motion.div>

                {!finished ? (
                  <>
                    <motion.div className="cta-panel" variants={staggerItem}>
                      <span className="card-label">WANT TO GO FURTHER?</span>
                      <h2>{closing.headline}</h2>
                      <p>{closing.body}</p>
                      <a
                        className="primary-button link-button"
                        href={STEER_URL}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => track("steer_cta_clicked", { screen: "summary" })}
                      >
                        {closing.cta} <ArrowRight size={17} aria-hidden="true" />
                      </a>
                      <p className="cta-aside">
                        Optional, and no pressure — you can finish here and keep the notes.
                      </p>
                    </motion.div>

                    <motion.div className="summary-actions" variants={staggerItem}>
                      <button className="text-button" onClick={finishHere}>
                        <Check size={15} aria-hidden="true" /> I'm happy with what I learned.
                      </button>
                      <button className="text-button text-button-quiet" onClick={restart}>
                        <RotateCcw size={15} aria-hidden="true" /> Start over
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div className="finish-panel" variants={staggerItem}>
                    <span className="card-label">{finish.label}</span>
                    <h2>{finish.headline}</h2>
                    <p>{finish.body}</p>
                    <p className="finish-actions">
                      <a
                        className="quiet-link"
                        href={STEER_URL}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={() => track("steer_cta_clicked", { screen: "finish" })}
                      >
                        {finish.linkText}
                      </a>
                      <button className="text-button text-button-quiet" onClick={restart}>
                        <RotateCcw size={15} aria-hidden="true" /> Start over
                      </button>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="experience-footer">
          <span>STEER · EDUCATION FIRST</span>
          <span>{step} / {screenOrder.length}</span>
        </footer>

        <p className="persistent-disclaimer">{closing.disclaimer}</p>
      </section>
    </main>
  );
}
