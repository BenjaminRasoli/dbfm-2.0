import { getUserId } from "@/app/utils/cookies";
import { getAdminDB } from "@/app/config/FireBaseAdmin";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return new Response(JSON.stringify([]), { status: 200 });

    const db = await getAdminDB();
    const snapshot = await db
      .collection("userFavoriteList")
      .doc(userId)
      .collection("favorites")
      .get();

    const items = snapshot.docs.map((doc) => doc.data());

    const promises = items.map(async (item: any) => {
      if (!item.media_type) {
        item.media_type = item.title ? "movie" : "tv";
      }
      const apiUrl = `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${process.env.APIKEY}`;
      try {
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) return item;
        const data = await res.json();
        return { ...data, media_type: item.media_type };
      } catch {
        return item;
      }
    });

    const favoritesWithDetails = await Promise.all(promises);

    return new Response(JSON.stringify(favoritesWithDetails), { status: 200 });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}
