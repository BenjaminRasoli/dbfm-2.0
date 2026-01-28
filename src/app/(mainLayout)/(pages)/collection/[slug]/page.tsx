import React from "react";
import Collection from "./Collection";
import { CollectionType } from "@/app/Types/MovieTypes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getCollection?id=${slug}`,
    );

    if (!res.ok) return { title: "Collection Not Found" };

    const data: CollectionType = await res.json();

    if (data.success == false) return { title: "Collection Not Found | DBFM" };

    const title = `${data.name} | DBFM`;
    const description =
      data.overview || "No description available for this collection.";

    return {
      title,
      description,
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: "Collection Not Found" };
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
