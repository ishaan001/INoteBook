const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const router = express.Router();

//create a user using: POST "/api/auth/createUser" . No login required
router.post("/createUser",[
    body('name', 'Enter a valid name with 5 character min').trim().notEmpty().isLength({ min: 5 }),
    body('email','Enter a valid email').isEmail(),
    body('password', 'Enter a valid password with 8 character min').notEmpty().isLength({ min: 8 }),
] , async (req, res) => {
   // Finds the validation errors in this request and wraps them in an object with handy functions
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
   
   try {
    
       let user = await User.findOne({email : req.body.email }); 
       if(user) {
           return res.status(400).json({ errors: 'Sorry, User with this Email already exists' });
        }
        user = await User.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        })
        return res.json({user : user.name})
    } catch (error) {
     console.log(error)
     return res.status(500).send('Some Error Occured')
    }
   
//    .then(user => res.json(user))
//    .catch(err => {console.log(err)
//     res.json({error : "please enter unique value for email", 
//              message : err.message})});
});

module.exports = router;