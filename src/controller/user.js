require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require("../../connection");
const jwt = require('jsonwebtoken');
const passwordJwt = require('../utils/passwordJwt');


const registerUser = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: "name, E-mail e Senha são obrigatórios" });
    }
    try {
        const checkEmail = await knex('user').where({ email: email }).first();
        if (checkEmail) {
            return res.status(400).json({ message: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const newPassword = await bcrypt.hash(password, 10);

        const user = await knex('user').insert({ name, email, password: newPassword }).returning('*');

        const { password: __, ...mirrorUser } = user[0];

        return res.status(201).json(mirrorUser);

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "E-mail e Senha são obrigatórios" })
    }
    try {
        const user = await knex('user').where({ email: email }).first();

        if (!user) {
            return res.status(404).json({ message: 'E-mail ou Senha estão Incorreto' });
        }

        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
            return res.status(404).json({ message: 'E-mail ou Senha estão Incorreto' });
        }
        const token = jwt.sign({ id: user.id, name: user.name }, passwordJwt, { expiresIn: '12h' });
        const { id, name } = user;

        return res.status(200).json({ usuario: { id, name, email }, token })

    } catch (error) {
        return res.status(404).json(error.menssage);
    }
}

const listUsers = async (req, res) => {
    try {
        const users = await knex('user').first();
        const { senha: __, ...formattedUser } = users;

        return res.json(formattedUser)
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const updateUser = async (req, res) => {
    const { name, email, password, tipo } = req.body

    if (!name || !email || !password || !tipo) {
        return res.status(400).json({ message: "Nome, E-mail, Senha e Tipo são obrigatórios" });
    }
    try {
        const checkEmail = await knex('user').where({ email: email }).first();
        if (checkEmail) {
            return res.status(400).json({ message: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const newPassword = await bcrypt.hash(password, 10);
        const updatedUser = await knex('user').where({ id: req.user.id }).update({
            name,
            email,
            password: newPassword,
            tipo
        }).returning('*');
        if (!updatedUser[0]) {
            return res.status(400).json({ message: "O usuario não foi atualizado" })
        }
        return res.status(200).json(updatedUser[0]);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await knex('user').where({ id }).first();

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const deleteUser = await knex('user').where({ id }).del()

        if (!deleteUser) {
            return res.status(400).json({ message: "Usuário não foi excluido" });
        }

        return res.status(200).json({ message: 'Usuário excluido com sucesso' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const welcome = async (req, res) => {
    return res.status(200).json('SEJA BEM VINDO, ESSA É A API DA EQUIPE "NOME EQUIPE". TURMA DE DESENVOLVIMENTO DE SOFTWARE 7 DA CUBOS ACADEMY');
}

module.exports = {
    registerUser, login, listUsers, updateUser, deleteUser,
    welcome
}