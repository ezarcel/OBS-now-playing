import adapter from "@sveltejs/adapter-node";
import p from "path";
import preprocess from "svelte-preprocess";
import url from "url";

const __dirname = p.dirname(url.fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({ out: "./build" }),
    vite: {
      server: { port: 3001, proxy: { "/api": "http://localhost:3000" } },
      resolve: {
        alias: {
          "@components": p.join(__dirname, "src/components"),
          "@localization": p.join(__dirname, "src/localization"),
          "@routes": p.join(__dirname, "src/routes"),
          "@stores": p.join(__dirname, "src/stores"),
          "@styles": p.join(__dirname, "src/styles")
        }
      }
    }
  }
};

export default config;
