"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface UsageLog {
  id: string;
  input_tokens: number;
  output_tokens: number;
  created_at: string;
  conversation_id: string;
}

export default function Usage() {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [totalIn, setTotalIn] = useState(0);
  const [totalOut, setTotalOut] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from("usage_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      setLogs(data);
      setTotalIn(data.reduce((sum, l) => sum + (l.input_tokens || 0), 0));
      setTotalOut(data.reduce((sum, l) => sum + (l.output_tokens || 0), 0));
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <Link href="/more" className="text-[#c4b5a0] text-sm">back</Link>
        <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#2c2018]">Usage</span>
        <div className="w-8" />
      </div>
      <div className="px-6 pt-4 flex flex-col gap-4 pb-24">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
            <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Input</p>
            <p className="font-[family-name:var(--font-cormorant)] text-3xl text-[#2c2018]">{totalIn.toLocaleString()}</p>
            <p className="text-xs text-[#c4b5a0] mt-1">tokens</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
            <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Output</p>
            <p className="font-[family-name:var(--font-cormorant)] text-3xl text-[#2c2018]">{totalOut.toLocaleString()}</p>
            <p className="text-xs text-[#c4b5a0] mt-1">tokens</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#f0ebe3] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#f0ebe3]">
            <p className="text-xs text-[#c4b5a0] tracking-widest uppercase">Recent</p>
          </div>
          {logs.length === 0 ? (
            <p className="text-xs text-[#c4b5a0] px-5 py-4">No data yet</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="px-5 py-3 border-b border-[#f0ebe3] flex items-center justify-between">
                <p className="text-xs text-[#c4b5a0]">{new Date(log.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                <p className="text-xs text-[#2c2018]">{log.input_tokens} in · {log.output_tokens} out</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
