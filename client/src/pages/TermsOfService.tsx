/**
 * Brazukas Delivery - Terms of Service Page
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Termos de Serviço</h1>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar o Brazukas Delivery (o "Serviço"), você concorda em estar vinculado por estes Termos de
              Serviço. Se você não concorda com qualquer parte destes termos, você não pode usar nosso Serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
            <p>
              Brazukas Delivery é uma plataforma de delivery que conecta clientes, lojas e entregadores. Nós facilitamos
              a colocação de pedidos, processamento de pagamentos e entrega de produtos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Elegibilidade</h2>
            <p>Para usar nosso Serviço, você deve:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Ter autoridade legal para entrar em um contrato</li>
              <li>Não estar proibido por lei de usar nosso Serviço</li>
              <li>Fornecer informações precisas e completas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Conta do Usuário</h2>
            <p>Você é responsável por:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Manter a confidencialidade de sua senha</li>
              <li>Todas as atividades em sua conta</li>
              <li>Notificar-nos de acesso não autorizado</li>
              <li>Manter informações de conta precisas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Pagamentos</h2>
            <p>
              Você concorda em pagar todos os pedidos de acordo com os preços exibidos. Aceitamos PIX, cartão de
              crédito, cartão de débito e dinheiro na entrega.
            </p>
            <p>
              Todos os pagamentos são processados de forma segura. Você é responsável por fornecer informações de
              pagamento precisas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cancelamentos e Reembolsos</h2>
            <p>
              Você pode cancelar um pedido antes que a loja comece a preparar. Após o início da preparação, não é
              possível cancelar.
            </p>
            <p>
              Reembolsos serão processados dentro de 3-5 dias úteis para o método de pagamento original.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Responsabilidade de Conteúdo</h2>
            <p>
              Você é responsável por qualquer conteúdo que você enviar, incluindo avaliações e comentários. Você
              concorda em não enviar:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Conteúdo ilegal ou prejudicial</li>
              <li>Conteúdo ofensivo ou discriminatório</li>
              <li>Spam ou conteúdo enganoso</li>
              <li>Conteúdo que viola direitos de terceiros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
            <p>
              Na máxima extensão permitida por lei, Brazukas Delivery não será responsável por danos indiretos,
              incidentais, especiais, consequentes ou punitivos.
            </p>
            <p>
              Nossa responsabilidade total não excederá o valor do seu pedido mais recente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Isenção de Garantias</h2>
            <p>
              Nosso Serviço é fornecido "como está" sem garantias de qualquer tipo. Não garantimos que o Serviço será
              ininterrupto ou livre de erros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indenização</h2>
            <p>
              Você concorda em indenizar e manter Brazukas Delivery isenta de qualquer reclamação, dano ou despesa
              decorrente de seu uso do Serviço ou violação destes Termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Modificações dos Termos</h2>
            <p>
              Podemos modificar estes Termos a qualquer momento. Continuando a usar o Serviço após as modificações,
              você concorda com os novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Rescisão</h2>
            <p>
              Podemos encerrar sua conta a qualquer momento se você violar estes Termos ou por qualquer outro motivo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Lei Aplicável</h2>
            <p>
              Estes Termos são regidos pelas leis do Paraguai e Brasil, conforme aplicável. Qualquer disputa será
              resolvida nos tribunais competentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contato</h2>
            <p>Se você tiver dúvidas sobre estes Termos, entre em contato:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Email: legal@brazukas.delivery</li>
              <li>Endereço: Ciudad del Este, Paraguai</li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
