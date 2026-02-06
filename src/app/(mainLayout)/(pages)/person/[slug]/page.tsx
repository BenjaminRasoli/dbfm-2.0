import Person from "./Person";
import { ActorTypes } from "@/app/Types/ActorType";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getActor?id=${slug}`,
    );

    if (!res.ok) {
      return {
        title: "Actor Not Found | DBFM",
        description: "The requested actor could not be found.",
      };
    }

    const data: ActorTypes = await res.json();

    if (!data) {
      return {
        title: "Actor Not Found | DBFM",
        description: "The requested actor could not be found.",
      };
    }

    const title = `${data.name} | DBFM`;
    const description =
      data.biography?.slice(0, 160) || "No biography available for this actor.";
    const imageUrl = data.profile_path
      ? `https://image.tmdb.org/t/p/original${data.profile_path}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
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
      title: "Actor Not Found | DBFM",
      description: "The requested actor could not be found.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <Person params={{ slug }} />;
}
