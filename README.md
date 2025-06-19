# Sistema de Gerenciamento de Eventos

Uma plataforma web completa para gerenciamento de eventos, desenvolvida com Node.js, Express, EJS e PostgreSQL via Supabase. O sistema permite criar eventos, gerenciar inscrições, acompanhar participação e emitir certificados de forma automatizada.

## Estrutura do Projeto

```
meu_projeto/
├── src/                    # Código fonte do projeto
│   ├── config/            # Configurações do projeto (Supabase)
│   ├── controllers/       # Controladores da aplicação
│   ├── migrations/        # Scripts de migração do banco de dados
│   ├── models/           # Modelos de dados e validação (Joi)
│   ├── repositories/     # Camada de acesso a dados
│   ├── routes/           # Rotas da API
│   ├── scripts/          # Scripts utilitários
│   ├── services/         # Lógica de negócios
│   ├── views/            # Arquivos de visualização (EJS)
│   │   ├── pages/        # Páginas principais
│   │   └── partials/     # Componentes reutilizáveis
│   ├── middlewares/      # Middlewares de autenticação
│   └── server.js         # Arquivo principal da aplicação
├── assets/               # Arquivos estáticos (imagens, diagramas)
├── documentos/           # Documentação do projeto (WAD)
├── node_modules/         # Dependências do projeto
├── .gitignore           # Arquivos ignorados pelo git
├── package.json         # Configurações do projeto
├── package-lock.json    # Lock file das dependências
└── README.md            # Este arquivo
```

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **EJS** - Template engine
- **Joi** - Validação de dados
- **bcrypt** - Criptografia de senhas
- **express-session** - Gerenciamento de sessões
- **connect-flash** - Mensagens flash
- **method-override** - Suporte a métodos HTTP

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **Supabase** - Plataforma de backend-as-a-service
- **pg** - Driver PostgreSQL para Node.js

### Frontend
- **Bootstrap 5** - Framework CSS responsivo
- **DataTables** - Tabelas interativas
- **JavaScript** - Interatividade do cliente

### Utilitários
- **dotenv** - Gerenciamento de variáveis de ambiente
- **uuid** - Geração de identificadores únicos
- **nodemon** - Reinicialização automática em desenvolvimento

## Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- Conta no Supabase
- Git

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
cd meu_projeto
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SESSION_SECRET=sua_chave_secreta_para_sessoes
NODE_ENV=development
PORT=3000
```

### 4. Configure o banco de dados
Execute o script de migração no Supabase:
1. Acesse o painel do Supabase (https://app.supabase.com)
2. Vá para "SQL Editor"
3. Execute o conteúdo do arquivo `src/migrations/setup_database.sql`

### 5. Inicie o servidor
```bash
npm start
```

Para desenvolvimento com reinicialização automática:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## Dependências Instaladas

### Dependências Principais
```json
{
  "@supabase/supabase-js": "^2.49.8",    // Cliente Supabase
  "bcrypt": "^6.0.0",                    // Criptografia de senhas
  "connect-flash": "^0.1.1",             // Mensagens flash
  "dotenv": "^16.5.0",                   // Variáveis de ambiente
  "ejs": "^3.1.10",                      // Template engine
  "express": "^5.1.0",                   // Framework web
  "express-session": "^1.18.1",          // Gerenciamento de sessões
  "joi": "^17.13.3",                     // Validação de dados
  "method-override": "^3.0.0",           // Métodos HTTP
  "pg": "^8.16.0",                       // Driver PostgreSQL
  "uuid": "^11.1.0"                      // Identificadores únicos
}
```

### Scripts Disponíveis
```bash
npm start          # Inicia o servidor em produção
npm run dev        # Inicia em modo desenvolvimento com nodemon
npm run migrate    # Executa as migrações do banco
```

## Funcionalidades

### 🔐 Sistema de Autenticação
- Login/Logout de usuários
- Registro de novos usuários
- Três tipos de usuário: Admin, Organizador, Participante
- Criptografia de senhas com bcrypt

### 👥 Gerenciamento de Usuários
- CRUD completo de usuários
- Listagem com DataTables
- Filtros e paginação
- Validação de dados

### 📅 Gerenciamento de Eventos
- Criação, edição, exclusão de eventos
- Categorização de eventos
- Controle de vagas disponíveis
- Status de eventos (ativo, cancelado, encerrado)
- Associação com organizadores

### 📝 Sistema de Inscrições
- Inscrição de participantes em eventos
- Controle de status (pendente, confirmada, cancelada)
- Verificação de vagas disponíveis

### 🏆 Sistema de Certificados
- Geração de certificados para participantes
- Controle de emissão
- Armazenamento de arquivos

### ⭐ Sistema de Feedback
- Avaliação de eventos pelos participantes
- Comentários e notas (1-5)
- Relatórios de satisfação

### 🏷️ Categorias de Eventos
- Gerenciamento de categorias
- Associação com eventos

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário
- `GET /auth/logout` - Logout

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/events/:id` - Buscar evento por ID
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Inscrições
- `GET /api/inscriptions` - Listar inscrições
- `POST /api/inscriptions` - Criar inscrição
- `PUT /api/inscriptions/:id` - Atualizar inscrição
- `DELETE /api/inscriptions/:id` - Deletar inscrição

### Certificados
- `GET /api/certificates` - Listar certificados
- `POST /api/certificates` - Criar certificado
- `PUT /api/certificates/:id` - Atualizar certificado
- `DELETE /api/certificates/:id` - Deletar certificado

### Feedbacks
- `GET /api/event-feedbacks` - Listar feedbacks
- `POST /api/event-feedbacks` - Criar feedback
- `PUT /api/event-feedbacks/:id` - Atualizar feedback
- `DELETE /api/event-feedbacks/:id` - Deletar feedback

## Documentação

A documentação completa da API está disponível no arquivo `documentos/wad.md`.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC.