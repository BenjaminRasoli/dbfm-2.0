"use client";
import { useEffect, useState } from "react";
import MediaCard from "../components/MediaCard/MediaCard";
import MovieFilters from "../components/FilterAndDropDown/FilterAndDropDown";
import PageSelector from "../components/PageSelector/PageSelector";
import { handleStateChange } from "../utils/HandleStateChange";
import { MediaTypes } from "../Types/MediaTypes";
import { sortMedia } from "../components/DropDown/DropDown";
import QueryParams from "../hooks/QueryParams";

function Home() {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [media, setMedia] = useState<MediaTypes[]>([]);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<unknown>("");

  const {
    page,
    sortOption,
    activeFilter,
    setPage,
    setSortOption,
    setActiveFilter,
  } = QueryParams();

  useEffect(() => {
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized && activeFilter && page) {
      setLoading(true);
      setError("");

      const fetchMedia = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getMedias?type=${activeFilter}&page=${page}`
          );
          const data = await res.json();
          setMedia(data.results);
          setTotalPages(data.total_pages);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchMedia();
    }
  }, [activeFilter, page, initialized]);

  useEffect(() => {
    if (media?.length > 0) {
      const sorted = sortMedia({ sortType: sortOption, media });
      setSortedMedia(sorted);
    }
  }, [sortOption, media]);
  if (error) {
    return (
      <div className="p-7 text-center text-red">
        Failed to fetch: {String(error)}
      </div>
    );
  }
  return (
    <>
      <title>DBFM | Home</title>
      <div className="p-7">
        <h1 className="text-3xl text-blue pb-5">Trending</h1>
        <MovieFilters
          activeFilter={activeFilter}
          handleFilterChange={(value) =>
            handleStateChange(setActiveFilter, true)(value, setPage)
          }
          sortOption={sortOption}
          handleSortChange={(value) =>
            handleStateChange(setSortOption)(value, setPage)
          }
        />
        <MediaCard media={sortedMedia} loading={loading} />
        <PageSelector
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) =>
            handleStateChange(setPage)(newPage, setPage)
          }
        />
      </div>
    </>
  );
}

export default Home;
