import { cn } from "@/lib/utils";

export function XpBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("relative h-2 w-full overflow-hidden bg-black/50 ", className)}>
      <div
        className="h-full bg-gradient-to-r from-system/70 to-system transition-all duration-500"
        style={{ width: `${pct}%`, boxShadow: "0 0 10px rgba(56,189,248,0.6)" }}
      />
      <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
}
