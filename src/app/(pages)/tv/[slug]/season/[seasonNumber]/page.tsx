import Episodes from "@/app/components/Episodes/Episodes";



async function Page({ params }: { params: Promise<{ slug: string, seasonNumber: number }> }) {
  const { slug } = await params;
  const { seasonNumber } = await params;

  return <Episodes params={Promise.resolve({ slug, seasonNumber })} />;
}

export default Page;
