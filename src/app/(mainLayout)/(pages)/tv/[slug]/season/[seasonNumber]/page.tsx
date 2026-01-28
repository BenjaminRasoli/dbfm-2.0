import Episodes from "@/app/components/Episodes/Episodes";
import { EpisodesTypes } from "@/app/Types/EpisodesTypes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; seasonNumber: number }>;
}) {
  const { slug, seasonNumber } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getEpisodes?id=${slug}&seasonNumber=${seasonNumber}`,
    );

    if (!res.ok) return { title: "Season Not Found" };

    const data: EpisodesTypes = await res.json();

    const title = `Season ${seasonNumber} | DBFM`;
    const description =
      data.overview || `Explore all episodes from Season ${seasonNumber}.`;

    return { title, description };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return { title: "Season Not Found" };
  }
}

async function Page({
  params,
}: {
  params: Promise<{ slug: string; seasonNumber: number }>;
}) {
  const { slug, seasonNumber } = await params;

  return <Episodes params={Promise.resolve({ slug, seasonNumber })} />;
}

export default Page;
