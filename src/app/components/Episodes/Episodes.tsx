"use client";
import { EpisodesTypes, EpisodeTypes } from "@/app/Types/EpisodesTypes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiStarSFill } from "react-icons/ri";
import Image from "next/image";
import EpisodePlaceholder from "../../images/MediaImagePlaceholder.jpg";
import EpisodesSkeletonLoader from "../EpisodesSkeletonLoader/EpisodesSkeletonLoader";

function Episodes({
  params,
}: {
  params: Promise<{ slug: string; seasonNumber: number }>;
}) {
  const [episodes, setEpisodes] = useState<EpisodesTypes | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [totalSeasons, setTotalSeasons] = useState<number>(1);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [hasSeasonZero, setHasSeasonZero] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const { slug, seasonNumber } = await params;
      setSlug(slug);
      setCurrentSeason(seasonNumber);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getEpisodes?id=${slug}&seasonNumber=${seasonNumber}`
      );
      const tvResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=tv`
      );

      const data = await response.json();
      const tvData = await tvResponse.json();
      setEpisodes(data);
      setTotalSeasons(tvData.mediaData.seasons.length);
      setHasSeasonZero(tvData.mediaData.seasons[0]?.season_number === 0);
    };

    fetchData();
  }, [params]);

  if (!episodes) {
    return <EpisodesSkeletonLoader />;
  }

  const isFirstSeason = hasSeasonZero ? currentSeason <= 0 : currentSeason <= 1;

  const isLastSeason = currentSeason >= totalSeasons;

  return (
    <div
      className="relative bg-cover bg-center py-5 min-h-[100dvh]"
      style={{
        backgroundImage: `url('https://image.tmdb.org/t/p/original${episodes.poster_path}')`,
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      ></div>
      <div className="relative mx-auto z-10 pt-10 p-3 max-w-[300px] sm:max-w-[570px] md:max-w-[550px] custom-lg:max-w-[950px] ">
        <Link
          href={`/tv/${slug}`}
          className="text-white bg-blue px-4 mb-5 py-2 rounded-lg hover:bg-blue-hover"
        >
          Back
        </Link>
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-3 mt-6">
          <Link
            href={`/tv/${slug}/season/${Number(currentSeason) - 1}`}
            className={`text-white bg-blue px-4 py-2 rounded-lg w-[160px]  ${
              isFirstSeason
                ? "cursor-not-allowed opacity-50 bg-red"
                : "hover:bg-blue-hover"
            }`}
            onClick={(e) => isFirstSeason && e.preventDefault()}
          >
            Previous Season
          </Link>

          <Link
            href={`/tv/${slug}/season/${Number(currentSeason) + 1}`}
            className={`text-white bg-blue px-4 py-2 rounded-lg w-[160px] ${
              isLastSeason
                ? "cursor-not-allowed opacity-50 bg-red"
                : "hover:bg-blue-hover"
            }`}
            onClick={(e) => isLastSeason && e.preventDefault()}
          >
            Next Season
          </Link>
        </div>

        <div className="text-white mb-6">
          <h2 className="text-2xl font-semibold">
            {episodes.name || "Unknown Name"}
          </h2>
          <p className="text-lg">
            Total Episodes: {episodes.episodes?.length || 0}
          </p>
        </div>

        <div className="mt-10 pb-5 flex overflow-auto gap-6">
          {episodes.episodes?.map((episode: EpisodeTypes) => (
            <div
              key={episode.id}
              className="bg-blue rounded-lg overflow-hidden shadow-lg flex-shrink-0 w-[250px] sm:w-[320px] flex flex-col"
            >
              <Image
                src={
                  episode?.still_path
                    ? `https://image.tmdb.org/t/p/original${episode.still_path}`
                    : EpisodePlaceholder
                }
                alt={episode?.name}
                className="w-full h-48 object-cover"
                height={700}
                width={700}
              />
              <div className="p-4 text-xl font-semibold text-white flex flex-col flex-grow">
                <div className="flex justify-between items-center">
                  <h3>EP {episode?.episode_number || 0}</h3>
                  <span className="text-yellow mr-2 flex items-center gap-1">
                    <RiStarSFill /> {episode.vote_average || 0}
                  </span>
                </div>
                <h3>{episode?.name}</h3>
                <p className="text-sm text-white">
                  {episode?.overview || "No Overview"}
                </p>

                <div className="text-white mt-auto">
                  <p>Runtime: {episode?.runtime || 0} min</p>
                  <p>Air Date: {episode?.air_date || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Episodes;
