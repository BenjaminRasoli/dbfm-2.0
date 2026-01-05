"use client";
import { ActorTypes } from "@/app/Types/ActorType";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PersonPoster from "../../../../images/PersonImagePlaceholder.jpg";
import { ActorKnownForTypes } from "@/app/Types/ActorKnownForTypes";
import ActorSkeletonLoader from "@/app/components/ActorSkeletonLoader/ActorSkeletonLoader";

function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [actor, setActor] = useState<ActorTypes | null>(null);
  const [actorKnownFor, setActorKnownFor] = useState<
    ActorKnownForTypes[] | null
  >(null);
  const [actorAll, setActorall] = useState<ActorKnownForTypes[] | null>(null);
  const [actorCrew, setActorCrew] = useState<ActorKnownForTypes[] | null>(null);
  const [showFullBio, setShowFullBio] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<{ [id: number]: boolean }>(
    {}
  );
  const bioRef = useRef<HTMLParagraphElement>(null);

  const handleToggleBio = () => {
    if (showFullBio && bioRef.current) {
      const bioTop =
        bioRef.current.getBoundingClientRect().top + window.scrollY;

      setShowFullBio(false);

      setTimeout(() => {
        window.scrollTo({ top: bioTop, behavior: "auto" });
      }, 0);
    } else {
      setShowFullBio(true);
    }
  };

  const bioLimit = 450;

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

        const allCredits = [...(knownForData.cast || [])];
        const castCredits = [...(knownForData.cast || [])];
        const crewCredits = [...(knownForData.crew || [])];

        const sortedCrewByDate = crewCredits
          .filter(
            (credit: ActorKnownForTypes) =>
              credit.release_date || credit.first_credit_air_date
          )
          .sort((a, b) => {
            const dateA = new Date(
              a.release_date || a.first_credit_air_date
            ).getTime();
            const dateB = new Date(
              b.release_date || b.first_credit_air_date
            ).getTime();
            return dateB - dateA;
          });

        const sortedCastByDate = castCredits
          .filter(
            (credit: ActorKnownForTypes) =>
              credit.release_date || credit.first_credit_air_date
          )
          .sort((a, b) => {
            const dateA = new Date(
              a.release_date || a.first_credit_air_date
            ).getTime();
            const dateB = new Date(
              b.release_date || b.first_credit_air_date
            ).getTime();
            return dateB - dateA;
          });

        const sortedCredits = allCredits
          .filter(
            (credit: ActorKnownForTypes) =>
              credit.vote_average > 0 && credit.vote_count > 10
          )
          .sort((a, b) => {
            const scoreA = a.vote_average * 10 + a.vote_count;
            const scoreB = b.vote_average * 10 + b.vote_count;
            return scoreB - scoreA;
          });

        setActor(data);
        setActorall(sortedCastByDate);
        setActorCrew(sortedCrewByDate);
        setActorKnownFor(sortedCredits.slice(0, 10));
      } catch (err) {
        console.error("Error fetching actor data:", err);
      }
    };

    fetchData();
  }, [params]);

  const getCreditYear = (credit: ActorKnownForTypes): string => {
    const date = credit.release_date || credit.first_credit_air_date;

    return date ? String(new Date(date).getFullYear()) : "N/A";
  };

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
    <div className="min-h-screen pb-15">
      <div className="mx-auto max-w-[380px] sm:max-w-[570px] md:max-w-[650px] custom-lg:max-w-[950px] 2xl:max-w-[1250px] p-3 pt-10">
        <div className="rounded-lg flex flex-col items-center lg:flex-row lg:items-start">
          <Image
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
                : PersonPoster
            }
            alt={actor.name}
            className="mb-5 w-[350px] h-full object-cover rounded-lg lg:mr-6"
            height={700}
            width={700}
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold">
              {actor.name || "Unknown name"}
            </h1>

            <p ref={bioRef} className="mt-4 text-lg whitespace-pre-line">
              <strong>Biography:</strong>{" "}
              {actor.biography ? (
                <>
                  {showFullBio || actor.biography.length <= bioLimit
                    ? actor.biography
                    : `${actor.biography.slice(0, bioLimit)}... `}
                  {actor.biography.length > bioLimit && (
                    <button
                      onClick={handleToggleBio}
                      className="text-blue underline text-sm cursor-pointer ml-1"
                    >
                      {showFullBio ? "Show less" : "Read more"}
                    </button>
                  )}
                </>
              ) : (
                "Unknown biography"
              )}
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

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Known For</h2>

          <div className="flex overflow-x-auto gap-6 pb-4">
            {actorKnownFor && actorKnownFor.length > 0 ? (
              actorKnownFor.map((credit, index) => {
                const isImageLoaded = loadedImages[credit.id] || false;
                const imageSrc = credit.poster_path
                  ? `https://image.tmdb.org/t/p/original${credit.poster_path}`
                  : PersonPoster;

                return (
                  <Link
                    href={`/${credit.media_type}/${credit.id}`}
                    key={credit.id - index}
                  >
                    <div className="w-44 h-[350px] flex-shrink-0 bg-blue rounded-lg shadow-md overflow-hidden">
                      <div className="relative w-full h-[230px]">
                        {!isImageLoaded && (
                          <div className="absolute inset-0 bg-gray-300 animate-pulse z-10" />
                        )}
                        <Image
                          src={imageSrc}
                          alt={credit.title || credit.name}
                          className="w-full h-full object-cover"
                          height={700}
                          width={700}
                          onLoad={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [credit.id]: true,
                            }))
                          }
                        />
                      </div>

                      <div className="pl-1 pt-2 max-h-[120px] overflow-auto text-white">
                        <h3 className="text-sm font-semibold truncate">
                          {credit.title || credit.name}
                        </h3>
                        <p className="text-sm pt-1 pb-2">
                          Character: {credit.character || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>No works found for this actor.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">All Credits</h2>

          <ul className="space-y-3">
            {actorAll && actorAll.length > 0 ? (
              actorAll.map((credit, i) => (
                <li
                  key={credit.id - i}
                  className="border-b border-gray-700 pb-2"
                >
                  <p className="font-semibold">
                    <Link
                      className="hover:text-blue"
                      href={`/${credit.media_type}/${credit.id}`}
                    >
                      {credit.title || credit.name}
                    </Link>{" "}
                    <span className="text-gray-700 dark:text-gray-400 text-sm">
                      ({getCreditYear(credit)})
                    </span>
                  </p>
                  {credit.character && (
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      as {credit.character}
                    </p>
                  )}
                </li>
              ))
            ) : (
              <p>No credits found for this actor.</p>
            )}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Production</h2>

          <ul className="space-y-3">
            {actorCrew && actorCrew.length > 0 ? (
              actorCrew.map((credit, i) => (
                <li
                  key={credit.id - i}
                  className="border-b border-gray-700 pb-2"
                >
                  <p className="font-semibold">
                    <Link
                      className="hover:text-blue"
                      href={`/${credit.media_type}/${credit.id}`}
                    >
                      {credit.title || credit.name}{" "}
                    </Link>
                    <span className="text-gray-700 dark:text-gray-400 text-sm">
                      ({getCreditYear(credit)})
                    </span>
                  </p>

                  {credit.job && (
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {credit.job}
                    </p>
                  )}
                </li>
              ))
            ) : (
              <p>No production credits found.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Page;
