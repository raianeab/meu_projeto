# Arquitetura — Metavis

## Visão Geral

Metavis é uma plataforma SaaS multi-tenant para people analytics e inteligência organizacional.
Empresas carregam planilhas de dados de RH que são armazenadas por tenant e exibidas em relatórios
Power BI Embedded isolados por empresa. Administradores gerenciam usuários via fluxo de convite
por e-mail com token de expiração.

## Stack Tecnológico

| Camada | Tecnologia | Versão |
|---|---|---|
| Runtime | Node.js | ≥18 |
| Framework web | Express | ^5.1.0 |
| Template engine | EJS | ^3.1.10 |
| Banco de dados | PostgreSQL via Supabase | — |
| Cliente de banco | @supabase/supabase-js | ^2.49.8 |
| Driver PostgreSQL | pg | ^8.16.0 |
| BI Embedded | Microsoft Power BI Embedded | — |
| Auth Azure | Azure Service Principal (OAuth2 client_credentials) | — |
| Sessão | express-session | ^1.18.1 |
| Hash de senha | bcrypt | ^6.0.0 |
| Upload de arquivos | multer | ^2.0.2 |
| Parsing Excel | xlsx | ^0.18.5 |
| Parsing CSV | csv-parse | ^6.1.0 |
| HTTP client | axios | ^1.13.2 |
| E-mail | nodemailer | ^7.0.12 |
| CSS (landing) | Tailwind CSS CDN | 3.x |
| CSS (app) | Bootstrap | 5.x |

## Estrutura do Repositório

```
/
├── src/
│   ├── server.js                     # Entry point: instância Express, registro de rotas, middlewares
│   ├── config/
│   │   └── db.js                     # Supabase client singleton com verificação de conexão
│   ├── controllers/
│   │   ├── authController.js         # login, register, logout, checkAuth
│   │   ├── dashboardController.js    # renderiza dashboard; busca embed token Power BI
│   │   ├── dataController.js         # recebe upload, aciona dataService, upserta dados
│   │   ├── inviteController.js       # exibe form de convite; cria usuário a partir do token
│   │   ├── usersCompanyController.js # lista, convida, ativa e desativa usuários da empresa
│   │   └── leadsController.js        # captura lead da landing page
│   ├── services/
│   │   ├── dataService.js            # parsing xlsx/csv, mapeamento de colunas, normalização de tipos
│   │   ├── dashboardService.js       # consulta dados da empresa para o dashboard
│   │   ├── emailService.js           # transporter Nodemailer (conta de teste em dev)
│   │   ├── inviteService.js          # geração e validação de token; criação de usuário
│   │   ├── leadsService.js           # criação de lead com checagem de duplicata
│   │   ├── powerBIService.js         # Azure OAuth2 + embed URL/token Power BI
│   │   └── userService.js            # queries e gestão de status de usuários
│   ├── repositories/
│   │   ├── companyRepository.js      # CRUD companies
│   │   ├── leadsRepository.js        # CRUD leads
│   │   └── usersRepository.js        # CRUD usuarios
│   ├── middlewares/
│   │   ├── authMiddleware.js         # isAuthenticated, isAdmin, isOrganizer
│   │   └── uploadMiddleware.js       # Multer: disk storage, validação de extensão, limite 10 MB
│   ├── routes/
│   │   ├── authRoutes.js             # /auth/*
│   │   ├── dashboardRoutes.js        # /dashboard
│   │   ├── dataRoutes.js             # /dados, /dados/upload
│   │   ├── inviteRoutes.js           # /convite/:token, /convite/definir-senha
│   │   ├── companyUsersRoutes.js     # /usuarios/*
│   │   └── leadsRoutes.js            # /leads
│   ├── views/
│   │   ├── pages/
│   │   │   ├── landing.ejs           # homepage pública (Tailwind CSS)
│   │   │   ├── login.ejs             # formulário de login
│   │   │   ├── register.ejs          # formulário de cadastro
│   │   │   ├── dashboard.ejs         # relatório Power BI embedded
│   │   │   ├── inserir-dados.ejs     # upload de planilha
│   │   │   ├── users-company.ejs     # gestão de usuários
│   │   │   ├── accept-invite.ejs     # aceite de convite / definição de senha
│   │   │   └── error.ejs             # página de erro genérica
│   │   └── partials/
│   │       ├── header.ejs            # navbar Bootstrap com links de navegação
│   │       └── footer.ejs            # imports JS globais (Bootstrap, FA, SweetAlert2)
│   ├── public/
│   │   ├── css/
│   │   │   ├── base.css              # @font-face Aeonik Pro + variáveis CSS custom
│   │   │   ├── layout.css            # containers e grid
│   │   │   ├── components.css        # botões, cards, badges
│   │   │   └── pagesCSS/             # estilos específicos por página (login, data, user)
│   │   ├── fonts/aeonik/             # Aeonik Pro (TTF/OTF, múltiplos pesos)
│   │   └── images/                   # logos e branding
│   ├── migrations/
│   │   └── setup_database.sql        # schema atual do banco (tabelas ativas)
│   ├── scripts/
│   │   └── init.sql                  # schema legado de eventos (não utilizado)
│   └── uploads/                      # arquivos temporários de upload (deletados após processamento)
├── documentos/                       # documentação do projeto
├── package.json
└── .env                              # variáveis de ambiente (não versionado)
```

