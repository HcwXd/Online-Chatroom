const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Users = mongoose.model('users');
const checkLogin = require('../middlewares/check').checkLogin;

// GET /chatroom
router.get('/', checkLogin, function(req, res, next) {
    res.render('chatroom');
});

module.exports = router;
