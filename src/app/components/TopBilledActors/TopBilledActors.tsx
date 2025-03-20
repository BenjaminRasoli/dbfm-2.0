import Image from "next/image";
import personPoster from "../../images/personposter.jpg";
import Link from "next/link";
import { ActorsTypes } from "@/app/Types/ActorsTypes";

function TopBilledActors({ actors }: { actors: ActorsTypes[] }) {
  return (
    <div className="mt-8">
      {actors.length > 0 && (
        <h2 className="text-2xl font-bold text-white">Top Billed Cast</h2>
      )}
      <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
        {actors?.map((actor: ActorsTypes) => (
          <Link key={actor.id} href={`/person/${actor.id}`}>
            <div className="bg-blue rounded-lg w-40 flex flex-col h-[300px]">
              <Image
                height={700}
                width={700}
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
                    : personPoster
                }
                alt={actor.name}
                className="w-full h-[200px] rounded-t-lg object-cover"
              />
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
