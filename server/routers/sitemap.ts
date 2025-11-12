/**
 * Brazukas Delivery - Sitemap Router
 * Gera sitemap.xml dinamicamente para SEO
 */

import { publicProcedure, router } from "../_core/trpc";

export const sitemapRouter = router({
  /**
   * Gera sitemap.xml
   * Retorna XML com URLs do site
   */
  generate: publicProcedure.query(() => {
    const baseUrl = process.env.VITE_APP_URL || "https://brazukasdelivery.com";
    const now = new Date().toISOString().split("T")[0];

    // URLs estáticas
    const staticUrls = [
      {
        loc: baseUrl,
        lastmod: now,
        changefreq: "daily",
        priority: "1.0",
      },
      {
        loc: `${baseUrl}/terms`,
        lastmod: now,
        changefreq: "monthly",
        priority: "0.5",
      },
      {
        loc: `${baseUrl}/privacy`,
        lastmod: now,
        changefreq: "monthly",
        priority: "0.5",
      },
      {
        loc: `${baseUrl}/history`,
        lastmod: now,
        changefreq: "weekly",
        priority: "0.7",
      },
      {
        loc: `${baseUrl}/coupons`,
        lastmod: now,
        changefreq: "weekly",
        priority: "0.8",
      },
      {
        loc: `${baseUrl}/merchant/signup`,
        lastmod: now,
        changefreq: "monthly",
        priority: "0.6",
      },
    ];

    // Construir XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return xml;
  }),

  /**
   * Gera sitemap-index.xml para múltiplos sitemaps
   */
  index: publicProcedure.query(() => {
    const baseUrl = process.env.VITE_APP_URL || "https://brazukasdelivery.com";
    const now = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

    return xml;
  }),
});
