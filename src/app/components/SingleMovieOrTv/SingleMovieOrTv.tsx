"use client";
import { useEffect, useRef, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import Image from "next/image";
import SingleSkeletonLoader from "../SingleSkeletonLoader/SingleSkeletonLoader";
import MovieTvPlaceholder from "../../images/MediaImagePlaceholder.jpg";
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
import { disableOverflow } from "@/app/utils/HandleDOM";
import { handleOutsideClick } from "@/app/utils/HandleOutsideClick";
import HandleFavorites from "../HandleFavorites/HandleFavorites";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
      setActors(data.actorsData);
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

  useEffect(() => {
    if (mediaData) {
      const title = isMovie(mediaData) ? mediaData.title : mediaData.name;
      document.title = `DBFM | ${title}`;
    } else {
      document.title = "DBFM | Details";
    }
  }, [mediaData]);

  if (!mediaData) {
    return <SingleSkeletonLoader mediaData={mediaData} />;
  }

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

      <div className="mx-auto pt-10 relative z-10 max-w-[380px] sm:max-w-[520px] md:max-w-[550px] custom:max-w-[900px]">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="relative mb-6 md:mb-0">
            <Image
              height={470}
              width={470}
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
              className="rounded-lg shadow-lg "
            />
            <HandleFavorites media={mediaData} />
          </div>

          <div className="w-full md:w-2/3 md:ml-8 text-white">
            <div className="flex justify-between items-center gap-2">
              <h1 className="text-4xl font-bold mb-2 max-w-[300px]">
                {isMovie(mediaData) ? mediaData.title : mediaData.name}
              </h1>
              <h4 className="text-gray-400 opacity-80">
                {isMovie(mediaData) ? "(Movie)" : "(Tv)"}
              </h4>
            </div>
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
            <h1 className="text-4xl font-bold mb-6">
              {isMovie(mediaData)
                ? mediaData.title !== mediaData.original_title &&
                  mediaData.original_title
                : mediaData.name !== mediaData.original_name &&
                  mediaData.original_name}
            </h1>

            <div className="flex flex-col items-start space-y-2 mb-6">
              <p className="text-xl font-bold">User Score:</p>
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
        <div className="fixed inset-0 flex justify-center items-center z-[55]">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div
            ref={modalRef}
            className="bg-white dark:bg-dark p-7 rounded-lg w-[90%] h-[90%] relative z-10"
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
  );
}

export default SingleMovieOrTv;
