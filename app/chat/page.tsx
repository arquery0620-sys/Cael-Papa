"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  PlusIcon, XMarkIcon, MagnifyingGlassIcon,
  ArrowLeftIcon, SparklesIcon, ChevronDownIcon,
  ChevronRightIcon, ArrowPathIcon, PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  summary?: string;
}

function formatTime(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (isToday) return time;
  return `${d.getMonth()+1}/${d.getDate()} ${time}`;
}

function formatDateDivider(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "今天";
  if (d.toDateString() === yesterday.toDateString()) return "昨天";
  return d.toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
}

const menuItems = [
  { href: "/diary", ja: "日記", zh: "日记" },
  { href: "/board", ja: "伝言板", zh: "留言板" },
  { href: "/usage", ja: "使用量", zh: "用量" },
  { href: "/tune", ja: "カスタマイズ", zh: "美化" },
  { href: "/settings", ja: "設定", zh: "设置" },
];

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filtered, setFiltered] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [currentConv, setCurrentConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [openChats, setOpenChats] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [myBubble, setMyBubble] = useState("#1a1a1a");
  const [caelBubble, setCaelBubble] = useState("#ffffff");
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.3);
  const [bgWhiteness, setBgWhiteness] = useState(250);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userAvatarUrl, setUserAvatarUrl] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const dateStr = today.toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" });

  useEffect(() => {
    setApiKey(localStorage.getItem("cael_api_key") || "");
    setBaseUrl(localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1");
    setModel(localStorage.getItem("cael_model") || "claude-opus-4-5");
    setSystemPrompt(localStorage.getItem("cael_prompt") || "");
    setMyBubble(localStorage.getItem("cael_my_bubble") || "#1a1a1a");
    setCaelBubble(localStorage.getItem("cael_cael_bubble") || "#ffffff");
    setBgUrl(localStorage.getItem("cael_bg_url") || "");
    setBgOpacity(parseFloat(localStorage.getItem("cael_bg_opacity") || "0.3"));
    setBgWhiteness(parseInt(localStorage.getItem("cael_bg_whiteness") || "250"));
    setAvatarUrl(localStorage.getItem("cael_avatar_url") || "");
    setUserAvatarUrl(localStorage.getItem("cael_user_avatar_url") || "");
    fetchConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (search.trim()) {
      setFiltered(conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFiltered(conversations);
    }
  }, [search, conversations]);

  const fetchConversations = async () => {
    const { data } = await supabase.from("conversations").select("*").order("created_at", { ascending: false });
    if (data) { setConversations(data); setFiltered(data); }
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at").limit(150);
    if (data) setMessages(data);
  };

  const newConversation = async () => {
    const { data } = await supabase.from("conversations").insert({ title: "新対話" }).select().single();
    if (data) { setCurrentConvId(data.id); setCurrentConv(data); setMessages([]); await fetchConversations(); setShowSidebar(false); }
  };

  const selectConversation = async (conv: Conversation) => {
    setCurrentConvId(conv.id); setCurrentConv(conv); await fetchMessages(conv.id); setShowSidebar(false);
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    if (currentConvId === id) { setCurrentConvId(null); setCurrentConv(null); setMessages([]); }
    await fetchConversations();
  };

  const uploadAndSetImage = async (file: File) => {
    setUploadingImage(true);
    setShowAddMenu(false);
    const path = `chat/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("assets").upload(path, file, { upsert: true });
    if (error) { alert("Upload failed"); setUploadingImage(false); return; }
    const { data } = supabase.storage.from("assets").getPublicUrl(path);
    setPendingImage(data.publicUrl);
    setUploadingImage(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadAndSetImage(file);
  };

  const callAI = async (userMessage: string, imgUrl?: string) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, apiKey, baseUrl, model, systemPrompt, imageUrl: imgUrl }),
    });
    return await res.json();
  };

  const regenerate = async (idx: number) => {
    const prevUserMsg = messages.slice(0, idx).reverse().find(m => m.role === "user");
    if (!prevUserMsg) return;
    setRegeneratingIdx(idx);
    const data = await callAI(prevUserMsg.content, prevUserMsg.imageUrl);
    const newMessages = [...messages];
    newMessages[idx] = { ...newMessages[idx], content: data.reply, imageUrl: data.stickerUrl || undefined };
    setMessages(newMessages);
    if (newMessages[idx].id) await supabase.from("messages").update({ content: data.reply }).eq("id", newMessages[idx].id);
    setRegeneratingIdx(null);
  };

  const saveEdit = async (idx: number) => {
    const newMessages = [...messages];
    newMessages[idx] = { ...newMessages[idx], content: editContent };
    setMessages(newMessages);
    if (newMessages[idx].id) await supabase.from("messages").update({ content: editContent }).eq("id", newMessages[idx].id);
    setEditingIdx(null);
    setEditContent("");
  };

  const summarizeConversation = async () => {
    if (!currentConvId || messages.length === 0) return;
    setSummarizing(true);
    const transcript = messages.map(m => `${m.role === "user" ? "嘉雯" : "Cael"}: ${m.content}`).join("\n");
    const data = await callAI(`请用3-5句话简洁地总结这段对话：\n\n${transcript}`);
    await supabase.from("conversations").update({ summary: data.reply }).eq("id", currentConvId);
    setCurrentConv(prev => prev ? { ...prev, summary: data.reply } : null);
    setSummarizing(false);
    setShowSummary(true);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !pendingImage) || loading) return;
    let convId = currentConvId;
    if (!convId) {
      const { data } = await supabase.from("conversations").insert({ title: input.slice(0, 20) || "画像" }).select().single();
      if (data) { convId = data.id; setCurrentConvId(data.id); setCurrentConv(data); await fetchConversations(); }
    }
    const userMsg: Message = { role: "user", content: input, created_at: new Date().toISOString(), imageUrl: pendingImage || undefined };
    setMessages((prev) => [...prev, userMsg]);
    const sentInput = input;
    const sentImage = pendingImage;
    setInput("");
    setPendingImage(null);
    setLoading(true);
    await supabase.from("messages").insert({ conversation_id: convId, role: "user", content: sentInput, imageUrl: sentImage });
    try {
      const data = await callAI(sentInput, sentImage || undefined);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, created_at: new Date().toISOString(), imageUrl: data.stickerUrl || undefined }]);
      await supabase.from("messages").insert({ conversation_id: convId, role: "assistant", content: data.reply, imageUrl: data.stickerUrl || null });
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "エラー", created_at: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const lastAssistantIndex = messages.map(m => m.role).lastIndexOf("assistant");

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: "#ffffff" }}>
      {bgUrl && <div className="fixed inset-0 -z-10" style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: "cover", backgroundPosition: "center", opacity: bgOpacity }} />}

      {showAddMenu && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowAddMenu(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-6 pb-10">
            <div className="flex justify-between items-center mb-6">
              <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-gray-800">添付 / 添加</span>
              <button onClick={() => setShowAddMenu(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "カメラ\nCamera", onClick: () => { setShowAddMenu(false); cameraRef.current?.click(); } },
                { label: "写真\nPhotos", onClick: () => { setShowAddMenu(false); photoRef.current?.click(); } },
                { label: "ファイル\nFiles", onClick: () => { setShowAddMenu(false); fileRef.current?.click(); } },
              ].map(({ label, onClick }) => (
                <button key={label} onClick={onClick} className="flex flex-col items-center gap-2 bg-gray-50 rounded-2xl p-4">
                  <span className="text-xs text-gray-700 text-center whitespace-pre-line">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="px-6 pt-14 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {userAvatarUrl ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={userAvatarUrl} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center font-[family-name:var(--font-cormorant)] text-xl italic text-gray-400">J</div>
                )}
                <div>
                  <p className="font-[family-name:var(--font-cormorant)] text-xl italic text-gray-900">Jiawen</p>
                  <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">チャット / 聊天</span>
                <div className="flex items-center gap-2">
                  <button onClick={newConversation} className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                    <PlusIcon className="w-3 h-3 text-gray-400" />
                  </button>
                  <button onClick={() => setOpenChats(!openChats)}>
                    {openChats ? <ChevronDownIcon className="w-3 h-3 text-gray-400" /> : <ChevronRightIcon className="w-3 h-3 text-gray-400" />}
                  </button>
                </div>
              </div>
              {openChats && (
                <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto">
                  {filtered.map((c) => (
                    <div key={c.id} className={`flex items-center justify-between px-2 py-1.5 rounded-lg ${currentConvId === c.id ? "bg-gray-100" : ""}`}>
                      <button onClick={() => selectConversation(c)} className="text-sm text-gray-700 text-left flex-1 truncate">{c.title}</button>
                      <button onClick={() => deleteConversation(c.id)}><XMarkIcon className="w-3 h-3 text-gray-300" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 px-6 py-4 flex flex-col">
              <Link href="/" onClick={() => setShowSidebar(false)} className="flex items-baseline gap-2 py-3 border-b border-gray-100">
                <span className="font-[family-name:var(--font-noto-jp)] text-sm font-light text-gray-900">ホーム</span>
                <span className="text-xs text-gray-400">首页</span>
              </Link>
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setShowSidebar(false)} className="flex items-baseline gap-2 py-3 border-b border-gray-100 last:border-0">
                  <span className="font-[family-name:var(--font-noto-jp)] text-sm font-light text-gray-900">{item.ja}</span>
                  <span className="text-xs text-gray-400">{item.zh}</span>
                </Link>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-3.5 h-3.5 text-gray-300" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="検索 / 搜索" className="flex-1 text-xs text-gray-600 bg-transparent outline-none" />
            </div>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setShowSidebar(false)} />
        </div>
      )}

      {showSummary && currentConv?.summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-3">まとめ / 摘要</p>
            <p className="text-sm text-gray-700 leading-relaxed">{currentConv.summary}</p>
            <button onClick={() => setShowSummary(false)} className="mt-4 w-full text-xs text-gray-400 border border-gray-200 py-2 rounded-xl">閉じる / 关闭</button>
          </div>
          <div className="absolute inset-0 bg-black/20 -z-10" onClick={() => setShowSummary(false)} />
        </div>
      )}

      {/* header */}
      <div className="px-5 pt-14 pb-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400"><ArrowLeftIcon className="w-5 h-5" /></Link>
          <button onClick={() => setShowSidebar(true)} className="text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
        <div className="flex flex-col items-center">
          {avatarUrl
            ? <div className="w-8 h-8 rounded-full overflow-hidden"><img src={avatarUrl} className="w-full h-full object-cover" /></div>
            : <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-[family-name:var(--font-cormorant)] italic">C</div>
          }
          <span className="font-[family-name:var(--font-cormorant)] text-sm italic text-gray-600 mt-0.5">Cael</span>
        </div>
        <div className="flex items-center gap-3">
          {currentConvId && messages.length > 0 && (
            <button onClick={summarizing ? undefined : (currentConv?.summary ? () => setShowSummary(true) : summarizeConversation)} className="text-gray-400">
              <SparklesIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 px-4 pt-4 pb-36 flex flex-col gap-1 overflow-y-auto">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isRead = isUser && i < lastAssistantIndex;
          const isRegenerating = regeneratingIdx === i;
          const isEditing = editingIdx === i;
          const prevMsg = messages[i - 1];
          const showDivider = !prevMsg || formatDateDivider(msg.created_at) !== formatDateDivider(prevMsg.created_at);

          return (
            <div key={i}>
              {showDivider && (
                <div className="flex justify-center my-3">
                  <span className="text-[10px] text-gray-400">{formatDateDivider(msg.created_at)} · {formatTime(msg.created_at)}</span>
                </div>              )}
              <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-1`}>
                <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                  {/* avatar */}
                  {!isUser && (
                    avatarUrl
                      ? <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1"><img src={avatarUrl} className="w-full h-full object-cover" /></div>
                      : <div className="w-8 h-8 rounded-full flex-shrink-0 mb-1 flex items-center justify-center text-xs bg-gray-200 text-gray-500 font-[family-name:var(--font-cormorant)] italic">C</div>
                  )}
                  {isUser && (
                    userAvatarUrl
                      ? <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mb-1"><img src={userAvatarUrl} className="w-full h-full object-cover" /></div>
                      : <div className="w-8 h-8 rounded-full flex-shrink-0 mb-1 flex items-center justify-center text-xs bg-gray-300 text-gray-600 font-[family-name:var(--font-cormorant)] italic">J</div>
                  )}
                  <div className="max-w-[72%] flex flex-col gap-1">
                    {msg.imageUrl && <img src={msg.imageUrl} className="max-w-full max-h-48 object-cover rounded-2xl" />}
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="text-sm text-gray-700 bg-white rounded-2xl px-4 py-3 border border-gray-200 outline-none resize-none" rows={3} />
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(i)} className="text-xs text-white px-3 py-1.5 rounded-xl" style={{ backgroundColor: "#1a1a1a" }}>保存</button>
                          <button onClick={() => setEditingIdx(null)} className="text-xs text-gray-400 px-3 py-1.5 rounded-xl border border-gray-200">キャンセル</button>
                        </div>
                      </div>
                    ) : (
                      msg.content && (
                        <div className={`px-4 py-2.5 text-sm leading-relaxed ${isUser ? "rounded-[20px_20px_4px_20px]" : "rounded-[20px_20px_20px_4px]"}`}
                          style={{
                            backgroundColor: isUser ? myBubble : caelBubble,
                            color: isUser ? "#ffffff" : "#1a1a1a",
                            border: isUser ? "none" : "1px solid #e8e8e8",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.06)"
                          }}>
                          {isRegenerating ? <span className="text-gray-400">···</span> : msg.content}
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* time + status */}
                <div className={`flex items-center gap-1.5 mt-0.5 ${isUser ? "flex-row-reverse pr-10" : "flex-row pl-10"}`}>
                  {msg.created_at && <span className="text-[10px] text-gray-400">{formatTime(msg.created_at)}{!isUser && " ☁︎"}</span>}
                  {isUser && (
                    <span className="text-[10px]" style={{ color: isRead ? myBubble : "#aaaaaa" }}>
                      {isRead ? "✓✓" : "✓"}
                    </span>
                  )}
                  {!isUser && !isEditing && (
                    <button onClick={() => regenerate(i)} className="text-gray-300 hover:text-gray-500">
                      <ArrowPathIcon className="w-3 h-3" />
                    </button>
                  )}
                  {isUser && !isEditing && (
                    <button onClick={() => { setEditingIdx(i); setEditContent(msg.content); }} className="text-gray-300 hover:text-gray-500">
                      <PencilSquareIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-end gap-2 mb-1">
            {avatarUrl
              ? <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"><img src={avatarUrl} className="w-full h-full object-cover" /></div>
              : <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs bg-gray-200 text-gray-500 font-[family-name:var(--font-cormorant)] italic">C</div>
            }
            <div className="px-4 py-2.5 rounded-[20px_20px_20px_4px] text-sm bg-white border border-gray-200 text-gray-400" style={{boxShadow:"0 1px 2px rgba(0,0,0,0.06)"}}>···</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

      {/* input bar */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-3 bg-white/90 backdrop-blur-sm border-t border-gray-100">
        {pendingImage && (
          <div className="mb-2 relative inline-block">
            <img src={pendingImage} className="h-16 w-16 object-cover rounded-xl" />
            <button onClick={() => setPendingImage(null)} className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
              <XMarkIcon className="w-2.5 h-2.5 text-white" />
            </button>
          </div>
        )}
        {uploadingImage && <p className="text-xs text-gray-400 mb-2">アップロード中...</p>}
        <div className="flex gap-2 items-end">
          <button onClick={() => setShowAddMenu(true)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 bg-white">
            <PlusIcon className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="メッセージ / 写点什么..."
            rows={1}
            className="flex-1 text-sm text-gray-700 bg-gray-100 rounded-2xl px-4 py-3 resize-none outline-none"
          />
          <button onClick={sendMessage} disabled={loading} className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1a1a1a" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
