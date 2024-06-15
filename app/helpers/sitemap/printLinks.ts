import  { type Link } from "./types";
export default function pushLinks(links: Link[]) {
  const sitemap_entries = links.map((link: Link) => {
    return `<url><loc>${ENV.BASE_URL}${link.slug ? `/${link.slug}` : ""}</loc>${
      link.priority ? `<priority>${link.priority}</priority>` : ""
    }${
      link.published_at ? `<lastmod>${link.published_at}</lastmod>` : ""
    }<changefreq>${link.frequency || "yearly"}</changefreq></url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  ${sitemap_entries.join("")}
  </urlset>`;
}
