import type { MetadataRoute } from "next";
import { store } from "@/app/data/store";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${store.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: store.siteUrl,
  };
}
