function ActorSkeletonLoader() {
  return (
    <div className="min-h-screen pb-15">
      <div className="customContainer !pt-10">
        <div className="rounded-lg flex flex-col lg:flex-row lg:items-start animate-pulse">
          <div className="flex justify-center lg:justify-start mb-6 lg:mb-0">
            <div className="mb-6 lg:mr-6 w-[350px] h-[530px] bg-gray-300 rounded-lg" />
          </div>
          <div className="flex-1">
            <div className="h-8 w-1/2 bg-gray-300 rounded mb-4" />
            <div className="h-[250px] w-[90%] bg-gray-300 rounded mb-4" />
            <div className="h-4 w-40 bg-gray-300 rounded mb-4" />
            <div className="h-4 w-70 bg-gray-300 rounded mb-4" />
            <div className="h-4 w-30 bg-gray-300 rounded mb-4" />
          </div>
        </div>

        <section className="mt-12">
          <div className="h-9 w-[120px] bg-gray-300 rounded mb-6 animate-pulse" />

          <div className="flex overflow-x-auto gap-6 pb-4">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="w-44 min-h-[350px] flex-shrink-0 bg-gray-300 rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-56 bg-gray-400" />
                <div className="pl-1 mt-2">
                  <div className="h-4 w-3/4 bg-gray-400 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-400 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 animate-pulse">
          <div className="h-9 w-[110px] bg-gray-300 rounded mb-6" />

          <ul className="space-y-3">
            {[...Array(8)].map((_, index) => (
              <li key={index} className="border-b border-gray-700 pb-2">
                <div className="h-4 w-[200px] bg-gray-300 rounded mb-2" />
                <div className="h-3 w-[150px] bg-gray-400 rounded" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default ActorSkeletonLoader;
