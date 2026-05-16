import type { StatCard } from "@/lib/dashboard-mock-data";

type StatsCardsProps = {
  stats: StatCard[];
};

function TrendIcon({ trend }: { trend: StatCard["trend"] }) {
  if (trend === "up") {
    return (
      <svg
        className="h-3.5 w-3.5 text-emerald-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    );
  }
  if (trend === "down") {
    return (
      <svg
        className="h-3.5 w-3.5 text-red-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }
  return (
    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" aria-hidden />
  );
}

const icons = [
  (
    <svg key="clock" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  (
    <svg key="quiz" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M9 11h6M9 15h6M9 7h6M5 3h14a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" />
    </svg>
  ),
  (
    <svg key="score" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  (
    <svg key="lecture" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {icons[index % icons.length]}
            </div>
            <TrendIcon trend={stat.trend} />
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}
