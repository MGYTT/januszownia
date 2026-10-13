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
   * Wymuszamy przetworzenie bibliotek
   * mapowych przez pipeline Next.js.
   *
   * Jest to szczególnie ważne dla
   * kompatybilności klienta mobilnego.
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