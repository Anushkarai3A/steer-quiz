import { Plus } from "lucide-react";
import type { CompareCard as CompareCardType } from "../types";

type Props = {
  card: CompareCardType;
  open: boolean;
  onToggle: () => void;
};

/**
 * Experience 4 — tap-to-expand comparison card. Collapsed by default so both
 * sides of the comparison are introduced before either is detailed. Content
 * stays in the DOM (animated via grid-template-rows) and is hidden from
 * assistive tech while collapsed.
 */
export function CompareCard({ card, open, onToggle }: Props) {
  return (
    <div className={`compare-card ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="compare-trigger"
        aria-expanded={open}
        aria-controls={`compare-panel-${card.id}`}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) onToggle();
        }}
      >
        <span className="compare-head">
          <span className="card-label">{card.label}</span>
          <span className="compare-title">{card.title}</span>
          <span className="compare-teaser">{card.teaser}</span>
          <span className="compare-toggle">
            {open ? "CLOSE" : "TAP TO OPEN"}
            <Plus className="compare-plus" size={13} aria-hidden="true" />
          </span>
        </span>
      </button>
      <div className="compare-detail" id={`compare-panel-${card.id}`} aria-hidden={!open}>
        <div className="compare-detail-inner">
          <p>{card.body}</p>
        </div>
      </div>
    </div>
  );
}
