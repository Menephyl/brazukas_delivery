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
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Sobre */}
          <div>
            <h3 className="font-semibold mb-3">Brazukas Delivery</h3>
            <p className="text-sm text-muted-foreground">
              O delivery da comunidade para a fronteira Brasil-Paraguai. Conectando clientes, lojistas e entregadores.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Sobre nós")} className="hover:text-primary transition-colors">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Contato")} className="hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Termos de Uso")} className="hover:text-primary transition-colors">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-semibold mb-3">Redes Sociais</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Instagram")} className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "Facebook")} className="hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => handleLinkClick(e, "WhatsApp")} className="hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Feito com <Heart className="h-4 w-4 text-red-500" /> para a comunidade da fronteira
          </p>
          <p className="mt-2">© {currentYear} Brazukas Delivery. Todos os direitos reservados.</p>
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
