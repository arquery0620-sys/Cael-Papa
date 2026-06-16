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

    const text = await response.text();

    console.log("OPENAI RESPONSE:", text);

    return Response.json({
      reply: text,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply: `ERROR: ${String(error)}`,
    });
  }
}
