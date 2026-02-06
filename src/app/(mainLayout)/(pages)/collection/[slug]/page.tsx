import React from "react";
import Collection from "./Collection";
import { CollectionType } from "@/app/Types/MovieTypes";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getCollection?id=${slug}`,
    );

    if (!res.ok) {
      return {
        title: "Collection Not Found | DBFM",
        description: "The requested collection could not be found.",
      };
    }

    const data: CollectionType = await res.json();

    if (data.success == false) {
      return {
        title: "Collection Not Found | DBFM",
        description: "The requested collection could not be found.",
      };
    }

    const title = `${data.name} | DBFM`;
    const description =
      data.overview || "No description available for this collection.";
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
      title: "Collection Not Found | DBFM",
      description: "The requested collection could not be found.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Collection params={{ slug }} />
    </>
  );
}
