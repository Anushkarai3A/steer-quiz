import { claimById, sourcesForClaim } from "../data/claims";

type Props = { claimIds: string[] };

/**
 * Collapsible source footer (progressive disclosure): a closed <details> by
 * default so first-time readers aren't faced with a wall of citations, one tap
 * away from the full list of links + review status.
 */
export function ClaimSources({ claimIds }: Props) {
  const claims = claimIds.map(claimById).filter((claim) => claim !== undefined);

  if (claims.length === 0) return null;

  return (
    <details className="claim-sources">
      <summary>
        SOURCES &amp; STATUS · {claims.length} {claims.length === 1 ? "CLAIM" : "CLAIMS"}
      </summary>
      <ul>
        {claims.map((claim) => (
          <li key={claim.id}>
            <span className="source-links">
              {sourcesForClaim(claim).length > 0 ? (
                sourcesForClaim(claim).map((source, index) => (
                  <span key={source.id}>
                    {index > 0 && <span aria-hidden="true"> · </span>}
                    <a href={source.url} target="_blank" rel="noreferrer noopener">
                      {source.publisher}, {source.year}
                    </a>
                  </span>
                ))
              ) : (
                <span>No external source needed — this is a product disclaimer.</span>
              )}
            </span>
            <span className="status-chips">
              <span className={`chip ${claim.status === "source-verified" ? "chip-verified" : "chip-pending"}`}>
                {claim.status === "source-verified" ? "Source checked" : "Source not yet checked"}
              </span>
              <span className="chip chip-review">Clinical review: pending</span>
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
