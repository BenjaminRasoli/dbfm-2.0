import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const media_type = url.searchParams.get("media_type");

    const apiUrl = `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.APIKEY}`;

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
  }  catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
