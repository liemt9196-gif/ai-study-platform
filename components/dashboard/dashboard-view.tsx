import { AiQuizSection } from "@/components/dashboard/ai-quiz-section";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProgressCharts } from "@/components/dashboard/progress-charts";
import { RecentSessions } from "@/components/dashboard/recent-sessions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { StudyStreak } from "@/components/dashboard/study-streak";
import { UploadLectureCard } from "@/components/dashboard/upload-lecture-card";
import {
  recentSessions,
  stats,
} from "@/lib/dashboard-mock-data";

export function DashboardView() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <DashboardHeader />

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ProgressCharts />
          <RecentSessions sessions={recentSessions} />
        </div>

        <div className="space-y-6">
          <StudyStreak />
          <UploadLectureCard />
          <AiQuizSection />
        </div>
      </div>
    </div>
  );
}
