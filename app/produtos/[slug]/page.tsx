import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { Header } from "@/app/components/Header";
import { ProductContactActions } from "@/app/components/ProductContactActions";
import {
  getProductBySlug,
  products,
  productStatusLabels,
  type ProductStatus,
} from "@/app/data/products";
import { store } from "@/app/data/store";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const schemaAvailability: Partial<Record<ProductStatus, string>> = {
  disponível: "https://schema.org/InStock",
  "últimas unidades": "https://schema.org/LimitedAvailability",
  esgotado: "https://schema.org/OutOfStock",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return {};

  return {
    title: product.name,
    description: `${product.description} Consulte tamanhos e disponibilidade na ${store.name}, em Goiânia.`,
    alternates: {
      canonical: `/produtos/${product.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `/produtos/${product.slug}`,
      title: `${product.name} | ${store.name}`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 1024,
          height: 1536,
          alt: product.alt,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const productUrl = `${store.siteUrl.replace(/\/$/, "")}/produtos/${product.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images.map((image) => `${store.siteUrl.replace(/\/$/, "")}${image}`),
      description: product.description,
      material: product.material,
      color: product.colors.map((color) => color.label).join(", "),
      ...(product.price !== undefined
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "BRL",
              price: product.price,
              ...(schemaAvailability[product.status]
                ? { availability: schemaAvailability[product.status] }
                : {}),
              url: productUrl,
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: store.siteUrl },
        { "@type": "ListItem", position: 2, name: "Coleção", item: `${store.siteUrl}/#colecao` },
        { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="announcement">Moda infantil em Goiânia • atendimento personalizado pelo WhatsApp</div>
      <Header />
      <main id="conteudo" className="product-page">
        <div className="page-shell product-page-shell">
          <Link className="product-back-link" href="/#colecao">
            <ArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
            Voltar para a coleção
          </Link>

          <article className="product-detail">
            <div className="product-detail-image">
              <Image
                src={product.images[0]}
                alt={product.alt}
                fill
                loading="eager"
                sizes="(max-width: 820px) 100vw, 52vw"
              />
            </div>

            <div className="product-detail-copy">
              <p className="eyebrow">{product.category} • {productStatusLabels[product.status]}</p>
              <h1>{product.name}</h1>
              {product.price !== undefined && (
                <strong className="product-detail-price">{currency.format(product.price)}</strong>
              )}
              <p className="product-detail-description">{product.description}</p>

              <dl className="product-facts product-page-facts">
                <div><dt>Material</dt><dd>{product.material}</dd></div>
                <div><dt>Cores</dt><dd>{product.colors.map((color) => color.label).join(", ")}</dd></div>
                <div><dt>Tamanhos</dt><dd>{product.sizes.join(", ")}</dd></div>
              </dl>

              <ProductContactActions product={product} />

              <p className="product-local-note">
                <MapPin aria-hidden="true" size={18} strokeWidth={1.8} />
                Atendimento em {store.location.city}, {store.location.state}
              </p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
