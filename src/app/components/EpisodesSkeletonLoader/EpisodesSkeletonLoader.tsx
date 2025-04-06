function EpisodesSkeletonLoader() {
  return (
    <div className="relative bg-cover bg-center py-5 p-4">
      <div className="absolute inset-0 z-0  bg-white dark:bg-dark"></div>
      <div className="relative mx-auto z-10 max-w-[300px] sm:max-w-[570px] md:max-w-[550px] custom:max-w-[950px] ">
        <div className="bg-gray-300 h-10 w-32 rounded-lg mb-5 animate-pulse"></div>
        <div className="flex gap-3 flex-col md:flex-row md:justify-between md:items-center mb-6 mt-6">
          <div className="bg-gray-300 h-10 w-32 rounded-lg animate-pulse"></div>
          <div className="bg-gray-300 h-10 w-32 rounded-lg animate-pulse"></div>
        </div>
        <div className="text-white mb-6">
          <div className="bg-gray-300 h-6 w-48 rounded-lg mb-2 animate-pulse"></div>
          <div className="bg-gray-300 h-6 w-64 rounded-lg animate-pulse"></div>
        </div>
        <div className="mt-10 pb-5 flex  overflow-auto gap-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 rounded-lg w-[250px] sm:w-[320px] animate-pulse"
            >
              <div className="bg-gray-400 rounded-t-lg h-48 w-full"></div>
              <div className="p-4">
                <div className="flex justify-between">
                  <div className="bg-gray-400 rounded h-4 w-24 mb-2 animate-pulse"></div>
                  <div className="bg-gray-400 rounded h-4 w-10 mb-2 animate-pulse"></div>
                </div>

                <div className="bg-gray-400 rounded h-3 w-48 mb-2 animate-pulse"></div>
                <div className="bg-gray-400 rounded h-15 w-50 mb-2 animate-pulse"></div>
                <div className="bg-gray-400 rounded h-3 w-40 mb-2 animate-pulse"></div>
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
