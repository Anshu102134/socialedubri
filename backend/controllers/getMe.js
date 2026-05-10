const User = require('../models/users');
const FriendRequest = require('../models/friendRequest');

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const pendingCount = await FriendRequest.countDocuments({ 
            to: req.user.id, 
            status: 'pending' 
        });

        res.json({
            ...user.toObject(),
            pendingCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = getMe;
