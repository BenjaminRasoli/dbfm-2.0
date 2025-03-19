import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "movie";
    const page = url.searchParams.get("page") || 1;

    const apiUrl = `https://api.themoviedb.org/3/trending/${type}/day?language=en-US&page=${page}&api_key=${process.env.APIKEY}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
