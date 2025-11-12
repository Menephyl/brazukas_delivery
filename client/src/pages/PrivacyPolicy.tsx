/**
 * Brazukas Delivery - Privacy Policy Page
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>

        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p>
              A Brazukas Delivery ("nós", "nosso" ou "nos") opera o site brazukas.delivery e o aplicativo móvel
              Brazukas Delivery (coletivamente, o "Serviço").
            </p>
            <p>
              Esta página informa você sobre nossas políticas de coleta, uso e divulgação de dados pessoais quando você
              usa nosso Serviço e as escolhas que você tem associadas a esses dados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
            <p>Coletamos vários tipos de informações para fornecer e melhorar nosso Serviço:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Informações de conta (nome, email, telefone, endereço)</li>
              <li>Informações de pagamento (processadas de forma segura)</li>
              <li>Histórico de pedidos e preferências</li>
              <li>Localização GPS (apenas durante entrega)</li>
              <li>Dados de uso e navegação</li>
              <li>Cookies e identificadores similares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Suas Informações</h2>
            <p>Usamos as informações coletadas para:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Processar e entregar seus pedidos</li>
              <li>Enviar confirmações e atualizações de pedidos</li>
              <li>Processar pagamentos</li>
              <li>Melhorar nosso Serviço e experiência do usuário</li>
              <li>Enviar comunicações de marketing (com consentimento)</li>
              <li>Cumprir obrigações legais</li>
              <li>Prevenir fraude e atividades ilícitas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
            <p>Podemos compartilhar suas informações com:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Entregadores (informações necessárias para entrega)</li>
              <li>Lojas (informações do pedido)</li>
              <li>Provedores de serviço (pagamento, análise, hospedagem)</li>
              <li>Autoridades legais (quando obrigado por lei)</li>
            </ul>
            <p>Nunca vendemos seus dados pessoais a terceiros.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra
              acesso não autorizado, alteração, divulgação ou destruição.
            </p>
            <p>
              No entanto, nenhum método de transmissão pela Internet é 100% seguro. Não podemos garantir segurança
              absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
            <p>Você tem o direito de:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados imprecisos</li>
              <li>Solicitar exclusão de dados</li>
              <li>Optar por não receber comunicações de marketing</li>
              <li>Exportar seus dados</li>
            </ul>
            <p>Para exercer esses direitos, entre em contato conosco em privacy@brazukas.delivery</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
            <p>
              Retemos seus dados pessoais pelo tempo necessário para fornecer nossos Serviços e cumprir obrigações
              legais. Você pode solicitar exclusão a qualquer momento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p>
              Usamos cookies e tecnologias similares para melhorar sua experiência. Você pode controlar cookies através
              das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças
              significativas por email ou através de um aviso em nosso Serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
            <p>Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Email: privacy@brazukas.delivery</li>
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
