import { RotateCcw } from "lucide-react";
import type { InfoCard } from "../types";
import { ClaimSources } from "./ClaimSources";

type Props = {
  card: InfoCard;
  open: boolean;
  onToggle: () => void;
  showSources?: boolean;
};

/**
 * "Myth Flip": tap (or keyboard-activate) a card to flip it and reveal the
 * explanation. Pure CSS 3D flip, no hover dependency, instant under
 * prefers-reduced-motion. Source links live outside the <button> so the
 * button never wraps interactive content.
 */
export function MythFlip({ card, open, onToggle, showSources = true }: Props) {
  const isMyth = card.index === "MYTH";

  return (
    <div className={`flip-card ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="flip-trigger"
        aria-expanded={open}
        aria-controls={`flip-panel-${card.id}`}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) onToggle();
        }}
      >
        <span className="flip-inner">
          <span className="flip-face flip-front" aria-hidden={open}>
            <span className="flip-head">
              <span className="card-label">{isMyth ? "MYTH" : `FIELD NOTE ${card.index}`}</span>
              <span className="flip-badge">
                TAP TO FLIP <RotateCcw size={11} aria-hidden="true" />
              </span>
            </span>
            <span className="flip-title">{card.title}</span>
            <span className="flip-hint">Tap to reveal the explanation</span>
          </span>

          <span
            className="flip-face flip-back"
            id={`flip-panel-${card.id}`}
            aria-hidden={!open}
          >
            <span className="flip-head">
              <span className="card-label">
                {isMyth ? "WHAT IS ACTUALLY GOING ON" : `FIELD NOTE ${card.index} · ${card.title}`}
              </span>
              <span className="flip-badge">TAP TO FLIP BACK</span>
            </span>
            <span className="flip-text">{card.reveal}</span>
          </span>
        </span>
      </button>

      {open && showSources && <ClaimSources claimIds={card.claimIds} />}
    </div>
  );
}
