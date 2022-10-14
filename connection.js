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


// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//         host: "app-3037057d-5656-4249-84d4-22c1036e86db-do-user-12495400-0.b.db.ondigitalocean.com",
//         port: 25060,
//         username: "db-app-ninacai",
//         password: "AVNS_XoebvVgD9V55KlrnYr5",
//         database: "db-app-ninacai",
//         ssl: { rejectUnauthorized: false }
//     },
// })






module.exports = knex;

