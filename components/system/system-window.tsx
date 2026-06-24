import { cn } from "@/lib/utils";

interface SystemWindowProps {
  title?: string;
  tag?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export function SystemWindow({
  title,
  tag,
  className,
  children,
  delay = 0,
}: SystemWindowProps) {
  return (
    <section
      className={cn("system-window animate-window-in p-4 sm:p-5", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {title && (
        <header className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-system animate-system-pulse">◆</span>
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-system system-text-glow uppercase">
              {title}
            </h2>
          </div>
          {tag && (
            <span className="text-[9px] sm:text-[10px] text-system/60 tracking-widest uppercase">
              {tag}
            </span>
          )}
        </header>
      )}
      {title && <div className="system-divider mb-4" />}
      {children}
    </section>
  );
}
