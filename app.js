const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const SocketHandler = require('./socket/socketHandler');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || config.port;
const flash = require('connect-flash');
const cookieSession = require('cookie-session');

require('./models/User');
require('./models/Message');
const mongoose = require('mongoose');
const Users = mongoose.model('users');

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [config.cookieKey],
    })
);

io.on('connection', async (socket) => {
    socketHandler = new SocketHandler();
    socketHandler.connect();

    let connectUsername;
    socket.on('online', async (user) => {
        connectUsername = user;
        await Users.updateOne({ username: user }, { isOnline: true }).exec();
        socket.broadcast.emit('updateUserInfo');
    });

    socket.on('enterChatroom', async () => {
        const user = await socketHandler.getUsers();
        socket.emit('getUserInfo', user);
    });

    socket.on('enterConversation', async (currentUsername, chatUsername) => {
        const conversation = await socketHandler.getMessages(currentUsername, chatUsername);
        socket.emit('getConversationInfo', conversation);
    });

    socket.on('sendMessage', async (currentUsername, chatUsername, msgContent) => {
        await socketHandler.storeMessages(currentUsername, chatUsername, msgContent);

        const conversation = await socketHandler.getMessages(currentUsername, chatUsername);
        socket.emit('getConversationInfo', conversation);
        socket.broadcast.emit('newMessage');
    });

    socket.on('disconnect', () => {
        Users.updateOne({ username: connectUsername }, { isOnline: false }).exec();
        socket.broadcast.emit('updateUserInfo');
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(require('express-formidable')());

// Add three required variables to the template
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

routes(app);

server.listen(port, function() {
    console.log(`listening on port ${port}`);
});
