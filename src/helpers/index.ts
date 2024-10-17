export async function getData(url: string, revalidate?: number) {
  try {
    const res = await fetch(url, {
      next: { revalidate: revalidate ? revalidate : 60 },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch Data");
    }
    return res.json();
  } catch (error: any) {
    console.log(error.message);
  }
}
