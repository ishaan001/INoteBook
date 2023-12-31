const mongoose = require("mongoose");
const mongoURI =
  "mongodb://127.0.0.1:27017/inotebook?directConnection=true&tls=false&readPreference=primary";

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

module.exports = connectToMongo;
