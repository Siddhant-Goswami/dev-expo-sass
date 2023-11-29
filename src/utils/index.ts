import { env } from '@/env';

/**
 * Extracts the YouTube video ID from a YouTube URL
 * @param inputUrl The YouTube URL to extract the ID from
 * @returns The YouTube video ID
 * @example `https://www.youtube.com/watch?v=t4mb0H4lBDQ` -> `t4mb0H4lBDQ`
 * @example `https://youtu.be/t4mb0H4lBDQ` -> `t4mb0H4lBDQ`
 * @description This function is based on the following Stack Overflow answer: https://stackoverflow.com/a/8260383/3015595
 *  */
export function extractIDfromYtURL(videoUrl: string) {
  // const inputUrl = 'https://www.youtube.com/watch?v=t4mb0H4lBDQ';
  let video_id = videoUrl.split('v=')[1];

  if (!video_id) {
    return;
  }

  const ampersandPosition = video_id.indexOf('&');

  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }

  return video_id;
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL ?? env.NEXT_PUBLIC_VERCEL_URL}${path}`;
}

export async function isGithubUserValid(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.ok) {
      console.log(`The GitHub user '${username}' exists.`);
      return username;
    } else {
      console.log(`The GitHub user '${username}' does not exist.`);
      return '';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getUserRepos(username: string, perPage = 30, page = 1) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=created&direction=desc`,
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const repos = response.json();
    console.log('Repositories:', repos);
    return repos;
  } catch (error) {
    console.error('Error fetching repos:', error);
  }
}
