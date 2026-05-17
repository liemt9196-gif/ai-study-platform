import { AppShell } from "@/components/app/app-shell";

const suggestedPrompts = [
  "Explain this lecture like I am new to the topic",
  "Quiz me on the most important concepts",
  "Create a 20-minute revision plan",
  "What should I memorize first?",
];

const conversation = [
  {
    role: "assistant",
    name: "AI Tutor",
    message:
      "I reviewed your selected lecture notes. We can focus on concepts, practice questions, or a quick study plan.",
  },
  {
    role: "user",
    name: "You",
    message: "Can you explain overfitting in simple terms?",
  },
  {
    role: "assistant",
    name: "AI Tutor",
    message:
      "Overfitting happens when a model memorizes the training examples instead of learning the general pattern. It may score well on old data but struggle with new questions.",
  },
  {
    role: "user",
    name: "You",
    message: "How do I know if my model is overfitting?",
  },
  {
    role: "assistant",
    name: "AI Tutor",
    message:
      "Compare training performance with validation performance. If training accuracy is high but validation accuracy drops, the model is probably overfitting.",
  },
];

function TutorIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.5 4.5H18l-3.5 2.5 1.5 4.5L12 12l-4 2.5 1.5-4.5L6 7.5h4.5L12 3z" />
      <path d="M4 19.5c2.2-1.2 4.9-1.2 8 0 3.1-1.2 5.8-1.2 8 0" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function TutorPageContent() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-8 xl:min-h-[calc(100vh-7rem)] xl:flex-row">
      <aside className="w-full space-y-6 xl:w-80 xl:shrink-0">
        <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          <div className="relative p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_22rem)]" />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <TutorIcon />
              </div>
              <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                AI Tutor
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ask questions about your selected lecture and get guided study support.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Mock chat only
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <DocumentIcon />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Selected document
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Machine Learning Basics.pdf
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Pages analyzed</span>
              <span className="font-medium text-foreground">24</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Focus topic</span>
              <span className="font-medium text-foreground">Model training</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Study level</span>
              <span className="font-medium text-foreground">Beginner</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            Suggested prompts
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Quick starts for guided study
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled
                aria-disabled="true"
                className="cursor-not-allowed rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-left text-sm text-muted-foreground opacity-80"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>
      </aside>

      <section className="flex min-h-[34rem] flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <header className="border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Tutor conversation
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Mock conversation based on the selected document
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Context-aware study help
            </span>
          </div>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto bg-muted/10 p-4 sm:p-5">
          {conversation.map((item, index) => {
            const isUser = item.role === "user";

            return (
              <article
                key={`${item.role}-${index}`}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <TutorIcon />
                  </div>
                ) : null}
                <div
                  className={`max-w-[min(100%,42rem)] rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-background text-foreground"
                  }`}
                >
                  <p
                    className={`text-xs font-medium ${
                      isUser ? "text-accent-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm leading-6">{item.message}</p>
                </div>
              </article>
            );
          })}
        </div>

        <footer className="border-t border-border bg-background p-4 sm:p-5">
          <div className="rounded-2xl border border-border bg-muted/20 p-3 focus-within:ring-2 focus-within:ring-ring">
            <label htmlFor="tutor-message" className="sr-only">
              Ask the AI tutor
            </label>
            <textarea
              id="tutor-message"
              rows={3}
              disabled
              placeholder="Ask about the selected lecture..."
              className="min-h-20 w-full resize-none bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Backend not connected. Chat input is a UI preview only.
              </p>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground opacity-60"
              >
                Backend not connected yet
              </button>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default function TutorPage() {
  return (
    <AppShell>
      <TutorPageContent />
    </AppShell>
  );
}
