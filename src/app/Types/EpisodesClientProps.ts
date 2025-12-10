import { EpisodesTypes } from "./EpisodesTypes";

export interface EpisodesClientProps {
  episodes: EpisodesTypes;
  slug: string;
  seasonNumber: number;
  totalSeasons: number;
  hasSeasonZero: boolean;
}
