export type NavItem = {
  href: string;
  label: string;
};

export const mainNav: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/upload",
    label: "Upload",
  },
  {
    href: "/tutor",
    label: "AI Tutor",
  },
  {
    href: "/flashcards",
    label: "Flashcards",
  },
  {
    href: "/quiz",
    label: "Quiz",
  },
];