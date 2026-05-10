const User = require('../models/users');

const searchFriend = async (req, res) => {
  try {
    const { q } = req.query;
    console.log("✅ Backend route hit with query:", q);

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    console.log("🔍 Searching in MongoDB...");
    const foundUsers = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    }).select("name email profileImage friends");
    const FriendRequest = require('../models/friendRequest');
    const currentUserId = req.user.id;

    const usersWithStatus = await Promise.all(foundUsers.map(async (user) => {
        // 1. Are they friends?
        const isFriend = user.friends?.includes(currentUserId);

        // 2. Outgoing?
        const outgoing = await FriendRequest.findOne({ from: currentUserId, to: user._id, status: 'pending' });

        // 3. Incoming?
        const incoming = await FriendRequest.findOne({ from: user._id, to: currentUserId, status: 'pending' });

        let status = 'none';
        if (isFriend) status = 'friends';
        else if (outgoing) status = 'sent';
        else if (incoming) status = 'received';

        return {
            ...user.toObject(),
            status
        };
    }));

    return res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error("❌ Search error:", error.message);
    console.error(error.stack);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = searchFriend;
