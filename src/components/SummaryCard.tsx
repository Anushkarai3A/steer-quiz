import type { Concern } from "../types";
import { ClaimSources } from "./ClaimSources";

type Props = { concern: Concern };

export function SummaryCard({ concern }: Props) {
  return (
    <article className="summary-card" aria-labelledby="summary-title">
      <span className="notes-stamp">YOUR FIELD NOTES</span>
      <span className="card-label">YOUR QUESTION</span>
      <h2 id="summary-title">{concern.title}</h2>
      <p>{concern.summary}</p>

      <div className="summary-divider" />

      <span className="card-label">WHAT TO REMEMBER</span>
      <ul className="summary-list">
        {concern.takeaways.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="summary-footnote">
        Educational summary for your selected question — not a diagnosis or an assessment of whether
        treatment is suitable for you.
      </p>

      <ClaimSources claimIds={concern.claimIds} />
    </article>
  );
}
