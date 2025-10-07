import { WatchResultsTypes } from "@/app/Types/WhereToWatchTypes";
import Image from "next/image";
import Link from "next/link";

function WhereToWatch({ whereToWatch }: { whereToWatch: WatchResultsTypes }) {
  const countryData = whereToWatch?.SE;

  if (!countryData) return null;

  const allProviders = [
    ...(countryData.flatrate || []),
    ...(countryData.buy || []),
    ...(countryData.rent || []),
  ];

  if (allProviders.length === 0) return null;

  const uniqueProviders = allProviders.filter(
    (provider, index, self) =>
      index === self.findIndex((p) => p.provider_id === provider.provider_id)
  );

  return (
    <div className="mt-6 mb-10 overflow-auto">
      <h2 className="text-2xl pb-2 font-bold text-white">Where to Watch:</h2>
      <div className="flex gap-4">
        {uniqueProviders.map((provider) => (
          <Link
            key={provider.provider_id}
            href={countryData.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-blue rounded-lg h-full w-28 p-2 flex flex-col items-center">
              <Image
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-20 h-20 object-contain mb-2 rounded-2xl"
                height={80}
                width={80}
              />
              <p className="text-center text-white font-semibold text-sm">
                {provider.provider_name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default WhereToWatch;
