import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, getTraktUser } from "@/app/utils/trakt/traktApi";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 },
      );
    }

    const tokenData = await exchangeCodeForToken(code);
    const userProfile = await getTraktUser(tokenData.access_token);

    const redirectUrl = new URL("/profile", request.nextUrl.origin);
    redirectUrl.searchParams.set("trakt_token", tokenData.access_token);
    if (tokenData.refresh_token) {
      redirectUrl.searchParams.set("trakt_refresh", tokenData.refresh_token);
    }
    redirectUrl.searchParams.set("trakt_user", JSON.stringify(userProfile));

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Trakt OAuth error:", error);
    return NextResponse.redirect(
      new URL("/profile?error=oauth_failed", request.nextUrl.origin),
    );
  }
}
