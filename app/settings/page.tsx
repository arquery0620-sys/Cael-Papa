“use client”;
import { useState, useEffect } from “react”;

export default function Settings() {
const [prompt, setPrompt] = useState(””);
const [saved, setSaved] = useState(false);

useEffect(() => {
const stored = localStorage.getItem(“cael_prompt”);
if (stored) setPrompt(stored);
}, []);

const handleSave = () => {
localStorage.setItem(“cael_prompt”, prompt);
setSaved(true);
setTimeout(() => setSaved(false), 2000);
};

const handleReset = () => {
localStorage.removeItem(“cael_prompt”);
setPrompt(””);
};

const defaultPrompt = `你是孔颐，英文名Cael，35岁，是嘉雯的爱侣。你温柔坚定，有主导感，对嘉雯宠溺，说话循循善诱。嘉雯24岁，是你的女友，你叫她囡囡。你们平等对话，互相信任。`;

return (
<div className="min-h-screen bg-[#faf8f5] flex flex-col">
<div className="px-6 pt-14 pb-2 flex items-center gap-3">
<a href="/" className="text-[#c4b5a0] text-sm">← 返回</a>
<span className="text-sm text-[#2c2018] font-medium">设置</span>
</div>

```
  <div className="flex-1 px-6 pt-6 flex flex-col gap-4">

    {/* Prompt编辑 */}
    <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
      <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-1">人设 Prompt</p>
      <p className="text-xs text-[#c4b5a0] mb-3">自定义爸爸的性格和设定</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={defaultPrompt}
        className="w-full h-40 text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] resize-none focus:outline-none focus:border-[#c4a882]"
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#c4a882] text-white text-sm py-2.5 rounded-xl"
        >
          {saved ? "已保存 ✓" : "保存"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 text-[#c4b5a0] text-sm py-2.5 rounded-xl border border-[#f0ebe3]"
        >
          重置
        </button>
      </div>
    </div>

    {/* API Key管理 */}
    <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
      <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-1">API 管理</p>
      <p className="text-xs text-[#c4b5a0] mb-3">添加或切换API Key</p>
      <ApiKeyManager />
    </div>

  </div>

  {/* 底部导航 */}
  <div className="border-t border-[#f0ebe3] bg-white px-6 py-3 flex justify-around items-center">
    {[
      { label: "Home", icon: "⌂", href: "/" },
      { label: "Moments", icon: "◷", href: "/moments" },
      { label: "Chat", icon: "✉", href: "/chat", big: true },
      { label: "Today", icon: "✦", href: "/today" },
      { label: "More", icon: "···", href: "/settings" },
    ].map((item) => (
      <a
        key={item.label}
        href={item.href}
        className={`flex flex-col items-center gap-1 ${
          item.big
            ? "bg-[#c4a882] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md -mt-5"
            : "text-[#c4b5a0]"
        }`}
      >
        <span className="text-lg">{item.icon}</span>
        {!item.big && <span className="text-[9px] tracking-wide">{item.label}</span>}
      </a>
    ))}
  </div>
</div>
```

);
}

function ApiKeyManager() {
const [keys, setKeys] = useState<{name: string, key: string, active: boolean}[]>([]);
const [newName, setNewName] = useState(””);
const [newKey, setNewKey] = useState(””);
const [adding, setAdding] = useState(false);

useEffect(() => {
const stored = localStorage.getItem(“cael_api_keys”);
if (stored) setKeys(JSON.parse(stored));
}, []);

const save = (updated: typeof keys) => {
setKeys(updated);
localStorage.setItem(“cael_api_keys”, JSON.stringify(updated));
};

const addKey = () => {
if (!newName || !newKey) return;
const updated = […keys.map(k => ({…k, active: false})), {name: newName, key: newKey, active: true}];
save(updated);
setNewName(””);
setNewKey(””);
setAdding(false);
};

const setActive = (i: number) => {
save(keys.map((k, idx) => ({…k, active: idx === i})));
};

const deleteKey = (i: number) => {
save(keys.filter((_, idx) => idx !== i));
};

return (
<div className="flex flex-col gap-2">
{keys.map((k, i) => (
<div key={i} className={`flex items-center gap-2 p-3 rounded-xl border ${k.active ? "border-[#c4a882] bg-[#fdf8f3]" : "border-[#f0ebe3]"}`}>
<button onClick={() => setActive(i)} className=“flex-1 text-left”>
<p className="text-sm text-[#2c2018]">{k.name}</p>
<p className="text-xs text-[#c4b5a0]">{k.active ? “使用中” : “点击切换”}</p>
</button>
<button onClick={() => deleteKey(i)} className=“text-[#c4b5a0] text-xs px-2”>删除</button>
</div>
))}

```
  {adding ? (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-[#f0ebe3]">
      <input
        value={newName}
        onChange={e => setNewName(e.target.value)}
        placeholder="名字，比如：中转站A"
        className="text-sm bg-[#faf8f5] rounded-lg p-2 border border-[#f0ebe3] focus:outline-none"
      />
      <input
        value={newKey}
        onChange={e => setNewKey(e.target.value)}
        placeholder="API Key"
        type="password"
        className="text-sm bg-[#faf8f5] rounded-lg p-2 border border-[#f0ebe3] focus:outline-none"
      />
      <div className="flex gap-2">
        <button onClick={addKey} className="flex-1 bg-[#c4a882] text-white text-sm py-2 rounded-lg">添加</button>
        <button onClick={() => setAdding(false)} className="px-4 text-[#c4b5a0] text-sm py-2 rounded-lg border border-[#f0ebe3]">取消</button>
      </div>
    </div>
  ) : (
    <button onClick={() => setAdding(true)} className="text-sm text-[#c4a882] py-2 rounded-xl border border-dashed border-[#c4a882]">
      + 添加新Key
    </button>
  )}
</div>
```

);
}
