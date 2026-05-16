import { studyStreak } from "@/lib/dashboard-mock-data";

export function StudyStreak() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-accent/10 via-background to-background p-5 shadow-sm">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Study streak</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Keep the momentum going
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-orange-500 dark:text-orange-400">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2c1.5 3 4 5.5 4 9a4 4 0 1 1-8 0c0-3.5 2.5-6 4-9z" />
          </svg>
        </div>
      </div>

      <div className="relative mt-5 flex items-end gap-2">
        <p className="text-4xl font-bold tracking-tight text-foreground">
          {studyStreak.current}
        </p>
        <p className="mb-1.5 text-sm text-muted-foreground">day streak</p>
      </div>
      <p className="relative text-xs text-muted-foreground">
        Longest streak: {studyStreak.longest} days
      </p>

      <div className="relative mt-5 flex justify-between gap-1">
        {studyStreak.week.map((day, index) => (
          <div key={`${day.day}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={[
                "flex h-9 w-full max-w-10 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                day.completed
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "border border-dashed border-border bg-muted/50 text-muted-foreground",
              ].join(" ")}
              aria-label={`${day.day} ${day.completed ? "completed" : "not completed"}`}
            >
              {day.completed ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                day.day
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
