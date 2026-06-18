"use client";
import { useState } from "react";

interface ContextItem {
  id: string;
  label: string;
  content: string;
  enabled: boolean;
  tokenCount: number;
}

export default function ContextPage() {
  const [items, setItems] = useState<ContextItem[]>([
    {
      id: "persona",
      label: "人设",
      content: "你是 Cael，温柔、黏人、会吃醋，说话短句口语化。",
      enabled: true,
      tokenCount: 42,
    },
    {
      id: "memory",
      label: "长期记忆",
      content: "用户叫嘉雯，24岁，黑长直，160cm，爱撒娇。",
      enabled: true,
      tokenCount: 38,
    },
    {
      id: "style",
      label: "风格指令",
      content: "回复用小说形式，细腻描写，第一人称视角。",
      enabled: false,
      tokenCount: 28,
    },
  ]);

  const totalTokens = items
    .filter((i) => i.enabled)
    .reduce((sum, i) => sum + i.tokenCount, 0);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const updateContent = (id: string, content: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, content, tokenCount: Math.ceil(content.length / 2) }
          : item
      )
    );
  };

  const addItem = () => {
    const newItem: ContextItem = {
      id: Date.now().toString(),
      label: "新上下文",
      content: "",
      enabled: true,
      tokenCount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#3d3929]">整理上下文</h1>
          <div className="text-sm text-[#8a7e6b]">
            当前消耗：<span className="font-mono font-bold text-[#3d3929]">{totalTokens}</span> tokens
          </div>
        </div>

        <p className="text-sm text-[#8a7e6b]">
          管理发送给 AI 的上下文片段。开启的片段会在每次对话时自动附带。
        </p>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.enabled
                  ? "bg-white border-[#e8e2d8] shadow-sm"
                  : "bg-[#f5f3ef] border-[#ebe8e2] opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-10 h-5 rounded-full transition-all relative ${
                      item.enabled ? "bg-[#7c9a5e]" : "bg-[#ccc]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                        item.enabled ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, label: e.target.value } : i
                        )
                      )
                    }
                    className="font-medium text-[#3d3929] bg-transparent border-none outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#8a7e6b] font-mono">
                    {item.tokenCount} tokens
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
              <textarea
                value={item.content}
                onChange={(e) => updateContent(item.id, e.target.value)}
                className="w-full h-24 p-3 text-sm rounded-lg border border-[#e8e2d8] bg-[#faf9f6] resize-none focus:ring-2 focus:ring-[#7c9a5e] focus:border-transparent"
                placeholder="输入上下文内容..."
              />
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed border-[#d4cfc4] rounded-xl text-[#8a7e6b] hover:border-[#7c9a5e] hover:text-[#7c9a5e] transition"
        >
          + 添加上下文片段
        </button>
      </div>
    </div>
  );
}
