import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
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
  metadataBase: new URL("https://presenteafetokids.com.br"),
  title: {
    default: "Presente Afeto Kids | Moda infantil em Goiânia",
    template: "%s | Presente Afeto Kids",
  },
  description:
    "Roupas infantis alegres e confortáveis em Goiânia. Conheça a coleção e consulte tamanhos e disponibilidade pelo WhatsApp.",
  keywords: [
    "loja de roupa infantil em Goiânia",
    "moda infantil Goiânia",
    "roupas para crianças Goiânia",
    "Presente Afeto Kids",
  ],
  openGraph: {
    title: "Presente Afeto Kids",
    description: "Moda infantil com cor, conforto e carinho em Goiânia.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/images/hero-kids.jpg",
        width: 1680,
        height: 945,
        alt: "Coleção Presente Afeto Kids",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#201b19" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
