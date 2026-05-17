"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app/app-shell";
import { supabase } from "@/lib/supabase";

const BUCKET = "study-documents";
const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/plain": "TXT",
};
const ACCEPTED_EXTENSIONS = [".pdf", ".pptx", ".docx", ".txt"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

type UploadState = "idle" | "uploading" | "success" | "error";
type ExtractState = "idle" | "extracting" | "done" | "error";
type SummaryState = "idle" | "generating" | "done" | "error";
type FlashcardState = "idle" | "generating" | "done" | "error";

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

type ExtractionResult = {
  extractedText: string;
  pageCount: number | null;
  fileName: string;
};

type StoredFile = {
  name: string;
  size: number;
  createdAt: string;
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

function UploadPageContent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUploadedName, setLastUploadedName] = useState("");
  const [documents, setDocuments] = useState<StoredFile[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [dragOver, setDragOver] = useState(false);
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

  const fetchDocuments = useCallback(async () => {
    setLoadingDocs(true);
    const { data, error } = await supabase.storage.from(BUCKET).list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (!error && data) {
      setDocuments(
        data
          .filter((f) => f.name !== ".emptyFolderPlaceholder")
          .map((f) => ({
            name: f.name,
            size: f.metadata?.size ?? 0,
            createdAt: f.created_at ?? "",
          })),
      );
    }
    setLoadingDocs(false);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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

    // Simulate progress since Supabase JS v2 upload doesn't expose progress natively for small files
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
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
    setExtractState("idle");
    setExtractResult(null);
    setExtractError("");
    setSummaryState("idle");
    setSummaryResult(null);
    setSummaryError("");
    setFlashcardState("idle");
    setFlashcardResult(null);
    setFlashcardError("");
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
    setLastUploadedPath("");
    setExtractState("idle");
    setExtractResult(null);
    setExtractError("");
    setSummaryState("idle");
    setSummaryResult(null);
    setSummaryError("");
    setFlashcardState("idle");
    setFlashcardResult(null);
    setFlashcardError("");
  }

  async function handleFlashcards() {
    if (!extractResult?.extractedText) return;
    setFlashcardState("generating");
    setFlashcardError("");
    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extractedText: extractResult.extractedText,
          summary: summaryResult?.summary,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFlashcardError(json.error ?? "Flashcard generation failed");
        setFlashcardState("error");
        return;
      }
      setFlashcardResult(json as FlashcardResult);
      setFlashcardState("done");
    } catch {
      setFlashcardError("Network error — could not reach flashcard API");
      setFlashcardState("error");
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
      setSummaryResult(json as SummaryResult);
      setSummaryState("done");
    } catch {
      setSummaryError("Network error \u2014 could not reach summary API");
      setSummaryState("error");
    }
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

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_32rem)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Supabase Storage connected
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Upload study material
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Add lecture files to generate summaries, flashcards, quizzes, and tutor context. Files are stored in Supabase Storage. AI processing is not connected yet.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {/* Upload zone */}
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Upload document</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              PDF, PPTX, DOCX, or TXT up to 50 MB
            </p>

            {uploadState === "idle" || uploadState === "error" ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
                  dragOver
                    ? "border-accent bg-accent/5"
                    : "border-border bg-muted/30 hover:border-accent/50 hover:bg-muted/40"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <UploadIcon />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  Drag & drop or click to browse
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, PPTX, DOCX, TXT up to 50 MB
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.pptx,.docx,.txt"
                  onChange={onFileChange}
                  className="sr-only"
                  aria-label="Choose file to upload"
                />
              </div>
            ) : null}

            {uploadState === "uploading" ? (
              <div className="mt-4 rounded-xl border border-border bg-muted/20 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-accent" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{lastUploadedName}</p>
                    <p className="text-xs text-muted-foreground">Uploading…</p>
                  </div>
                  <span className="text-sm font-semibold text-accent">{Math.round(progress)}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            {uploadState === "success" ? (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{lastUploadedName}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Upload complete</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {lastUploadedName.toLowerCase().endsWith(".pdf") && extractState !== "done" ? (
                    <button
                      type="button"
                      onClick={handleExtract}
                      disabled={extractState === "extracting"}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
                    >
                      {extractState === "extracting" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
                          Extracting…
                        </>
                      ) : (
                        "Extract text"
                      )}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={resetUpload}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    Upload another file
                  </button>
                </div>

                {extractState === "error" && extractError ? (
                  <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                    <p className="text-sm text-destructive">{extractError}</p>
                  </div>
                ) : null}

                {extractState === "done" && extractResult ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
                        {extractResult.pageCount != null
                          ? `${extractResult.pageCount} page${extractResult.pageCount !== 1 ? "s" : ""}`
                          : "PDF"}
                      </span>
                      <span className="text-muted-foreground">
                        {extractResult.extractedText.length.toLocaleString()} characters extracted
                      </span>
                    </div>
                    <div className="max-h-48 overflow-auto rounded-xl border border-border bg-muted/20 p-4">
                      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                        {extractResult.extractedText.slice(0, 3000)}
                        {extractResult.extractedText.length > 3000 ? "\n\n… (truncated)" : ""}
                      </pre>
                    </div>

                    {/* AI Summary button */}
                    {summaryState !== "done" ? (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleSummary}
                          disabled={summaryState === "generating"}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                        >
                          {summaryState === "generating" ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Generating summary\u2026
                            </>
                          ) : (
                            "Generate AI Summary"
                          )}
                        </button>
                      </div>
                    ) : null}

                    {summaryState === "error" && summaryError ? (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                        <p className="text-sm text-destructive">{summaryError}</p>
                      </div>
                    ) : null}

                    {flashcardState !== "done" ? (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleFlashcards}
                          disabled={flashcardState === "generating"}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
                        >
                          {flashcardState === "generating" ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
                              Generating flashcards…
                            </>
                          ) : (
                            "Generate Flashcards"
                          )}
                        </button>
                      </div>
                    ) : null}

                    {flashcardState === "error" && flashcardError ? (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                        <p className="text-sm text-destructive">{flashcardError}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {uploadState === "error" && errorMsg ? (
              <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                <p className="text-sm text-destructive">{errorMsg}</p>
              </div>
            ) : null}
          </section>

          {/* AI Summary result */}
          {summaryState === "done" && summaryResult ? (
            <section className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">AI Study Summary</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground">
                {summaryResult.summary}
              </p>

              {summaryResult.keyPoints.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-foreground">Key Points</h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {summaryResult.keyPoints.map((kp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-lg border border-border bg-background p-3"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                          {i + 1}
                        </span>
                        <p className="text-sm text-foreground">{kp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {summaryResult.importantConcepts.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-foreground">Important Concepts</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summaryResult.importantConcepts.map((c, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {summaryResult.studyTips.length > 0 ? (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-foreground">Study Tips</h3>
                  <ul className="mt-2 space-y-2">
                    {summaryResult.studyTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {/* Flashcard preview */}
          {flashcardState === "done" && flashcardResult ? (
            <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">AI Flashcard Preview</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {flashcardResult.flashcards.length} flashcards generated from the extracted text
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFlashcards}
                  className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-60"
                >
                  Regenerate
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {flashcardResult.flashcards.map((card, i) => (
                  <article
                    key={`${card.question}-${i}`}
                    className="rounded-xl border border-border bg-muted/20 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyClass(card.difficulty)}`}>
                        {card.difficulty}
                      </span>
                      <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {card.topic}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold leading-6 text-foreground">
                      {card.question}
                    </h3>
                    <p className="mt-2 rounded-lg border border-border bg-background p-3 text-sm leading-6 text-muted-foreground">
                      {card.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {/* Document list */}
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Uploaded documents</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {documents.length} file{documents.length !== 1 ? "s" : ""} in storage
                </p>
              </div>
              <button
                type="button"
                onClick={fetchDocuments}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                Refresh
              </button>
            </div>

            {loadingDocs ? (
              <div className="mt-5 space-y-3">
                <div className="h-14 animate-pulse rounded-xl bg-muted" />
                <div className="h-14 animate-pulse rounded-xl bg-muted" />
              </div>
            ) : documents.length === 0 ? (
              <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <DocIcon />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">No documents uploaded yet</p>
              </div>
            ) : (
              <div className="mt-5 space-y-2">
                {documents.map((doc) => (
                  <article
                    key={doc.name}
                    className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <DocIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {fileTypeLabel(doc.name)} · {formatBytes(doc.size)}
                        {doc.createdAt ? ` · ${new Date(doc.createdAt).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {fileTypeLabel(doc.name)}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Storage info</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>Bucket</span>
                <span className="font-medium text-foreground">study-documents</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>Supported</span>
                <span className="font-medium text-foreground">PDF, PPTX, DOCX, TXT</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>Max size</span>
                <span className="font-medium text-foreground">50 MB</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-muted-foreground">
                <span>AI processing</span>
                <span className="font-medium text-foreground">OpenAI GPT-4o-mini</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">AI actions</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {extractState === "done" ? "Ready to generate" : "Extract text first"}
            </p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                disabled={extractState !== "done" || summaryState === "generating"}
                onClick={handleSummary}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {summaryState === "generating" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating…
                  </>
                ) : summaryState === "done" ? (
                  "Regenerate summary"
                ) : (
                  "Generate summary"
                )}
              </button>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground opacity-60"
              >
                Generate quiz
              </button>
              <button
                type="button"
                disabled={extractState !== "done" || flashcardState === "generating"}
                onClick={handleFlashcards}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {flashcardState === "generating" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" />
                    Generating…
                  </>
                ) : flashcardState === "done" ? (
                  "Regenerate flashcards"
                ) : (
                  "Generate flashcards"
                )}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <AppShell>
      <UploadPageContent />
    </AppShell>
  );
}
