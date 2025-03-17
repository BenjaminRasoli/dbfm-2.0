export interface EpisodesTypes {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string;
  vote_average: number;
  poster_path: string;
  crew: {
    name: string;
    job: string;
    profile_path: string | null;
  }[];
  guest_stars: {
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  episodes: EpisodeTypes[];
}

export interface EpisodeTypes {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string;
  vote_average: number;
  runtime: number;
  poster_path: string;
  crew: { name: string; job: string; profile_path: string | null }[];
  guest_stars: {
    name: string;
    character: string;
    profile_path: string | null;
  }[];
}
