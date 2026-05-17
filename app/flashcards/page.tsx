"use client";

import { useState } from "react";
import { AppShell } from "@/components/app/app-shell";

const flashcards = [
  {
    front: "What is supervised learning?",
    back: "A machine learning approach where a model learns from labeled examples with known target outputs.",
    difficulty: "Easy",
    topic: "Model basics",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    front: "Why can overfitting reduce real-world performance?",
    back: "The model memorizes training examples too closely, so it struggles to generalize when it sees new data.",
    difficulty: "Medium",
    topic: "Evaluation",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    front: "What does gradient descent optimize?",
    back: "It updates model parameters step by step to reduce the loss function and improve predictions.",
    difficulty: "Hard",
    topic: "Training",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    front: "What is the purpose of a validation set?",
    back: "It helps tune model choices and estimate performance before using the final test set.",
    difficulty: "Medium",
    topic: "Workflow",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

function CardIcon() {
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
      <rect width="16" height="12" x="4" y="6" rx="2" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </svg>
  );
}

function FlashcardsContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [remembered, setRemembered] = useState(2);
  const [reviewAgain, setReviewAgain] = useState(1);
  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  function moveToNext() {
    setCurrentIndex((current) => (current + 1) % flashcards.length);
    setIsFlipped(false);
  }

  function handleRemembered() {
    setRemembered((count) => count + 1);
    moveToNext();
  }

  function handleReviewAgain() {
    setReviewAgain((count) => count + 1);
    moveToNext();
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_32rem)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Frontend practice mode
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Flashcard practice
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                Review AI-generated study cards, flip to reveal answers, and sort each card into remembered or review again using mock data.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Session progress
              </p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-foreground">
                    {currentIndex + 1}/{flashcards.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">Current card</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${currentCard.tone}`}>
                  {currentCard.difficulty}
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_22rem]">
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <CardIcon />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Main flashcard</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Tap the card to flip between question and answer</p>
              </div>
            </div>
            <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {currentCard.topic}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsFlipped((value) => !value)}
            className="mt-6 flex min-h-[20rem] w-full items-center justify-center rounded-3xl border border-border bg-muted/20 p-6 text-center shadow-sm transition hover:border-accent/50 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[26rem] sm:p-10"
            aria-label="Flip flashcard"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {isFlipped ? "Answer" : "Question"}
              </p>
              <p className="mt-4 text-xl font-semibold leading-8 text-foreground sm:text-3xl sm:leading-10">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
              <p className="mt-6 text-sm text-muted-foreground">
                Click to {isFlipped ? "show question" : "reveal answer"}
              </p>
            </div>
          </button>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleReviewAgain}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Review again
            </button>
            <button
              type="button"
              onClick={handleRemembered}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-medium text-accent-foreground shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Remembered
            </button>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Difficulty mix</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Mock deck distribution</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Easy · 1
              </span>
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                Medium · 2
              </span>
              <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                Hard · 1
              </span>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Practice stats</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-2xl font-semibold text-foreground">{remembered}</p>
                <p className="mt-1 text-xs text-muted-foreground">Remembered</p>
              </div>
              <div className="rounded-xl bg-muted/40 p-4">
                <p className="text-2xl font-semibold text-foreground">{reviewAgain}</p>
                <p className="mt-1 text-xs text-muted-foreground">Review again</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Deck actions</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Backend-dependent actions are disabled</p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm font-medium text-muted-foreground opacity-70"
              >
                Save progress unavailable
              </button>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground opacity-60"
              >
                Generate more cards unavailable
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <AppShell>
      <FlashcardsContent />
    </AppShell>
  );
}
