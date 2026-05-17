import { AppShell } from "@/components/app/app-shell";
import { UploadLectureCard } from "@/components/dashboard/upload-lecture-card";

function UploadPageContent() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="relative p-5 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_32rem)]" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Backend not connected yet
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Upload study material
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Add lecture files to generate summaries, flashcards, quizzes, and tutor context. Upload processing is currently a UI preview until the backend is connected.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
        <UploadLectureCard />

        <aside className="rounded-xl border border-border bg-background p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Coming soon</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Backend upload, AI processing, and document library actions will be connected later.
          </p>
          <div className="mt-5 space-y-3 rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-3">
              <span>Supported files</span>
              <span className="font-medium text-foreground">PDF, PPT, DOCX</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Max file size</span>
              <span className="font-medium text-foreground">50MB</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>AI status</span>
              <span className="font-medium text-foreground">Mock only</span>
            </div>
          </div>
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
