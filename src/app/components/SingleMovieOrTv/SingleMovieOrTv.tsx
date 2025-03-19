"use client";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import SingleSkeletonLoader from "../SingleSkeletonLoader/SingleSkeletonLoader";
import poster from "../../images/poster-image.png";
import { VideoTypes } from "@/app/Types/VideoTypes";
import { ActorsTypes } from "@/app/Types/ActorsTypes";
import { ReviewTypes } from "@/app/Types/ReviewTypes";
import TopBilledActors from "@/app/components/TopBilledActors/TopBilledActors";
import Reviews from "@/app/components/Reviews/Reviews";
import { MovieTypes } from "@/app/Types/MovieTypes";
import { usePathname } from "next/navigation";
import Seasons from "../Seasons/Season";
import WhereToWatch from "../WhereToWatch/WhereToWatch";
import { TvTypes } from "@/app/Types/TvTypes";
import { WatchResultsTypes } from "@/app/Types/WhereToWatchTypes";

type MediaTypes = MovieTypes | TvTypes;

function SingleMovieOrTv({ params }: { params: { slug: string } }) {
  const [mediaData, setMediaData] = useState<MediaTypes | null>(null);
  const [video, setVideo] = useState<VideoTypes[]>([]);
  const [actors, setActors] = useState<ActorsTypes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [trailerUrl, setTrailerUrl] = useState<string>("");
  const [reviews, setReviews] = useState<ReviewTypes[]>([]);
  const [whereToWatch, setWhereToWatch] = useState<WatchResultsTypes | null>(
    null
  );

  const pathname = usePathname();
  let type = "";
  if (pathname.startsWith("/movie")) {
    type = "movie";
  } else if (pathname.startsWith("/tv")) {
    type = "tv";
  }

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=${type}`
      );
      const wereToWatchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getWhereToWatch?id=${slug}&type=${type}`
      );
      const data = await response.json();
      const wereToWatchData = await wereToWatchResponse.json();
      setMediaData(data.mediaData);
      setReviews(data.reviewsData);
      setVideo(data.videoData.results);
      setActors(data.actorsData.slice(0, 10));
      setWhereToWatch(wereToWatchData.results);
    };
    fetchData();
  }, [params, type]);

  const handlePlayTrailer = (video: VideoTypes[]) => {
    const trailer = video.find((vid) => vid.type === "Trailer");
    if (trailer) {
      setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
      setIsModalOpen(true);
    }
  };

  const isMovie = (data: MediaTypes): data is MovieTypes => {
    return (data as MovieTypes).original_title !== undefined;
  };

  if (!mediaData) {
    return <SingleSkeletonLoader mediaData={mediaData} />;
  }

  const userScore = Math.round(mediaData.vote_average * 10);

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
        backgroundImage: `url('https://image.tmdb.org/t/p/original${mediaData.backdrop_path}')`,
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
          <div className="mb-6 md:mb-0">
            <Image
              height={370}
              width={370}
              src={
                mediaData.poster_path
                  ? `https://image.tmdb.org/t/p/w500${mediaData.poster_path}`
                  : poster
              }
              alt={
                isMovie(mediaData)
                  ? mediaData.original_title
                  : mediaData.original_name
              }
              className="rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full md:w-2/3 md:ml-8 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold mb-2 max-w-[300px]">
                {isMovie(mediaData) ? mediaData.title : mediaData.name}
              </h1>
              <div className="grid custom:flex">
                <p className="text-lg">
                  {isMovie(mediaData)
                    ? mediaData.release_date
                    : mediaData.first_air_date || "Unknown Date"}
                </p>

                <span className="hidden custom:block text-lg mx-2">•</span>
                <p className="text-lg">
                  {isMovie(mediaData)
                    ? mediaData.runtime > 0
                      ? mediaData.runtime + " mins"
                      : "Unknown Runtime"
                    : mediaData.episode_run_time[0] > 0
                    ? mediaData.episode_run_time + " mins"
                    : "Unknown Runtime"}
                </p>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">
              {isMovie(mediaData)
                ? mediaData.title !== mediaData.original_title &&
                  mediaData.original_title
                : mediaData.name !== mediaData.original_name &&
                  mediaData.original_name}
            </h1>

            <div className="flex flex-row items-center space-x-4 mb-6">
              <p className="text-xl font-bold">
                User Score:
                <span
                  className={`ml-2 p-2 ${scoreColor} w-12 h-12 flex items-center justify-center text-center rounded-full`}
                >
                  {userScore}%
                </span>
              </p>
            </div>

            <div className="space-x-1 mb-6">
              <p className="text-xl font-bold">Genres:</p>
              {mediaData?.genres?.length > 0
                ? mediaData?.genres?.map((genre, index) => (
                    <span key={genre.id} className="text-lg">
                      {genre.name ?? "Unknown Genre"}
                      {index < mediaData.genres.length - 1 && ", "}
                    </span>
                  ))
                : "Unknown Genre"}
            </div>

            <h1 className="font-bold text-xl">Overview:</h1>
            <p className="text-lg mb-6">
              {mediaData.overview || "No overview"}
            </p>

            {isMovie(mediaData) && (
              <>
                {(mediaData.budget > 0 || mediaData.revenue > 0) && (
                  <>
                    {mediaData.budget > 0 && (
                      <>
                        <h1 className="font-bold text-xl">Budget:</h1>
                        <p className="text-lg mb-6">{"$" + mediaData.budget}</p>
                      </>
                    )}

                    {mediaData.revenue > 0 && (
                      <>
                        <h1 className="font-bold text-xl">Revenue:</h1>
                        <p className="text-lg mb-4">
                          {"$" + mediaData.revenue}
                        </p>
                      </>
                    )}
                  </>
                )}
              </>
            )}

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
        <WhereToWatch whereToWatch={whereToWatch!} />
        {!isMovie(mediaData) &&
          mediaData.seasons &&
          mediaData.seasons.length > 0 && <Seasons mediaData={mediaData} />}
        <TopBilledActors actors={actors} />
        <Reviews reviews={reviews} />
      </div>

      {isModalOpen && trailerUrl && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-4 rounded-lg w-[90%] relative z-10">
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

export default SingleMovieOrTv;
