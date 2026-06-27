"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Album {
  id: string;
  name: string;
  created_at: string;
}

interface Photo {
  id: string;
  album_id: string;
  image_url: string;
  note: string | null;
  created_at: string;
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 1200;
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

export default function AlbumPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    const { data } = await supabase.from("albums").select("*").order("created_at");
    if (data) setAlbums(data);
  };

  const fetchPhotos = async (albumId: string) => {
    const { data } = await supabase.from("album_photos").select("*").eq("album_id", albumId).order("created_at", { ascending: false });
    if (data) setPhotos(data);
  };

  const createAlbum = async () => {
    if (!newAlbumName.trim()) return;
    await supabase.from("albums").insert({ name: newAlbumName });
    setNewAlbumName("");
    setShowNewAlbum(false);
    await fetchAlbums();
  };

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentAlbum) return;
    setUploading(true);
    const compressed = await compressImage(file);
    const filename = `album/${currentAlbum.id}/${Date.now()}.jpg`;
    const { data } = await supabase.storage.from("assets").upload(filename, compressed, { contentType: "image/jpeg" });
    if (data) {
      const { data: pub } = supabase.storage.from("assets").getPublicUrl(filename);
      await supabase.from("album_photos").insert({ album_id: currentAlbum.id, image_url: pub.publicUrl, note: note || null });
      setNote("");
      await fetchPhotos(currentAlbum.id);
    }
    setUploading(false);
  };

  const deletePhoto = async (photo: Photo) => {
    const filename = photo.image_url.split("/assets/")[1];
    if (filename) await supabase.storage.from("assets").remove([filename]);
    await supabase.from("album_photos").delete().eq("id", photo.id);
    await fetchPhotos(currentAlbum!.id);
    setViewPhoto(null);
  };

  if (currentAlbum) return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 pt-14 pb-3 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => { setCurrentAlbum(null); setPhotos([]); }} className="text-gray-400 text-sm">← 返回</button>
        <span className="font-[family-name:var(--font-cormorant)] text-lg italic text-gray-800">{currentAlbum.name}</span>
        <button onClick={() => fileRef.current?.click()} className="text-[10px] text-violet-400">+ 添加</button>
      </div>
      <div className="px-4 py-3">
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="备注（可选）..." className="w-full text-xs text-gray-500 outline-none border-b border-gray-100 pb-2 mb-3" />
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
      {uploading && <p className="text-xs text-center text-gray-400 py-2">上传中...</p>}
      <div className="grid grid-cols-3 gap-[2px] px-1">
        {photos.map(photo => (
          <div key={photo.id} onClick={() => setViewPhoto(photo)} className="aspect-square overflow-hidden cursor-pointer">
            <img src={photo.image_url} className="w-full h-full object-cover" />
          </div>
        ))}
        {photos.length === 0 && <p className="col-span-3 text-xs text-gray-300 text-center py-12">还没有照片</p>}
      </div>

      {viewPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col" onClick={() => setViewPhoto(null)}>
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={viewPhoto.image_url} className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
          {viewPhoto.note && <p className="text-center text-white text-sm pb-4 px-8">{viewPhoto.note}</p>}
          <div className="flex justify-center pb-8 gap-6" onClick={e => e.stopPropagation()}>
            <button onClick={() => deletePhoto(viewPhoto)} className="text-xs text-red-400 border border-red-400 px-4 py-2 rounded-full">删除</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 pt-14 pb-3 flex items-center justify-between border-b border-gray-100">
        <a href="/" className="text-gray-400 text-sm">← 返回</a>
        <span className="font-[family-name:var(--font-cormorant)] text-lg italic text-gray-800">收藏盒</span>
        <button onClick={() => setShowNewAlbum(true)} className="text-[10px] text-violet-400">+ 相册</button>
      </div>

      {showNewAlbum && (
        <div className="px-6 py-4 border-b border-gray-100 flex gap-2">
          <input value={newAlbumName} onChange={e => setNewAlbumName(e.target.value)} placeholder="相册名字..." className="flex-1 text-sm outline-none border-b border-gray-200 pb-1" />
          <button onClick={createAlbum} className="text-xs text-violet-400">创建</button>
        </div>
      )}

      <div className="flex-1 px-6 py-4 flex flex-col gap-3">
        {albums.length === 0 && <p className="text-xs text-gray-300 text-center py-12">还没有相册，创建一个吧</p>}
        {albums.map(album => (
          <div key={album.id} onClick={() => { setCurrentAlbum(album); fetchPhotos(album.id); }} className="flex items-center justify-between py-3 border-b border-gray-50 cursor-pointer">
            <span className="text-sm text-gray-700">{album.name}</span>
            <span className="text-gray-300 text-xs">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
