"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/#novidades", label: "Novidades" },
  { href: "/#colecao", label: "Coleção" },
  { href: "/#lookbook", label: "Como usar" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#visite", label: "Visite" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuButton = menuButtonRef.current;
    const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>(focusableSelector));
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
    menuRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      (previouslyFocused || menuButton)?.focus();
    };
  }, [open]);

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="Presente Afeto Kids, início">
        <Image
          src="/images/logo.png"
          alt="Presente Afeto Kids"
          width={144}
          height={141}
        />
      </Link>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <Link className="header-cta" href="/#colecao">
        <ShoppingBag aria-hidden="true" size={17} strokeWidth={1.8} />
        Ver coleção
      </Link>

      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        <Menu aria-hidden="true" size={24} strokeWidth={1.8} />
      </button>

      {open && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="mobile-menu"
          data-open="true"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          <div className="mobile-menu-top">
            <Image src="/images/logo.png" alt="" width={80} height={78} />
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu">
              <X aria-hidden="true" size={28} strokeWidth={1.8} />
            </button>
          </div>
          <nav aria-label="Navegação mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Link className="button button-primary" href="/#contato" onClick={() => setOpen(false)}>
            Falar com a loja
          </Link>
        </div>
      )}
    </header>
  );
}
