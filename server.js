const express = require("express");
const app = express();
const path = require("path");

const PORT = 3000 || process.env.PORT;

const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketio(server);
const { formatMessage } = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.emit("message", formatMessage("Admin", "Welcome to Chat"));
    socket.broadcast.to(user.room).emit("message", `${username} Connected....`);
  });
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.io);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(`BOT`, `${user.username} Left Chat`)
      );
    }
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log("App listening on port 3000!");
});
