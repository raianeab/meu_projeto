
# Plataforma de Eventos com Gerenciamento de Inscrições

## Descrição do Sistema

A presente **Plataforma de Eventos com Gerenciamento de Inscrições** é um sistema desenvolvido para gerenciar eventos e inscrições de participantes. Ele permite que organizadores criem e gerenciem eventos, e que os participantes se inscrevam, acompanhem o status de suas inscrições, recebam certificados e forneçam feedbacks. A plataforma também oferece funcionalidades de gerenciamento de categorias para eventos, além de um painel de controle para administradores.

## Estrutura de Pastas e Arquivos

A estrutura de pastas do projeto é organizada da seguinte forma:


```plaintext
meu_projeto/
│
├── config/                 # Arquivos de configuração (ex: conexão com banco)
│   └── db.js
├── controllers/           # Lógica de controle das requisições
│   └── userController.js
├── documentos/            # Documentação do projeto
│   └── wad.md
├── models/                # Definição de modelos de dados
│   └── userModel.js
├── routes/                # Definição das rotas
│   ├── frontRoutes.js
│   └── userRoutes.js
├── scripts/               # Scripts SQL e utilitários
│   ├── init.sql
│   └── runSQLScript.js
├── services/              # Regras de negócio e serviços
│   └── userService.js
├── tests/                 # Testes unitários
│   ├── userController.test.js
│   ├── userModel.test.js
│   ├── userRoutes.test.js
│   └── userService.test.js
├── views/                 # Diretório reservado para templates/views
├── .env                   # Variáveis de ambiente
├── .env.example           # Exemplo de configuração de ambiente
├── .gitignore             # Arquivo de ignore para Git
├── jest.config.js         # Configurações do Jest
├── package-lock.json      # Lockfile do npm
├── package.json           # Dependências e scripts do projeto
├── readme.md              # Documentação do projeto
├── rest.http              # Arquivo de testes de endpoints HTTP
├── runMigration.js        # Script de migração do banco
└── server.js              # Arquivo principal que inicializa o servidor


## Como Executar o Projeto Localmente


## 1. Clone o repositório
git clone https://github.com/raianeab/meu_projeto.git

cd repositorio

## 2. Instale as dependências
npm install

## 3. Configure as variáveis de ambiente
### Copie o arquivo .env.example e edite como necessário
cp .env.example .env

## 4. Execute o servidor
npm start

## O servidor estará disponível em http://localhost:3000



