"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { useEffect, useState } from "react";
import { fetchFilter } from "./Page.Functions";
import FilterButtons from "./components/FilterButtons/FilterButtons";
import MovieCard from "./components/MovieCard/MovieCard";
import { MovieTypes } from "./Types/MovieTypes";

function Home() {
  const [movies, setMovies] = useState<MovieTypes[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  useEffect(() => {
    const getMovies = async () => {
      const res = await fetch("http://localhost:3000/api/movies");
      const data = await res.json();
      setMovies(data.results);
    };
    getMovies();
  }, []);

  const handleFilterChange = (filter: string) => {
    fetchFilter(filter, setMovies, setActiveFilter);
  };

  return (
    <div className="p-7">
      <h1 className="text-xl">Trending</h1>
      <section className="border-b-1 border-light  pt-5">
        <FilterButtons
          activeFilter={activeFilter}
          handleFilterChange={handleFilterChange}
        />
      </section>
      <MovieCard movies={movies} />
    </div>
  );
}

export default Home;
