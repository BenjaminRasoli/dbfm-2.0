function ActorSkeletonLoader() {
  return (
    <div className="min-h-screen">
      <div className="p-7 max-w-[350px] sm:max-w-[500px] md:max-w-[600px] custom-lg:max-w-[900px] 2xl:max-w-[1100px] mx-auto  rounded-lg flex flex-col lg:flex-row animate-pulse">
        <div className="mr-6 mb-6 w-[280px] h-[450px] bg-gray-300 rounded-lg"></div>

        <div className="flex-1">
          <div className="h-8 w-1/2 bg-gray-300 rounded mb-4"></div>
          <div className="h-54 w-82 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-70 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-30 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>

      <div className="p-7 max-w-[300px] sm:max-w-[500px] md:max-w-[600px] custom-lg:max-w-[900px] 2xl:max-w-[1100px] mx-auto">
        <h2 className="h-9 w-2/4 bg-gray-300 rounded mb-2 animate-pulse"></h2>
        <div className="flex overflow-auto gap-6 py-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-50  flex-shrink-0 bg-gray-300 min-h-[350px] text-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="w-full h-56 bg-gray-400 rounded-t-lg"></div>
              <div className="pl-1 mt-2">
                <div className="h-4 w-3/4 bg-gray-400 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-400 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActorSkeletonLoader;
