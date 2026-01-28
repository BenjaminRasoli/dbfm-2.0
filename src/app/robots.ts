import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/login", "/register", "/favorites", "/watched"],
      },
    ],
    sitemap: "https://dbfm.vercel.app/sitemap.xml",
  };
}
