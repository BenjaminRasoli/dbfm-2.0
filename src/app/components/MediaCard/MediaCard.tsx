"use client";
import { FaRegBookmark } from "react-icons/fa";
import { RiStarSFill } from "react-icons/ri";
import Image from "next/image";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import poster from "../../images/poster-image.png";
import personPoster from "../../images/personPlaceHolder.jpg";
import Link from "next/link";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { MediaCardTypes } from "@/app/Types/MediaCardTypes";

function MediaCard({ media, loading }: MediaCardTypes) {
  return (
    <div className="grid grid-cols-1 place-items-center md:place-items-stretch sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 pt-10">
      {loading || loading === null
        ? Array.from({ length: 6 }, (_, index) => (
            <SkeletonLoader key={index} />
          ))
        : media?.map((media: MediaTypes) => (
            <Link key={media.id} href={`/${media.media_type}/${media.id}`}>
              <div className="rounded-lg w-[300px]">
                <div className="relative">
                  <Image
                    src={
                      media.media_type !== "person"
                        ? media.poster_path === null
                          ? poster
                          : `https://image.tmdb.org/t/p/w500/${media.poster_path}`
                        : media.profile_path === null
                        ? personPoster
                        : `https://image.tmdb.org/t/p/w500/${media.profile_path}`
                    }
                    alt={media.title || media.name || "Unknown title"}
                    width={300}
                    height={450}
                    className="w-full h-auto object-cover rounded-lg"
                    priority
                  />
                  <FaRegBookmark
                    className="absolute top-0 left-0 bg-dark-100 text-white rounded-tl-lg z-10 p-2"
                    size={50}
                  />
                </div>

                <div className="pb-4">
                  <div className="flex mt-2">
                    <span className="text-yellow-400">
                      <RiStarSFill size={20} />
                    </span>
                    <span className="ml-1 text-sm text-dark">
                      {media.vote_average || 0}
                    </span>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-xl font-semibold text-dark overflow-hidden text-ellipsis whitespace-nowrap">
                      {media.title || media.name || "Unknown name"}
                    </h3>
                  </div>

                  <p className="text-dark">
                    {media.release_date ||
                      media.first_air_date ||
                      "Unknown date"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
}

export default MediaCard;
