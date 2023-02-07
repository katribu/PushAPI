const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')

const { getUsers, getUserByEmail} = require('./database')

app.use(express.json());
app.use(cors());

const irgen = 'Irgen'


// need to implement database stuff in the server!!!!

const PORT = 3333;

// need to install npm pacakge dotenv for the backend server that is gitignored. 




//get Users//
app.get('/users', async (req, res) => {
  const users = await getUsers()
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Push app listening on port ${PORT}`);
});

//Login
app.post('/login', async (req,res)=>{
  const {email,password} = req.body;

  try{
      const user = await getUserByEmail(email)
      if(!user){
          res.status(401).send({error:'Email Not Found'})
          return;
      }

      if(password !== user.password){
          res.status(401).send({error: 'Wrong Password'})
          return;
      }

      // first paramater in sign is payload, which can be a string, or object with different properties.
      // Buffer.from encodes the secret password/string in a format called "base64"
      const token = jwt.sign({
          id: user.id,
          email: user.email,
          name:user.name
      },Buffer.from(APP_SECRET,'base64'))

      res.json({token})

  }catch(error){
      res.status(500).send({error:error.message})
  }

  
});

//Checking if the Token is valid
app.get('/session', async(req,res) =>{
  const token = req.headers['x-token']
  try{
      const payload = jwt.verify(token, Buffer.from(APP_SECRET,'base64'))
      res.json({message:`You are logged in as ${payload.name}`})
  }catch(error){
      res.status(401).json({error:'Invalid Token'})
  }
})
