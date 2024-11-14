import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
        {
                title: { type: String },
                content: { type: String },
                creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
        },
        {
                timestamps: true
        }
);

const PostMessage = mongoose.model('Posts', postSchema);
export default PostMessage;