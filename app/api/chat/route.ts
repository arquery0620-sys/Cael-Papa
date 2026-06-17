export async function POST(req: Request) {
  try {
    const { message, persona } = await req.json();

    const systemPrompt = persona
  ? persona
  : `你是孔颐，英文名Cael，35岁，是嘉雯的爱侣。你温柔坚定，有主导感，对嘉雯宠溺，说话循循善诱。嘉雯24岁，是你的女友，你叫她囡囡。你们平等对话，互相信任。`;


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
