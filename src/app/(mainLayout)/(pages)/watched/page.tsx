"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import { MediaTypes } from "@/app/Types/MediaTypes";
import MediaCard from "@/app/components/MediaCard/MediaCard";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/config/FireBaseConfig";
import MovieFilters from "@/app/components/FilterAndDropDown/FilterAndDropDown";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";
import { sortMedia } from "@/app/components/DropDown/DropDown";
import Link from "next/link";
import Loading from "@/app/components/Loading/Loading";

function Page() {
  const { user } = useUser();

  const [watched, setWatched] = useState<MediaTypes[]>([]);
  const [filteredWatched, setFilteredWatched] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);

  const { sortOption, activeFilter, setSortOption, setActiveFilter } =
    QueryParams();

  useEffect(() => {
    if (user) {
      fetchWatchedFromFirebase(user.uid);
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (watched.length >= 0) {
      const filtered = watched.filter((x) => {
        if (activeFilter && activeFilter !== "all") {
          return x.media_type === activeFilter;
        }
        return true;
      });
      setFilteredWatched(filtered);
    }
  }, [watched, activeFilter]);

  useEffect(() => {
    if (filteredWatched.length >= 0) {
      const sorted = sortMedia({
        sortType: sortOption,
        media: filteredWatched,
      });
      setSortedMedia(sorted);
    }
  }, [filteredWatched, sortOption, activeFilter]);

  const fetchWatchedFromFirebase = async (userId: string) => {
    setLoading(true);
    const q = query(collection(db, "userWatchedList", userId, "watched"));
    try {
      const querySnapshot = await getDocs(q);
      const fetchedWatchedList: MediaTypes[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data as MediaTypes;
      });

      const watchedRequests = fetchedWatchedList.map(
        async (media: MediaTypes) => {
          if (!media.media_type) {
            media.media_type = media.title ? "movie" : "tv";
          }
          const url = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getFavorites?media_type=${media.media_type}&id=${media.id}`;
          const res = await fetch(url);
          const data = await res.json();
          return {
            ...data,
            media_type: media.media_type,
          };
        }
      );

      const fetchedWatched = await Promise.all(watchedRequests);
      setWatched(fetchedWatched);
    } catch (error) {
      console.error("Error fetching watched list: ", error);
      setWatched([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>DBFM | Watched</title>
      <div className="p-7">
        <div className="flex flex-col md:flex-row justify-between pb-5">
          <h1 className="text-blue text-3xl">Watched</h1>

          {watched.length > 0 && (
            <h4 className="text-2xl">
              You have watched{" "}
              <span className="text-blue">{filteredWatched.length}</span>{" "}
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

        {watched.length > 0 && (
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
          <div className="flex justify-center items-center mt-15 min-h-[50dvh]">
            <Loading size={100} />
          </div>
        ) : filteredWatched.length === 0 ? (
          <div className="text-xl text-center pt-10">
            {activeFilter === "movie" ? (
              <p>No movies found in your watched list.</p>
            ) : activeFilter === "tv" ? (
              <p>No TV shows found in your watched list.</p>
            ) : (
              <div>
                {!user ? (
                  <div className="min-h-[40dvh] ">
                    <p>You must be logged in to view your watched list.</p>{" "}
                    <Link className="text-blue" href={"/login"}>
                      Login
                    </Link>
                  </div>
                ) : (
                  <div className="min-h-[40dvh] ">
                    <p>No watched items yet. Start watching something!</p>
                    <Link className="text-blue" href={"/"}>
                      Home
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <MediaCard
            media={sortedMedia}
            loading={loading}
            watched={watched}
            setWatched={setWatched}
          />
        )}
      </div>
    </>
  );
}

export default Page;
