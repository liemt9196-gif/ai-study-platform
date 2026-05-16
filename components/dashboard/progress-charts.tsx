import { scoreTrend, weeklyProgress } from "@/lib/dashboard-mock-data";

const maxHours = Math.max(...weeklyProgress.map((d) => d.hours));
const maxScore = Math.max(...scoreTrend);
const minScore = Math.min(...scoreTrend);
const scoreRange = maxScore - minScore || 1;

function BarChart() {
  return (
    <div className="mt-6">
      <div className="flex h-40 items-end justify-between gap-2 sm:gap-3">
        {weeklyProgress.map((day) => {
          const height = (day.hours / maxHours) * 100;
          return (
            <div
              key={day.day}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="relative flex h-32 w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-accent to-accent/60 transition-all"
                  style={{ height: `${height}%` }}
                  title={`${day.hours}h studied`}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>Study hours per day</span>
        <span>{weeklyProgress.reduce((a, d) => a + d.hours, 0).toFixed(1)}h total</span>
      </div>
    </div>
  );
}

function LineChart() {
  const width = 280;
  const height = 80;
  const padding = 4;
  const points = scoreTrend.map((score, i) => {
    const x =
      padding + (i / (scoreTrend.length - 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((score - minScore) / scoreRange) * (height - padding * 2);
    return `${x},${y}`;
  });

  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-24 w-full"
        preserveAspectRatio="none"
        aria-label="Quiz score trend over time"
        role="img"
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#scoreGradient)"
          points={`${padding},${height} ${points.join(" ")} ${width - padding},${height}`}
        />
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.join(" ")}
        />
        {scoreTrend.map((score, i) => {
          const x =
            padding + (i / (scoreTrend.length - 1)) * (width - padding * 2);
          const y =
            height -
            padding -
            ((score - minScore) / scoreRange) * (height - padding * 2);
          return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" />;
        })}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>8 sessions ago</span>
        <span className="font-medium text-foreground">{scoreTrend.at(-1)}% latest</span>
      </div>
    </div>
  );
}

export function ProgressCharts() {
  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Weekly study hours
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Time spent learning this week
          </p>
          <BarChart />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Quiz score trend
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Performance over recent sessions
          </p>
          <LineChart />
        </div>
      </div>
    </section>
  );
}
