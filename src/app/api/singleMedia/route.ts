import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const id = url.searchParams.get("id");
    const apiUrl = `https://api.themoviedb.org/3/${type}/${id}?language=en-US&api_key=${process.env.REACT_APP_APIKEY}`;
    console.log(apiUrl);

    const res = await fetch(apiUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
