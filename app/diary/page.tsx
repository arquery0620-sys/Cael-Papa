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
        message: `这是我写的日记，请用温柔又有点腹黑的语气批注它：\n\n${diary.content}`,
        apiKey,
        baseUrl,
        model,
        systemPrompt: localStorage.getItem("cael_prompt") || "",
      }),
    });
    const data = await res.json();
    await supabase
      .from("diaries")
      .update({ ai_comment: data.reply, commented_at: new Date().toISOString() })
      .eq("id", diary.id);
    await fetchDiaries();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <span className="text-sm text-[#2c2018] font-medium">日记</span>
        <a href="/" className="text-[#c4b5a0] text-sm">back</a>
      </div>
      <div className="flex-1 px-6 pt-4 flex flex-col gap-4 pb-24">
        <div className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今天发生了什么..."
            className="w-full h-40 text-sm text-[#2c2018] bg-[#faf8f5] rounded-xl p-3 border border-[#f0ebe3] resize-none outline-none"
          />
          <button
            onClick={saveDiary}
            disabled={loading}
            className="mt-3 w-full bg-[#c4a882] text-white text-sm py-3 rounded-2xl"
          >
            保存
          </button>
        </div>
        {diaries.map((diary) => (
          <div key={diary.id} className="bg-white rounded-2xl p-5 border border-[#f0ebe3]">
            <p className="text-xs text-[#c4b5a0] mb-2">
              {new Date(diary.created_at).toLocaleDateString("zh-CN")}
            </p>
            <p className="text-sm text-[#2c2018] whitespace-pre-wrap">{diary.content}</p>
            {diary.ai_comment ? (
              <div className="mt-3 pt-3 border-t border-[#f0ebe3]">
                <p className="text-xs text-[#c4b5a0] mb-1">爸爸说</p>
                <p className="text-sm text-[#c4a882] whitespace-pre-wrap">{diary.ai_comment}</p>
              </div>
            ) : (
              <button
                onClick={() => getComment(diary)}
                className="mt-3 text-xs text-[#c4b5a0] border border-[#f0ebe3] px-3 py-1.5 rounded-xl"
              >
                让爸爸批注
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
