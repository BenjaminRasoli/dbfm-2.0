"use client";
import CustomDropdown, { sortMedia } from "@/app/components/DropDown/DropDown";
import { useState, useEffect } from "react";
import PageSelector from "@/app/components/PageSelector/PageSelector";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";
import { MediaTypes } from "@/app/Types/MediaTypes";
import MediaCard from "@/app/components/MediaCard/MediaCard";

function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [totalPages, setTotalPages] = useState(1);
  const [media, setMedia] = useState<MediaTypes[]>([]);
  const [genreName, setGenreName] = useState<string>("");
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [genreSlug, setGenreSlug] = useState<string>("");

  const { page, sortOption, setPage, setSortOption } = QueryParams();

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
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getGenreMovies?genre=${genreSlug}&page=${page}`
        );
        const data = await movieRes.json();
        setMedia(data.results);
        setTotalPages(data.total_pages);

        const genreRes = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getNavbarGenres`
        );
        const genreData = await genreRes.json();

        const genre = genreData.genres.find(
          (genre: { id: number }) => genre.id === parseInt(genreSlug)
        );
        setGenreName(genre.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreSlug, page]);

  useEffect(() => {
    if (genreName) {
      document.title = `DBFM | ${genreName}`;
    }
  }, [genreName]);

  useEffect(() => {
    if (media?.length > 0) {
      const sorted = sortMedia({ sortType: sortOption, media });
      setSortedMedia(sorted);
    }
  }, [sortOption, media]);

  return (
    <div className="p-7">
      <section className="border-b-1 border-gray-600 dark:border-gray-800">
        <h1 className="text-3xl max-w-xl text-blue pb-5">
          {genreName && genreName} Movies
        </h1>
        <div className="flex justify-end">
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
            onSelect={(newSort: string) => setSortOption(newSort)}
            sortOption={sortOption}
          />
        </div>
      </section>
      <MediaCard media={sortedMedia} loading={loading} />
      {media?.length === 0 || loading ? null : (
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
