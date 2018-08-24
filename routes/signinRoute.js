const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = mongoose.model('users');

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin');
});

// POST /signup
router.post('/', checkNotLogin, function(req, res, next) {
    console.log(req.fields);
    // res.redirect('/');
    let username = req.fields.username;
    let password = req.fields.password;

    // Examination
    try {
        if (!(username.length >= 1 && username.length <= 10)) {
            throw new Error('Username must longer than 1, shorter than 10');
        }
        if (!(password.length >= 1 && password.length <= 10)) {
            throw new Error('Password must longer than 1, shorter than 10');
        }
    } catch (e) {
        // Fail to signup
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    // encrypt password
    password = sha1(password);

    Users.findOne({ username: username }).then((existingUser) => {
        if (existingUser) {
            if (password === existingUser.password) {
                req.flash('success', 'Sign in successfully');
                req.session.user = { username, password };
                Users.updateOne({ username: req.session.user.username }, { isOnline: true }).exec();
                return res.redirect('/chatroom');
            } else {
                req.flash('error', 'Password incorrect');
                return res.redirect('/signin');
            }
        } else {
            req.flash('error', 'Username does not exist');
            return res.redirect('/signin');
        }
    });
});

module.exports = router;
