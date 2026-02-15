/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Enable static export for frontend-only deployment */
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },

  /* Transpile Three.js ecosystem packages */
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
  ],

  webpack: (config) => {
    // Support for GLSL shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
