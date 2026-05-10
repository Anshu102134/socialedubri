const User = require('../models/users');

const updateProfile = async (req, res) => {
    try {
        const { bio, name } = req.body;
        const userId = req.user?.id;
        console.log("Updating profile for user:", userId);
        console.log("Body:", req.body);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (bio !== undefined) user.bio = bio;
        if (name !== undefined) user.name = name;

        if (req.file) {
            user.profileImage = `/uploads/${req.file.filename}`;
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating profile" });
    }
};

module.exports = updateProfile;
