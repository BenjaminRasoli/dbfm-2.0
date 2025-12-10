"use client";
import { useEffect, useState } from "react";
import MovieFilters from "@/app/components/FilterAndDropDown/FilterAndDropDown";
import { MediaTypes } from "@/app/Types/MediaTypes";
import PageSelector from "@/app/components/PageSelector/PageSelector";
import Link from "next/link";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";
import { sortMedia } from "@/app/components/DropDown/DropDown";
import MediaCard from "@/app/components/MediaCard/MediaCard";
import { SearchClientProps } from "@/app/Types/SearchClientProps";

export default function SearchClient({
  initialMedia,
  initialTotalResults,
  initialTotalPages,
  initialSearchWord,
  initialActiveFilter,
  initialPage,
}: SearchClientProps) {
  const [media, setMedia] = useState<MediaTypes[]>(initialMedia);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
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

  useEffect(() => {
    if (media?.length > 0) {
      const sorted = sortMedia({ sortType: sortOption, media });
      setSortedMedia(sorted);
    } else {
      setSortedMedia([]);
    }
  }, [sortOption, media]);

  // Update media when searchWord, activeFilter, or page changes
  useEffect(() => {
    if (
      (searchWord !== initialSearchWord ||
        activeFilter !== initialActiveFilter ||
        page !== initialPage) &&
      searchWord.trim()
    ) {
      setMedia([]);
      setLoading(true);

      const fetchSearched = async () => {
        if (!searchWord.trim()) {
          setMedia([]);
          setLoading(false);
          return;
        }
        try {
          const movieRes = await fetch(
            `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSearched`,
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

          const updatedResults = data.results.map((item: MediaTypes) => ({
            ...item,
            ...(activeFilter === "movie" || activeFilter === "tv"
              ? { media_type: activeFilter }
              : {}),
          }));

          setTotalResults(data.total_results);
          setTotalPages(data.total_pages);
          setMedia(updatedResults);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchSearched();
    }
  }, [
    searchWord,
    activeFilter,
    page,
    initialSearchWord,
    initialActiveFilter,
    initialPage,
  ]);

  useEffect(() => {
    if (searchWord) {
      document.title = `DBFM | ${searchWord}`;
    }
  }, [searchWord]);

  return (
    <div className="p-7">
      <section className="border-b-1 border-gray-600 dark:border-gray-800">
        <div className="pb-5 flex flex-col md:flex-row max-w-[280px] md:max-w-full flex-wrap justify-between">
          <h1 className="text-blue text-3xl pb-5">Searched</h1>
          <h4 className="text-2xl max-w-[150px] md:max-w-full break-words whitespace-normal">
            Results for{" "}
            <span className="text-blue">
              {searchWord || initialSearchWord}
              <br className="block md:hidden" />
            </span>{" "}
            ({totalResults} found)
          </h4>
        </div>

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
      </section>
      {!loading && media?.length === 0 ? (
        <div className="text-xl text-center pt-10 grid items-center justify-center">
          <h2>No Results Found</h2>
          <h2 className="text-blue">
            <Link href="/">Back Home</Link>
          </h2>
        </div>
      ) : (
        <MediaCard media={sortedMedia} loading={loading} />
      )}
      <div>
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
    </div>
  );
}
