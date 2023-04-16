/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  sassOptions: {
    includePath: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;
