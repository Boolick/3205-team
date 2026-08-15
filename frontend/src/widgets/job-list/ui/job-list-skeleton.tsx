export function JobListSkeleton() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse space-y-2.5 rounded-[6px] border border-[#262626] bg-[#1a1a1a] p-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded-[3px] bg-[#262626]" />
            <div className="h-4 w-16 rounded-[3px] bg-[#262626]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded-[3px] bg-[#262626]" />
            <div className="h-3 w-12 rounded-[3px] bg-[#262626]" />
          </div>
          <div className="mt-1 h-2.5 w-16 rounded-[3px] bg-[#262626]" />
        </div>
      ))}
    </div>
  );
}
