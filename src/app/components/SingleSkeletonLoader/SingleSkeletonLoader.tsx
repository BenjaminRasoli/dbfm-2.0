import { MediaTypes } from "@/app/Types/MediaTypes";

function SingleSkeletonLoader({ mediaData }: { mediaData: MediaTypes | null }) {
  const isMovie = mediaData && mediaData.original_title !== undefined;

  return (
    <div className="relative bg-cover bg-center p-5">
      <div className="absolute inset-0 z-0 bg-white dark:bg-dark"></div>
      <div className="mx-auto relative z-10 max-w-[350px] sm:max-w-[520px] md:max-w-[550px] custom-lg:max-w-[900px]">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
          <div className="mb-4 md:mb-0">
            <div className="w-[300px] h-[450px] bg-gray-300 animate-pulse rounded-md" />
          </div>

          <div className="w-full  md:ml-10 text-white">
            <div className="mb-4 flex justify-between">
              <div className="w-2/4 h-8 bg-gray-300 animate-pulse rounded-md" />
              <div className="w-1/6 h-8 bg-gray-300 animate-pulse rounded-md" />
            </div>

            <div className="grid custom-lg:flex items-center mb-4 space-y-2 md:space-y-0 md:grid-cols-3"></div>
            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md" />
            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4 mt-10" />
            <div className="w-12 h-12 bg-gray-300 animate-pulse mb-4 rounded-full" />
            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-2/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-3/4 h-40 bg-gray-300 animate-pulse rounded-md mb-4" />
            {isMovie && (
              <>
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
                <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
              </>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="w-1/4 h-12 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 animate-pulse rounded-lg w-32 flex flex-col h-[150px] "
              >
                <div className="flex flex-col pt-2 pl-1 mb-7 h-full"></div>
              </div>
            ))}
          </div>
        </div>
        {!isMovie && (
          <div className="mt-8">
            <div className="w-1/7 h-7 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-1/5 h-7 bg-gray-300 animate-pulse rounded-md mb-4" />

            <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 w-60 flex flex-col h-full"
                >
                  <div className="w-full h-70   bg-gray-300 animate-pulse rounded-lg" />
                  <div className="flex flex-col  pt-2 pl-1 mb-7 h-full">
                    <div className="w-1/2 h-6 bg-gray-300 animate-pulse rounded-md mb-2" />
                    <div className="w-1/2 h-6 bg-gray-300 animate-pulse rounded-md mb-2" />
                    <div className="w-1/2 h-6 bg-gray-300 animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="w-1/4 h-12 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="flex overflow-x-auto mt-4 pb-4 space-x-4 max-w-full">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg w-40 flex flex-col h-full"
              >
                <div className="w-full h-40 bg-gray-300 animate-pulse rounded-t-lg" />
                <div className="flex flex-col pt-2 pl-1 mb-7 h-full">
                  <div className="w-3/4 h-6 bg-gray-300 animate-pulse rounded-md mb-2" />
                  <div className="w-1/2 h-6 bg-gray-300 animate-pulse rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="w-1/3 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
          <div className="space-y-4">
            {[...Array(1)].map((_, index) => (
              <div
                key={index}
                className="w-full h-64 bg-gray-300 animate-pulse rounded-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleSkeletonLoader;
