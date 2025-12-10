import { ActorKnownForTypes } from "./ActorKnownForTypes";
import { ActorTypes } from "./ActorType";

export interface PersonClientProps {
  actor: ActorTypes;
  actorKnownFor: ActorKnownForTypes[];
}
