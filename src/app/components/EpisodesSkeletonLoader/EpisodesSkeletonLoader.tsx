function EpisodesSkeletonLoader() {
  return (
    <div className="relative bg-cover bg-center pt-30">
      <div className="absolute inset-0 z-0  bg-white dark:bg-dark"></div>
      <div className="relative customContainer z-10 !pt-4">
        <div className="bg-gray-300 h-8 w-16 rounded-lg mb-5 animate-pulse"></div>
        <div className="flex gap-3 flex-col md:flex-row md:justify-between md:items-center mb-6 mt-6">
          <div className="bg-gray-300 h-10 w-38 rounded-lg animate-pulse"></div>
          <div className="bg-gray-300 h-10 w-38 rounded-lg animate-pulse"></div>
        </div>
        <div className="text-white mb-6">
          <div className="bg-gray-300 h-6 w-25 rounded-lg mb-2 animate-pulse"></div>
          <div className="bg-gray-300 h-5 w-35 rounded-lg animate-pulse"></div>
        </div>
        <div className="mt-8 pb-5 flex overflow-auto gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 rounded-lg min-w-[250px] sm:min-w-[300px] animate-pulse"
            >
              <div className="bg-gray-400 rounded-t-lg h-42 w-full"></div>
              <div className="p-4">
                <div className="flex justify-between">
                  <div className="bg-gray-400 rounded h-4 w-24 mb-2 animate-pulse"></div>
                  <div className="bg-gray-400 rounded h-4 w-10 mb-2 animate-pulse"></div>
                </div>

                <div className="bg-gray-400 rounded h-3 w-30 mb-2 animate-pulse"></div>
                <div className="bg-gray-400 rounded h-30 my-4 w-50 mb-2 animate-pulse"></div>
                <div className="bg-gray-400 rounded h-3 w-30 mb-2 animate-pulse"></div>
                <div className="bg-gray-400 rounded h-3 w-40 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EpisodesSkeletonLoader;
