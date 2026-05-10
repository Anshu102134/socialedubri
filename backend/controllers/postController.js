const Post = require("../models/post");

const likePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Get user id safely (from auth middleware or fallback)
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not found / Unauthorized" });
        }

        // 🔥 CLEAN likes array (removes null/undefined values)
        post.likes = post.likes.filter(Boolean);

        // Check if already liked
        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId
        );

        if (alreadyLiked) {
            // ❌ Unlike
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId
            );
        } else {
            // ❤️ Like
            post.likes.push(userId);
        }

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate("user");

        return res.json({
            message: "Like updated successfully",
            updatedPost
        });

    } catch (err) {
        console.log("Like error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { likePost };