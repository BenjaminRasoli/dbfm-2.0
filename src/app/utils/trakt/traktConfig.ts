export const TRAKT_CLIENT_ID = process.env.NEXT_PUBLIC_TRAKT_CLIENT_ID || "";
export const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET || "";
export const TRAKT_REDIRECT_URI = `${
  process.env.NEXT_PUBLIC_DBFM_SERVER || "http://localhost:3000"
}/api/trakt/callback`;

export const TRAKT_API_BASE_URL = "https://api.trakt.tv";
export const TRAKT_AUTH_URL = "https://trakt.tv/oauth/authorize";
export const TRAKT_TOKEN_URL = "https://api.trakt.tv/oauth/token";

export const getTraktAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: TRAKT_CLIENT_ID,
    redirect_uri: TRAKT_REDIRECT_URI,
    response_type: "code",
  });

  return `${TRAKT_AUTH_URL}?${params.toString()}`;
};
