import { defineConfig } from 'vite'
import usePHP from 'vite-plugin-php'

const phpConfig = {
	binary: process.env.PHP_BINARY_PATH || '/opt/homebrew/bin/php',
	entry: [
		'index.php',
		'php/*.php',
	],
}

console.log(phpConfig);

export default defineConfig({
  root: './www',
  plugins: [
    usePHP(phpConfig),
  ],
  build: {
    outDir: '../dist'
  },
  server: {
    port: 3000,
    open: true,
    strictPort: false
  }
})
