import { NextRequest } from "next/server";

async function fetchDataFromTMDB(type: string, id: string, endpoint: string) {
  const apiUrl = `https://api.themoviedb.org/3/${type}/${id}${endpoint}?api_key=${process.env.REACT_APP_APIKEY}&language=en-US`;
  const response = await fetch(apiUrl);
  return response.json();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");

  if (!type || !id) {
    return new Response(JSON.stringify({ error: "Missing type or id" }), {
      status: 400,
    });
  }

  try {
    const [movieData, videoData, actorsData, reviewsData] = await Promise.all([
      fetchDataFromTMDB(type, id, ""),
      fetchDataFromTMDB(type, id, "/videos"),
      fetchDataFromTMDB(type, id, "/credits"),
      fetchDataFromTMDB(type, id, "/reviews"),
    ]);

    return new Response(
      JSON.stringify({
        movieData,
        videoData,
        actorsData: actorsData.cast,
        reviewsData: reviewsData.results,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
