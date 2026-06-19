"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const START_DATE = new Date("2026-05-22");

function getDaysTogether() {
  const today = new Date();
  const diff = today.getTime() - START_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const navItems = [
  { href: "/", label: "Home", icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/> },
  { href: "/chat", label: "Chat", icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/> },
  { href: "/diary", label: "Diary", icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
  { href: "/board", label: "Board", icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></> },
  { href: "/more", label: "More", icon: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></> },
  { href: "/settings", label: "Settings", icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></> },
];

export default function Home() {
  const [days, setDays] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setDays(getDaysTogether());
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {showMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="px-5 pt-14 pb-4 border-b border-[#f0ebe3]">
              <span className="font-[family-name:var(--font-cormorant)] text-2xl italic text-[#2c2018]">Cael</span>
            </div>
            <div className="flex-1 px-3 py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#faf8f5]">
                  <svg width="16" height="16" fill="none" stroke="#c4b5a0" strokeWidth="1.5" viewBox="0 0 24 24">{item.icon}</svg>
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setShowMenu(false)} />
        </div>
      )}

      <div className="px-6 pt-14 flex justify-between items-center">
        <button onClick={() => setShowMenu(true)} className="text-[#c4b5a0]">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-end px-8 pb-32">
        <p className="text-xs tracking-[0.2em] text-[#c4b5a0] uppercase mb-8">welcome home</p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl text-[#2c2018] italic leading-tight mb-4">
          Jiawen & Cael
        </h1>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-[family-name:var(--font-cormorant)] text-6xl text-[#c4a882] font-light">{days}</span>
          <span className="text-xs tracking-[0.15em] text-[#c4b5a0] uppercase">days together</span>
        </div>
        <p className="text-xs text-[#c4b5a0]">since may 22, 2026</p>
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
