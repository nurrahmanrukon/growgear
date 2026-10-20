import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://growgear.example.com").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/cart", "/checkout", "/order-success", "/profile", "/search"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
