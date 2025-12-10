import { MediaTypes } from "./MediaTypes";

export interface HomeClientProps {
  initialMedia: MediaTypes[];
  initialTotalPages: number;
  initialActiveFilter: string;
  initialPage: number;
  bannerBackdrop: string | null;
}
