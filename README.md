# Metavis — Plataforma de Inteligência Organizacional

Metavis é um SaaS multi-tenant para people analytics e inteligência organizacional. Permite que empresas carreguem dados de RH, visualizem relatórios embedded do Power BI e gerenciem usuários por empresa.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Template Engine | EJS |
| Banco de Dados | Supabase (PostgreSQL) |
| BI Embedded | Microsoft Power BI Embedded |
| Auth Azure | Azure Service Principal (OAuth2) |
| Upload de Arquivos | Multer |
| Parsing Excel/CSV | xlsx + csv-parse |
| Hash de Senhas | bcrypt |
| Sessões | express-session |
| E-mail | Nodemailer |
| CSS (Landing) | Tailwind CSS CDN |
| CSS (App) | Bootstrap 5 |

---

## Estrutura de Pastas

```
meu_projeto/
├── src/
│   ├── server.js                     # Entry point — Express, rotas, middlewares
│   ├── config/
│   │   └── db.js                     # Supabase client singleton
│   ├── controllers/
│   │   ├── authController.js         # Login, registro, logout, check
│   │   ├── dashboardController.js    # Dashboard + embed Power BI
│   │   ├── dataController.js         # Upload e upsert de dados
│   │   ├── inviteController.js       # Aceite de convite e reset de senha
│   │   ├── usersCompanyController.js # Gestão de usuários da empresa
│   │   └── leadsController.js        # Captura de leads (landing page)
│   ├── services/
│   │   ├── dataService.js            # Parsing xlsx/csv + normalização de tipos
│   │   ├── dashboardService.js       # Consulta dados do dashboard por empresa
│   │   ├── emailService.js           # Nodemailer transporter
│   │   ├── inviteService.js          # Token de convite + criação de usuário
│   │   ├── leadsService.js           # Registro de leads com dedup
│   │   ├── powerBIService.js         # Azure OAuth2 + embed token Power BI
│   │   └── userService.js            # Consultas e gestão de usuários
│   ├── repositories/
│   │   ├── companyRepository.js      # CRUD companies
│   │   ├── leadsRepository.js        # CRUD leads
│   │   └── usersRepository.js        # CRUD usuarios
│   ├── middlewares/
│   │   ├── authMiddleware.js         # isAuthenticated, isAdmin, isOrganizer
│   │   └── uploadMiddleware.js       # Multer — xlsx/xls/csv, 10 MB
│   ├── routes/
│   │   ├── authRoutes.js             # /auth/*
│   │   ├── dashboardRoutes.js        # /dashboard
│   │   ├── dataRoutes.js             # /dados/*
│   │   ├── inviteRoutes.js           # /convite/*
│   │   ├── companyUsersRoutes.js     # /usuarios/*
│   │   └── leadsRoutes.js            # /leads
│   ├── views/
│   │   ├── pages/
│   │   │   ├── landing.ejs           # Homepage pública (Tailwind)
│   │   │   ├── login.ejs             # Formulário de login
│   │   │   ├── register.ejs          # Formulário de cadastro
│   │   │   ├── dashboard.ejs         # Power BI embedded
│   │   │   ├── inserir-dados.ejs     # Upload de planilha
│   │   │   ├── users-company.ejs     # Gestão de usuários
│   │   │   ├── accept-invite.ejs     # Aceite de convite
│   │   │   └── error.ejs             # Página de erro
│   │   └── partials/
│   │       ├── header.ejs            # Navbar Bootstrap
│   │       └── footer.ejs            # Scripts globais + utilitários JS
│   ├── public/
│   │   ├── css/
│   │   │   ├── base.css              # Fontes Aeonik Pro + variáveis CSS
│   │   │   ├── layout.css            # Grid e containers
│   │   │   ├── components.css        # Botões, cards, badges
│   │   │   └── pagesCSS/             # Estilos específicos por página
│   │   ├── fonts/aeonik/             # Fonte Aeonik Pro (múltiplos pesos)
│   │   └── images/                   # Logos e branding
│   ├── migrations/
│   │   └── setup_database.sql        # Schema atual do banco
│   ├── scripts/
│   │   └── init.sql                  # Schema legado (não utilizado)
│   └── uploads/                      # Arquivos temporários de upload
├── package.json
├── .env                              # Variáveis de ambiente (não versionado)
└── CLAUDE.md                         # Instruções para Claude Code
```

