🍽️ SGC Frontend — Sistema de Gestão Comercial

Frontend moderno construído com Next.js 14 + TailwindCSS, integrado à API SGC (Spring Boot), preparado para ambiente de produção, escalabilidade e integração contínua.

🧭 Sumário

🚀 Visão Geral

🏗️ Arquitetura

📦 Estrutura do Projeto

⚙️ Configuração do Ambiente

🔐 Variáveis de Ambiente

🌍 Ambientes (Dev / Produção)

🔗 Integração com API

🧪 Testes

💽 Build & Deploy

🛠️ Tecnologias

🎯 Próximos Passos

🚀 1. Visão Geral

O SGC Frontend é a interface web do Sistema de Gestão Comercial.

Permite:

📦 Gerenciar produtos

💰 Registrar vendas

👤 Gerenciar usuários

📊 Visualizar relatórios

🔐 Autenticação com JWT

📱 Interface responsiva

O projeto é focado em:

Performance

Escalabilidade

Código limpo

Integração segura com backend

🏗️ 2. Arquitetura
SGC Frontend (Next.js)
│
├── 🔐 Autenticação JWT
├── 📡 Comunicação REST com API
├── 🎨 UI com TailwindCSS
├── ⚡ SSR / App Router
└── 🌍 Deploy (Vercel / VPS)
📦 3. Estrutura do Projeto
SGC-Frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   ├── login/
│   └── products/
├── components/
│   ├── ui/
│   ├── layout/
│   └── forms/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── public/
├── styles/
│   └── globals.css
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── package.json
⚙️ 4. Configuração do Ambiente
1️⃣ Instalar dependências
npm install

ou

yarn install
2️⃣ Rodar em desenvolvimento
npm run dev

Aplicação disponível em:

http://localhost:3000
🔐 5. Variáveis de Ambiente (.env.example)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=SGC
NEXT_PUBLIC_APP_ENV=dev

⚠️ Nunca comite o .env.local real.

🌍 6. Ambientes
🔹 Desenvolvimento
NEXT_PUBLIC_API_URL=http://localhost:5000
🔹 Produção
NEXT_PUBLIC_API_URL=https://api.sgc.com
🔗 7. Integração com Backend

O frontend consome a API SGC via REST.

Exemplo de configuração:

// lib/api.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetcher(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}

Autenticação:

JWT armazenado em cookie HTTP-only ou localStorage

Header Authorization: Bearer token

🧪 8. Testes

(Se implementar)

npm run test

Pode usar:

Jest

React Testing Library

💽 9. Build & Deploy
Build produção
npm run build
Rodar produção
npm start
🚀 Deploy sugerido

Vercel (recomendado)

VPS com Docker

Nginx reverse proxy

🛠️ 10. Tecnologias Utilizadas

⚛️ Next.js 14 (App Router)

🎨 TailwindCSS

📦 TypeScript

🔐 JWT Authentication

🌐 REST API

🐙 GitHub

🎯 11. Próximos Passos

 Implementar proteção de rotas

 Criar layout base do dashboard

 Implementar sistema de permissões

 Dark Mode

 Otimização SEO

 Integração CI/CD