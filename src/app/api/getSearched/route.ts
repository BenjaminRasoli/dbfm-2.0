import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchWord, filter, page } = await req.json();
    const apiUrl = `https://api.themoviedb.org/3/search/${filter}?language=en-US&query=${searchWord}&page=${page}&api_key=${process.env.APIKEY}`;

    const res = await fetch(apiUrl);
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
