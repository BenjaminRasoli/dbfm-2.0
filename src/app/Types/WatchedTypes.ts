import { Dispatch, SetStateAction } from "react";
import { MediaTypes } from "./MediaTypes";
import { MovieTypes } from "./MovieTypes";
import { TvTypes } from "./TvTypes";

export interface WatchedTypes {
  isRecommendations?: boolean;
  media: MovieTypes | TvTypes | MediaTypes;
  watched?: Array<MovieTypes | TvTypes | MediaTypes>;
  setWatched?: Dispatch<SetStateAction<MediaTypes[]>> | undefined;
}
