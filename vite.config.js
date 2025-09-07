import { defineConfig } from 'vite'
// import usePHP from 'vite-plugin-php'
import path from 'path'

// const phpConfig = {
// 	binary: process.env.PHP_BINARY_PATH || '/opt/homebrew/bin/php',
// 	entry: [
// 		'www/php/*.php',
// 	],
// }

const viteConfig = {
  root: path.resolve(__dirname, "www"),
  plugins: [
    // usePHP(phpConfig),
  ],
  build: {
    outDir: path.resolve(__dirname, "dist")
  },
  server: {
    port: 3000,
    open: true,
    strictPort: false,
    host: '0.0.0.0'
  }
};

// console.log('phpConfig:', phpConfig);
console.log('viteConfig:', viteConfig);

export default defineConfig(viteConfig);
