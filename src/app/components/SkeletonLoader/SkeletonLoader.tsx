function SkeletonLoader() {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden bg-gray-100 animate-pulse shadow-sm">
      <div className="relative w-full aspect-[3/5] h-full bg-gray-300">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-400 rounded-lg"></div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
          <div className="w-20 h-4 bg-gray-400 rounded"></div>
        </div>
        <div className="w-3/4 h-4 bg-gray-400 rounded"></div>
        <div className="flex justify-between">
          <div className="w-1/2 h-3 bg-gray-400 rounded"></div>
          <div className="w-11 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
