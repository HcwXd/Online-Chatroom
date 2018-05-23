var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const SocketHander = require('./socket/socketHandler');

var app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

var friendStatus = [{
    name: "Andy Tsia",
    status: "away",
    notification: 0
  }, {
    name: "Kevin Huang",
    status: "away",
    notification: 0
  },
  {
    name: "Steve Jobs",
    status: "away",
    notification: 0
  },
  {
    name: "David Hu",
    status: "away",
    notification: 0
  },
  {
    name: "Mark Lee",
    status: "away",
    notification: 0
  }
];

let onlineCount = 0;

io.on('connection', async (socket) => {
  onlineCount++;
  console.log(`A user connected, now ${onlineCount} online`);

  io.emit("newConnect", `Now ${onlineCount} online`);

  socket.emit("renderFriendList", friendStatus);

  socketHander = new SocketHander();

  socketHander.connect();

  const history = await socketHander.getMessages();

  const socketid = socket.id;
  io.to(socketid).emit('history', history);

  socket.on("message", (obj) => {
    socketHander.storeMessages(obj);
    io.emit("message", obj);
  });

  socket.on('userLogIn', (userName, friendList) => {
    friendStatus = friendList;
    console.log('message: ' + userName);
    socket.emit("renderFriendList", friendStatus);
  });

  socket.on('loadHistory', (userName, chatName) => {
    io.to(socketid).emit('history', history);
  });

  socket.on("disconnect", (userName, friendList) => {
    onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1;
    console.log(`A user go out, now ${onlineCount} online`);
    console.log(userName);
  });

});

server.listen(3001);






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;