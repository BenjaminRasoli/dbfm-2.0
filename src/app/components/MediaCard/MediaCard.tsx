"use client";
import { useState } from "react";
import { RiStarSFill } from "react-icons/ri";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { MediaCardTypes } from "@/app/Types/MediaCardTypes";
import Image from "next/image";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import MovieTvPlaceholder from "../../images/MediaImagePlaceholder.jpg";
import PersonPlaceholder from "../../images/PersonImagePlaceholder.jpg";
import Link from "next/link";
import HandleFavorites from "@/app/components/HandleFavorites/HandleFavorites";

function MediaCard({
  media,
  loading,
  favorites,
  setFavorites,
}: MediaCardTypes) {
  const [loadedImages, setLoadedImages] = useState<{ [id: number]: boolean }>(
    {}
  );

  return (
    <div className="grid grid-cols-1 2-cards:grid-cols-2 3-cards:grid-cols-3 4-cards:grid-cols-4 5-cards:grid-cols-5 gap-8 pt-10">
      {loading || !media || media.length === 0
        ? Array.from({ length: 12 }, (_, index) => (
            <SkeletonLoader key={index} />
          ))
        : media.map((media: MediaTypes) => {
            const isImageLoaded = loadedImages[media.id] || false;

            const imageSrc =
              media.media_type === "person" || media.known_for_department
                ? media.profile_path === null
                  ? PersonPlaceholder
                  : `https://image.tmdb.org/t/p/original/${media.profile_path}`
                : media.poster_path === null
                ? MovieTvPlaceholder
                : `https://image.tmdb.org/t/p/original/${media.poster_path}`;

            const href = media.media_type
              ? `/${media.media_type}/${media.id}`
              : media.known_for_department
              ? `/person/${media.id}`
              : `/movie/${media.id}`;

            return (
              <div key={media.id} className="relative">
                <HandleFavorites
                  media={media}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
                <Link href={href} className="block w-full h-full group">
                  <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-lg">
                    {!isImageLoaded && (
                      <div className="absolute inset-0 z-10 bg-gray-300 animate-pulse rounded-t-lg" />
                    )}
                    <Image
                      src={imageSrc}
                      alt={media.title || media.name || "Unknown title"}
                      width={700}
                      height={700}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out scale-100 group-hover:scale-110"
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [media.id]: true,
                        }))
                      }
                    />
                  </div>

                  <>
                    <div className="pb-4 p-2 shadow-2xl rounded-b-lg h-[120px]">
                      {media.media_type === "person" ||
                        (media.gender == null && (
                          <div className="flex mt-2">
                            <span className="text-yellow-400">
                              <RiStarSFill size={20} />
                            </span>
                            <span className="ml-1 text-sm">
                              {media.vote_average || 0}
                            </span>
                          </div>
                        ))}

                      <div className="mt-2">
                        <h3 className="text-xl font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                          {media.title || media.name || "Unknown name"}
                        </h3>
                      </div>
                      <div className="flex justify-between">
                        {media.media_type !== "person" &&
                          media.gender == null && (
                            <p>
                              {media.release_date ||
                                media.first_air_date ||
                                "Unknown date"}
                            </p>
                          )}

                        {media.media_type !== "person" &&
                          media.gender == null && (
                            <p className="text-gray-400 opacity-80">
                              (
                              {media.media_type
                                ? media.media_type.charAt(0).toUpperCase() +
                                  media.media_type.slice(1)
                                : "Movie"}
                              )
                            </p>
                          )}
                      </div>
                    </div>
                  </>
                </Link>
              </div>
            );
          })}
    </div>
  );
}

export default MediaCard;