> As rotas são registradas diretamente em `server.js`. O arquivo `src/routes/index.js` existe
> mas não é utilizado pelo servidor.

## Banco de Dados

### Tecnologia

PostgreSQL hospedado no Supabase. O acesso é feito pelo cliente oficial `@supabase/supabase-js`
instanciado como singleton em `src/config/db.js`. Row Level Security (RLS) está desabilitado
— o isolamento multi-tenant é feito por filtro explícito de `company_id` em todas as queries.

### Entidades

#### usuarios

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID PK | Chave primária gerada automaticamente |
| nome_completo | TEXT | Nome do usuário |
| email | TEXT UNIQUE | E-mail de autenticação |
| senha | TEXT | Hash bcrypt da senha |
| telefone | TEXT | Opcional |
| role | TEXT | `admin`, `user` ou `organizador` |
| status | TEXT | `active` ou `inactive` |
| company_id | UUID FK | Referência para companies |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Última atualização |

#### companies

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID PK | Chave primária |
| name | TEXT | Nome da empresa |
| power_bi_workspace_id | TEXT | ID do workspace no Power BI |
| power_bi_report_id | TEXT | ID do relatório no Power BI |
| user_limit | INTEGER | Máximo de usuários permitidos |
| created_at | TIMESTAMP | Data de criação |

#### user_invites

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID PK | Chave primária |
| email | TEXT | Destinatário do convite |
| company_id | UUID FK | Empresa do convidado |
| token | TEXT UNIQUE | Hex de 32 bytes (256-bit, `crypto.randomBytes`) |
| expires_at | TIMESTAMP | `now() + 1 hora` |
| used | BOOLEAN | Se o token foi consumido |
| type | TEXT | `invite` ou `reset_password` |
| created_at | TIMESTAMP | Data de criação |

#### dados

Tabela principal de people analytics. Upsert com `onConflict: 'company_id,EmployeeID'`.

| Campo | Tipo | Descrição |
|---|---|---|
| company_id | UUID FK | Tenant owner do registro |
| EmployeeID | TEXT | Identificador do funcionário (parte da chave) |
| Business_Unit | TEXT | Unidade de negócio |
| Group_Macro / Group_Mid / Group_Micro | TEXT | Hierarquia de grupos |
| EmployeeJobTitle | TEXT | Cargo |
| InternalGrade | TEXT | Grau interno |
| Estado / Cidade | TEXT | Localização |
| Gender | TEXT | Gênero |
| HireDate / BirthDate | DATE | Datas (normalizadas no upload) |
| ManagerEmployeeID | TEXT | ID do gestor direto |
| Monthly_Salary | NUMERIC | Salário mensal |
| ICP_Target / ICP_Paid | NUMERIC | Metas e pagamentos de ICP |
| ILP_Target / ILP_Paid | NUMERIC | Metas e pagamentos de ILP |
| SB / RDA | NUMERIC | Benefícios |
| Layer / Span | INTEGER | Camada hierárquica e amplitude de controle |
| IEG / AUX_IEG1 / AUX_IEG2 | NUMERIC | Índices de engajamento |
| created_at | TIMESTAMP | Data de inserção |

