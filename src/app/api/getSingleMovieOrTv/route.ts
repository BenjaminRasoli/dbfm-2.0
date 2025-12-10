import { NextRequest, NextResponse } from "next/server";

async function fetchFromTMDB(type: string, id: string, endpoint: string) {
  const apiUrl = `https://api.themoviedb.org/3/${type}/${id}${endpoint}?api_key=${process.env.APIKEY}&language=en-US`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed fetching TMDB: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  const endpoint = url.searchParams.get("endpoint") ?? "";

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  try {
    const data = await fetchFromTMDB(type, id, endpoint);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
