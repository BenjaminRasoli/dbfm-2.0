export interface TraktToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface TraktIds {
  slug: string;
  trakt: number;
  tvdb?: number;
  imdb?: string;
}

export interface TraktUser {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vip_ep: boolean;
  ids: TraktIds;
  avatar: string;
  joined_at: string;
}

export interface TraktMedia {
  title: string;
  year: number;
  ids: TraktIds;
}

export interface TraktWatchlistItem {
  rank: number;
  listed_at: string;
  type: "movie" | "tv";
  movie?: TraktMedia;
  show?: TraktMedia;
  episode?: {
    season: number;
    number: number;
    title: string;
    ids: TraktIds;
  };
}

export interface TratkUserContext {
  traktToken: string | null;
  traktUser: TraktUser | null;
  isConnected: boolean;
}

export interface TraktTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface TraktUser {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vip_ep: boolean;
  ids: TraktIds;
  avatar: string;
  joined_at: string;
}

