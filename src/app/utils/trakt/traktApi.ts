import { TraktTokenResponse, TraktUser } from "@/app/Types/TraktTypes";
import {
  TRAKT_API_BASE_URL,
  TRAKT_CLIENT_ID,
  TRAKT_CLIENT_SECRET,
  TRAKT_TOKEN_URL,
} from "./traktConfig";

export async function exchangeCodeForToken(
  code: string,
): Promise<TraktTokenResponse> {
  const response = await fetch(TRAKT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "trakt-api-version": "2",
      "trakt-api-key": TRAKT_CLIENT_ID,
      "User-Agent": "DBFM/1.0.0 (https://dbfm.vercel.app)",
    },
    body: JSON.stringify({
      code,
      client_id: TRAKT_CLIENT_ID,
      client_secret: TRAKT_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/trakt/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TraktTokenResponse> {
  const response = await fetch(TRAKT_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: TRAKT_CLIENT_ID,
      client_secret: TRAKT_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json();
}

export async function getTraktUser(accessToken: string): Promise<TraktUser> {
  const response = await fetch(`${TRAKT_API_BASE_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "trakt-api-version": "2",
      "trakt-api-key": TRAKT_CLIENT_ID,
      "User-Agent": "DBFM/1.0.0 (https://dbfm.vercel.app)",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

export async function getUserHistory(
  accessToken: string,
  limitPerPage: number = 100,
  maxPages: number = 10,
  page?: number,
) {
  if (typeof page === "number") {
    const url = new URL(`${TRAKT_API_BASE_URL}/sync/history`);
    url.searchParams.set("extended", "full");
    url.searchParams.set("limit", String(limitPerPage));
    url.searchParams.set("page", String(page));

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "trakt-api-version": "2",
        "trakt-api-key": TRAKT_CLIENT_ID,
        "User-Agent": "DBFM/1.0.0 (https://dbfm.vercel.app)",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `Failed to fetch user history (page ${page}): ${response.status} ${text}`,
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }

  const allItems: any[] = [];

  for (let p = 1; p <= maxPages; p++) {
    const url = new URL(`${TRAKT_API_BASE_URL}/sync/history`);
    url.searchParams.set("extended", "full");
    url.searchParams.set("limit", String(limitPerPage));
    url.searchParams.set("page", String(p));

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "trakt-api-version": "2",
        "trakt-api-key": TRAKT_CLIENT_ID,
        "User-Agent": "DBFM/1.0.0 (https://dbfm.vercel.app)",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `Failed to fetch user history (page ${p}): ${response.status} ${text}`,
      );
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;

    allItems.push(...data);

    if (data.length < limitPerPage) break;
  }

  return allItems;
}
