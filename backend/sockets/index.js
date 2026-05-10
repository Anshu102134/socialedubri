// socket.js
const jwt = require('jsonwebtoken');
const cors = require("cors");
const { Server } = require('socket.io');
const onlineUsers = new Map();
let ioInstance = null;
function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  ioInstance.on('connection', (socket) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log(' No token provided');
      return socket.disconnect();
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const userId = user.id;

      console.log(` User ${userId} connected on socket ${socket.id}`);
      onlineUsers.set(userId, socket.id);

      socket.on('disconnect', () => {
        onlineUsers.delete(userId);
        console.log(` User ${userId} disconnected`);
      });
    } catch (err) {
      console.error(' Invalid token:', err.message);
      socket.disconnect();
    }
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) throw new Error("Socket.io not initialized yet!");
  return ioInstance;
}

module.exports = { initSocket, getIO, onlineUsers };
