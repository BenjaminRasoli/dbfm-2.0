"use client";
import { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { LiaStarSolid } from "react-icons/lia";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import Image from "next/image";
import SingleSkeletonLoader from "../../../components/SingleMovieSkeletonLoader/SingleSkeletonLoader";
import poster from "../../../images/poster-image.png";
import personPoster from "../../../images/personPlaceHolder.jpg";
import { MovieTypes } from "@/app/Types/MovieType";
import { VideoTypes } from "@/app/Types/VideoTypes";
import { ActorTypes } from "@/app/Types/ActorTypes";
import { ReviewTypes } from "@/app/Types/ReviewTypes";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

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

        <div className="mt-8">
          {actors.length > 0 && (
            <h2 className="text-2xl font-bold text-white">Top Billed Cast</h2>
          )}
          <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
            {actors?.map((actor) => (
              <Link key={actor.id} href={`/actor/${actor.id}`}>
                <div className="bg-blue rounded-lg w-40 flex flex-col h-[300px]">
                  {actor.profile_path ? (
                    <Image
                      height={200}
                      width={200}
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-[200px] rounded-t-lg object-cover"
                    />
                  ) : (
                    <Image
                      height={840}
                      width={840}
                      src={personPoster}
                      alt={actor.name}
                      className="w-full h-[840px] rounded-t-lg object-cover"
                    />
                  )}
                  <div className="flex flex-col pl-1 mb-7 h-full">
                    <h3 className="text-white font-bold mt-2 text-ellipsis">
                      {actor.name}
                    </h3>
                    <p className="text-white text-xs">{actor.character}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {reviews.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-white">Reviews</h2>
              <div className="mt-4 bg-blue rounded-md overflow-auto">
                <Carousel
                  responsive={responsive}
                  swipeable={true}
                  draggable={true}
                  ssr={true}
                  infinite={true}
                  keyBoardControl={true}
                  transitionDuration={500}
                  renderButtonGroupOutside={true}
                >
                  {reviews?.map((review, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-lg text-white opacity-100 h-[300px] overflow-auto"
                    >
                      <div className=" flex items-center space-x-4">
                        {review.author_details.avatar_path ? (
                          <Image
                            width={50}
                            height={50}
                            src={`https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`}
                            alt={review.author}
                            className="rounded-full "
                          />
                        ) : (
                          <span className="text-black bg-gray-600 rounded-full p-2 w-12 h-12 flex items-center justify-center text-center">
                            {review.author[0]}
                          </span>
                        )}
                        <div className="flex flex-col justify-start">
                          <div className="flex items-center gap-1">
                            <h3 className="text-xl font-semibold mr-3 ">
                              {review.author}
                            </h3>
                            {review.author_details.rating && (
                              <>
                                <LiaStarSolid className="text-yellow" />
                                <span className="text-yellow">
                                  {review.author_details.rating}
                                </span>
                              </>
                            )}
                          </div>
                          <span className="text-sm text-white mt-1">
                            Written on{" "}
                            {new Date(review.created_at).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <p
                        className="mt-2 text-lg"
                        dangerouslySetInnerHTML={{ __html: review.content }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </>
          )}
        </div>
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
