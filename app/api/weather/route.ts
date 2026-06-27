import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") || "Xian";
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=zh_cn`
  );
  const data = await res.json();
  if (data.cod !== 200) return NextResponse.json({ error: "城市未找到" });
  return NextResponse.json({
    city: data.name,
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    icon: data.weather[0].icon,
  });
}
