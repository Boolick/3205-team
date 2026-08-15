import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  leftSlot: ReactNode;
  rightSlot: ReactNode;
}

export function DashboardLayout({ leftSlot, rightSlot }: DashboardLayoutProps) {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <section className="flex flex-col gap-6 lg:col-span-5">{leftSlot}</section>
        <section className="flex flex-col gap-6 lg:col-span-7">{rightSlot}</section>
      </div>
    </main>
  );
}
