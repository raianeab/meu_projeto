# Web Application Document - Projeto Individual - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final._**

## E-winds

#### Autor do projeto: Raiane Araujo Brandão

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução (Semana 01)

A Plataforma de Gerenciamento de Eventos foi idealizada como uma solução prática e acessível para apoiar a organização e participação em eventos de diferentes naturezas — educacionais, profissionais, culturais ou comunitários. Seu principal objetivo é conectar organizadores e participantes de forma simples e eficiente. Por meio da plataforma, é possível criar eventos, gerenciar inscrições, acompanhar a participação dos usuários e emitir certificados de forma automatizada.
A ideia surgiu da observação de um problema recorrente: muitos eventos são organizados com o auxílio de ferramentas desconectadas, como planilhas, e-mails e formulários isolados. Esse modelo, além de pouco prático, dificulta o acompanhamento e a geração de dados úteis tanto para organizadores quanto para os participantes. A plataforma propõe um caminho mais integrado e moderno para resolver esse desafio.
Mais do que um sistema, o projeto representa um esforço por democratizar o acesso a ferramentas de gestão eficientes, principalmente para instituições e iniciativas que não possuem muitos recursos tecnológicos. A intenção é permitir que qualquer grupo, por menor que seja, possa organizar eventos com qualidade e oferecer uma boa experiência aos participantes.
Com uma interface clara e funcionalidades pensadas para o uso real, a plataforma busca promover o engajamento, a valorização do aprendizado contínuo e o fortalecimento de comunidades por meio de encontros bem organizados e acessíveis.

---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas (Semana 01 - opcional)

*Posicione aqui sua(s) Persona(s) em forma de texto markdown com imagens, ou como imagem de template preenchido. Atualize esta seção ao longo do módulo se necessário.*

### 2.2. User Stories (Semana 01 - opcional)

*Posicione aqui a lista de User Stories levantadas para o projeto. Siga o template de User Stories e utilize a referência USXX para numeração (US01, US02, US03, ...). Indique todas as User Stories mapeadas, mesmo aquelas que não forem implementadas ao longo do projeto. Não se esqueça de explicar o INVEST de 1 User Storie prioritária.*

---

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados  (Semana 3)

Diagrama do Modelo Lógico
O modelo lógico da Plataforma de Gerenciamento de Eventos a seguir foi estruturado para refletir os principais fluxos de informação entre usuários, eventos e ações relacionadas (inscrição, feedback, certificação). Ele foi projetado com atenção às relações entre entidades, garantindo integridade e escalabilidade.


<div align="center">
   <sub>Figura 1: Modelo Lógico do Banco de Dados</sub><br>
   <img src= "..\assets\modelo_logico.png" width="100%" 
   alt="Modelo Lógico do Banco de Dados"><br>
   <sup>Fonte: Autoral, 2025</sup>
 </div>

### Principais Entidades e Relacionamentos

**usuário (usuario)**  
Armazena dados de organizadores, participantes e administradores.

- Relação 1:N com **evento**: um usuário pode organizar vários eventos.  
- Relação 1:N com **inscricao**: um usuário pode se inscrever em diversos eventos.  
- Relação 1:N com **feedback_evento**: um usuário pode enviar feedback para vários eventos.

**evento**  
Contém as informações dos eventos criados na plataforma por organizadores e administradores.

- Relação N:1 com **usuario** (organizador/administrador).  
- Relação 1:N com **inscricao**: um evento pode ter várias inscrições.  
- Relação 1:N com **feedback_evento**: um evento pode receber múltiplos feedbacks.  
- Relação N:N com **categoria**, através da tabela intermediária **evento_categoria**.

**inscrição (inscricao)**  
Conecta as tabelas **usuario** e **evento**, representando a participação de um usuário em um evento.

- Relação N:1 com **usuario** e com **evento**.  
- Relação 1:1 com **certificado**: cada inscrição pode gerar um único certificado.

**certificado**  
Armazena os dados de emissão de certificados para participantes confirmados.

- Relação 1:1 com **inscricao**: garante que apenas uma certificação é emitida por inscrição.

**feedback_evento**  
Registra a avaliação de um evento feita por um usuário.

- Relação N:1 com **usuario** e com **evento**.

**categoria**  
Lista as categorias disponíveis para classificar os eventos.

- Relação N:N com **evento**, através da tabela intermediária **evento_categoria**.

**evento_categoria**  
Tabela intermediária que implementa a relação N:N entre **evento** e **categoria**.

- Um evento pode estar vinculado a várias categorias.  
- Uma categoria pode agrupar diversos eventos.


### [Modelo Físico](../scripts/init.sql)


### 3.1.1 BD e Models (Semana 5)

### 3.1.1 Models

O sistema implementa uma arquitetura baseada em Models para organizar e gerenciar as principais entidades e relacionamentos da aplicação. Esse modelo facilita a manutenção do sistema, promove separação de responsabilidades e torna a estrutura da aplicação mais clara e escalável.

 Cada model representa uma tabela no banco de dados e encapsula a lógica necessária para realizar operações de leitura e escrita.
