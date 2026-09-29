"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductContactActions } from "@/app/components/ProductContactActions";
import { productStatusLabels, products, type Product } from "@/app/data/products";

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

function matchesPrice(price: number | undefined, range: string) {
  if (range === "Todos") return true;
  if (price === undefined) return false;
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
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];
  const sizes = ["Todos", ...new Set(products.flatMap((product) => product.sizes))];
  const colors = ["Todas", ...new Set(products.flatMap((product) => product.colors.map((color) => color.label)))];
  const update = (key: keyof Filters, value: string) =>
    setFilters({ ...filters, [key]: value });

  return (
    <div className="filter-fields">
      <label>
        Categoria
        <select value={filters.category} onChange={(event) => update("category", event.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Tamanho
        <select value={filters.size} onChange={(event) => update("size", event.target.value)}>
          {sizes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Cor
        <select value={filters.color} onChange={(event) => update("color", event.target.value)}>
          {colors.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Faixa de preço
        <select value={filters.price} onChange={(event) => update("price", event.target.value)}>
          {["Todos", "Até R$ 149", "R$ 150 a R$ 199", "Acima de R$ 200"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusableSelector = "a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        ref={modalRef}
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        aria-describedby="product-modal-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeButtonRef} className="modal-close" type="button" onClick={onClose} aria-label="Fechar detalhes">
          <X aria-hidden="true" size={23} strokeWidth={1.8} />
        </button>
        <div className="modal-image">
          <Image src={product.images[0]} alt={product.alt} fill sizes="(max-width: 760px) 100vw, 46vw" />
        </div>
        <div className="modal-copy">
          <p className="product-category">{product.category}</p>
          <h2 id="product-modal-title">{product.name}</h2>
          {product.price !== undefined && <strong className="modal-price">{currency.format(product.price)}</strong>}
          <p id="product-modal-description">{product.description}</p>
          <dl className="product-facts">
            <div><dt>Material</dt><dd>{product.material}</dd></div>
            <div><dt>Cor</dt><dd>{product.colors.map((color) => color.label).join(", ")}</dd></div>
            <div><dt>Status</dt><dd>{productStatusLabels[product.status]}</dd></div>
          </dl>
          <ProductContactActions product={product} />
        </div>
      </section>
    </div>
  );
}

export function ProductCatalog() {
  const [filters, setFilters] = useState(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterDrawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filtersOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const filterButton = filterButtonRef.current;
    const focusableSelector = "button:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false);
        return;
      }

      if (event.key !== "Tab" || !filterDrawerRef.current) return;
      const focusable = Array.from(filterDrawerRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    filterDrawerRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      (previouslyFocused || filterButton)?.focus();
    };
  }, [filtersOpen]);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatches = filters.category === "Todos" || product.category === filters.category;
        const sizeMatches = filters.size === "Todos" || product.sizes.includes(filters.size);
        const colorMatches = filters.color === "Todas" || product.colors.some((color) => color.label === filters.color);
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
        <button
          ref={filterButtonRef}
          className="mobile-filter-button"
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-expanded={filtersOpen}
          aria-controls="catalog-filters"
        >
          <SlidersHorizontal aria-hidden="true" size={18} strokeWidth={1.8} />
          Filtros
        </button>
        <span role="status">{visibleProducts.length} {visibleProducts.length === 1 ? "peça" : "peças"}</span>
      </div>

      <div className="product-grid" aria-live="polite">
        {visibleProducts.map((product) => (
          <article key={product.id} id={product.id} className="product-card">
            <button
              className="product-image"
              type="button"
              onClick={() => setSelectedProduct(product)}
              aria-label={`Ver detalhes de ${product.name}`}
            >
              <Image src={product.images[0]} alt={product.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </button>
            <div className="product-info">
              <div>
                <p className="product-category">{product.category}</p>
                <h3><Link href={`/produtos/${product.slug}`}>{product.name}</Link></h3>
              </div>
              {product.price !== undefined && <strong>{currency.format(product.price)}</strong>}
            </div>
            <div className="product-meta">
              <span>Tamanhos {product.sizes.join(", ")}</span>
              <Link href={`/produtos/${product.slug}`}>Ver peça</Link>
            </div>
            <div className="product-card-footer">
              <div className="product-status">{productStatusLabels[product.status]}</div>
              {product.status !== "esgotado" && product.shopeeUrl ? (
                <a
                  className="product-shopee-link"
                  href={product.shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Comprar ${product.name} na Shopee`}
                >
                  <ShoppingBag aria-hidden="true" size={15} strokeWidth={1.9} />
                  Comprar na Shopee
                </a>
              ) : (
                <Link className="product-details-cta" href={`/produtos/${product.slug}`}>Ver detalhes</Link>
              )}
            </div>
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
          <div
            ref={filterDrawerRef}
            id="catalog-filters"
            className="filter-drawer"
            data-open="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
          >
            <div className="drawer-header">
              <h3 id="filter-title">Filtrar peças</h3>
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

