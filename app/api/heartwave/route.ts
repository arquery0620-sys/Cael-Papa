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

        const { error: notifError } = await supabase.from("notifications").insert({
          type: dim.dimension,
          image_url: photo.image_url,
          note: photo.note,
          message: dim.dimension === "思念" ? "突然很想你。" :
                   dim.dimension === "想分享" ? "看到这张，想给你看。" :
                   "嘿，逗你的。",
        });

        if (notifError) log.push({ notifError: notifError.message });
        else log.push({ triggered: dim.dimension });
      }
    }
  }

  return NextResponse.json({ ok: true, log });
}
