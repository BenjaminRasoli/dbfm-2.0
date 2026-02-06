import Episodes from "@/app/components/Episodes/Episodes";
import { EpisodesTypes } from "@/app/Types/EpisodesTypes";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; seasonNumber: number }>;
}): Promise<Metadata> {
  const { slug, seasonNumber } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getEpisodes?id=${slug}&seasonNumber=${seasonNumber}`,
    );

    if (!res.ok) {
      return {
        title: "Season Not Found | DBFM",
        description: "The requested season could not be found.",
      };
    }

    const data: EpisodesTypes = await res.json();

    const title = `Season ${seasonNumber} | DBFM`;
    const description =
      data.overview || `Explore all episodes from Season ${seasonNumber}.`;
    const imageUrl = data.poster_path
      ? `https://image.tmdb.org/t/p/original${data.poster_path}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: imageUrl ? [{ url: imageUrl }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Season Not Found | DBFM",
      description: "The requested season could not be found.",
    };
  }
}

async function Page({
  params,
}: {
  params: Promise<{ slug: string; seasonNumber: number }>;
}) {
  const { slug, seasonNumber } = await params;

  return <Episodes params={Promise.resolve({ slug, seasonNumber })} />;
}

export default Page;