---

## Fluxo de Requisição

```
Request HTTP
    ↓
server.js  (session, flash, body-parser, static files)
    ↓
Route Module  (authRoutes, dashboardRoutes, dataRoutes, inviteRoutes, companyUsersRoutes, leadsRoutes)
    ↓
authMiddleware.isAuthenticated  (rotas protegidas)
    ↓
Controller  (entrada/saída HTTP, flash, redirect)
    ↓
Service  (lógica de negócio)
    ↓
Repository / Supabase Client
    ↓
PostgreSQL (Supabase)
```

> As rotas são registradas diretamente em `server.js`. O arquivo `src/routes/index.js` existe mas não é usado.

---

## Banco de Dados

### Tabelas Ativas

#### `usuarios`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | Chave primária |
| nome_completo | TEXT | Nome do usuário |
| email | TEXT UNIQUE | E-mail de login |
| senha | TEXT | Hash bcrypt |
| telefone | TEXT | Opcional |
| role | TEXT | `admin`, `user`, `organizador` |
| status | TEXT | `active`, `inactive` |
| company_id | UUID FK | Referência à empresa |
| created_at | TIMESTAMP | Criação |
| updated_at | TIMESTAMP | Atualização |

#### `companies`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | Chave primária |
| name | TEXT | Nome da empresa |
| power_bi_workspace_id | TEXT | ID do workspace Power BI |
| power_bi_report_id | TEXT | ID do relatório Power BI |
| user_limit | INTEGER | Limite de usuários por empresa |
| created_at | TIMESTAMP | Criação |

#### `user_invites`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | Chave primária |
| email | TEXT | Destinatário |
| company_id | UUID FK | Empresa do convidado |
| token | TEXT UNIQUE | Token hex de 32 bytes |
| expires_at | TIMESTAMP | Validade (1 hora após criação) |
| used | BOOLEAN | Se o token já foi utilizado |
| type | TEXT | `invite` ou `reset_password` |
| created_at | TIMESTAMP | Criação |

#### `dados`
Tabela principal de people analytics. Upsert com conflito em `(company_id, EmployeeID)`.

Campos: `Business_Unit`, `SP/Manaus`, `Group_Macro`, `Group_Mid`, `Group_Micro`, `EmployeeID`, `EmployeeJobTitle`, `InternalGrade`, `EmployeeGroup`, `Estado`, `Cidade`, `Gender`, `HireDate`, `BirthDate`, `ManagerEmployeeID`, `Monthly_Salary`, `ICP_Target`, `ICP_Paid`, `ILP_Target`, `ILP_Paid`, `SB`, `RDA`, `Layer`, `Span`, `ManagerJobTitle`, `ManagerGroup`, `ManagerLayer`, `IEG`, `AUX_IEG1`, `AUX_IEG2`, `created_at`.

#### `leads`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID PK | Chave primária |
| nome | TEXT | Nome do lead |
| nome_empresa | TEXT | Empresa do lead |
| email | TEXT | E-mail |
| created_at | TIMESTAMP | Criação |

> Tabelas legadas existentes no banco mas não utilizadas: `eventos`, `inscricoes`, `categorias`, `certificados`, `eventos_feedbacks`, `eventos_categorias`.

---

