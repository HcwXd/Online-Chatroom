module.exports = function(app) {
    app.use('/', require('./signinRoute'));
    app.use('/signup', require('./signupRoute'));
    app.use('/signin', require('./signinRoute'));
    app.use('/signout', require('./signoutRoute'));
    app.use('/chatroom', require('./chatroomRoute'));
};
