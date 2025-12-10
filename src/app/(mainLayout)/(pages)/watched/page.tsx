import { MediaTypes } from "@/app/Types/MediaTypes";
import { getUserId } from "@/app/utils/cookies";
import { fetchMediaDetails, getFirebaseItems } from "../favorites/page";
import MediaList from "@/app/components/MediaList/MediaList";

async function getWatched(): Promise<MediaTypes[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const items = await getFirebaseItems(userId, "userWatchedList", "watched");
  return items.length > 0 ? fetchMediaDetails(items) : [];
}

export default async function Page() {
  const watched = await getWatched();

  return <MediaList initialMedia={watched} type="watched" />;
}
