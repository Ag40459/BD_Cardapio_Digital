require('dotenv').config()
const knex = require('knex')({
    client: process.env.CLIENT_DB,
    connection: {
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE_DB,
        ssl: { rejectUnauthorized: false }
    },
})


module.exports = knex;

