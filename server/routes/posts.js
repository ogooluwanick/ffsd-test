import express from "express";
import expressAsyncHandler from "express-async-handler"
import mongoose from "mongoose";
import PostMessage from "../models/postMessages.js";
import { auth } from "../middle/auth.js";

const router = express.Router();

// Get posts(recents)
router.get("/", expressAsyncHandler(async (req, res) => {
        try {
                const posts = await PostMessage.find()
                        .sort({ createdAt: -1 })
                        .populate('creator', 'name email');
                res.status(200).json(posts);
        } catch (error) {
                res.status(500).json({ message: "Error fetching posts" });
        }
}));

// Create  post
router.post("/", auth, expressAsyncHandler(async (req, res) => {
        const { title, content } = req.body;

        try {
                const newPost = new PostMessage({
                        title,
                        content,
                        creator: req.userId
                });

                await newPost.save();

                // Populate creator info before sending response
                const populatedPost = await PostMessage.findById(newPost._id).populate('creator', 'name email');

                req.io.emit("newPost", populatedPost);
                res.status(201).json(populatedPost);
        } catch (error) {
                console.log("post create error: ", error)
                res.status(500).json({ message: "Error creating post" });
        }
}));

// Update post
router.put("/:id", auth, expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({ message: "No post with that id" });
        }

        try {
                const post = await PostMessage.findById(id);

                if (!post) {
                        return res.status(404).json({ message: "Post not found" });
                }

                // Check if user owns the post
                if (post.creator.toString() !== req.userId) {
                        return res.status(401).json({ message: "Not authorized" });
                }

                const updatedPost = await PostMessage.findByIdAndUpdate(
                        id,
                        { title, content },
                        { new: true }
                ).populate('creator', 'name email');

                res.json(updatedPost);
        } catch (error) {
                res.status(500).json({ message: "Error updating post" });
        }
}));

// Delete post
router.delete("/:id", auth, expressAsyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({ message: "No post with that id" });
        }

        try {
                const post = await PostMessage.findById(id);

                if (!post) {
                        return res.status(404).json({ message: "Post not found" });
                }

                // Check if user owns the post
                if (post.creator.toString() !== req.userId) {
                        return res.status(401).json({ message: "Not authorized" });
                }

                await PostMessage.findByIdAndRemove(id);
                res.json({ message: "Post deleted successfully" });
        } catch (error) {
                res.status(500).json({ message: "Error deleting post" });
        }
}));


export default router;
