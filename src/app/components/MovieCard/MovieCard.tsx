import Image from "next/image";
import React from "react";
import { FaRegBookmark } from "react-icons/fa";
import { RiStarSFill } from "react-icons/ri";

function MovieCard({ movies }: { movies: MovieTypes[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-10">
      {movies?.map((movie: MovieTypes) => (
        <div key={movie.id} className="rounded-lg max-w-[300px]">
          <div className="relative">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              width={300}
              height={450}
              className="w-full h-[450px] object-cover rounded-lg"
            />

            <FaRegBookmark
              className="absolute top-0 left-0 text-light bg-dark rounded-tl-lg z-10 p-2"
              size={50}
            />
          </div>

          <div className="pb-4">
            <div className="flex mt-2">
              <span className="text-yellow-400">
                <RiStarSFill size={20} />
              </span>
              <span className="ml-1 text-sm text-dark">
                {movie.vote_average}
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-xl font-semibold text-dark overflow-hidden text-ellipsis whitespace-nowrap">
                {movie.title || movie.name}
              </h3>
            </div>

            <p className="text-dark">
              {movie.release_date || movie.first_air_date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieCard;
