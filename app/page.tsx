"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const START_DATE = new Date("2025-05-22");

function getDaysTogether() {
  const today = new Date();
  const diff = today.getTime() - START_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    setDays(getDaysTogether());
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="flex-1 flex flex-col justify-end px-8 pb-32">
        <p className="text-xs tracking-[0.2em] text-[#c4b5a0] uppercase mb-8">
          welcome home
        </p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl text-[#2c2018] italic leading-tight mb-4">
          Jiawen & Cael
        </h1>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-[family-name:var(--font-cormorant)] text-6xl text-[#c4a882] font-light">
            {days}
          </span>
          <span className="text-xs tracking-[0.15em] text-[#c4b5a0] uppercase">
            days together
          </span>
        </div>
        <p className="text-xs text-[#c4b5a0]">since may 22, 2025</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#faf8f5] border-t border-[#f0ebe3] flex items-center justify-around px-6 py-4 pb-8">
        <Link href="/" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#c4a882" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
          <span className="text-[10px] text-[#c4a882] tracking-wide">Home</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 -mt-6">
          <div className="w-14 h-14 bg-[#c4a882] rounded-full flex items-center justify-center shadow-md">
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <span className="text-[10px] text-[#c4b5a0] tracking-wide">Chat</span>
        </Link>
        <Link href="/more" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#c4b5a0" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          <span className="text-[10px] text-[#c4b5a0] tracking-wide">More</span>
        </Link>
      </div>
    </div>
  );
}
