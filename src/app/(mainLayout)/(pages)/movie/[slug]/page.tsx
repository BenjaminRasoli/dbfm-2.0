import SingleMovieOrTv from "@/app/components/SingleMovieOrTv/SingleMovieOrTv";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <SingleMovieOrTv params={{ slug }} />;
}
