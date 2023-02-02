const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

const PORT = 3333;

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(PORT, () => {
    console.log(`Push app listening on port ${PORT}`)
  })
