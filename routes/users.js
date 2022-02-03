const mongoose = require('mongoose');
const User = require('../models/user.js');

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const passport = require('passport');

//LOGIN handle
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});

//REGISTER handle
router.post('/register', (req, res) => {

    const {name, email, password, password2} = req.body;

    let errors = [];//here all error messages will be stored

    //Checking
    if(!name || !email || !password || !password2) {
        errors.push({message: 'Please fill in all the fields'})
    }
    if(password !== password2) {
        errors.push({message: 'Passwords do not match'})
    } 
    if(password.length < 6) {
        errors.push({message: 'Password should be at least 6 characters'})
    } 
    if(errors.length > 0) {
        //if there is any mistake, re-render register.ejs and display errors to the user's screen
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        //if validation successful
        User.findOne({email : email}).exec((err,user)=>{
            console.log(user);
            if(user) {
                //if such a user exists
                errors.push({message: 'email is already registered'});
                res.render('register',{errors,name,email,password,password2});
            } else {
                //create a new user
                const newUser = new User({
                    name : name,
                    email : email,
                    password : password
                });

                //hash and make secure user's password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, 
                        (err, hash) => {
                            if(err) throw err;
                            //save password to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                            .then((value) => {
                                console.log(value);
                                req.flash('success_msg', 'You have now registered!');
                                //if there are no errors...redirect the user to login page
                                res.redirect('/users/login');
                        })
                        .catch(value => console.log(value))

                    })
                })
            }
        })
    }
});
router.post('/login', (req, res, next) => {
    //Handling the POST request to the login directory
    //here we tell passport where we want to use user authentication
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

//LOGOUT
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "You're logged out");
    res.redirect('/users/login');
});

module.exports = router;