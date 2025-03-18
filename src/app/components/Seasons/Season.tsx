import Image from "next/image";
import { LiaStarSolid } from "react-icons/lia";
import poster from "../../images/poster-image.png";
import Link from "next/link";
import { TvTypes } from "@/app/Types/TvTypes";
function Seasons({ mediaData }: { mediaData: TvTypes }) {
  return (
    <div className="mt-9">
      <h1 className="text-2xl font-bold text-white">Seasons:</h1>
      <h1 className="text-2xl font-bold text-white mb-4">
        Total Episodes: {mediaData.number_of_episodes || 0}
      </h1>
      <div className="flex overflow-auto max-w-[900px] gap-4">
        {mediaData.seasons.map((season) => (
          <Link
            key={season.id}
            href={`/tv/${mediaData.id}/season/${season.season_number}`}
          >
            <div className="bg-blue min-w-[230px] rounded-lg p-2 mb-4">
              <div className="relative">
                <Image
                  src={
                    season.poster_path
                      ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
                      : poster
                  }
                  alt={`Season ${season.season_number}`}
                  height={300}
                  width={200}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-black text-white py-1 px-2 rounded-lg">
                  Season {season.season_number || 0}
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mt-4">
                {season.name}
              </h2>

              <p className="text-lg text-white mt-2">
                Episodes: {season.episode_count || 0}
                <span className="flex items-center space-x-2">
                  Rating: <LiaStarSolid className="text-yellow" />
                  <span>{season.vote_average || 0}</span>
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Seasons;
