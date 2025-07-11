export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🔒 Política de Privacidade</h1>
            <p className="text-lg text-gray-600">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
              <p className="text-gray-700 mb-6">
                Coletamos informações que você nos fornece diretamente, como quando cria uma conta, 
                preenche formulários ou entra em contato conosco. Isso pode incluir:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Nome, email e informações de contato</li>
                <li>Informações de perfil e preferências</li>
                <li>Dados de uso da plataforma</li>
                <li>Conteúdo que você cria ou compartilha</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos Suas Informações</h2>
              <p className="text-gray-700 mb-6">
                Usamos suas informações para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Personalizar sua experiência de aprendizado</li>
                <li>Enviar notificações e atualizações importantes</li>
                <li>Analisar o uso da plataforma para melhorias</li>
                <li>Cumprir obrigações legais</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Compartilhamento de Informações</h2>
              <p className="text-gray-700 mb-6">
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais</li>
                <li>Com prestadores de serviços que nos ajudam a operar a plataforma</li>
                <li>Para proteger nossos direitos e segurança</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Segurança dos Dados</h2>
              <p className="text-gray-700 mb-6">
                Implementamos medidas de segurança técnicas e organizacionais para proteger 
                suas informações pessoais contra acesso não autorizado, alteração, divulgação 
                ou destruição.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
              <p className="text-gray-700 mb-6">
                Você tem os seguintes direitos relacionados aos seus dados pessoais:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Acessar e revisar suas informações</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Limitar o processamento de seus dados</li>
                <li>Portabilidade dos dados</li>
                <li>Retirar consentimento a qualquer momento</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 mb-6">
                Usamos cookies e tecnologias similares para melhorar sua experiência, 
                analisar o uso da plataforma e personalizar conteúdo. Você pode controlar 
                o uso de cookies através das configurações do seu navegador.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              <p className="text-gray-700 mb-6">
                Mantemos suas informações pessoais apenas pelo tempo necessário para 
                cumprir os propósitos descritos nesta política, a menos que um período 
                de retenção mais longo seja exigido ou permitido por lei.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transferências Internacionais</h2>
              <p className="text-gray-700 mb-6">
                Suas informações podem ser transferidas e processadas em países diferentes 
                do seu país de residência. Garantimos que essas transferências sejam 
                feitas de acordo com as leis de proteção de dados aplicáveis.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Menores de Idade</h2>
              <p className="text-gray-700 mb-6">
                Nossa plataforma não é destinada a menores de 13 anos. Não coletamos 
                intencionalmente informações pessoais de menores de 13 anos. Se você 
                é pai ou responsável e acredita que seu filho nos forneceu informações 
                pessoais, entre em contato conosco.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Alterações nesta Política</h2>
              <p className="text-gray-700 mb-6">
                Podemos atualizar esta política de privacidade periodicamente. 
                Notificaremos você sobre mudanças significativas através de email 
                ou através de um aviso na plataforma.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contato</h2>
              <p className="text-gray-700 mb-6">
                Se você tiver dúvidas sobre esta política de privacidade ou sobre 
                como tratamos suas informações pessoais, entre em contato conosco:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@aia-learning.com<br />
                  <strong>Telefone:</strong> +55 (11) 99999-9999<br />
                  <strong>Endereço:</strong> Rua da Inovação, 123 - São Paulo, SP - Brasil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 