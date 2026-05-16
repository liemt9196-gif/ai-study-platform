import { NavLink } from "@/components/app/nav-link";
import { mainNav } from "@/lib/navigation";

type SidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function Sidebar({ onNavigate, className = "" }: SidebarProps) {
  return (
    <aside
      className={[
        "flex w-64 shrink-0 flex-col border-r border-border bg-sidebar",
        className,
      ].join(" ")}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          AI Study Platform
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </aside>
  );
}
