// Assuming this is your main application file
const connectToMongo = require('./db');
const express = require('express')

async function startApp() {
  try {
    await connectToMongo();
    // Additional code to start your application
  } catch (error) {
    console.error('Error starting the application:', error.message);
  }
}

startApp();

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Ishaan')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})