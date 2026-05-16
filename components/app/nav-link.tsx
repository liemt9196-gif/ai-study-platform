"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
  onNavigate?: () => void;
};

export function NavLink({ href, label, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors motion-safe:transition-colors",
        isActive
          ? "bg-sidebar-accent text-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
