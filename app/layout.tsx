import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { store } from "@/app/data/store";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: {
    default: `${store.name} | Moda infantil em Goiânia`,
    template: `%s | ${store.name}`,
  },
  description: store.description,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "loja infantil Goiânia",
    "loja de roupa infantil em Goiânia",
    "moda infantil Goiânia",
    "roupa infantil Goiânia",
    "roupa para bebê Goiânia",
    "roupas para crianças Goiânia",
    store.name,
  ],
  openGraph: {
    title: store.name,
    description: "Moda infantil com cor, conforto e carinho em Goiânia.",
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: store.name,
    images: [
      {
        url: "/images/hero-kids.jpg",
        width: 1680,
        height: 945,
        alt: "Coleção Presente Afeto Kids",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: store.name,
    description: "Moda infantil com cor, conforto e carinho em Goiânia.",
    images: ["/images/hero-kids.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f5ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        {children}
      </body>
    </html>
  );
}
