"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const BUCKET = "study-documents";
const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/plain": "TXT",
};
const ACCEPTED_EXTENSIONS = [".pdf", ".pptx", ".docx", ".txt"];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

type UploadState = "idle" | "uploading" | "success" | "error";
type ExtractState = "idle" | "extracting" | "done" | "error";
type SummaryState = "idle" | "generating" | "done" | "error";
type FlashcardState = "idle" | "generating" | "done" | "error";
type QuizState = "idle" | "generating" | "done" | "error";

type StoredFile = {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  storagePath: string;
};

type ExtractionResult = {
  extractedText: string;
  pageCount: number | null;
  fileName: string;
};

type SummaryResult = {
  summary: string;
  keyPoints: string[];
  importantConcepts: string[];
  studyTips: string[];
};

type Flashcard = {
  question: string;
  answer: string;
  difficulty: string;
  topic: string;
};

type FlashcardResult = {
  flashcards: Flashcard[];
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  topic: string;
};

type QuizResult = {
  questions: QuizQuestion[];
};

type SavedStudyData = {
  summary: SummaryResult | null;
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function fileTypeLabel(name: string): string {
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  const map: Record<string, string> = { ".pdf": "PDF", ".pptx": "PPTX", ".docx": "DOCX", ".txt": "TXT" };
  return map[ext] ?? "File";
}

function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_TYPES[file.type]) return true;
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ACCEPTED_EXTENSIONS.includes(ext);
}

