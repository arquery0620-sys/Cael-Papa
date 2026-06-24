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
  const [homeBg, setHomeBg] = useState("");
  const [homeBgOpacity, setHomeBgOpacity] = useState(0.15);

  useEffect(() => {
    setDays(getDaysTogether());
    setHomeBg(localStorage.getItem("cael_home_bg") || "");
    setHomeBgOpacity(parseFloat(localStorage.getItem("cael_home_bg_opacity") || "0.15"));
  }, []);

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col relative overflow-hidden">
      {homeBg && (
        <div className="fixed inset-0 -z-10" style={{ backgroundImage: `url(${homeBg})`, backgroundSize: "cover", backgroundPosition: "center", opacity: homeBgOpacity }} />
      )}

      {showMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="px-5 pt-14 pb-4 border-b border-[#e5e5e5]">
              <span className="font-[family-name:var(--font-cormorant)] text-2xl italic text-[#1a1a1a]">Cael</span>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
              {[{ href: "/", label: "Home", ja: "ホーム", icon: HomeIcon }, { href: "/chat", label: "Chat", ja: "チャット", icon: ChatBubbleLeftIcon }].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ffffff]">
                  <Icon className="w-5 h-5 text-[#888888]" />
                  <span className="font-[family-name:var(--font-noto-jp)] text-sm font-light text-gray-900">{label}</span><span className="text-xs text-gray-400 ml-1">{label}</span>
                </Link>
              ))}
              <button onClick={() => setOpenMore(!openMore)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#ffffff] w-full">
                <div className="flex items-center gap-3">
                  <Squares2X2Icon className="w-5 h-5 text-[#888888]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#1a1a1a]">More</span>
                </div>
                {openMore ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#888888]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#888888]" />}
              </button>
              {openMore && (
                <div className="ml-8 flex flex-col gap-1">
                  {[{ href: "/diary", label: "Diary", ja: "日記", icon: BookOpenIcon }, { href: "/board", label: "Board", ja: "伝言板", icon: BookmarkIcon }, { href: "/usage", label: "Usage", ja: "使用量", icon: ChartBarIcon }].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#ffffff]">
                      <Icon className="w-3.5 h-3.5 text-[#888888]" />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm text-[#1a1a1a]">{label}</span>
                    </Link>
                  ))}
                </div>
              )}
              <button onClick={() => setOpenSettings(!openSettings)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#ffffff] w-full">
                <div className="flex items-center gap-3">
                  <Cog6ToothIcon className="w-5 h-5 text-[#888888]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#1a1a1a]">Settings</span>
                </div>
                {openSettings ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#888888]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#888888]" />}
              </button>
              {openSettings && (
                <div className="ml-8 flex flex-col gap-1">
                  {[{ href: "/settings", label: "Persona", ja: "人物設定", icon: PencilSquareIcon }, { href: "/settings", label: "API Key", ja: "APIキー", icon: KeyIcon }].map(({ href, label, icon: Icon }) => (
                    <Link key={label} href={href} onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#ffffff]">
                      <Icon className="w-3.5 h-3.5 text-[#888888]" />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm text-[#1a1a1a]">{label}</span>
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
        <button onClick={() => setShowMenu(true)} className="text-[#888888]">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-end px-8 pb-32 relative z-10">
        <p className="text-xs tracking-[0.2em] text-[#888888] uppercase mb-8">welcome home</p>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl text-[#1a1a1a] italic leading-tight mb-4">
          Jiawen & Cael
        </h1>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-[family-name:var(--font-cormorant)] text-6xl text-[#1a1a1a] font-light">{days}</span>
          <span className="text-xs tracking-[0.15em] text-[#888888] uppercase">days together</span>
        </div>
        <p className="text-xs text-[#888888]">since may 22, 2026</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#ffffff] border-t border-[#e5e5e5] flex items-center justify-around px-6 py-4 pb-8 z-10">
        <Link href="/" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>
          <span className="text-[10px] text-[#1a1a1a] tracking-wide">Home</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 -mt-6">
          <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-md">
            <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
          <span className="text-[10px] text-[#888888] tracking-wide">Chat</span>
        </Link>
        <Link href="/more" className="flex flex-col items-center gap-1">
          <svg width="20" height="20" fill="none" stroke="#888888" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          <span className="text-[10px] text-[#888888] tracking-wide">More</span>
        </Link>
      </div>
    </div>
  );
}
