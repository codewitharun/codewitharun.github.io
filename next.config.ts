import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /about is the real profile page; /arun is a short, memorable
      // vanity URL for sharing (business cards, bios, link-in-bio) that
      // should permanently forward there rather than existing as a
      // duplicate page — a second real page with the same content would
      // just split search ranking between the two URLs.
      {
        source: "/arun",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
