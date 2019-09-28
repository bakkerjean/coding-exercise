const http = require("http");
const WSServer = require("socket.io");
const WSAuth = require("socketio-auth");

const httpServer = http.createServer();
const io = new WSServer(httpServer);

httpServer.listen(3000);

const auth = new WSAuth(io, {
  authenticate: authenticate,
  timeout: 1000000
});

const sockets = {};

io.on("connection", socket => {
  console.log("connected");

  socket.on("disconnecting", reason => {
    console.log(reason);
    removeSocket(socket);
  });

  socket.on("disconnect", reason => {
    console.log(reason);
  });

  socket.on("error", err => {
    console.log(err);
  });
});

function removeSocket(socket) {
  if (sockets[socket.id]) {
    delete sockets[socket.id];
  }
}

function authenticate(socket, data, cb) {
  console.log("authenticating");
  const login = JSON.parse(data);
  const authPassed = login.userName === "user" && login.password === "pass";
  cb(null, authPassed);
}
