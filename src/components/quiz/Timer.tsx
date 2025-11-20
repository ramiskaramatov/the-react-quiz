type TimerProps = {
  secondsRemaining: number;
  totalSeconds: number;
};

const radius = 32;
const circumference = 2 * Math.PI * radius;
const STROKE_WIDTH = 4;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Timer({ secondsRemaining, totalSeconds }: TimerProps) {
  if (totalSeconds <= 0) return null;

  const progress = Math.max(0, Math.min(1, secondsRemaining / totalSeconds));
  const dashOffset = circumference * (1 - progress);
  const isCritical = secondsRemaining <= Math.max(10, Math.floor(totalSeconds * 0.1));

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={STROKE_WIDTH}
          className="text-slate-600"
          stroke="currentColor"
          fill="transparent"
          opacity="0.25"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={STROKE_WIDTH}
          className={isCritical ? "text-red-400" : "text-cyan-400"}
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 0.3s ease, color 0.3s ease",
          }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center font-mono text-xl font-semibold ${
          isCritical ? "text-red-200" : "text-slate-100"
        }`}
      >
        {formatTime(secondsRemaining)}
      </span>
    </div>
  );
}

