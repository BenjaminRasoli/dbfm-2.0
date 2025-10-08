"use client";
import Image from "next/image";
import PersonPlaceholder from "../../images/PersonImagePlaceholder.jpg";
import Link from "next/link";
import { useState } from "react";
import { ActorsTypes } from "@/app/Types/ActorsTypes";

function TopBilledActors({ actors }: { actors: ActorsTypes[] }) {
  const [loadedImages, setLoadedImages] = useState<{ [id: number]: boolean }>(
    {}
  );

  return (
    <div className="mt-8">
      {actors.length > 0 && (
        <h2 className="text-2xl font-bold text-white">Cast</h2>
      )}
      <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
        {actors?.map((actor: ActorsTypes) => {
          const isImageLoaded = loadedImages[actor.id] || false;
          const imageSrc = actor.profile_path
            ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
            : PersonPlaceholder;

          return (
            <Link key={actor.id} href={`/person/${actor.id}`}>
              <div className="bg-blue rounded-lg w-43 flex flex-col h-[350px] overflow-hidden">
                <div className="relative w-full h-[250px] overflow-hidden rounded-t-lg">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 bg-gray-300 animate-pulse z-10" />
                  )}
                  <Image
                    height={700}
                    width={700}
                    src={imageSrc}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                    onLoad={() =>
                      setLoadedImages((prev) => ({
                        ...prev,
                        [actor.id]: true,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col pl-1 mt-0 overflow-auto max-h-[100px]">
                  <h3 className="text-white font-bold text-ellipsis">
                    {actor?.name}
                  </h3>
                  <p className="text-white text-xs">{actor?.character}</p>

                  {Array.isArray(actor.roles) && actor.roles.length > 0 && (
                    <>
                      {actor.roles.map((role) => (
                        <div className="text-white pb-2" key={role.credit_id}>
                          {role.character && (
                            <p className="text-sm">{role.character}</p>
                          )}
                          {role.episode_count && (
                            <p className="text-xs opacity-85">
                              {role.episode_count} Episodes
                            </p>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default TopBilledActors;
