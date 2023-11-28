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
//Changed from 3000 -> 5000 {because react app will run on 3000}
const port = 5000

//this is added so we can ass the body passing in the request
app.use(express.json())

//Available Routes
app.use('/v1/auth', require('./routes/auth.js'))
app.use('/v1/notes', require('./routes/notes.js'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})