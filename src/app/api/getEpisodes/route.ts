import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const seasonNumber = url.searchParams.get("seasonNumber") || 1;

    const apiUrl = `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?language=en-US&api_key=${process.env.APIKEY}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
