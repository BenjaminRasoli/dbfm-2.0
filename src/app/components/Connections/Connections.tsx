"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmptyState from "@/app/components/EmptyState/EmptyState";
import { FiLogIn } from "react-icons/fi";
import LogoutModal from "@/app/components/LogoutModal/LogoutModal";
import MovieTvPlaceholder from "../../images/MediaImagePlaceholder.jpg";
import TraktLogo from "../../images/TraktLogo.webp";
import Image from "next/image";
import Loading from "@/app/components/Loading/Loading";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/config/FireBaseConfig";
import { MediaTypes } from "@/app/Types/MediaTypes";

interface TraktUser {
  username: string;
  name: string;
  avatar: string;
  ids: {
    slug: string;
  };
}

function Connections() {
  const { user } = useUser();
  const [traktUser, setTraktUser] = useState<TraktUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traktToken, setTraktToken] = useState<string | null>(null);
  const [history, setHistory] = useState<any[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [initialHistoryLoading, setInitialHistoryLoading] = useState(true);
  const [tmdbDetails, setTmdbDetails] = useState<Record<string, any>>({});
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [importingAll, setImportingAll] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const router = useRouter();

  const getTraktToken = async (): Promise<string | null> => {
    if (traktToken) return traktToken;
    if (!user?.uid) return null;

    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) return null;

    const traktData = docSnap.data()?.trakt;
    return traktData?.token || null;
  };

  const getTraktRefreshToken = async (): Promise<string | null> => {
    if (!user?.uid) return null;

    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) return null;

    const traktData = docSnap.data()?.trakt;
    return traktData?.refresh || null;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("trakt_token");
    const userJson = params.get("trakt_user");
    const refresh = params.get("trakt_refresh");

    if (!user?.uid) {
      setLoadingUser(false);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    const saveToFirebase = async () => {
      if (token && userJson) {
        await setDoc(
          userDocRef,
          {
            trakt: {
              token,
              refresh,
              user: JSON.parse(userJson),
            },
          },
          { merge: true },
        );
        setTraktToken(token);
        setTraktUser(JSON.parse(userJson));
        window.history.replaceState({}, document.title, "/connections");
      } else {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const traktData = docSnap.data()?.trakt;
          if (traktData) {
            setTraktToken(traktData.token);
            setTraktUser(traktData.user);
          }
        }
      }
      setLoadingUser(false);
    };

    saveToFirebase();
  }, [user?.uid]);

  const fetchHistoryPage = async (pageNum: number) => {
    try {
      setHistoryLoading(true);
      const token = await getTraktToken();
      if (!token) {
        setError("Trakt token missing. Please connect your Trakt account.");
        return [];
      }

      const res = await fetch("/api/trakt/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: token,
          syncType: "history",
          page: pageNum,
          limit: 20,
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Failed to fetch history");

      const itemsWithTmdb: any[] = (payload || [])
        .map((item: any) => {
          const tmdbId =
            item.movie?.ids?.tmdb ||
            item.show?.ids?.tmdb ||
            item.episode?.ids?.tmdb;
          const mediaType = item.movie
            ? "movie"
            : item.show
              ? "tv"
              : item.episode
                ? "tv"
                : null;
          return tmdbId && mediaType ? { id: tmdbId, type: mediaType } : null;
        })
        .filter(Boolean);

      const toPrefetch = itemsWithTmdb.slice(0, 100);
      const concurrency = 6;
      for (let i = 0; i < toPrefetch.length; i += concurrency) {
        const chunk = toPrefetch.slice(i, i + concurrency);
        await Promise.all(
          chunk.map(async (it: any) => {
            try {
              if (tmdbDetails[String(it.id)]) return;
              const r = await fetch(
                `/api/getSingleMovieOrTv?id=${it.id}&type=${it.type}`,
              );
              if (!r.ok) return;
              const json = await r.json();
              setTmdbDetails((prev) => ({ ...prev, [String(it.id)]: json }));
            } catch (e) {
              console.error(e);
            }
          }),
        );
      }

      return payload || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
      return [];
    } finally {
      setHistoryLoading(false);
    }
  };

  const refreshAccess = async (refreshToken: string) => {
    try {
      const r = await fetch("/api/trakt/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Refresh failed");
      if (j.access_token && user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          {
            trakt: {
              token: j.access_token,
              refresh: j.refresh_token,
            },
          },
          { merge: true },
        );
        setTraktToken(j.access_token);
        return j.access_token;
      }
      return null;
    } catch (e) {
      console.error("refreshAccess error", e);
      return null;
    }
  };

  const handleImportAll = async () => {
    if (!user?.uid) {
      setError("You must be logged in to import");
      return;
    }
    const token = await getTraktToken();
    if (!token) {
      setError("Trakt token missing. Please connect your Trakt account.");
      return [];
    }

    try {
      setImportingAll(true);
      setImportResult(null);
      setError(null);

      const res = await fetch("/api/trakt/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: token,
          syncType: "history",
          fetchAll: true,
        }),
      });

      let payload = await res.json();

      if (!res.ok) {
        const refreshToken = await getTraktRefreshToken();
        if (refreshToken) {
          const newAccess = await refreshAccess(refreshToken);
          if (newAccess) {
            const retry = await fetch("/api/trakt/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                accessToken: newAccess,
                syncType: "history",
                fetchAll: true,
              }),
            });
            payload = await retry.json();
            if (!retry.ok)
              throw new Error(
                payload?.error || "Failed to fetch history after refresh",
              );
          } else {
            throw new Error(payload?.error || "Failed to fetch history");
          }
        } else {
          throw new Error(payload?.error || "Failed to fetch history");
        }
      }

      if (!Array.isArray(payload)) {
        console.error("Trakt sync returned non-array payload", payload);
        setImportResult("Trakt returned unexpected response — check console");
        return;
      }

      const moviesMap = new Map<number, { id: number; watchedAt: Date }>();
      const showsMap = new Map<
        number,
        { id: number; watchedAt: Date | null }
      >();

      (payload || []).forEach((item: any) => {
        if (item.movie) {
          const id = item.movie.ids?.tmdb;
          if (!id) return;

          const ts =
            item.watched_at || item.started_at || item.listed_at || item.at;
          if (!ts) return;

          const watchedAt = new Date(ts);
          if (isNaN(watchedAt.getTime())) return;

          const existing = moviesMap.get(id);
          if (!existing || watchedAt < existing.watchedAt) {
            moviesMap.set(id, { id, watchedAt });
          }
        }

        if (item.show && item.episode) {
          const showId = item.show.ids?.tmdb;
          if (!showId) return;

          const seasonNumber = item.episode.season;
          const episodeNumber = item.episode.number;

          if (seasonNumber === 1 && episodeNumber === 1) {
            const ts =
              item.watched_at || item.started_at || item.listed_at || item.at;
            if (!ts) return;
            const watchedAt = new Date(ts);
            if (isNaN(watchedAt.getTime())) return;

            const existing = showsMap.get(showId);
            if (
              !existing ||
              (existing.watchedAt && watchedAt < existing.watchedAt)
            ) {
              showsMap.set(showId, {
                id: showId,
                watchedAt: watchedAt,
              });
            }
          }
        }
      });

      const itemsToImport: any[] = [];

      const fetchWatchedFromFirebase = async (userId: string) => {
        const q = query(collection(db, "userWatchedList", userId, "watched"));
        try {
          const querySnapshot = await getDocs(q);
          const fetchedWatched: MediaTypes[] = querySnapshot.docs.map(
            (doc) => doc.data() as MediaTypes,
          );
          return fetchedWatched;
        } catch (error) {
          console.error("Error fetching watched list: ", error);
          return [];
        }
      };

      const fetchedWatched = await fetchWatchedFromFirebase(user.uid);
      const existingWatched = new Set(fetchedWatched.map((media) => media.id));

      moviesMap.forEach(({ id, watchedAt }) => {
        if (!existingWatched.has(id)) {
          itemsToImport.push({
            id,
            type: "movie",
            createdAt: watchedAt ? watchedAt.toISOString() : undefined,
          });
        }
      });

      showsMap.forEach(({ id, watchedAt }) => {
        if (!existingWatched.has(id)) {
          itemsToImport.push({
            id,
            type: "tv",
            createdAt: watchedAt ? watchedAt.toISOString() : undefined,
          });
        }
      });

      if (itemsToImport.length === 0) {
        setImportResult("No new items to import");
        return;
      }

      const chunkSize = 20;
      const chunkedItems = [];
      for (let i = 0; i < itemsToImport.length; i += chunkSize) {
        chunkedItems.push(itemsToImport.slice(i, i + chunkSize));
      }

      let totalImported = 0;

      for (const chunk of chunkedItems) {
        const importRes = await fetch("/api/trakt/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "watched",
            data: chunk,
            userId: user.uid,
          }),
        });

        const importJson = await importRes.json();
        if (!importRes.ok) {
          throw new Error(importJson?.error || "Import failed");
        }

        const written =
          importJson.written || importJson.writtenCount || chunk.length;

        totalImported += written;

        setImportResult(
          `Importing ${totalImported}/${itemsToImport.length} items.`,
        );

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setImportResult(`Successfully imported ${totalImported} items`);
      router.refresh();
    } catch (e: any) {
      console.error("Import error:", e);
      const errorMessage = e?.message || String(e) || "Unknown error occurred";
      setError(errorMessage);
      setImportResult(null);
    } finally {
      setImportingAll(false);
    }
  };

  useEffect(() => {
    if (!traktToken || !traktUser) return;
    (async () => {
      setHistoryPage(1);
      const pageData = await fetchHistoryPage(1);
      setHistory(pageData);
      setHasMoreHistory((pageData?.length || 0) >= 20);
      setInitialHistoryLoading(false);
    })();
  }, [traktToken, traktUser]);

  const handleConnectTrakt = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/trakt/auth");
      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (err) {
      setError("Failed to initiate Trakt connection");
      setLoading(false);
    }
  };

  const handleDisconnectTrakt = async () => {
    try {
      setLoading(true);
      if (!user?.uid) return;

      await fetch("/api/trakt/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { trakt: null }, { merge: true });

      setTraktUser(null);
      setTraktToken(null);
    } catch (err) {
      setError("Failed to disconnect Trakt account");
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loadingUser) {
    return (
      <EmptyState
        title="You must be logged in"
        description="to view your connections."
        linkHref="/login"
        linkText="Login"
        icon={<FiLogIn size={24} />}
      />
    );
  }

  return (
    <>
      {loadingUser ? (
        <div className="flex justify-center items-center mt-15 min-h-[70dvh]">
          <Loading size={100} />
        </div>
      ) : (
        <div className="min-h-screen bg-white dark:bg-dark px-4 py-16">
          <div className="customContainer">
            {error && (
              <div className="mb-6 p-4 text-white bg-red rounded-lg">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-4 text-sm hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <section className="p-6 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">
                Connect Third-Party Services
              </h2>

              <LogoutModal
                isOpen={isLogoutModalOpen}
                text="Are you sure you want to disconnect?"
                onCancel={() => setIsLogoutModalOpen(false)}
                onConfirm={() => {
                  handleDisconnectTrakt();
                  setIsLogoutModalOpen(false);
                }}
              />
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                      <Image
                        src={TraktLogo}
                        alt={""}
                        width={1000}
                        height={1000}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">
                        Trakt
                      </h3>
                      <p className="text-sm dark:text-gray-300">
                        Sync your watched media.
                      </p>
                    </div>
                  </div>

                  {traktUser ? (
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold dark:text-white">
                          {traktUser.username}
                        </p>
                        <button
                          onClick={() => setIsLogoutModalOpen(true)}
                          disabled={loading}
                          className="text-sm text-red hover:text-red-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Disconnecting..." : "Disconnect"}
                        </button>
                      </div>
                      {traktUser.avatar && (
                        <img
                          src={traktUser.avatar}
                          alt={traktUser.username}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleConnectTrakt}
                      disabled={loading}
                      className="px-6 py-2 bg-blue text-white rounded-lg transition font-medium cursor-pointer hover:bg-blue-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue"
                    >
                      {loading ? "Connecting..." : "Connect"}
                    </button>
                  )}
                </div>

                {traktUser && (
                  <div className="mt-6 space-y-3">
                    <div className="mt-4">
                      <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center gap-2">
                        <button
                          onClick={handleImportAll}
                          disabled={importingAll || !user}
                          className="px-4 py-2 bg-blue hover:bg-blue-hover text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:hover:bg-blue disabled:cursor-not-allowed cursor-pointer"
                        >
                          {importingAll
                            ? "Importing..."
                            : "Import watched media from Trakt"}
                        </button>
                        {importResult && (
                          <span className="text-sm text-green">
                            {importResult}
                          </span>
                        )}
                      </div>

                      <h5 className="font-medium dark:text-white mt-10">
                        History
                      </h5>
                      {initialHistoryLoading ? (
                        <div className="overflow-x-auto py-2">
                          <div className="flex gap-4 w-max">
                            {Array.from({ length: 4 }).map((_, idx) => (
                              <div
                                key={idx}
                                className="w-[257px] h-66 bg-gray-400 rounded-lg flex flex-col animate-pulse"
                              >
                                <div className="flex-1 bg-gray-300 rounded-t-lg"></div>

                                <div className="h-4 bg-gray-200 rounded mt-4 mb-16 mx-2 w-3/4"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : history && history.length > 0 ? (
                        <>
                          <div className="flex gap-4 overflow-x-auto py-2">
                            {history.map((item: any, idx: number) => {
                              const title =
                                item.movie?.title ||
                                item.show?.title ||
                                item.episode?.title ||
                                item.type;
                              const tmdbId =
                                item.movie?.ids?.tmdb ||
                                item.show?.ids?.tmdb ||
                                item.episode?.ids?.tmdb;
                              const mediaType = item.movie
                                ? "movie"
                                : item.show
                                  ? "tv"
                                  : item.episode
                                    ? "tv"
                                    : null;
                              const time = new Date(
                                item.started_at ||
                                  item.listed_at ||
                                  item.watched_at ||
                                  item.at ||
                                  item.timestamp ||
                                  item.date ||
                                  item.action_at ||
                                  Date.now(),
                              ).toLocaleString();

                              const details = tmdbId
                                ? tmdbDetails[String(tmdbId)]
                                : null;
                              const imagePath =
                                details?.mediaData?.backdrop_path ||
                                details?.mediaData?.poster_path;
                              const imageUrl = imagePath
                                ? `https://image.tmdb.org/t/p/w780${imagePath}`
                                : MovieTvPlaceholder;
                              return (
                                <Link
                                  key={idx}
                                  href={
                                    tmdbId && mediaType
                                      ? item.episode
                                        ? `/tv/${item.show?.ids?.tmdb || item.episode?.ids?.tmdb}/season/${item.episode.season}`
                                        : `/${mediaType}/${tmdbId}`
                                      : "#"
                                  }
                                  className="w-64 group flex-shrink-0 bg-blue rounded-lg shadow p-3 flex flex-col hover:shadow-lg transition"
                                >
                                  <div className="h-40 w-full mb-2 rounded overflow-hidden bg-gray-200">
                                    <Image
                                      src={imageUrl}
                                      alt={title}
                                      width={1000}
                                      height={1000}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>

                                  <div className="flex-1">
                                    <div className="text-md font-semibold text-white group-hover:underline">
                                      {item.show?.title || title}
                                    </div>

                                    <p className="text-xs text-white mt-1">
                                      {time}
                                    </p>
                                  </div>

                                  <div className="mt-3">
                                    {tmdbId ? (
                                      <div className="flex items-center gap-2">
                                        {item.episode && (
                                          <span className="text-xs text-gray-600 dark:text-gray-300">
                                            S{item.episode.season} • E
                                            {item.episode.number}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                                        No TMDB ID
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                            {hasMoreHistory && (
                              <div className="w-64 flex-shrink-0 flex items-center justify-center">
                                <button
                                  onClick={async () => {
                                    const nextPage = historyPage + 1;
                                    const pageData =
                                      await fetchHistoryPage(nextPage);
                                    if (!pageData || pageData.length === 0) {
                                      setHasMoreHistory(false);
                                      return;
                                    }
                                    setHistory((prev) => [
                                      ...(prev || []),
                                      ...pageData,
                                    ]);
                                    setHistoryPage(nextPage);
                                    setHasMoreHistory(pageData.length >= 20);
                                  }}
                                  disabled={historyLoading}
                                  className="px-4 py-2 bg-blue hover:bg-blue-hover text-white rounded-md text-sm cursor-pointer disabled:opacity-50 disabled:hover:bg-blue disabled:cursor-not-allowed"
                                >
                                  {historyLoading ? "Loading..." : "Load more"}
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div>No history to show</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

export default Connections;
