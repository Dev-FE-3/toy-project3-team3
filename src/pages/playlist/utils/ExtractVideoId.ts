export function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    // https://www.youtube.com/watch?v=VIDEO_ID
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }
    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1); // '/VIDEO_ID' → 'VIDEO_ID'
    }
    return null;
  } catch {
    return null;
  }
}
