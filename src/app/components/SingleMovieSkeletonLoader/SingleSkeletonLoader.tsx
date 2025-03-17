function SingleSkeletonLoader() {
  return (
    <div className="relative bg-cover bg-center p-5">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      ></div>
      <div className="container mx-auto relative z-10 max-w-[280px] sm:max-w-[570px] md:max-w-[550px] custom:max-w-[900px]">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0">
          <div className="mb-4 md:mb-0 md:w-2/3">
            <div className="w-[300px] h-[450px] bg-gray-300 animate-pulse rounded-md" />
          </div>

          <div className="w-full  md:ml-4 text-white">
            <div className="mb-4">
              <div className="w-3/4 h-8 bg-gray-300 animate-pulse rounded-md" />
            </div>
            <div className="grid custom:flex items-center mb-4 space-y-2 md:space-y-0 md:grid-cols-3">
              <div className="w-3/4 h-6 bg-gray-300 animate-pulse rounded-md" />
              <span className="hidden custom:block text-lg mx-2">•</span>
              <div className="w-3/4 h-6 bg-gray-300 animate-pulse rounded-md" />
              <span className="hidden custom:block text-lg mx-2">•</span>
              <div className="w-3/4 h-6 bg-gray-300 animate-pulse rounded-md" />
            </div>
            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-3/4 h-40 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
            <div className="w-1/4 h-6 bg-gray-300 animate-pulse rounded-md mb-4" />
          </div>
        </div>

        <div className="mt-8">
          <div className="w-1/2 h-12 bg-gray-300 animate-pulse rounded-md mb-4" />
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
