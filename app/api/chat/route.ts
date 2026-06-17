export async function POST(req: Request) {
  try {
    const { message, persona } = await req.json();

    const response = await fetch(
      `${process.env.OPENAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL,
          messages: [
            {
              role: "system",
              content: persona || "你是 Cael，一个温柔的人。",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return Response.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "没有收到回复",
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply: "爸爸暂时说不了话了...",
    });
  }
}
