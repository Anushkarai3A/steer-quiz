import { Check } from "lucide-react";
import type { Concern } from "../types";

type Props = { concern: Concern; selected: boolean; onClick: () => void };

export function ConcernCard({ concern, selected, onClick }: Props) {
  return (
    <button
      type="button"
      className={`concern-card ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="concern-title">{concern.title}</span>
      <span className={`concern-mark ${selected ? "is-on" : ""}`} aria-hidden="true">
        <Check size={14} strokeWidth={3} />
      </span>
      <span className="sr-only">{selected ? " — selected" : ""}</span>
    </button>
  );
}
