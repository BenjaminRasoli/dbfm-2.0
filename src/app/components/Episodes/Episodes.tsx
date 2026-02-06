"use client";
import { EpisodesTypes, EpisodeTypes } from "@/app/Types/EpisodesTypes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { RiStarSFill } from "react-icons/ri";
import Image from "next/image";
import EpisodePlaceholder from "../../images/MediaImagePlaceholder.jpg";
import EpisodesSkeletonLoader from "../EpisodesSkeletonLoader/EpisodesSkeletonLoader";
import NotFound from "@/app/not-found";

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
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<{ [id: number]: boolean }>(
    {},
  );

  useEffect(() => {
    const fetchData = async () => {
      const { slug, seasonNumber } = await params;
      setSlug(slug);
      setCurrentSeason(seasonNumber);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getEpisodes?id=${slug}&seasonNumber=${seasonNumber}`,
        );

        const tvResponse = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=tv`,
        );

        if (!response.ok || !tvResponse.ok) {
          setNotFound(true);
          return;
        }

        const data = await response.json();
        const tvData = await tvResponse.json();

        if (!data?.episodes || !tvData?.mediaData) {
          setNotFound(true);
          return;
        }

        setEpisodes(data);
        setTotalSeasons(tvData.mediaData.number_of_seasons);
        setHasSeasonZero(tvData.mediaData.seasons[0]?.season_number === 0);
      } catch (error) {
        console.error("Error fetching episode data:", error);
        setEpisodes(null);
      }
    };

    fetchData();
  }, [params]);

  if (notFound === true) {
    return <NotFound />;
  }

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
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      ></div>

      <div className="relative z-10 !pt-30 customContainer">
        <Link
          href={`/tv/${slug}`}
          className="text-white bg-blue px-4 mb-5 py-2 rounded-lg hover:bg-blue-hover"
        >
          Back
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-3 mt-6">
          <Link
            href={`/tv/${slug}/season/${Number(currentSeason) - 1}`}
            className={`text-white bg-blue px-4 py-2 rounded-lg w-[160px] ${
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
          {episodes.episodes?.map((episode: EpisodeTypes) => {
            const isImageLoaded = loadedImages[episode.id] || false;
            const imageSrc = episode?.still_path
              ? `https://image.tmdb.org/t/p/original${episode.still_path}`
              : EpisodePlaceholder;

            return (
              <div
                key={episode.id}
                className="bg-blue rounded-lg  hadow-lg flex-shrink-0 w-[250px] sm:w-[300px] flex flex-col"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  {!isImageLoaded && (
                    <div className="absolute rounded-t-lg inset-0 bg-gray-300 animate-pulse z-10" />
                  )}
                  <Image
                    src={imageSrc}
                    alt={episode?.name || "Episode image"}
                    className="w-full h-full rounded-t-lg object-cover"
                    height={700}
                    width={700}
                    onLoad={() =>
                      setLoadedImages((prev) => ({
                        ...prev,
                        [episode.id]: true,
                      }))
                    }
                  />
                </div>

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
                    {episode?.runtime && <p>Runtime: {episode?.runtime} min</p>}
                    {episode?.air_date && <p>Air Date: {episode?.air_date}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Episodes;
