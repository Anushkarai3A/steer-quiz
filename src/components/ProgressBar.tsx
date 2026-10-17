type Props = { value: number; step: number; total: number; label: string };

export function ProgressBar({ value, step, total, label }: Props) {
  return (
    <div className="progress-block">
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Experience progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`${label} — step ${step} of ${total}`}
      >
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <div className="progress-meta" aria-hidden="true">
        <span>{label}</span>
        <span>{step} / {total}</span>
      </div>
    </div>
  );
}
