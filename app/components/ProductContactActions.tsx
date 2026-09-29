"use client";

import { MessageCircle, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/app/data/products";
import { createProductWhatsappMessage, createWhatsappUrl } from "@/app/data/store";

export function ProductContactActions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const soldOut = product.status === "esgotado";
  const color = product.colors[0]?.label;

  const whatsappUrl = useMemo(
    () =>
      createWhatsappUrl(
        createProductWhatsappMessage({
          productName: product.name,
          size: selectedSize || undefined,
          color,
          soldOut,
        }),
      ),
    [color, product.name, selectedSize, soldOut],
  );

  return (
    <div className="product-contact-actions">
      {!soldOut && product.sizes.length > 0 && (
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
                aria-label={`Tamanho ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="size-helper">
            {selectedSize ? `Tamanho ${selectedSize} selecionado` : "Você também pode consultar todos os tamanhos pelo WhatsApp."}
          </p>
        </fieldset>
      )}

      <div className="product-action-buttons">
        {!soldOut && product.shopeeUrl && (
          <a
            className="button button-primary"
            href={product.shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Comprar ${product.name} na Shopee`}
          >
            <ShoppingBag aria-hidden="true" size={18} strokeWidth={1.8} />
            Comprar na Shopee
          </a>
        )}
        <a
          className={`button button-whatsapp${!product.shopeeUrl || soldOut ? " button-primary" : ""}`}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle aria-hidden="true" size={18} strokeWidth={1.8} />
          {soldOut ? "Perguntar quando volta" : "Tenho interesse"}
        </a>
      </div>
    </div>
  );
}
