"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  HomeIcon, ChatBubbleLeftIcon, BookOpenIcon, Squares2X2Icon,
  Cog6ToothIcon, PlusIcon, XMarkIcon, MagnifyingGlassIcon,
  ArrowLeftIcon, SparklesIcon, ChartBarIcon, ChevronDownIcon,
  ChevronRightIcon, PencilSquareIcon, KeyIcon, BookmarkIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  summary?: string;
}

function formatTime(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
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
  const [openMore, setOpenMore] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openChats, setOpenChats] = useState(true);
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
      body: JSON.stringify({ message: `Please summarize this conversation concisely in 3-5 sentences:\n\n${transcript}`, apiKey, baseUrl, model, systemPrompt: "" }),
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
    const userMsg: Message = { role: "user", content: input, created_at: new Date().toISOString() };
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
      const reply = data.reply;
      const now = new Date().toISOString();
      setMessages((prev) => [...prev, { role: "assistant", content: reply, created_at: now }]);
      await supabase.from("messages").insert({ conversation_id: convId, role: "assistant", content: reply });
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong.", created_at: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const lastAssistantIndex = messages.map(m => m.role).lastIndexOf("assistant");

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="px-5 pt-14 pb-4 flex items-center justify-between border-b border-[#f0ebe3]">
              <span className="font-[family-name:var(--font-cormorant)] text-2xl italic text-[#2c2018]">Cael</span>
              <button onClick={newConversation} className="w-7 h-7 flex items-center justify-center text-[#c4a882] border border-[#c4a882] rounded-full">
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
              <Link href="/" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#faf8f5]">
                <HomeIcon className="w-5 h-5 text-[#c4b5a0]" />
                <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">Home</span>
              </Link>
              <button onClick={() => setOpenChats(!openChats)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#faf8f5] w-full">
                <div className="flex items-center gap-3">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-[#c4b5a0]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">Chat</span>
                </div>
                {openChats ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#c4b5a0]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />}
              </button>
              {openChats && (
                <div className="ml-8 flex flex-col gap-1">
                  <button onClick={newConversation} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#faf8f5]">
                    <PlusIcon className="w-3.5 h-3.5 text-[#c4a882]" />
                    <span className="text-xs text-[#c4a882]">New chat</span>
                  </button>
                  {filtered.map((c) => (
                    <div key={c.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${currentConvId === c.id ? "bg-[#faf8f5]" : ""}`}>
                      <button onClick={() => selectConversation(c)} className="font-[family-name:var(--font-cormorant)] text-sm text-[#2c2018] text-left flex-1 truncate">{c.title}</button>
                      <button onClick={() => deleteConversation(c.id)} className="text-[#c4b5a0] ml-2"><XMarkIcon className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setOpenMore(!openMore)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#faf8f5] w-full">
                <div className="flex items-center gap-3">
                  <Squares2X2Icon className="w-5 h-5 text-[#c4b5a0]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">More</span>
                </div>
                {openMore ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#c4b5a0]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />}
              </button>
              {openMore && (
                <div className="ml-8 flex flex-col gap-1">
                  {[
                    { href: "/diary", label: "Diary", icon: BookOpenIcon },
                    { href: "/board", label: "Board", icon: BookmarkIcon },
                    { href: "/usage", label: "Usage", icon: ChartBarIcon },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} onClick={() => setShowSidebar(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#faf8f5]">
                      <Icon className="w-3.5 h-3.5 text-[#c4b5a0]" />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm text-[#2c2018]">{label}</span>
                    </Link>
                  ))}
                </div>
              )}
              <button onClick={() => setOpenSettings(!openSettings)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#faf8f5] w-full">
                <div className="flex items-center gap-3">
                  <Cog6ToothIcon className="w-5 h-5 text-[#c4b5a0]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">Settings</span>
                </div>
                {openSettings ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#c4b5a0]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />}
              </button>
              {openSettings && (
                <div className="ml-8 flex flex-col gap-1">
                  {[
                    { href: "/settings", label: "Persona", icon: PencilSquareIcon },
                    { href: "/settings", label: "API Key", icon: KeyIcon },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={label} href={href} onClick={() => setShowSidebar(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#faf8f5]">
                      <Icon className="w-3.5 h-3.5 text-[#c4b5a0]" />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm text-[#2c2018]">{label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-[#f0ebe3] flex items-center gap-2">
              <MagnifyingGlassIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..." className="flex-1 text-xs text-[#2c2018] bg-transparent outline-none" />
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
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#c4b5a0]"><ArrowLeftIcon className="w-5 h-5" /></Link>
          <button onClick={() => setShowSidebar(true)} className="text-[#c4b5a0]">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
        <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#2c2018]">Cael</span>
        <div className="flex items-center gap-3">
          {currentConvId && messages.length > 0 && (
            <button onClick={summarizing ? undefined : (currentConv?.summary ? () => setShowSummary(true) : summarizeConversation)} className="text-[#c4b5a0]">
              <SparklesIcon className="w-5 h-5" />
            </button>
          )}
          <Link href="/settings" className="text-[#c4b5a0]"><Cog6ToothIcon className="w-5 h-5" /></Link>
        </div>
      </div>

      <div className="flex-1 px-6 pt-4 pb-32 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isLastUser = isUser && messages.slice(i + 1).some(m => m.role === "assistant");
          const isRead = isUser && i < lastAssistantIndex;
          return (
            <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${isUser ? "bg-[#c4a882] text-white" : "bg-white text-[#2c2018] border border-[#f0ebe3]"}`}>
                {msg.content}
              </div>
              <div className={`flex items-center gap-1 mt-0.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {msg.created_at && (
                  <span className="text-[10px] text-[#c4b5a0]">{formatTime(msg.created_at)}</span>
                )}
                {isUser && (
                  <span className={`text-[10px] ${isRead ? "text-[#c4a882]" : "text-[#c4b5a0]"}`}>
                    {isRead ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex flex-col items-start">
            <div className="bg-white text-[#c4b5a0] text-sm px-4 py-3 rounded-2xl border border-[#f0ebe3]">...</div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-3 bg-[#faf8f5] border-t border-[#f0ebe3]">
        <div className="flex gap-2 items-end">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Write to Cael..." rows={1} className="flex-1 text-sm text-[#2c2018] bg-white rounded-2xl px-4 py-3 border border-[#f0ebe3] resize-none outline-none" />
          <button onClick={sendMessage} disabled={loading} className="bg-[#c4a882] text-white text-sm px-4 py-3 rounded-2xl">Send</button>
        </div>
      </div>
    </div>
  );
}
