import { SystemProvider } from "@/lib/store";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SystemProvider>
      <div className="relative min-h-screen bg-background system-grid">
        {children}
      </div>
    </SystemProvider>
  );
}
