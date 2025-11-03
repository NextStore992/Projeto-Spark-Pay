# Galaxy Store - Plataforma de E-commerce Digital

Uma plataforma moderna de e-commerce desenvolvida com React, TypeScript e Supabase para venda de produtos digitais.

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - React Router DOM
  - TanStack Query (React Query)
  - Zustand (Gerenciamento de Estado)

- **Backend:**
  - Supabase (Banco de dados PostgreSQL)
  - Supabase Auth (Autenticação)
  - Supabase Realtime (Atualizações em tempo real)

- **Ferramentas de Build:**
  - Vite
  - ESLint
  - PostCSS

## ✨ Funcionalidades

### Para Clientes
- 🛍️ Navegação de produtos com filtros e categorias
- 🛒 Carrinho de compras completo
- ❤️ Lista de desejos
- 💳 Checkout seguro
- 📦 Acompanhamento de pedidos em tempo real
- 💬 Chat de suporte para pedidos
- 🎯 Produtos em destaque e ofertas
- 🌗 Modo escuro/claro
- 📱 Design responsivo

### Para Administradores
- 📊 Painel administrativo completo
- 📈 Estatísticas de vendas e usuários
- 🏷️ Gerenciamento de produtos e categorias
- 📋 Gestão de pedidos
- 💬 Sistema de chat com clientes
- 🎨 Personalização do site (logo, banners, textos)
- 👥 Gestão de aplicações de afiliados

### Para Afiliados
- 💼 Painel de afiliado
- 📊 Estatísticas de vendas
- 💰 Acompanhamento de comissões

## 🎨 Design e UX

- Interface moderna e intuitiva
- Animações suaves e responsivas
- Sistema de design consistente com tokens semânticos
- Tema personalizável (claro/escuro)
- Carrossel automático de banners
- Notificações toast para feedback do usuário

## 🔐 Segurança

- Autenticação segura com Supabase Auth
- Row Level Security (RLS) no banco de dados
- Sistema de roles (usuário, admin, afiliado)
- Proteção de rotas administrativas
- Validação de dados no frontend e backend

## 📦 Instalação e Uso

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação Local

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre no diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env com as credenciais do Supabase:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Crie a build otimizada
npm run build

# Visualize a build
npm run preview
```

## 🌐 Deploy

### Via Lovable (Recomendado)
1. Acesse [Lovable](https://lovable.dev/projects/90c22a66-f820-4c39-b716-ba51428d652f)
2. Clique em Share → Publish
3. Seu site estará no ar!

### Domínio Customizado
- Navegue até Project > Settings > Domains
- Clique em Connect Domain
- Siga as instruções para conectar seu domínio

## 📝 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── admin/          # Componentes do painel admin
│   ├── ui/             # Componentes de UI (shadcn)
│   └── ...
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── lib/                # Utilitários e configurações
├── integrations/       # Integrações (Supabase)
└── types/              # Definições de tipos TypeScript
```

## 🤝 Contribuindo

Este é um projeto em desenvolvimento ativo. Sugestões e melhorias são bem-vindas!

## 👨‍💻 Desenvolvedor

**Contato:** @079byfael  
**Instagram:** [@079byfael](https://instagram.com/079byfael)

## 📄 Licença

Este projeto é privado e todos os direitos são reservados.

---

Desenvolvido com ❤️ usando [Lovable](https://lovable.dev)
