const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')


app.use(express.json());
app.use(cors());


const { getUserByEmail, createNewUser, getNotificationsByUsername, createNewRemembrall, deleteNotification, registerLastNotified, getNotificationInfoByID } = require('./database');
const { mailFunction } = require('./mailFunction');
const APP_SECRET = "This is our secret password 1234"
const PORT = 3333;


// POST request to database: creating a new user, saved to database
app.post('/signup', async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    const newUser = await createNewUser(name, email, password, username)
    res.json(`${newUser.name} has been created`)
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
})


// GET request to database: fetch all user notifications matched by username
app.get('/notifications', async (req, res) => {
  const token = req.headers['x-token']
  const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'))
  try {
    const userNotifications = await getNotificationsByUsername(payload.username)
    res.json(userNotifications)
  } catch (error) {
    res.json({ error: error.message })
  }
})


// DELETE request to database: deleting notification matched by id from database
app.delete('/notifications', async function (req, res) {
  const { id } = req.body;
  try{
    await deleteNotification(id);
    res.status(200).json({message: 'notification was deleted'});
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});


// POST request to database: login to app, and save webtoken to localstorage
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email)
    if (!user) {
      res.status(401).send({ error: 'Email Not Found' })
      return;
    }

    if (password !== user.password) {
      res.status(401).send({ error: 'Wrong Password' })
      return;
    }

    // First paramater in jwt.sign is the payload, which can be a string, or object with different properties.
    // Buffer.from encodes the secret password/string 
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username
    }, Buffer.from(APP_SECRET, 'base64'))

    res.json({ token });

  } catch (error) {
    res.status(500).send({ error: error.message })
  }
});


// POST request to database: verify user(by webtoken) and save user's Remembr'all in database
app.post('/setremembrall', async (req, res) => {
  const { type, data } = req.body;
  const token = req.headers['x-token']
  const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'))
  const user_id = payload.id;
  try {
    const newRemembrall = await createNewRemembrall(type, data, user_id)
    res.json(newRemembrall)
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
})


// POST request to database: creating an e-mail
app.post('/createmail', async (req, res) => {
  const { id } = req.body;

  try {
  const notificationInfo = await getNotificationInfoByID(id);
  const {chosenFriend, subject, message } = notificationInfo.data;

  if (!id) {
    res.status(401).send({ error: 'Email Not Found' })
    return;
  } 

  const createdMail = await mailFunction(chosenFriend, subject, message)
  res.json(createdMail);
} catch (error) {
  res.status(401).json({ error: error.message })
}
})


// PATCH request to database
app.patch('/lastnotified', async (req, res) => {
  const { id } = req.body;

/*   let timeStamp = new Date().toLocaleTimeString('nor', { hour: '2-digit', minute: '2-digit' }).slice(0, 5) */
 /*  const currentDate = new Date()
  const timeStamp = new Date(currentDate.getTime() + (60 * 60 * 1000)).toLocaleTimeString('nor', { hour: '2-digit', minute: '2-digit' }); */

  const timeStamp = new Date().getTime()

  try {
     await registerLastNotified(id, timeStamp)
     const lastNotifiedUpdate = await getNotificationInfoByID(id) 
     res.json(lastNotifiedUpdate)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})


// GET request to database: check if webtoken is valid
app.get('/session', async (req, res) => {
  const token = req.headers['x-token']
  try {
    const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'))
    res.json({ message: `You are logged in as ${payload.name}` })
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' })
  }
})


// Running the server
app.listen(PORT, () => {
  console.log(`Push app listening on port ${PORT}`);
});
