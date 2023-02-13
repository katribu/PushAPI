// Class that we use from the pgAdmin database
const { Pool } = require('pg')

const database = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'PushDB',
    password: 'Heltnyttpassord2020',
    port: 5432,
})

// Irgen's pswd 'Heltnyttpassord2020' 
// Shahin's pswd: nedved12 
// Katrinas' pswd: '100759094'

async function getUsers() {
    const result = await database.query(`
    SELECT 
        users.id,
        users.name,
        users.email,
        users.username
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

    return result.rows[0]
}

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

/* async function deleteNotification(username, id) {
    const result = await database.query(`
    SELECT
    users.id, 
    users.username,
	users_notification_monitor.data,
	users_notification_monitor.user_id,
	users_notification_monitor.id
    FROM 
        users
    JOIN users_notification_monitor ON
        users_notification_monitor.user_id = users.id
    WHERE
        users.username = $1
    RETURNING *
     `, [username]);
     
    const userNotifications = result.rows;

    const deleteResult = await database.query(`
    DELETE FROM
    users_notification_monitor
    WHERE
    users_notification_monitor.id = $2 && user_id = $1
    RETURNING *
    `, [userNotifications.user_id, id]);

    return 'Deleted successfully'
} */

// Delete notification
async function deleteNotification(id) {
    const deleteResult = await database.query(`
    DELETE FROM
    users_notification_monitor
    WHERE
    users_notification_monitor.id = $1
    RETURNING *
    `, [id]);

    return deleteResult;
}

module.exports = {
    getUsers,
    getUserByEmail,
    createNewUser,
    getNotificationsByUsername,
    createNewRemembrall,
    deleteNotification
}