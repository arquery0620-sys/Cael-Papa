import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const apiKey = process.env.TAVILY_API_KEY;
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: 3,
      search_depth: "basic",
    }),
  });
  const data = await res.json();
  const results = data.results?.map((r: any) => `${r.title}: ${r.content}`).join("\n\n") || "无结果";
  return NextResponse.json({ results });
}
