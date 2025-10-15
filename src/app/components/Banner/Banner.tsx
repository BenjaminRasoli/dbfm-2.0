"use client";
import React, { useEffect, useState } from "react";
import { MediaTypes } from "@/app/Types/MediaTypes";
import Image from "next/image";

function Banner() {
  const [media, setMedia] = useState<MediaTypes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getMedias?type=movie&page=1`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const selectedMedia = data.results[randomIndex];
          setMedia(selectedMedia);
        }
      } catch (err) {
        console.error("Error fetching trending for banner:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const title = media?.title || media?.name || "Featured Media";

  const backdropUrl = media?.backdrop_path
    ? `https://media.themoviedb.org/t/p/w1920_and_h600_multi_faces_filter(duotone,00192f,00baff)${media.backdrop_path}`
    : "";

  return (
    <div className="relative w-full h-[40dvh] text-white overflow-hidden">
      <div className="absolute inset-0">
        {loading ? (
          <div className="w-full h-full bg-gray-400 animate-pulse" />
        ) : media?.backdrop_path ? (
          <Image
            src={backdropUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-500 flex items-center justify-center">
            <span className="text-white text-lg">No image available</span>
          </div>
        )}

        <div className="absolute inset-0 bg-blue opacity-20 dark:opacity-30 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/20 dark:from-dark/95 via-transparent to-transparent transition-all duration-1000 ease-in-out" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 py-16 sm:py-24">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">Welcome.</h1>
        <p className="mt-4 max-w-xl text-lg drop-shadow-md">
          Millions of movies, TV shows and people to discover. Explore now.
        </p>
      </div>
    </div>
  );
}

export default Banner;
