// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  BarChart3, 
  Building2, 
  Shield, 
  Zap, 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  Smartphone,
  Sparkles,
  ChevronRight,
  Star,
  Globe,
  Clock,
  Award,
  ChevronUp,
  Menu,
  X,
  MessageCircle
} from "lucide-react";

import Logo from "@/public/image/logo.png";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Relatórios Inteligentes com IA",
      description: "Análises preditivas, insights automáticos e recomendações para maximizar seus lucros.",
      color: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Lucro Real por Produto",
      description: "Descubra exatamente quanto cada produto está lucrando, com custos operacionais rateados.",
      color: "from-blue-600 to-indigo-600",
      delay: 0.1
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Stock Inteligente",
      description: "Alertas de ruptura, sugestões automáticas de compra e rotação de stock em tempo real.",
      color: "from-cyan-500 to-blue-500",
      delay: 0.2
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Multi-Estabelecimento",
      description: "Controle todas as suas unidades em um só lugar com dashboards consolidados.",
      color: "from-blue-500 to-blue-700",
      delay: 0.3
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Segurança Avançada",
      description: "Proteção de dados com criptografia e controle de permissões granular.",
      color: "from-indigo-500 to-blue-600",
      delay: 0.4
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Processos Automatizados",
      description: "Automatize fechos de caixa, alertas e relatórios. Ganhe tempo e reduza erros.",
      color: "from-cyan-600 to-blue-600",
      delay: 0.5
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime Garantido", icon: <Globe className="w-5 h-5" /> },
    { value: "24/7", label: "Suporte Prioritário", icon: <Clock className="w-5 h-5" /> },
    { value: "4.9", label: "Avaliação Média", icon: <Star className="w-5 h-5" /> }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/258873269520", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-sans overflow-x-hidden">
      
      {/* WhatsApp Support Button */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-50 group animate-bounce-slow"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition"></div>
          <div className="relative bg-green-500 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Suporte</span>
          </div>
        </div>
      </button>

      {/* Navbar */}
      <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src={Logo} 
              alt="SGC Logo" 
              className="w-12 h-auto object-contain transition-transform group-hover:scale-105 duration-300"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SGC
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Início", "Funcionalidades", "Sobre", "Planos"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item === "Início" ? "hero" : item.toLowerCase())}
                className="text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <Link
              href="/auth"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Entrar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white shadow-md"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl animate-slideDown">
            <div className="flex flex-col p-6 gap-4">
              {["Início", "Funcionalidades", "Sobre", "Planos"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item === "Início" ? "hero" : item.toLowerCase())}
                  className="text-gray-600 hover:text-blue-600 py-2 font-medium text-left"
                >
                  {item}
                </button>
              ))}
              <Link
                href="/auth"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl text-center"
              >
                Entrar
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 animate-fadeInUp">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">SGC 2.0 - A Era Inteligente</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fadeInUp animation-delay-100">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Welcome to SGC
            </span>
            <br />
           
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
            A plataforma que evolui diariamente para garantir a boa gestão dos negócios em Moçambique.
            Relatórios inteligentes, automação total e insights que impulsionam seus lucros.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-300">
            <Link
              href="/auth"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <button
              onClick={() => scrollToSection("funcionalidades")}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
            >
              Ver Funcionalidades
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-gray-200 animate-fadeInUp animation-delay-400">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.icon}
                  {stat.value}
                </div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Funcionalidades Poderosas</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tudo que você precisa para
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> gerenciar seu negócio</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ferramentas inteligentes que se adaptam ao seu negócio e evoluem diariamente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100"
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{ animationDelay: `${feature.delay}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 transition-transform duration-500 group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">SGC em Evolução</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Evoluindo diariamente para
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> garantir sua excelência</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                O SGC não é apenas um sistema de gestão. É um parceiro inteligente que aprende com seu negócio,
                oferecendo insights valiosos e automações que transformam a maneira como você empreende em Moçambique.
              </p>
              <div className="flex gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Acesso Mobile</p>
                    <p className="text-sm text-gray-500">Gestão na palma da mão</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">Vendas Rápidas</p>
                    <p className="text-sm text-gray-500">PDV intuitivo</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="bg-white rounded-2xl shadow-2xl p-6 relative z-10 border border-gray-100">
                <div className="space-y-4">
                  {[
                    { label: "Redução de Custos", value: "35%", color: "bg-indigo-500" },
                    { label: "Aumento de Produtividade", value: "45%", color: "bg-blue-600" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 ${item.color} rounded-full animate-pulse`}></div>
                        <span className="font-bold text-gray-900">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center px-6 md:px-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Junte-se a empresários que já estão evoluindo com o SGC
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              Começar Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <button
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              Dúvidas? Fale Conosco
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src={Logo} alt="SGC Logo" className="w-10 h-auto" />
                <span className="text-xl font-bold">SGC</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sistema de Gestão Comercial com Inteligência Artificial para negócios em Moçambique.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection("funcionalidades")} className="hover:text-white transition">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection("sobre")} className="hover:text-white transition">Sobre</button></li>
                <li><Link href="/auth" className="hover:text-white transition">Entrar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={openWhatsApp} className="hover:text-white transition">WhatsApp</button></li>
                <li><a href="#" className="hover:text-white transition">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Parceiros</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://uanicode.com" target="_blank" className="hover:text-white transition">UANICODE</a></li>
                <li><a href="https://foodnect.uanicode.com" target="_blank" className="hover:text-white transition">Foodnect</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} SGC - Sistema de Gestão Comercial. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-24 right-6 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 group z-40 border border-gray-200"
      >
        <ChevronUp className="w-5 h-5 text-blue-600 group-hover:-translate-y-0.5 transition" />
      </button>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
}