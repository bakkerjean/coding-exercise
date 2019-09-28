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

const items = [{ name: "list1" }, { name: "list2" }];

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

  socket.on("cmd", cmd => command(socket, cmd));
});

function removeSocket(socket) {
  if (sockets[socket.id]) {
    delete sockets[socket.id];
  }
}

function authenticate(socket, data, cb) {
  console.log("authenticating");

  const login = JSON.parse(data);
  const authPassed = login.username === "user" && login.password === "pass";
  cb(null, authPassed);
}

function command(socket, cmd) {
  console.log("cmd:" + cmd.type);

  switch (cmd.type) {
    case "snap":
      items.forEach(i => socket.emit("event", { type: "itemadded", data: i }));
      break;
    case "additem":
      items.push(cmd.data);
      io.emit("event", { type: "itemadded", data: cmd.data });
      break;
    case "delitem":
      const index = items.findIndex(i => i.name === cmd.data.name);
      items.splice(index, 1);
      io.emit("event", { type: "itemdeleted", data: cmd.data.name });
      break;
  }
}
