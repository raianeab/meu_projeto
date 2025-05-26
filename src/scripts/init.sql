create table usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo varchar(255) not null,
  telefone varchar(20),
  tipo_usuario varchar(20) not null check (tipo_usuario in ('organizador', 'participante', 'admin')),
  data_cadastro timestamp with time zone default now()
);

create table categorias (
  id serial primary key,
  nome_categoria varchar(100) not null,
  descricao text
);

create table eventos (
  id uuid primary key default gen_random_uuid(),
  titulo varchar(255) not null,
  descricao text,
  local varchar(255),
  data_inicio timestamp with time zone not null,
  data_fim timestamp with time zone not null,
  tipo_evento varchar(50) check (tipo_evento in ('palestra', 'workshop', 'conferência', 'online', 'presencial')),
  vagas_disponiveis integer,
  publico_alvo text,
  status varchar(20) default 'ativo' check (status in ('ativo', 'cancelado', 'encerrado')),
  data_criacao timestamp with time zone default now(),
  id_organizador uuid not null references usuarios(id) on delete cascade
);

create table eventos_categorias (
  id serial primary key,
  id_evento uuid not null references eventos(id) on delete cascade,
  id_categoria integer not null references categorias(id) on delete cascade
);

create table inscricoes (
  id uuid primary key default gen_random_uuid(),
  id_evento uuid not null references eventos(id) on delete cascade,
  id_usuario uuid not null references usuarios(id) on delete cascade,
  data_inscricao timestamp with time zone default now(),
  status varchar(20) default 'pendente' check (status in ('pendente', 'confirmada', 'cancelada')),
  certificado_emitido boolean default false
);

create table certificados (
  id serial primary key,
  id_inscricao uuid not null unique references inscricoes(id) on delete cascade,
  caminho_arquivo varchar(255) not null,
  data_emissao timestamp with time zone default now()
);

create table eventos_feedbacks (
  id serial primary key,
  id_evento uuid not null references eventos(id) on delete cascade,
  id_usuario uuid not null references usuarios(id) on delete cascade,
  avaliacao integer check (avaliacao between 1 and 5),
  comentario text,
  data_envio timestamp with time zone default now()
);
