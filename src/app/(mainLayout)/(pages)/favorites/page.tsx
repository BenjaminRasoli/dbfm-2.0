export const dynamic = "force-dynamic";

import MediaList from "@/app/components/MediaList/MediaList";

export default async function Page() {
  return <MediaList type="favorites" />;
}
