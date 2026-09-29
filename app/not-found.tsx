import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/app/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="conteudo" className="not-found-page">
        <div className="not-found-card">
          <p className="eyebrow">Página não encontrada</p>
          <h1>Essa peça saiu da vitrine.</h1>
          <p>Mas ainda temos muita coisa para você descobrir.</p>
          <Link className="button button-primary" href="/#colecao">
            Ver coleção <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </main>
    </>
  );
}
