"use client";
import { useEffect, useState } from "react";
import { handleStateChange } from "../../utils/HandleStateChange";
import { MediaTypes } from "../../Types/MediaTypes";
import { sortMedia } from "../DropDown/DropDown";
import { HomeClientProps } from "../../Types/HomeClientProps";
import QueryParams from "../../hooks/QueryParams";
import Banner from "../Banner/Banner";
import MediaCard from "../MediaCard/MediaCard";
import MovieFilters from "../FilterAndDropDown/FilterAndDropDown";
import PageSelector from "../PageSelector/PageSelector";

export default function HomeClient({
  initialMedia,
  initialTotalPages,
  initialActiveFilter,
  initialPage,
  bannerBackdrop,
}: HomeClientProps) {
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [media, setMedia] = useState<MediaTypes[]>(initialMedia);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [banner, setBanner] = useState<string | null>(bannerBackdrop);

  useEffect(() => {
    setBanner(bannerBackdrop);
  }, []);

  const {
    page,
    sortOption,
    activeFilter,
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

  useEffect(() => {
    if (
      (activeFilter !== initialActiveFilter || page !== initialPage) &&
      activeFilter &&
      page
    ) {
      setLoading(true);
      const fetchMedia = async () => {
        try {
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
    }
  }, [activeFilter, page, initialActiveFilter, initialPage]);

  return (
    <>
      <title>DBFM | Home</title>
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
