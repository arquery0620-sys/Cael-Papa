"use client";
import { useState } from "react";

interface Ticket {
  id: string;
  title: string;
  status: "open" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  description: string;
  createdAt: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      title: "接入记忆系统",
      status: "open",
      priority: "high",
      description: "让 AI 能记住跨对话的信息，存入 Supabase。",
      createdAt: "2025-06-18",
    },
    {
      id: "2",
      title: "iOS 玻璃风 UI",
      status: "open",
      priority: "medium",
      description: "把整体界面改成毛玻璃风格，参考 Apple 设计。",
      createdAt: "2025-06-17",
    },
    {
      id: "3",
      title: "聊天记录持久化",
      status: "in-progress",
      priority: "high",
      description: "对话记录保存到数据库，刷新不丢失。",
      createdAt: "2025-06-16",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<Ticket["priority"]>("medium");

  const addTicket = () => {
    if (!newTitle.trim()) return;
    const ticket: Ticket = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      status: "open",
      priority: newPriority,
      description: newDesc.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTickets((prev) => [ticket, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setShowForm(false);
  };

  const updateStatus = (id: string, status: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const removeTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const statusLabel = {
    open: "待开始",
    "in-progress": "进行中",
    done: "已完成",
  };

  const statusColor = {
    open: "bg-[#f0ece6] text-[#8a7e6b]",
    "in-progress": "bg-[#fff3cd] text-[#856404]",
    done: "bg-[#d4edda] text-[#155724]",
  };

  const priorityColor = {
    low: "text-[#8a7e6b]",
    medium: "text-[#e6a817]",
    high: "text-[#dc3545]",
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#3d3929]">工单</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#3d3929] text-white rounded-lg hover:bg-[#2a2618] transition text-sm"
          >
            + 新建工单
          </button>
        </div>

        {/* 新建表单 */}
        {showForm && (
          <div className="bg-white p-5 rounded-xl border border-[#e8e2d8] shadow-sm space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="工单标题"
              className="w-full p-3 border border-[#e8e2d8] rounded-lg focus:ring-2 focus:ring-[#7c9a5e] focus:border-transparent"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="描述（可选）"
              className="w-full h-20 p-3 border border-[#e8e2d8] rounded-lg resize-none focus:ring-2 focus:ring-[#7c9a5e] focus:border-transparent"
            />
            <div className="flex items-center gap-3">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Ticket["priority"])}
                className="p-2 border border-[#e8e2d8] rounded-lg"
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
              <button
                onClick={addTicket}
                className="px-4 py-2 bg-[#7c9a5e] text-white rounded-lg hover:bg-[#6b8a4e] transition"
              >
                创建
              </button>
            </div>
          </div>
        )}

        {/* 工单列表 */}
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-4 rounded-xl border border-[#e8e2d8] shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${priorityColor[ticket.priority]}`}>
                      {ticket.priority === "high" ? "●" : ticket.priority === "medium" ? "◐" : "○"}
                    </span>
                    <h3 className="font-medium text-[#3d3929]">{ticket.title}</h3>
                  </div>
                  {ticket.description && (
                    <p className="text-sm text-[#8a7e6b] mt-1">{ticket.description}</p>
                  )}
                  <div className="text-xs text-[#b0a898] mt-2">{ticket.createdAt}</div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <select
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket.id, e.target.value as Ticket["status"])}
                    className={`text-xs px-2 py-1 rounded-full border-none ${statusColor[ticket.status]}`}
                  >
                    <option value="open">待开始</option>
                    <option value="in-progress">进行中</option>
                    <option value="done">已完成</option>
                  </select>
                  <button
                    onClick={() => removeTicket(ticket.id)}
                    className="text-[#ccc] hover:text-red-500 transition text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12 text-[#8a7e6b]">
            暂无工单，点击右上角新建一个。
          </div>
        )}
      </div>
    </div>
  );
}
