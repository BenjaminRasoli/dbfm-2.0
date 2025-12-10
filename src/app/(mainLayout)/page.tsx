import HomeClient from "../components/HomeClient/HomeClient";
import { MediaTypes } from "../Types/MediaTypes";

async function getMedia(type: string, page: number) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getMedias?type=${type}&page=${page}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch media");
    }

    const data = await res.json();
    return {
      results: data.results as MediaTypes[],
      total_pages: data.total_pages as number,
    };
  } catch (error) {
    console.error("Error fetching media:", error);
    return {
      results: [] as MediaTypes[],
      total_pages: 1,
    };
  }
}

async function getBannerBackdrop(): Promise<string | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getMedias?type=movie&page=1`;
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const mediaWithBackdrop = data.results.filter(
        (media: MediaTypes) => media.backdrop_path
      );

      if (mediaWithBackdrop.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * mediaWithBackdrop.length
        );
        return mediaWithBackdrop[randomIndex].backdrop_path;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching banner backdrop:", error);
    return null;
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = params.type || "all";
  const page = parseInt(params.page || "1", 10);

  const filterType = activeFilter === "all" ? "movie" : activeFilter;
  const [mediaData, bannerBackdrop] = await Promise.all([
    getMedia(filterType, page),
    getBannerBackdrop(),
  ]);

  return (
    <HomeClient
      initialMedia={mediaData.results}
      initialTotalPages={mediaData.total_pages}
      initialActiveFilter={activeFilter}
      initialPage={page}
      bannerBackdrop={bannerBackdrop}
    />
  );
}
