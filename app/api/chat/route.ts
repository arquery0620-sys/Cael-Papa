
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

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
          role: "user",
          content: message,
        },
      ],
    }),
  }
);

    const data = await response.json();

    return Response.json({
      reply: data.choices?.[0]?.message?.content || "没有回复",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply: "出错了",
    });
  }
}