const { getIO, onlineUsers } = require('../index');
const io = getIO();

module.exports = function friendRequestNotifier(from, to) {
  const receiverSocketId = onlineUsers.get(to);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('receiveFriendRequest', {
      from: from,
    });
  } else {
    console.log(`User ${to} is offline, storing notification in DB maybe`);
  }
};
