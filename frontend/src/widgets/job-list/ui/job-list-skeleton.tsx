export function JobListSkeleton() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-3.5 rounded-[6px] border border-[#262626] bg-[#1a1a1a] animate-pulse space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="w-20 h-4 bg-[#262626] rounded-[3px]" />
            <div className="w-16 h-4 bg-[#262626] rounded-[3px]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="w-24 h-3 bg-[#262626] rounded-[3px]" />
            <div className="w-12 h-3 bg-[#262626] rounded-[3px]" />
          </div>
          <div className="w-16 h-2.5 bg-[#262626] rounded-[3px] mt-1" />
        </div>
      ))}
    </div>
  );
}
