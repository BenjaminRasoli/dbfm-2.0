import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dbfm.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
  ];

  try {
    const trendingRes = await fetch(
      `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${process.env.APIKEY}`,
      {
        next: { revalidate: 60 * 60 },
      },
    );

    if (!trendingRes.ok) {
      throw new Error("Failed to fetch trending media for sitemap");
    }

    const trendingData = await trendingRes.json();
    const results: any[] = Array.isArray(trendingData.results)
      ? trendingData.results
      : [];

    const now = new Date();

    const movieItems = results.filter(
      (item) => item.media_type === "movie" && item.id,
    );
    const moviePages: MetadataRoute.Sitemap = movieItems.map((movie) => ({
      url: `${baseUrl}/movie/${movie.id}`,
      lastModified: new Date(
        movie.updated_at || movie.release_date || now.toISOString(),
      ),
    }));

    const tvItems = results.filter(
      (item) => item.media_type === "tv" && item.id,
    );
    const tvPages: MetadataRoute.Sitemap = tvItems.map((tv) => ({
      url: `${baseUrl}/tv/${tv.id}`,
      lastModified: new Date(
        tv.updated_at ||
          tv.first_air_date ||
          tv.last_air_date ||
          now.toISOString(),
      ),
    }));

    const personItems = results.filter(
      (item) => item.media_type === "person" && item.id,
    );
    const actorPages: MetadataRoute.Sitemap = personItems.map((person) => ({
      url: `${baseUrl}/person/${person.id}`,
      lastModified: new Date(person.updated_at || now.toISOString()),
    }));

    const collectionIds = new Set<number>();

    await Promise.all(
      movieItems.map(async (movie) => {
        try {
          const detailsRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.APIKEY}`,
          );

          if (!detailsRes.ok) return;

          const details = await detailsRes.json();

          if (
            details?.belongs_to_collection &&
            typeof details.belongs_to_collection.id === "number"
          ) {
            collectionIds.add(details.belongs_to_collection.id);
          }
        } catch {}
      }),
    );

    const collectionPages: MetadataRoute.Sitemap = Array.from(
      collectionIds,
    ).map((id) => ({
      url: `${baseUrl}/collection/${id}`,
      lastModified: now,
    }));

    const tvSeasonPages: MetadataRoute.Sitemap = [];

    await Promise.all(
      tvItems.map(async (tv) => {
        try {
          const tvDetailsRes = await fetch(
            `https://api.themoviedb.org/3/tv/${tv.id}?api_key=${process.env.APIKEY}`,
          );

          if (!tvDetailsRes.ok) return;

          const tvDetails = await tvDetailsRes.json();

          if (Array.isArray(tvDetails.seasons)) {
            tvDetails.seasons.forEach((season: any) => {
              if (
                typeof season.season_number === "number" &&
                season.season_number > 0
              ) {
                tvSeasonPages.push({
                  url: `${baseUrl}/tv/${tv.id}/season/${season.season_number}`,
                  lastModified: new Date(
                    season.air_date ||
                      tvDetails.last_air_date ||
                      now.toISOString(),
                  ),
                });
              }
            });
          }
        } catch {}
      }),
    );

    return [
      ...staticPages,
      ...moviePages,
      ...tvPages,
      ...collectionPages,
      ...tvSeasonPages,
      ...actorPages,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
