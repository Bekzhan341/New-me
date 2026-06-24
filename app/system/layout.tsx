import { SystemProvider } from "@/lib/store";
import { SystemNav } from "@/components/system/nav";

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SystemProvider>
      <div className="relative min-h-screen bg-background system-grid">
        <div className="mx-auto flex max-w-7xl">
          <SystemNav />
          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            {children}
          </main>
        </div>
      </div>
    </SystemProvider>
  );
}
