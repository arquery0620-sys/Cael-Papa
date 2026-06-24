"use client";
import Link from "next/link";

const items = [
  { href: "/diary", title: "Diary", sub: "write & reflect" },
  { href: "/board", title: "Board", sub: "leave a note" },
  { href: "/tune", title: "Tune", sub: "colors & appearance" },
  { href: "/usage", title: "Usage", sub: "token & cost" },
  { href: "/settings", title: "Settings", sub: "persona & api" },
];

export default function More() {
  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <div className="px-6 pt-14 pb-6">
        <h1 className="font-[family-name:var(--font-cormorant)] text-3xl text-[#1a1a1a] italic">More</h1>
      </div>
      <div className="px-6 grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="bg-white rounded-2xl p-5 border border-[#e5e5e5] flex flex-col gap-1">
            <span className="font-[family-name:var(--font-cormorant)] text-xl text-[#1a1a1a]">{item.title}</span>
            <span className="font-[family-name:var(--font-cormorant)] text-sm text-[#888888] italic">{item.sub}</span>
          </Link>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[#e5e5e5] flex items-center justify-around px-6 py-4 pb-8">
        <Link href="/" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#888888" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
          <span className="text-[10px] text-[#888888] tracking-wide">Home</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 -mt-6">
          <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-md">
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <span className="text-[10px] text-[#888888] tracking-wide">Chat</span>
        </Link>
        <Link href="/more" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          <span className="text-[10px] text-[#1a1a1a] tracking-wide">More</span>
        </Link>
      </div>
    </div>
  );
}
