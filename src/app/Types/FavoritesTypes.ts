import { MediaTypes } from "./MediaTypes";
import { MovieTypes } from "./MovieTypes";
import { TvTypes } from "./TvTypes";

export interface FavoriteTypes {
  media: MovieTypes | TvTypes | MediaTypes;
}
