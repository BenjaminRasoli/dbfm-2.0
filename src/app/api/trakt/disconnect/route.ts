import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Successfully disconnected Trakt account" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error disconnecting Trakt:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Trakt account" },
      { status: 500 },
    );
  }
}
