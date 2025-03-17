"use client";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import SingleSkeletonLoader from "../../../components/SingleMovieSkeletonLoader/SingleSkeletonLoader";
import poster from "../../../images/poster-image.png";
import { MovieTypes } from "@/app/Types/MovieType";
import { VideoTypes } from "@/app/Types/VideoTypes";
import { ActorTypes } from "@/app/Types/ActorTypes";
import { ReviewTypes } from "@/app/Types/ReviewTypes";
import TopBilledActors from "@/app/components/TopBilledActors/TopBilledActors";
import Reviews from "@/app/components/Reviews/Reviews";

function Page({ params }: { params: Promise<{ slug: string }> }) {
  const [movieData, setMovieData] = useState<MovieTypes | null>(null);
  const [video, setVideo] = useState<VideoTypes[]>([]);
  const [actors, setActors] = useState<ActorTypes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [trailerUrl, setTrailerUrl] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewTypes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_LOCAL_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=movie`
      );
      const data = await response.json();
      setMovieData(data.movieData);
      setReviews(data.reviewsData);
      setVideo(data.videoData.results);
      setActors(data.actorsData.slice(0, 10));
    };
    fetchData();
  }, [params]);

  const handlePlayTrailer = (video: VideoTypes[]) => {
    const trailer = video.find((vid) => vid.type === "Trailer");
    if (trailer) {
      setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
      setIsModalOpen(true);
    }
  };

  if (!movieData) {
    return <SingleSkeletonLoader />;
  }

  const userScore = Math.round(movieData.vote_average * 10);

  const scoreColor =
    userScore >= 90
      ? "bg-green-800"
      : userScore >= 75
      ? "bg-green-500"
      : userScore >= 50
      ? "bg-yellow-600"
      : userScore >= 30
      ? "bg-orange-600"
      : "bg-red-600";

  return (
    <div
      className="relative bg-cover bg-center p-5"
      style={{
        backgroundImage: `url('https://image.tmdb.org/t/p/original${movieData.backdrop_path}')`,
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      ></div>
      <div className="container mx-auto relative z-10 max-w-[280px] sm:max-w-[570px] md:max-w-[550px] custom:max-w-[900px]">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-4 md:mb-0">
            <Image
              height={370}
              width={370}
              src={
                movieData.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                  : poster
              }
              alt={movieData.original_title}
              className="rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full md:w-2/3 md:ml-8 text-white">
            <h1 className="text-4xl font-bold mb-4">
              {movieData.original_title
                ? movieData.original_title
                : "Unknown Title"}
            </h1>

            <div className="grid custom:flex items-center mb-4">
              <p className="text-lg">
                {movieData.release_date
                  ? movieData.release_date
                  : "Unknown Release Date"}
              </p>

              <span className="hidden custom:block text-lg mx-2">•</span>
              <div className="flex space-x-2">
                {movieData?.genres?.length > 0
                  ? movieData?.genres?.map((genre, index) => (
                      <span key={genre.id} className="text-lg">
                        {genre.name ?? "Unknown Genre"}
                        {index < movieData.genres.length - 1 && ", "}
                      </span>
                    ))
                  : "Unknown Genre"}
              </div>

              <span className="hidden custom:block text-lg mx-2">•</span>
              <p className="text-lg">
                {movieData.runtime
                  ? movieData.runtime + " mins"
                  : "Unknown Runtime"}
              </p>
            </div>

            <div className="flex flex-row items-center space-x-4 mb-4">
              <p className="text-lg font-bold">
                User Score:
                <span
                  className={`ml-2 p-2 ${scoreColor} w-12 h-12 flex items-center justify-center text-center rounded-full`}
                >
                  {userScore}%
                </span>
              </p>
            </div>
            <h1 className="font-bold text-xl">Overview:</h1>
            <p className="text-lg mb-4">
              {movieData.overview || "No overview"}
            </p>
            <h1 className="font-bold text-xl">Budget:</h1>
            <p className="text-lg mb-4">${movieData.budget || 0}</p>
            <h1 className="font-bold text-xl">Revenue:</h1>
            <p className="text-lg mb-4">${movieData.revenue || 0}</p>
            {video.some((vid) => vid.type === "Trailer") && (
              <button
                className="bg-blue hover:bg-blue-hover text-white py-2 mb-2 px-4 rounded-full cursor-pointer"
                onClick={() => handlePlayTrailer(video)}
              >
                Play Trailer
              </button>
            )}
          </div>
        </div>
        <TopBilledActors actors={actors} />
        <Reviews reviews={reviews} />
      </div>

      {isModalOpen && trailerUrl && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-4 rounded-lg w-[90%]  relative z-10">
            <div className="flex justify-between">
              <h4 className="text-xl"> Play Trailer</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black text-2xl font-bold pb-5 cursor-pointer hover:text-blue"
              >
                <FaWindowClose />
              </button>
            </div>
            <iframe
              width="100%"
              height="400"
              src={trailerUrl}
              title="Trailer"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