function difficultyClass(difficulty: string): string {
  const normalized = difficulty.toLowerCase();
  if (normalized === "easy") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (normalized === "hard") return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
  return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

function UploadIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

type UploadDropzoneProps = {
  uploadState: UploadState;
  progress: number;
  errorMsg: string;
  lastUploadedName: string;
  dragOver: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
};

function UploadDropzone({
  uploadState,
  progress,
  errorMsg,
  lastUploadedName,
  dragOver,
  inputRef,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
}: UploadDropzoneProps) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground">1. Upload document</h2>
        <p className="text-sm text-muted-foreground">PDF, PPTX, DOCX, or TXT up to 50 MB</p>
      </div>

      {uploadState === "idle" || uploadState === "error" ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition sm:py-12 ${
            dragOver ? "border-accent bg-accent/5" : "border-border bg-muted/30 hover:border-accent/50 hover:bg-muted/40"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <UploadIcon />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">Drag & drop or click to browse</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, PPTX, DOCX, TXT up to 50 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,.pptx,.docx,.txt" onChange={onFileChange} className="sr-only" aria-label="Choose file to upload" />
        </div>
      ) : null}

      {uploadState === "uploading" ? (
        <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-accent" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{lastUploadedName}</p>
              <p className="text-xs text-muted-foreground">Uploading…</p>
            </div>
            <span className="text-sm font-semibold text-accent">{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {uploadState === "error" && errorMsg ? (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{errorMsg}</p>
        </div>
      ) : null}
    </section>
  );
}

type ExtractionPanelProps = {
  uploadState: UploadState;
  lastUploadedName: string;
  extractState: ExtractState;
  extractResult: ExtractionResult | null;
  extractError: string;
  summaryState: SummaryState;
  summaryError: string;
  flashcardState: FlashcardState;
  flashcardError: string;
  quizState: QuizState;
  quizError: string;
  onExtract: () => void;
  onSummary: () => void;
  onFlashcards: () => void;
  onQuiz: () => void;
  onReset: () => void;
};

function ExtractionPanel({
  uploadState,
  lastUploadedName,
  extractState,
  extractResult,
  extractError,
  summaryState,
  summaryError,
  flashcardState,
  flashcardError,
  quizState,
  quizError,
  onExtract,
  onSummary,
  onFlashcards,
  onQuiz,
  onReset,
}: ExtractionPanelProps) {
  if (uploadState !== "success") return null;

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckIcon />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground">2. Extract and generate</h2>
          <p className="truncate text-sm text-emerald-600 dark:text-emerald-400">{lastUploadedName} uploaded successfully</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {lastUploadedName.toLowerCase().endsWith(".pdf") && extractState !== "done" ? (
          <button type="button" onClick={onExtract} disabled={extractState === "extracting"} className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60">
            {extractState === "extracting" ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />Extracting…</> : "Extract text"}
          </button>
        ) : null}
        <button type="button" onClick={onReset} className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">
          Upload another file
        </button>
      </div>

      {extractState === "error" && extractError ? <ErrorBox message={extractError} /> : null}

      {extractState === "done" && extractResult ? (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
              {extractResult.pageCount != null ? `${extractResult.pageCount} page${extractResult.pageCount !== 1 ? "s" : ""}` : "PDF"}
            </span>
            <span className="text-muted-foreground">{extractResult.extractedText.length.toLocaleString()} characters extracted</span>
          </div>
          <div className="max-h-48 overflow-auto rounded-xl border border-border bg-background/70 p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
              {extractResult.extractedText.slice(0, 3000)}
              {extractResult.extractedText.length > 3000 ? "\n\n… (truncated)" : ""}
            </pre>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <ActionButton state={summaryState} idleLabel="Generate AI Summary" loadingLabel="Generating summary…" doneLabel="Regenerate summary" onClick={onSummary} variant="violet" />
            <ActionButton state={quizState} idleLabel="Generate Quiz" loadingLabel="Generating quiz…" doneLabel="Regenerate quiz" onClick={onQuiz} />
            <ActionButton state={flashcardState} idleLabel="Generate Flashcards" loadingLabel="Generating flashcards…" doneLabel="Regenerate flashcards" onClick={onFlashcards} variant="outline" />
          </div>
          {summaryState === "error" && summaryError ? <ErrorBox message={summaryError} /> : null}
          {flashcardState === "error" && flashcardError ? <ErrorBox message={flashcardError} /> : null}
          {quizState === "error" && quizError ? <ErrorBox message={quizError} /> : null}
        </div>
      ) : null}
    </section>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}

type ActionButtonProps = {
  state: SummaryState | FlashcardState | QuizState;
  idleLabel: string;
  loadingLabel: string;
  doneLabel: string;
  onClick: () => void;
  variant?: "accent" | "violet" | "outline";
};

function ActionButton({ state, idleLabel, loadingLabel, doneLabel, onClick, variant = "accent" }: ActionButtonProps) {
  const styles = {
    accent: "bg-accent text-accent-foreground hover:opacity-90",
    violet: "bg-violet-600 text-white hover:bg-violet-700",
    outline: "border border-border bg-background text-foreground hover:bg-muted",
  }[variant];

  return (
    <button type="button" onClick={onClick} disabled={state === "generating"} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60 ${styles}`}>
      {state === "generating" ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />{loadingLabel}</> : state === "done" ? doneLabel : idleLabel}
    </button>
  );
}

function AiSummaryPanel({ result }: { result: SummaryResult | null }) {
  if (!result) return null;

  return (
    <section className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-violet-700 dark:text-violet-300">AI summary</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">Study Summary</h2>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{result.summary}</p>

      {result.keyPoints.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground">Key Points</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {result.keyPoints.map((kp, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{i + 1}</span>
                <p className="text-sm leading-6 text-foreground">{kp}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.importantConcepts.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground">Important Concepts</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.importantConcepts.map((concept, i) => (
              <span key={i} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">{concept}</span>
            ))}
          </div>
        </div>
      ) : null}

      {result.studyTips.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground">Study Tips</h3>
          <ul className="mt-3 space-y-2">
            {result.studyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-6 text-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function FlashcardsPreview({ result, onRegenerate }: { result: FlashcardResult | null; onRegenerate: () => void }) {
  if (!result) return null;

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <SectionHeader label="AI flashcards" title="Flashcard Preview" description={`${result.flashcards.length} flashcards generated from the extracted text`} actionLabel="Regenerate" onAction={onRegenerate} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {result.flashcards.map((card, i) => (
          <article key={`${card.question}-${i}`} className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyClass(card.difficulty)}`}>{card.difficulty}</span>
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{card.topic}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-6 text-foreground">{card.question}</h3>
            <p className="mt-2 rounded-lg border border-border bg-background p-3 text-sm leading-6 text-muted-foreground">{card.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type QuizPreviewProps = {
  result: QuizResult | null;
  selectedAnswers: Record<number, string>;
  onSelectAnswer: (questionIndex: number, option: string) => void;
  onRetry: () => void;
  onRegenerate: () => void;
};

function QuizPreview({ result, selectedAnswers, onSelectAnswer, onRetry, onRegenerate }: QuizPreviewProps) {
  if (!result) return null;

  const score = result.questions.filter((question, index) => selectedAnswers[index] === question.correctAnswer).length;

  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">AI quiz</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">Quiz Preview</h2>
          <p className="mt-1 text-sm text-muted-foreground">Score: {score}/{result.questions.length} answered correctly</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onRetry} className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Retry</button>
          <button type="button" onClick={onRegenerate} className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">Regenerate</button>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {result.questions.map((question, questionIndex) => {
          const selected = selectedAnswers[questionIndex];
          const answered = Boolean(selected);

          return (
            <article key={`${question.question}-${questionIndex}`} className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyClass(question.difficulty)}`}>{question.difficulty}</span>
                <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{question.topic}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-6 text-foreground">{questionIndex + 1}. {question.question}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = question.correctAnswer === option;
                  const showResult = answered && (isSelected || isCorrect);
                  return (
                    <button key={option} type="button" onClick={() => onSelectAnswer(questionIndex, option)} className={`rounded-lg border px-3 py-2 text-left text-sm transition ${showResult && isCorrect ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : showResult && isSelected ? "border-destructive/50 bg-destructive/10 text-destructive" : isSelected ? "border-accent bg-accent/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted"}`}>
                      {option}
                    </button>
                  );
                })}
              </div>
              {answered ? (
                <div className="mt-3 rounded-lg border border-border bg-background p-3">
                  <p className="text-sm font-medium text-foreground">Correct answer: {question.correctAnswer}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{question.explanation}</p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

type UploadedDocumentsListProps = {
  documents: StoredFile[];
  loadingDocs: boolean;
  onRefresh: () => void;
};

function UploadedDocumentsList({ documents, loadingDocs, onRefresh }: UploadedDocumentsListProps) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Uploaded documents</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{documents.length} file{documents.length !== 1 ? "s" : ""} in storage</p>
        </div>
        <button type="button" onClick={onRefresh} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted">Refresh</button>
      </div>

      {loadingDocs ? (
        <div className="mt-5 space-y-3">
          <div className="h-14 animate-pulse rounded-xl bg-muted" />
          <div className="h-14 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : documents.length === 0 ? (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground"><DocIcon /></div>
          <p className="mt-3 text-sm text-muted-foreground">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {documents.map((doc) => (
            <article key={doc.name} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><DocIcon /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {fileTypeLabel(doc.name)} · {formatBytes(doc.size)}
                  {doc.createdAt ? ` · ${new Date(doc.createdAt).toLocaleDateString()}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{fileTypeLabel(doc.name)}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SectionHeader({ label, title, description, actionLabel, onAction }: { label: string; title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-accent">{label}</p>
        <h2 className="mt-1 text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">{actionLabel}</button>
      ) : null}
    </div>
  );
}

function WorkflowSidebar({
  extractState,
  summaryState,
  flashcardState,
  quizState,
  onSummary,
  onFlashcards,
  onQuiz,
}: {
  extractState: ExtractState;
  summaryState: SummaryState;
  flashcardState: FlashcardState;
  quizState: QuizState;
  onSummary: () => void;
  onFlashcards: () => void;
  onQuiz: () => void;
}) {
  const ready = extractState === "done";

  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Storage info</h2>
        <div className="mt-4 space-y-3 text-sm">
          <InfoRow label="Bucket" value="study-documents" />
          <InfoRow label="Supported" value="PDF, PPTX, DOCX, TXT" />
          <InfoRow label="Max size" value="50 MB" />
          <InfoRow label="AI processing" value="OpenAI GPT-4o-mini" />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">AI actions</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{ready ? "Ready to generate" : "Extract text first"}</p>
        <div className="mt-4 space-y-2">
          <SidebarAction disabled={!ready || summaryState === "generating"} state={summaryState} labels={["Generate summary", "Generating…", "Regenerate summary"]} onClick={onSummary} variant="violet" />
          <SidebarAction disabled={!ready || quizState === "generating"} state={quizState} labels={["Generate quiz", "Generating…", "Regenerate quiz"]} onClick={onQuiz} />
          <SidebarAction disabled={!ready || flashcardState === "generating"} state={flashcardState} labels={["Generate flashcards", "Generating…", "Regenerate flashcards"]} onClick={onFlashcards} variant="outline" />
        </div>
      </section>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-muted-foreground">
      <span>{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function SidebarAction({ disabled, state, labels, onClick, variant = "accent" }: { disabled: boolean; state: SummaryState | FlashcardState | QuizState; labels: [string, string, string]; onClick: () => void; variant?: "accent" | "violet" | "outline" }) {
  const styles = {
    accent: "bg-accent text-accent-foreground hover:opacity-90",
    violet: "bg-violet-600 text-white hover:bg-violet-700",
    outline: "border border-border bg-background text-foreground hover:bg-muted",
  }[variant];
  const label = state === "generating" ? labels[1] : state === "done" ? labels[2] : labels[0];

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}>
      {state === "generating" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : null}
      {label}
    </button>
  );
}

export function UploadWorkflow() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUploadedName, setLastUploadedName] = useState("");
  const [documents, setDocuments] = useState<StoredFile[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState("");
  const [lastUploadedPath, setLastUploadedPath] = useState("");
  const [extractState, setExtractState] = useState<ExtractState>("idle");
  const [extractResult, setExtractResult] = useState<ExtractionResult | null>(null);
  const [extractError, setExtractError] = useState("");
  const [summaryState, setSummaryState] = useState<SummaryState>("idle");
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [summaryError, setSummaryError] = useState("");
  const [flashcardState, setFlashcardState] = useState<FlashcardState>("idle");
  const [flashcardResult, setFlashcardResult] = useState<FlashcardResult | null>(null);
  const [flashcardError, setFlashcardError] = useState("");
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizError, setQuizError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const fetchDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch("/api/documents");
      const json = await res.json();
      if (res.ok) {
        const mapped = (json.documents ?? []).map((doc: { id: string; file_name: string; storage_path: string; created_at: string }) => ({
          id: doc.id,
          name: doc.file_name,
          size: 0,
          createdAt: doc.created_at,
          storagePath: doc.storage_path,
        }));
        setDocuments(mapped);
        if (!currentDocumentId && mapped[0]) {
          setCurrentDocumentId(mapped[0].id);
          setLastUploadedName(mapped[0].name);
          setLastUploadedPath(mapped[0].storagePath);
        }
      }
    } catch {
      setDocuments([]);
    }
    setLoadingDocs(false);
  }, [currentDocumentId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const loadSavedStudyData = useCallback(async (documentId: string) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/study-data`);
      const json = (await res.json()) as SavedStudyData;
      if (!res.ok) return;

      if (json.summary) {
        setSummaryResult(json.summary);
        setSummaryState("done");
      }

      if (json.flashcards.length > 0) {
        setFlashcardResult({ flashcards: json.flashcards });
        setFlashcardState("done");
      }

      if (json.quizzes.length > 0) {
        setQuizResult({ questions: json.quizzes });
        setQuizState("done");
      }
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    if (currentDocumentId) {
      loadSavedStudyData(currentDocumentId);
    }
  }, [currentDocumentId, loadSavedStudyData]);

  function resetGeneratedState() {
    setExtractState("idle");
    setExtractResult(null);
    setExtractError("");
    setSummaryState("idle");
    setSummaryResult(null);
    setSummaryError("");
    setFlashcardState("idle");
    setFlashcardResult(null);
    setFlashcardError("");
    setQuizState("idle");
    setQuizResult(null);
    setQuizError("");
    setSelectedAnswers({});
  }

  async function saveDocument(fileName: string, storagePath: string) {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, storagePath }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error ?? "Failed to save document");
    }
    return json.document as { id: string; file_name: string; storage_path: string; created_at: string };
  }

  async function saveSummary(documentId: string, result: SummaryResult) {
    await fetch(`/api/documents/${documentId}/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
  }

  async function saveFlashcards(documentId: string, result: FlashcardResult) {
    await fetch(`/api/documents/${documentId}/flashcards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flashcards: result.flashcards }),
    });
  }

  async function saveQuiz(documentId: string, result: QuizResult) {
    await fetch(`/api/documents/${documentId}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: result.questions }),
    });
  }

  async function handleUpload(file: File) {
    setErrorMsg("");

    if (!isAcceptedFile(file)) {
      setErrorMsg("Unsupported file type. Please upload PDF, PPTX, DOCX, or TXT.");
      setUploadState("error");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`File exceeds ${formatBytes(MAX_FILE_SIZE)} limit.`);
      setUploadState("error");
      return;
    }

    setUploadState("uploading");
    setProgress(0);
    setLastUploadedName(file.name);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 15));
    }, 200);

    const storagePath = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    clearInterval(progressInterval);

    if (error) {
      setErrorMsg(error.message);
      setUploadState("error");
      setProgress(0);
      return;
    }

    setProgress(100);
    setUploadState("success");
    setLastUploadedPath(storagePath);
    resetGeneratedState();
    try {
      const document = await saveDocument(file.name, storagePath);
      setCurrentDocumentId(document.id);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save document metadata");
    }
    fetchDocuments();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function resetUpload() {
    setUploadState("idle");
    setProgress(0);
    setErrorMsg("");
    setLastUploadedName("");
    setCurrentDocumentId("");
    setLastUploadedPath("");
    resetGeneratedState();
  }

  async function handleExtract() {
    if (!lastUploadedPath) return;
    setExtractState("extracting");
    setExtractError("");
    try {
      const res = await fetch("/api/documents/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: lastUploadedPath }),
      });
      const json = await res.json();
      if (!res.ok) {
        setExtractError(json.error ?? "Extraction failed");
        setExtractState("error");
        return;
      }
      setExtractResult(json as ExtractionResult);
      setExtractState("done");
    } catch {
      setExtractError("Network error — could not reach extraction API");
      setExtractState("error");
    }
  }

  async function handleSummary() {
    if (!extractResult?.extractedText) return;
    setSummaryState("generating");
    setSummaryError("");
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedText: extractResult.extractedText }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSummaryError(json.error ?? "Summary generation failed");
        setSummaryState("error");
        return;
      }
      const result = json as SummaryResult;
      setSummaryResult(result);
      setSummaryState("done");
      if (currentDocumentId) {
        saveSummary(currentDocumentId, result);
      }
    } catch {
      setSummaryError("Network error — could not reach summary API");
      setSummaryState("error");
    }
  }

  async function handleFlashcards() {
    if (!extractResult?.extractedText) return;
    setFlashcardState("generating");
    setFlashcardError("");
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedText: extractResult.extractedText, summary: summaryResult?.summary }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFlashcardError(json.error ?? "Flashcard generation failed");
        setFlashcardState("error");
        return;
      }
      const result = json as FlashcardResult;
      setFlashcardResult(result);
      setFlashcardState("done");
      if (currentDocumentId) {
        saveFlashcards(currentDocumentId, result);
      }
    } catch {
      setFlashcardError("Network error — could not reach flashcard API");
      setFlashcardState("error");
    }
  }

  async function handleQuiz() {
    if (!extractResult?.extractedText) return;
    setQuizState("generating");
    setQuizError("");
    setSelectedAnswers({});
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedText: extractResult.extractedText, summary: summaryResult?.summary }),
      });
      const json = await res.json();
      if (!res.ok) {
        setQuizError(json.error ?? "Quiz generation failed");
        setQuizState("error");
        return;
      }
      const result = json as QuizResult;
      setQuizResult(result);
      setQuizState("done");
      if (currentDocumentId) {
        saveQuiz(currentDocumentId, result);
      }
    } catch {
      setQuizError("Network error — could not reach quiz API");
      setQuizState("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_32rem)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Supabase Storage + AI workflow connected
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Upload study material</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Upload documents, extract PDF text, and generate study summaries, flashcards, and quizzes from one streamlined workflow.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <main className="space-y-6">
          <UploadDropzone
            uploadState={uploadState}
            progress={progress}
            errorMsg={errorMsg}
            lastUploadedName={lastUploadedName}
            dragOver={dragOver}
            inputRef={inputRef}
            onFileChange={onFileChange}
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          />
          <ExtractionPanel
            uploadState={uploadState}
            lastUploadedName={lastUploadedName}
            extractState={extractState}
            extractResult={extractResult}
            extractError={extractError}
            summaryState={summaryState}
            summaryError={summaryError}
            flashcardState={flashcardState}
            flashcardError={flashcardError}
            quizState={quizState}
            quizError={quizError}
            onExtract={handleExtract}
            onSummary={handleSummary}
            onFlashcards={handleFlashcards}
            onQuiz={handleQuiz}
            onReset={resetUpload}
          />
          <AiSummaryPanel result={summaryResult} />
          <FlashcardsPreview result={flashcardResult} onRegenerate={handleFlashcards} />
          <QuizPreview
            result={quizResult}
            selectedAnswers={selectedAnswers}
            onSelectAnswer={(questionIndex, option) => setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }))}
            onRetry={() => setSelectedAnswers({})}
            onRegenerate={handleQuiz}
          />
          <UploadedDocumentsList documents={documents} loadingDocs={loadingDocs} onRefresh={fetchDocuments} />
        </main>

        <WorkflowSidebar
          extractState={extractState}
          summaryState={summaryState}
          flashcardState={flashcardState}
          quizState={quizState}
          onSummary={handleSummary}
          onFlashcards={handleFlashcards}
          onQuiz={handleQuiz}
        />
      </div>
    </div>
  );
}
