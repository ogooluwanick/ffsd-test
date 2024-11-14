import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
        {
                name: { type: String, required: true },
                email: { type: String, required: true, unique: true },
                password: { type: String, required: true },
                isVerified: { type: Boolean, default: false },
                verificationToken: String,
                verificationTokenExpiry: Date

        },
        {
                timestamps: true
        }
);

const UsersResult = mongoose.model('Users', userSchema);
export default UsersResult;