#### leads

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID PK | Chave primária |
| nome | TEXT | Nome do lead |
| nome_empresa | TEXT | Empresa do lead |
| email | TEXT | E-mail |
| created_at | TIMESTAMP | Data de captura |

### Relacionamentos

- `usuarios` N:1 `companies` — cada usuário pertence a uma empresa; chave `company_id`.
- `user_invites` N:1 `companies` — cada convite é emitido para uma empresa; chave `company_id`.
- `dados` N:1 `companies` — cada registro de people analytics pertence a uma empresa; chave `company_id`.
- `leads` não possui relacionamento com outras tabelas.

## Fluxo de Dados

### Requisição autenticada típica

```
1. Browser envia request HTTP
2. server.js aplica middlewares globais (session, flash, body-parser, static)
3. Route module correspondente recebe a requisição
4. authMiddleware.isAuthenticated verifica req.session.user
   → sem sessão: redirect /auth/login
5. Controller extrai parâmetros da request
6. Controller chama Service (lógica de negócio)
7. Service chama Repository ou Supabase client diretamente
8. Supabase client executa query no PostgreSQL
9. Resultado sobe: Repository → Service → Controller
10. Controller renderiza view EJS ou envia redirect com flash message
```

### Fluxo de upload de dados

```
1. POST /dados/upload (multipart/form-data)
2. uploadMiddleware (Multer) salva arquivo em src/uploads/
3. dataController.upload aciona dataService.processUploadFile
4. dataService:
   a. xlsx.readFile ou csv-parse lê o arquivo
   b. Ignora as 2 primeiras linhas (cabeçalho do template)
   c. Mapeia cada coluna por posição para TECH_COLUMNS (35 campos)
   d. convertTypes normaliza datas (serial Excel, M/D/YYYY, ISO) e números
5. dataController faz upsert em lotes de 100 registros
   → onConflict: 'company_id,EmployeeID'
   → company_id vem de req.session.user.company_id
6. Arquivo temporário é deletado (sucesso ou erro)
7. Flash message + redirect /dados
```

### Fluxo de embed Power BI

```
1. GET /dashboard
2. dashboardService busca power_bi_workspace_id e power_bi_report_id da empresa
3. powerBIService.getAzureAccessToken():
   → POST Azure OAuth2 com client_credentials
   → Token cacheado até expiração
4. powerBIService.getEmbedUrl() → GET Power BI API /reports/{reportId}
5. powerBIService.generateEmbedToken() → POST /reports/{reportId}/GenerateToken
6. dashboard.ejs recebe embedUrl, embedToken, reportId
7. powerbi-client.js (CDN) monta o iframe com o relatório
```

## Rotas e Endpoints

### Páginas (Frontend)

| Rota | Descrição | Auth |
|---|---|---|
| `/` | Landing page pública; redireciona autenticado para `/dashboard` | Não |
| `/auth/login` | Formulário de login | Não |
| `/auth/register` | Formulário de cadastro | Não |
| `/convite/:token` | Formulário de aceite de convite | Não |
| `/dashboard` | Relatório Power BI embedded | Sim |
| `/dados` | Upload de planilha | Sim |
| `/usuarios` | Gestão de usuários da empresa | Admin |

### API

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Não | Autentica e cria sessão |
| POST | `/auth/register` | Não | Cria conta e sessão |
| GET | `/auth/logout` | Sim | Destrói sessão |
| GET | `/auth/check` | Sim | Retorna JSON do usuário logado |
| POST | `/dados/upload` | Sim | Recebe planilha, processa e faz upsert |
| POST | `/convite/definir-senha` | Não | Cria usuário a partir do token de convite |
| POST | `/usuarios/convidar` | Admin | Envia convite por e-mail |
| POST | `/usuarios/:id/desativar` | Admin | Desativa usuário |
| POST | `/usuarios/:id/ativar` | Admin | Ativa usuário |
| POST | `/leads` | Não | Registra lead da landing page |
| GET | `/test` | Não | Health check |

