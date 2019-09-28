const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const WSAuth = require('socketio-auth');

server.listen(80);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

