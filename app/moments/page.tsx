"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Moment {
  id: string;
  author: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
  comments?: Comment[];
}

interface Comment {
  id: string;
  moment_id: string;
  author: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 1000;
      let w = img.width, h = img.height;
      if (w > h && w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
      else if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function MomentsPage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [showPost, setShowPost] = useState(false);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState<"Jiawen" | "Cael">("Jiawen");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentImages, setCommentImages] = useState<Record<string, File>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const commentFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { fetchMoments(); }, []);

  const fetchMoments = async () => {
    const { data: ms } = await supabase.from("moments").select("*").order("created_at", { ascending: false });
    if (!ms) return;
    const withComments = await Promise.all(ms.map(async (m) => {
      const { data: cs } = await supabase.from("moment_comments").select("*").eq("moment_id", m.id).order("created_at");
      return { ...m, comments: cs || [] };
    }));
    setMoments(withComments);
  };

  const uploadImage = async (file: File, path: string) => {
    const compressed = await compressImage(file);
    const { data } = await supabase.storage.from("assets").upload(path, compressed, { contentType: "image/jpeg", upsert: true });
    if (!data) return null;
    const { data: pub } = supabase.storage.from("assets").getPublicUrl(path);
    return pub.publicUrl;
  };

  const postMoment = async () => {
    if (!content.trim() && !imageFile) return;
    setUploading(true);
    let image_url = null;
    if (imageFile) image_url = await uploadImage(imageFile, `moments/${Date.now()}.jpg`);
    await supabase.from("moments").insert({ author, content: content || null, image_url });
    setContent(""); setImageFile(null); setImagePreview(null); setShowPost(false);
    await fetchMoments();
    setUploading(false);
  };

  const postComment = async (momentId: string) => {
    const text = commentInputs[momentId] || "";
    const imgFile = commentImages[momentId];
    if (!text.trim() && !imgFile) return;
    let image_url = null;
    if (imgFile) image_url = await uploadImage(imgFile, `moment-comments/${Date.now()}.jpg`);
    await supabase.from("moment_comments").insert({ moment_id: momentId, author, content: text || null, image_url });
    setCommentInputs(prev => ({ ...prev, [momentId]: "" }));
    setCommentImages(prev => { const n = { ...prev }; delete n[momentId]; return n; });
    await fetchMoments();
  };

  const deleteMoment = async (id: string) => {
    await supabase.from("moments").delete().eq("id", id);
    await fetchMoments();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <div className="px-6 pt-14 pb-3 flex items-center justify-between bg-white border-b border-gray-100 sticky top-0 z-10">
        <a href="/" className="text-gray-400 text-sm">← 返回</a>
        <span className="font-[family-name:var(--font-cormorant)] text-lg italic text-gray-800">朋友圈</span>
        <button onClick={() => setShowPost(!showPost)} className="text-[10px] text-violet-400">+ 发布</button>
      </div>

      {showPost && (
        <div className="bg-white mx-4 mt-4 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <button onClick={() => setAuthor("Jiawen")} className={`text-[10px] px-3 py-1 rounded-full ${author === "Jiawen" ? "bg-violet-400 text-white" : "bg-gray-100 text-gray-500"}`}>囡囡</button>
            <button onClick={() => setAuthor("Cael")} className={`text-[10px] px-3 py-1 rounded-full ${author === "Cael" ? "bg-violet-400 text-white" : "bg-gray-100 text-gray-500"}`}>爸爸</button>
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="想说什么..." className="text-sm text-gray-700 outline-none resize-none min-h-[80px]" />
          {imagePreview && (
            <div className="relative">
              <img src={imagePreview} className="w-full rounded-xl max-h-48 object-cover" />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">删除</button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button onClick={() => fileRef.current?.click()} className="text-[10px] text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full">📷 图片</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
            <button onClick={postMoment} disabled={uploading} className="text-xs bg-violet-400 text-white px-4 py-2 rounded-full">{uploading ? "发布中..." : "发布"}</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 px-4 py-4">
        {moments.map(moment => (
          <div key={moment.id} className="bg-white rounded-2xl overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${moment.author === "Cael" ? "bg-[#1a1a1a] text-white" : "bg-violet-100 text-violet-600"}`}>
                    {moment.author === "Cael" ? "C" : "J"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{moment.author === "Cael" ? "Cael" : "嘉雯"}</p>
                    <p className="text-[9px] text-gray-400">{new Date(moment.created_at).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <button onClick={() => deleteMoment(moment.id)} className="text-[10px] text-gray-300">🗑</button>
              </div>
              {moment.content && <p className="text-sm text-gray-700 mb-2 leading-relaxed">{moment.content}</p>}
              {moment.image_url && <img src={moment.image_url} className="w-full rounded-xl object-cover max-h-64 mb-2" />}
            </div>

            {/* 评论区 */}
            {(moment.comments?.length ?? 0) > 0 && (
              <div className="bg-gray-50 px-4 py-2 flex flex-col gap-2">
                {moment.comments?.map(c => (
                  <div key={c.id} className="flex gap-2">
                    <span className={`text-xs font-medium ${c.author === "Cael" ? "text-gray-800" : "text-violet-600"}`}>{c.author === "Cael" ? "Cael" : "嘉雯"}：</span>
                    <div className="flex-1">
                      {c.content && <span className="text-xs text-gray-600">{c.content}</span>}
                      {c.image_url && <img src={c.image_url} className="mt-1 rounded-lg max-h-24 object-cover" />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 评论输入 */}
            <div className="px-4 py-2 border-t border-gray-50 flex gap-2 items-center">
              <input
                value={commentInputs[moment.id] || ""}
                onChange={e => setCommentInputs(prev => ({ ...prev, [moment.id]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && postComment(moment.id)}
                placeholder="评论..."
                className="flex-1 text-xs text-gray-600 outline-none bg-gray-50 rounded-full px-3 py-1.5"
              />
              <button onClick={() => commentFileRefs.current[moment.id]?.click()} className="text-[10px] text-gray-400">📷</button>
              <input
                ref={el => { commentFileRefs.current[moment.id] = el; }}
                type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setCommentImages(prev => ({ ...prev, [moment.id]: f })); }}
              />
              <button onClick={() => postComment(moment.id)} className="text-[10px] text-violet-400">发送</button>
            </div>
          </div>
        ))}
        {moments.length === 0 && <p className="text-xs text-gray-300 text-center py-12">还没有动态</p>}
      </div>
    </div>
  );
}
