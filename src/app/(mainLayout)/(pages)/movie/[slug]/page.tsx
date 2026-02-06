import SingleMovieOrTv from "@/app/components/SingleMovieOrTv/SingleMovieOrTv";
import { MovieTypes } from "@/app/Types/MovieTypes";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=movie`,
    );

    if (!res.ok) {
      return {
        title: "Movie Not Found | DBFM",
        description: "The requested movie could not be found.",
      };
    }

    const data = await res.json();

    if (!data?.mediaData) {
      return {
        title: "Movie Not Found | DBFM",
        description: "The requested movie could not be found.",
      };
    }

    const movie: MovieTypes = data.mediaData;

    const title = `${movie.title} | DBFM`;
    const description = movie.overview || "No description available.";
    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
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
      title: "Movie Not Found | DBFM",
      description: "The requested movie could not be found.",
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
