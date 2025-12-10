import { Suspense } from "react";
import EpisodesClient from "@/app/components/Episodes/EpisodesClient";
import EpisodesSkeletonLoader from "@/app/components/EpisodesSkeletonLoader/EpisodesSkeletonLoader";
import NotFound from "@/app/not-found";
import { EpisodesTypes } from "@/app/Types/EpisodesTypes";
import { TvTypes } from "@/app/Types/TvTypes";
//`${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${id}`
async function getEpisodes(id: string, seasonNumber: number) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getEpisodes?id=${id}&seasonNumber=${seasonNumber}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch episodes");
    }

    const data = await res.json();
    return data as EpisodesTypes;
  } catch (error) {
    console.error("Error fetching episodes:", error);
    throw error;
  }
}

async function getTvData(id: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${id}&type=tv`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch TV data");
    }

    const data = await res.json();
    return data as TvTypes;
  } catch (error) {
    console.error("Error fetching TV data:", error);
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; seasonNumber: string }>;
}) {
  const { slug, seasonNumber } = await params;
  const seasonNum = parseInt(seasonNumber, 10);

  try {
    const [episodes, tvData] = await Promise.all([
      getEpisodes(slug, seasonNum),
      getTvData(slug),
    ]);

    if (!episodes?.episodes || !tvData) {
      return <NotFound />;
    }

    const hasSeasonZero = tvData.seasons[0]?.season_number === 0;

    return (
      <Suspense fallback={<EpisodesSkeletonLoader />}>
        <EpisodesClient
          episodes={episodes}
          slug={slug}
          seasonNumber={seasonNum}
          totalSeasons={tvData.number_of_seasons}
          hasSeasonZero={hasSeasonZero}
        />
      </Suspense>
    );
  } catch {
    return <NotFound />;
  }
}
