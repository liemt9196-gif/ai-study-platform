type DashboardHeaderProps = {
  name?: string;
};

export function DashboardHeader({ name = "Student" }: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{today}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome back, {name}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Track your progress, review sessions, and generate AI-powered quizzes
          from your lectures.
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 sm:mt-0">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground">
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            aria-hidden
          />
          Preview mode
        </span>
      </div>
    </div>
  );
}
