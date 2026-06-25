"use client";

export default function MonthProgress() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const progress = Math.round((today / daysInMonth) * 100);

  const monthName = now.toLocaleDateString("en-US", { month: "long" });

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-widest text-gray-400 uppercase">{monthName}</span>
        <span className="text-[10px] text-violet-400">{progress}%</span>
      </div>
      <div className="w-full h-[3px] bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-400 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-gray-300">1</span>
        <span className="text-[9px] text-gray-400">day {today} / {daysInMonth}</span>
        <span className="text-[9px] text-gray-300">{daysInMonth}</span>
      </div>
    </div>
  );
}
