import { ArrowUpRight, Check } from "lucide-react";
import type { HookAnswer } from "../types";

type Props = {
  answer: HookAnswer;
  optionKey: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function AnswerCard({ answer, optionKey, selected, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      className={`answer-card ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-describedby={selected ? undefined : "answer-help"}
    >
      <span className="answer-key" aria-hidden="true">{optionKey}</span>
      <span className="answer-label">{answer.label}</span>
      <span className="answer-mark" aria-hidden="true">
        {selected ? <Check size={17} strokeWidth={2.5} /> : <ArrowUpRight size={17} />}
      </span>
      {selected && (
        <span className="answer-response">
          <span className="answer-response-dot" aria-hidden="true" />
          {answer.response}
        </span>
      )}
    </button>
  );
}
