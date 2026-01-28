import Person from "./Person";
import { ActorTypes } from "@/app/Types/ActorType";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getActor?id=${slug}`,
    );

    if (!res.ok) return { title: "Actor Not Found" };

    const data: ActorTypes = await res.json();

    if (!data) return { title: "Actor Not Found" };

    const title = `${data.name} | DBFM`;
    const description =
      data.biography?.slice(0, 160) || "No biography available for this actor.";

    return {
      title,
      description,
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: "Actor Not Found" };
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
