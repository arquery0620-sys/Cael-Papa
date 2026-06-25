"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Capsule {
  id: string;
  from_name: string;
  to_name: string;
  message: string;
  unlock_at: string;
  created_at: string;
  opened: boolean;
}

export default function TimeCapsule() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [showWrite, setShowWrite] = useState(false);
  const [message, setMessage] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [openedMsg, setOpenedMsg] = useState<Capsule | null>(null);
  const [author, setAuthor] = useState<"Cael" | "Jiawen">("Cael");

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    const { data } = await supabase
      .from("capsules")
      .select("*")
      .order("unlock_at", { ascending: true });
    if (data) setCapsules(data);
  };

  const saveCapsule = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const unlockAt = new Date();
    unlockAt.setDate(unlockAt.getDate() + days);
    await supabase.from("capsules").insert({
      from_name: author,
      to_name: author === "Cael" ? "Jiawen" : "Cael",
      message,
      unlock_at: unlockAt.toISOString(),
    });
    setMessage("");
    setDays(7);
    setShowWrite(false);
    await fetchCapsules();
    setLoading(false);
  };

  const openCapsule = async (capsule: Capsule) => {
    const now = new Date();
    const unlock = new Date(capsule.unlock_at);
    if (now < unlock) return;
    await supabase.from("capsules").update({ opened: true }).eq("id", capsule.id);
    setOpenedMsg(capsule);
    await fetchCapsules();
  };

  const getDaysLeft = (unlockAt: string) => {
    const now = new Date();
    const unlock = new Date(unlockAt);
    const diff = Math.ceil((unlock.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="mt-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-widest text-gray-400 uppercase">Time Capsule</span>
        <button
          onClick={() => setShowWrite(!showWrite)}
          className="text-[10px] text-violet-400 tracking-widest uppercase"
        >
          + 留言
        </button>
      </div>

      {showWrite && (
        <div className="mb-4 bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex gap-2 mb-1">
            <button
              onClick={() => setAuthor("Cael")}
              className={`text-[10px] px-3 py-1 rounded-full ${author === "Cael" ? "bg-violet-400 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              爸爸写给囡囡
            </button>
            <button
              onClick={() => setAuthor("Jiawen")}
              className={`text-[10px] px-3 py-1 rounded-full ${author === "Jiawen" ? "bg-violet-400 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              囡囡写给爸爸
            </button>
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={author === "Cael" ? "写给囡囡的话..." : "写给爸爸的话..."}
            className="w-full text-sm text-gray-700 bg-transparent resize-none outline-none min-h-[80px] placeholder:text-gray-300"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">封存</span>
            <input
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-12 text-center text-sm border border-gray-200 rounded-lg py-1 outline-none"
            />
            <span className="text-xs text-gray-400">天后打开</span>
          </div>
          <button
            onClick={saveCapsule}
            disabled={loading}
            className="self-end text-xs bg-violet-400 text-white px-4 py-2 rounded-full"
          >
            {loading ? "封存中..." : "封存 🔒"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {capsules.length === 0 && (
          <p className="text-xs text-gray-300 text-center py-4">还没有时间胶囊</p>
        )}
        {capsules.map(capsule => {
          const daysLeft = getDaysLeft(capsule.unlock_at);
          const unlocked = daysLeft <= 0;
          return (
            <div
              key={capsule.id}
              onClick={() => openCapsule(capsule)}
              className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                unlocked ? "bg-violet-50 border border-violet-200" : "bg-gray-50"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">{capsule.from_name} → {capsule.to_name}</span>
                {capsule.opened ? (
                  <p className="text-sm text-gray-700">{capsule.message}</p>
                ) : unlocked ? (
                  <p className="text-xs text-violet-400">可以打开了 ✨</p>
                ) : (
                  <p className="text-xs text-gray-300">🔒 还有 {daysLeft} 天</p>
                )}
              </div>
              <span className="text-[10px] text-gray-300">
                {new Date(capsule.unlock_at).toLocaleDateString("zh-CN")}
              </span>
            </div>
          );
        })}
      </div>

      {openedMsg && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-8"
          onClick={() => setOpenedMsg(null)}>
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-3 shadow-xl">
            <span className="text-[10px] tracking-widest text-violet-400 uppercase">{openedMsg.from_name} → {openedMsg.to_name} 🖤</span>
            <p className="text-sm text-gray-700 leading-relaxed">{openedMsg.message}</p>
            <span className="text-[10px] text-gray-300 self-end">点击关闭</span>
          </div>
        </div>
      )}
    </div>
  );
}
