import { NextRequest, NextResponse } from "next/server";
import { getTraktAuthUrl } from "@/app/utils/trakt/traktConfig";

export async function GET() {
  try {
    const authUrl = getTraktAuthUrl();
    return NextResponse.json(
      { authUrl },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 },
    );
  }
}
