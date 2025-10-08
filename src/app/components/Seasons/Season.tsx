"use client";
import Image from "next/image";
import { LiaStarSolid } from "react-icons/lia";
import SeasonPlaceholder from "../../images/MediaImagePlaceholder.jpg";
import Link from "next/link";
import { TvTypes } from "@/app/Types/TvTypes";
import { useState } from "react";

function Seasons({ mediaData }: { mediaData: TvTypes }) {
  const [loadedImages, setLoadedImages] = useState<{ [id: number]: boolean }>(
    {}
  );

  return (
    <div className="mt-9">
      <h1 className="text-2xl font-bold text-white">
        Seasons: {mediaData.number_of_seasons}
      </h1>
      <h1 className="text-2xl font-bold text-white mb-4">
        Total Episodes: {mediaData.number_of_episodes || 0}
      </h1>
      <div className="flex overflow-auto max-w-[900px] h-full gap-4">
        {mediaData.seasons.map((season) => {
          const isImageLoaded = loadedImages[season.id] || false;
          const imageSrc = season.poster_path
            ? `https://image.tmdb.org/t/p/original${season.poster_path}`
            : SeasonPlaceholder;

          return (
            <Link
              className="pb-4"
              key={season.id}
              href={`/tv/${mediaData.id}/season/${season.season_number}`}
            >
              <div className="h-full bg-blue min-w-[230px] rounded-lg p-2 pb-4">
                <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse z-10 rounded-lg" />
                  )}
                  <Image
                    src={imageSrc}
                    alt={`Season ${season.season_number}`}
                    height={700}
                    width={700}
                    className="w-full h-full object-cover rounded-lg"
                    onLoad={() =>
                      setLoadedImages((prev) => ({
                        ...prev,
                        [season.id]: true,
                      }))
                    }
                  />
                  <div className="absolute top-2 left-2 bg-blue text-white py-1 px-2 rounded-lg">
                    Season {season.season_number || 0}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mt-4">
                  {season.name}
                </h2>

                <p className="text-lg text-white mt-2">
                  Episodes: {season.episode_count || 0}
                  <span className="flex items-center space-x-2">
                    Rating: <LiaStarSolid className="text-yellow" />
                    <span>{season.vote_average || 0}</span>
                  </span>
                  {season.air_date && <> Air Date: {season.air_date}</>}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Seasons;
