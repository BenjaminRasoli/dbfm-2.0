import { MediaTypes } from "./MediaTypes";

export interface MediaListClientProps {
  initialMedia?: MediaTypes[];
  type: "favorites" | "watched";
}
