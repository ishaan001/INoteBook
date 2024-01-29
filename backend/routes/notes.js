const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE 1: GET all the notes using: GET "/api/auth/fetchallnotes". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

//ROUTE 2: Add a new  notes using: POST "/api/auth/addnote". login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid password with 5 character min")
      .notEmpty()
      .isLength({ min: 5 }),
    body("description", "Enter a valid password with 8 character min")
      .notEmpty()
      .isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3: update a note using: put "/api/auth/updatenote". login required
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Enter a valid password with 5 character min")
      .notEmpty()
      .isLength({ min: 5 }),
    body("description", "Enter a valid password with 8 character min")
      .notEmpty()
      .isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      //console.log('ID:', req.params.id);
      const { title, description, tag } = req.body;
      //new note object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }
      //console.log("newNote:", newNote);
      //find the note to be updated and then update it
      let note = await Notes.findById(req.params.id);
      //console.log('Note:', note);

      if (!note) {
        return res.status(404).send("not found");
      }

      if (note.user.toString() != req.user.id) {
        return res.status(401).send("not allowed");
      }
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      //console.log('Updated Note:', note);
      res.json({ note });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 4: delete a note using: delete "/api/auth/deletenote". login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {

    //find the note to be deleted and then delete it
    let note = await Notes.findById(req.params.id);
    //console.log('Note:', note);

    if(!note){
      return res.status(404).send("not found");
    }

    //allowed deleted only if user own the notes
    if(note.user.toString() != req.user.id) {
      return res.status(401).send("not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    //console.log('Updated Note:', note);
    res.json({"Success" : "This note has been deleted", note: note});
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
