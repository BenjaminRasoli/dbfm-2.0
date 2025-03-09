"use client";
import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard/MovieCard";
import { MovieTypes } from "./Types/MovieTypes";
import { sortMovie } from "./components/DropDown/DropDown";
import PageSelector from "./components/PageSelector/PageSelector";
import MovieFilters from "./components/FilterAndDropDown/FilterAndDropDown";

function Home() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<MovieTypes[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("standard");
  const [sortedMovies, setSortedMovies] = useState<MovieTypes[]>([]);

  useEffect(() => {
    const getMovies = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/movies?type=${activeFilter}&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    };
    getMovies();
  }, [page, activeFilter]);

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

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="p-7">
      <h1 className="text-3xl text-blue">Trending</h1>
      <MovieFilters
        activeFilter={activeFilter}
        handleFilterChange={handleFilterChange}
        sortOption={sortOption}
        handleSortChange={handleSortChange}
      />
      <MovieCard movies={sortedMovies} />
      <PageSelector
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Home;
