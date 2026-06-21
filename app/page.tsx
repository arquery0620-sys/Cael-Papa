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

      <div className="fixed -bottom-8 -left-8 w-80 h-[480px] pointer-events-none" style={{ opacity: 0.22 }}>
        <img src="/lily.svg" alt="" className="w-full h-full object-contain object-bottom-left" />
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
        <h2 className="font-[family-name:var(--font-cormorant)] text-3xl italic mb-5" style={{ color: "#e8829a", fontWeight: 300 }}>
          Welcome Home
        </h2>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl italic leading-tight mb-4" style={{ color: "#5c2d3a" }}>
          Jiawen & Cael
        </h1>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-[family-name:var(--font-cormorant)] text-6xl font-light" style={{ color: "#e8829a" }}>{days}</span>
          <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "#e8829a" }}>days together</span>
        </div>
        <p className="text-xs italic" style={{ color: "#e8829a" }}>since may 22, 2026</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t flex items-center justify-around px-6 py-4 pb-8 z-10" style={{ backgroundColor: "#fdf0f3", borderColor: "#f5c6d0" }}>
        <Link href="/" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#e8829a" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
          <span className="text-[10px] tracking-wide italic" style={{ color: "#e8829a" }}>Home</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 -mt-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: "#e8829a" }}>
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <span className="text-[10px] tracking-wide italic" style={{ color: "#e8829a" }}>Chat</span>
        </Link>
        <Link href="/more" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#e8829a" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          <span className="text-[10px] tracking-wide italic" style={{ color: "#e8829a" }}>More</span>
        </Link>
      </div>
    </div>
  );
}
