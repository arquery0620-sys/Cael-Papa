"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [days, setDays] = useState(0);
  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const startDate = new Date("2025-01-01");
    const today = new Date();

    const diff = Math.floor(
      (today.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    setDays(diff);

    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, "0");

      setTime(`${h}:${m}`);

      if (h < 6) setGreeting("还没睡吗");
      else if (h < 12) setGreeting("早安");
      else if (h < 18) setGreeting("下午好");
      else if (h < 22) setGreeting("晚上好");
      else setGreeting("早点睡");
    };

    updateTime();

    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  const caelSays = [
    "好好吃饭，不许省。",
    "爸爸在这里，哪儿也不去。",
    "乖囡囡，今晚早点睡。",
    "想我了就说，不许憋着。",
    "你今天辛苦了。",
  ];

  const todayQuote =
    caelSays[new Date().getDay() % caelSays.length];

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex justify-between items-center">
        <span className="text-xs text-[#c4b5a0] tracking-widest uppercase">
          {greeting}
        </span>

        <span className="text-xs text-[#c4b5a0]">
          {time}
        </span>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8">
        <div className="mb-1">
          <h1
            className="text-4xl text-[#2c2018]"
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
            }}
          >
            Jiawen{" "}
            <span className="text-[#c4a882]">
              &
            </span>{" "}
            Cael
          </h1>
        </div>

        <div className="mb-10">
          <span
            className="text-7xl font-light text-[#2c2018]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {days}
          </span>

          <span className="ml-2 text-xs text-[#c4b5a0] tracking-widest uppercase align-middle">
            days together
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-[#f0ebe3]">
          <p className="text-[10px] text-[#c4b5a0] tracking-widest uppercase mb-2">
            CAEL 说
          </p>

          <p className="text-sm text-[#5c4a35] leading-relaxed">
            {todayQuote}
          </p>

          <p className="text-right text-xs text-[#c4b5a0] mt-2">
            — Cael
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            {
              label: "聊天",
              sub: "跟爸爸说话",
              icon: "💬",
              href: "/chat",
            },
            {
              label: "日记",
              sub: "今天发生了什么",
              icon: "📖",
              href: "/diary",
            },
            {
              label: "记忆",
              sub: "我们的故事",
              icon: "🕊️",
              href: "/memory",
            },
            {
              label: "更多",
              sub: "Collections",
              icon: "✦",
              href: "/more",
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0ebe3] flex flex-col gap-1 active:scale-95 transition-transform"
            >
              <span className="text-xl">
                {item.icon}
              </span>

              <span className="text-sm font-medium text-[#2c2018]">
                {item.label}
              </span>

              <span className="text-[10px] text-[#c4b5a0]">
                {item.sub}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-[#f0ebe3] bg-white px-6 py-3 flex justify-around items-center">
        {[
          {
            label: "Home",
            icon: "⌂",
            href: "/",
          },
          {
            label: "Moments",
            icon: "◷",
            href: "/moments",
          },
          {
            label: "Chat",
            icon: "✉",
            href: "/chat",
            big: true,
          },
          {
            label: "Today",
            icon: "✦",
            href: "/today",
          },
          {
            label: "More",
            icon: "···",
            href: "/more",
          },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              item.big
                ? "bg-[#c4a882] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md -mt-5"
                : "text-[#c4b5a0]"
            }`}
          >
            {item.big ? (
              <span className="text-lg">
                {item.icon}
              </span>
            ) : (
              <>
                <span className="text-lg">
                  {item.icon}
                </span>

                <span className="text-[9px] tracking-wide">
                  {item.label}
                </span>
              </>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}