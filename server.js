const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
app.use(express.json());
app.use(cors());



const { getUsers, getUserByEmail, createNewUser,getNotificationsByUsername, createNewRemembrall } = require('./database')
const APP_SECRET = "This is our secret password 1234"
const PORT = 3333;

// Need to install npm package dotenv for the backend server that is gitignored. 


//Creating an email sending function
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'rememberall23@hotmail.com',
    pass: 'Rememberall24'
  }
});


//Setting the mailoptions
var mailOptions = {
  from: 'rememberall23@hotmail.com',
  to: 'irgen_w.s@hotmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

//Function for sending the mail. 
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});






// Get users
app.get('/users', async (req, res) => {
  const users = await getUsers()
  res.json(users);
});


app.post('/signup', async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    const newUser = await createNewUser(name,email, password, username)
    res.json(`${newUser.name} has been created`)
  } catch(error) {
    res.status(401).send({error: error.message});
  }
  
})

//get user notifications by user's username
app.get('/notifications', async(req,res) =>{
  const token = req.headers['x-token']
  const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'))
  try{
    const userNotifications = await getNotificationsByUsername(payload.username)
    res.json(userNotifications)
  }catch(error){
    res.json({error:error.message})
  }
})


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
      username:user.username
    }, Buffer.from(APP_SECRET, 'base64'))

    res.json({ token })

  } catch (error) {
    res.status(500).send({ error: error.message })
  }
});

//Create new remembrall
app.post('/setremembrall', async (req, res) => {
  const {type, data} = req.body;
  const token = req.headers['x-token']
  const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'))
  const user_id = payload.id;
  try {
    const newRemembrall = await createNewRemembrall(type, data, user_id)
    res.json(newRemembrall)
  } catch(error) {
    res.status(401).send({error: error.message});
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
