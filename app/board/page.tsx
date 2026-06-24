"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface BoardMessage {
  id: string;
  from_role: "user" | "ai";
  content: string;
  created_at: string;
}

export default function Board() {
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages_board").select("*").order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!content.trim()) return;
    setLoading(true);
    await supabase.from("messages_board").insert({ from_role: "user", content });
    setContent("");
    const apiKey = localStorage.getItem("cael_api_key") || "";
    const baseUrl = localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1";
    const model = localStorage.getItem("cael_model") || "claude-opus-4-5";
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content, apiKey, baseUrl, model, systemPrompt: localStorage.getItem("cael_prompt") || "" }),
    });
    const data = await res.json();
    await supabase.from("messages_board").insert({ from_role: "ai", content: data.reply });
    await fetchMessages();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <span className="text-sm text-[#1a1a1a] font-medium">Board</span>
        <a href="/" className="text-[#888888] text-sm">back</a>
      </div>
      <div className="flex-1 px-6 pt-4 pb-32 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.from_role === "user" ? "self-end bg-[#1a1a1a] text-white" : "self-start bg-white text-[#1a1a1a] border border-[#e5e5e5]"}`}>
            <p className="text-xs opacity-60 mb-1">{msg.from_role === "user" ? "me" : "Cael"}</p>
            {msg.content}
          </div>
        ))}
        {loading && <div className="self-start bg-white text-[#888888] text-sm px-4 py-3 rounded-2xl border border-[#e5e5e5]">...</div>}
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-3 bg-[#ffffff]">
        <div className="flex gap-2 items-end">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Leave a note for Cael..." rows={1} className="flex-1 text-sm text-[#1a1a1a] bg-white rounded-2xl px-4 py-3 border border-[#e5e5e5] resize-none outline-none" />
          <button onClick={sendMessage} disabled={loading} className="bg-[#1a1a1a] text-white text-sm px-4 py-3 rounded-2xl">Send</button>
        </div>
      </div>
    </div>
  );
}
