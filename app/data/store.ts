const configuredWhatsapp = process.env.NEXT_PUBLIC_STORE_WHATSAPP?.replace(/\D/g, "");
const configuredAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS?.trim();
const configuredHours = process.env.NEXT_PUBLIC_STORE_HOURS?.trim();
const configuredInstagram = process.env.NEXT_PUBLIC_STORE_INSTAGRAM?.trim();

export const store = {
  name: "Presente Afeto Kids",
  shortName: "Presente Afeto Kids",
  description:
    "Roupas infantis alegres e confortáveis em Goiânia, com atendimento próximo para ajudar na escolha de tamanhos e cores.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://presenteafetokids.com.br",
  location: {
    city: "Goiânia",
    state: "GO",
    address: configuredAddress || null,
  },
  contact: {
    whatsappNumber: configuredWhatsapp || "5562999999999",
    whatsappConfigured: Boolean(configuredWhatsapp),
    instagramUrl: configuredInstagram || "https://instagram.com/presenteafetokids",
    instagramHandle: "@presenteafetokids",
  },
  hours: configuredHours || null,
} as const;

export function createWhatsappUrl(message: string) {
  return `https://wa.me/${store.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function createGeneralWhatsappMessage() {
  return `Olá! Vim pelo site da ${store.name} e gostaria de conhecer as peças disponíveis.`;
}

export function createProductWhatsappMessage({
  productName,
  size,
  color,
  soldOut = false,
}: {
  productName: string;
  size?: string;
  color?: string;
  soldOut?: boolean;
}) {
  if (soldOut) {
    return `Olá! Vi a peça “${productName}” no site da ${store.name}. Gostaria de saber quando ela estará disponível novamente.`;
  }

  const availability = size
    ? `Gostaria de saber se ela está disponível no tamanho ${size}${color ? ` e na cor ${color}` : ""}.`
    : `Gostaria de saber quais tamanhos estão disponíveis${color ? ` na cor ${color}` : ""}.`;

  return `Olá! Vi a peça “${productName}” no site da ${store.name}.\n\n${availability}`;
}
