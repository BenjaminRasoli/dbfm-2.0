"use client";
import { useEffect, useState } from "react";
import MovieFilters from "@/app/components/FilterAndDropDown/FilterAndDropDown";
import MovieCard from "@/app/components/MovieCard/MovieCard";
import { MoviesTypes } from "@/app/Types/MoviesTypes";
import PageSelector from "@/app/components/PageSelector/PageSelector";
import { sortMovie } from "@/app/components/DropDown/DropDown";
import Link from "next/link";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";

function Page() {
  const [movies, setMovies] = useState<MoviesTypes[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortedMovies, setSortedMovies] = useState<MoviesTypes[]>([]);
  const [loading, setLoading] = useState<boolean | null>(null);

  const {
    page,
    sortOption,
    activeFilter,
    searchWord,
    setPage,
    setSortOption,
    setActiveFilter,
  } = QueryParams();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    setMovies([]);
    setLoading(true);

    const fetchSearched = async () => {
      if (!searchWord.trim()) {
        setMovies([]);
        setLoading(false);
        return;
      }
      try {
        const movieRes = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/searched`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              searchWord,
              filter: activeFilter,
              page,
            }),
          }
        );
        const data = await movieRes.json();
        console.log(data);
        setTotalResults(data.total_results);
        setTotalPages(data.total_pages);
        setMovies(data.results);
      } catch (error) {
        console.log(error);
      } finally {
        await delay(1000);
        setLoading(false);
      }
    };

    fetchSearched();
  }, [searchWord, activeFilter, page]);

  useEffect(() => {
    if (movies?.length > 0) {
      const sorted = sortMovie({ sortType: sortOption, movies });
      setSortedMovies(sorted);
    }
  }, [sortOption, movies]);

  return (
    <div className="p-7">
      <section className="border-b-1 border-gray-600">
        <div className="flex justify-between">
          <h1 className="text-blue text-3xl pb-5">Searched</h1>
          <h4 className="text-2xl">
            Results for <span className="text-blue">{searchWord}</span> (
            {totalResults} found)
          </h4>
        </div>
        {movies?.length > 0 && (
          <MovieFilters
            activeFilter={activeFilter}
            handleFilterChange={(value) =>
              handleStateChange(setActiveFilter, true)(value, setPage)
            }
            sortOption={sortOption}
            handleSortChange={(value) =>
              handleStateChange(setSortOption, false)(value, setPage)
            }
          />
        )}
      </section>
      {!loading && movies?.length === 0 ? (
        <div className="text-xl text-center pt-10 grid items-center justify-center">
          <h2 className="text-dark">No Results Found</h2>
          <h2 className="text-blue">
            <Link href="/">Back Home</Link>
          </h2>
        </div>
      ) : (
        <MovieCard movies={sortedMovies} loading={loading} />
      )}
      <div>
        {movies?.length === 0 || loading ? null : (
          <PageSelector
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) =>
              handleStateChange(setPage, false)(newPage, setPage)
            }
          />
        )}
      </div>
    </div>
  );
}

export default Page;
