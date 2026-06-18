"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Character {
  id: string;
  name: string;
  system_prompt: string;
  model: string;
  base_url: string;
  api_key: string;
}

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-opus-4-5");
  const [baseUrl, setBaseUrl] = useState("https://az.zlapi.vip/v1");
  const [apiKey, setApiKey] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    const { data } = await supabase.from("characters").select("*").order("created_at");
    if (data) setCharacters(data);
  };

  const addCharacter = async () => {
    if (!name.trim()) return;
    await supabase.from("characters").insert({ name, system_prompt: prompt, model, base_url: baseUrl, api_key: apiKey });
    setName(""); setPrompt(""); setApiKey("");
    setAdding(false);
    await fetchCharacters();
  };

  const selectCharacter = (c: Character) => {
    localStorage.setItem("cael_character_id", c.id);
    localStorage.setItem("cael_prompt", c.system_prompt);
    localStorage.setItem("cael_model", c.model);
    localStorage.setItem("cael_base_url", c.base_url);
    localStorage.setItem("cael_api_key", c.api_key);
    window.location.href = "/chat";
  };

  const deleteCharacter = async (id: string) => {
    await supabase.from("characters").delete().eq("id", id);
    await fetchCharacters();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <span className="text-sm text-[#2c2018] font-medium">角色</span>
        <a href="/" className="text-[#c4b5a0] text-sm">back</a>
      </div>
      <div className="flex-1 px-6 pt-4 flex flex-col gap-3 pb-24">
        {characters.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-5 border border-[#f0ebe3] flex items-center justify-between">
            <button onClick={() => selectCharacter(c)} className="text-sm text-[#2c2018] font-medium">{c.name}</button>
            <button onClick={() => deleteCharacter(c.id)} className="text-xs text-[#c4b5a0]">删除</button>
          </div>
        ))}
        {adding ? (
          <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3] flex flex-col gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="角色名字" className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none" />
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="人设..." className="w-full h-24 text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] resize-none outline-none" />
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="claude-opus-4-5" className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none" />
            <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://az.zlapi.vip/v1" className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none" />
            <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." type="password" className="w-full text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] outline-none" />
            <div className="flex gap-2">
              <button onClick={addCharacter} className="flex-1 bg-[#c4a882] text-white text-sm py-3 rounded-2xl">保存</button>
              <button onClick={() => setAdding(false)} className="flex-1 bg-[#faf8f5] text-[#c4b5a0] text-sm py-3 rounded-2xl border border-[#f0ebe3]">取消</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="w-full bg-white text-[#c4a882] text-sm py-4 rounded-2xl border border-[#f0ebe3]">+ 新角色</button>
        )}
      </div>
    </div>
  );
}
