const { getIO, onlineUsers } = require('../index');
const io = getIO();

module.exports = function friendRequestAcceptNotifier(from, to) {
  const receiverSocketId = onlineUsers.get(to);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('FriendRequestAccepted', {
      from: from,
    });
  } else {
    console.log(`User ${to} is offline, storing notification in DB maybe`);
  }
};
