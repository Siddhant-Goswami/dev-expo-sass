export function extractIDfromYtURL(inputUrl: string) {
  // The YouTube URL provided by the user
  // const inputUrl = 'https://www.youtube.com/watch?v=t4mb0H4lBDQ';

  // Use a regular expression to extract the video ID
  const video_id_match = inputUrl.match(
    /(?:\?v=|\/embed\/|\.be\/|\/videos\/|\/\d{2,}\/|\/(?:[a-z]{2,4}\.)?[a-z]{2,4}\/(?!videoseries|embed|shorts|c|channel)(?:[^"\/\s]*\/\S+\/|(?!partner\/)))([a-zA-Z0-9_-]{11})/,
  );

  // Check if a match is found
  return video_id_match?.[video_id_match.length - 1] ?? null;
}