Os seguintes Models para gerenciamento de dados foram implementados:

1. **Users (Usuários)**
   - Gerencia informações dos usuários do sistema
   - Atributos: id, nome_completo, tipo_usuario, data_criacao
   - Métodos: create, findAll, findById, update, delete

2. **Categories (Categorias)**
   - Gerencia as categorias de eventos
   - Atributos: id, nome_categoria, descricao
   - Métodos: create, findAll

3. **Events (Eventos)**
   - Gerencia os eventos do sistema
   - Atributos: id, titulo, descricao, local, data_inicio, data_fim, tipo_evento, vagas_disponiveis, publico_alvo, status, data_criacao, id_organizador
   - Métodos: create, findAll

4. **Inscriptions (Inscrições)**
   - Gerencia as inscrições em eventos
   - Atributos: id, id_evento, id_usuario, data_inscricao, status, certificado_emitido
   - Métodos: create, findAll

5. **Certificates (Certificados)**
   - Gerencia os certificados emitidos
   - Atributos: id, id_inscricao, caminho_arquivo, data_emissao
   - Métodos: create, findAll

6. **EventCategories (Categorias de Eventos)**
   - Gerencia a relação entre eventos e categorias
   - Atributos: id, id_evento, id_categoria
   - Métodos: create, findAll

7. **EventFeedbacks (Feedbacks de Eventos)**
   - Gerencia os feedbacks dos participantes sobre os eventos
   - Atributos: id, id_evento, id_usuario, avaliacao, comentario
   - Métodos: create, findAll


### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

<div align="center">
   <sub>Figura 1: Diagrama de arquitetura</sub><br>
   <img src= "..\assets\diagrama_de_arquitetura.png" width="100%" 
   alt="Modelo Lógico do Banco de Dados"><br>
   <sup>Fonte: Autoral, 2025</sup>
 </div>

*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

### 3.3. Wireframes (Semana 03 - opcional)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos (Semana 05 - opcional)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05 - opcional)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

A documentação completa da API está disponível em [docs.html](src/views/docs.html). Este arquivo contém:

- Lista de todos os endpoints disponíveis
- Métodos HTTP suportados
- Exemplos de requisições e respostas
- Formato dos dados esperados
- Exemplos de uso via curl

A documentação é interativa e pode ser visualizada em qualquer navegador web. 

### 3.7 Interface e Navegação (Semana 07)

O desenvolvimento do frontend do sistema foi realizado utilizando EJS (Embedded JavaScript) como template engine, Bootstrap 5 para o design responsivo e JavaScript para a interatividade. A estrutura do frontend foi organizada da seguinte forma:

#### 3.7.1 Estrutura de Arquivos

```
src/
├── views/
│   ├── pages/
│   │   ├── events.ejs
│   │   ├── users.ejs
│   │   ├── inscriptions.ejs
│   │   └── categories.ejs
│   └── partials/
│       ├── header.ejs
│       └── footer.ejs
```

#### 3.7.2 Componentes Principais

