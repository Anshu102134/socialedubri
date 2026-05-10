const Post = require("../models/post");

const createPost = async (req, res) => {
    try {

        const { text, image } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                message: "Post text is required",
            });
        }

        // 🔥 SAFE USER ID (from auth OR fallback)
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }

        const newPost = new Post({
            user: userId,
            text: text.trim(),
            image: image || "",
        });

        await newPost.save();

        const populatedPost = await Post.findById(newPost._id)
            .populate("user");

        res.status(201).json({
            message: "Post created successfully",
            post: populatedPost,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = createPost;