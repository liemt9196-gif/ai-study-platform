const difficulties = ["Easy", "Medium", "Hard"] as const;

export function AiQuizSection() {
  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <path d="M12 3l1.5 4.5H18l-3.5 2.5 1.5 4.5L12 12l-4 2.5 1.5-4.5L6 7.5h4.5L12 3z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            AI quiz generation
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Create practice quizzes from your uploaded lectures
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="quiz-topic"
            className="text-xs font-medium text-foreground"
          >
            Topic or lecture
          </label>
          <input
            id="quiz-topic"
            type="text"
            disabled
            placeholder="e.g. Calculus — Derivatives"
            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground placeholder:text-muted-foreground/70"
          />
        </div>

        <div>
          <p className="text-xs font-medium text-foreground">Difficulty</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {difficulties.map((level) => (
              <button
                key={level}
                type="button"
                disabled
                aria-disabled="true"
                className="cursor-not-allowed rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-70"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">10 questions</span> ·
            Multiple choice · Estimated 15 min
          </p>
        </div>

        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Quiz generation will be available when AI backend is connected"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground opacity-60"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M12 3l1.5 4.5H18l-3.5 2.5 1.5 4.5L12 12l-4 2.5 1.5-4.5L6 7.5h4.5L12 3z" />
          </svg>
          Generate AI quiz
        </button>
      </div>
    </section>
  );
}
