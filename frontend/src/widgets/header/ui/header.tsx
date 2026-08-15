import { Activity, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-[#111111]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#323232] bg-[#1f1f1f] text-[#2b7fff]">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-serif text-[18px] leading-none tracking-[-0.02em] text-[#eeeeee]">
                Altitude
              </h1>
              <p className="mt-0.5 font-mono text-[11px] tracking-wider text-[#a4a19b] uppercase">
                URL Validation Suite
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[12px] text-[#a4a19b]">
          <div className="hidden items-center gap-1.5 rounded-[4px] border border-[#262626] bg-[#1f1f1f] px-2.5 py-1 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" />
            <span className="text-[#eeeeee]">BFF Core Online</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-[4px] border border-[#262626] bg-[#1f1f1f] px-2.5 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2b7fff]" />
            <span className="text-[#eeeeee]">5 slots / job</span>
          </div>
        </div>
      </div>
    </header>
  );
}
