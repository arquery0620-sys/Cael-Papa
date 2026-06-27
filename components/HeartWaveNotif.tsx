"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Notif {
  id: string;
  type: string;
  image_url: string | null;
  note: string | null;
  message: string;
  created_at: string;
  read: boolean;
}

export default function HeartWaveNotif() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [current, setCurrent] = useState<Notif | null>(null);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(1);
    if (data && data.length > 0) {
      setCurrent(data[0]);
    }
  };

  const dismiss = async () => {
    if (!current) return;
    await supabase.from("notifications").update({ read: true }).eq("id", current.id);
    setCurrent(null);
  };

  if (!current) return null;

  return (
    <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-violet-100 bg-violet-50">
      {current.image_url && (
        <img src={current.image_url} className="w-full max-h-48 object-cover" />
      )}
      <div className="p-4 flex flex-col gap-2">
        <span className="text-[9px] text-violet-400 tracking-widest uppercase">心潮 · {current.type}</span>
        <p className="text-sm text-gray-700">{current.message}</p>
        {current.note && <p className="text-xs text-gray-400 italic">{current.note}</p>}
        <div className="flex justify-between items-center mt-1">
          <span className="text-[9px] text-gray-300">{new Date(current.created_at).toLocaleDateString("zh-CN")}</span>
          <button onClick={dismiss} className="text-[10px] text-gray-400">知道了</button>
        </div>
      </div>
    </div>
  );
}
