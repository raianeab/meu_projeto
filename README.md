# Sistema de Gerenciamento de Eventos

## Estrutura do Projeto

```
├── src/                    # Código fonte do projeto
│   ├── config/            # Configurações do projeto
│   ├── controllers/       # Controladores da aplicação
│   ├── migrations/        # Scripts de migração do banco de dados
│   ├── models/           # Modelos de dados
│   ├── repositories/     # Camada de acesso a dados
│   ├── routes/           # Rotas da API
│   ├── scripts/          # Scripts utilitários
│   ├── services/         # Lógica de negócios
│   ├── views/            # Arquivos de visualização
│   └── server.js         # Arquivo principal da aplicação
├── assets/               # Arquivos estáticos
├── documentos/           # Documentação do projeto
├── node_modules/         # Dependências do projeto
├── .gitignore           # Arquivos ignorados pelo git
├── package.json         # Configurações do projeto
├── package-lock.json    # Lock file das dependências
└── README.md            # Este arquivo
```

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL
- Supabase

## Instalação

1. Clone o repositório
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados
```bash
npm run migrate
```

5. Inicie o servidor
```bash
npm start
```

## Documentação

A documentação completa da API está disponível em [docs.html](src/views/docs.html) e no wad.md .

## Endpoints

### Usuários
- GET /users - Listar usuários
- POST /users - Criar usuário
- PUT /users/:id - Atualizar usuário
- DELETE /users/:id - Deletar usuário

### Eventos
- GET /events - Listar eventos
- POST /events - Criar evento

### Categorias
- GET /categories - Listar categorias
- POST /categories - Criar categoria

### Inscrições
- GET /inscriptions - Listar inscrições
- POST /inscriptions - Criar inscrição

### Certificados
- GET /certificates - Listar certificados
- POST /certificates - Criar certificado

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
