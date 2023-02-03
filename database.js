const {Pool} = require('pg') // class that we use from the pgAdmin database

const database = new Pool({
    user:'postgres',
    host: 'localhost',
    database:'PushDB',
    password: 'Heltnyttpassord2020' || '100759094',
    port: 5432,
})

async function getUsers(){
    const result = await database.query(`
    SELECT 
        users.id,
        users.name,
        users.email
    FROM
        users
    `)
    return result.rows
}

module.exports = {
    getUsers
}