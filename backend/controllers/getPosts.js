const Post = require("../models/post");

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name email profileImage")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = getPosts;