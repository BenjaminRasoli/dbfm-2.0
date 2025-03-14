function SkeletonLoader() {
  return (
    <div className="rounded-lg max-w-[300px] bg-gray-300 animate-pulse">
      <div className="relative">
        <div className="bg-gray-400 w-full h-[450px] rounded-lg"></div>
        <div className="absolute top-0 left-0 rounded-tl-lg z-10 p-2 bg-gray-400"></div>
      </div>
      <div className="pb-4">
        <div className="flex mt-2">
          <div className="bg-gray-400 w-5 h-5 rounded-full"></div>
          <div className="ml-1 bg-gray-400 w-16 h-4"></div>
        </div>
        <div className="mt-2">
          <div className="bg-gray-400 w-3/4 h-4 rounded"></div>
        </div>
        <div className="bg-gray-400 w-1/3 h-3 mt-2 rounded"></div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
