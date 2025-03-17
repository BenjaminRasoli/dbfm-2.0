function WhereToWatch({ whereToWatch }: { whereToWatch: WatchResultsTypes }) {
  const hasWhereToWatchData = whereToWatch?.SV?.flatrate?.length > 0;

  return (
    hasWhereToWatchData && (
      <div className="mt-6 mb-10 overflow-auto">
        <h2 className="text-2xl pb-2 font-bold text-white">Where to Watch:</h2>
        <div className="flex gap-4">
          {whereToWatch.SV.flatrate.map((streaming) => (
            <div
              key={streaming.provider_id}
              className="bg-blue rounded-lg w-28 p-2 flex flex-col items-center"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${streaming.logo_path}`}
                alt={streaming.provider_name}
                className="w-20 h-20 object-contain mb-2 rounded-2xl"
              />
              <p className="text-center text-white font-semibold">
                {streaming.provider_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default WhereToWatch;
