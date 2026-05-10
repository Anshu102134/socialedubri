const User = require('../models/users');
const FriendRequest = require('../models/friendRequest');

const unfriend = async (req, res) => {
    try {
        const { targetId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove from friends arrays
        user.friends = user.friends.filter(id => id.toString() !== targetId.toString());
        targetUser.friends = targetUser.friends.filter(id => id.toString() !== userId.toString());

        await user.save();
        await targetUser.save();

        // Also delete any existing accepted friend request between them
        await FriendRequest.deleteMany({
            $or: [
                { from: userId, to: targetId },
                { from: targetId, to: userId }
            ]
        });

        res.json({ message: "Unfriended successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error unfriending" });
    }
};

module.exports = unfriend;
