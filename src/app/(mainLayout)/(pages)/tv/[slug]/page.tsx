import SingleMovieOrTv from "@/app/components/SingleMovieOrTv/SingleMovieOrTv";
import { TvTypes } from "@/app/Types/TvTypes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=tv`,
    );

    if (!res.ok) return { title: "Tv series Not Found" };

    const data = await res.json();

    if (!data?.mediaData) return { title: "Tv series Not Found" };

    const tv: TvTypes = data.mediaData;

    const title = `${tv.name} | DBFM`;
    const description = tv.overview || "No description available.";
    return {
      title,
      description,
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: "Tv series Not Found" };
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
