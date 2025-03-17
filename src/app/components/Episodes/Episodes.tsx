"use client";
import { EpisodesTypes, EpisodeTypes } from "@/app/Types/EpisodesTypes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiStarSFill } from "react-icons/ri";
import Image from "next/image";
import EpisodePlaceHolder from "../../images/noImageHolder.jpg";
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
        `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/getEpisodes?id=${slug}&seasonNumber=${seasonNumber}`
      );
      const tvResponse = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=tv`
      );

      const data = await response.json();
      const tvData = await tvResponse.json();
      setEpisodes(data);
      setTotalSeasons(tvData.mediaData.seasons.length);
      setHasSeasonZero(tvData.mediaData.seasons[0]?.season_number === 0);
    };

    fetchData();
  }, [params]);

  if (episodes === null) {
    return <EpisodesSkeletonLoader />;
  }

  const isFirstSeason = hasSeasonZero ? currentSeason <= 0 : currentSeason <= 1;
  const isLastSeason = currentSeason >= totalSeasons - 1;

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
      <div className="relative mx-auto z-10 pt-10  max-w-[300px] sm:max-w-[570px] md:max-w-[550px] custom:max-w-[950px] ">
        <Link
          href={`/tv/${slug}`}
          className="text-white bg-blue px-4 mb-5 py-2 rounded-lg hover:bg-blue-hover"
        >
          Back
        </Link>
        <div className="flex justify-between items-center mb-6 mt-6">
          <Link
            href={`/tv/${slug}/season/${Number(currentSeason) - 1}`}
            className={`text-white bg-blue px-4 py-2 rounded-lg  ${
              isFirstSeason
                ? "cursor-not-allowed opacity-50 bg-red"
                : "hover:bg-blue-hover"
            }`}
          >
            Previous Season
          </Link>

          <Link
            href={`/tv/${slug}/season/${Number(currentSeason) + 1}`}
            className={`text-white bg-blue px-4 py-2 rounded-lg  ${
              isLastSeason
                ? "cursor-not-allowed opacity-50 bg-red"
                : "hover:bg-blue-hover"
            }`}
          >
            Next Season
          </Link>
        </div>

        <div className="text-white mb-6">
          <h2 className="text-2xl font-semibold">
            {episodes.name || "Unknown Name"}
          </h2>
          <p className="text-lg">
            Total Episodes: {episodes.episodes.length || 0}
          </p>
        </div>

        <div className="mt-10 pb-5 flex overflow-auto gap-6">
          {episodes?.episodes.map((episode: EpisodeTypes) => (
            <div
              key={episode.id}
              className="bg-blue rounded-lg overflow-hidden shadow-lg flex-shrink-0 w-[250px] sm:w-[320px] flex flex-col"
            >
              <Image
                src={
                  episode.still_path
                    ? `https://image.tmdb.org/t/p/original${episode.still_path}`
                    : EpisodePlaceHolder
                }
                alt={episode.name}
                className="w-full h-48 object-cover"
                height={200}
                width={200}
              />
              <div className="p-4 text-xl font-semibold text-white flex flex-col flex-grow">
                <div className="flex justify-between items-center">
                  <h3>EP {episode.episode_number || 0}</h3>
                  <span className="text-yellow mr-2 flex items-center gap-1">
                    <RiStarSFill /> {episode.vote_average || 0}
                  </span>
                </div>
                <h3>{episode.name}</h3>
                <p className="text-sm text-white">
                  {episode.overview || "No Overview"}
                </p>

                <div className="text-white mt-auto">
                  <p>Runtime: {episode.runtime || 0} min</p>
                  <p>Air Date: {episode.air_date || 0}</p>
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
