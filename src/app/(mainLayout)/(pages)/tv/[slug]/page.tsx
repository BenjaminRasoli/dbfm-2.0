import SingleMovieOrTv from "@/app/components/SingleMovieOrTv/SingleMovieOrTv";
import { TvTypes } from "@/app/Types/TvTypes";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=tv`,
    );

    if (!res.ok) {
      return {
        title: "TV Series Not Found | DBFM",
        description: "The requested TV series could not be found.",
      };
    }

    const data = await res.json();

    if (!data?.mediaData) {
      return {
        title: "TV Series Not Found | DBFM",
        description: "The requested TV series could not be found.",
      };
    }

    const tv: TvTypes = data.mediaData;

    const title = `${tv.name} | DBFM`;
    const description = tv.overview || "No description available.";
    const imageUrl = tv.poster_path
      ? `https://image.tmdb.org/t/p/original${tv.poster_path}`
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
      title: "TV Series Not Found | DBFM",
      description: "The requested TV series could not be found.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <SingleMovieOrTv params={{ slug }} />;
}
