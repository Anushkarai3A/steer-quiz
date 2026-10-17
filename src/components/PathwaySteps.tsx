import { ChevronDown } from "lucide-react";
import type { PathwayStep } from "../types";

type Props = {
  steps: PathwayStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

/**
 * Experience 3 — GLP-1 in three clickable steps. The active step reveals its
 * explanation; connectors between steps fill in as the pathway is followed.
 * Height animates through grid-template-rows (no layout jank), and the global
 * reduced-motion rule collapses it to an instant change.
 */
export function PathwaySteps({ steps, activeIndex, onSelect }: Props) {
  return (
    <ol className="pathway">
      {steps.map((step, index) => {
        const open = index === activeIndex;
        return (
          <li
            key={step.id}
            className={`pathway-step ${open ? "is-active" : ""} ${index <= activeIndex ? "is-visited" : ""}`}
          >
            <div className="pathway-card">
              <button
                type="button"
                className="pathway-trigger"
                aria-expanded={open}
                aria-controls={`pathway-panel-${step.id}`}
                onClick={() => onSelect(index)}
              >
                <span className="pathway-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="pathway-copy">
                  <span className="pathway-tag">{step.tag}</span>
                  <span className="pathway-title">{step.title}</span>
                </span>
                <ChevronDown className="pathway-chevron" size={18} aria-hidden="true" />
              </button>
              <div
                className="pathway-detail"
                id={`pathway-panel-${step.id}`}
                aria-hidden={!open}
              >
                <div className="pathway-detail-inner">
                  <p>{step.detail}</p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
