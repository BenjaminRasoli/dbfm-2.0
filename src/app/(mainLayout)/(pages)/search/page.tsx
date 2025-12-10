import SearchClient from "../../../components/SearchClient/SearchClient";
import { MediaTypes } from "@/app/Types/MediaTypes";

async function getSearched(searchWord: string, filter: string, page: number) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSearched`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        searchWord,
        filter,
        page,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch search results from API");
    }

    const data = await res.json();
    const updatedResults = data.results.map((item: MediaTypes) => ({
      ...item,
      ...(filter === "movie" || filter === "tv" ? { media_type: filter } : {}),
    }));

    return {
      results: updatedResults as MediaTypes[],
      total_results: data.total_results as number,
      total_pages: data.total_pages as number,
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return {
      results: [] as MediaTypes[],
      total_results: 0,
      total_pages: 1,
    };
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const searchWord = params.query || "";
  const activeFilter = params.type || "multi";
  const page = parseInt(params.page || "1", 10);

  let initialMedia: MediaTypes[] = [];
  let initialTotalResults = 0;
  let initialTotalPages = 1;

  if (searchWord.trim()) {
    const searchData = await getSearched(searchWord, activeFilter, page);
    initialMedia = searchData.results;
    initialTotalResults = searchData.total_results;
    initialTotalPages = searchData.total_pages;
  }

  return (
    <SearchClient
      initialMedia={initialMedia}
      initialTotalResults={initialTotalResults}
      initialTotalPages={initialTotalPages}
      initialSearchWord={searchWord}
      initialActiveFilter={activeFilter}
      initialPage={page}
    />
  );
}
