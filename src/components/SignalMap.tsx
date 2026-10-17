import { ClaimSources } from "./ClaimSources";
import type { SignalConcept } from "../types";

type Props = {
  concepts: SignalConcept[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

/** Connector geometry: each concept sits above the plate, joined by a curve. */
const CONNECTORS = [
  "M57 10 C 57 70, 95 95, 138 118",
  "M170 10 V 106",
  "M283 10 C 283 70, 245 95, 202 118",
];
const NODES = [
  { x: 57 },
  { x: 170 },
  { x: 283 },
];

/**
 * Experience 2 — a meal at the centre with three selectable concepts
 * (Hunger, Fullness, Digestion) connected to it. Buttons are real HTML
 * controls (touch + keyboard); the SVG mirrors the active concept and
 * carries the visual connection. Explanation appears below with sources.
 */
export function SignalMap({ concepts, activeId, onSelect }: Props) {
  const activeIndex = concepts.findIndex((c) => c.id === activeId);
  const active = activeIndex >= 0 ? concepts[activeIndex] : null;

  return (
    <div className="signal-map">
      <div className="signal-concepts" role="group" aria-label="Explore the signals">
        {concepts.map((concept) => (
          <button
            key={concept.id}
            type="button"
            className={`signal-concept ${concept.id === activeId ? "is-active" : ""}`}
            aria-pressed={concept.id === activeId}
            onClick={() => onSelect(concept.id)}
          >
            {concept.label}
          </button>
        ))}
      </div>

      <figure className="signal-map-figure">
        <svg viewBox="0 0 340 200" width="340" height="200" focusable="false" aria-hidden="true">
          {concepts.map((concept, i) => (
            <path
              key={concept.id}
              className={`signal-connector ${i === activeIndex ? "is-active" : ""}`}
              d={CONNECTORS[i]}
              fill="none"
              strokeWidth={i === activeIndex ? 2 : 1.5}
            />
          ))}
          {concepts.map((concept, i) => (
            <circle
              key={concept.id}
              className={`signal-node ${i === activeIndex ? "is-active" : ""}`}
              cx={NODES[i].x}
              cy={10}
              r={i === activeIndex ? 5.5 : 4}
            />
          ))}

          <g className={`signal-plate ${activeIndex >= 0 ? "is-active" : ""}`}>
            <circle cx="170" cy="150" r="44" fill="#F8F2EB" stroke="#C04E2A" strokeWidth="1.5" />
            <circle
              cx="170"
              cy="150"
              r="33"
              fill="none"
              stroke="#E6CBBD"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <circle cx="157" cy="145" r="7.5" fill="#C04E2A" />
            <circle cx="182" cy="153" r="6" fill="#661414" />
            <circle cx="166" cy="165" r="5" fill="#E6CBBD" />
          </g>
        </svg>
        <figcaption className="illustration-caption">
          Every one of these signals starts around a meal — and loops through your whole body.
        </figcaption>
      </figure>

      <div className="signal-explain" aria-live="polite">
        {active ? (
          <div key={active.id} className="signal-explain-inner">
            <span className="card-label">SIGNAL · {active.label.toUpperCase()}</span>
            <p className="signal-explain-text">{active.body}</p>
            <ClaimSources claimIds={active.claimIds} />
          </div>
        ) : (
          <div key="prompt" className="signal-explain-inner">
            <p className="signal-prompt">
              Tap Hunger, Fullness or Digestion to see how each one joins the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
