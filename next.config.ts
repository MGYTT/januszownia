import type {
  NextConfig,
} from "next";

const nextConfig:
  NextConfig = {
  cacheComponents:
    true,

  partialPrefetching:
    true,

  /*
   * Leaflet wykonuje się po stronie
   * przeglądarki.
   *
   * Wymuszamy przejście bibliotek
   * mapowych przez pipeline Next.js,
   * zamiast polegać na gotowym kodzie
   * z node_modules.
   */
  transpilePackages: [
    "leaflet",
    "leaflet.markercluster",
  ],

  turbopack: {
    rules: {
      "*.css": {
        loaders: [
          "@tailwindcss/turbopack",
        ],

        as:
          "*.css",
      },
    },
  },
};

export default nextConfig;