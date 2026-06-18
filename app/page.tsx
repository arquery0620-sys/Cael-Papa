"use client";
export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col px-6 pt-14">
      <h1 className="text-xl text-[#2c2018] font-medium mb-8">Cael</h1>
      <div className="flex flex-col gap-3">
        <a href="/chat" className="bg-white rounded-2xl p-5 border border-[#f0ebe3] text-sm text-[#2c2018]">💬 Chat</a>
        <a href="/characters" className="bg-white rounded-2xl p-5 border border-[#f0ebe3] text-sm text-[#2c2018]">🎭 Characters</a>
        <a href="/diary" className="bg-white rounded-2xl p-5 border border-[#f0ebe3] text-sm text-[#2c2018]">📔 Diary</a>
        <a href="/board" className="bg-white rounded-2xl p-5 border border-[#f0ebe3] text-sm text-[#2c2018]">📌 Board</a>
        <a href="/settings" className="bg-white rounded-2xl p-5 border border-[#f0ebe3] text-sm text-[#2c2018]">⚙️ Settings</a>
      </div>
    </div>
  );
}
