"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Tune() {
  const [navColor, setNavColor] = useState("#1a1a1a");
  const [myBubble, setMyBubble] = useState("#1a1a1a");
  const [caelBubble, setCaelBubble] = useState("#ffffff");
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.3);
  const [bgWhiteness, setBgWhiteness] = useState(100);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const bgRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNavColor(localStorage.getItem("cael_nav_color") || "#1a1a1a");
    setMyBubble(localStorage.getItem("cael_my_bubble") || "#1a1a1a");
    setCaelBubble(localStorage.getItem("cael_cael_bubble") || "#ffffff");
    setBgUrl(localStorage.getItem("cael_bg_url") || "");
    setBgOpacity(parseFloat(localStorage.getItem("cael_bg_opacity") || "0.3"));
    setBgWhiteness(parseInt(localStorage.getItem("cael_bg_whiteness") || "100"));
    setAvatarUrl(localStorage.getItem("cael_avatar_url") || "");
  }, []);

  const handleSave = () => {
    localStorage.setItem("cael_nav_color", navColor);
    localStorage.setItem("cael_my_bubble", myBubble);
    localStorage.setItem("cael_cael_bubble", caelBubble);
    localStorage.setItem("cael_bg_url", bgUrl);
    localStorage.setItem("cael_bg_opacity", bgOpacity.toString());
    localStorage.setItem("cael_bg_whiteness", bgWhiteness.toString());
    localStorage.setItem("cael_avatar_url", avatarUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const uploadFile = async (file: File, path: string) => {
    setUploading(true);
    const { error } = await supabase.storage.from("assets").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) { alert("Upload failed: " + error.message); return null; }
    const { data } = supabase.storage.from("assets").getPublicUrl(path);
    return data.publicUrl;
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

  const ColorRow = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#e5e5e5] last:border-0">
      <span className="text-sm text-[#1a1a1a]">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl border border-[#e5e5e5]" style={{ backgroundColor: value }} />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded-xl opacity-0 absolute cursor-pointer" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-20 text-xs text-[#1a1a1a] bg-[#ffffff] rounded-lg px-2 py-1.5 border border-[#e5e5e5] outline-none" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col" style={{ backgroundColor: `rgb(${bgWhiteness},${bgWhiteness},${bgWhiteness - 5})` }}>
      {bgUrl && (
        <div className="fixed inset-0 -z-10" style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: "cover", backgroundPosition: "center", opacity: bgOpacity }} />
      )}

      <div className="px-6 pt-14 pb-2 flex items-center gap-3">
        <Link href="/more" className="text-[#888888] text-sm">back</Link>
        <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#1a1a1a]">Tune</span>
      </div>

      <div className="flex-1 px-6 pt-4 flex flex-col gap-4 pb-24">

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-3">Colors</p>
          <ColorRow label="Nav & accent" value={navColor} onChange={setNavColor} />
          <ColorRow label="My bubble" value={myBubble} onChange={setMyBubble} />
          <ColorRow label="Cael's bubble" value={caelBubble} onChange={setCaelBubble} />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#e5e5e5] flex flex-col gap-4">
          <p className="text-xs text-[#888888] tracking-widest uppercase">Background</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1a1a1a]">Chat background</p>
              <p className="text-xs text-[#888888] mt-0.5">photo from your album</p>
            </div>
            <div className="flex items-center gap-2">
              {bgUrl && (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#e5e5e5]">
                  <img src={bgUrl} className="w-full h-full object-cover" />
                </div>
              )}
              <button onClick={() => bgRef.current?.click()} disabled={uploading} className="text-xs text-[#1a1a1a] border border-[#1a1a1a] px-3 py-1.5 rounded-xl">
                {uploading ? "..." : bgUrl ? "Change" : "Upload"}
              </button>
              {bgUrl && <button onClick={() => setBgUrl("")} className="text-xs text-[#888888]">✕</button>}
            </div>
            <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-[#1a1a1a]">Opacity</p>
              <p className="text-xs text-[#888888]">{Math.round(bgOpacity * 100)}%</p>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={bgOpacity} onChange={(e) => setBgOpacity(parseFloat(e.target.value))} className="w-full accent-[#1a1a1a]" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-[#1a1a1a]">Background whiteness</p>
              <p className="text-xs text-[#888888]">{bgWhiteness}</p>
            </div>
            <input type="range" min="220" max="255" step="1" value={bgWhiteness} onChange={(e) => setBgWhiteness(parseInt(e.target.value))} className="w-full accent-[#1a1a1a]" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-3">Cael's Avatar</p>
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <div className="w-14 h-14 rounded-full overflow-hidden border border-[#e5e5e5]">
                <img src={avatarUrl} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#ffffff] border border-[#e5e5e5] flex items-center justify-center font-[family-name:var(--font-cormorant)] text-xl italic text-[#888888]">C</div>
            )}
            <div className="flex flex-col gap-2">
              <button onClick={() => avatarRef.current?.click()} disabled={uploading} className="text-xs text-[#1a1a1a] border border-[#1a1a1a] px-3 py-1.5 rounded-xl">
                {uploading ? "Uploading..." : "Choose photo"}
              </button>
              <p className="text-xs text-[#888888]">auto syncs to chat</p>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#e5e5e5]">
          <p className="text-xs text-[#888888] tracking-widest uppercase mb-3">Preview</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-end">
              <div className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm text-white" style={{ backgroundColor: myBubble }}>
                Hello Cael ✓✓
              </div>
            </div>
            <div className="flex items-end gap-2">
              {avatarUrl ? (
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <img src={avatarUrl} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#ffffff] border border-[#e5e5e5] flex items-center justify-center text-[10px] text-[#888888]">C</div>
              )}
              <div className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm text-[#1a1a1a] border border-[#e5e5e5]" style={{ backgroundColor: caelBubble }}>
                Hi, I'm here.
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="w-full text-white text-sm py-3.5 rounded-2xl shadow-sm" style={{ backgroundColor: navColor }}>
          {saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}
