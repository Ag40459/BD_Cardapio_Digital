create database "Heroku"

create table user (
    id serial primary key,
    name text,
    email text unique,
    password text,
	phone text,
    cpf text,
    img text
);

