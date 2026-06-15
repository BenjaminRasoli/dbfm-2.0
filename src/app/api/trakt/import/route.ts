import { getAdminDB } from "@/app/config/FireBaseAdmin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

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
          results.push({
            id: String(item.id || "unknown"),
            ok: false,
            error: "Missing ID",
          });
          continue;
        }

        const providedTs = item.createdAt;

        let createdAtValue: any = FieldValue.serverTimestamp();

        if (providedTs) {
          const parsed = new Date(providedTs);
          if (!isNaN(parsed.getTime())) {
            createdAtValue = Timestamp.fromDate(parsed);
          }
        }

        const docData = {
          ...item,
          createdAt: createdAtValue,
        };

        await collectionRef.doc(docId).set(docData, { merge: true });
        results.push({ id: docId, ok: true });
        written++;

        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      } catch (itemErr) {
        results.push({
          id: String(item.id || "unknown"),
          ok: false,
          error: itemErr instanceof Error ? itemErr.message : String(itemErr),
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

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Import failed",
      }),
      { status: 500 },
    );
  }
}
