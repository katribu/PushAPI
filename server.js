const express = require('express');
const cors = require('cors');
const app = express();
const { getUsers } = require('./database');

app.use(express.json());
app.use(cors());

const irgen = 'Irgen';

const PORT = 3333;

app.get('/users', async (req, res) => {
  const users = await getUsers()
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Push app listening on port ${PORT}`);
});
