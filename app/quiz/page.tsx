"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/app-shell";

const quizQuestions = [
  {
    question: "What is the main goal of supervised learning?",
    topic: "Model basics",
    difficulty: "Easy",
    options: [
      "Learn from labeled examples",
      "Cluster data without labels",
      "Encrypt training data",
      "Replace evaluation metrics",
    ],
    correctAnswer: "Learn from labeled examples",
    explanation:
      "Supervised learning trains a model using examples that include both inputs and known target outputs.",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    question: "Which signal most clearly suggests overfitting?",
    topic: "Evaluation",
    difficulty: "Medium",
    options: [
      "Low training and low validation accuracy",
      "High training accuracy but lower validation accuracy",
      "Equal training and validation accuracy",
      "No difference between datasets",
    ],
    correctAnswer: "High training accuracy but lower validation accuracy",
    explanation:
      "Overfitting often appears when a model performs very well on training data but generalizes poorly to validation data.",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    question: "What does gradient descent try to minimize?",
    topic: "Training",
    difficulty: "Hard",
    options: ["The loss function", "The dataset size", "The number of features", "The validation split"],
    correctAnswer: "The loss function",
    explanation:
      "Gradient descent updates model parameters in the direction that reduces the loss function over time.",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    question: "Why is a test set used after training and validation?",
    topic: "Workflow",
    difficulty: "Medium",
    options: [
      "To tune hyperparameters repeatedly",
      "To provide a final estimate on unseen data",
      "To increase the number of labels",
      "To remove incorrect answers",
    ],
    correctAnswer: "To provide a final estimate on unseen data",
    explanation:
      "The test set is held back until the end so it can estimate how well the final model performs on unseen examples.",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

function QuizIcon() {
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
      <path d="M9 11l2 2 4-4" />
      <path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function QuizContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const currentQuestion = quizQuestions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;
  const score = useMemo(
    () =>
      quizQuestions.reduce((total, question, index) => {
        return selectedAnswers[index] === question.correctAnswer ? total + 1 : total;
      }, 0),
    [selectedAnswers],
  );

  function selectAnswer(answer: string) {
    setSelectedAnswers((answers) => ({ ...answers, [currentIndex]: answer }));
  }

  function goToNext() {
    if (currentIndex === quizQuestions.length - 1) {
      setShowResults(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  function restartQuiz() {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
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
                Mock quiz session
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Quiz practice
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                Test your understanding with multiple choice questions, instant explanations, and a final result summary using frontend-only mock data.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Time remaining
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">12:45</p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Timer UI
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[58%] rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_22rem]">
        <section className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6">
          {!showResults ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <QuizIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Question {currentIndex + 1} of {quizQuestions.length}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold leading-8 text-foreground sm:text-2xl">
                      {currentQuestion.question}
                    </h2>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${currentQuestion.tone}`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {currentQuestion.topic}
                  </span>
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const shouldShowCorrect = Boolean(selectedAnswer) && isCorrect;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(option)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isSelected
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-border bg-muted/20 text-foreground hover:bg-muted/40"
                      } ${shouldShowCorrect ? "border-emerald-500 bg-emerald-500/10" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <section className="mt-6 rounded-xl border border-border bg-muted/20 p-4">
                <h3 className="text-sm font-semibold text-foreground">Answer explanation</h3>
                {selectedAnswer ? (
                  <div className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                    <p>
                      Your answer: <span className="font-medium text-foreground">{selectedAnswer}</span>
                    </p>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Select an answer to reveal the explanation panel.
                  </p>
                )}
              </section>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {answeredCount} of {quizQuestions.length} answered
                </p>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={!selectedAnswer}
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-foreground shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {currentIndex === quizQuestions.length - 1 ? "View results" : "Next question"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[30rem] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <QuizIcon />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-foreground">Final result summary</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                You answered {score} out of {quizQuestions.length} questions correctly in this mock practice session.
              </p>
              <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-2xl font-semibold text-foreground">{score}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Correct</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-2xl font-semibold text-foreground">{quizQuestions.length - score}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Review</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-2xl font-semibold text-foreground">{Math.round((score / quizQuestions.length) * 100)}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">Score</p>
                </div>
              </div>
              <button
                type="button"
                onClick={restartQuiz}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-medium text-accent-foreground shadow-sm hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Restart mock quiz
              </button>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Quiz progress</h2>
            <div className="mt-4 space-y-3">
              {quizQuestions.map((question, index) => {
                const isAnswered = Boolean(selectedAnswers[index]);
                const isCurrent = index === currentIndex && !showResults;

                return (
                  <div
                    key={question.question}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                      isCurrent
                        ? "border-accent bg-accent/10"
                        : "border-border bg-muted/20"
                    }`}
                  >
                    <span className="font-medium text-foreground">Question {index + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {isAnswered ? "Answered" : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Difficulty</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Mock question mix</p>
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
            <h2 className="text-base font-semibold text-foreground">Topics</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {quizQuestions.map((question) => (
                <span
                  key={question.topic}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {question.topic}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <AppShell>
      <QuizContent />
    </AppShell>
  );
}
