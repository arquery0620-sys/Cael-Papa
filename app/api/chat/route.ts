export async function POST(req: Request) {
  try {
    const { message, apiKey, baseUrl, model, systemPrompt, imageUrl } = await req.json();

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
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: userContent },
        ],
      }),
    });

    const data = await response.json();
    return Response.json({
      reply: data.choices?.[0]?.message?.content || JSON.stringify(data),
      usage: data.usage || null,
    });
  } catch (error) {
    return Response.json({ reply: `ERROR: ${String(error)}`, usage: null });
  }
}
