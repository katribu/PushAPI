// Class that we use from the pgAdmin database
const { Pool } = require('pg')

const database = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PushDB',
    password: 'Heltnyttpassord2020',
    port: 5432,
})

// Irgen's pswd 'Heltnyttpassord2020' ||

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

async function createNewUser(name, email, password) {
    const result = await database.query(`
    INSERT INTO users 
        (name, email, password)
    VALUES 
        ($1, $2, $3)
    RETURNING 
        *
    `, [name, email, password]);

    const newUser = result.rows[0]; 
    return newUser; 
}

async function getNotificationsByEmail(email){
    const result = await database.query(`
    SELECT
    users.id,
    users.name,
    users.email,
    users_notification_monitor.type,
    users_notification_monitor.data
    FROM 
        users
    INNER JOIN users_notification_monitor ON
        users_notification_monitor.user_id = users.id
    WHERE
        users.email = $1
    `,[username]);
    return result.rows
}

module.exports = {
    getUsers,
    getUserByEmail, 
    createNewUser,
    getNotificationsByEmail
}