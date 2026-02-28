import { getUserId } from "@/app/utils/cookies";
import { getAdminDB } from "@/app/config/FireBaseAdmin";
import { DocumentData, Timestamp } from "firebase-admin/firestore";

export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return new Response(JSON.stringify([]), { status: 200 });

    const db = await getAdminDB();
    const snapshot = await db
      .collection("userWatchedList")
      .doc(userId)
      .collection("watched")
      .get();

    const items = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;

      let watched_at = "";
      if (data.createdAt instanceof Timestamp) {
        watched_at = data.createdAt.toDate().toISOString();
      } else if (data.createdAt?._seconds) {
        watched_at = new Date(data.createdAt._seconds * 1000).toISOString();
      } else {
        watched_at = new Date().toISOString();
      }

      const type = data.type === "movie" ? "movie" : "show";

      return {
        tmdb_id: data.id,
        type,
        watched_at,
      };
    });

    return new Response(JSON.stringify(items, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error exporting watched list:", error);
    return new Response(JSON.stringify({ error: "Failed to export data" }), {
      status: 500,
    });
  }
}
