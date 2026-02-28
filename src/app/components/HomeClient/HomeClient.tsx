"use client";
import { useEffect, useState } from "react";
import QueryParams from "../../hooks/QueryParams";
import { MediaTypes } from "../../Types/MediaTypes";
import { sortMedia } from "../DropDown/DropDown";
import Banner from "../Banner/Banner";
import MediaCard from "../MediaCard/MediaCard";
import MovieFilters from "../FilterAndDropDown/FilterAndDropDown";
import PageSelector from "../PageSelector/PageSelector";
import { handleStateChange } from "../../utils/HandleStateChange";

export default function HomeClient({
  bannerBackdrop,
}: {
  bannerBackdrop: string | null;
}) {
  const [media, setMedia] = useState<MediaTypes[]>([]);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [banner] = useState(bannerBackdrop);

  const {
    page,
    sortOption,
    activeFilter,
    setPage,
    setSortOption,
    setActiveFilter,
  } = QueryParams();

  useEffect(() => {
    if (!activeFilter || !page) return;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setMedia([]);
        setSortedMedia([]);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getMedias?type=${activeFilter}&page=${page}`
        );
        const data = await res.json();

        setMedia(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [activeFilter, page]);

  useEffect(() => {
    setSortedMedia(sortMedia({ sortType: sortOption, media }));
  }, [sortOption, media]);

  return (
    <>
      <Banner backdropPath={banner} />
      <div className="p-7">
        <h1 className="text-3xl text-blue pt-5">Trending</h1>
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
        <MediaCard media={sortedMedia} loading={loading} />
        <PageSelector
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) =>
            handleStateChange(setPage)(newPage, setPage)
          }
        />
      </div>
    </>
  );
}