## Autenticação

Session-based com `express-session`. A senha nunca é armazenada em sessão.

**Roles disponíveis:**

| Role | Middleware | Permissões |
|---|---|---|
| `admin` | `isAdmin` | Acesso total, incluindo gestão de usuários |
| `organizador` | `isOrganizer` | Acesso ao app sem gestão de usuários |
| `user` | `isAuthenticated` | Dashboard e upload de dados |

**Fluxo de convite (criação de usuário sem auto-registro):**

```
Admin POST /usuarios/convidar
  → token = crypto.randomBytes(32).toString('hex')
  → expires_at = now() + 1h
  → INSERT user_invites
  → e-mail com link /convite/:token

Usuário acessa link
  → validateInvite: token não usado, não expirado
  → POST /convite/definir-senha { nome_completo, password }
  → bcrypt.hash(password, 10)
  → INSERT usuarios
  → UPDATE user_invites SET used = true
```

Tokens nunca são deletados — apenas marcados como `used = true` para fins de auditoria.

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_KEY` | Chave anônima do Supabase |
| `SESSION_SECRET` | Secret para assinar o cookie de sessão |
| `NODE_ENV` | `development` ou `production` |
| `PORT` | Porta do servidor HTTP (padrão: 3000) |
| `AZURE_TENANT_ID` | ID do tenant Azure AD |
| `AZURE_CLIENT_ID` | ID do Service Principal Azure |
| `AZURE_CLIENT_SECRET` | Secret do Service Principal Azure |
| `POWER_BI_SCOPE` | Scope da API Power BI (`https://analysis.windows.net/powerbi/api/.default`) |
| `POWER_BI_AUTH_URL` | URL base de autenticação Azure (`https://login.microsoftonline.com`) |
| `POWER_BI_API_URL` | URL base da API Power BI (`https://api.powerbi.com/v1.0/myorg`) |

## Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de ambiente
cp .env.example .env
# Preencher as variáveis em .env

# 3. Criar as tabelas no banco
# Acessar o Supabase SQL Editor e executar:
# src/migrations/setup_database.sql

# 4. Iniciar em desenvolvimento (com auto-restart)
npm run dev

# 5. Acessar
# http://localhost:3000
```

## Decisões de Arquitetura Relevantes

**Rotas registradas em server.js, não em routes/index.js**
O arquivo `src/routes/index.js` existe mas não é utilizado. Todas as rotas são
importadas e montadas diretamente em `server.js`. Isso evita uma camada de indireção,
mas concentra o registro de rotas em um único arquivo.

**Mapeamento de colunas por posição, não por nome**
`dataService.js` mapeia cada coluna da planilha pelo índice de posição (`TECH_COLUMNS[i]`),
não pelo cabeçalho. Isso torna o processamento insensível a variações de nome de coluna
e requer que o template entregue ao usuário final mantenha a ordem exata das colunas.

**Upsert como estratégia de idempotência**
O upload de dados não verifica existência prévia nem exige remoção antes de recarregar.
O upsert com `onConflict: 'company_id,EmployeeID'` garante que re-uploads atualizem
registros existentes sem duplicar dados.

**powerBIService.js com bug de módulo ativo**
O arquivo usa sintaxe ES6 `export` mas o projeto é CommonJS puro (`require()`).
Isso causa falha em runtime ao tentar gerar o embed token. O fix é substituir
`export` por `module.exports`. Enquanto não corrigido, o dashboard não carrega
o relatório para empresas com Power BI configurado.

**Nodemailer em modo de teste**
Em desenvolvimento, `emailService.js` usa uma conta de teste do Ethereal Mail.
O link de preview do e-mail é logado no console. Para produção é necessário
configurar um transporter SMTP real via variáveis de ambiente.

**RLS desabilitado no Supabase**
Row Level Security está desligado. O isolamento entre tenants depende inteiramente
de `WHERE company_id = req.session.user.company_id` em cada query. Uma query sem
esse filtro vaza dados entre empresas sem nenhuma barreira no banco.
