const express = require('express')
const user = require('../models/User')
const router = express.Router()

//create a user using: POST "/api/auth/" . Doesn't require auth
router.get('/', (req, res) => {
    const user1 = user(req.body)
    user1.save()
    res.send(req.body)

})

module.exports = router