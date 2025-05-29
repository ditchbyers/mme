import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.SOCKET_HOSTNAME || "localhost"
const port = parseInt(process.env.PORT || "5000", 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handle)
  const io = new Server(httpServer)

  let onlineUsers: string[] = [];

  io.on('connection', (socket) => {
    socket.on("join", (userId) => {
      if (!socket.rooms.has(userId)) {
        socket.join(userId);
        if (!onlineUsers.includes(userId)) {
          onlineUsers.push(userId);
        }
      }
      onlineUsers.forEach((user: string) => {
        io.to(user).emit("online-users-updated", onlineUsers);
      });
    });

    socket.on("send-new-message", (message) => {
      message.chat.users.forEach((user: { _id: string }) => {
        io.to(user._id).emit("new-message-received", message);
      });
    });

    socket.on("typing", ({ chat, senderId, senderName }) => {
      chat.users.forEach((user: { _id: string }) => {
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

  httpServer.listen(port, () => {
    console.log(`Server running on http://${hostname}:${port}`)
  })
})