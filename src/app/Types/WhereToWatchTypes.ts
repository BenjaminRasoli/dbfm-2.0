interface WatchProviderTypes {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface WatchResultsTypes {
  [locale: string]: {
    link: string;
    free: WatchProviderTypes[];
    flatrate: WatchProviderTypes[];
  };
}

interface MediaWatchData {
  id: number;
  results: WatchResultsTypes;
}
