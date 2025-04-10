import { Dispatch, SetStateAction } from "react";
import { MediaTypes } from "./MediaTypes";
import { MovieTypes } from "./MovieTypes";
import { TvTypes } from "./TvTypes";

export interface FavoriteTypes {
  media: MovieTypes | TvTypes | MediaTypes;
  favorites?: Array<MovieTypes | TvTypes | MediaTypes>;
  setFavorites?: Dispatch<SetStateAction<MediaTypes[]>> | undefined;
}
