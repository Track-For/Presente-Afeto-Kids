export type ProductStatus =
  | "disponível"
  | "últimas unidades"
  | "sob consulta"
  | "esgotado";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Vestidos" | "Conjuntos" | "Meninos";
  price?: number;
  sizes: string[];
  colors: Array<{
    id: string;
    label: string;
  }>;
  status: ProductStatus;
  images: string[];
  alt: string;
  description: string;
  material: string;
  shopeeUrl?: string;
};

export const productStatusLabels: Record<ProductStatus, string> = {
  disponível: "Disponível",
  "últimas unidades": "Últimas unidades",
  "sob consulta": "Sob consulta",
  esgotado: "Esgotado",
};

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export const products: Product[] = [
  {
    id: "vestido-coral",
    slug: "vestido-jardim-coral-infantil",
    name: "Vestido Jardim Coral",
    category: "Vestidos",
    price: 169.9,
    sizes: ["2", "4", "6", "8"],
    colors: [{ id: "coral", label: "Coral" }],
    status: "últimas unidades",
    images: ["/images/vestido-coral.jpg"],
    alt: "Menina vestindo o Vestido Jardim Coral",
    description:
      "Vestido leve com saia rodada, bordados delicados e alças confortáveis para brincar o dia inteiro.",
    material: "100% algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=vestido%20infantil%20coral",
  },
  {
    id: "conjunto-ceu",
    slug: "conjunto-ceu-de-verao-infantil",
    name: "Conjunto Céu de Verão",
    category: "Meninos",
    price: 189.9,
    sizes: ["4", "6", "8", "10"],
    colors: [{ id: "azul", label: "Azul céu" }],
    status: "disponível",
    images: ["/images/conjunto-ceu.jpg"],
    alt: "Menino vestindo o Conjunto Céu de Verão",
    description:
      "Camisa leve sobre camiseta macia e bermuda de linho misto para dias cheios de movimento.",
    material: "Linho e algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=conjunto%20infantil%20azul",
  },
  {
    id: "macaquinho-jardim",
    slug: "macaquinho-jardim-infantil",
    name: "Macaquinho Jardim",
    category: "Conjuntos",
    price: 149.9,
    sizes: ["2", "4", "6"],
    colors: [{ id: "turquesa", label: "Turquesa" }],
    status: "disponível",
    images: ["/images/macaquinho-jardim.jpg"],
    alt: "Menina vestindo o Macaquinho Jardim turquesa",
    description:
      "Macaquinho fresco com cintura confortável e pequenos bordados florais.",
    material: "100% algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=macaquinho%20infantil%20turquesa",
  },
  {
    id: "polo-listrada",
    slug: "polo-horizonte-infantil",
    name: "Polo Horizonte",
    category: "Meninos",
    price: 119.9,
    sizes: ["2", "4", "6", "8"],
    colors: [{ id: "coral", label: "Coral" }],
    status: "sob consulta",
    images: ["/images/polo-listrada.jpg"],
    alt: "Menino vestindo a Polo Horizonte coral e creme",
    description:
      "Polo em malha macia com listras largas, gola estruturada e toque suave.",
    material: "Malha de algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=polo%20infantil%20listrada",
  },
  {
    id: "conjunto-sol",
    slug: "conjunto-sol-de-goiania-infantil",
    name: "Conjunto Sol de Goiânia",
    category: "Conjuntos",
    price: 179.9,
    sizes: ["6", "8", "10", "12"],
    colors: [{ id: "amarelo", label: "Amarelo" }],
    status: "disponível",
    images: ["/images/conjunto-sol.jpg"],
    alt: "Menina vestindo o Conjunto Sol de Goiânia",
    description:
      "Blusa com manga bufante e saia coral de caimento leve para ocasiões especiais.",
    material: "Viscose e algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=conjunto%20infantil%20menina",
  },
  {
    id: "jaqueta-folha",
    slug: "conjunto-folha-infantil",
    name: "Conjunto Folha",
    category: "Meninos",
    price: 219.9,
    sizes: ["6", "8", "10", "12"],
    colors: [{ id: "verde", label: "Verde folha" }],
    status: "últimas unidades",
    images: ["/images/jaqueta-folha.jpg"],
    alt: "Menino vestindo o Conjunto Folha verde e terracota",
    description:
      "Jaqueta leve, camiseta macia e calça de sarja confortável para a meia-estação.",
    material: "Sarja de algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=conjunto%20infantil%20menino",
  },
];

