import { NextRequest, NextResponse } from "next/server";
import { getUserHistory } from "@/app/utils/trakt/traktApi";

export async function POST(request: NextRequest) {
  try {
    const { accessToken, syncType, fetchAll, page, limit } =
      await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 400 },
      );
    }

    let data;

    switch (syncType) {
      case "history":
        if (typeof page === "number") {
          data = await getUserHistory(accessToken, limit || 20, 1, page);
        } else if (fetchAll) {
          data = await getUserHistory(accessToken, 100, 50);
        } else {
          data = await getUserHistory(accessToken, limit || 20, 1);
        }
        break;
      default:
        return NextResponse.json(
          { error: "Invalid sync type" },
          { status: 400 },
        );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Trakt sync error:", error);
    const message =
      error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { error: `Failed to sync with Trakt: ${message}` },
      { status: 500 },
    );
  }
}
