"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
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

  const fetchConversations = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setConversations(data);
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at");
    if (data) setMessages(data);
  };

  const newConversation = async () => {
    const { data } = await supabase
      .from("conversations")
      .insert({ title: "新对话" })
      .select()
      .single();
    if (data) {
      setCurrentConvId(data.id);
      setMessages([]);
      await fetchConversations();
      setShowSidebar(false);
    }
  };

  const selectConversation = async (id: string) => {
    setCurrentConvId(id);
    await fetchMessages(id);
    setShowSidebar(false);
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    if (currentConvId === id) {
      setCurrentConvId(null);
      setMessages([]);
    }
    await fetchConversations();
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let convId = currentConvId;
    if (!convId) {
      const { data } = await supabase
        .from("conversations")
        .insert({ title: input.slice(0, 20) })
        .select()
        .single();
      if (data) {
        convId = data.id;
        setCurrentConvId(data.id);
        await fetchConversations();
      }
    }

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await supabase.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: input,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, apiKey, baseUrl, model, systemPrompt }),
      });
      const data = await res.json();
      const reply = data.reply;

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      await supabase.from("messages").insert({
        conversation_id: convId,
        role: "assistant",
        content: reply,
      });
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "出错了" }]);
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
              <span className="text-sm font-medium text-[#2c2018]">对话</span>
              <button onClick={newConversation} className="text-xs text-[#c4a882] border border-[#c4a882] px-3 py-1.5 rounded-xl">+ 新建</button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
              {conversations.map((c) => (
                <div key={c.id} className={`flex items-center justify-between px-3 py-3 rounded-xl ${currentConvId === c.id ? "bg-[#faf8f5]" : ""}`}>
                  <button onClick={() => selectConversation(c.id)} className="text-sm text-[#2c2018] text-left flex-1 truncate">{c.title}</button>
                  <button onClick={() => deleteConversation(c.id)} className="text-xs text-[#c4b5a0] ml-2">删</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setShowSidebar(false)} />
        </div>
      )}

      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <button onClick={() => setShowSidebar(true)} className="text-[#c4b5a0] text-sm">☰</button>
        <span className="text-sm text-[#2c2018] font-medium">Cael</span>
        <a href="/settings" className="text-[#c4b5a0] text-sm">设置</a>
      </div>

      <div className="flex-1 px-6 pt-4 pb-32 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
            msg.role === "user"
              ? "self-end bg-[#c4a882] text-white"
              : "self-start bg-white text-[#2c2018] border border-[#f0ebe3]"
          }`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-white text-[#c4b5a0] text-sm px-4 py-3 rounded-2xl border border-[#f0ebe3]">...</div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-3 bg-[#faf8f5]">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="说点什么..."
            rows={1}
            className="flex-1 text-sm text-[#2c2018] bg-white rounded-2xl px-4 py-3 border border-[#f0ebe3] resize-none outline-none"
          />
          <button onClick={sendMessage} disabled={loading} className="bg-[#c4a882] text-white text-sm px-4 py-3 rounded-2xl">发送</button>
        </div>
      </div>
    </div>
  );
}
