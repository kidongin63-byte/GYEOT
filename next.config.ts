/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack 에러를 무시하고 설정을 비워둡니다.
  transpilePackages: ["@ducanh2912/next-pwa"],
  experimental: {
    //allowedDevOrigins: ["192.168.28.215", "localhost:3000"]
  }
};

export default nextConfig;