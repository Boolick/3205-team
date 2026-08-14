import { Activity, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-[#262626] bg-[#111111]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-[#1f1f1f] border border-[#323232] flex items-center justify-center text-[#2b7fff]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-serif text-[18px] text-[#eeeeee] tracking-[-0.02em] leading-none">
                Altitude
              </h1>
              <p className="text-[11px] font-mono text-[#a4a19b] tracking-wider uppercase mt-0.5">
                URL Validation Suite
              </p>
            </div>
          </div>
        </div>

        {/* System & Architecture Badges */}
        <div className="flex items-center gap-3 text-[12px] font-mono text-[#a4a19b]">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#1f1f1f] border border-[#262626]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[#eeeeee]">BFF Core Online</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#1f1f1f] border border-[#262626]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2b7fff]" />
            <span className="text-[#eeeeee]">5 slots / job</span>
          </div>
        </div>
      </div>
    </header>
  );
}
