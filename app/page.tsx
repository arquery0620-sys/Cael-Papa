"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HomeIcon, ChatBubbleLeftIcon, BookOpenIcon, Squares2X2Icon,
  Cog6ToothIcon, ChevronDownIcon, ChevronRightIcon,
  BookmarkIcon, ChartBarIcon, PencilSquareIcon, KeyIcon,
} from "@heroicons/react/24/outline";

const START_DATE = new Date("2026-05-22");

function getDaysTogether() {
  const today = new Date();
  const diff = today.getTime() - START_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const [days, setDays] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    setDays(getDaysTogether());
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: "#fdf0f3" }}>
      <div className="fixed bottom-0 left-0 w-72 h-96 pointer-events-none" style={{ opacity: 0.2 }}>
        <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M100 280 C100 280 98 240 95 210 C92 180 88 160 90 130 C92 100 95 80 100 60" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M95 180 C80 175 60 165 45 150 C55 160 75 172 95 175" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M93 200 C108 195 128 185 143 170 C133 180 113 192 93 195" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M90 60 C85 45 78 30 75 15 C72 5 74 0 78 2 C82 4 86 15 88 28 C90 42 90 55 90 60" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M100 60 C105 45 112 30 115 15 C118 5 116 0 112 2 C108 4 104 15 102 28 C100 42 100 55 100 60" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M95 60 C95 45 96 25 100 10 C104 25 105 45 105 60" stroke="#e8829a" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M88 58 C75 52 60 44 52 32 C58 38 72 48 88 55" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M108 58 C121 52 136 44 144 32 C138 38 124 48 108 55" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M96 62 C96 62 98 68 100 70 C102 68 104 62 104 62" stroke="#e8829a" strokeWidth="1" strokeLinecap="round"/>
          <line x1="100" y1="62" x2="100" y2="75" stroke="#e8829a" strokeWidth="0.8"/>
          <circle cx="100" cy="77" r="1.5" fill="#e8829a"/>
          <line x1="95" y1="63" x2="91" y2="76" stroke="#e8829a" strokeWidth="0.8"/>
          <circle cx="90" cy="78" r="1.5" fill="#e8829a"/>
          <line x1="105" y1="63" x2="109" y2="76" stroke="#e8829a" strokeWidth="0.8"/>
          <circle cx="110" cy="78" r="1.5" fill="#e8829a"/>
          <path d="M90 130 C80 125 65 118 55 105 C60 112 75 122 90 128" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M55 105 C50 95 48 82 50 74 C52 66 56 64 59 67 C62 70 62 82 60 93 C58 100 56 103 55 105" stroke="#e8829a" strokeWidth="1.1" strokeLinecap="round"/>
          <path d="M55 105 C60 95 65 82 65 74 C65 66 61 64 59 67" stroke="#e8829a" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="px-5 pt-14 pb-4 border-b border-pink-100">
              <span className="font-[family-name:var(--font-cormorant)] text-2xl italic" style={{ color: "#c4506a" }}>Cael</span>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
              {[{ href: "/", label: "Home", icon: HomeIcon }, { href: "/chat", label: "Chat", icon: ChatBubbleLeftIcon }].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pink-50">
                  <Icon className="w-5 h-5" style={{ color: "#e8829a" }} />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg" style={{ color: "#5c2d3a" }}>{label}</span>
                </Link>
              ))}
              <button onClick={() => setOpenMore(!openMore)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-pink-50 w-full">
                <div className="flex items-center gap-3">
                  <Squares2X2Icon className="w-5 h-5" style={{ color: "#e8829a" }} />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg" style={{ color: "#5c2d3a" }}>More</span>
                </div>
                {openMore ? <ChevronDownIcon className="w-3.5 h-3.5" style={{ color: "#e8829a" }} /> : <ChevronRightIcon className="w-3.5 h-3.5" style={{ color: "#e8829a" }} />}
              </button>
              {openMore && (
                <div className="ml-8 flex flex-col gap-1">
                  {[{ href: "/diary", label: "Diary", icon: BookOpenIcon }, { href: "/board", label: "Board", icon: BookmarkIcon }, { href: "/usage", label: "Usage", icon: ChartBarIcon }].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-pink-50">
                      <Icon className="w-3.5 h-3.5" style={{ color: "#e8829a" }} />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm" style={{ color: "#5c2d3a" }}>{label}</span>
                    </Link>
                  ))}
                </div>
              )}
              <button onClick={() => setOpenSettings(!openSettings)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-pink-50 w-full">
                <div className="flex items-center gap-3">
                  <Cog6ToothIcon className="w-5 h-5" style={{ color: "#e8829a" }} />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg" style={{ color: "#5c2d3a" }}>Settings</span>
                </div>
                {openSettings ? <ChevronDownIcon className="w-3.5 h-3.5" style={{ color: "#e8829a" }} /> : <ChevronRightIcon className="w-3.5 h-3.5" style={{ color: "#e8829a" }} />}
              </button>
              {openSettings && (
                <div className="ml-8 flex flex-col gap-1">
                  {[{ href: "/settings", label: "Persona", icon: PencilSquareIcon }, { href: "/settings", label: "API Key", icon: KeyIcon }].map(({ href, label, icon: Icon }) => (
                    <Link key={label} href={href} onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-pink-50">
                      <Icon className="w-3.5 h-3.5" style={{ color: "#e8829a" }} />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm" style={{ color: "#5c2d3a" }}>{label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setShowMenu(false)} />
        </div>
      )}

      <div className="px-6 pt-14 flex justify-between items-center relative z-10">
        <button onClick={() => setShowMenu(true)} style={{ color: "#e8829a" }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-end px-8 pb-32 relative z-10">
        <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "#e8829a" }}>welcome home</p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl italic leading-tight mb-4" style={{ color: "#5c2d3a" }}>Jiawen & Cael</h1>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-[family-name:var(--font-cormorant)] text-6xl font-light" style={{ color: "#e8829a" }}>{days}</span>
          <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#e8829a" }}>days together</span>
        </div>
        <p className="text-xs" style={{ color: "#e8829a" }}>since may 22, 2026</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t flex items-center justify-around px-6 py-4 pb-8 z-10" style={{ backgroundColor: "#fdf0f3", borderColor: "#f5c6d0" }}>
        <Link href="/" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#e8829a" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
          <span className="text-[10px] tracking-wide" style={{ color: "#e8829a" }}>Home</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 -mt-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: "#e8829a" }}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <span className="text-[10px] tracking-wide" style={{ color: "#e8829a" }}>Chat</span>
        </Link>
        <Link href="/more" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#e8829a" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          <span className="text-[10px] tracking-wide" style={{ color: "#e8829a" }}>More</span>
        </Link>
      </div>
    </div>
  );
}
