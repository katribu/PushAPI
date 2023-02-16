// Class that we use from the pgAdmin database
const { Pool } = require('pg')


// Irgen's pswd 'Heltnyttpassord2020' 
// Shahin's pswd: nedved12 
// Katrinas' pswd: '100759094'
const database = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PushDB',
    password: 'nedved12',
    port: 5432,
})


// Get a single user matched by email
async function getUserByEmail(email) {
    const result = await database.query(`
    SELECT *
    FROM users
    WHERE email = $1
    `, [email])

    return result.rows[0]
}


// Create a new user
async function createNewUser(name, email, password, username) {
    const result = await database.query(`
    INSERT INTO users 
        (name, email, password, username)
    VALUES 
        ($1, $2, $3, $4)
    RETURNING 
        *
    `, [name, email, password, username]);

    const newUser = result.rows[0];
    return newUser;
}


// Get all the notifications for one user matched by username
async function getNotificationsByUsername(username) {
    const result = await database.query(`
    SELECT
    users.name,
    users.email,
    users.username,
    users_notification_monitor.type,
    users_notification_monitor.data,
    users_notification_monitor.id
    FROM 
        users
    INNER JOIN users_notification_monitor ON
        users_notification_monitor.user_id = users.id
    WHERE
        users.username = $1
    `, [username]);
    return result.rows
}


// Create a new Remembr'all 
async function createNewRemembrall(type, data, user_id) {
    const result = await database.query(`
    INSERT INTO users_notification_monitor
        (type, data, user_id)
    VALUES 
        ($1, $2, $3)
    RETURNING 
        *
    `, [type, data, user_id]);

    const newRemembrall = result.rows[0];
    return newRemembrall;
}


// Delete a single Remembr'all matched by id
async function deleteNotification(id) {
    const result = await database.query(`
    DELETE FROM
    users_notification_monitor
    WHERE
    users_notification_monitor.id = $1
    RETURNING *
    `, [id]);

    const deleteResult = result.rows;
    return deleteResult;
}


module.exports = {
    getUserByEmail,
    createNewUser,
    getNotificationsByUsername,
    createNewRemembrall,
    deleteNotification
}






















