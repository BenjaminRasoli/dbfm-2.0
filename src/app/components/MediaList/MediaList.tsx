"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { handleStateChange } from "@/app/utils/HandleStateChange";
import { sortMedia } from "@/app/components/DropDown/DropDown";
import { MediaListClientProps } from "../../Types/MediaListClientProps";
import Link from "next/link";
import MediaCard from "@/app/components/MediaCard/MediaCard";
import MovieFilters from "@/app/components/FilterAndDropDown/FilterAndDropDown";
import QueryParams from "@/app/hooks/QueryParams";
import Loading from "@/app/components/Loading/Loading";
import PageSelector from "../PageSelector/PageSelector";
import JsonModal from "../JsonModal/JsonModal";

export default function MediaListClient({ type }: MediaListClientProps) {
  const { user } = useUser();
  type ImportStatus = "idle" | "importing" | "success" | "error";

  const [mediaList, setMediaList] = useState<MediaTypes[]>([]);
  const [sortedMedia, setSortedMedia] = useState<MediaTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [importStatus, setImportStatus] = useState<ImportStatus>("idle");
  const [importError, setImportError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const totalPages = Math.ceil(total / 12);

  const {
    page,
    setPage,
    sortOption,
    activeFilter,
    setSortOption,
    setActiveFilter,
  } = QueryParams();

  const fetchFavorites = async () => {
    if (user === undefined) return;

    if (user === null) {
      setMediaList([]);
      setSortedMedia([]);
      setTotal(0);
    }

    setLoading(true);
    try {
      const FavOrWatch = type === "favorites" ? "Favorites" : "Watched";
      const params = new URLSearchParams({
        page: page.toString(),
        type: activeFilter,
      });

      const res = await fetch(`/api/get${FavOrWatch}?${params}`);
      const { data, total } = await res.json();

      setMediaList(data);
      setTotal(total);
      setSortedMedia(sortMedia({ sortType: sortOption, media: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, type, page, activeFilter, sortOption]);

  useEffect(() => {
    if (importStatus === "success") {
      fetchFavorites();
    }
  }, [importStatus, fetchFavorites]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  useEffect(() => {
    const sorted = sortMedia({
      sortType: sortOption,
      media: mediaList,
    });
    setSortedMedia(sorted);
  }, [mediaList, sortOption]);

  useEffect(() => {
    if (user === null) {
      setMediaList([]);
      setSortedMedia([]);
      setTotal(0);
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);

    try {
      setImportStatus("importing");

      const text = await file.text();

      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch {
        setImportStatus("error");
        setImportError("Invalid JSON");
        return;
      }

      const FavOrWatch = type === "favorites" ? "favorites" : "watched";

      const res = await fetch("/api/importMedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: FavOrWatch, data: jsonData }),
      });

      if (!res.ok) {
        setImportStatus("error");
        setImportError("Something went wrong");
        return;
      }

      await res.json();

      setImportStatus("success");
      if (user) setPage(1);
    } catch (err) {
      console.error(err);
      setImportStatus("error");
      setImportError("Something went wrong");
    } finally {
      input.value = "";
    }
  };

  useEffect(() => {
    if (importStatus === "success") {
      const t = setTimeout(() => {
        setImportStatus("idle");
        setImportError(null);
      }, 3000);
      return () => clearTimeout(t);
    }

    if (importStatus === "error") {
      const t = setTimeout(() => {
        setImportStatus("idle");
        setImportError(null);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [importStatus]);

  const title = type === "favorites" ? "Favorites" : "Watched";

  return (
    <>
      <title>DBFM | {title}</title>
      <div className="p-7">
        <div className="flex flex-col md:flex-row justify-between pb-5">
          <h1 className="text-blue text-3xl">{title}</h1>

          <h4 className="text-2xl">
            You have {type === "favorites" ? "favorited" : "watched"}{" "}
            <span className="text-blue">{total}</span>{" "}
            {activeFilter === "movie"
              ? "Movies"
              : activeFilter === "tv"
              ? "Tv-Shows"
              : "Movies/Tv-Shows"}
          </h4>
        </div>
        {user && (
          <div className="flex justify-end gap-3 items-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-6 h-6 cursor-pointer flex items-center justify-center border border-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              ?
            </button>

            <label
              className={`
      px-4 py-2 rounded-lg cursor-pointer transition
      ${
        importStatus === "importing"
          ? "bg-gray-400 cursor-not-allowed pointer-events-none"
          : importStatus === "success"
          ? "bg-green-500"
          : importStatus === "error"
          ? "bg-red-500"
          : "bg-blue hover:bg-blue-hover"
      }
      text-white
    `}
            >
              {importStatus === "importing"
                ? "Importing..."
                : importStatus === "success"
                ? "Import successful"
                : importStatus === "error"
                ? importError ?? "Invalid file"
                : "Import media"}

              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={importStatus === "importing"}
              />
            </label>
          </div>
        )}

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

        {user === undefined || loading ? (
          <div className="flex justify-center items-center mt-15 min-h-[70dvh]">
            <Loading size={100} />
          </div>
        ) : !loading && sortedMedia.length === 0 ? (
          <div className="text-xl text-center pt-10 min-h-[70dvh]">
            {user === null ? (
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-bold text-blue">
                  You must be logged in
                </h2>
                <p>to view your {title.toLowerCase()} list.</p>
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    className="bg-blue hover:bg-blue-hover text-white px-4 py-2 rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue hover:bg-blue-hover text-white px-4 py-2 rounded-lg transition"
                  >
                    Register
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-2xl font-bold text-blue">
                  No {title.toLowerCase()} yet!
                </h2>
                <Link
                  href="/"
                  className="bg-blue hover:bg-blue-hover text-white px-4 py-2 rounded-lg transition"
                >
                  Home
                </Link>
                <h2 className="text-xl font-bold text-gray-400">
                  Start adding some of your favorite content
                </h2>
              </div>
            )}
          </div>
        ) : (
          <>
            <MediaCard
              media={sortedMedia}
              loading={loading}
              {...(type === "favorites"
                ? { favorites: mediaList, setFavorites: setMediaList }
                : { watched: mediaList, setWatched: setMediaList })}
            />

            {totalPages > 1 && (
              <PageSelector
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) =>
                  handleStateChange(setPage)(newPage, setPage)
                }
              />
            )}
          </>
        )}
      </div>

      <JsonModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
