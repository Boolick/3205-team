import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  leftSlot: ReactNode;
  rightSlot: ReactNode;
}

export function DashboardLayout({ leftSlot, rightSlot }: DashboardLayoutProps) {
  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 40% (5 cols on lg) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {leftSlot}
        </section>

        {/* Right Column: 60% (7 cols on lg) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {rightSlot}
        </section>
      </div>
    </main>
  );
}