1. **Header (Navegação)**
   - Menu de navegação responsivo com links para todas as seções do sistema
   - Ícones intuitivos para melhor experiência do usuário
   - Design moderno e limpo
   ![Front-end](https://res.cloudinary.com/dt8qannja/image/upload/v1749223684/tela1_kxxdcw.png)
<sup> Fonte: Autoral, 2025</sup> </div> <br>


2. **Página de Eventos**
   - Lista de eventos em formato de cards
   - Filtros por categoria e status
   - Formulário modal para criação/edição de eventos
   - Visualização detalhada de cada evento
   
   ![Front-end](https://res.cloudinary.com/dt8qannja/image/upload/v1749223694/tela2_rl4pqe.png)
<sup> Fonte: Autoral, 2025</sup> </div> <br>



3. **Página de Usuários**
   - Tabela responsiva com lista de usuários
   - Filtros e busca
   - Formulário para adicionar/editar usuários
   - Gerenciamento de perfis
         ![Front-end](https://res.cloudinary.com/dt8qannja/image/upload/v1749223703/tela3_rqt3gn.png)
<sup> Fonte: Autoral, 2025</sup> </div> <br>


4. **Página de Inscrições**
   - Lista de inscrições com status visual
   - Formulário para criar novas inscrições
   - Edição rápida de status
   - Integração com eventos e usuários
         ![Front-end](https://res.cloudinary.com/dt8qannja/image/upload/v1749223713/tela4_bylrxm.png)
<sup> Fonte: Autoral, 2025</sup> </div> <br>

#### 3.7.3 Tecnologias Utilizadas

- **Node.js + Express**: Backend leve e escalável baseado em JavaScript  
- **PostgreSQL (Supabase)**: Banco de dados relacional com hospedagem e APIs integradas  
- **EJS**: Template engine para renderização dinâmica do frontend  
- **Bootstrap 5**: Framework CSS para design responsivo e componentes prontos  
- **DataTables**: Plugin para criação de tabelas interativas com ordenação e busca  
- **Font Awesome**: Biblioteca de ícones modernos e intuitivos  
- **JavaScript**: Linguagem de programação para interatividade e manipulação do DOM  
- **Joi**: Biblioteca para validação de dados no backend  
- **bcrypt**: Criptografia de senhas para autenticação segura  
- **Session-based Auth**: Gerenciamento de sessões para autenticação  
- **Vercel / Railway**: Plataformas de deploy do backend e frontend  
- **Supabase**: Hospedagem do banco de dados e gerenciamento de autenticação  

O frontend do sistema foi desenvolvido com foco em usabilidade, performance e manutenibilidade, utilizando as melhores práticas de desenvolvimento web moderno.


---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: https://youtu.be/BllS5E6PK6U*

Desenvolvi um sistema web completo de gerenciamento de eventos utilizando Node.js, Express, EJS como template engine, PostgreSQL via Supabase como banco de dados, e Bootstrap para a interface. Segue abaixo a atual estrutura do projeto

Arquitetura do Sistema
Estrutura de Pastas

meu_projeto/
├── src/
│   ├── config/          # Configuração do banco (Supabase)
│   ├── controllers/     # Lógica de negócio
│   ├── models/          # Schemas de validação (Joi)
│   ├── repositories/    # Camada de acesso a dados
│   ├── routes/          # Definição de rotas
│   ├── services/        # Serviços intermediários
│   ├── views/           # Templates EJS
│   ├── middlewares/     # Middlewares de autenticação
│   └── migrations/      # Scripts de migração do banco
├── assets/              # Imagens e recursos estáticos
└── documentos/          # Documentação do projeto

### Funcionalidades Implementadas

#### 1. Sistema de Autenticação
- Login e logout de usuários  
- Registro de novos usuários  
- Três tipos de usuário: **Admin**, **Organizador**, **Participante**  
- Criptografia de senhas com **bcrypt**  

#### 2. Gerenciamento de Usuários
- CRUD completo de usuários  
- Listagem com **DataTables**  
- Filtros e paginação  
- Validação de dados com **Joi**  

#### 3. Gerenciamento de Eventos
- Criação, edição e exclusão de eventos  
- Categorização de eventos  
- Controle de vagas disponíveis  
- Status dos eventos: **ativo**, **cancelado**, **encerrado**  
- Associação de eventos com organizadores  

#### 4. Sistema de Inscrições
- Inscrição de participantes em eventos  
- Controle de status da inscrição: **pendente**, **confirmada**, **cancelada**  
- Verificação automática de vagas disponíveis  

#### 5. Sistema de Certificados
- Geração automática de certificados para participantes  
- Controle de emissão  
- Armazenamento e gerenciamento dos arquivos de certificados  

#### 6. Sistema de Feedback
- Avaliação de eventos pelos participantes  
- Comentários e notas de **1 a 5**  
- Relatórios de satisfação com base nas avaliações  

#### 7. Categorias de Eventos
- CRUD completo de categorias  
- Associação de categorias com eventos  

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

Desenvolver este sistema foi uma experiência desafiadora e enriquecedora. Embora ainda existam aspectos a melhorar, acredito que consegui construir uma aplicação funcional e bem estruturada para o gerenciamento de eventos, com atenção à usabilidade, segurança e organização do código.

Durante o processo, enfrentei diversas dificuldades, como configurar corretamente o sistema de autenticação por sessões, lidar com validações de dados no backend e garantir a integridade das relações no banco de dados. Também tive desafios com a responsividade da interface e a clareza das mensagens exibidas aos usuários. Para superar esses obstáculos, busquei referências em sistemas reais, revisei conceitos, testei diferentes abordagens e, quando necessário, reescrevi partes do código com base nos aprendizados adquiridos.

Ainda há espaço para otimizações e aprimoramentos, tanto na experiência do usuário quanto na estrutura técnica da aplicação. A seguir, estão listados alguns pontos fortes, aspectos a melhorar e sugestões para o futuro:

#### Ideias para Melhorias Futuras
Painel personalizado para cada tipo de usuário (Admin, Organizador, Participante), com funcionalidades específicas e interface adaptada.

Envio automático de e-mails: confirmação de inscrição, emissão de certificados, etc.

Sistema de notificação interna (por exemplo, avisos de eventos próximos).

Relatórios mais detalhados com gráficos e dados de engajamento dos usuários.

Exportação de dados (CSV, PDF) para facilitar a gestão externa de informações.

API RESTful pública para integração com outros sistemas ou apps móveis.



## <a name="c5"></a>5. Referências

SYMPLA
SYMPLA. Plataforma de eventos e venda de ingressos online. Disponível em: https://www.sympla.com.br. Acesso em: 18 jun. 2025.

EVENTBRITE
EVENTBRITE. Encontre e organize eventos. Disponível em: https://www.eventbrite.com. Acesso em: 18 jun. 2025.

---
---