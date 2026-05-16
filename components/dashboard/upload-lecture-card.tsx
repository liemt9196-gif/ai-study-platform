export function UploadLectureCard() {
  return (
    <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Upload lecture</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Add PDFs or slides to generate quizzes and summaries.
      </p>

      <div className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Drag & drop your lecture files
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, PPT, DOCX up to 50MB
        </p>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Upload will be available when backend is connected"
          className="mt-4 inline-flex h-9 cursor-not-allowed items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-foreground opacity-60"
        >
          Upload lecture
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          Backend not connected yet
        </p>
      </div>
    </section>
  );
}
