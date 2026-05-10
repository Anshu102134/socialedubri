const FriendRequest = require('../models/friendRequest');
const User = require('../models/users');

const acceptRequestHandler = async (req, res) => {
  try {
    const user_id = req.user.id; // ID of the user accepting the request
    const { from_id } = req.body; // ID of the user who sent the request

    // 1. Find the friend request
    const friendRequest = await FriendRequest.findOne({
      from: from_id,
      to: user_id,
      status: 'pending',
    });

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // 2. Mark the request as accepted
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // 3. Add each other to friends list (if not already friends)
    const sender = await User.findById(from_id);
    const receiver = await User.findById(user_id);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!sender.friends.includes(user_id)) {
      sender.friends.push(user_id);
    }

    if (!receiver.friends.includes(from_id)) {
      receiver.friends.push(from_id);
    }

    await sender.save();
    await receiver.save();

    return res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error('Error in acceptRequestHandler:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports=acceptRequestHandler;