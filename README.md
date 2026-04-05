# LogiTrack - Frontend (Next.js)

> ⚠️ **Aviso Importante**: Este projeto foi desenvolvido para fins de **aplicação e demonstração de conhecimentos técnicos**.
>
> ⚠️ **Over Engineering Intencional**: Algumas decisões arquiteturais e tecnológicas podem parecer excessivas para o escopo do projeto, mas foram implementadas propositalmente para demonstrar domínio de diferentes tecnologias e patterns.

## Deploy e Demonstração

O sistema está disponível em produção para visualização e testes:

- **Frontend (Aplicação Web)**: [https://logitrack.danieldiegosantana.me/](https://logitrack.danieldiegosantana.me/)
- **API Backend**: [https://api-logitrack.danieldiegosantana.me/](https://api-logitrack.danieldiegosantana.me/)
- **Documentação da API**: [https://logitrack.danieldiegosantana.me/swagger/index.html](https://logitrack.danieldiegosantana.me/swagger/index.html)

## Sobre o Projeto

O LogiTrack Frontend é a interface web do sistema de gestão de manutenção de veículos, desenvolvido com **Next.js 16**, **React 19** e **TypeScript**. A aplicação consome a API REST do backend Java/Spring Boot e oferece uma experiência moderna com **shadcn/ui**, **Tailwind CSS 4** e **Recharts** para visualização de dados.

A arquitetura segue o padrão **Feature-Based**, onde cada módulo (auth, dashboard, veículos, manutenções, relatórios) possui seus próprios componentes, services e models isolados.

---

## Estrutura do Projeto

```
trackMaintenanceFront/
├── app/                              # App Router (Next.js)
│   ├── layout.tsx                    # Layout raiz (fonts, toaster, analytics)
│   ├── page.tsx                      # Redireciona para /login
│   ├── globals.css                   # Estilos globais (Tailwind)
│   ├── login/
│   │   └── page.tsx                  # Página de login
│   ├── register/
│   │   └── page.tsx                  # Página de registro
│   └── (dashboard)/                  # Grupo de rotas protegidas
│       ├── layout.tsx                # Layout com Sidebar
│       ├── dashboard/
│       │   └── page.tsx              # Painel de indicadores
│       ├── veiculos/
│       │   └── page.tsx              # Gestão de veículos
│       ├── manutencao/
│       │   └── page.tsx              # Gestão de manutenções
│       └── relatorios/
│           └── page.tsx              # Relatórios
├── features/                         # Módulos por funcionalidade
│   ├── auth/
│   │   ├── components/               # LoginForm, RegisterForm
│   │   └── services/                 # auth-service.ts
│   ├── dashboard/
│   │   ├── components/               # Cards, gráficos, rankings
│   │   ├── models/                   # Tipagens
│   │   └── services/                 # dashboard-service.ts
│   ├── veiculos/
│   │   ├── components/               # VeiculosTable
│   │   ├── models/                   # Tipagens
│   │   └── services/                 # veiculo-service.ts
│   ├── manutencao/
│   │   ├── components/               # ManutencaoTable
│   │   ├── models/                   # Tipagens
│   │   └── services/                 # manutencao-service.ts
│   └── relatorios/
│       ├── components/               # RelatorioCard, RelatorioList
│       ├── models/                   # Tipagens
│       └── services/                 # relatorio-service.ts
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx               # Sidebar de navegação
│   │   └── header.tsx                # Header
│   └── ui/                           # 50+ componentes shadcn/ui
├── lib/
│   ├── api.ts                        # HTTP client (fetch wrapper)
│   └── utils.ts                      # Utilitários (cn, etc)
├── hooks/
│   ├── use-mobile.ts                 # Hook de detecção mobile
│   └── use-toast.ts                  # Hook de toast
├── middleware.ts                      # Proteção de rotas (JWT cookie)
├── next.config.mjs                    # Configuração Next.js
├── tailwind.config.ts                 # Configuração Tailwind
├── tsconfig.json                      # Configuração TypeScript
└── package.json                       # Dependências
```

---

## Páginas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Público | Formulário de login |
| `/register` | Público | Formulário de registro |
| `/dashboard` | Protegido | Painel com indicadores (KM, categorias, ranking, cronograma, projeção) |
| `/veiculos` | Protegido | CRUD de veículos com tabela paginada |
| `/manutencao` | Protegido | CRUD de manutenções com filtros e status |
| `/relatorios` | Protegido | Relatórios e métricas |

---

## Autenticação e Middleware

O middleware intercepta todas as rotas e:

1. **Rotas públicas** (`/`, `/login`, `/register`) — acesso livre
2. **Rotas protegidas** — redireciona para `/login` se não houver cookie `token`
3. **Redirect autenticado** — se já logado, `/login` e `/register` redirecionam para `/dashboard`

O token JWT é armazenado em **localStorage** (para uso no client) e como **cookie** (para o middleware do Next.js validar no server).

---

## HTTP Client (`lib/api.ts`)

Wrapper centralizado para todas as chamadas à API:

```typescript
api.get<T>(endpoint)          // GET
api.getPaged<T>(endpoint)     // GET paginado
api.post<T>(endpoint, data)   // POST
api.put<T>(endpoint, data)    // PUT
api.patch<T>(endpoint, data)  // PATCH
api.delete<T>(endpoint)       // DELETE
```

**Funcionalidades:**
- Injeta `Authorization: Bearer <token>` automaticamente
- Trata `204 No Content`
- Redireciona para `/login` em caso de `401` (exceto endpoints de auth)
- Limpa token e cookies ao expirar

## Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Next.js** | `16.2.0` | Framework React com App Router e SSR |
| **React** | `19` | Biblioteca de UI |
| **TypeScript** | `5.7.3` | Tipagem estática |
| **Tailwind CSS** | `4.2.0` | Estilização utility-first |
---

## Como Rodar o Projeto

### Requisitos

- [Node.js](https://nodejs.org/) (versão 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/diegodanielsantana00/TrackMaintenance-NextJS-FrontEnd.git frontend

# Instale as dependências
cd frontend
npm install --legacy-peer-deps

# Rode em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3430`.

### Com Docker

```bash
# Desenvolvimento
docker compose -f docker-compose.yml up -d

# Produção
docker build -f Dockerfile.prod -t logitrack-frontend .
docker run -p 3430:3430 logitrack-frontend
```

### Variáveis de Ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3440` | URL base da API Backend |

---