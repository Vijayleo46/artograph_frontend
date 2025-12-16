/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // Ensure Turbopack uses the project root, not the ./app directory
  },
};

module.exports = nextConfig;




