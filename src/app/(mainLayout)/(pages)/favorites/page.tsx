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
  const [favorites, setFavorites] = useState<MediaTypes[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);

  const { sortOption, activeFilter, setSortOption, setActiveFilter } =
    QueryParams();

  useEffect(() => {
    if (user) {
      fetchFavoritesFromFirebase(user.uid);
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (favorites.length >= 0) {
      const filtered = favorites.filter((x) => {
        if (activeFilter && activeFilter !== "all") {
          return x.media_type === activeFilter;
        }
        return true;
      });
      setFilteredFavorites(filtered);
    }
  }, [favorites, activeFilter]);

  useEffect(() => {
    if (filteredFavorites.length >= 0) {
      const sorted = sortMedia({
        sortType: sortOption,
        media: filteredFavorites,
      });
      setSortedMedia(sorted);
    }
  }, [filteredFavorites, sortOption, activeFilter]);

  const fetchFavoritesFromFirebase = async (userId: string) => {
    setLoading(true);
    const q = query(collection(db, "userFavoriteList", userId, "favorites"));
    try {
      const querySnapshot = await getDocs(q);
      const fetchedFavoritesList: MediaTypes[] = querySnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return data as MediaTypes;
        }
      );

      const favoriteRequests = fetchedFavoritesList.map(
        async (media: MediaTypes) => {
          if (!media.media_type) {
            if (media.title) {
              media.media_type = "movie";
            } else if (media.name) {
              media.media_type = "tv";
            }
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

      const fetchedFavorites = await Promise.all(favoriteRequests);
      setFavorites(fetchedFavorites);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>DBFM | Favorites</title>
      <div className="p-7">
        <div className="flex flex-col md:flex-row justify-between pb-5">
          <h1 className="text-blue text-3xl">Favorites</h1>
          {favorites.length > 0 && (
            <h4 className="text-2xl">
              You have favorited{" "}
              <span className="text-blue">{filteredFavorites.length}</span>{" "}
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
        {favorites.length > 0 && (
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
          <div className="flex justify-center items-center mt-15">
            <Loading size={100} />
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-xl text-center pt-10">
            {activeFilter === "movie" ? (
              <p>No movies found in your favorites.</p>
            ) : activeFilter === "tv" ? (
              <p>No TV shows found in your favorites.</p>
            ) : (
              <p>
                {!user
                  ? "You must be logged in to view your favorites."
                  : "No favorites yet. Start adding some"}
              </p>
            )}
            <Link className="text-blue" href={"/"}>
              Home
            </Link>
          </div>
        ) : (
          <MediaCard
            media={sortedMedia}
            loading={loading}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        )}
      </div>
    </>
  );
}

export default Page;
