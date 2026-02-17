import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/app/utils/trakt/traktApi";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    if (!refreshToken) {
      return NextResponse.json(
        { error: "Missing refresh token" },
        { status: 400 },
      );
    }

    const tokenData = await refreshAccessToken(refreshToken);

    return NextResponse.json(tokenData, { status: 200 });
  } catch (error) {
    console.error("Trakt refresh error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to refresh token: ${message}` },
      { status: 500 },
    );
  }
}
