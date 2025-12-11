import { getUserId } from "@/app/utils/cookies";
import { MediaTypes } from "@/app/Types/MediaTypes";
import { getAdminDB } from "@/app/config/FireBaseAdmin";
import MediaList from "@/app/components/MediaList/MediaList";
import { Suspense } from "react";
import Loading from "@/app/components/Loading/Loading";

export async function fetchMediaDetails(
  items: MediaTypes[]
): Promise<MediaTypes[]> {
  if (items.length === 0) return [];

  const promises = items.map(async (item) => {
    if (!item.media_type) {
      item.media_type = item.title ? "movie" : "tv";
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getFavorites?media_type=${item.media_type}&id=${item.id}`,
        { cache: "no-store" }
      );
      if (!res.ok) return item;
      const data = await res.json();
      return { ...data, media_type: item.media_type } as MediaTypes;
    } catch {
      return item;
    }
  });

  return Promise.all(promises);
}

export async function getFirebaseItems(
  userId: string,
  collection: "userFavoriteList" | "userWatchedList",
  subCollection: "favorites" | "watched"
): Promise<MediaTypes[]> {
  try {
    const db = await getAdminDB();
    const snapshot = await db
      .collection(collection)
      .doc(userId)
      .collection(subCollection)
      .get();

    return snapshot.docs.map((doc) => doc.data() as MediaTypes);
  } catch (error) {
    console.error("Firestore error:", error);
    return [];
  }
}

export async function getFavorites(): Promise<MediaTypes[]> {
  const userId = await getUserId();
  if (!userId) return [];

  const items = await getFirebaseItems(userId, "userFavoriteList", "favorites");
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
      <FavoritesContent />
    </Suspense>
  );
}

async function FavoritesContent() {
  const favorites = await getFavorites();
  return <MediaList initialMedia={favorites} type="favorites" />;
}
