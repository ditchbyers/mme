const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  let onlineUsers = [];

  io.on('connection', (socket) => {
    socket.on("join", (userId) => {
      if (!socket.rooms.has(userId)) {
        socket.join(userId);
        if (!onlineUsers.includes(userId)) {
          onlineUsers.push(userId);
        }
      }
      onlineUsers.forEach((user) => {
        io.to(user).emit("online-users-updated", onlineUsers);
      });
    });

    socket.on("send-new-message", (message) => {
      message.chat.users.forEach((user) => {
        io.to(user._id).emit("new-message-received", message);
      });
    });

    socket.on("typing", ({ chat, senderId, senderName }) => {
      chat.users.forEach((user) => {
        if (user._id !== senderId) {
          io.to(user._id).emit("typing", { chat, senderName });
        }
      });
    });

    socket.on("logout", (userId) => {
      socket.leave(userId);
      onlineUsers = onlineUsers.filter((u) => u !== userId);
      onlineUsers.forEach((user) => {
        io.to(user).emit("online-users-updated", onlineUsers);
      });
    });
  });

  expressApp.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Server with Socket.IO ready on http://localhost:${port}`);
  });
});
