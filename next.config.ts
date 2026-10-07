import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

// Photos uploaded through /admin live in the Supabase "portfolio" Storage bucket.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = supabaseUrl ? new URL(supabaseUrl) : null;
const supabaseIsLocal = !!supabase && ["127.0.0.1", "localhost"].includes(supabase.hostname);

const remotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
];
if (supabase && !supabase.hostname.endsWith(".supabase.co")) {
  remotePatterns.push({
    protocol: supabase.protocol.replace(":", "") as "http" | "https",
    hostname: supabase.hostname,
    port: supabase.port,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns,
    // Only needed when Supabase runs on the same machine (local stack on the VPS).
    dangerouslyAllowLocalIP: supabaseIsLocal,
  },
  experimental: {
    // Admin photo and media-kit uploads go through Server Actions.
    serverActions: { bodySizeLimit: "12mb" },
  },
  async rewrites() {
    // Public Storage files (e.g. the media kit PDF) are served from the site's own
    // origin, so they work even when Supabase is not publicly reachable.
    if (!supabaseUrl) return [];
    return [
      {
        source: "/media/:path*",
        destination: `${supabaseUrl}/storage/v1/object/public/portfolio/:path*`,
      },
    ];
  },
};

export default nextConfig;
