import { MediaTypes } from "@/app/Types/MediaTypes";
import { getUserId } from "@/app/utils/cookies";
import { fetchMediaDetails, getFirebaseItems } from "../favorites/page";
import MediaList from "@/app/components/MediaList/MediaList";
import { Suspense } from "react";
import Loading from "@/app/components/Loading/Loading";

async function getWatched(): Promise<MediaTypes[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const items = await getFirebaseItems(userId, "userWatchedList", "watched");
  return items.length > 0 ? fetchMediaDetails(items) : [];
}

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center mt-15 min-h-[70dvh]">
          <Loading size={100} />
        </div>
      }
    >
      <WatchedContent />
    </Suspense>
  );
}

async function WatchedContent() {
  const watched = await getWatched();
  return <MediaList initialMedia={watched} type="watched" />;
}
