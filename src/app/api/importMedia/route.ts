import { getAdminDB } from "@/app/config/FireBaseAdmin";
import { getUserId } from "@/app/utils/cookies";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return new Response(JSON.stringify({ error: "No user ID" }), {
        status: 400,
      });
    }

    const body = await req.json();
    const { type, data } = body;

    if (!["favorites", "watched"].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ error: "Empty or invalid data" }), {
        status: 400,
      });
    }

    const db = await getAdminDB();

    const collectionName =
      type === "favorites" ? "userFavoriteList" : "userWatchedList";
    const subCollectionName = type === "favorites" ? "favorites" : "watched";

    const collectionRef = db
      .collection(collectionName)
      .doc(userId)
      .collection(subCollectionName);

    const promises = data.map(async (item: any) => {
      const firestoreItem = {
        id: item.tmdb_id,
        type: item.type,
        createdAt: item.watched_at || new Date().toISOString(),
      };

      return collectionRef.doc(firestoreItem.id.toString()).set(firestoreItem);
    });

    await Promise.all(promises);

    return new Response(JSON.stringify({ success: true, count: data.length }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error importing media list:", error);
    return new Response(
      JSON.stringify({ error: "Failed to import media list" }),
      { status: 500 }
    );
  }
}
