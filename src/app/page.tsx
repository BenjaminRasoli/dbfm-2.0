"use client";
import { useEffect, useState } from "react";
import { MediaTypes } from "./Types/MediaTypes";
import { handleStateChange } from "./utils/HandleStateChange";
import QueryParams from "./hooks/QueryParams";
import PageSelector from "./components/PageSelector/PageSelector";
import MovieFilters from "./components/FilterAndDropDown/FilterAndDropDown";
import { sortMedia } from "./components/DropDown/DropDown";
import MediaCard from "./components/MediaCard/MediaCard";

function Home() {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [media, setMedia] = useState<MediaTypes[]>([]);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<unknown>("");
  const {
    page,
    sortOption,
    activeFilter,
    setPage,
    setSortOption,
    setActiveFilter,
  } = QueryParams();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setLoading(true);
    setError("");
    const getMovies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/getMedias?type=${activeFilter}&page=${page}`
        );
        const data = await res.json();
        setMedia(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        setError(error);
      } finally {
        await delay(1000);
        setLoading(false);
      }
    };

    getMovies();
  }, [page, activeFilter]);

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
    <div className="p-7">
      <h1 className="text-3xl text-blue">Trending</h1>
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
        onPageChange={(newPage) => handleStateChange(setPage)(newPage, setPage)}
      />
    </div>
  );
}

export default Home;
