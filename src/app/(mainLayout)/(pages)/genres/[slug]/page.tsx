import GenresClient from "../../../../components/GenresClient/GenresClient";
import { MediaTypes } from "@/app/Types/MediaTypes";
async function getGenreMovies(genreId: string, page: number) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getGenreMovies?genre=${genreId}&page=${page}`;
    const res = await fetch(apiUrl, { 
      cache: "force-cache",
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch genre movies");
    }

    const data = await res.json();
    return {
      results: data.results as MediaTypes[],
      total_pages: data.total_pages as number,
    };
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    return {
      results: [] as MediaTypes[],
      total_pages: 1,
    };
  }
}
async function getGenreName(genreId: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getNavbarGenres`;
    const res = await fetch(apiUrl, { 
      cache: "force-cache",
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch genres");
    }

    const data = await res.json();
    const genre = data.genres.find(
      (genre: { id: number }) => genre.id === parseInt(genreId)
    );
    return genre?.name || "";
  } catch (error) {
    console.error("Error fetching genre name:", error);
    return "";
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const paramsSearch = await searchParams;
  const page = parseInt(paramsSearch.page || "1", 10);

  const [genreMovies, genreName] = await Promise.all([
    getGenreMovies(slug, page),
    getGenreName(slug),
  ]);

  return (
    <GenresClient
      initialMedia={genreMovies.results}
      initialTotalPages={genreMovies.total_pages}
      initialGenreName={genreName}
      initialGenreSlug={slug}
      initialPage={page}
    />
  );
}
