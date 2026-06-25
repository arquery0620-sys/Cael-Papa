"use client";

import { useState } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function YearCalendar() {
  const today = new Date();
  const [year] = useState(today.getFullYear());

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  return (
    <div className="w-full px-4 py-6">
      <p className="text-center text-xs tracking-widest text-gray-400 mb-6 font-light">
        {year}
      </p>
      <div className="flex flex-col gap-3">
        {MONTHS.map((monthName, monthIndex) => {
          const days = getDaysInMonth(year, monthIndex);
          return (
            <div key={monthIndex} className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-6 shrink-0">{monthName}</span>
              <div className="flex flex-wrap gap-[3px]">
                {Array.from({ length: days }).map((_, dayIndex) => {
                  const day = dayIndex + 1;
                  const key = `${year}-${monthIndex}-${day}`;
                  const isToday = key === todayKey;
                  const isPast =
                    new Date(year, monthIndex, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <div
                      key={dayIndex}
                      title={`${monthName} ${day}`}
                      className={`w-[6px] h-[6px] rounded-full transition-all ${
                        isToday
                          ? "bg-violet-400 scale-125"
                          : isPast
                          ? "bg-gray-700"
                          : "bg-gray-200"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
