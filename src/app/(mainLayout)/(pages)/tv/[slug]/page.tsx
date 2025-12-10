import { Suspense } from "react";
import SingleMovieOrTvClient from "@/app/components/SingleMovieOrTv/SingleMovieOrTvClient";
import SingleSkeletonLoader from "@/app/components/SingleSkeletonLoader/SingleSkeletonLoader";
import NotFound from "@/app/not-found";
import { MovieTypes } from "@/app/Types/MovieTypes";
import { TvTypes } from "@/app/Types/TvTypes";
import { VideoTypes } from "@/app/Types/VideoTypes";
import { ActorsTypes } from "@/app/Types/ActorsTypes";
import { ReviewTypes } from "@/app/Types/ReviewTypes";
import { WatchResultsTypes } from "@/app/Types/WhereToWatchTypes";

async function fetchFromTMDB(type: string, id: string, endpoint: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?type=${type}&id=${id}&endpoint=${endpoint}`;
  const response = await fetch(apiUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }
  return response.json();
}

async function getSingleMovieOrTv(id: string, type: string) {
  try {
    const [mediaData, videoData, actorsData, reviewsData, whereToWatchData] =
      await Promise.all([
        fetchFromTMDB(type, id, ""),
        fetchFromTMDB(type, id, "/videos"),
        fetchFromTMDB(
          type,
          id,
          type === "movie" ? "/credits" : "/aggregate_credits"
        ),
        fetchFromTMDB(type, id, "/reviews"),
        fetchFromTMDB(type, id, "/watch/providers"),
      ]);

    return {
      mediaData: {
        ...mediaData,
        media_type: type,
      } as MovieTypes | TvTypes,
      videoData: videoData.results as VideoTypes[],
      actorsData: actorsData.cast as ActorsTypes[],
      reviewsData: reviewsData.results as ReviewTypes[],
      whereToWatch: whereToWatchData.results as WatchResultsTypes | null,
    };
  } catch (error) {
    console.error("Error fetching single movie or TV:", error);
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { mediaData, videoData, actorsData, reviewsData, whereToWatch } =
      await getSingleMovieOrTv(slug, "tv");

    if (!mediaData) {
      return <NotFound />;
    }

    return (
      <Suspense fallback={<SingleSkeletonLoader mediaData={mediaData} />}>
        <SingleMovieOrTvClient
          mediaData={mediaData}
          video={videoData}
          actors={actorsData}
          reviews={reviewsData}
          whereToWatch={whereToWatch}
          type="tv"
        />
      </Suspense>
    );
  } catch {
    return <NotFound />;
  }
}
