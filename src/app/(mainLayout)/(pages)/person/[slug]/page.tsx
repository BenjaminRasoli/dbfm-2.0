import { Suspense } from "react";
import PersonClient from "../../../../components/PersonClient/PersonClient";
import ActorSkeletonLoader from "@/app/components/ActorSkeletonLoader/ActorSkeletonLoader";
import { ActorTypes } from "@/app/Types/ActorType";
import { ActorKnownForTypes } from "@/app/Types/ActorKnownForTypes";
async function getActor(id: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getActor?id=${id}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch actor");
    }

    const data = await res.json();
    return data as ActorTypes;
  } catch (error) {
    console.error("Error fetching actor:", error);
    throw error;
  }
}

async function getActorKnownFor(id: string) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getActorKnownFor?id=${id}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch actor known for");
    }

    const data = await res.json();
    return data.cast as ActorKnownForTypes[];
  } catch (error) {
    console.error("Error fetching actor known for:", error);
    return [] as ActorKnownForTypes[];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const [actor, knownForData] = await Promise.all([
      getActor(slug),
      getActorKnownFor(slug),
    ]);

    const sortedCredits = knownForData
      .filter(
        (credit: ActorKnownForTypes) =>
          credit.vote_average > 0 && credit.vote_count > 10
      )
      .sort((a, b) => {
        const scoreA = a.vote_average * 10 + a.vote_count;
        const scoreB = b.vote_average * 10 + b.vote_count;
        return scoreB - scoreA;
      });

    return (
      <Suspense fallback={<ActorSkeletonLoader />}>
        <PersonClient actor={actor} actorKnownFor={sortedCredits} />
      </Suspense>
    );
  } catch {
    return <ActorSkeletonLoader />;
  }
}
