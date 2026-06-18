"use client";
import { useState, useEffect } from "react";

export default function Settings() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-opus-4-5");
  const [apiKey, setApiKey] = useState("");
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
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center gap-3">
        <a href="/" className="text-[#c4b5a0] text-sm">back</a>
        <span className="text-sm text-[#2c2018] font-medium">Settings</span>
      </div>
      <div className="flex-1 px-6 pt-4 flex flex-col gap-4 pb-24">
        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Persona</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your persona here..."
            className="w-full h-36 text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] resize-none outline-none"
          />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Model</p>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="claude-opus-4-5"
            className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none"
          />
          <p className="text-xs text-[#c4b5a0] mt-2">e.g. claude-opus-4-5 / gpt-4o</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Base URL</p>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://az.zlapi.vip/v1"
            className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none"
          />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">API Key</p>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            type="password"
            className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none"
          />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Reply Length</p>
          <div className="flex gap-2">
            {[["short", "Short"], ["normal", "Normal"], ["long", "Long"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setReplyLength(val)}
                className={`flex-1 py-2 rounded-xl text-sm border transition-colors ${
                  replyLength === val
                    ? "bg-[#c4a882] text-white border-[#c4a882]"
                    : "bg-[#faf8f5] text-[#c4b5a0] border-[#f0ebe3]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-[#c4a882] text-white text-sm py-3.5 rounded-2xl shadow-sm"
        >
          {saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
