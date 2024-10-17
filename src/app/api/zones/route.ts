export async function GET() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_TERROR_ZONES_API_PATH as string,
    {
      headers: {
        "x-emu-username": process.env
          .NEXT_PUBLIC_TERROR_ZONES_API_USER_NAME as string,
        "x-emu-token": process.env.NEXT_PUBLIC_TERROR_ZONES_API_TOKEN as string,
      },
      cache: "no-store",
    }
  );
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
