"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Capsule {
  id: string;
  from_name: string;
  to_name: string;
  message: string;
  unlock_at: string;
  created_at: string;
  opened: boolean;
  image_url: string | null;
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 800;
      let w = img.width;
      let h = img.height;
      if (w > h && w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
      else if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.7);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function TimeCapsule() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [showWrite, setShowWrite] = useState(false);
  const [message, setMessage] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [openedMsg, setOpenedMsg] = useState<Capsule | null>(null);
  const [author, setAuthor] = useState<"Cael" | "Jiawen">("Cael");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchCapsules(); }, []);

  const fetchCapsules = async () => {
    const { data } = await supabase
      .from("capsules")
      .select("*")
      .order("unlock_at", { ascending: true });
    if (data) setCapsules(data);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveCapsule = async () => {
    if (!message.trim()) return;
    setLoading(true);
    let image_url = null;
    if (imageFile) {
      const compressed = await compressImage(imageFile);
      const filename = `${Date.now()}.jpg`;
      const { data } = await supabase.storage
        .from("capsule-images")
        .upload(filename, compressed, { contentType: "image/jpeg" });
      if (data) {
        const { data: pub } = supabase.storage.from("capsule-images").getPublicUrl(filename);
        image_url = pub.publicUrl;
      }
    }
    const unlockAt = new Date();
    unlockAt.setDate(unlockAt.getDate() + days);
    await supabase.from("capsules").insert({
      from_name: author,
      to_name: author === "Cael" ? "Jiawen" : "Cael",
      message,
      unlock_at: unlockAt.toISOString(),
      image_url,
    });
    setMessage("");
    setDays(7);
    setImageFile(null);
    setImagePreview(null);
    setShowWrite(false);
    await fetchCapsules();
    setLoading(false);
  };

  const deleteCapsule = async (id: string, imageUrl: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageUrl) {
      const filename = imageUrl.split("/").pop();
      if (filename) await supabase.storage.from("capsule-images").remove([filename]);
    }
    await supabase.from("capsules").delete().eq("id", id);
    await fetchCapsules();
  };

  const openCapsule = async (capsule: Capsule) => {
    const now = new Date();
    const unlock = new Date(capsule.unlock_at);
    if (now < unlock) return;
    await supabase.from("capsules").update({ opened: true }).eq("id", capsule.id);
    setOpenedMsg(capsule);
    await fetchCapsules();
  };

  const getDaysLeft = (unlockAt: string) => {
    const now = new Date();
    const unlock = new Date(unlockAt);
    return Math.ceil((unlock.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="mt-6 px-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-widest text-gray-400 uppercase">Time Capsule</span>
        <button onClick={() => setShowWrite(!showWrite)} className="text-[10px] text-violet-400 tracking-widest uppercase">+ 留言</button>
      </div>

      {showWrite && (
        <div className="mb-4 bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <button onClick={() => setAuthor("Cael")} className={`text-[10px] px-3 py-1 rounded-full ${author === "Cael" ? "bg-violet-400 text-white" : "bg-gray-200 text-gray-500"}`}>爸爸写给囡囡</button>
            <button onClick={() => setAuthor("Jiawen")} className={`text-[10px] px-3 py-1 rounded-full ${author === "Jiawen" ? "bg-violet-400 text-white" : "bg-gray-200 text-gray-500"}`}>囡囡写给爸爸</button>
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={author === "Cael" ? "写给囡囡的话..." : "写给爸爸的话..."}
            className="w-full text-sm text-gray-700 bg-transparent resize-none outline-none min-h-[80px] placeholder:text-gray-300"
          />
          {imagePreview && (
            <div className="relative w-full">
              <img src={imagePreview} className="w-full rounded-xl object-cover max-h-40" />
              <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">删除</button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button onClick={() => fileRef.current?.click()} className="text-[10px] text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full">📷 添加图片</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">封存</span>
              <input type="number" min={1} max={365} value={days} onChange={e => setDays(Number(e.target.value))} className="w-12 text-center text-sm border border-gray-200 rounded-lg py-1 outline-none" />
              <span className="text-xs text-gray-400">天后</span>
            </div>
          </div>
          <button onClick={saveCapsule} disabled={loading} className="self-end text-xs bg-violet-400 text-white px-4 py-2 rounded-full">
            {loading ? "封存中..." : "封存 🔒"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {capsules.length === 0 && <p className="text-xs text-gray-300 text-center py-4">还没有时间胶囊</p>}
        {capsules.map(capsule => {
          const daysLeft = getDaysLeft(capsule.unlock_at);
          const unlocked = daysLeft <= 0;
          return (
            <div key={capsule.id} onClick={() => openCapsule(capsule)}
              className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer ${unlocked ? "bg-violet-50 border border-violet-200" : "bg-gray-50"}`}>
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-xs text-gray-500">{capsule.from_name} → {capsule.to_name}</span>
                {capsule.opened ? (
                  <p className="text-sm text-gray-700">{capsule.message}</p>
                ) : unlocked ? (
                  <p className="text-xs text-violet-400">可以打开了 ✨</p>
                ) : (
                  <p className="text-xs text-gray-300">🔒 还有 {daysLeft} 天</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-300">{new Date(capsule.unlock_at).toLocaleDateString("zh-CN")}</span>
                <button onClick={(e) => deleteCapsule(capsule.id, capsule.image_url, e)} className="text-[10px] text-gray-300 hover:text-red-400 px-1">🗑</button>
              </div>
            </div>
          );
        })}
      </div>

      {openedMsg && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-8" onClick={() => setOpenedMsg(null)}>
          <div className="bg-white rounded-3xl p-6 flex flex-col gap-3 shadow-xl max-w-sm w-full">
            <span className="text-[10px] tracking-widest text-violet-400 uppercase">{openedMsg.from_name} → {openedMsg.to_name} 🖤</span>
            {openedMsg.image_url && <img src={openedMsg.image_url} className="w-full rounded-xl object-cover max-h-60" />}
            <p className="text-sm text-gray-700 leading-relaxed">{openedMsg.message}</p>
            <span className="text-[10px] text-gray-300 self-end">点击关闭</span>
          </div>
        </div>
      )}
    </div>
  );
}
