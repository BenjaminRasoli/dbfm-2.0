import { getUserId } from "@/app/utils/cookies";
import { getAdminDB } from "@/app/config/FireBaseAdmin";
import { DocumentData, Query } from "firebase-admin/firestore";

export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return new Response(JSON.stringify({ data: [], total: 0 }), {
        status: 200,
      });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const type = searchParams.get("type");

    const db = await getAdminDB();

    let query: Query<DocumentData> = db
      .collection("userFavoriteList")
      .doc(userId)
      .collection("favorites");

    if (type && type !== "all") {
      query = query.where("type", "==", type);
    }

    const snapshot = await query
      .limit(12)
      .offset((page - 1) * 12)
      .get();

    const items = snapshot.docs.map((doc) => doc.data());

    let countQuery: Query<DocumentData> = db
      .collection("userFavoriteList")
      .doc(userId)
      .collection("favorites");

    if (type && type !== "all") {
      countQuery = countQuery.where("type", "==", type);
    }

    const totalSnapshot = await countQuery.get();
    const total = totalSnapshot.size;

    const favoritesWithDetails = await Promise.all(
      items.map(async (item: any) => {
        const mediaType = item.type === "movie" ? "movie" : "tv";

        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${process.env.APIKEY}`,
            { cache: "no-store" }
          );

          if (!res.ok) {
            return { ...item, media_type: mediaType };
          }

          const data = await res.json();
          return { ...data, media_type: mediaType };
        } catch {
          return { ...item, media_type: mediaType };
        }
      })
    );

    return new Response(
      JSON.stringify({
        data: favoritesWithDetails,
        total,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch favorites" }),
      { status: 500 }
    );
  }
}
