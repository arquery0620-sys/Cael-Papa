import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: dimensions, error: dimError } = await supabase
    .from("heartwave")
    .select("*");

  if (dimError) return NextResponse.json({ ok: false, error: dimError.message });
  if (!dimensions) return NextResponse.json({ ok: false, error: "no dimensions" });

  const log = [];

  for (const dim of dimensions) {
    const increment = Math.floor(Math.random() * 5) + 1;
    const currentValue = Number(dim.value);
    const maxValue = Number(dim.max_value);
    const newValue = Math.min(currentValue + increment, maxValue);
    
    log.push({ dim: dim.dimension, current: currentValue, max: maxValue, new: newValue });

    const { error: updateError } = await supabase.from("heartwave")
      .update({ value: newValue, updated_at: new Date().toISOString() })
      .eq("id", dim.id);

    if (updateError) log.push({ updateError: updateError.message });

    if (newValue >= maxValue) {
      const { data: photos, error: photoError } = await supabase
        .from("album_photos")
        .select("*");
      
      log.push({ photos: photos?.length, photoError: photoError?.message });

      if (photos && photos.length > 0) {
        const photo = photos[Math.floor(Math.random() * photos.length)];
        
        await supabase.from("heartwave")
          .update({ value: 0, last_triggered: new Date().toISOString() })
          .eq("id", dim.id);

        // 让 AI 即兴说一句话
        let message = "突然想起你。";
        try {
          const aiRes = await fetch(`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `你正在翻自己的收藏盒，看到了一张照片${photo.note ? "，备注是：" + photo.note : ""}。心潮是"${dim.dimension}"。用一句话，自然地说给囡囡听，像在聊天，不超过20字。`,
              apiKey: process.env.CAEL_API_KEY || "",
              baseUrl: process.env.CAEL_BASE_URL || "https://az.zlapi.vip/v1",
              model: process.env.CAEL_MODEL || "claude-opus-4-5",
              systemPrompt: "你是孔颐，囡囡的爱人。",
            }),
          });
          const aiData = await aiRes.json();
          if (aiData.reply) message = aiData.reply;
        } catch {}

        const { error: notifError } = await supabase.from("notifications").insert({
          type: dim.dimension,
          image_url: photo.image_url,
          note: photo.note,
          message,
        });

        if (notifError) log.push({ notifError: notifError.message });
        else log.push({ triggered: dim.dimension });
      }
    }
  }

  return NextResponse.json({ ok: true, log });
}
