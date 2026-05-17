import { AppShell } from "@/components/app/app-shell";

const keyPoints = [
  {
    title: "Core idea",
    detail:
      "Machine learning systems improve predictions by finding patterns in examples instead of following fixed rules.",
    tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Model training",
    detail:
      "Training adjusts model parameters to reduce error between predicted outputs and known answers.",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Evaluation",
    detail:
      "Validation data helps estimate performance on new material and reduces the risk of overfitting.",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

const flashcards = [
  {
    front: "What is supervised learning?",
    back: "Learning from labeled examples where each input has a known target output.",
  },
  {
    front: "What does overfitting mean?",
    back: "A model memorizes training data too closely and performs poorly on unseen data.",
  },
  {
    front: "Why split train and test data?",
    back: "To measure whether the model generalizes beyond examples it already saw.",
  },
];

const quizQuestions = [
  {
    question: "Which dataset is used to tune decisions before final testing?",
    answer: "Validation set",
  },
  {
    question: "What metric commonly measures classification correctness?",
    answer: "Accuracy",
  },
  {
    question: "What is the goal of gradient descent?",
    answer: "Minimize the loss function",
  },
];

function SparkleIcon() {
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
      <path d="M19 16l.75 2.25L22 19l-2.25.75L19 22l-.75-2.25L16 19l2.25-.75L19 16z" />
    </svg>
  );
}

function ResultPageContent() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_32rem)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                AI processing complete
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Your study pack is ready
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                The uploaded lecture was analyzed into a concise summary, high-impact study points, flashcards, and a quiz preview using mock AI results.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Generated assets
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xl font-semibold text-foreground">8</p>
                  <p className="mt-1 text-xs text-muted-foreground">Points</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xl font-semibold text-foreground">12</p>
                  <p className="mt-1 text-xs text-muted-foreground">Cards</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xl font-semibold text-foreground">10</p>
                  <p className="mt-1 text-xs text-muted-foreground">Quiz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-border bg-background p-5 shadow-sm xl:col-span-2">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <SparkleIcon />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">AI summary</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Condensed from the uploaded lecture notes
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              This lecture introduces machine learning as a way for software systems to learn patterns from data and improve predictions over time. It explains the supervised learning workflow, including data collection, feature preparation, model training, and evaluation.
            </p>
            <p>
              The most important takeaway is that model quality depends on both the training process and reliable evaluation. Separating data into training, validation, and test sets helps confirm whether performance is meaningful or only memorized from previous examples.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Processing state</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Preview of the loading skeleton users see while AI works
          </p>
          <div className="mt-5 space-y-3" aria-label="Processing skeleton preview">
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Key points</h2>
            <p className="text-sm text-muted-foreground">High-signal concepts to review first</p>
          </div>
          <span className="text-xs font-medium text-accent">Mock AI insights</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {keyPoints.map((point, index) => (
            <article key={point.title} className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${point.tone}`}>
                {index + 1}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Flashcards preview</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">First 3 of 12 generated cards</p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Study mode</span>
          </div>
          <div className="mt-5 space-y-3">
            {flashcards.map((card) => (
              <article key={card.front} className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-sm font-medium text-foreground">{card.front}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.back}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Quiz preview</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Sample questions generated from the lecture</p>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">10 questions</span>
          </div>
          <div className="mt-5 space-y-3">
            {quizQuestions.map((item, index) => (
              <article key={item.question} className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Question {index + 1}</p>
                <p className="mt-2 text-sm font-medium text-foreground">{item.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">Answer: {item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function UploadResultPage() {
  return (
    <AppShell>
      <ResultPageContent />
    </AppShell>
  );
}
