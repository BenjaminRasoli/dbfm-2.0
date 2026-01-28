import SingleMovieOrTv from "@/app/components/SingleMovieOrTv/SingleMovieOrTv";
import { MovieTypes } from "@/app/Types/MovieTypes";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=movie`,
    );

    if (!res.ok) return { title: "Movie Not Found" };

    const data = await res.json();

    if (!data?.mediaData) return { title: "Movie Not Found" };

    const movie: MovieTypes = data.mediaData;

    const title = `${movie.title} | DBFM`;
    const description = movie.overview || "No description available.";
    return {
      title,
      description,
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: "Movie Not Found" };
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
