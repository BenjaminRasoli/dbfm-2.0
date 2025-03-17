import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const type = url.searchParams.get("type");

    const apiUrl = `https://api.themoviedb.org/3/${type}/${id}/watch/providers?language=en-US&api_key=${process.env.REACT_APP_APIKEY}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