## API — Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/` | — | Autenticado → `/dashboard`; anônimo → landing |
| GET | `/auth/login` | — | Página de login |
| POST | `/auth/login` | — | Processa login |
| GET | `/auth/register` | — | Página de cadastro |
| POST | `/auth/register` | — | Processa cadastro |
| GET | `/auth/logout` | ✓ | Encerra sessão |
| GET | `/auth/check` | ✓ | JSON do usuário logado |
| GET | `/dashboard` | ✓ | Dashboard com relatório Power BI |
| GET | `/dados` | ✓ | Página de upload de planilha |
| POST | `/dados/upload` | ✓ | Processa arquivo e upsert na tabela `dados` |
| GET | `/convite/:token` | — | Formulário de aceite de convite |
| POST | `/convite/definir-senha` | — | Cria usuário a partir do convite |
| GET | `/usuarios` | ✓ Admin | Lista usuários da empresa |
| POST | `/usuarios/convidar` | ✓ Admin | Envia convite por e-mail |
| POST | `/usuarios/:id/desativar` | ✓ Admin | Desativa usuário |
| POST | `/usuarios/:id/ativar` | ✓ Admin | Ativa usuário |
| POST | `/leads` | — | Captura lead da landing page |
| GET | `/test` | — | Health check |

---

## Autenticação e Sessão

**Tipo:** Session-based com express-session (não JWT).

`req.session.user` armazena o usuário logado sem o campo senha.

**Roles:** `admin`, `user`, `organizador`

**Middlewares disponíveis:**
- `isAuthenticated` — redireciona para `/auth/login` se não houver sessão
- `isAdmin` — verifica `role === 'admin'`
- `isOrganizer` — verifica `role` in `['admin', 'organizador']`

### Fluxo de Login
```
POST /auth/login { email, senha }
  → authController.login
  → Query usuarios WHERE email = ?
  → bcrypt.compare(senha, hash)
  → Verifica status !== 'inactive'
  → req.session.user = { id, email, role, company_id, nome_completo, ... }
  → Redirect /dashboard
```

### Fluxo de Convite de Usuário
```
Admin POST /usuarios/convidar { email }
  → inviteService.createInvite(email, companyId)
      → Gera token = crypto.randomBytes(32).toString('hex')
      → expires_at = now() + 1 hora
      → INSERT user_invites { email, company_id, token, expires_at, type='invite', used=false }
  → emailService.sendEmail com link /convite/:token

Usuário clica no link
  → GET /convite/:token
      → validateInvite: token não usado + não expirado
      → Render accept-invite.ejs

  → POST /convite/definir-senha { token, nome_completo, password, confirmPassword }
      → Valida senha (mín. 8 chars, confirmação)
      → validateInvite novamente
      → bcrypt.hash(password, 10)
      → INSERT usuarios { email, company_id, nome_completo, senha }
      → UPDATE user_invites SET used = true WHERE token = ?
      → Redirect /auth/login
```

---

## Fluxo de Upload de Dados

```
GET /dados → Página com botão de upload e link para template

POST /dados/upload  (multipart/form-data, campo: file)
  → Multer salva em src/uploads/ como upload-{timestamp}-{random}.{ext}
  → Aceita: .xlsx, .xls, .csv | Limite: 10 MB

  → dataService.processUploadFile(filepath, extension)
      → .xlsx/.xls: xlsx.readFile → sheet_to_json({ raw: true })
      → .csv: csv-parse/sync
      → Ignora linhas 1-2 (cabeçalho duplo do template)
      → Processa a partir da linha 3 (índice 2)
      → mapRow: posição da coluna → TECH_COLUMNS[35 campos]
      → convertTypes:
          Datas: serial Excel (base 1899-12-30), M/D/YYYY, DD/MM/YYYY, ISO YYYY-MM-DD
          Números: remove ponto como separador de milhar, vírgula como decimal

  → Batchs de 100 registros
  → Supabase.upsert com onConflict: 'company_id,EmployeeID'
  → company_id injetado de req.session.user.company_id
  → Delete do arquivo temporário (sucesso ou erro)
  → Flash message com contagem de sucessos e erros
  → Redirect /dados
```

---

## Integração Power BI

