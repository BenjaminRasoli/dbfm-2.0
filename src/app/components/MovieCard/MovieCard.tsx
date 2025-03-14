"use client";
import { MovieTypes } from "../../Types/MovieTypes";
import { FaRegBookmark } from "react-icons/fa";
import { RiStarSFill } from "react-icons/ri";
import { MovieCardTypes } from "./MovieCard.Types";
import Image from "next/image";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import poster from "../../images/poster-image.png";
import personPoster from "../../images/personPlaceHolder.jpg";

function MovieCard({ movies, loading }: MovieCardTypes) {
  return (
    <div className="grid grid-cols-1 place-items-center md:place-items-stretch sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 pt-10">
      {loading || loading === null
        ? Array.from({ length: 6 }, (_, index) => (
            <SkeletonLoader key={index} />
          ))
        : movies?.map((movie: MovieTypes) => (
            <div key={movie.id} className="rounded-lg w-[300px]">
              <div className="relative">
                <Image
                  src={
                    movie.media_type !== "person"
                      ? movie.poster_path === null
                        ? poster
                        : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : movie.profile_path === null
                      ? personPoster
                      : `https://image.tmdb.org/t/p/w500/${movie.profile_path}`
                  }
                  alt={movie.title || movie.name || "Unknown title"}
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
                    {movie.vote_average || 0}
                  </span>
                </div>

                <div className="mt-2">
                  <h3 className="text-xl font-semibold text-dark overflow-hidden text-ellipsis whitespace-nowrap">
                    {movie.title || movie.name || "Unknown name"}
                  </h3>
                </div>

                <p className="text-dark">
                  {movie.release_date || movie.first_air_date || "Unknown date"}
                </p>
              </div>
            </div>
          ))}
    </div>
  );
}

export default MovieCard;
