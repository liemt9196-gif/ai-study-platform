import type { StudySession } from "@/lib/dashboard-mock-data";

type RecentSessionsProps = {
  sessions: StudySession[];
};

const typeLabels: Record<StudySession["type"], string> = {
  quiz: "Quiz",
  lecture: "Lecture",
  review: "Review",
};

const typeStyles: Record<StudySession["type"], string> = {
  quiz: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  lecture: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  review: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Recent study sessions
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your latest quizzes, lectures, and reviews
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {sessions.length} sessions
        </span>
      </div>

      <ul className="mt-5 divide-y divide-border">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${typeStyles[session.type]}`}
                >
                  {typeLabels[session.type]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session.subject}
                </span>
              </div>
              <p className="mt-1 truncate font-medium text-foreground">
                {session.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {session.date} · {session.duration}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:text-right">
              {session.score !== null ? (
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {session.score}%
                  </p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              ) : (
                <span className="rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground">
                  In progress
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
