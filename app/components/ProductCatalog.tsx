"use client";

import Image from "next/image";
import { Check, MessageCircle, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/app/data/products";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type Filters = {
  category: string;
  size: string;
  color: string;
  price: string;
};

const initialFilters: Filters = {
  category: "Todos",
  size: "Todos",
  color: "Todas",
  price: "Todos",
};

function matchesPrice(price: number, range: string) {
  if (range === "Até R$ 149") return price <= 149.99;
  if (range === "R$ 150 a R$ 199") return price >= 150 && price <= 199.99;
  if (range === "Acima de R$ 200") return price >= 200;
  return true;
}

function FilterFields({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) {
  const update = (key: keyof Filters, value: string) =>
    setFilters({ ...filters, [key]: value });

  return (
    <div className="filter-fields">
      <label>
        Categoria
        <select value={filters.category} onChange={(event) => update("category", event.target.value)}>
          {['Todos', 'Vestidos', 'Conjuntos', 'Meninos'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Tamanho
        <select value={filters.size} onChange={(event) => update("size", event.target.value)}>
          {['Todos', '2', '4', '6', '8', '10', '12'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Cor
        <select value={filters.color} onChange={(event) => update("color", event.target.value)}>
          {['Todas', 'Coral', 'Azul céu', 'Turquesa', 'Amarelo', 'Verde folha'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Faixa de preço
        <select value={filters.price} onChange={(event) => update("price", event.target.value)}>
          {['Todos', 'Até R$ 149', 'R$ 150 a R$ 199', 'Acima de R$ 200'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const message = encodeURIComponent(
    `Olá! Vi a peça “${product.name}” no site da Presente Afeto Kids. Gostaria de saber se ela está disponível no tamanho ${selectedSize}.`,
  );

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar detalhes">
          <X aria-hidden="true" size={23} strokeWidth={1.8} />
        </button>
        <div className="modal-image">
          <Image src={product.image} alt={product.alt} fill sizes="(max-width: 760px) 100vw, 46vw" />
        </div>
        <div className="modal-copy">
          <p className="product-category">{product.category}</p>
          <h3 id="product-title">{product.name}</h3>
          <strong className="modal-price">{currency.format(product.price)}</strong>
          <p>{product.description}</p>
          <dl className="product-facts">
            <div><dt>Material</dt><dd>{product.material}</dd></div>
            <div><dt>Cor</dt><dd>{product.colorLabel}</dd></div>
            <div><dt>Status</dt><dd>{product.status}</dd></div>
          </dl>
          <fieldset>
            <legend>Escolha o tamanho</legend>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? "selected" : ""}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>
          <a
            className="button button-primary modal-whatsapp"
            href={`https://wa.me/5562999999999?text=${message}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" size={18} strokeWidth={1.8} />
            Perguntar sobre esta peça
          </a>
        </div>
      </section>
    </div>
  );
}

export function ProductCatalog() {
  const [filters, setFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatches = filters.category === "Todos" || product.category === filters.category;
        const sizeMatches = filters.size === "Todos" || product.sizes.includes(filters.size);
        const colorMatches = filters.color === "Todas" || product.colorLabel === filters.color;
        return categoryMatches && sizeMatches && colorMatches && matchesPrice(product.price, filters.price);
      }),
    [filters],
  );

  return (
    <>
      <div className="catalog-toolbar">
        <div className="desktop-filters">
          <FilterFields filters={filters} setFilters={setFilters} />
        </div>
        <button className="mobile-filter-button" type="button" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={1.8} />
          Filtros
        </button>
        <span>{visibleProducts.length} peças</span>
      </div>

      <div className="product-grid" aria-live="polite">
        {visibleProducts.map((product) => (
          <article key={product.id} id={product.id} className="product-card">
            <button className="product-image" type="button" onClick={() => setSelectedProduct(product)}>
              <Image src={product.image} alt={product.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </button>
            <div className="product-info">
              <div>
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
              </div>
              <strong>{currency.format(product.price)}</strong>
            </div>
            <div className="product-meta">
              <span>Tamanhos {product.sizes.join(", ")}</span>
              <button type="button" onClick={() => setSelectedProduct(product)}>
                Tenho interesse
              </button>
            </div>
            <div className="product-status">{product.status}</div>
          </article>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <div className="catalog-empty">
          <Check aria-hidden="true" size={26} strokeWidth={1.6} />
          <h3>Nenhuma peça com estes filtros</h3>
          <p>Tente combinar outro tamanho, cor ou faixa de preço.</p>
          <button className="button button-primary" type="button" onClick={() => setFilters(initialFilters)}>
            Limpar filtros
          </button>
        </div>
      )}

      {filtersOpen && (
        <>
          <div className="filter-drawer" data-open="true">
            <div className="drawer-header">
              <h3>Filtrar peças</h3>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Fechar filtros">
                <X aria-hidden="true" size={24} strokeWidth={1.8} />
              </button>
            </div>
            <FilterFields filters={filters} setFilters={setFilters} />
            <button className="button button-primary" type="button" onClick={() => setFiltersOpen(false)}>
              Ver {visibleProducts.length} peças
            </button>
          </div>
          <button className="drawer-overlay" type="button" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)} />
        </>
      )}

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
}

