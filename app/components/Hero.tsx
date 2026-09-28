"use client";

import Image from "next/image";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          content.current?.children ?? [],
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.1, ease: "power3.out" },
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        timeline
          .to(image.current, { scale: 1.07, ease: "none" }, 0)
          .to(content.current, { y: -34, autoAlpha: 0.18, ease: "none" }, 0);
      });

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="inicio" className="hero" aria-labelledby="hero-title">
      <div ref={image} className="hero-media">
        <Image
          src="/images/hero-kids.jpg"
          alt="Duas crianças sorrindo com looks coloridos da Presente Afeto Kids"
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
        />
      </div>
      <div className="hero-wash" aria-hidden="true" />
      <div ref={content} className="hero-content page-shell">
        <p className="hero-kicker">Moda infantil com afeto</p>
        <h1 id="hero-title">A infância veste cor. E muita história.</h1>
        <p>Roupas leves, alegres e confortáveis para acompanhar cada descoberta.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#colecao">
            Ver coleção
            <ArrowDownRight aria-hidden="true" size={18} strokeWidth={1.8} />
          </a>
          <a
            className="button button-ghost"
            href="https://wa.me/5562999999999?text=Ol%C3%A1%21%20Vim%20pelo%20site%20da%20Presente%20Afeto%20Kids."
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" size={18} strokeWidth={1.8} />
            Falar com a loja
          </a>
        </div>
      </div>
    </section>
  );
}

