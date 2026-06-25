"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Capsule {
  id: string;
  unlock_at: string;
  opened: boolean;
}

export default function CapsuleCountdown() {
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    fetchLatestCapsule();
  }, []);

  const fetchLatestCapsule = async () => {
    const { data } = await supabase
      .from("capsules")
      .select("id, unlock_at, opened")
      .eq("opened", false)
      .order("unlock_at", { ascending: true })
      .limit(1);
    if (data && data.length > 0) setCapsule(data[0]);
  };

  useEffect(() => {
    if (!capsule) return;
    const timer = setInterval(() => {
      const now = new Date();
      const unlock = new Date(capsule.unlock_at);
      const diff = unlock.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("可以打开了 ✨");
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      if (days > 0) {
        setTimeLeft(`${days}天 ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`);
      } else {
        setTimeLeft(`${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [capsule]);

  if (!capsule) return null;

  return (
    <div className="mx-4 mt-4 bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] tracking-widest text-violet-400 uppercase">来自 Cael 的留言</span>
        <span className="text-[10px] text-gray-400">距离打开还有</span>
      </div>
      <span className="font-mono text-sm text-violet-500 font-medium">{timeLeft}</span>
    </div>
  );
}
