import { FetchSingleTypes } from "@/app/Types/FetchSingleMovieOrTvTypes";
import { NextRequest, NextResponse } from "next/server";

async function fetchFromTMDB({ type, id, endpoint }: FetchSingleTypes) {
  const apiUrl = `https://api.themoviedb.org/3/${type}/${id}${endpoint}?api_key=${process.env.APIKEY}&language=en-US`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }

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
    const mediaData = await fetchFromTMDB({ type, id, endpoint: "" });
    const videoData = await fetchFromTMDB({ type, id, endpoint: "/videos" });
    const actorsData = await fetchFromTMDB({
      type,
      id,
      endpoint: type === "movie" ? "/credits" : "/aggregate_credits",
    });
    const reviewsData = await fetchFromTMDB({ type, id, endpoint: "/reviews" });

    return NextResponse.json(
      {
        mediaData,
        videoData,
        actorsData: actorsData.cast,
        reviewsData: reviewsData.results,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
