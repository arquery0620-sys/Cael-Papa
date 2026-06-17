export async function POST(req: Request) {
  try {
    const { message, persona } = await req.json();

    const systemPrompt = persona
      ? `你的人设是：${persona}`
      : "你是Cael，一个温柔陪伴型AI";

    const response = await fetch(
      `${process.env.OPENAI_BASE_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-5.5",
          messages: [
            {
              role: "system",
              content: systemPrompt,
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
    console.error(error);

    return Response.json({
      reply: "爸爸暂时说不了话了...",
    });
  }
}
