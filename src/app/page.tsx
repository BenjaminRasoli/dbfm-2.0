"use client";
import { useEffect, useState } from "react";
import { MovieTypes } from "./Types/MovieTypes";
import { sortMovie } from "./components/DropDown/DropDown";
import { handleStateChange } from "./utils/HandleStateChange";
import QueryParams from "./hooks/QueryParams";
import PageSelector from "./components/PageSelector/PageSelector";
import MovieFilters from "./components/FilterAndDropDown/FilterAndDropDown";
import MovieCard from "./components/MovieCard/MovieCard";

function Home() {
  const [totalPages, setTotalPages] = useState<number>(1);
  const [movies, setMovies] = useState<MovieTypes[]>([]);
  const [sortedMovies, setSortedMovies] = useState<MovieTypes[]>([]);
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
          `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/movies?type=${activeFilter}&page=${page}`
        );
        const data = await res.json();
        setMovies(data.results);
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
    if (movies?.length > 0) {
      const sorted = sortMovie({ sortType: sortOption, movies });
      setSortedMovies(sorted);
    }
  }, [sortOption, movies]);

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
      <MovieCard movies={sortedMovies} loading={loading} />
      <PageSelector
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => handleStateChange(setPage)(newPage, setPage)}
      />
    </div>
  );
}

export default Home;
