create database "Heroku"
create database "DigitalOcean"

create table usuarios (
    id serial primary key,
    name text,
    email text unique,
    pass text,
	type text
);

create table categorias (
    id serial primary key,
    descricao text unique
);
insert into categorias (descricao) values 

('Açai'),
('Hamburger'), 


create table transacoes (
    id serial primary key,
    tipo text,
    descricao text ,
    /*transacoes_produto text references produtos(id),MODIFICAR NO BANCO DE DADOS*/
    valor integer,
    data date,
    categoria_id integer references categorias(id),
    usuario_id integer references usuarios(id)
)

create table produtos (
	id serial primary key,
  	titulo_produto text not null,
	categoria integer references categorias(id),
  	preco text not null,
  	descricao text
);
