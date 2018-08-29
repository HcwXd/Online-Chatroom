const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

// GET /chatroom
router.get('/', checkLogin, function(req, res, next) {
    res.render('chatroom');
});

module.exports = router;
