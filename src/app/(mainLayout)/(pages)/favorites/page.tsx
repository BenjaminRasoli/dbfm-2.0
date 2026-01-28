export const dynamic = "force-dynamic";

import MediaList from "@/app/components/MediaList/MediaList";

export async function generateMetadata() {
  return {
    title: "Your Favorites | DBFM",
    description: "Browse all your favorite movies and TV shows on DBFM.",
  };
}

export default async function Page() {
  return <MediaList type="favorites" />;
}
