/**
 * Brazukas Delivery - Terms of Use
 * Página de Termos de Uso
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Terms() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Brazukas Delivery</h1>
            <p className="text-sm text-muted-foreground">Termos de Uso</p>
          </div>
          {user && (
            <Button variant="outline" onClick={() => navigate("/")}>
              Voltar
            </Button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-sm max-w-none">
          <h2>Termos de Uso — Brazukas Delivery</h2>

          <p>
            Bem-vindo ao Brazukas Delivery. Estes Termos de Uso ("Termos") regem
            o acesso e uso do nosso aplicativo e serviços de entrega. Ao usar
            nossa plataforma, você concorda em cumprir estes Termos.
          </p>

          <h3>1. Descrição do Serviço</h3>
          <p>
            Brazukas Delivery é uma plataforma de entrega de alimentos que
            conecta clientes, comerciantes e entregadores. Nossa plataforma
            permite que você:
          </p>
          <ul>
            <li>Navegue e visualize cardápios de restaurantes parceiros</li>
            <li>Realize pedidos de alimentos e bebidas</li>
            <li>Rastreie entregas em tempo real</li>
            <li>Gerencie seu histórico de pedidos</li>
            <li>Acumule e resgate pontos de fidelidade</li>
          </ul>

          <h3>2. Conta de Usuário</h3>
          <p>
            Para usar nossos serviços, você deve criar uma conta. Você é
            responsável por manter a confidencialidade de suas credenciais de
            login e por toda atividade que ocorra sob sua conta. Você concorda
            em fornecer informações precisas e atualizadas durante o registro.
          </p>

          <h3>3. Pagamentos</h3>
          <p>
            Oferecemos múltiplos métodos de pagamento, incluindo PIX e dinheiro
            na entrega. Todos os pagamentos são processados com segurança através
            de processadores de pagamento terceirizados. Você concorda em pagar
            todas as taxas e encargos associados ao seu pedido.
          </p>

          <h3>4. Política de Cancelamento</h3>
          <p>
            Você pode cancelar seu pedido enquanto ele estiver no status
            "Pendente" ou "Confirmado". Após o comerciante iniciar o preparo,
            o cancelamento pode estar sujeito a taxas. Pedidos já entregues não
            podem ser cancelados.
          </p>

          <h3>5. Responsabilidades do Usuário</h3>
          <p>Você concorda em:</p>
          <ul>
            <li>Usar a plataforma apenas para fins legítimos</li>
            <li>
              Não interferir com a segurança ou funcionalidade da plataforma
            </li>
            <li>Não compartilhar sua conta com terceiros</li>
            <li>Respeitar os direitos de propriedade intelectual</li>
            <li>Não enviar conteúdo ofensivo, ilegal ou prejudicial</li>
          </ul>

          <h3>6. Limitação de Responsabilidade</h3>
          <p>
            Brazukas Delivery fornece a plataforma "como está". Não nos
            responsabilizamos por:
          </p>
          <ul>
            <li>Qualidade ou segurança dos alimentos entregues</li>
            <li>Atrasos na entrega causados por fatores externos</li>
            <li>Danos indiretos ou consequentes</li>
            <li>Perda de dados ou acesso não autorizado</li>
          </ul>

          <h3>7. Indenização</h3>
          <p>
            Você concorda em indenizar e manter Brazukas Delivery isento de
            qualquer reclamação, dano ou despesa decorrente de:
          </p>
          <ul>
            <li>Seu uso da plataforma</li>
            <li>Violação destes Termos</li>
            <li>Violação de direitos de terceiros</li>
          </ul>

          <h3>8. Modificações dos Termos</h3>
          <p>
            Reservamos o direito de modificar estes Termos a qualquer momento.
            Alterações significativas serão notificadas com antecedência. Seu
            uso continuado da plataforma após as modificações constitui
            aceitação dos novos Termos.
          </p>

          <h3>9. Encerramento de Conta</h3>
          <p>
            Podemos encerrar ou suspender sua conta se você violar estes Termos
            ou se envolver em atividades fraudulentas. Você pode solicitar o
            encerramento de sua conta a qualquer momento através das
            configurações da conta.
          </p>

          <h3>10. Lei Aplicável</h3>
          <p>
            Estes Termos são regidos pelas leis da República do Paraguai. Qualquer
            disputa será resolvida nos tribunais competentes do Paraguai.
          </p>

          <h3>11. Contato</h3>
          <p>
            Para dúvidas sobre estes Termos, entre em contato conosco em:
          </p>
          <ul>
            <li>Email: suporte@brazukasdelivery.com</li>
            <li>Telefone: +595 (21) 1234-5678</li>
            <li>Endereço: Ciudad del Este, Paraguai</li>
          </ul>

          <p className="text-sm text-muted-foreground mt-8">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </article>
      </main>
    </div>
  );
}
