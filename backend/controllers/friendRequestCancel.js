const FriendRequest = require('../models/friendRequest');
const cacelRequestHandler = async (req, res) => {
  try {
    const user_id = req.user.id; // ID of the user accepting the request
    const { from_id } = req.body; // ID of the user who sent the request
    const friendRequest = await FriendRequest.findOne({
          from: from_id,
          to: user_id,
          status: 'pending',
        });

    // 1. Find the friend request
    if (!friendRequest) {
      return res.status(404).json({ message: 'No pending request found' });
    }

    await friendRequest.deleteOne();

    return res.status(200).json({ message: 'Friend request deleted/rejected successfully' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
module.exports=cacelRequestHandler