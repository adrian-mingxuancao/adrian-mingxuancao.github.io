import { defineConfig, envField } from "astro/config";
// GitHub Pages: use Astro's default static output (no adapter needed)
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,
  // adapter: netlify(), // Not needed for GitHub Pages (static build)
  // output: 'server',   // Not needed for static
  integrations: [
    sitemap({ filter: (page) => SITE.showArchives || !page.endsWith("/archives") }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // @ts-ignore — Astro 6 will fix
    plugins: [tailwindcss()],
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  },
  image: { responsiveStyles: true, layout: "constrained" },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public", context: "client", optional: true,
      }),
    },
  },
  experimental: { preserveScriptOrder: true },
});
