/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,

  /**
   * ! Important: ESLint and Typescript checks are run in CI, so that previews can be generated faster, without typechecking.
   * * Block merges to `main` if CI fails, instead of checking these during every Vercel build.
   */
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default config;
