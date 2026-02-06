import React from "react";
import Genre from "./Genre";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getNavbarGenres`,
    );

    if (!res.ok) {
      return {
        title: "Genre Not Found | DBFM",
        description: "The requested genre could not be found.",
      };
    }

    const genresData = await res.json();
    const genresArray = genresData.genres;
    const genre = genresArray.find(
      (g: { id: number }) => g.id === parseInt(slug),
    );

    if (!genre) {
      return {
        title: "Genre Not Found | DBFM",
        description: "The requested genre could not be found.",
      };
    }

    const title = `${genre.name} | DBFM`;
    const description = `Browse movies and TV shows in the ${genre.name} genre.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Genre Not Found | DBFM",
      description: "The requested genre could not be found.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <Genre params={{ slug }} />;
}
