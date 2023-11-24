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

//Available Routes
app.use('/v1/auth', require('./routes/auth.js'))
app.use('/v1/notes', require('./routes/notes.js'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})