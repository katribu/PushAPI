// Class that we use from the pgAdmin database
const { Pool } = require('pg')

const database = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PushDB',
    password: 'nedved12',
    port: 5432,
})

// Irgen's pswd 'Heltnyttpassord2020' 
// Shahin's pswd: nedved12 

async function getUsers() {
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

async function getUserByEmail(email) {
    const result = await database.query(`
    SELECT *
    FROM users
    WHERE email = $1
    `, [email])

    //result.rows = [{id:1,name:'Donald Trump',email:'trump@aol.com',password:'1234'}]
    return result.rows[0]
}

module.exports = {
    getUsers,
    getUserByEmail
}