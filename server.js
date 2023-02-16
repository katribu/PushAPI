const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')


app.use(express.json());
app.use(cors());


const { getUsers, getUserByEmail, createNewUser, getNotificationsByUsername, createNewRemembrall, deleteNotification, registerLastNotified, getNotificationInfoByID } = require('./database');
const { mailFunction } = require('./mailFunction');
const APP_SECRET = "This is our secret password 1234"
const PORT = 3333;

// Need to install npm package dotenv for the backend server that is gitignored. 


// Get users
app.get('/users', async (req, res) => {
  const users = await getUsers()
  res.json(users);
});


app.post('/signup', async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    const newUser = await createNewUser(name, email, password, username)
    res.json(`${newUser.name} has been created`)
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
})

// Get user notifications by user's username
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


// Delete notification
app.delete('/notifications', async function (req, res) {
  const { id } = req.body;
  try{
    await deleteNotification(id);
    res.status(200).json({message: 'notification was deleted'});
  } catch (error) {
    res.status(500).send({error: error.message});
  }
  
});




// Login
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

    // First paramater in sign is payload, which can be a string, or object with different properties.
    // Buffer.from encodes the secret password/string in a format called "base64"
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username
    }, Buffer.from(APP_SECRET, 'base64'))

    res.json({ token })

  } catch (error) {
    res.status(500).send({ error: error.message })
  }
});

// Create new remembrall
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

app.post('/createmail', async (req, res) => {
  const { id } = req.body;

  const notificationInfo = await getNotificationInfoByID(id);
  const {chosenFriend, subject, message } = notificationInfo.data

 /*  const user = await getUserByEmail(email, subject, mes) */

  if (!id) {
    res.status(401).send({ error: 'Email Not Found' })
    return;
  } 

  const createdMail = await mailFunction(chosenFriend, subject, message)
  res.json(createdMail)
})

app.patch('/lastnotified', async (req, res) => {
  const { id } = req.body;

/*   let timeStamp = new Date().toLocaleTimeString('nor', { hour: '2-digit', minute: '2-digit' }).slice(0, 5) */
  const currentDate = new Date()
  const timeStamp = new Date(currentDate.getTime() + (60 * 60 * 1000)).toLocaleTimeString('nor', { hour: '2-digit', minute: '2-digit' });

  try {
     await registerLastNotified(id, timeStamp)
     const lastNotifiedUpdate = await getNotificationInfoByID(id) 
     res.json(lastNotifiedUpdate)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})


// Checking if the token is valid
app.get('/session', async (req, res) => {
  const token = req.headers['x-token']
  try {
    const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'))
    res.json({ message: `You are logged in as ${payload.name}` })
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token' })
  }
})

app.listen(PORT, () => {
  console.log(`Push app listening on port ${PORT}`);
});
