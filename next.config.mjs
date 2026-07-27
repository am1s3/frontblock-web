/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // статика в папку out/ — никакой edge-боли, никакой next-on-pages
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
