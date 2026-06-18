"use client";
import { useState, useEffect } from "react";

interface UsageRecord {
  date: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export default function UsagePage() {
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  useEffect(() => {
    // 从 localStorage 读取用量记录（后续可接数据库）
    const stored = localStorage.getItem("ai-usage-records");
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      // 示例数据
      setRecords([
        { date: "2025-06-18", model: "gpt-4o", inputTokens: 2340, outputTokens: 1890, cost: 0.05 },
        { date: "2025-06-18", model: "claude-sonnet", inputTokens: 1560, outputTokens: 2200, cost: 0.03 },
        { date: "2025-06-17", model: "gpt-4o", inputTokens: 5420, outputTokens: 4100, cost: 0.12 },
        { date: "2025-06-17", model: "gpt-4o", inputTokens: 890, outputTokens: 670, cost: 0.02 },
        { date: "2025-06-16", model: "gemini-1.5-pro", inputTokens: 3200, outputTokens: 2800, cost: 0.04 },
      ]);
    }
  }, []);

  const totalInput = records.reduce((sum, r) => sum + r.inputTokens, 0);
  const totalOutput = records.reduce((sum, r) => sum + r.outputTokens, 0);
  const totalCost = records.reduce((sum, r) => sum + r.cost, 0);
  const totalCalls = records.length;

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[#3d3929]">用量统计</h1>

        {/* 时间筛选 */}
        <div className="flex gap-2">
          {(["today", "week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                period === p
                  ? "bg-[#3d3929] text-white"
                  : "bg-white text-[#8a7e6b] border border-[#e8e2d8] hover:bg-[#f5f3ef]"
              }`}
            >
              {p === "today" ? "今天" : p === "week" ? "本周" : "本月"}
            </button>
          ))}
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#e8e2d8] shadow-sm">
            <div className="text-sm text-[#8a7e6b]">总调用次数</div>
            <div className="text-2xl font-bold text-[#3d3929] mt-1">{totalCalls}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e8e2d8] shadow-sm">
            <div className="text-sm text-[#8a7e6b]">总花费</div>
            <div className="text-2xl font-bold text-[#3d3929] mt-1">${totalCost.toFixed(3)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e8e2d8] shadow-sm">
            <div className="text-sm text-[#8a7e6b]">输入 Tokens</div>
            <div className="text-2xl font-bold text-[#3d3929] mt-1">{totalInput.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#e8e2d8] shadow-sm">
            <div className="text-sm text-[#8a7e6b]">输出 Tokens</div>
            <div className="text-2xl font-bold text-[#3d3929] mt-1">{totalOutput.toLocaleString()}</div>
          </div>
        </div>

        {/* 明细列表 */}
        <div className="bg-white rounded-xl border border-[#e8e2d8] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#e8e2d8]">
            <h2 className="font-medium text-[#3d3929]">调用明细</h2>
          </div>
          <div className="divide-y divide-[#f0ece6]">
            {records.map((record, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-[#3d3929]">{record.model}</div>
                  <div className="text-xs text-[#8a7e6b] mt-0.5">{record.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#3d3929]">
                    {record.inputTokens + record.outputTokens} tokens
                  </div>
                  <div className="text-xs text-[#8a7e6b]">${record.cost.toFixed(3)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
