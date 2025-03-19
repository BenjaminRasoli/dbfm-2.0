export async function GET() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=${process.env.APIKEY}`
    );
    const data = await res.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