```
GET /dashboard
  → dashboardController.index
  → dashboardService.getDashboardByCompany(company_id)
      → SELECT power_bi_workspace_id, power_bi_report_id FROM companies WHERE id = ?

  SE ambos os IDs presentes:
  → powerBIService.getAzureAccessToken()
      → POST {AZURE_AUTH_URL}/{AZURE_TENANT_ID}/oauth2/v2.0/token
      → grant_type: client_credentials
      → scope: POWER_BI_SCOPE
      → Token cacheado até expiração

  → powerBIService.getEmbedUrl({ workspaceId, reportId })
      → GET {POWER_BI_API_URL}/groups/{workspaceId}/reports/{reportId}
      → Retorna embedUrl

  → powerBIService.generateEmbedToken({ workspaceId, reportId })
      → POST .../reports/{reportId}/GenerateToken
      → Retorna token de curta duração

  → Render dashboard.ejs com { embedUrl, embedToken, reportId }
  → Frontend: powerbi-client.js CDN monta o iframe embedded
```

---

## Multi-tenancy

- Todo usuário tem `company_id` na tabela `usuarios`
- Todas as queries filtram por `req.session.user.company_id`
- Tabela `dados`: chave de upsert `(company_id, EmployeeID)` garante isolamento entre empresas
- Tabela `companies`: define workspace/relatório Power BI e limite de usuários por tenant

---

## Design System

| Token | Valor | Uso |
|-------|-------|-----|
| `--azul-petroleo` | `#01192B` | Cor primária, fundo do header |
| `--laranja` | `#EE6D07` | Acento, botões CTA |
| Font | Aeonik Pro | Todos os textos (hospedada em `/public/fonts/aeonik/`) |
| Landing page | Tailwind CSS CDN | Apenas na página pública |
| App pages | Bootstrap 5 | Todas as páginas autenticadas |
| Icons | Font Awesome 6 | Ícones globais |
| Alerts | SweetAlert2 | Modais de confirmação e feedback |

> Evitar os termos "BI" ou "dashboard" no copy da UI — usar "inteligência" ou "inteligência organizacional".

---

## Variáveis de Ambiente

```env
SUPABASE_URL=
SUPABASE_KEY=
SESSION_SECRET=
NODE_ENV=development
PORT=3000
AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=
POWER_BI_SCOPE=https://analysis.windows.net/powerbi/api/.default
POWER_BI_AUTH_URL=https://login.microsoftonline.com
POWER_BI_API_URL=https://api.powerbi.com/v1.0/myorg
```

---

## Comandos

```bash
npm run dev       # Servidor de desenvolvimento com nodemon (auto-restart)
npm start         # Servidor de produção
npm run migrate   # Executa migrations (src/migrations/migration.js)
```

---

## Dependências

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| express | ^5.1.0 | Framework web |
| @supabase/supabase-js | ^2.49.8 | Cliente Supabase/PostgreSQL |
| bcrypt | ^6.0.0 | Hash de senhas |
| express-session | ^1.18.1 | Gerenciamento de sessão |
| multer | ^2.0.2 | Upload de arquivos |
| xlsx | ^0.18.5 | Parsing de Excel |
| csv-parse | ^6.1.0 | Parsing de CSV |
| axios | ^1.13.2 | HTTP client (Power BI API) |
| nodemailer | ^7.0.12 | Envio de e-mails |
| uuid | ^11.1.0 | Geração de UUIDs |
| ejs | ^3.1.10 | Template engine |
| connect-flash | ^0.1.1 | Mensagens flash |
| dotenv | ^16.5.0 | Variáveis de ambiente |
| joi | ^17.13.3 | Validação (instalado, não enforçado nas rotas) |
| method-override | ^3.0.0 | Suporte a PUT/DELETE via POST |

---

## Bugs Conhecidos

| # | Arquivo | Problema | Fix |
|---|---------|----------|-----|
| 1 | `src/services/powerBIService.js` | Usa `export` (ES6) mas é importado com `require()` (CommonJS) | Substituir por `module.exports` |
| 2 | `src/views/pages/register.ejs` | `company_id` hardcoded no HTML | Tornar dinâmico ou remover campo do form público |
| 3 | `src/services/inviteService.js` | Link do convite hardcoded para `http://localhost:3000` | Usar variável de ambiente `BASE_URL` |
| 4 | `src/services/emailService.js` | Usa conta de teste Nodemailer | Configurar SMTP de produção via env vars |
