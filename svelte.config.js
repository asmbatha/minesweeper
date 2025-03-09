// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // GitHub Pages will serve content from the build directory
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false
    }),
    // This is important for GitHub Pages - it sets the base path to the repo name
    paths: {
      // Replace with your actual repository name in production
      base: process.env.NODE_ENV === 'production' ? '/minesweeper' : ''
    }
  },
};

export default config;
