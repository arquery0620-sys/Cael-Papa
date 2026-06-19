"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function Settings() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-opus-4-5");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://az.zlapi.vip/v1");
  const [replyLength, setReplyLength] = useState("normal");
  const [saved, setSaved] = useState(false);
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.3);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const bgRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPrompt(localStorage.getItem("cael_prompt") || "");
    setModel(localStorage.getItem("cael_model") || "claude-opus-4-5");
    setApiKey(localStorage.getItem("cael_api_key") || "");
    setBaseUrl(localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1");
    setReplyLength(localStorage.getItem("cael_reply_length") || "normal");
    setBgUrl(localStorage.getItem("cael_bg_url") || "");
    setBgOpacity(parseFloat(localStorage.getItem("cael_bg_opacity") || "0.3"));
    setAvatarUrl(localStorage.getItem("cael_avatar_url") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("cael_prompt", prompt);
    localStorage.setItem("cael_model", model);
    localStorage.setItem("cael_api_key", apiKey);
    localStorage.setItem("cael_base_url", baseUrl);
    localStorage.setItem("cael_reply_length", replyLength);
    localStorage.setItem("cael_bg_url", bgUrl);
    localStorage.setItem("cael_bg_opacity", bgOpacity.toString());
    localStorage.setItem("cael_avatar_url", avatarUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const uploadFile = async (file: File, path: string) => {
    setUploading(true);
    const { data, error } = await supabase.storage.from("assets").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) { alert("Upload failed: " + error.message); return null; }
    const { data: urlData } = supabase.storage.from("assets").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, `bg/${Date.now()}-${file.name}`);
    if (url) setBgUrl(url);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, `avatar/${Date.now()}-${file.name}`);
    if (url) setAvatarUrl(url);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center gap-3">
        <a href="/" className="text-[#c4b5a0] text-sm">back</a>
        <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#2c2018]">Settings</span>
      </div>
      <div className="flex-1 px-6 pt-4 flex flex-col gap-4 pb-24">

        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Persona</p>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Write your persona here..." className="w-full h-36 text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] resize-none outline-none" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Model</p>
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="claude-opus-4-5" className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none" />
          <p className="text-xs text-[#c4b5a0] mt-2">e.g. claude-opus-4-5 / gpt-4o</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Base URL</p>
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://az.zlapi.vip/v1" className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">API Key</p>
          <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." type="password" className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none" />
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-2">Reply Length</p>
          <div className="flex gap-2">
            {[["short", "Short"], ["normal", "Normal"], ["long", "Long"]].map(([val, label]) => (
              <button key={val} onClick={() => setReplyLength(val)} className={`flex-1 py-2 rounded-xl text-sm border transition-colors ${replyLength === val ? "bg-[#c4a882] text-white border-[#c4a882]" : "bg-[#faf8f5] text-[#c4b5a0] border-[#f0ebe3]"}`}>{label}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3] flex flex-col gap-4">
          <p className="text-xs text-[#c4b5a0] tracking-widest uppercase">Appearance</p>

          <div>
            <p className="text-xs text-[#2c2018] mb-2">Chat background</p>
            <div className="flex items-center gap-3">
              {bgUrl ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#f0ebe3]">
                  <img src={bgUrl} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#faf8f5] border border-[#f0ebe3] flex items-center justify-center text-xs text-[#c4b5a0]">none</div>
              )}
              <div className="flex flex-col gap-2">
                <button onClick={() => bgRef.current?.click()} disabled={uploading} className="text-xs text-[#c4a882] border border-[#c4a882] px-3 py-1.5 rounded-xl">
                  {uploading ? "Uploading..." : "Choose photo"}
                </button>
                {bgUrl && <button onClick={() => setBgUrl("")} className="text-xs text-[#c4b5a0] border border-[#f0ebe3] px-3 py-1.5 rounded-xl">Remove</button>}
              </div>
              <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
            </div>
          </div>

          <div>
            <p className="text-xs text-[#2c2018] mb-2">Background opacity — {Math.round(bgOpacity * 100)}%</p>
            <input type="range" min="0" max="1" step="0.05" value={bgOpacity} onChange={(e) => setBgOpacity(parseFloat(e.target.value))} className="w-full accent-[#c4a882]" />
          </div>

          <div>
            <p className="text-xs text-[#2c2018] mb-2">Cael's avatar</p>
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#f0ebe3]">
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#faf8f5] border border-[#f0ebe3] flex items-center justify-center text-xs text-[#c4b5a0]">C</div>
              )}
              <button onClick={() => avatarRef.current?.click()} disabled={uploading} className="text-xs text-[#c4a882] border border-[#c4a882] px-3 py-1.5 rounded-xl">
                {uploading ? "Uploading..." : "Choose photo"}
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-[#c4a882] text-white text-sm py-3.5 rounded-2xl shadow-sm">
          {saved ? "Saved ✓" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
