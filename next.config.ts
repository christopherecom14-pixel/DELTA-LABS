import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed pages: send old links and search results to the home page.
  async redirects() {
    return [
      { source: "/services", destination: "/", permanent: true },
      { source: "/methodology", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
