const User = require('../models/users');
const FriendRequest = require('../models/friendRequest');

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check relationship status
        // 1. Are they friends?
        const isFriend = user.friends.includes(currentUserId);

        // 2. Is there a pending request from me to them?
        const outgoingRequest = await FriendRequest.findOne({
            from: currentUserId,
            to: id,
            status: 'pending'
        });

        // 3. Is there a pending request from them to me?
        const incomingRequest = await FriendRequest.findOne({
            from: id,
            to: currentUserId,
            status: 'pending'
        });

        let status = 'none';
        if (isFriend) status = 'friends';
        else if (outgoingRequest) status = 'sent';
        else if (incomingRequest) status = 'received';

        res.json({
            user,
            status
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = getUserProfile;
