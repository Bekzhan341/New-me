"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  ListChecks,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/system", label: "Статус", icon: LayoutDashboard },
  { href: "/system/workout", label: "Тренировки", icon: Dumbbell },
  { href: "/system/nutrition", label: "Питание", icon: UtensilsCrossed },
  { href: "/system/habits", label: "Привычки", icon: ListChecks },
];

export function SystemNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-56 flex-none flex-col border-r border-system/20 bg-black/40 p-4 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="text-2xl font-bold italic tracking-widest text-system system-text-glow -skew-x-12 transform">
            ARISE
          </span>
        </Link>
        <nav className="flex flex-col gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-sm border px-3 py-2.5 text-sm transition-all",
                  active
                    ? "border-system/40 bg-system/10 text-system system-text-glow"
                    : "border-transparent text-muted-foreground hover:border-system/20 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="tracking-wide">{label}</span>
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="mt-auto flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          На главную
        </Link>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-system/30 bg-black/80 backdrop-blur-md lg:hidden">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors",
                active ? "text-system" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
