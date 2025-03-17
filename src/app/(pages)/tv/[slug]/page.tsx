import SingleMovieOrTv from "@/app/components/SingleMovieOrTv/SingleMovieOrTv";
import React from "react";

async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  return <SingleMovieOrTv params={Promise.resolve({ slug })} />;
}

export default Page;
