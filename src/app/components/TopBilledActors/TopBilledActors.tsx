import Image from "next/image";
import PersonPlaceholder from "../../images/PersonImagePlaceholder.jpg";
import Link from "next/link";
import { ActorsTypes } from "@/app/Types/ActorsTypes";

function TopBilledActors({ actors }: { actors: ActorsTypes[] }) {
  return (
    <div className="mt-8">
      {actors.length > 0 && (
        <h2 className="text-2xl font-bold text-white">Cast</h2>
      )}
      <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
        {actors?.map((actor: ActorsTypes) => (
          <Link key={actor.id} href={`/person/${actor.id}`}>
            <div className="h-full bg-blue max-h-[300px] overflow-auto rounded-lg w-40 flex flex-col">
              <Image
                height={700}
                width={700}
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
                    : PersonPlaceholder
                }
                alt={actor.name}
                className="w-full h-[200px] rounded-t-lg object-cover"
              />

              <div className="flex flex-col pl-1 mb-7 h-full">
                <h3 className="text-white font-bold mt-2 text-ellipsis">
                  {actor.name}
                </h3>
                <p className="text-white text-xs">{actor?.character}</p>

                {Array.isArray(actor.roles) && actor.roles.length > 0 && (
                  <>
                    {actor.roles.map((role) => (
                      <div className="text-white" key={role.credit_id}>
                        <p className="text-sm">{role.character}</p>
                        <p className="text-xs opacity-85">
                          {role.episode_count} Episodes
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopBilledActors;
