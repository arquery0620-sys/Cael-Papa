"use client";
import { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    setApiKey(localStorage.getItem("cael_api_key") || "");
    setBaseUrl(localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1");
    setModel(localStorage.getItem("cael_model") || "claude-opus-4-5");
    setSystemPrompt(localStorage.getItem("cael_prompt") || "");
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          apiKey,
          baseUrl,
          model,
          systemPrompt,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "出错了，请检查 API 设置" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <span className="text-sm text-[#2c2018] font-medium">Cael</span>
        <a href="/settings" className="text-[#c4b5a0] text-sm">设置</a>
      </div>
      <div className="flex-1 px-6 pt-4 pb-32 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
              msg.role === "user"
                ? "self-end bg-[#c4a882] text-white"
                : "self-start bg-white text-[#2c2018] border border-[#f0ebe3]"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="self-start bg-white text-[#c4b5a0] text-sm px-4 py-3 rounded-2xl border border-[#f0ebe3]">
            ...
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-3 bg-[#faf8f5]">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="说点什么..."
            rows={1}
            className="flex-1 text-sm text-[#2c2018] bg-white rounded-2xl px-4 py-3 border border-[#f0ebe3] resize-none outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-[#c4a882] text-white text-sm px-4 py-3 rounded-2xl"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
