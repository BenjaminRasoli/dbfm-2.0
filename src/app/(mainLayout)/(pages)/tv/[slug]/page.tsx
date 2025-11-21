import SingleMovieOrTv from "@/app/components/SingleMovieOrTv/SingleMovieOrTv";
import { Metadata } from "next";

type PageProps = { params: { slug: string } };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DBFM_SERVER}/api/getSingleMovieOrTv?id=${slug}&type=movie`
    );

    if (!res.ok) {
      return {
        title: "Not Found | DBFM",
        description: "Movie or TV show not found.",
      };
    }

    const data = await res.json();
    const media = data.mediaData;

    if (!media) {
      return {
        title: "Not Found | DBFM",
        description: "Movie or TV show not found.",
      };
    }

    const title = media.title || media.name;
    const description =
      media.overview || "Check out this movie or TV show on DBFM.";

    return {
      title: `${title} | DBFM`,
      description,
      openGraph: {
        title: `${title} | DBFM`,
        description,
        url: `https://dbfm.vercel.app/tv/${slug}`,
        images: [
          {
            url: media.poster_path
              ? `https://image.tmdb.org/t/p/original${media.poster_path}`
              : "/black_favicon.png",
            width: 512,
            height: 768,
          },
        ],
        type: "website",
      },
      robots: "index, follow",
    };
  } catch (err) {
    return {
      title: "Error | DBFM",
      description: "An error occurred while fetching the media.",
    };
  }
}

async function Page({ params }: PageProps) {
  const { slug } = params;
  return <SingleMovieOrTv params={{ slug }} />;
}

export default Page;
