"use client";
import { useState, useEffect } from "react";

export default function Settings() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-opus-4-5");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [baseUrl, setBaseUrl] = useState("https://az.zlapi.vip/v1");
  const [replyLength, setReplyLength] = useState("normal");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrompt(localStorage.getItem("cael_prompt") || "");
    setModel(localStorage.getItem("cael_model") || "claude-opus-4-5");
    setApiKey(localStorage.getItem("cael_api_key") || "");
    setBaseUrl(localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1");
    setReplyLength(localStorage.getItem("cael_reply_length") || "normal");
  }, []);

  const handleSave = () => {
    localStorage.setItem("cael_prompt", prompt);
    localStorage.setItem("cael_model", model);
    localStorage.setItem("cael_api_key", apiKey);
    localStorage.setItem("cael_base_url", baseUrl);
    localStorage.setItem("cael_reply_length", replyLength);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center gap-3">
        <a href="/more" className="text-[#888888] text-sm">back</a>
        <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#1a1a1a]">Settings</span>
      </div>
      <div className="flex-1 px-6 pt-4 flex flex-col gap-4 pb-24">
        <div className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-2">Persona</p>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Write your persona here..." className="w-full h-36 text-sm text-[#1a1a1a] bg-[#ffffff] rounded-xl p-3 border border-[#e5e5e5] resize-none outline-none" />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-2">Model</p>
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="claude-opus-4-5" className="w-full text-sm text-[#1a1a1a] bg-[#ffffff] rounded-xl p-3 border border-[#e5e5e5] outline-none" />
          <p className="text-xs text-[#888888] mt-2">e.g. claude-opus-4-5 / gpt-4o</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-2">Base URL</p>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://az.zlapi.vip/v1" className="w-full text-sm text-[#1a1a1a] bg-[#ffffff] rounded-xl p-3 border border-[#e5e5e5] outline-none" />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-2">API Key</p>
          <div className="relative">
          <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." type={showKey ? "text" : "password"} className="w-full text-sm text-[#1a1a1a] bg-[#ffffff] rounded-xl p-3 border border-[#e5e5e5] outline-none" />
          <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-3 text-xs text-gray-400">{showKey ? "隐藏" : "显示"}</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-2">Reply Length</p>
          <div className="flex gap-2">
            {[["short", "Short"], ["normal", "Normal"], ["long", "Long"]].map(([val, label]) => (
              <button key={val} onClick={() => setReplyLength(val)} className={`flex-1 py-2 rounded-xl text-sm border transition-colors ${replyLength === val ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-[#ffffff] text-[#888888] border-[#e5e5e5]"}`}>{label}</button>
            ))}
          </div>
        </div>
        <button onClick={handleSave} className="w-full bg-[#1a1a1a] text-white text-sm py-3.5 rounded-2xl shadow-sm">
          {saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
