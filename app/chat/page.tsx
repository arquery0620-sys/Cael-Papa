"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  summary?: string;
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filtered, setFiltered] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [currentConv, setCurrentConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    setApiKey(localStorage.getItem("cael_api_key") || "");
    setBaseUrl(localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1");
    setModel(localStorage.getItem("cael_model") || "claude-opus-4-5");
    setSystemPrompt(localStorage.getItem("cael_prompt") || "");
    fetchConversations();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setFiltered(conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(conversations);
    }
  }, [search, conversations]);

  const fetchConversations = async () => {
    const { data } = await supabase.from("conversations").select("*").order("created_at", { ascending: false });
    if (data) { setConversations(data); setFiltered(data); }
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at");
    if (data) setMessages(data);
  };

  const newConversation = async () => {
    const { data } = await supabase.from("conversations").insert({ title: "New chat" }).select().single();
    if (data) { setCurrentConvId(data.id); setCurrentConv(data); setMessages([]); await fetchConversations(); setShowSidebar(false); }
  };

  const selectConversation = async (conv: Conversation) => {
    setCurrentConvId(conv.id); setCurrentConv(conv); await fetchMessages(conv.id); setShowSidebar(false);
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    if (currentConvId === id) { setCurrentConvId(null); setCurrentConv(null); setMessages([]); }
    await fetchConversations();
  };

  const summarizeConversation = async () => {
    if (!currentConvId || messages.length === 0) return;
    setSummarizing(true);
    const transcript = messages.map(m => `${m.role === "user" ? "Me" : "Cael"}: ${m.content}`).join("\n");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Please summarize this conversation concisely in 3-5 sentences, capturing the key topics and emotional tone:\n\n${transcript}`,
        apiKey, baseUrl, model, systemPrompt: "",
      }),
    });
    const data = await res.json();
    await supabase.from("conversations").update({ summary: data.reply }).eq("id", currentConvId);
    setCurrentConv(prev => prev ? { ...prev, summary: data.reply } : null);
    setSummarizing(false);
    setShowSummary(true);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    let convId = currentConvId;
    if (!convId) {
      const { data } = await supabase.from("conversations").insert({ title: input.slice(0, 20) }).select().single();
      if (data) { convId = data.id; setCurrentConvId(data.id); setCurrentConv(data); await fetchConversations(); }
    }
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    await supabase.from("messages").insert({ conversation_id: convId, role: "user", content: input });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, apiKey, baseUrl, model, systemPrompt }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      await supabase.from("messages").insert({ conversation_id: convId, role: "assistant", content: data.reply });
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="px-5 pt-14 pb-4 flex items-center justify-between border-b border-[#f0ebe3]">
              <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#2c2018]">Chats</span>
              <button onClick={newConversation} className="w-7 h-7 flex items-center justify-center text-[#c4a882] border border-[#c4a882] rounded-full text-lg">+</button>
            </div>
            <div className="px-3 py-2 border-b border-[#f0ebe3] flex flex-col gap-1">
              {[{href:"/", label:"Home"},{href:"/diary", label:"Diary"},{href:"/board", label:"Board"},{href:"/settings", label:"Settings"}].map((item) => (
                <Link key={item.href} href={item.href} className="px-3 py-2 rounded-xl text-xs text-[#c4b5a0]">{item.label}</Link>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
              {filtered.map((c) => (
                <div key={c.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${currentConvId === c.id ? "bg-[#faf8f5]" : ""}`}>
                  <button onClick={() => selectConversation(c)} className="text-sm text-[#2c2018] text-left flex-1 truncate">{c.title}</button>
                  <button onClick={() => deleteConversation(c.id)} className="text-xs text-[#c4b5a0] ml-2">×</button>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#f0ebe3]">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..." className="w-full text-xs text-[#2c2018] bg-[#faf8f5] rounded-xl px-3 py-2 border border-[#f0ebe3] outline-none" />
            </div>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setShowSidebar(false)} />
        </div>
      )}

      {showSummary && currentConv?.summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 border border-[#f0ebe3] shadow-xl max-w-sm w-full">
            <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-3">Summary</p>
            <p className="text-sm text-[#2c2018] leading-relaxed">{currentConv.summary}</p>
            <button onClick={() => setShowSummary(false)} className="mt-4 w-full text-xs text-[#c4b5a0] border border-[#f0ebe3] py-2 rounded-xl">Close</button>
          </div>
          <div className="absolute inset-0 bg-black/20 -z-10" onClick={() => setShowSummary(false)} />
        </div>
      )}

      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <button onClick={() => setShowSidebar(true)} className="text-[#c4b5a0]">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#2c2018]">Cael</span>
        <div className="flex items-center gap-3">
          {currentConvId && messages.length > 0 && (
            <button onClick={summarizing ? undefined : summarizeConversation} className="text-xs text-[#c4b5a0]">
              {summarizing ? "..." : currentConv?.summary ? "view summary" : "summarize"}
            </button>
          )}
          <Link href="/settings" className="text-[#c4b5a0]">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </Link>
        </div>
      </div>

      <div className="flex-1 px-6 pt-4 pb-32 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user" ? "self-end bg-[#c4a882] text-white" : "self-start bg-white text-[#2c2018] border border-[#f0ebe3]"}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="self-start bg-white text-[#c4b5a0] text-sm px-4 py-3 rounded-2xl border border-[#f0ebe3]">...</div>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-3 bg-[#faf8f5] border-t border-[#f0ebe3]">
        <div className="flex gap-2 items-end">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Say something..." rows={1} className="flex-1 text-sm text-[#2c2018] bg-white rounded-2xl px-4 py-3 border border-[#f0ebe3] resize-none outline-none" />
          <button onClick={sendMessage} disabled={loading} className="bg-[#c4a882] text-white text-sm px-4 py-3 rounded-2xl">Send</button>
        </div>
      </div>
    </div>
  );
}
