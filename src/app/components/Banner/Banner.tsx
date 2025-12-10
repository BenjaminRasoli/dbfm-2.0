"use client";
import React from "react";
import Image from "next/image";
import { BannerProps } from "@/app/Types/BannerProps";

function Banner({ backdropPath }: BannerProps) {
  const backdropUrl = backdropPath
    ? `https://media.themoviedb.org/t/p/w1920_and_h600_multi_faces_filter(duotone,00192f,00baff)${backdropPath}`
    : "";

  return (
    <div className="relative w-full h-[40dvh] text-white overflow-hidden">
      <div className="absolute inset-0">
        {backdropPath ? (
          <Image
            src={backdropUrl}
            alt="Featured Media"
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
