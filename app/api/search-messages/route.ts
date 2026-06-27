import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q.trim()) return NextResponse.json({ results: [] });

  const { data } = await supabase
    .from("messages")
    .select("id, content, role, created_at, conversation_id")
    .ilike("content", `%${q}%`)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ results: data || [] });
}
