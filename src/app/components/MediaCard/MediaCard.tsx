import { RiStarSFill } from "react-icons/ri";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { MediaCardTypes } from "@/app/Types/MediaCardTypes";
import Image from "next/image";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import MovieTvPlaceHolder from "../../images/poster-image.png";
import PersonPlaceHolder from "../../images/personposter.jpg";
import Link from "next/link";
import HandleFavorites from "@/app/components/HandleFavorites/HandleFavorites";

function MediaCard({
  media,
  loading,
  favorites,
  setFavorites,
}: MediaCardTypes) {
  return (
    <>
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 custom:grid-cols-3 2xl:grid-cols-4 gap-5 pt-10">
        {loading || !media || media.length === 0
          ? Array.from({ length: 6 }, (_, index) => (
              <SkeletonLoader key={index} />
            ))
          : media?.map((media: MediaTypes) => (
              <div key={media.id} className="w-[300px] h-[580px] mb-3 relative">
                <Link
                  href={
                    media.media_type
                      ? `/${media.media_type}/${media.id}`
                      : media.known_for_department
                      ? `/person/${media.id}`
                      : `/movie/${media.id}`
                  }
                  className="block w-full h-full group"
                >
                  <div className="relative w-full h-[400px] overflow-hidden rounded-t-lg">
                    <Image
                      src={
                        media.media_type === "person" ||
                        media.known_for_department
                          ? media.profile_path === null
                            ? PersonPlaceHolder
                            : `https://image.tmdb.org/t/p/original/${media.profile_path}`
                          : media.poster_path === null
                          ? MovieTvPlaceHolder
                          : `https://image.tmdb.org/t/p/original/${media.poster_path}`
                      }
                      alt={media.title || media.name || "Unknown title"}
                      width={700}
                      height={700}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out scale-100 group-hover:scale-110"
                      priority
                    />
                  </div>

                  <div className="pb-4 p-2 shadow-2xl rounded-b-lg h-[120px]">
                    {media.media_type !== "person" && (
                      <div className="flex mt-2">
                        <span className="text-yellow-400">
                          <RiStarSFill size={20} />
                        </span>
                        <span className="ml-1 text-sm ">
                          {media.vote_average || 0}
                        </span>
                      </div>
                    )}

                    <div className="mt-2">
                      <h3 className="text-xl font-semibold  overflow-hidden text-ellipsis whitespace-nowrap">
                        {media.title || media.name || "Unknown name"}
                      </h3>
                    </div>
                    <div className="flex justify-between">
                      <p>
                        {media.media_type !== "person" &&
                          (media.release_date ||
                            media.first_air_date ||
                            "Unknown date")}
                      </p>
                      <p className="text-gray-400 opacity-80">
                        {media.media_type !== "person" && (
                          <>
                            {"("}
                            {media.media_type
                              ? media.media_type.charAt(0).toUpperCase() +
                                media.media_type.slice(1)
                              : "Movie"}
                            {")"}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>

                <HandleFavorites
                  media={media}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </div>
            ))}
      </div>
    </>
  );
}

export default MediaCard;
