export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Política de Privacidade – Foodnect
        </h1>

        <p className="mb-4 text-gray-600">
          Última atualização: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-4 text-gray-700">
          <h2 className="text-xl font-semibold">1. Introdução</h2>
          <p>
            A Foodnect valoriza a privacidade e a proteção dos dados pessoais dos seus utilizadores.
            Esta Política descreve como recolhemos, utilizamos, armazenamos e protegemos informações
            de clientes, estabelecimentos e administradores.
          </p>

          <h2 className="text-xl font-semibold">2. Dados Recolhidos</h2>

          <h3 className="font-medium">2.1 Dados fornecidos pelo utilizador</h3>
          <ul className="list-disc pl-6">
            <li>Nome completo</li>
            <li>E-mail</li>
            <li>Número de telefone</li>
            <li>Localização (quando autorizada)</li>
            <li>Dados do estabelecimento</li>
            <li>Documentos para verificação</li>
          </ul>

          <h3 className="font-medium">2.2 Dados coletados automaticamente</h3>
          <ul className="list-disc pl-6">
            <li>Endereço IP</li>
            <li>Identificadores do dispositivo</li>
            <li>Dados de uso da aplicação</li>
            <li>Dados de navegação</li>
          </ul>

          <h2 className="text-xl font-semibold">3. Finalidade do Tratamento</h2>
          <ul className="list-disc pl-6">
            <li>Gerir contas de utilizador</li>
            <li>Processar pedidos</li>
            <li>Exibir estabelecimentos próximos</li>
            <li>Melhorar a experiência do utilizador</li>
            <li>Garantir segurança e prevenção de fraudes</li>
            <li>Suporte ao cliente</li>
            <li>Cumprimento de obrigações legais</li>
          </ul>

          <h2 className="text-xl font-semibold">4. Partilha de Dados</h2>
          <p>
            A Foodnect não vende dados pessoais. Os dados podem ser partilhados apenas com parceiros
            essenciais para a prestação do serviço ou quando exigido por lei.
          </p>

          <h2 className="text-xl font-semibold">5. Segurança</h2>
          <ul className="list-disc pl-6">
            <li>Criptografia</li>
            <li>HTTPS/TLS</li>
            <li>Proteção contra acessos não autorizados</li>
          </ul>

          <h2 className="text-xl font-semibold">6. Retenção de Dados</h2>
          <p>
            Os dados são mantidos enquanto a conta estiver ativa. O utilizador pode solicitar a
            exclusão a qualquer momento.
          </p>

          <h2 className="text-xl font-semibold">7. Direitos do Utilizador</h2>
          <ul className="list-disc pl-6">
            <li>Aceder aos seus dados</li>
            <li>Solicitar correção</li>
            <li>Solicitar exclusão</li>
            <li>Revogar consentimento</li>
            <li>Obter cópia dos dados</li>
          </ul>

          <h2 className="text-xl font-semibold">8. Alterações</h2>
          <p>
            Esta política pode ser atualizada. Mudanças relevantes serão comunicadas na aplicação.
          </p>

          <h2 className="text-xl font-semibold">9. Contacto</h2>
          <p>
            📧 Email: suporte@foodnect.com <br />
            🌍 Plataforma: Foodnect
          </p>
        </section>
      </div>
    </main>
  );
}
