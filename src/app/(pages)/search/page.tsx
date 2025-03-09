"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MovieFilters from "@/app/components/FilterAndDropDown/FilterAndDropDown";
import MovieCard from "@/app/components/MovieCard/MovieCard";
import { MovieTypes } from "@/app/Types/MovieTypes";
import PageSelector from "@/app/components/PageSelector/PageSelector";
import { sortMovie } from "@/app/components/DropDown/DropDown";

const Page = () => {
  const [movies, setMovies] = useState<MovieTypes[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>("multi");
  const [page, setPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>("standard");
  const [sortedMovies, setSortedMovies] = useState<MovieTypes[]>([]);

  const searchWord = useSearchParams().get("query");

  useEffect(() => {
    const fetchSearched = async () => {
      const movieRes = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/searched`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchWord, filter: activeFilter, page }),
        }
      );
      const data = await movieRes.json();
      setTotalResults(data.total_results);
      setTotalPages(data.total_pages);
      setMovies(data.results);
    };

    if (searchWord) {
      fetchSearched();
    }
  }, [searchWord, activeFilter, page]);

  useEffect(() => {
    if (movies.length > 0) {
      const sorted = sortMovie(sortOption, movies);
      setSortedMovies(sorted);
    }
  }, [sortOption, movies]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
  };

  return (
    <div className="p-7">
      <section className="border-b-1 border-gray-600">
        <div className="flex justify-between">
          <h1 className="text-blue text-3xl pb-5">Searched movies</h1>
          <h4 className="text-2xl">
            Results for <span className="text-blue">{searchWord}</span> (
            {totalResults} found)
          </h4>
        </div>
        <MovieFilters
          activeFilter={activeFilter}
          handleFilterChange={handleFilterChange}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
        />
      </section>
      <MovieCard movies={sortedMovies} />
      <div>
        <PageSelector
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Page;
