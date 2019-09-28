const http = require("http");
const WSServer = require("socket.io");
const WSAuth = require("socketio-auth");

const httpServer = http.createServer();
const io = new WSServer(httpServer);

httpServer.listen(3000, function onListenStarted() {
  console.log("Server started");
});

io.on("connection", function(socket) {
  socket.emit("news", { hello: "world" });
  socket.on("my other event", function(data) {
    console.log(data);
  });
});
