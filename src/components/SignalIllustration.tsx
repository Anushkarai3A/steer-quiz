/**
 * Lightweight SVG illustration: signals travelling between gut and brain.
 * No images, no video — one inline SVG plus CSS animation.
 * Honours prefers-reduced-motion via the global reduced-motion rule.
 */
export function SignalIllustration() {
  return (
    <figure className="illustration" role="img" aria-label="Animated diagram: signals travelling between the gut and the brain">
      <svg viewBox="0 0 340 168" width="340" height="168" focusable="false" aria-hidden="true">
        <path
          className="signal-track"
          d="M84 62 C 132 30, 208 94, 256 62"
          fill="none"
          stroke="#E6CBBD"
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />
        <path
          className="signal-track"
          d="M84 106 C 132 138, 208 74, 256 106"
          fill="none"
          stroke="#E6CBBD"
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />

        <g className="pulse pulse-a">
          <circle r="4.5" cx="0" cy="0" fill="#C04E2A" />
        </g>
        <g className="pulse pulse-b">
          <circle r="3.5" cx="0" cy="0" fill="#661414" />
        </g>
        <g className="pulse pulse-c">
          <circle r="3.5" cx="0" cy="0" fill="#C04E2A" opacity="0.75" />
        </g>

        <g className="node node-gut">
          <circle cx="52" cy="84" r="30" fill="#F8F2EB" stroke="#C04E2A" strokeWidth="1.5" />
          <text x="52" y="89" textAnchor="middle" className="node-label">gut</text>
        </g>

        <g className="node node-brain">
          <circle cx="288" cy="84" r="30" fill="#661414" stroke="#661414" strokeWidth="1.5" />
          <text x="288" y="89" textAnchor="middle" className="node-label node-label-invert">brain</text>
        </g>

        <text x="170" y="34" textAnchor="middle" className="track-label">hunger signals</text>
        <text x="170" y="144" textAnchor="middle" className="track-label">fullness signals</text>
      </svg>
      <figcaption className="illustration-caption">
        Signals move both ways: the gut reports on the meal, the brain reports back on appetite.
      </figcaption>
    </figure>
  );
}
