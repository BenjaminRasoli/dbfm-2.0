import { ReviewTypes } from "@/app/Types/ReviewTypes";
import Image from "next/image";
import { LiaStarSolid } from "react-icons/lia";
import Carousel from "react-multi-carousel";

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

function Reviews({ reviews }: { reviews: ReviewTypes[] }) {
  return (
    <div className="my-8">
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
                  className="rounded-lg text-white px-5 md:px-25 py-10  h-[400px] overflow-auto"
                >
                  <div className="flex items-center space-x-4">
                    {review.author_details.avatar_path ? (
                      <Image
                        width={50}
                        height={50}
                        src={`https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`}
                        alt={review.author}
                        className="rounded-full"
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
                        {new Date(review.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <p
                    className="mt-2"
                    dangerouslySetInnerHTML={{ __html: review.content }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </>
      )}
    </div>
  );
}

export default Reviews;
