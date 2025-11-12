/**
 * Brazukas Delivery - Privacy Policy
 * Página de Política de Privacidade (LGPD)
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Brazukas Delivery</h1>
            <p className="text-sm text-muted-foreground">Política de Privacidade</p>
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
          <h2>Política de Privacidade — Brazukas Delivery</h2>

          <p>
            Brazukas Delivery ("nós", "nosso" ou "Brazukas") opera o aplicativo
            Brazukas Delivery. Esta página informa você sobre nossas políticas
            referentes à coleta, uso e divulgação de dados pessoais quando você
            usa nosso serviço e as escolhas que você tem associadas a esses
            dados.
          </p>

          <h3>1. Informações que Coletamos</h3>

          <h4>1.1 Informações Fornecidas Diretamente</h4>
          <ul>
            <li>
              <strong>Dados de Conta:</strong> Nome, email, telefone, data de
              nascimento
            </li>
            <li>
              <strong>Endereço de Entrega:</strong> Endereço completo,
              coordenadas GPS, pontos de referência
            </li>
            <li>
              <strong>Informações de Pagamento:</strong> Método de pagamento
              (PIX, cartão), histórico de transações
            </li>
            <li>
              <strong>Histórico de Pedidos:</strong> Itens pedidos, restaurantes
              visitados, horários de pedidos
            </li>
          </ul>

          <h4>1.2 Informações Coletadas Automaticamente</h4>
          <ul>
            <li>
              <strong>Localização em Tempo Real:</strong> Coordenadas GPS durante
              entregas (apenas para entregadores)
            </li>
            <li>
              <strong>Dados de Dispositivo:</strong> Tipo de dispositivo, sistema
              operacional, identificadores únicos
            </li>
            <li>
              <strong>Dados de Uso:</strong> Páginas visitadas, tempo de sessão,
              cliques, buscas
            </li>
            <li>
              <strong>Cookies e Tecnologias Similares:</strong> Para melhorar
              experiência e análise
            </li>
          </ul>

          <h3>2. Como Usamos Seus Dados</h3>

          <p>Usamos as informações coletadas para:</p>
          <ul>
            <li>Processar e entregar seus pedidos</li>
            <li>Facilitar pagamentos e transações</li>
            <li>Comunicar atualizações sobre pedidos e promoções</li>
            <li>Melhorar nossos serviços e experiência do usuário</li>
            <li>Prevenir fraude e atividades ilícitas</li>
            <li>Cumprir obrigações legais e regulatórias</li>
            <li>Análise e pesquisa de mercado</li>
            <li>Personalizar conteúdo e recomendações</li>
          </ul>

          <h3>3. Retenção de Dados</h3>

          <p>Retemos seus dados pessoais pelo seguinte período:</p>
          <ul>
            <li>
              <strong>Trilhas de Rastreamento:</strong> 30 dias após entrega
            </li>
            <li>
              <strong>Histórico de Pedidos:</strong> Enquanto sua conta estiver
              ativa
            </li>
            <li>
              <strong>Dados de Pagamento:</strong> Conforme exigido por lei (até
              7 anos)
            </li>
            <li>
              <strong>Logs de Auditoria:</strong> 90 dias
            </li>
          </ul>

          <p>
            Você pode solicitar a exclusão de seus dados a qualquer momento,
            sujeito a obrigações legais.
          </p>

          <h3>4. Compartilhamento de Dados</h3>

          <p>Compartilhamos seus dados com:</p>
          <ul>
            <li>
              <strong>Restaurantes Parceiros:</strong> Endereço e itens do
              pedido
            </li>
            <li>
              <strong>Entregadores:</strong> Nome, telefone, endereço de
              entrega, localização em tempo real
            </li>
            <li>
              <strong>Processadores de Pagamento:</strong> Informações de
              pagamento (criptografadas)
            </li>
            <li>
              <strong>Prestadores de Serviço:</strong> Hospedagem, análise,
              suporte ao cliente
            </li>
            <li>
              <strong>Autoridades Legais:</strong> Quando exigido por lei
            </li>
          </ul>

          <h3>5. Segurança de Dados</h3>

          <p>
            Implementamos medidas técnicas e organizacionais para proteger seus
            dados pessoais contra acesso não autorizado, alteração ou
            destruição, incluindo:
          </p>
          <ul>
            <li>Criptografia SSL/TLS para transmissão de dados</li>
            <li>Criptografia de dados em repouso</li>
            <li>Controle de acesso baseado em funções</li>
            <li>Auditorias de segurança regulares</li>
            <li>Conformidade com padrões de segurança da indústria</li>
          </ul>

          <h3>6. Seus Direitos (LGPD)</h3>

          <p>
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
            direito a:
          </p>
          <ul>
            <li>
              <strong>Acesso:</strong> Obter informações sobre quais dados
              possuímos
            </li>
            <li>
              <strong>Correção:</strong> Corrigir dados imprecisos ou
              incompletos
            </li>
            <li>
              <strong>Exclusão:</strong> Solicitar exclusão de seus dados
            </li>
            <li>
              <strong>Portabilidade:</strong> Receber dados em formato
              estruturado
            </li>
            <li>
              <strong>Oposição:</strong> Opor-se ao processamento de dados
            </li>
            <li>
              <strong>Revogação de Consentimento:</strong> Revogar consentimento
              anterior
            </li>
          </ul>

          <p>
            Para exercer esses direitos, entre em contato conosco usando as
            informações abaixo.
          </p>

          <h3>7. Cookies e Rastreamento</h3>

          <p>
            Usamos cookies e tecnologias similares para melhorar sua experiência.
            Você pode controlar as preferências de cookies através das
            configurações do seu navegador. Observe que desabilitar cookies pode
            afetar a funcionalidade de certos recursos.
          </p>

          <h3>8. Alterações a Esta Política</h3>

          <p>
            Podemos atualizar esta Política de Privacidade periodicamente. Você
            será notificado de alterações significativas através de um aviso
            proeminente no aplicativo ou por email.
          </p>

          <h3>9. Contato</h3>

          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre
            como tratamos seus dados, entre em contato conosco:
          </p>
          <ul>
            <li>Email: privacidade@brazukasdelivery.com</li>
            <li>Telefone: +595 (21) 1234-5678</li>
            <li>Endereço: Ciudad del Este, Paraguai</li>
          </ul>

          <h3>10. Encarregado de Proteção de Dados (DPO)</h3>

          <p>
            Designamos um Encarregado de Proteção de Dados para supervisionar
            nossa conformidade com a LGPD. Você pode entrar em contato com nosso
            DPO em: dpo@brazukasdelivery.com
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </article>
      </main>
    </div>
  );
}
