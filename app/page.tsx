import Image from "next/image";
import {
  ArrowRight,
  Camera,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
  Route,
  Sparkles,
  Sun,
} from "lucide-react";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { ProductCatalog } from "@/app/components/ProductCatalog";
import { Reveal } from "@/app/components/Reveal";
import { products } from "@/app/data/products";

const storeUrl = "https://presenteafetokids.com.br";
const whatsappUrl =
  "https://wa.me/5562999999999?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20Presente%20Afeto%20Kids.";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ClothingStore"],
    name: "Presente Afeto Kids",
    image: `${storeUrl}/images/logo.png`,
    url: storeUrl,
    telephone: "+55 62 99999-9999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Endereço da loja",
      addressLocality: "Goiânia",
      addressRegion: "GO",
      addressCountry: "BR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: storeUrl },
      { "@type": "ListItem", position: 2, name: "Coleção", item: `${storeUrl}/#colecao` },
    ],
  },
  ...products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: `${storeUrl}${product.image}`,
    description: product.description,
    material: product.material,
    color: product.colorLabel,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `${storeUrl}/#${product.id}`,
    },
  })),
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="announcement">Entrega em Goiânia e atendimento personalizado pelo WhatsApp</div>
      <Header />
      <main>
        <Hero />

        <section id="novidades" className="category-strip" aria-label="Categorias em destaque">
          <a href="#colecao">Vestidos <ArrowRight aria-hidden="true" size={18} /></a>
          <a href="#colecao">Conjuntos <ArrowRight aria-hidden="true" size={18} /></a>
          <a href="#colecao">Meninas <ArrowRight aria-hidden="true" size={18} /></a>
          <a href="#colecao">Meninos <ArrowRight aria-hidden="true" size={18} /></a>
        </section>

        <section id="colecao" className="catalog-section page-shell section-space" aria-labelledby="catalog-title">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow">Acabou de chegar</p>
              <h2 id="catalog-title">Novidades para pequenos grandes momentos.</h2>
              <p>Peças escolhidas para vestir bem, brincar livre e guardar histórias bonitas.</p>
            </div>
          </Reveal>
          <ProductCatalog />
        </section>

        <section id="lookbook" className="lookbook page-shell section-space" aria-labelledby="lookbook-title">
          <Reveal className="lookbook-frame">
            <Image
              src="/images/lookbook-irmaos.jpg"
              alt="Irmãos usando looks coordenados em um ambiente iluminado"
              fill
              sizes="(max-width: 900px) 100vw, 56vw"
            />
            <a className="hotspot hotspot-dress" href="#vestido-coral" aria-label="Ver vestido floral">
              <Plus aria-hidden="true" size={18} strokeWidth={1.8} />
              <span>Vestido Floral</span>
            </a>
            <a className="hotspot hotspot-shirt" href="#conjunto-ceu" aria-label="Ver camisa em linho">
              <Plus aria-hidden="true" size={18} strokeWidth={1.8} />
              <span>Camisa em linho</span>
            </a>
          </Reveal>
          <Reveal className="lookbook-copy" delay={0.12}>
            <p className="eyebrow">Como usar</p>
            <h2 id="lookbook-title">Looks que combinam entre si. E com cada aventura.</h2>
            <p>Misture cores, texturas e peças confortáveis para criar combinações com personalidade.</p>
            <a className="text-link" href="#colecao">
              Descobrir os looks <ArrowRight aria-hidden="true" size={18} />
            </a>
          </Reveal>
        </section>

        <section id="sobre" className="values-section section-space" aria-labelledby="values-title">
          <div className="page-shell values-layout">
            <Reveal className="values-intro">
              <h2 id="values-title">Roupa boa deixa a infância acontecer.</h2>
              <p>A Presente Afeto Kids reúne peças bonitas, confortáveis e fáceis de combinar, com atendimento próximo em Goiânia.</p>
            </Reveal>
            <div className="values-list">
              <Reveal className="value-row" delay={0.05}>
                <Heart aria-hidden="true" size={28} strokeWidth={1.5} />
                <div><h3>Escolhas com carinho</h3><p>Curadoria pensada para o conforto dos pequenos e a rotina da família.</p></div>
              </Reveal>
              <Reveal className="value-row" delay={0.1}>
                <Sun aria-hidden="true" size={28} strokeWidth={1.5} />
                <div><h3>Leveza para brincar</h3><p>Tecidos gostosos, modelagens livres e cores que acompanham o dia.</p></div>
              </Reveal>
              <Reveal className="value-row" delay={0.15}>
                <Sparkles aria-hidden="true" size={28} strokeWidth={1.5} />
                <div><h3>Atendimento de verdade</h3><p>Ajuda rápida para escolher tamanho, cor e disponibilidade.</p></div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="visite" className="visit-section page-shell section-space" aria-labelledby="visit-title">
          <Reveal className="visit-map">
            <div className="map-grid" aria-hidden="true">
              <span className="road road-one" />
              <span className="road road-two" />
              <span className="road road-three" />
              <span className="map-pin"><MapPin size={28} strokeWidth={1.7} /></span>
              <span className="map-label">Goiânia</span>
            </div>
          </Reveal>
          <Reveal className="visit-copy" delay={0.12}>
            <h2 id="visit-title">Venha conhecer de perto.</h2>
            <p>Veja as peças, sinta os tecidos e encontre o look certo com a nossa ajuda.</p>
            <div className="visit-details">
              <div><MapPin aria-hidden="true" size={20} /><span><strong>Endereço</strong>Preencha com o endereço da loja, Goiânia - GO</span></div>
              <div><Clock3 aria-hidden="true" size={20} /><span><strong>Horário</strong>Segunda a sexta, 9h às 18h. Sábado, 9h às 13h.</span></div>
            </div>
            <a className="button button-primary" href="https://maps.google.com/?q=Goi%C3%A2nia%2C%20GO" target="_blank" rel="noreferrer">
              <Route aria-hidden="true" size={18} strokeWidth={1.8} /> Traçar rota
            </a>
          </Reveal>
        </section>

        <section className="social-section section-space" aria-labelledby="social-title">
          <div className="page-shell">
            <Reveal className="social-heading">
              <Camera aria-hidden="true" size={28} strokeWidth={1.6} />
              <h2 id="social-title">Acompanhe as novidades.</h2>
              <p>Novos looks, combinações e bastidores da loja no Instagram.</p>
              <a className="text-link" href="https://instagram.com/" target="_blank" rel="noreferrer">
                @presenteafetokids <ArrowRight aria-hidden="true" size={18} />
              </a>
            </Reveal>
            <div className="social-grid" role="group" aria-label="Seleção de looks da coleção">
              {products.slice(0, 4).map((product, index) => (
                <Reveal key={product.id} className={`social-tile social-tile-${index + 1}`} delay={index * 0.05}>
                  <Image src={product.image} alt={product.alt} fill sizes="(max-width: 700px) 50vw, 25vw" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="final-cta page-shell section-space" aria-labelledby="contact-title">
          <Reveal className="final-cta-inner">
            <div>
              <h2 id="contact-title">Viu algo que combina com seu pequeno?</h2>
              <p>Fale com a gente para consultar tamanho, cor e disponibilidade.</p>
            </div>
            <a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" size={19} strokeWidth={1.8} /> Falar pelo WhatsApp
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-grid">
          <div className="footer-brand">
            <Image src="/images/logo.png" alt="Presente Afeto Kids" width={104} height={102} />
            <p>Moda infantil escolhida com carinho em Goiânia.</p>
          </div>
          <div><strong>Explore</strong><a href="#colecao">Coleção</a><a href="#lookbook">Como usar</a><a href="#sobre">Sobre a loja</a></div>
          <div><strong>Atendimento</strong><a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a><a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="#visite">Localização</a></div>
          <div><strong>Visite</strong><p>Endereço da loja<br />Goiânia - GO</p><p>Seg a sex, 9h às 18h<br />Sáb, 9h às 13h</p></div>
        </div>
        <div className="page-shell footer-bottom">
          <span>© 2026 Presente Afeto Kids</span>
          <span>Feito para crescer junto com a loja.</span>
        </div>
      </footer>

      <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar com a Presente Afeto Kids pelo WhatsApp">
        <MessageCircle aria-hidden="true" size={24} strokeWidth={1.8} />
      </a>
    </>
  );
}
