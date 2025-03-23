"use client";
import { ActorTypes } from "@/app/Types/ActorType";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PersonPoster from "../../../../images/personposter.jpg";
import { ActorKnownForTypes } from "@/app/Types/ActorKnownForTypes";
import ActorSkeletonLoader from "@/app/components/ActorSkeletonLoader/ActorSkeletonLoader";

function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [actor, setActor] = useState<ActorTypes | null>(null);
  const [actorKnownFor, setActorKnownFor] = useState<
    ActorKnownForTypes[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getActor?id=${slug}`
        );
        const knownForResponse = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getActorKnownFor?id=${slug}`
        );
        const data = await response.json();
        const knownForData = await knownForResponse.json();

        const allCredits = [...knownForData.cast];

        const sortedCredits = allCredits
          .filter(
            (credit: ActorKnownForTypes) =>
              credit.vote_average > 0 && credit.vote_count > 10
          )
          .sort((a, b) => {
            const scoreA = a.vote_average * 10 + a.vote_count;
            const scoreB = b.vote_average * 10 + b.vote_count;
            return scoreB - scoreA;
          })
          .slice(0, 15);

        setActor(data);
        setActorKnownFor(sortedCredits);
      } catch (err) {
        console.error("Error fetching actor data:", err);
      }
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    if (actor && actor.name) {
      document.title = `DBFM | ${actor.name}`;
    } else {
      document.title = "DBFM | Actor Details";
    }
  }, [actor]);

  if (!actor) {
    return <ActorSkeletonLoader />;
  }

  return (
    <div className="min-h-screen">
      <div className="p-7 max-w-[300px] sm:max-w-[570px] md:max-w-[550px] custom:max-w-[950px] mx-auto rounded-lg flex flex-col lg:flex-row">
        <Image
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
              : PersonPoster
          }
          alt={actor.name}
          className="mr-6 mb-5 w-[300px] h-full object-cover rounded-lg items-start flex"
          height={700}
          width={700}
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{actor.name || "Unknown name"}</h1>
          <p className="mt-4 text-lg">
            <strong>Biography:</strong> {actor.biography || "Unknown biography"}
          </p>
          <p className="mt-2 text-lg">
            <strong>Birthday:</strong> {actor.birthday || "Unknown birthday"}
          </p>
          <p className="mt-2 text-lg">
            <strong>Place of Birth:</strong>{" "}
            {actor.place_of_birth || "Unknown place of birth"}
          </p>
          <p className="mt-2 text-lg">
            <strong>Known For:</strong>{" "}
            {actor.known_for_department || "Unknown"}
          </p>
        </div>
      </div>

      <div className="p-7 max-w-[300px] sm:max-w-[570px] md:max-w-[550px] custom:max-w-[950px] mx-auto">
        <h2 className="text-2xl font-semibold ">
          Movies and TV Shows Featuring {actor.name}
        </h2>
        <div className="flex overflow-auto gap-6 py-6 mt-6">
          {actorKnownFor && actorKnownFor.length > 0 ? (
            actorKnownFor.map((credit: ActorKnownForTypes) => (
              <Link href={`/${credit.media_type}/${credit.id}`} key={credit.id}>
                <div className="w-40 flex-shrink-0 bg-blue min-h-[350px]  rounded-lg shadow-md overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/original${credit.poster_path}`}
                    alt={credit.title || credit.name}
                    className="w-full h-56 object-cover rounded-t-lg"
                    height={200}
                    width={200}
                  />
                  <div className="pl-1 mt-2">
                    <h3 className="text-lg font-semibold">
                      {credit.title || credit.name}
                    </h3>
                    <p className="text-sm ">Character: {credit.character}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center">No works found for this actor.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
