"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import { MediaTypes } from "@/app/Types/MediaTypes";
import MediaCard from "@/app/components/MediaCard/MediaCard";
import MovieFilters from "@/app/components/FilterAndDropDown/FilterAndDropDown";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";
import { sortMedia } from "@/app/components/DropDown/DropDown";
import Link from "next/link";
import Loading from "@/app/components/Loading/Loading";
import { MediaListClientProps } from "../../Types/MediaListClientProps";

export default function MediaListClient({
  initialMedia = [],
  type,
}: MediaListClientProps) {
  const { user } = useUser();
  const [mediaList, setMediaList] = useState<MediaTypes[]>(initialMedia);
  const [filteredMedia, setFilteredMedia] = useState<MediaTypes[]>(
    initialMedia.length > 0 ? initialMedia : []
  );
  const [loading, setLoading] = useState<boolean>(initialMedia.length === 0);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);

  const { sortOption, activeFilter, setSortOption, setActiveFilter } =
    QueryParams();

  useEffect(() => {
    if (initialMedia.length === 0 || !user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [initialMedia.length, user]);

  useEffect(() => {
    if (!user) {
      setMediaList([]);
      setFilteredMedia([]);
      setSortedMedia([]);
    }
  }, [user]);

  useEffect(() => {
    if (mediaList.length >= 0) {
      const filtered = mediaList.filter((x) => {
        if (activeFilter && activeFilter !== "all") {
          return x.media_type === activeFilter;
        }
        return true;
      });
      setFilteredMedia(filtered);
    }
  }, [mediaList, activeFilter]);

  useEffect(() => {
    if (filteredMedia.length >= 0) {
      const sorted = sortMedia({
        sortType: sortOption,
        media: filteredMedia,
      });
      setSortedMedia(sorted);
    }
  }, [filteredMedia, sortOption, activeFilter]);

  const title = type === "favorites" ? "Favorites" : "Watched";

  return (
    <>
      <title>DBFM | {title}</title>
      <div className="p-7">
        <div className="flex flex-col md:flex-row justify-between pb-5">
          <h1 className="text-blue text-3xl">{title}</h1>

          {mediaList.length > 0 && (
            <h4 className="text-2xl">
              You have {type === "favorites" ? "favorited" : "watched"}{" "}
              <span className="text-blue">{filteredMedia.length}</span>{" "}
              {(() => {
                switch (activeFilter) {
                  case "all":
                    return (
                      <>
                        <br className="block md:hidden" />
                        Movies/Tv-Shows
                      </>
                    );
                  case "movie":
                    return "Movies";
                  case "tv":
                    return "Tv-Shows";
                  default:
                    return "Movies/Tv-Shows";
                }
              })()}
            </h4>
          )}
        </div>

        {mediaList.length > 0 && (
          <MovieFilters
            activeFilter={activeFilter}
            handleFilterChange={(value) =>
              handleStateChange(setActiveFilter, true)(value)
            }
            sortOption={sortOption}
            handleSortChange={(value) =>
              handleStateChange(setSortOption, false)(value)
            }
          />
        )}

        {loading ? (
          <div className="flex justify-center items-center mt-15 min-h-[70dvh]">
            <Loading size={100} />
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-xl text-center pt-10 min-h-[70dvh]">
            <div>
              {!user ? (
                <div className="min-h-[40dvh] ">
                  <p>
                    You must be logged in to view your {title.toLowerCase()}{" "}
                    list.
                  </p>{" "}
                  <Link className="text-blue" href={"/login"}>
                    Login
                  </Link>
                </div>
              ) : (
                <div className="min-h-[70dvh]">
                  <p>No {title.toLowerCase()} yet. Start adding some</p>
                  <Link className="text-blue" href={"/"}>
                    Home
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <MediaCard
            media={sortedMedia}
            loading={loading}
            {...(type === "favorites"
              ? { favorites: mediaList, setFavorites: setMediaList }
              : { watched: mediaList, setWatched: setMediaList })}
          />
        )}
      </div>
    </>
  );
}
