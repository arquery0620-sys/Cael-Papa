"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import TimeCapsule from "@/components/TimeCapsule";

interface Diary {
  id: string;
  content: string;
  ai_comment: string | null;
  created_at: string;
  image_url: string | null;
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 800;
      let w = img.width, h = img.height;
      if (w > h && w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
      else if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.7);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function Diary() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchDiaries(); }, []);

  const fetchDiaries = async () => {
    const { data } = await supabase
      .from("diaries")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDiaries(data);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveDiary = async () => {
    if (!content.trim()) return;
    setLoading(true);
    let image_url = null;
    if (imageFile) {
      const compressed = await compressImage(imageFile);
      const filename = `diary-${Date.now()}.jpg`;
      const { data } = await supabase.storage
        .from("capsule-images")
        .upload(filename, compressed, { contentType: "image/jpeg" });
      if (data) {
        const { data: pub } = supabase.storage.from("capsule-images").getPublicUrl(filename);
        image_url = pub.publicUrl;
      }
    }
    await supabase.from("diaries").insert({ content, image_url });
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    await fetchDiaries();
    setLoading(false);
  };

  const deleteDiary = async (diary: Diary) => {
    if (diary.image_url) {
      const filename = diary.image_url.split("/").pop();
      if (filename) await supabase.storage.from("capsule-images").remove([filename]);
    }
    await supabase.from("diaries").delete().eq("id", diary.id);
    await fetchDiaries();
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
    await supabase.from("diaries").update({ ai_comment: data.reply }).eq("id", diary.id);
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
          {imagePreview && (
            <div className="relative mt-2">
              <img src={imagePreview} className="w-full rounded-xl object-cover max-h-40" />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">删除</button>
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <button onClick={() => fileRef.current?.click()} className="text-[10px] text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full">📷 图片</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <button onClick={saveDiary} disabled={loading} className="bg-[#1a1a1a] text-white text-sm px-6 py-2 rounded-2xl">
              {loading ? "保存中..." : "Save"}
            </button>
          </div>
        </div>
        {diaries.map((diary) => (
          <div key={diary.id} className="bg-white rounded-2xl p-5 border border-[#e5e5e5]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#888888]">{new Date(diary.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              <button onClick={() => deleteDiary(diary)} className="text-[10px] text-gray-300 hover:text-red-400">🗑</button>
            </div>
            {diary.image_url && <img src={diary.image_url} className="w-full rounded-xl object-cover max-h-48 mb-2" />}
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
        <TimeCapsule />
      </div>
    </div>
  );
}
