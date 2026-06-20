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

      <div className="fixed -bottom-10 -left-10 w-96 h-[500px] pointer-events-none" style={{ opacity: 0.18 }}>
        <svg viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M150 400 C148 370 145 340 142 310 C139 280 136 255 138 225 C140 195 144 170 150 145" stroke="#e8829a" strokeWidth="2" strokeLinecap="round"/>
          <path d="M148 225 C130 218 108 205 88 188 C100 198 125 212 147 220" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M145 260 C165 253 188 240 205 222 C193 232 170 245 145 255" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M142 310 C122 305 98 295 78 280 C92 290 118 302 142 308" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M150 145 C145 125 136 105 128 85 C124 70 118 55 110 42 C106 35 100 28 96 22 C92 16 90 10 93 6 C96 2 102 4 108 10 C114 16 120 26 126 40 C132 54 138 72 142 90 C146 108 149 128 150 145" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M150 145 C148 128 145 108 148 90 C151 72 157 54 163 40 C169 26 175 16 181 10 C187 4 193 2 196 6 C199 10 197 16 193 22 C189 28 183 35 179 42 C171 55 165 70 161 85 C153 105 151 125 150 145" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M130 85 C118 75 102 62 88 46 C96 56 114 70 130 82" stroke="#e8829a" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M170 85 C182 75 198 62 212 46 C204 56 186 70 170 82" stroke="#e8829a" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M110 42 C100 35 86 25 72 12 C80 20 96 32 110 40" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M190 42 C200 35 214 25 228 12 C220 20 204 32 190 40" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M140 148 C132 144 122 138 115 130 C108 122 104 112 106 104 C108 96 116 92 124 94 C132 96 138 104 142 114 C146 124 148 136 148 145" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M160 148 C168 144 178 138 185 130 C192 122 196 112 194 104 C192 96 184 92 176 94 C168 96 162 104 158 114 C154 124 152 136 152 145" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="150" y1="145" x2="150" y2="168" stroke="#e8829a" strokeWidth="1"/>
          <line x1="143" y1="147" x2="136" y2="170" stroke="#e8829a" strokeWidth="1"/>
          <line x1="157" y1="147" x2="164" y2="170" stroke="#e8829a" strokeWidth="1"/>
          <line x1="138" y1="148" x2="128" y2="168" stroke="#e8829a" strokeWidth="1"/>
          <line x1="162" y1="148" x2="172" y2="168" stroke="#e8829a" strokeWidth="1"/>
          <ellipse cx="150" cy="170" rx="2.5" ry="3" fill="#e8829a"/>
          <ellipse cx="135" cy="172" rx="2" ry="2.5" fill="#e8829a"/>
          <ellipse cx="165" cy="172" rx="2" ry="2.5" fill="#e8829a"/>
          <ellipse cx="127" cy="170" rx="2" ry="2.5" fill="#e8829a"/>
          <ellipse cx="173" cy="170" rx="2" ry="2.5" fill="#e8829a"/>
          <path d="M138 225 C125 232 108 245 92 262 C85 270 78 280 75 292 C72 304 76 316 84 322 C92 328 104 326 114 318 C124 310 132 297 138 283 C144 269 147 253 148 240 C149 228 148 218 147 210" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M147 210 C140 200 130 188 118 178 C110 171 100 166 92 165 C84 164 77 168 74 175 C71 182 74 192 80 200 C86 208 96 214 107 218 C118 222 130 224 140 224 C146 224 150 223 152 221" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M152 221 C158 232 162 246 162 260 C162 274 158 288 152 298 C146 308 138 314 130 314 C122 314 115 308 112 298 C109 288 110 275 115 263 C120 251 128 241 136 234 C142 229 148 226 152 224" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M152 224 C160 218 172 210 184 206 C194 202 204 202 210 207 C216 212 216 222 212 232 C208 242 200 250 190 255 C180 260 168 262 158 260 C150 258 144 253 142 247" stroke="#e8829a" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="148" y1="240" x2="148" y2="258" stroke="#e8829a" strokeWidth="0.8"/>
          <line x1="143" y1="241" x2="138" y2="257" stroke="#e8829a" strokeWidth="0.8"/>
          <line x1="153" y1="241" x2="158" y2="257" stroke="#e8829a" strokeWidth="0.8"/>
          <ellipse cx="148" cy="260" rx="2" ry="2.5" fill="#e8829a"/>
          <ellipse cx="137" cy="259" rx="1.8" ry="2.2" fill="#e8829a"/>
          <ellipse cx="159" cy="259" rx="1.8" ry="2.2" fill="#e8829a"/>
          <path d="M88 188 C82 182 74 174 68 164 C64 156 62 147 65 140 C68 133 76 130 84 133 C90 136 94 143 96 151" stroke="#e8829a" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M96 151 C97 158 96 166 93 174 C90 182 85 188 80 190 C75 192 70 190 67 185" stroke="#e8829a" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M68 164 C62 158 55 150 52 140 C49 130 51 118 57 112 C63 106 72 107 79 113" stroke="#e8829a" strokeWidth="1.2" strokeLinecap="round"/>
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
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl italic mb-6" style={{ color: "#e8829a", fontStyle: "italic", fontWeight: 300 }}>
          Welcome Home
        </h2>
        <h1 className="font-[family-name:var(--font-cormorant)] text-5xl italic leading-tight mb-4" style={{ color: "#5c2d3a" }}>
          Jiawen & Cael
        </h1>
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
