const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth.js")

//When user gets to the main page...server renders welcome page
router.get('/', (req, res) => {
    res.render('welcome');
})


//When user wants to register...server leads a user to register page
router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/dashboard', ensureAuthenticated,(req, res) => {
    res.render('dashboard', {
        user: req.user
    });
})

module.exports = router;