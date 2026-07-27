
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
if (process.env.NODE_ENV === 'development') await setupDevPlatform();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // /api/* обслуживают Pages Functions (edge+D1), Next туда не лезет
};
export default nextConfig;
