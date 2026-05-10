const express = require("express");
const router = express.Router();
const getPosts = require("../controllers/getPosts");   // ✅ must export a function
const { likePost } = require("../controllers/postController"); // ✅ must export likePost
const Post = require("../models/post"); // lowercase p is usually safer, but checking previous file it was "Post". Let's use capital to be safe. Actually, the file name is post.js, so "../models/post" is correct on Windows, but let's stick to what works.
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const Filter = require("bad-words");
const filter = new Filter();

// 📥 GET ALL POSTS
router.get("/", authMiddleware, getPosts);

// ✍️ CREATE POST
router.post("/", authMiddleware, upload.single("media"), async (req, res) => {
    try {
        let { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Post text is required" });
        }

        // Filter bad words
        text = filter.clean(text.trim());

        let mediaUrl = "";
        let mediaType = "";
        
        if (req.file) {
            mediaUrl = `/uploads/${req.file.filename}`;
            if (req.file.mimetype.startsWith('image/')) {
                mediaType = 'image';
            } else if (req.file.mimetype.startsWith('video/')) {
                mediaType = 'video';
            }
        }

        const newPost = new Post({
            user: req.user.id,
            text: text,
            mediaUrl: mediaUrl,
            mediaType: mediaType,
        });

        await newPost.save();
        const populatedPost = await Post.findById(newPost._id).populate("user", "name email profileImage");

        res.status(201).json({ message: "Post created successfully", post: populatedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error creating post" });
    }
});

// ❤️ LIKE POST
router.put("/:id/like", authMiddleware, likePost);

// 💬 ADD COMMENT
router.post("/:id/comment", authMiddleware, async (req, res) => {
    try {
        let { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment text is required" });
        }

        // Filter bad words
        text = filter.clean(text.trim());

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({ user: req.user.id, text: text });
        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate("user", "name email profileImage")
            .populate("comments.user", "name email profileImage");

        res.json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error adding comment" });
    }
});

// 🗑️ DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check ownership
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting post" });
    }
});

module.exports = router;
