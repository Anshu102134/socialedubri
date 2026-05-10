const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },

    text: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        text: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },
        
        mediaUrl: {
            type: String,
            default: "",
        },
        
        mediaType: {
            type: String,
            default: "",
            enum: ["", "image", "video"]
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],

        comments: [commentSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);