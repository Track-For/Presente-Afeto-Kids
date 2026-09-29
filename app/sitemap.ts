import type { MetadataRoute } from "next";
import { products } from "@/app/data/products";
import { store } from "@/app/data/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = store.siteUrl.replace(/\/$/, "");

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${baseUrl}/produtos/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: product.images.map((image) => `${baseUrl}${image}`),
    })),
  ];
}
