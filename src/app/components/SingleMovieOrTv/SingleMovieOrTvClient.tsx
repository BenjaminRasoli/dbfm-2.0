"use client";
import { useEffect, useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import MovieTvPlaceholder from "../../images/MediaImagePlaceholder.jpg";
import { VideoTypes } from "@/app/Types/VideoTypes";
import { ActorsTypes } from "@/app/Types/ActorsTypes";
import { ReviewTypes } from "@/app/Types/ReviewTypes";
import TopBilledActors from "@/app/components/TopBilledActors/TopBilledActors";
import Reviews from "@/app/components/Reviews/Reviews";
import { MovieTypes } from "@/app/Types/MovieTypes";
import Seasons from "../Seasons/Season";
import WhereToWatch from "../WhereToWatch/WhereToWatch";
import { TvTypes } from "@/app/Types/TvTypes";
import { WatchResultsTypes } from "@/app/Types/WhereToWatchTypes";
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import HandleFavorites from "../HandleFavorites/HandleFavorites";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Head from "next/head";
import HandleWatched from "../HandleWacthed/HandleWacthed";

type MediaTypes = MovieTypes | TvTypes;

interface SingleMovieOrTvClientProps {
  mediaData: MediaTypes;
  video: VideoTypes[];
  actors: ActorsTypes[];
  reviews: ReviewTypes[];
  whereToWatch: WatchResultsTypes | null;
  type: string;
}

export default function SingleMovieOrTvClient({
  mediaData,
  video,
  actors,
  reviews,
  whereToWatch,
}: SingleMovieOrTvClientProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [trailerUrl, setTrailerUrl] = useState<string>("");
  const [posterLoaded, setPosterLoaded] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    disableOverflow(isModalOpen);
    return () => disableOverflow(false);
  }, [isModalOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) =>
      handleOutsideClick(e, modalRef, setIsModalOpen);

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

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

  useEffect(() => {
    if (mediaData) {
      const title = isMovie(mediaData) ? mediaData.title : mediaData.name;
      document.title = `DBFM | ${title}`;
    } else {
      document.title = "DBFM | Details";
    }
  }, [mediaData]);

  const userScore = Math.round(mediaData.vote_average * 10);

  const scoreColor =
    userScore >= 90
      ? "#166534"
      : userScore >= 75
      ? "#22c55e"
      : userScore >= 50
      ? "#ca8a04"
      : userScore >= 30
      ? "#ea580c"
      : "#ef4444";

  return (
    <>
      <Head>
        <meta
          name="description"
          content={
            mediaData?.overview ||
            "DBFM is a movie & TV site to discover actors and latest releases."
          }
        />
        {mediaData?.poster_path && (
          <>
            <meta
              property="og:image"
              content={`https://image.tmdb.org/t/p/original${mediaData.poster_path}`}
            />
            <meta
              name="twitter:image"
              content={`https://image.tmdb.org/t/p/original${mediaData.poster_path}`}
            />
          </>
        )}
        <meta
          property="og:description"
          content={
            mediaData?.overview ||
            "DBFM is a movie & TV site to discover actors and latest releases."
          }
        />
        <meta
          property="og:type"
          content={isMovie(mediaData!) ? "movie" : "tv_show"}
        />
      </Head>
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://image.tmdb.org/t/p/original${mediaData.backdrop_path}')`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[4px] bg-black/70" />
        </div>

        <div className="mx-auto pt-10 p-3 relative z-10 max-w-[380px] sm:max-w-[500px] md:max-w-[600px] custom-lg:max-w-[900px] 2xl:max-w-[1100px]">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="relative overflow-hidden rounded-lg shadow-lg mb-5 min-h-[600px] h-full min-w-[360px] w-full custom-lg:w-auto">
              {!posterLoaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse z-10 rounded-lg" />
              )}

              <Image
                src={
                  mediaData.poster_path
                    ? `https://image.tmdb.org/t/p/original${mediaData.poster_path}`
                    : MovieTvPlaceholder
                }
                alt={
                  isMovie(mediaData)
                    ? mediaData.original_title
                    : mediaData.original_name
                }
                fill
                className="rounded-lg shadow-lg w-full h-full object-cover"
                onLoad={() => setPosterLoaded(true)}
              />
              <HandleFavorites media={mediaData} />
              <HandleWatched media={mediaData} />
            </div>

            <div className="w-full md:w-2/3 md:ml-8 text-white">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-4xl font-bold max-w-[300px] leading-snug">
                    {isMovie(mediaData) ? mediaData.title : mediaData.name}
                  </h1>

                  {(isMovie(mediaData)
                    ? mediaData.title !== mediaData.original_title
                    : mediaData.name !== mediaData.original_name) && (
                    <h2 className="text-lg text-gray-300 italic mb-4">
                      {isMovie(mediaData)
                        ? mediaData.original_title
                        : mediaData.original_name}
                    </h2>
                  )}
                </div>

                <h3 className="text-gray-400 opacity-80 text-lg whitespace-nowrap">
                  {isMovie(mediaData) ? "(Movie)" : "(Tv)"}
                </h3>
              </div>

              <div className="grid custom-lg:flex">
                <p className="text-lg">
                  {isMovie(mediaData)
                    ? mediaData.release_date || "Unknown Date"
                    : mediaData.first_air_date || mediaData.last_air_date
                    ? `${mediaData.first_air_date || ""}${
                        mediaData.first_air_date && mediaData.last_air_date
                          ? " - "
                          : ""
                      }${mediaData.last_air_date || ""}`
                    : "Unknown Date"}
                </p>

                {(isMovie(mediaData) && mediaData.runtime > 0) ||
                (!isMovie(mediaData) && mediaData.episode_run_time[0] > 0) ? (
                  <>
                    <span className="hidden custom-lg:block text-lg mx-2">
                      •
                    </span>
                    <p className="text-lg">
                      {isMovie(mediaData)
                        ? `${mediaData.runtime} mins`
                        : `${mediaData.episode_run_time[0]} mins`}
                    </p>
                  </>
                ) : null}
              </div>

              <div className="flex flex-col items-start space-y-2 mb-6">
                <p className="text-xl font-bold">User Score</p>
                <div className="w-14 h-14">
                  <CircularProgressbar
                    value={userScore}
                    text={`${userScore}%`}
                    styles={buildStyles({
                      pathColor: scoreColor,
                      textColor: scoreColor,
                      textSize: "24px",
                    })}
                  />
                </div>
              </div>

              <h1 className="font-bold text-xl">Overview</h1>
              <p className="text-lg mb-6">
                {mediaData.overview || "No overview"}
              </p>

              <div className="space-x-1 mb-6">
                <p className="text-xl font-bold">Genres</p>
                {mediaData?.genres?.length > 0
                  ? mediaData?.genres?.map((genre, index) => (
                      <span key={genre.id} className="text-lg">
                        {genre.name ?? "Unknown Genre"}
                        {index < mediaData.genres.length - 1 && ", "}
                      </span>
                    ))
                  : "Unknown Genre"}
              </div>

              {!isMovie(mediaData) && (
                <div className="space-x-1 mb-6">
                  <p className="text-xl font-bold">Status</p>
                  {mediaData?.status ? (
                    <span className="text-lg">{mediaData.status}</span>
                  ) : (
                    "Unknown Status"
                  )}
                </div>
              )}
              {isMovie(mediaData) && (
                <>
                  {(mediaData.budget > 0 || mediaData.revenue > 0) && (
                    <>
                      {mediaData.budget > 0 && (
                        <>
                          <h1 className="font-bold text-xl">Budget</h1>
                          <p className="text-lg mb-6">
                            {"$" + mediaData.budget}
                          </p>
                        </>
                      )}

                      {mediaData.revenue > 0 && (
                        <>
                          <h1 className="font-bold text-xl">Revenue</h1>
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
          <div className="fixed inset-0 flex justify-center items-center z-[55]">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div
              ref={modalRef}
              className="
    bg-white dark:bg-dark p-7 rounded-lg w-[95%] h-[40%] custom-md:h-[60%] md:h-[80%] lg:h-[95%] relative z-10"
            >
              <div className="flex justify-between">
                <h4 className="text-xl"> Play Trailer</h4>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-2xl font-bold pb-5 cursor-pointer hover:text-red-hover"
                >
                  <FaWindowClose />
                </button>
              </div>
              <iframe
                className="pb-5"
                width="100%"
                height="95%"
                src={trailerUrl}
                title="Trailer"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
