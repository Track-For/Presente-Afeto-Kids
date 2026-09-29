export type Product = {
  id: string;
  name: string;
  category: "Vestidos" | "Conjuntos" | "Meninos";
  price: number;
  sizes: string[];
  color: string;
  colorLabel: string;
  status: "Disponível" | "Últimas unidades" | "Sob consulta";
  image: string;
  alt: string;
  description: string;
  material: string;
  shopeeUrl: string;
};

export const products: Product[] = [
  {
    id: "vestido-coral",
    name: "Vestido Jardim Coral",
    category: "Vestidos",
    price: 169.9,
    sizes: ["2", "4", "6", "8"],
    color: "coral",
    colorLabel: "Coral",
    status: "Últimas unidades",
    image: "/images/vestido-coral.jpg",
    alt: "Menina vestindo o Vestido Jardim Coral",
    description:
      "Vestido leve com saia rodada, bordados delicados e alças confortáveis para brincar o dia inteiro.",
    material: "100% algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=vestido%20infantil%20coral",
  },
  {
    id: "conjunto-ceu",
    name: "Conjunto Céu de Verão",
    category: "Meninos",
    price: 189.9,
    sizes: ["4", "6", "8", "10"],
    color: "azul",
    colorLabel: "Azul céu",
    status: "Disponível",
    image: "/images/conjunto-ceu.jpg",
    alt: "Menino vestindo o Conjunto Céu de Verão",
    description:
      "Camisa leve sobre camiseta macia e bermuda de linho misto para dias cheios de movimento.",
    material: "Linho e algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=conjunto%20infantil%20azul",
  },
  {
    id: "macaquinho-jardim",
    name: "Macaquinho Jardim",
    category: "Conjuntos",
    price: 149.9,
    sizes: ["2", "4", "6"],
    color: "turquesa",
    colorLabel: "Turquesa",
    status: "Disponível",
    image: "/images/macaquinho-jardim.jpg",
    alt: "Menina vestindo o Macaquinho Jardim turquesa",
    description:
      "Macaquinho fresco com cintura confortável e pequenos bordados florais.",
    material: "100% algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=macaquinho%20infantil%20turquesa",
  },
  {
    id: "polo-listrada",
    name: "Polo Horizonte",
    category: "Meninos",
    price: 119.9,
    sizes: ["2", "4", "6", "8"],
    color: "coral",
    colorLabel: "Coral",
    status: "Sob consulta",
    image: "/images/polo-listrada.jpg",
    alt: "Menino vestindo a Polo Horizonte coral e creme",
    description:
      "Polo em malha macia com listras largas, gola estruturada e toque suave.",
    material: "Malha de algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=polo%20infantil%20listrada",
  },
  {
    id: "conjunto-sol",
    name: "Conjunto Sol de Goiânia",
    category: "Conjuntos",
    price: 179.9,
    sizes: ["6", "8", "10", "12"],
    color: "amarelo",
    colorLabel: "Amarelo",
    status: "Disponível",
    image: "/images/conjunto-sol.jpg",
    alt: "Menina vestindo o Conjunto Sol de Goiânia",
    description:
      "Blusa com manga bufante e saia coral de caimento leve para ocasiões especiais.",
    material: "Viscose e algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=conjunto%20infantil%20menina",
  },
  {
    id: "jaqueta-folha",
    name: "Conjunto Folha",
    category: "Meninos",
    price: 219.9,
    sizes: ["6", "8", "10", "12"],
    color: "verde",
    colorLabel: "Verde folha",
    status: "Últimas unidades",
    image: "/images/jaqueta-folha.jpg",
    alt: "Menino vestindo o Conjunto Folha verde e terracota",
    description:
      "Jaqueta leve, camiseta macia e calça de sarja confortável para a meia-estação.",
    material: "Sarja de algodão",
    shopeeUrl: "https://shopee.com.br/search?keyword=conjunto%20infantil%20menino",
  },
];

