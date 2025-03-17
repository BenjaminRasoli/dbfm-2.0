"use client";
import CustomDropdown from "@/app/components/DropDown/DropDown";
import MovieCard from "@/app/components/MovieCard/MovieCard";
import { sortMovie } from "@/app/components/DropDown/DropDown";
import { useState, useEffect } from "react";
import { MoviesTypes } from "@/app/Types/MoviesTypes";
import PageSelector from "@/app/components/PageSelector/PageSelector";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";

function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<MoviesTypes[]>([]);
  const [genreName, setGenreName] = useState<string>("");
  const [sortedMovies, setSortedMovies] = useState<MoviesTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [genreSlug, setGenreSlug] = useState<string>("");

  const { page, sortOption, setPage, setSortOption } = QueryParams();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setGenreSlug(resolvedParams.slug);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!genreSlug) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const movieRes = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/genreMovies?genre=${genreSlug}&page=${page}`
        );
        const data = await movieRes.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);

        const genreRes = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/genres`
        );
        const genreData = await genreRes.json();

        const genre = genreData.genres.find(
          (genre: { id: number }) => genre.id === parseInt(genreSlug)
        );
        setGenreName(genre.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        await delay(1000);
        setLoading(false);
      }
    };

    fetchData();
  }, [genreSlug, page]);

  useEffect(() => {
    if (movies?.length > 0) {
      const sorted = sortMovie({ sortType: sortOption, movies });
      setSortedMovies(sorted);
    }
  }, [sortOption, movies]);

  return (
    <div className="p-7">
      <section className="border-b-1 border-gray-600">
        {genreName && (
          <h1 className="text-3xl text-blue">{genreName} Movies</h1>
        )}
        <div className="flex justify-end">
          {movies?.length === 0 ? null : (
            <CustomDropdown
              options={["A-Z", "Date", "Rating"]}
              selectedOption={
                sortOption === "standard"
                  ? "Sort by"
                  : sortOption === "Date"
                  ? "Date"
                  : sortOption === "Rating"
                  ? "Rating"
                  : "A-Z"
              }
              onSelect={(newSort) => setSortOption(newSort)}
              sortOption={sortOption}
            />
          )}
        </div>
      </section>
      <MovieCard movies={sortedMovies} loading={loading} />
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
  );
}

export default Page;
