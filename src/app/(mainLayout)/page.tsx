import HomeClient from "../components/HomeClient/HomeClient";
import { MediaTypes } from "../Types/MediaTypes";

async function getBannerBackdrop(): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getMedias?type=movie&page=1`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const withBackdrop = data.results.filter(
      (m: MediaTypes) => m.backdrop_path
    );

    if (!withBackdrop.length) return null;

    return withBackdrop[Math.floor(Math.random() * withBackdrop.length)]
      .backdrop_path;
  } catch {
    return null;
  }
}

export default async function Home() {
  const bannerBackdrop = await getBannerBackdrop();

  return <HomeClient bannerBackdrop={bannerBackdrop} />;
}
