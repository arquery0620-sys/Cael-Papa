"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  HomeIcon, ChatBubbleLeftIcon, BookOpenIcon, Squares2X2Icon,
  Cog6ToothIcon, PlusIcon, XMarkIcon, MagnifyingGlassIcon,
  ArrowLeftIcon, SparklesIcon, ChartBarIcon, ChevronDownIcon,
  ChevronRightIcon, PencilSquareIcon, KeyIcon, BookmarkIcon,
  CameraIcon, PhotoIcon, DocumentArrowUpIcon, ArrowPathIcon,
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
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

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
  const [openMore, setOpenMore] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openChats, setOpenChats] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [myBubble, setMyBubble] = useState("#c4a882");
  const [caelBubble, setCaelBubble] = useState("#ffffff");
  const [bgUrl, setBgUrl] = useState("");
  const [bgOpacity, setBgOpacity] = useState(0.3);
  const [bgWhiteness, setBgWhiteness] = useState(250);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKey(localStorage.getItem("cael_api_key") || "");
    setBaseUrl(localStorage.getItem("cael_base_url") || "https://az.zlapi.vip/v1");
    setModel(localStorage.getItem("cael_model") || "claude-opus-4-5");
    setSystemPrompt(localStorage.getItem("cael_prompt") || "");
    setMyBubble(localStorage.getItem("cael_my_bubble") || "#c4a882");
    setCaelBubble(localStorage.getItem("cael_cael_bubble") || "#ffffff");
    setBgUrl(localStorage.getItem("cael_bg_url") || "");
    setBgOpacity(parseFloat(localStorage.getItem("cael_bg_opacity") || "0.3"));
    setBgWhiteness(parseInt(localStorage.getItem("cael_bg_whiteness") || "250"));
    setAvatarUrl(localStorage.getItem("cael_avatar_url") || "");
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
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", convId).order("created_at");
    if (data) setMessages(data);
  };

  const newConversation = async () => {
    const { data } = await supabase.from("conversations").insert({ title: "New chat" }).select().single();
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

  const callAI = async (userMessage: string, imageUrl?: string) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, apiKey, baseUrl, model, systemPrompt, imageUrl }),
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
    if (currentConvId && newMessages[idx].id) {
      await supabase.from("messages").update({ content: data.reply }).eq("id", newMessages[idx].id);
    }
    setRegeneratingIdx(null);
  };

  const saveEdit = async (idx: number) => {
    const newMessages = [...messages];
    newMessages[idx] = { ...newMessages[idx], content: editContent };
    setMessages(newMessages);
    if (currentConvId && newMessages[idx].id) {
      await supabase.from("messages").update({ content: editContent }).eq("id", newMessages[idx].id);
    }
    setEditingIdx(null);
    setEditContent("");
  };

  const summarizeConversation = async () => {
    if (!currentConvId || messages.length === 0) return;
    setSummarizing(true);
    const transcript = messages.map(m => `${m.role === "user" ? "Me" : "Cael"}: ${m.content}`).join("\n");
    const data = await callAI(`Please summarize this conversation concisely in 3-5 sentences:\n\n${transcript}`);
    await supabase.from("conversations").update({ summary: data.reply }).eq("id", currentConvId);
    setCurrentConv(prev => prev ? { ...prev, summary: data.reply } : null);
    setSummarizing(false);
    setShowSummary(true);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !pendingImage) || loading) return;
    let convId = currentConvId;
    if (!convId) {
      const { data } = await supabase.from("conversations").insert({ title: input.slice(0, 20) || "Image" }).select().single();
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong.", created_at: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const lastAssistantIndex = messages.map(m => m.role).lastIndexOf("assistant");

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: `rgb(${bgWhiteness},${bgWhiteness - 2},${bgWhiteness - 7})` }}>
      {bgUrl && <div className="fixed inset-0 -z-10" style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: "cover", backgroundPosition: "center", opacity: bgOpacity }} />}

      {showAddMenu && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowAddMenu(false)} />
          <div className="relative w-full bg-white rounded-t-3xl p-6 pb-10">
            <div className="flex justify-between items-center mb-6">
              <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#2c2018]">Add to Chat</span>
              <button onClick={() => setShowAddMenu(false)} className="w-8 h-8 rounded-full bg-[#faf8f5] flex items-center justify-center">
                <XMarkIcon className="w-4 h-4 text-[#c4b5a0]" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Camera", icon: CameraIcon, onClick: () => { setShowAddMenu(false); cameraRef.current?.click(); } },
                { label: "Photos", icon: PhotoIcon, onClick: () => { setShowAddMenu(false); photoRef.current?.click(); } },
                { label: "Files", icon: DocumentArrowUpIcon, onClick: () => { setShowAddMenu(false); fileRef.current?.click(); } },
              ].map(({ label, icon: Icon, onClick }) => (
                <button key={label} onClick={onClick} className="flex flex-col items-center gap-2 bg-[#faf8f5] rounded-2xl p-4">
                  <Icon className="w-7 h-7 text-[#2c2018]" />
                  <span className="text-xs text-[#2c2018]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="px-5 pt-14 pb-4 flex items-center justify-between border-b border-[#f0ebe3]">
              <span className="font-[family-name:var(--font-cormorant)] text-2xl italic text-[#2c2018]">Cael</span>
              <button onClick={newConversation} className="w-7 h-7 flex items-center justify-center text-[#c4a882] border border-[#c4a882] rounded-full">
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
              <Link href="/" onClick={() => setShowSidebar(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#faf8f5]">
                <HomeIcon className="w-5 h-5 text-[#c4b5a0]" />
                <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">Home</span>
              </Link>
              <button onClick={() => setOpenChats(!openChats)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#faf8f5] w-full">
                <div className="flex items-center gap-3">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-[#c4b5a0]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">Chat</span>
                </div>
                {openChats ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#c4b5a0]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />}
              </button>
              {openChats && (
                <div className="ml-8 flex flex-col gap-1">
                  <button onClick={newConversation} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#faf8f5]">
                    <PlusIcon className="w-3.5 h-3.5 text-[#c4a882]" />
                    <span className="text-xs text-[#c4a882]">New chat</span>
                  </button>
                  {filtered.map((c) => (
                    <div key={c.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${currentConvId === c.id ? "bg-[#faf8f5]" : ""}`}>
                      <button onClick={() => selectConversation(c)} className="font-[family-name:var(--font-cormorant)] text-sm text-[#2c2018] text-left flex-1 truncate">{c.title}</button>
                      <button onClick={() => deleteConversation(c.id)} className="text-[#c4b5a0] ml-2"><XMarkIcon className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setOpenMore(!openMore)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#faf8f5] w-full">
                <div className="flex items-center gap-3">
                  <Squares2X2Icon className="w-5 h-5 text-[#c4b5a0]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">More</span>
                </div>
                {openMore ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#c4b5a0]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />}
              </button>
              {openMore && (
                <div className="ml-8 flex flex-col gap-1">
                  {[
                    { href: "/diary", label: "Diary", icon: BookOpenIcon },
                    { href: "/board", label: "Board", icon: BookmarkIcon },
                    { href: "/usage", label: "Usage", icon: ChartBarIcon },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} onClick={() => setShowSidebar(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#faf8f5]">
                      <Icon className="w-3.5 h-3.5 text-[#c4b5a0]" />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm text-[#2c2018]">{label}</span>
                    </Link>
                  ))}
                </div>
              )}
              <button onClick={() => setOpenSettings(!openSettings)} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#faf8f5] w-full">
                <div className="flex items-center gap-3">
                  <Cog6ToothIcon className="w-5 h-5 text-[#c4b5a0]" />
                  <span className="font-[family-name:var(--font-cormorant)] text-lg text-[#2c2018]">Settings</span>
                </div>
                {openSettings ? <ChevronDownIcon className="w-3.5 h-3.5 text-[#c4b5a0]" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />}
              </button>
              {openSettings && (
                <div className="ml-8 flex flex-col gap-1">
                  {[
                    { href: "/settings", label: "Persona", icon: PencilSquareIcon },
                    { href: "/settings", label: "API Key", icon: KeyIcon },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={label} href={href} onClick={() => setShowSidebar(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#faf8f5]">
                      <Icon className="w-3.5 h-3.5 text-[#c4b5a0]" />
                      <span className="font-[family-name:var(--font-cormorant)] text-sm text-[#2c2018]">{label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-[#f0ebe3] flex items-center gap-2">
              <MagnifyingGlassIcon className="w-3.5 h-3.5 text-[#c4b5a0]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..." className="flex-1 text-xs text-[#2c2018] bg-transparent outline-none" />
            </div>
          </div>
          <div className="flex-1 bg-black/20" onClick={() => setShowSidebar(false)} />
        </div>
      )}

      {showSummary && currentConv?.summary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 border border-[#f0ebe3] shadow-xl max-w-sm w-full">
            <p className="text-xs text-[#c4b5a0] tracking-widest uppercase mb-3">Summary</p>
            <p className="text-sm text-[#2c2018] leading-relaxed">{currentConv.summary}</p>
            <button onClick={() => setShowSummary(false)} className="mt-4 w-full text-xs text-[#c4b5a0] border border-[#f0ebe3] py-2 rounded-xl">Close</button>
          </div>
          <div className="absolute inset-0 bg-black/20 -z-10" onClick={() => setShowSummary(false)} />
        </div>
      )}

      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#c4b5a0]"><ArrowLeftIcon className="w-5 h-5" /></Link>
          <button onClick={() => setShowSidebar(true)} className="text-[#c4b5a0]">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
        <span className="font-[family-name:var(--font-cormorant)] text-xl italic text-[#2c2018]">Cael</span>
        <div className="flex items-center gap-3">
          {currentConvId && messages.length > 0 && (
            <button onClick={summarizing ? undefined : (currentConv?.summary ? () => setShowSummary(true) : summarizeConversation)} className="text-[#c4b5a0]">
              <SparklesIcon className="w-5 h-5" />
            </button>
          )}
          <Link href="/settings" className="text-[#c4b5a0]"><Cog6ToothIcon className="w-5 h-5" /></Link>
        </div>
      </div>

      <div className="flex-1 px-6 pt-4 pb-36 flex flex-col gap-3 overflow-y-auto">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isRead = isUser && i < lastAssistantIndex;
          const isRegenerating = regeneratingIdx === i;
          const isEditing = editingIdx === i;

          return (
            <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {!isUser && (
                  avatarUrl
                    ? <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1"><img src={avatarUrl} className="w-full h-full object-cover" /></div>
                    : <div className="w-6 h-6 rounded-full flex-shrink-0 mb-1 flex items-center justify-center text-[10px] border border-[#f0ebe3]" style={{ backgroundColor: caelBubble }}>C</div>
                )}
                <div className="max-w-[75%] flex flex-col gap-1">
                  {msg.imageUrl && <img src={msg.imageUrl} className="max-w-full max-h-48 object-cover rounded-2xl" />}
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="text-sm text-[#2c2018] bg-white rounded-2xl px-4 py-3 border border-[#f0ebe3] outline-none resize-none" rows={3} />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(i)} className="text-xs text-white px-3 py-1.5 rounded-xl" style={{ backgroundColor: myBubble }}>Save</button>
                        <button onClick={() => setEditingIdx(null)} className="text-xs text-[#c4b5a0] px-3 py-1.5 rounded-xl border border-[#f0ebe3]">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    msg.content && (
                      <div className="px-4 py-3 rounded-2xl text-sm" style={{ backgroundColor: isUser ? myBubble : caelBubble, color: isUser ? "#ffffff" : "#2c2018", border: isUser ? "none" : "1px solid #f0ebe3" }}>
                        {isRegenerating ? <span className="text-[#c4b5a0]">...</span> : msg.content}
                      </div>
                    )
                  )}
                </div>
                {!isEditing && (
                  <button
                    onClick={() => {
                      if (isUser) { setEditingIdx(i); setEditContent(msg.content); }
                      else regenerate(i);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[#c4b5a0] mb-1 flex-shrink-0"
                  >
                    {isUser
                      ? <PencilSquareIcon className="w-3.5 h-3.5" />
                      : <ArrowPathIcon className="w-3.5 h-3.5" />
                    }
                  </button>
                )}
              </div>
              <div className={`flex items-center gap-2 mt-0.5 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {msg.created_at && <span className="text-[10px] text-[#c4b5a0]">{formatTime(msg.created_at)}</span>}
                {isUser && <span className="text-[10px]" style={{ color: isRead ? myBubble : "#c4b5a0" }}>{isRead ? "✓✓" : "✓"}</span>}
                {!isUser && !isEditing && (
                  <button onClick={() => regenerate(i)} className="text-[10px] text-[#c4b5a0] flex items-center gap-0.5">
                    <ArrowPathIcon className="w-3 h-3" />
                  </button>
                )}
                {isUser && !isEditing && (
                  <button onClick={() => { setEditingIdx(i); setEditContent(msg.content); }} className="text-[10px] text-[#c4b5a0] flex items-center gap-0.5">
                    <PencilSquareIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-end gap-2">
            {avatarUrl
              ? <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0"><img src={avatarUrl} className="w-full h-full object-cover" /></div>
              : <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] border border-[#f0ebe3]" style={{ backgroundColor: caelBubble }}>C</div>
            }
            <div className="px-4 py-3 rounded-2xl text-sm border border-[#f0ebe3]" style={{ backgroundColor: caelBubble, color: "#c4b5a0" }}>...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-8 pt-3 border-t border-[#f0ebe3]" style={{ backgroundColor: `rgb(${bgWhiteness},${bgWhiteness - 2},${bgWhiteness - 7})` }}>
        {pendingImage && (
          <div className="mb-2 relative inline-block">
            <img src={pendingImage} className="h-16 w-16 object-cover rounded-xl" />
            <button onClick={() => setPendingImage(null)} className="absolute -top-1 -right-1 w-4 h-4 bg-[#c4b5a0] rounded-full flex items-center justify-center">
              <XMarkIcon className="w-2.5 h-2.5 text-white" />
            </button>
          </div>
        )}
        {uploadingImage && <p className="text-xs text-[#c4b5a0] mb-2">Uploading...</p>}
        <div className="flex gap-2 items-end">
          <button onClick={() => setShowAddMenu(true)} className="w-9 h-9 rounded-full border border-[#f0ebe3] flex items-center justify-center text-[#c4b5a0] flex-shrink-0">
            <PlusIcon className="w-5 h-5" />
          </button>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Write to Cael..." rows={1} className="flex-1 text-sm text-[#2c2018] bg-white rounded-2xl px-4 py-3 border border-[#f0ebe3] resize-none outline-none" />
          <button onClick={sendMessage} disabled={loading} className="text-white text-sm px-4 py-3 rounded-2xl flex-shrink-0" style={{ backgroundColor: myBubble }}>Send</button>
        </div>
      </div>
    </div>
  );
}
