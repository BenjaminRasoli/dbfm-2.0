import { Dispatch, SetStateAction } from "react";
import { MediaTypes } from "./MediaTypes";
import { MovieTypes } from "./MovieTypes";
import { TvTypes } from "./TvTypes";

export interface MediaCardTypes {
  media: MediaTypes[];
  loading: boolean | null;
  favorites?: Array<MovieTypes | TvTypes | MediaTypes>;
  setFavorites?: Dispatch<SetStateAction<MediaTypes[]>> | undefined;
}
