const transport = require('../utils/email');
require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require("../../connection");
const jwt = require('jsonwebtoken');
const passwordJwt = require('../utils/passwordJwt');
const compilerHtml = require('../utils/compilerHtml');

const registerUser = async (req, res) => {
    const { nome, email, senha, tipo } = req.body

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ message: "Nome, E-mail, Senha e Tipo são obrigatórios" });
    }
    try {
        const checkEmail = await knex('usuarios').where({ email: email }).first();
        if (checkEmail) {
            return res.status(400).json({ message: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const newPassword = await bcrypt.hash(senha, 10);

        const user = await knex('usuarios').insert({ nome, email, senha: newPassword, tipo }).returning('*');

        const { senha: __, ...mirrorUser } = user[0];

        return res.status(201).json(mirrorUser);

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;
    // const arquivo = await fs.readFile('./src/templates/login.html');

    if (!email || !senha) {
        return res.status(400).json({ message: "E-mail e Senha são obrigatórios" })
    }
    try {
        const user = await knex('usuarios').where({ email: email }).first();

        if (!user) {
            return res.status(404).json({ message: 'E-mail ou Senha estão Incorreto' });
        }

        const validatePassword = await bcrypt.compare(senha, user.senha);
        if (!validatePassword) {
            return res.status(404).json({ message: 'E-mail ou Senha estão Incorreto' });
        }
        const token = jwt.sign({ id: user.id, nome: user.nome }, passwordJwt, { expiresIn: '8h' });
        const { id, nome } = user;
        const html = await compilerHtml('./src/templates/login.html');

        transport.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${nome} <${'email'} >`,
            subject: 'Acesso a conta',
            html,
        })

        return res.status(200).json({ usuario: { id, nome, email }, token })

    } catch (error) {
        console.log(error);
        return res.status(404).json(error.menssage);
    }
}

const listUsers = async (req, res) => {
    try {
        const users = await knex('usuarios').first();
        const { senha: __, ...formattedUser } = users;

        return res.json(formattedUser)
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const updateUser = async (req, res) => {
    const { nome, email, senha, tipo } = req.body

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ message: "Nome, E-mail, Senha e Tipo são obrigatórios" });
    }
    try {
        const checkEmail = await knex('usuarios').where({ email: email }).first();
        if (checkEmail) {
            return res.status(400).json({ message: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const newPassword = await bcrypt.hash(senha, 10);
        const updatedUser = await knex('usuarios').where({ id: req.usuario.id }).update({
            nome,
            email,
            senha: newPassword,
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

const welcome = async (req, res) => {
    return res.status(200).json('SEJA BEM VINDO, ACESSE NOSSO SITE PELO LINK www.ninacai.com.br');
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await knex('usuarios').where({ id }).first();

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const deleteUser = await knex('usuarios').where({ id }).del()

        if (!deleteUser) {
            return res.status(400).json({ message: "Usuário não foi excluido" });
        }

        return res.status(200).json({ message: 'Usuário excluido com sucesso' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login, registerUser, listUsers, updateUser, welcome, deleteUser
}