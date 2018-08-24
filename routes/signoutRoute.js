const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = mongoose.model('users');
const checkLogin = require('../middlewares/check').checkLogin;

router.get('/', checkLogin, function(req, res, next) {
    Users.updateOne({ username: req.session.user.username }, { isOnline: false }).exec();
    req.session.user = null;
    req.flash('success', 'Sign out successfully');
    res.redirect('/signin');
});

module.exports = router;
