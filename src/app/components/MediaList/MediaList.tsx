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
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const FavOrWatch = type === "favorites" ? "Favorites" : "Watched";
        const res = await fetch(`/api/get${FavOrWatch}`);
        const favs: MediaTypes[] = await res.json();
        setMediaList(favs);
        setFilteredMedia(favs);
        setSortedMedia(favs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, type]);

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
                <div className="flex flex-col items-center justify-center min-h-[30dvh] text-center p-8 space-y-4">
                  <h2 className="pt-10 text-2xl font-bold text-blue">
                    You must be logged in
                  </h2>
                  <p className="text-black dark:text-white">
                    to view your {title.toLowerCase()} list.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href="/login"
                      className="bg-blue hover:bg-blue-hover text-white px-4 py-2 rounded-lg transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-blue hover:bg-blue-hover text-white px-4 py-2 rounded-lg transition"
                    >
                      Register
                    </Link>
                  </div>
                  <p className="text-gray-800 dark:text-gray-400 mt-2">
                    Start saving your favorite movies and shows!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[30dvh] text-center p-8 space-y-4">
                  <h2 className="text-2xl font-bold text-blue">
                    No {title.toLowerCase()} yet!
                  </h2>
                  <p className="text-black dark:text-white">
                    Start adding some to keep track of your favorites or watched
                    shows.
                  </p>
                  <Link
                    href="/"
                    className="bg-blue hover:bg-blue-hover text-white px-6 py-3 rounded-lg font-medium transition"
                  >
                    Go Home
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
