
const mongoose = require('mongoose');
const { Schema } = mongoose;
//refer : https://mongoosejs.com/docs/schematypes.html
// https://mongoosejs.com/docs/guide.html
const notesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('notes', notesSchema)
