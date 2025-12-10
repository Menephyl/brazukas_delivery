import { Heart } from "lucide-react";
import { useState } from "react";
import { ComingSoonModal } from "./ComingSoonModal";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const handleLinkClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

          {/* Col 1: Brand & Socials */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2 text-primary">Brazukas Delivery</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O delivery da comunidade para a fronteira Brasil-Paraguai. Conectando clientes, lojistas e entregadores.
              </p>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold text-sm mb-2">Redes Sociais</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" onClick={(e) => handleLinkClick(e, "Instagram")} className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, "Facebook")} className="hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" onClick={(e) => handleLinkClick(e, "WhatsApp")} className="hover:text-primary transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>

          {/* Col 2: Top Comidas */}
          <div>
            <h3 className="font-semibold mb-4">Top Comidas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Lanches", "Pizza", "Açaí", "Japonesa", "Bebidas", "Brasileira", "Saudável"].map((item) => (
                <li key={item}>
                  <a href="#" onClick={(e) => handleLinkClick(e, item)} className="hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Top Cidades */}
          <div>
            <h3 className="font-semibold mb-4">Top Cidades</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Ciudad del Este", "Foz do Iguaçu", "Hernandarias", "Presidente Franco", "Minga Guazú"].map((item) => (
                <li key={item}>
                  <a href="#" onClick={(e) => handleLinkClick(e, item)} className="hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Parceiros & Links Úteis */}
          <div>
            <h3 className="font-semibold mb-4">Parceiros e Colaboradores</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Registrar meu negócio")} className="font-medium text-foreground hover:text-primary transition-colors block">
                  Registrar meu negócio
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Centro de Sócios")} className="hover:text-primary transition-colors block">
                  Centro de Sócios
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Brazukas para colaboradores")} className="hover:text-primary transition-colors block">
                  Brazukas para colaboradores
                </a>
              </li>
              <li className="pt-2 border-t border-border/50">
                <a href="#" onClick={(e) => handleLinkClick(e, "Sobre nós")} className="hover:text-primary transition-colors block">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Contato")} className="hover:text-primary transition-colors block">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Termos de Uso")} className="hover:text-primary transition-colors block">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Feito com <Heart className="h-4 w-4 text-red-500 fill-red-500" /> para a comunidade da fronteira
          </p>
          <p className="mt-2 text-xs">© {currentYear} Brazukas Delivery. Todos os direitos reservados.</p>
        </div>
      </div>

      <ComingSoonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
      />
    </footer>
  );
}
