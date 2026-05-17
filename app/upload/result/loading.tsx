import { AppShell } from "@/components/app/app-shell";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />;
}

export default function UploadResultLoading() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
        <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div className="space-y-4">
              <SkeletonBlock className="h-7 w-40 rounded-full" />
              <SkeletonBlock className="h-9 w-full max-w-xl" />
              <SkeletonBlock className="h-4 w-full max-w-3xl" />
              <SkeletonBlock className="h-4 w-4/5 max-w-2xl" />
            </div>
            <div className="rounded-2xl border border-border p-4">
              <SkeletonBlock className="h-4 w-32" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                <SkeletonBlock className="h-20" />
                <SkeletonBlock className="h-20" />
                <SkeletonBlock className="h-20" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border bg-background p-5 shadow-sm xl:col-span-2">
            <div className="flex gap-3">
              <SkeletonBlock className="h-10 w-10 shrink-0" />
              <div className="w-full space-y-2">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="h-4 w-56" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <SkeletonBlock className="h-5 w-36" />
            <div className="mt-5 space-y-3">
              <SkeletonBlock className="h-3 w-3/4 rounded-full" />
              <SkeletonBlock className="h-3 w-full rounded-full" />
              <SkeletonBlock className="h-3 w-5/6 rounded-full" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <SkeletonBlock className="h-20" />
                <SkeletonBlock className="h-20" />
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonBlock className="h-44" />
          <SkeletonBlock className="h-44" />
          <SkeletonBlock className="h-44" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-80" />
          <SkeletonBlock className="h-80" />
        </div>
      </div>
    </AppShell>
  );
}
