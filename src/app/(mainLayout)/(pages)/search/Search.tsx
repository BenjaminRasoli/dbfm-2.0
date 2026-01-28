"use client";
import { useEffect, useState } from "react";
import MovieFilters from "@/app/components/FilterAndDropDown/FilterAndDropDown";
import { MediaTypes } from "@/app/Types/MediaTypes";
import PageSelector from "@/app/components/PageSelector/PageSelector";
import QueryParams from "@/app/hooks/QueryParams";
import { handleStateChange } from "@/app/utils/HandleStateChange";
import { sortMedia } from "@/app/components/DropDown/DropDown";
import MediaCard from "@/app/components/MediaCard/MediaCard";
import EmptyState from "@/app/components/EmptyState/EmptyState";
import { IoIosHome } from "react-icons/io";

function Search() {
  const {
    page,
    sortOption,
    activeFilter,
    searchWord,
    setPage,
    setSortOption,
    setActiveFilter,
    initialized,
  } = QueryParams();

  const [media, setMedia] = useState<MediaTypes[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  useEffect(() => {
    if (!initialized) return;

    if (!searchWord.trim()) {
      setMedia([]);
      setSortedMedia([]);
      setLoading(false);
      setTotalResults(0);
      setTotalPages(1);
      setHasFetched(false);
      return;
    }

    setHasFetched(false);
    setMedia([]);
    setSortedMedia([]);
    setLoading(true);

    const fetchSearched = async () => {
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
              filter: activeFilter === "all" ? "multi" : activeFilter,
              page,
            }),
          },
        );
        const data = await movieRes.json();

        const updatedResults = data.results.map((item: MediaTypes) => ({
          ...item,
          media_type:
            item.media_type ??
            (item.release_date
              ? "movie"
              : item.first_air_date
                ? "tv"
                : "collection"),
        }));

        setTotalResults(data.total_results);
        setTotalPages(data.total_pages);
        setMedia(updatedResults);
      } catch (error) {
        setMedia([]);
        setSortedMedia([]);
        setTotalResults(0);
        setTotalPages(1);
        console.error(error);
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    fetchSearched();
  }, [searchWord, activeFilter, page, initialized]);

  useEffect(() => {
    if (media?.length > 0) {
      const sorted = sortMedia({ sortType: sortOption, media });
      setSortedMedia(sorted);
    }
  }, [sortOption, media]);

  return (
    <div className="p-7">
      <section className="border-b-1 border-gray-600 dark:border-gray-800">
        <div className="pb-5 flex flex-col md:flex-row max-w-[280px] md:max-w-full flex-wrap justify-between">
          <h1 className="text-blue text-3xl pb-5">Searched</h1>
          <h4 className="text-2xl max-w-[150px] md:max-w-full break-words whitespace-normal">
            Results for{" "}
            <span className="text-blue">
              {searchWord}
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
      {loading ? (
        <MediaCard media={sortedMedia} loading={true} />
      ) : hasFetched &&
        !loading &&
        initialized &&
        media?.length === 0 &&
        searchWord.trim() ? (
        <EmptyState
          title="No results found"
          description="We couldn't find anything matching your search."
          linkHref="/"
          linkText="Get Back Home"
          icon={<IoIosHome size={20} />}
        />
      ) : (
        <MediaCard media={sortedMedia} loading={false} />
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

export default Search;
