import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { message, apiKey, baseUrl, model, systemPrompt, imageUrl } = await req.json();

    // 时间
    const now = new Date();
    const timeStr = now.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", year: "numeric", month: "long", day: "numeric", weekday: "long", hour: "2-digit", minute: "2-digit" });

    // 天气
    let weatherStr = "";
    try {
      const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Xi%27an&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=zh_cn`);
      const weatherData = await weatherRes.json();
      if (weatherData.cod === 200) {
        weatherStr = `当前${weatherData.name}天气：${weatherData.weather[0].description}，${Math.round(weatherData.main.temp)}°C，体感${Math.round(weatherData.main.feels_like)}°C，湿度${weatherData.main.humidity}%。`;
      }
    } catch {}

    // 搜索
    let searchResults = "";
    const needsSearch = /最新|最近|新闻|搜索|查一下|帮我找/.test(message);
    if (needsSearch) {
      try {
        const baseOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
        const searchRes = await fetch(`${baseOrigin}/api/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });
        const searchData = await searchRes.json();
        searchResults = searchData.results ? `\n\n[搜索结果]\n${searchData.results}` : "";
      } catch {}
    }

    const contextPrompt = `\n\n[系统信息] 现在是${timeStr}。${weatherStr}${searchResults}`;

    const { data: stickers } = await supabase.from("stickers").select("id, description, category");
    const stickerList = stickers?.map(s => `${s.id}: ${s.description} (${s.category})`).join("\n") || "";
    const stickerPrompt = `你可以在回复时附带一个表情包，概率约30%，在情绪浓厚时使用。
规则：
- 只能从以下列表中选择id，不能编造
- 如果发表情包：在回复最后一行输出 [STICKER:id]
- 如果不发：不要输出任何STICKER相关内容
可用表情包：
${stickerList}
`;

    const userContent = imageUrl
      ? [
          { type: "image_url", image_url: { url: imageUrl } },
          ...(message ? [{ type: "text", text: message }] : []),
        ]
      : message;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "claude-opus-4-5",
        messages: [
          { role: "system", content: (systemPrompt || "") + contextPrompt + "\n\n" + stickerPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    const data = await response.json();
    const rawReply = data.choices?.[0]?.message?.content || JSON.stringify(data);
    const stickerMatch = rawReply.match(/\[STICKER:([^\]]+)\]/);
    const stickerId = stickerMatch ? stickerMatch[1].trim() : null;
    const reply = rawReply.replace(/\[STICKER:[^\]]+\]/g, "").trim();

    let stickerUrl = null;
    if (stickerId && stickers) {
      const found = stickers.find(s => s.id === stickerId);
      if (found) {
        const { data: urlData } = await supabase.from("stickers").select("url").eq("id", stickerId).single();
        stickerUrl = urlData?.url || null;
      }
    }

    return Response.json({ reply, stickerId, stickerUrl, usage: data.usage || null });
  } catch (error) {
    return Response.json({ reply: `ERROR: ${String(error)}`, stickerId: null, stickerUrl: null, usage: null });
  }
}
