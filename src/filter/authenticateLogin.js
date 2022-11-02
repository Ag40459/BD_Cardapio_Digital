const knex = require('../../connection');
const jwt = require('jsonwebtoken');
const passwordJwt = require('../utils/passwordJwt');

const authenticateLogin = async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization.split(' ');
    if (token === 'undefined') {
        return res.status(404).json({ message: 'Token Inválido' })
    }

    try {
        const checkToken = await jwt.verify(token, passwordJwt);
        const checkUser = await knex('user').where({ id: checkToken.id }).first();
        if (!checkUser) {
            return res.status(404).json({ message: 'Usuário ou Senha não identificado' })
        }
        // const { senha, ...user } = checkUser;
        req.usuario = checkUser;
        next();
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = authenticateLogin;
