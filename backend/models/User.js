const mongoose = require("mongoose");
const { Schema } = mongoose;

//refer : https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/guide.html
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", userSchema);
