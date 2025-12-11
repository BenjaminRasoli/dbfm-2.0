import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const genreId = url.searchParams.get("genre");
    const page = url.searchParams.get("page");

    const apiUrl = `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=${genreId}&page=${page}&api_key=${process.env.APIKEY}`;

    const res = await fetch(apiUrl, {
      next: { revalidate: 300 },
    });
    const data = await res.json();

        return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
