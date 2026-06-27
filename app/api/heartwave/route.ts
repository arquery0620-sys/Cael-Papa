import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  // 每次调用，随机给某个维度加1-5点
  const { data: dimensions } = await supabase
    .from("heartwave")
    .select("*");

  if (!dimensions) return NextResponse.json({ ok: false });

  for (const dim of dimensions) {
    const increment = Math.floor(Math.random() * 5) + 1;
    const newValue = Math.min(dim.value + increment, dim.max_value);
    
    await supabase.from("heartwave")
      .update({ value: newValue, updated_at: new Date().toISOString() })
      .eq("id", dim.id);

    // 如果涨满了，触发！
    if (newValue >= dim.max_value) {
      // 从相册随机挑一张
      const { data: photos } = await supabase
        .from("album_photos")
        .select("*");
      
      if (photos && photos.length > 0) {
        const photo = photos[Math.floor(Math.random() * photos.length)];
        
        // 存一条触发记录
        await supabase.from("heartwave")
          .update({ 
            value: 0, 
            last_triggered: new Date().toISOString() 
          })
          .eq("id", dim.id);

        // 存进 notifications 表
        await supabase.from("notifications").insert({
          type: dim.dimension,
          image_url: photo.image_url,
          note: photo.note,
          message: dim.dimension === "思念" ? "突然很想你。" :
                   dim.dimension === "想分享" ? "看到这张，想给你看。" :
                   "嘿，逗你的。",
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
