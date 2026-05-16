export type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
};

export type StudySession = {
  id: string;
  title: string;
  subject: string;
  duration: string;
  date: string;
  score: number | null;
  type: "quiz" | "lecture" | "review";
};

export type WeeklyProgress = {
  day: string;
  hours: number;
  quizzes: number;
};

export const stats: StatCard[] = [
  {
    label: "Study hours",
    value: "24.5h",
    change: "+12% this week",
    trend: "up",
  },
  {
    label: "Quizzes completed",
    value: "18",
    change: "+4 this week",
    trend: "up",
  },
  {
    label: "Average score",
    value: "87%",
    change: "+5% vs last week",
    trend: "up",
  },
  {
    label: "Lectures uploaded",
    value: "6",
    change: "2 pending review",
    trend: "neutral",
  },
];

export const recentSessions: StudySession[] = [
  {
    id: "1",
    title: "Calculus II — Integration",
    subject: "Mathematics",
    duration: "45 min",
    date: "Today, 2:30 PM",
    score: 92,
    type: "quiz",
  },
  {
    id: "2",
    title: "Organic Chemistry Notes",
    subject: "Chemistry",
    duration: "1h 10m",
    date: "Yesterday",
    score: null,
    type: "lecture",
  },
  {
    id: "3",
    title: "World War II Timeline",
    subject: "History",
    duration: "35 min",
    date: "Mar 14",
    score: 78,
    type: "review",
  },
  {
    id: "4",
    title: "Python Data Structures",
    subject: "Computer Science",
    duration: "50 min",
    date: "Mar 13",
    score: 95,
    type: "quiz",
  },
];

export const weeklyProgress: WeeklyProgress[] = [
  { day: "Mon", hours: 2.5, quizzes: 2 },
  { day: "Tue", hours: 3.2, quizzes: 3 },
  { day: "Wed", hours: 1.8, quizzes: 1 },
  { day: "Thu", hours: 4.1, quizzes: 4 },
  { day: "Fri", hours: 2.9, quizzes: 2 },
  { day: "Sat", hours: 5.2, quizzes: 3 },
  { day: "Sun", hours: 4.8, quizzes: 3 },
];

export const studyStreak = {
  current: 12,
  longest: 21,
  week: [
    { day: "M", completed: true },
    { day: "T", completed: true },
    { day: "W", completed: true },
    { day: "T", completed: true },
    { day: "F", completed: true },
    { day: "S", completed: true },
    { day: "S", completed: false },
  ],
};

export const scoreTrend = [72, 78, 81, 79, 85, 87, 90, 87];
