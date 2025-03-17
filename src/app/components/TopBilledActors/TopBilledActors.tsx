import Image from "next/image";
import personPoster from "../../images/personPlaceHolder.jpg";
import Link from "next/link";
import { ActorTypes } from "@/app/Types/ActorTypes";

function TopBilledActors({ actors }: { actors: ActorTypes[] }) {
  return (
    <div className="mt-8">
      {actors.length > 0 && (
        <h2 className="text-2xl font-bold text-white">Top Billed Cast</h2>
      )}
      <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
        {actors?.map((actor: ActorTypes) => (
          <Link key={actor.id} href={`/actor/${actor.id}`}>
            <div className="bg-blue rounded-lg w-40 flex flex-col h-[300px]">
              {actor.profile_path ? (
                <Image
                  height={200}
                  width={200}
                  src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-[200px] rounded-t-lg object-cover"
                />
              ) : (
                <Image
                  height={840}
                  width={840}
                  src={personPoster}
                  alt={actor.name}
                  className="w-full h-[840px] rounded-t-lg object-cover"
                />
              )}
              <div className="flex flex-col pl-1 mb-7 h-full">
                <h3 className="text-white font-bold mt-2 text-ellipsis">
                  {actor.name}
                </h3>
                <p className="text-white text-xs">{actor.character}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopBilledActors;
