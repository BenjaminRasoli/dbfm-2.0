import { MediaTypes } from "@/app/Types/MediaTypes";

function SingleSkeletonLoader({ mediaData }: { mediaData: MediaTypes | null }) {
  const isMovie = mediaData && mediaData.original_title !== undefined;

  return (
    <div className="relative bg-cover bg-center p-5 mt-5">
      <div className="absolute inset-0 z-0 bg-white dark:bg-dark"></div>

      <div className="mx-auto relative z-10 p-3 max-w-[400px] sm:max-w-[500px] md:max-w-[600px] custom-lg:max-w-[900px] 2xl:max-w-[1100px]">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="mb-4 lg:mb-0 w-full md:max-w-[300px] custom-lg:max-w-[360px] flex-shrink-0">
            <div className="w-full h-[525px] md:h-[450px] custom-lg:h-[595px]  bg-gray-300 animate-pulse rounded-md" />
          </div>

          <div className="w-full text-white">
            <div className="flex justify-between items-center gap-2">
              <div className="w-2/4 h-8 bg-gray-300 animate-pulse rounded-md" />
              <div className="w-1/6 h-8 bg-gray-300 animate-pulse rounded-md" />
            </div>

            <div className="flex flex-wrap gap-2 my-4">
              <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md" />
              {!isMovie && (
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md" />
              )}
            </div>

            <div className="w-1/3 h-8 bg-gray-300 animate-pulse rounded-md mb-6 mt-4" />

            <div className="w-12 h-12 bg-gray-300 animate-pulse mb-4 rounded-full" />

            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-full h-40 bg-gray-300 animate-pulse rounded-md mb-4" />

            <div className="w-1/3 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-1/2 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />

            {!isMovie ? (
              <>
                <div className="w-1/3 h-6 bg-gray-300 animate-pulse rounded-md mb-4 " />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
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
                className="bg-gray-300 animate-pulse rounded-lg w-32 h-[150px]"
              />
            ))}
          </div>
        </div>

        {!isMovie && (
          <div className="mt-8">
            <div className="w-1/4 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-1/5 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="flex overflow-x-auto space-x-4 pb-4 max-w-full">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-300 rounded-lg p-3 w-60 flex flex-col"
                >
                  <div className="w-full h-40 bg-white animate-pulse rounded-lg" />
                  <div className="flex flex-col pt-2">
                    <div className="w-3/4 h-6 bg-white animate-pulse rounded-md mb-2" />
                    <div className="w-1/2 h-6 bg-white animate-pulse rounded-md mb-2" />
                    <div className="w-1/2 h-6 bg-white animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="w-1/4 h-8 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="flex overflow-x-auto space-x-4 pb-4 max-w-full">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-lg w-40 flex flex-col"
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
          <div className="w-1/3 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="space-y-4">
            <div className="w-full h-80 bg-gray-300 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleSkeletonLoader;
