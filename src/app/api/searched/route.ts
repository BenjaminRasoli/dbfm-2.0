import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchWord = url.searchParams.get("searchWord");

    const apiUrl = `https://api.themoviedb.org/3/search/multi?include_adult=true?language=en-US&query=${searchWord}&page=1&api_key=${process.env.REACT_APP_APIKEY}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
