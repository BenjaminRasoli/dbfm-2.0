function CollectionSkeletonLoader() {
  return (
    <>
      <div className="w-full h-[35dvh] relative bg-gray-300 animate-pulse" />

      <div className="customContainer">
        <div className="bg-gray-300 h-10 w-48 rounded-lg mb-4 animate-pulse"></div>
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[180px] bg-dark rounded-lg shadow-lg animate-pulse"
            >
              <div className="relative w-full h-[270px] bg-gray-300 rounded-t-lg" />
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
    </>
  );
}

export default CollectionSkeletonLoader;
