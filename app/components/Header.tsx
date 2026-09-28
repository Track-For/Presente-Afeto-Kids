"use client";

import Image from "next/image";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { href: "#novidades", label: "Novidades" },
  { href: "#colecao", label: "Coleção" },
  { href: "#lookbook", label: "Como usar" },
  { href: "#sobre", label: "Sobre" },
  { href: "#visite", label: "Visite" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <a className="brand-mark" href="#inicio" aria-label="Presente Afeto Kids, início">
        <Image
          src="/images/logo.png"
          alt="Presente Afeto Kids"
          width={144}
          height={141}
          fetchPriority="high"
        />
      </a>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#colecao">
        <ShoppingBag aria-hidden="true" size={17} strokeWidth={1.8} />
        Ver peças
      </a>

      <button
        className="menu-button"
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Abrir menu"
      >
        <Menu aria-hidden="true" size={24} strokeWidth={1.8} />
      </button>

      {open && (
        <div id="mobile-menu" className="mobile-menu" data-open="true">
          <div className="mobile-menu-top">
            <Image src="/images/logo.png" alt="" width={80} height={78} />
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu">
              <X aria-hidden="true" size={28} strokeWidth={1.8} />
            </button>
          </div>
          <nav aria-label="Navegação mobile">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="button button-primary" href="#contato" onClick={() => setOpen(false)}>
            Falar com a loja
          </a>
        </div>
      )}
    </header>
  );
}

