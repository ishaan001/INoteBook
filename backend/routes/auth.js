const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser")

const JWT_SECRET = "B3th3Best@123";

// ROUTE 2 create a user using: POST "/api/auth/createUser" . No login required
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name with 5 character min")
      .trim()
      .notEmpty()
      .isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password with 8 character min")
      .notEmpty()
      .isLength({ min: 8 }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ errors: "Sorry, User with this Email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      return res.json({ authToken });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }

    //    .then(user => res.json(user))
    //    .catch(err => {console.log(err)
    //     res.json({error : "please enter unique value for email",
    //              message : err.message})});
  }
);

// ROUTE 2 Authenticate a user using: POST "/api/auth/login" . No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "please try to login with coreect credentials" });
      }

      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ errors: "please try to login with coreect credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      return res.json({ authToken });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3: get the login details of the user using "/api/auth/getUser". login required
router.post(
  "/getUser",
  fetchuser,
  async (req, res) => {
    try {
      let userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
