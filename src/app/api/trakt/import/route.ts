import { getAdminDB } from "@/app/config/FireBaseAdmin";
import admin from "firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data, userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "No user ID provided" }), {
        status: 400,
      });
    }

    if (!["favorites", "watched"].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid import type" }), {
        status: 400,
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ error: "No items to import" }), {
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

    const results: Array<{ id: string; ok: boolean; error?: string }> = [];
    let written = 0;

    const DELAY_MS = 50;

    for (const item of data) {
      try {
        const docId = item.id?.toString();
        if (!docId) {
          console.warn("Trakt import: skipping item with missing id", item);
          results.push({
            id: String(item.id || "unknown"),
            ok: false,
            error: "Missing ID",
          });
          continue;
        }

        const providedTs = item.createdAt || item.watchedAt || item.watched_at;

        let createdAtValue: any = admin.firestore.FieldValue.serverTimestamp();
        let watchedAtValue: any = undefined;

        if (providedTs) {
          const parsed = new Date(providedTs);
          if (!isNaN(parsed.getTime())) {
            const ts = admin.firestore.Timestamp.fromDate(parsed);
            createdAtValue = ts;
            watchedAtValue = ts;
          }
        }

        try {
          console.info(
            `Trakt import: item id=${docId} type=${item.type} providedTs=${!!providedTs}`,
          );
        } catch (e) {
          console.error(e);
        }

        const docData = {
          ...item,
          createdAt: createdAtValue,
          ...(watchedAtValue ? { watchedAt: watchedAtValue } : {}),
        };

        await collectionRef.doc(docId).set(docData, { merge: true });
        results.push({ id: docId, ok: true });
        written++;

        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      } catch (itemErr: any) {
        const errorMsg =
          itemErr instanceof Error ? itemErr.message : String(itemErr);
        results.push({
          id: String(item.id || "unknown"),
          ok: false,
          error: errorMsg,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        written,
        requested: data.length,
        failed: results.filter((r) => !r.ok),
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Trakt import error:", error);
    const errorMsg = error instanceof Error ? error.message : "Import failed";
    return new Response(JSON.stringify({ error: errorMsg }), { status: 500 });
  }
}
