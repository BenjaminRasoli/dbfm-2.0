interface WatchProviderTypes {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchResultsTypes {
  [locale: string]: {
    link: string;
    free: WatchProviderTypes[];
    flatrate: WatchProviderTypes[];
    buy: WatchProviderTypes[];
    rent: WatchProviderTypes[];
  };
}
