import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
                <a href="#" className="hover:text-primary transition-colors">
                  Sobre nós
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
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
                <a href="#" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
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
    </footer>
  );
}
