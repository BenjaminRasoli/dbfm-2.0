import { MediaTypes } from "@/app/Types/MediaTypes";
import { MovieTypes } from "@/app/Types/MovieTypes";
import { TvTypes } from "@/app/Types/TvTypes";

function SingleSkeletonLoader({
  mediaData,
}: {
  mediaData: MediaTypes | MovieTypes | TvTypes | null;
}) {
  const isMovie = mediaData && mediaData.original_title !== undefined;

  return (
    <div className="relative bg-cover bg-center mt-5">
      <div className="absolute inset-0 z-0 bg-white dark:bg-dark"></div>

      <div className="relative z-10 pt-6 lg:p-6 customContainer">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="mb-4 lg:mb-0 w-full md:max-w-[300px] custom-lg:max-w-[360px] flex-shrink-0">
            <div className="w-full h-[525px] md:h-[450px] custom-lg:h-[595px]  bg-gray-300 animate-pulse rounded-md" />
          </div>

          <div className="w-full text-white">
            <div className="flex justify-between items-center gap-2">
              <div className="w-[150px] h-8 bg-gray-300 animate-pulse rounded-md" />
              <div className="w-[70px] h-8 bg-gray-300 animate-pulse rounded-md" />
            </div>

            <div className="grid custom-lg:flex flex-wrap gap-2 my-4">
              <div className="w-[200px] h-6 bg-gray-300 animate-pulse rounded-md" />
              {!isMovie && (
                <div className="w-[80px] h-6 bg-gray-300 animate-pulse rounded-md" />
              )}
            </div>

            <div className="w-1/3 h-8 bg-gray-300 animate-pulse rounded-md mb-6 mt-4" />

            <div className="w-12 h-12 bg-gray-300 animate-pulse mb-4 rounded-full" />

            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="max-w-3xl h-40 bg-gray-300 animate-pulse rounded-md mb-4" />

            <div className="w-[80px] h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-[180px] h-6 bg-gray-300 animate-pulse rounded-md mb-4" />

            {!isMovie ? (
              <>
                <div className="w-[80px] h-6 bg-gray-300 animate-pulse rounded-md mb-4 " />
                <div className="w-[70px] h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
              </>
            ) : (
              <>
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4 mt-7" />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-10" />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
              </>
            )}

            <div className="w-32 h-8 bg-gray-300 animate-pulse rounded-full mb-4" />
          </div>
        </div>

        <div className="mt-8">
          <div className="w-1/4 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="flex overflow-x-auto space-x-4 pb-4 max-w-full">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 animate-pulse rounded-lg w-28 h-[105px]"
              />
            ))}
          </div>
        </div>

        {!isMovie && (
          <div className="mt-8">
            <div className="w-1/4 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-1/5 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-300 rounded-lg flex-shrink-0 p-3 w-[230px] flex flex-col"
                >
                  <div className="w-full h-[290px] bg-white animate-pulse rounded-lg" />
                  <div className="flex flex-col pt-2">
                    <div className="w-3/4 h-6 bg-white animate-pulse rounded-md mb-2" />
                    <div className="w-1/2 h-6 bg-white animate-pulse rounded-md mb-2" />
                    <div className="w-1/2 h-6 bg-white animate-pulse rounded-md mb-2" />
                    <div className="w-3/4 h-6 bg-white animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="w-1/4 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />

          <div className="flex overflow-x-auto space-x-4 pb-4">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-lg w-[170px] h-[300px] flex-shrink-0 flex flex-col"
              >
                <div className="w-full h-40 bg-gray-300 animate-pulse rounded-t-lg" />

                <div className="flex flex-col pt-2 px-2">
                  <div className="w-3/4 h-6 bg-white animate-pulse rounded-md mb-2" />
                  <div className="w-1/2 h-6 bg-white animate-pulse rounded-md mb-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="w-[120px] h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="space-y-4">
            <div className="w-full h-80 bg-gray-300 animate-pulse rounded-md" />
          </div>
        </div>

        {isMovie && (
          <div className="w-full h-[49vh] relative bg-gray-300 rounded-lg animate-pulse mt-24" />
        )}
        <div className="mt-8">
          <div className="w-1/4 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[180px] bg-dark rounded-lg shadow-lg animate-pulse"
              >
                <div className="relative w-full h-[220px] bg-gray-300 rounded-t-lg" />

                <div className="p-2 bg-gray-300 rounded-b-lg py-4">
                  <div className="w-full h-4 bg-white rounded-md mb-2" />
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1 w-12 h-3 bg-white rounded-md" />
                    <div className="w-10 h-3 bg-white rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleSkeletonLoader;
