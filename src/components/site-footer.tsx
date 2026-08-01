import Image from "next/image";
import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md bg-white">
                <Image
                  src="/images/logo-g1sul.png"
                  alt="G1 Sul Bilhares"
                  width={36}
                  height={36}
                  className="h-8 w-8 object-contain"
                />
              </span>
              <span className="text-sm font-medium tracking-tight">
                G1 Sul Bilhares
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Fabricação própria de mesas de sinuca em Curitiba e Região
              Metropolitana. Estrutura firme, nivelamento garantido,
              acabamento sob medida.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Navegação
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-accent">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/empresa" className="hover:text-accent">
                  A empresa
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-accent">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Fale com a fábrica
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={whatsappLink("Olá, vim pelo site da G1 Sul Bilhares")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  WhatsApp (41) 98826-3601
                </a>
              </li>
              <li className="text-muted-foreground">
                Curitiba e Região Metropolitana
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} G1 Sul Bilhares. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
