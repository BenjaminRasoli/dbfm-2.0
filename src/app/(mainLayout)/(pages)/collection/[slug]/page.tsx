"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MovieTvPlaceholder from "../../../../images/MediaImagePlaceholder.jpg";
import { RiStarSFill } from "react-icons/ri";
import HandleFavorites from "@/app/components/HandleFavorites/HandleFavorites";
import HandleWatched from "@/app/components/HandleWacthed/HandleWacthed";
import CollectionSkeletonLoader from "@/app/components/CollectionSkeletonLoader/CollectionSkeletonLoader";
import NotFound from "@/app/not-found";
import { CollectionType } from "@/app/Types/MovieTypes";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [collectionData, setCollectionData] = useState<CollectionType | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [recoPosterLoaded, setRecoPosterLoaded] = useState<{
    [id: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await fetch(`/api/getCollection?id=${slug}`);

        if (!res.ok) {
          setCollectionData(null);
          return;
        }

        const data = await res.json();

        if (!data || !data.parts || !Array.isArray(data.parts)) {
          setCollectionData(null);
        } else {
          setCollectionData(data);
        }
      } catch (err) {
        console.error("Error fetching collection:", err);
        setCollectionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  if (loading) {
    return <CollectionSkeletonLoader />;
  }

  if (!collectionData) {
    return <NotFound />;
  }

  return (
    <div className="relative w-full min-h-screen text-white">
      <div className="w-full h-[50vh] relative overflow-hidden">
        <Image
          src={
            collectionData.backdrop_path
              ? `https://image.tmdb.org/t/p/original${collectionData.backdrop_path}`
              : collectionData.poster_path
                ? `https://image.tmdb.org/t/p/original${collectionData.poster_path}`
                : MovieTvPlaceholder
          }
          alt={collectionData.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="flex flex-col mt-16 gap-3 maxW">
          <h1 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
            {collectionData.name}
          </h1>
          {collectionData.overview && (
            <p className="text-sm md:text-lg drop-shadow-lg max-w-xl">
              {collectionData.overview}
            </p>
          )}
        </div>
      </div>

      <div className="maxW">
        <h2 className="text-2xl font-bold mb-6">Collection Parts</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {collectionData.parts?.map((item) => {
            const isImageLoaded = recoPosterLoaded[item.id] || false;
            return (
              <div
                key={item.id}
                className="relative flex-shrink-0 w-[180px] rounded-lg bg-blue"
              >
                <HandleFavorites isRecommendations media={item as any} />
                <HandleWatched isRecommendations media={item as any} />

                <Link href={`/${item.media_type}/${item.id}`} className="block">
                  <div className="relative w-full aspect-[2/3] overflow-hidden rounded-t-lg">
                    {!isImageLoaded && (
                      <div className="absolute inset-0 bg-gray-300 animate-pulse z-10 rounded-t-lg" />
                    )}

                    <Image
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : MovieTvPlaceholder
                      }
                      alt={item.name || item.title || "Media image"}
                      width={600}
                      height={600}
                      onLoad={() =>
                        setRecoPosterLoaded((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }))
                      }
                      className="object-cover"
                    />
                  </div>

                  <div className="p-2 bg-blue rounded-b-lg">
                    <p className="text-sm text-white font-semibold truncate">
                      {item.name || item.title}
                    </p>

                    <div className="flex justify-between items-center mt-1 text-sm">
                      <span className="flex items-center gap-1 text-yellow-400">
                        <RiStarSFill size={15} /> {item.vote_average || 0}
                      </span>

                      <span className="text-white">{item.release_date}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
