// controllers/friendRequestInbox.js
const FriendRequest = require('../models/friendRequest');
const User = require('../models/users');

const getPendingRequests = async (req, res) => {
  try {
    const user_id = req.user.id; // logged-in user

    const requests = await FriendRequest.find({ to: user_id, status: 'pending' })
      .populate('from', 'name email profileImage'); // populate sender info

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getPendingRequests;
