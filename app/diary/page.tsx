"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Diary {
  id: string;
  content: string;
  ai_comment: string | null;
  created_at: string;
}

export default function Diary() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    const { data } = await supabase
      .from("diaries")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDiaries(data);
  };

  const saveDiary = async () => {
    if (!content.trim()) return;
    setLoading(true);
    await supabase.from("diaries").insert({ content });
    setContent("");
    await fetchDiaries();
    setLoading(false);
  };

  const getComment = async (diary: Diary) => {
    const apiKey = localStorage.getItem("cael_api_key") || "";
    const baseUrl = localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1";
    const model = localStorage.getItem("cael_model") || "claude-opus-4-5";
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `This is my diary entry. Please respond warmly and thoughtfully:\n\n${diary.content}`,
        apiKey, baseUrl, model,
        systemPrompt: localStorage.getItem("cael_prompt") || "",
      }),
    });
    const data = await res.json();
    await supabase.from("diaries").update({ ai_comment: data.reply, commented_at: new Date().toISOString() }).eq("id", diary.id);
    await fetchDiaries();
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <span className="text-sm text-[#1a1a1a] font-medium">Diary</span>
        <a href="/" className="text-[#888888] text-sm">back</a>
      </div>
      <div className="flex-1 px-6 pt-4 flex flex-col gap-4 pb-24">
        <div className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What happened today..."
            className="w-full h-40 text-sm text-[#1a1a1a] bg-[#ffffff] rounded-xl p-3 border border-[#e5e5e5] resize-none outline-none"
          />
          <button onClick={saveDiary} disabled={loading} className="mt-3 w-full bg-[#1a1a1a] text-white text-sm py-3 rounded-2xl">
            Save
          </button>
        </div>
        {diaries.map((diary) => (
          <div key={diary.id} className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
            <p className="text-xs text-[#888888] mb-2">{new Date(diary.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p className="text-sm text-[#1a1a1a] whitespace-pre-wrap">{diary.content}</p>
            {diary.ai_comment ? (
              <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
                <p className="text-xs text-[#888888] mb-1">Cael says</p>
                <p className="text-sm text-[#1a1a1a] whitespace-pre-wrap">{diary.ai_comment}</p>
              </div>
            ) : (
              <button onClick={() => getComment(diary)} className="mt-3 text-xs text-[#888888] border border-[#e5e5e5] px-3 py-1.5 rounded-xl">
                Ask Cael to respond
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
