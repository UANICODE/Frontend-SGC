import Link from "next/link";
import Image from "next/image";

// Importe as imagens que você gerou
import Logo from "@/public/image/logo.png"; // seu logotipo

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-backgroundLight font-sans">
      {/* Navbar */}
      <nav className="fixed w-full top-0 left-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
     <Link href="/">
  <Image 
    src={Logo} 
    alt="SGC Logo" 
    className="w-32 h-auto object-contain"
  />
</Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-textPrimaryLight hover:text-primary transition">
              Funcionalidades
            </Link>
       
            <Link href="#about" className="text-textPrimaryLight hover:text-primary transition">
              Sobre
            </Link>
            <Link href="/auth" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            {/* Aqui você pode adicionar o botão hamburger e menu mobile */}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 text-center">
        <div className="relative w-full h-[500px] md:h-[600px]">
       
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center px-6 md:px-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Gerencie seus estabelecimentos <span className="text-primary">com eficiência</span>
            </h2>
            <p className="text-lg md:text-xl text-white mb-10 max-w-3xl">
              Plataforma moderna, segura e escalável para controle total de vendas, estoque e relatórios em tempo real.
            </p>
            <Link
              href="/auth"
              className="inline-block bg-primary text-white px-8 py-4 rounded-xl text-lg md:text-xl hover:bg-secondary transition-transform transform hover:-translate-y-1"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 md:px-10 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-white border border-borderLight rounded-2xl p-8 shadow-lg hover:shadow-2xl transition hover:-translate-y-2">
          <h3 className="text-xl font-semibold mb-4">Relatórios Inteligentes</h3>
          <p className="text-textSecondaryLight">
            Visualize vendas, desempenho e inventário em tempo real para tomar decisões rápidas e assertivas.
          </p>
        </div>

        <div className="bg-white border border-borderLight rounded-2xl p-8 shadow-lg hover:shadow-2xl transition hover:-translate-y-2">
          <h3 className="text-xl font-semibold mb-4">Multi‑Estabelecimento</h3>
          <p className="text-textSecondaryLight">
            Controle múltiplas unidades de forma centralizada, mantendo segurança e organização.
          </p>
        </div>

        <div className="bg-white border border-borderLight rounded-2xl p-8 shadow-lg hover:shadow-2xl transition hover:-translate-y-2">
          <h3 className="text-xl font-semibold mb-4">Segurança Avançada</h3>
          <p className="text-textSecondaryLight">
            Autenticação robusta com controle de permissões, garantindo proteção total dos dados da sua empresa.
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-gradient-to-t from-backgroundLight to-white py-24 px-6 md:px-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-6 text-textPrimaryLight">Por que escolher o SGC?</h3>
          <p className="text-textSecondaryLight text-lg md:text-xl">
            Nossa plataforma combina simplicidade, segurança e tecnologia de ponta para transformar a gestão do seu negócio.
            Tenha acesso a dashboards detalhados, relatórios inteligentes e controle total sobre cada aspecto da sua operação.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-borderLight py-10 px-6 md:px-10 text-center">
        <p className="text-textSecondaryLight mb-4">
          © {new Date().getFullYear()} SGC. Todos os direitos reservados.
        </p>
        <div className="flex justify-center space-x-6">
          <Link href="#" className="text-textSecondaryLight hover:text-primary transition">Termos de Serviço</Link>
          <Link href="#" className="text-textSecondaryLight hover:text-primary transition">Privacidade</Link>
          <Link href="#" className="text-textSecondaryLight hover:text-primary transition">Contato</Link>
        </div>
      </footer>
    </div>
  );
}