const io = require("socket.io")(3000);
console.log("Server started...");

io.on("connection", (socket) => {
  let id = socket.id;
  console.log("New user:", id);
  socket.emit("chat-message", "HelloWorld");

  socket.on("selected-cell", (data) => {
    socket.broadcast.emit("selected-cell", data);
  });

  socket.on("end-game-victory", (data) => {
    socket.broadcast.emit("end-game-victory", data);
  });

  socket.on("end-game-draw", (data) => {
    socket.broadcast.emit("end-game-victory", data);
  });
});
