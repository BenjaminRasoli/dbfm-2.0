"use client";
import CustomDropdown, { sortMedia } from "@/app/components/DropDown/DropDown";
import { useState, useEffect } from "react";
import PageSelector from "@/app/components/PageSelector/PageSelector";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";
import { MediaTypes } from "@/app/Types/MediaTypes";
import MediaCard from "@/app/components/MediaCard/MediaCard";
import { GenresClientProps } from "@/app/Types/GenresClientProps";

export default function GenresClient({
  initialMedia,
  initialTotalPages,
  initialGenreName,
  initialGenreSlug,
  initialPage,
}: GenresClientProps) {
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [media, setMedia] = useState<MediaTypes[]>(initialMedia);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { page, sortOption, setPage, setSortOption } = QueryParams();

  useEffect(() => {
    if (media?.length > 0) {
      const sorted = sortMedia({ sortType: sortOption, media });

      const sortedWithMediaType = sorted.map((item) => ({
        ...item,
        media_type: "movie",
      }));

      setSortedMedia(sortedWithMediaType);
    } else {
      setSortedMedia([]);
    }
  }, [sortOption, media]);

  useEffect(() => {
    if (page !== initialPage && initialGenreSlug) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const movieRes = await fetch(
            `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getGenreMovies?genre=${initialGenreSlug}&page=${page}`
          );
          const data = await movieRes.json();
          setMedia(data.results);
          setTotalPages(data.total_pages);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [page, initialPage, initialGenreSlug]);

  useEffect(() => {
    if (initialGenreName) {
      document.title = `DBFM | ${initialGenreName}`;
    }
  }, [initialGenreName]);

  return (
    <div className="p-7">
      <section className="border-b-1 border-gray-600 dark:border-gray-800">
        <h1 className="text-3xl max-w-xl text-blue pb-5">
          {initialGenreName && initialGenreName} Movies
        </h1>
        <div className="flex justify-end">
          <CustomDropdown
            options={[
              "A-Z",
              "Date",
              "Rating",
              "Z-A",
              "Date (Oldest)",
              "Rating (Lowest)",
            ]}
            selectedOption={
              sortOption === "standard"
                ? "Sort by"
                : sortOption === "Date"
                ? "Date"
                : sortOption === "Rating"
                ? "Rating"
                : sortOption === "Z-A"
                ? "Z-A"
                : sortOption === "Date (Oldest)"
                ? "Date (Oldest)"
                : sortOption === "Rating (Lowest)"
                ? "Rating (Lowest)"
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
