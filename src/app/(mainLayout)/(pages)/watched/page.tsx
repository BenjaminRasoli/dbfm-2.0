export const dynamic = "force-dynamic";

import MediaList from "@/app/components/MediaList/MediaList";

export async function generateMetadata() {
  return {
    title: "Your Watched | DBFM",
    description: "Browse all your watched movies and TV shows on DBFM.",
  };
}

export default async function Page() {
  return <MediaList type="watched" />;
}
