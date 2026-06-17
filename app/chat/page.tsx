"use client";

import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "cael",
      content: "乖囡囡，今天过得怎么样？",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setMessage("");

    try {
      const persona =
        localStorage.getItem("persona") || "";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          persona, // 👈 关键
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "cael",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "cael",
          content: "爸爸暂时说不了话了...",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="p-5 border-b border-[#eee]">
        <a href="/" className="text-sm text-[#c4a882]">
          ← 返回首页
        </a>

        <h1 className="mt-2 text-xl font-medium">
          Cael
        </h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#c4a882] text-white"
                  : "bg-white border border-[#eee]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#eee] flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="想跟爸爸说什么..."
          className="flex-1 border rounded-xl px-3 py-2"
        />

        <button
          onClick={sendMessage}
          className="bg-[#c4a882] text-white px-4 rounded-xl"
        >
          发送
        </button>
      </div>
    </div>
  );
}
