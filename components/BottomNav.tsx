"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/moments",
    label: "Circle",
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    href: "/",
    label: "Home",
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/></svg>,
  },
  {
    href: "/chat",
    label: "Chat",
    isMain: true,
    icon: <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
  {
    href: "/more",
    label: "More",
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e5] flex items-center justify-around px-6 py-4 pb-8 z-10">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        if (item.isMain) {
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
              <div className={isActive ? "bg-[#1a1a1a] p-2 rounded-full" : "p-2"} style={{ color: isActive ? "white" : "#888888" }}>
                {item.icon}
              </div>
              <span className={`text-[10px] tracking-wide ${isActive ? "text-[#1a1a1a]" : "text-[#888888]"}`}>{item.label}</span>
            </Link>
          );
        }
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
            <div className={isActive ? "bg-[#1a1a1a] p-2 rounded-full" : "p-2"} style={{ color: isActive ? "white" : "#888888" }}>
              {item.icon}
            </div>
            <span className={`text-[10px] tracking-wide ${isActive ? "text-[#1a1a1a]" : "text-[#888888]"}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
