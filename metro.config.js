const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure React Native is resolved correctly
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

// Block ALL web-only packages that cause Platform errors in React Native
config.resolver.blockList = [
  // Block all @radix-ui packages (web-only)
  /node_modules\/@radix-ui\/.*/,
  // Block other web-only dependencies
  /node_modules\/framer-motion\/.*/,
  /node_modules\/next-themes\/.*/,
  /node_modules\/cmdk\/.*/,
  /node_modules\/vaul\/.*/,
  /node_modules\/sonner\/.*/,
  /node_modules\/recharts\/.*/,
  /node_modules\/react-simple-maps\/.*/,
  /node_modules\/embla-carousel-react\/.*/,
  /node_modules\/react-day-picker\/.*/,
  /node_modules\/react-hook-form\/.*/,
  /node_modules\/react-resizable-panels\/.*/,
  /node_modules\/input-otp\/.*/,
  /node_modules\/class-variance-authority\/.*/,
  /node_modules\/tailwind-merge\/.*/,
  // Block nested react-dom
  /node_modules\/.*\/node_modules\/react-dom\/.*/,
];

module.exports = config;
