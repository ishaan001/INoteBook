const express = require("express");
const user = require("../models/User");
const { body, validationResult } = require('express-validator');
const router = express.Router();

//create a user using: POST "/api/auth/" . Doesn't require auth
router.get("/",[
    body('name', 'Enter a valid name with 5 character min').trim().notEmpty().isLength({ min: 5 }),
    body('email','Enter a valid email').isEmail(),
    body('password', 'Enter a valid password with 8 character min').notEmpty().isLength({ min: 8 }),
] ,(req, res) => {
   // Finds the validation errors in this request and wraps them in an object with handy functions
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }

   user.create({
     name: req.body.name,
     password: req.body.password,
     email: req.body.email,
   }).then(user => res.json(user))
   .catch(err => {console.log(err)
    res.json({error : "please enter unique value for email", 
             message : err.message})});
});

module.exports = router;